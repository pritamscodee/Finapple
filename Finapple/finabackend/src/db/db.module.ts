import { Global, Module } from '@nestjs/common';
import { DbProvider } from './db.provider';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [DbProvider, ConfigService],
  exports: [DbProvider],
})
export class DbModule {}
