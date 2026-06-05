import { Module } from '@nestjs/common';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CloudinaryModule],
  controllers: [VaultController],
  providers: [VaultService, JwtService],
})
export class VaultModule {}
