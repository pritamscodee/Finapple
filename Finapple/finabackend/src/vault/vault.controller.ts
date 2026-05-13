import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Filebody } from 'src/types/file';
import { VaultService } from './vault.service';

@Controller('vault')
@UseGuards(AuthGuard('jwt'))
export class VaultController {

    constructor(
        private readonly cn: CloudinaryService,
        private readonly vaultService: VaultService,
    ) { }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        const userId = req.user.id;

        const result = await this.cn.uploadFile(file, userId);

        const fileBody: Filebody = {
            height: String(result.height),
            width: String(result.width),
            resource_type: result.resource_type,
            url: result.secure_url,
            page: result.pages ?? 1,
            publicId: result.public_id
        };

        const data = await this.vaultService.Uploadfile(fileBody, userId);

        return { message: data, url: result.secure_url };
    }

    @Get('/get')
    async Getfiles(@Req() req: any) {
        const userId = req.user.id;
        return this.vaultService.Getfiles(userId);
    }

    @Delete('/del/:id')
    async DelFiles(@Param('id') id: string) {
        return this. vaultService.DeleteFile(id)
    }
}
