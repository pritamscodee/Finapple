import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { VaultModule } from './vault/vault.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AnalysisModule } from './analysis/analysis.module';
import { WalletModule } from './wallet/wallet.module';
import { BudgetModule } from './budget/budget.module';
import { SavingsModule } from './savings/savings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    VaultModule,
    CloudinaryModule,
    AnalysisModule,
    WalletModule,
    BudgetModule,
    SavingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
