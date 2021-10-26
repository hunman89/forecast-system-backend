export interface ResData {
  condition: Condition[];
  data: Data;
}

export interface Condition {
  p_startday: Date;
  p_endday: Date;
  p_itemcategorycode: string;
  p_itemcode: string;
  p_kindcode: string;
  p_productrankcode: string;
  p_countycode: string;
  p_convert_kg_yn: string;
  p_key: string;
  p_id: string;
  p_returntype: string;
}

export interface Data {
  error_code: string;
  item: Item[];
}

export interface Item {
  itemname: string[];
  kindname: string[];
  countyname: string[];
  marketname: string[];
  yyyy: string;
  regday: string;
  price: string;
}
