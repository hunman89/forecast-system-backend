import { Controller, Get } from '@nestjs/common';
import { ChartDataService, IChartData } from './chart-data.service';

@Controller()
export class ChartDataController {
  constructor(private readonly chartDataService: ChartDataService) {}

  @Get()
  getData(): Promise<IChartData> {
    return this.chartDataService.getData();
  }
}
