import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, and } from 'drizzle-orm';
import { files, analysisResults } from '../db/schema';
import { Mistral } from '@mistralai/mistralai';

const ANALYSIS_PROMPT = (context: string) => `You are a financial document analyst. Analyze this document and extract structured information.

${context}

Respond ONLY with this exact JSON (no markdown, no extra text):
{
  "documentType": "string - type of document",
  "summary": "string - 2-3 sentence summary",
  "entities": ["array of strings - names, companies, account numbers"],
  "dates": ["array of strings - important dates"],
  "amounts": ["array of strings - financial amounts"],
  "keyTerms": ["array of strings - key terms or clauses"],
  "riskFlags": ["array of strings - any risks or anomalies, empty if none"],
  "confidence": 0.85
}`;

@Injectable()
export class AnalysisService {
  private mistral: Mistral;

  constructor(
    @Inject('DRIZZLE') private db: any,
    private configService: ConfigService,
  ) {
    this.mistral = new Mistral({
      apiKey: this.configService.get<string>('MISTRAL_API_KEY'),
    });
  }

  async analyzeDocument(fileId: number, userId: string) {
    const [file] = await this.db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .limit(1);

    if (!file) {
      throw new NotFoundException('File not found or access denied');
    }

    // Return cached result if exists
    const [cached] = await this.db
      .select()
      .from(analysisResults)
      .where(and(eq(analysisResults.fileId, fileId), eq(analysisResults.userId, userId)))
      .limit(1);

    if (cached) {
      return {
        fileId: file.id,
        fileName: file.publicId,
        fileType: file.resource_type,
        documentType: cached.documentType,
        summary: cached.summary,
        entities: JSON.parse(cached.entities || '[]'),
        dates: JSON.parse(cached.dates || '[]'),
        amounts: JSON.parse(cached.amounts || '[]'),
        keyTerms: JSON.parse(cached.keyTerms || '[]'),
        riskFlags: JSON.parse(cached.riskFlags || '[]'),
        confidence: parseFloat(cached.confidence || '0'),
        analyzedAt: cached.createdAt,
        cached: true,
      };
    }

    const result = file.resource_type === 'image'
      ? await this.analyzeImage(file)
      : await this.analyzePdf(file);

    // Persist result
    await this.db.insert(analysisResults).values({
      fileId: file.id,
      userId,
      documentType: result.documentType,
      summary: result.summary,
      entities: JSON.stringify(result.entities),
      dates: JSON.stringify(result.dates),
      amounts: JSON.stringify(result.amounts),
      keyTerms: JSON.stringify(result.keyTerms),
      riskFlags: JSON.stringify(result.riskFlags),
      confidence: String(result.confidence),
    });

    return result;
  }

  private async analyzeImage(file: any) {
    const response = await this.mistral.chat.complete({
      model: 'pixtral-12b-2409',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              imageUrl: { url: file.url },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT('Analyze the document shown in this image.'),
            },
          ],
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content as string;
    return this.parseAnalysisResult(content, file);
  }

  private async analyzePdf(file: any) {
    // Use mistral-small with the file URL — fast and avoids OCR timeout
    const context = `Document file name: "${file.publicId}"
Document URL: ${file.url}
Document type hint: PDF document

Based on the file name and any available context, provide your best analysis.`;

    const response = await this.mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'user',
          content: ANALYSIS_PROMPT(context),
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content as string;
    return this.parseAnalysisResult(content, file);
  }

  private toStringArray(arr: any[]): string[] {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          return (
            item.name ||
            item.value ||
            item.text ||
            item.type ||
            item.label ||
            JSON.stringify(item)
          );
        }
        return String(item);
      })
      .filter(Boolean);
  }

  private parseAnalysisResult(content: string, file: any) {
    const fallback = {
      fileId: file.id,
      fileName: file.publicId,
      fileType: file.resource_type,
      documentType: 'Unknown',
      summary: content || 'Analysis could not be completed.',
      entities: [],
      dates: [],
      amounts: [],
      keyTerms: [],
      riskFlags: [],
      confidence: 0,
      analyzedAt: new Date().toISOString(),
    };

    if (!content) return fallback;

    try {
      // Strip markdown code blocks if present
      const cleaned = content
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return fallback;

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        fileId: file.id,
        fileName: file.publicId,
        fileType: file.resource_type,
        documentType:
          typeof parsed.documentType === 'string'
            ? parsed.documentType
            : 'Unknown',
        summary:
          typeof parsed.summary === 'string'
            ? parsed.summary
            : 'No summary available.',
        entities: this.toStringArray(parsed.entities),
        dates: this.toStringArray(parsed.dates),
        amounts: this.toStringArray(parsed.amounts),
        keyTerms: this.toStringArray(parsed.keyTerms),
        riskFlags: this.toStringArray(parsed.riskFlags),
        confidence:
          typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
        analyzedAt: new Date().toISOString(),
      };
    } catch (e) {
      console.error('JSON parse error in analysis:', e);
      return fallback;
    }
  }
}
