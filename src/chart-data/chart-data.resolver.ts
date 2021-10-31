import { Controller, Get } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChartDataService } from './chart-data.service';
import { ChartData } from './entities/chartData.entity';

@Resolver((of) => ChartData)
export class ChartDataResolver {
  constructor(private readonly chartDataService: ChartDataService) {}

  @Get()
  getData(): Promise<string> {
    return this.chartDataService.getData();
  }

  @Query((returns) => ChartData)
  chartData(): Promise<ChartData> {
    return this.chartDataService.chartData();
  }
}
