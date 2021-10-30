import { Controller, Get, Post } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { AppService, IChartData } from './app.service';
import { Item } from './dtos/res-data.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(): Promise<IChartData> {
    return this.appService.getData();
  }
}
