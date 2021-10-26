import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { Item, ResData } from './dtos/res-data.dto';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getHello(): Promise<Observable<Item[]>> {
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

    const data = this.httpService
      .get(url)
      .pipe(map((res: AxiosResponse<ResData>) => res.data.data.item));

    return data;
  }
}
