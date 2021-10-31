import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChartDataResolver } from './chart-data.resolver';
import { ChartDataService } from './chart-data.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ChartDataResolver, ChartDataService],
})
export class ChartDataModule {}
