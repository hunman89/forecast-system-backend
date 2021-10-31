import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChartDataController } from './chart-data.controller';
import { ChartDataService } from './chart-data.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ChartDataController],
  providers: [ChartDataService],
})
export class ChartDataModule {}
