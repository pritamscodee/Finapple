import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { files } from '../db/schema';
import { Filebody } from '../types/file';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class VaultService {
  constructor(@Inject('DRIZZLE') private db: any) {}

  async Uploadfile(f: Filebody, userId: string) {
    const inserted = await this.db.insert(files).values({
      userId,
      height: f.height,
      width: f.width,
      resource_type: f.resource_type,
      url: f.url,
      page: f.page,
      publicId: f.publicId,
    });

    return { message: 'File inserted successfully' };
  }

  async Getfiles(userId: string) {
    return this.db.select().from(files).where(eq(files.userId, userId));
  }

  async DeleteFile(publicId: string, userId: string) {
    const [file] = await this.db
      .select()
      .from(files)
      .where(and(eq(files.publicId, publicId), eq(files.userId, userId)))
      .limit(1);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.userId !== userId) {
      throw new ForbiddenException('You do not own this file');
    }

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: file.resource_type === 'image' ? 'image' : 'raw',
      });
    } catch (err) {
      console.error('Cloudinary delete error:', err);
    }

    await this.db.delete(files).where(eq(files.publicId, publicId));

    return { message: 'File deleted successfully' };
  }
}
