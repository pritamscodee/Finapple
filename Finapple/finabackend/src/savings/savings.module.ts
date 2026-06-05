import { Module } from '@nestjs/common';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [SavingsController],
  providers: [SavingsService],
})
export class SavingsModule {}
