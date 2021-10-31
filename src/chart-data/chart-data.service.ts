import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { Item, ResData } from './dtos/res-data.dto';
import { ChartData } from './entities/chartData.entity';

let CHART_DATA: ChartData = null;

@Injectable()
export class ChartDataService {
  constructor(private configService: ConfigService) {}

  async getData(): Promise<string> {
    // 인증 key
    const p_cert_key = this.configService.get<string>('KAMIS_API_KEY');
    // 요정자 id
    const p_cert_id = 'hunman';
    // 리턴타입
    const p_returntype = 'json';
    // stert
    const p_startday = '2020-01-01';
    // end
    const p_endday = '2021-01-01';
    // 01:소매 02:도매
    const p_productclscode = '02';
    // 부류코드
    const p_itemcategorycode = '100';
    // 품종 코드
    const p_kindcode = '01';
    // 등급 코드
    const p_productrankcode = '04';
    //시군구 default = 전체
    //const p_countycode = '1101';
    // kg단위 환산여부 (y = 1kg 단위표시)
    const p_convert_kg_yn = 'N';
    //품목코드
    const p_itemcode = '111';
    const url = `http://www.kamis.or.kr/service/price/xml.do?action=periodProductList&p_startday=${p_startday}&p_endday=${p_endday}&p_productclscode=${p_productclscode}&p_itemcategorycode=${p_itemcategorycode}&p_itemcode=${p_itemcode}&p_kindcode=${p_kindcode}&p_productrankcode=${p_productrankcode}&p_convert_kg_yn=${p_convert_kg_yn}&p_cert_key=${p_cert_key}&p_cert_id=${p_cert_id}&p_returntype=${p_returntype}`;

    const {
      data: { item },
    }: ResData = await got.post(url).json();
    const result = this.parseJSON(item);
    CHART_DATA = this.predictData(result);
    return 'ok';
  }

  parseJSON(items: Item[]): ChartData {
    const labels: string[] = [];
    const kamisData: number[] = [];
    const predictedData: number[] = [];
    items.forEach((item) => {
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
    });
    const chartData: ChartData = { labels, kamisData, predictedData };
    return chartData;
  }

  predictData(chartData: ChartData): ChartData {
    const length = chartData.labels.length;
    const lastDay = new Date(Date.parse(chartData.labels[length - 1]));
    const lastPrice = chartData.kamisData[length - 1];
    for (let i = 0; i < 14; i++) {
      lastDay.setDate(lastDay.getDate() + 1);
      const day = `${lastDay.getFullYear()}-${lastDay.getMonth()}-${lastDay.getDate()}`;
      chartData.labels.push(day);
      chartData.kamisData.push(null);
      chartData.predictedData.push(lastPrice + 1000);
    }
    return chartData;
  }

  async chartData() {
    if (!CHART_DATA) {
      await this.getData();
    }
    return CHART_DATA;
  }
}
