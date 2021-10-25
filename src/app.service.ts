import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(apiKey: string): string {
    return apiKey;
  }
}
