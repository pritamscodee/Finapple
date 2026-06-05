import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
@UseGuards(AuthGuard('jwt'))
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('/:fileId')
  analyzeDocument(
    @Param('fileId', ParseIntPipe) fileId: number,
    @Req() req: any,
  ) {
    return this.analysisService.analyzeDocument(fileId, req.user.id);
  }
}
