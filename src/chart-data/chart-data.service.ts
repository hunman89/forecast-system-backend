import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import got from 'got';
import { Item, ResData } from './dtos/res-data.dto';
import { ChartData } from './entities/chartData.entity';

let CHART_DATA: ChartData = null;

@Injectable()
export class ChartDataService {
  constructor(private configService: ConfigService) {}
  private readonly logger = new Logger('ChartData');

  @Cron('0 0 9 * * *', { name: 'get data', timeZone: 'Asia/Seoul' })
  async getData(): Promise<string> {
    this.logger.log('Start get data from kamis');
    // 인증 key
    const p_cert_key = this.configService.get<string>('KAMIS_API_KEY');
    // 요정자 id
    const p_cert_id = this.configService.get<string>('KAMIS_ID');
    // 리턴타입
    const p_returntype = 'json';
    // stert
    const p_startday = this.getPastDay(366);
    // end
    const p_endday = this.getPastDay(1);
    // 01:소매 02:도매
    const p_productclscode = '01';
    // 부류코드
    const p_itemcategorycode = this.configService.get<string>('CLASS_CODE');
    // 품종 코드
    const p_kindcode = this.configService.get<string>('KIND_CODE');
    // 등급 코드
    const p_productrankcode = this.configService.get<string>('GRADE_CODE');
    //시군구 default = 전체
    const p_countrycode = '1101';
    // kg단위 환산여부 (y = 1kg 단위표시)
    const p_convert_kg_yn = 'N';
    //품목코드
    const p_itemcode = this.configService.get<string>('ITEM_CODE');
    const url = `http://www.kamis.or.kr/service/price/xml.do?action=periodProductList&p_startday=${p_startday}&p_endday=${p_endday}&p_productclscode=${p_productclscode}&p_itemcategorycode=${p_itemcategorycode}&p_itemcode=${p_itemcode}&p_kindcode=${p_kindcode}&p_productrankcode=${p_productrankcode}&p_convert_kg_yn=${p_convert_kg_yn}&p_cert_key=${p_cert_key}&p_cert_id=${p_cert_id}&p_returntype=${p_returntype}&p_countrycode=${p_countrycode}`;

    const {
      data: { item },
    }: ResData = await got.post(url).json();
    if (!item) {
      this.logger.error('Failed to get data from kamis');
    }
    this.logger.log('Success get data!');
    const result = this.parseJSON(item);
    if (!result) {
      this.logger.error('Failed to parse data');
    }
    this.logger.log('Success parse data!');
    CHART_DATA = this.predictData(result);
    if (!CHART_DATA) {
      this.logger.error('Failed to predict data');
    }
    this.logger.log('Success predict data!');
    return 'ok';
  }

  getPastDay(days: number): string {
    const day = new Date(Date.now());
    day.setDate(day.getDate() - days);
    return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
  }

  parseJSON(items: Item[]): ChartData {
    const labels: string[] = [];
    const kamisData: number[] = [];
    const predictedData: number[] = [];
    items.forEach((item) => {
      if (item.countyname == '평균') {
        const month = item.regday.split('/')[0];
        const day = item.regday.split('/')[1];
        const date = `${item.yyyy}-${month}-${day}`;
        const price = parseInt(item.price.replace(/,/g, ''));
        if (!price) {
          kamisData.push(null);
        } else {
          kamisData.push(price);
        }
        labels.push(date);
        predictedData.push(null);
      }
    });
    const chartData: ChartData = { labels, kamisData, predictedData };
    return chartData;
  }

  predictData(chartData: ChartData): ChartData {
    const length = chartData.labels.length;
    const lastDay = new Date(Date.parse(chartData.labels[length - 1]));

    let i = 1;
    let lastPrice: number = null;
    while (!lastPrice) {
      lastPrice = chartData.kamisData[length - i];
      i++;
    }

    for (let i = 0; i < 14; i++) {
      lastDay.setDate(lastDay.getDate() + 1);
      const day = `${lastDay.getFullYear()}-${
        lastDay.getMonth() + 1
      }-${lastDay.getDate()}`;
      chartData.labels.push(day);
      chartData.kamisData.push(null);
      chartData.predictedData.push(lastPrice + 1000);
    }
    return chartData;
  }

  async chartData() {
    if (!CHART_DATA) {
      this.logger.warn('There is no data! Try to get data...');
      await this.getData();
    }
    return CHART_DATA;
  }
}
