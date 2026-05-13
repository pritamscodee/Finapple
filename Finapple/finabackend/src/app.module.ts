import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
;
import { VaultModule } from './vault/vault.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { VaultService } from './vault/vault.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DbModule,
        AuthModule,
     
        VaultModule,
        CloudinaryModule,
    ],
    controllers: [AppController],
    providers: [AppService, VaultService],
})
export class AppModule {}
