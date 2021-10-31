import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChartDataModule } from './chart-data/chart-data.module';

@Module({
  imports: [ConfigModule.forRoot(), ChartDataModule],
})
export class AppModule {}
