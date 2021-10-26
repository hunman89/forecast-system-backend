import { Controller, Get, Post } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { Item } from './dtos/res-data.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<Observable<Item[]>> {
    return this.appService.getHello();
  }
}
