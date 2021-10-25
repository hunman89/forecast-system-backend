import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  getHello(): Observable<AxiosResponse<any, any>> {
    // 인증 key
    const p_cert_key = this.configService.get<string>('KAMIS_API_KEY');
    // 요정자 id
    const p_cert_id = 'hunman';
    // 리턴타입
    const p_returntype = 'json';
    // 연도
    const p_yyyy = '2021';
    // 기간
    const p_period = '3';
    // 부류코드
    const p_itemcategorycode = '100';
    // 품종 코드
    const p_kindcode = '01';
    // 등급
    const p_graderank = '2';
    //시군구
    const p_countycode = '1101';
    // kg단위 환산여부
    const p_convert_kg_yn = 'N';
    //품목코드
    const p_itemcode = '111';

    const data = this.httpService
      .post(
        `https://www.kamis.or.kr/service/price/xml.do?action=monthlySalesList&p_yyyy=${p_yyyy}&p_period=${p_period}&p_itemcategorycode=${p_itemcategorycode}&p_itemcode=${p_itemcode}&p_kindcode=${p_kindcode}&p_graderank=${p_graderank}&p_countycode=${p_countycode}&p_convert_kg_yn=${p_convert_kg_yn}&p_cert_key=${p_cert_key}&p_cert_id=${p_cert_id}&p_returntype=${p_returntype}`,
      )
      .pipe(map((res) => res.data));
    return data;
  }
}
