import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
    async uploadFile(
        file: Express.Multer.File,
        userId: string,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const isPdf = file.mimetype === 'application/pdf';
            const originalName = path.parse(file.originalname).name; // filename without extension

            const upload = cloudinary.uploader.upload_stream(
                {
                    resource_type: isPdf ? 'raw' : 'image',
                    public_id: `${userId}/${originalName}_${Date.now()}`, // unique per user
                    use_filename: false,
                    unique_filename: false,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('No result from Cloudinary'));
                    resolve(result);
                },
            );

            Readable.from(file.buffer).pipe(upload);
        });
    }
}
