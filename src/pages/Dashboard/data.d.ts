import { DataItem } from '@antv/g2plot/esm/interface/config';

export { DataItem };

export interface VisitDataType {
  x: string;
  y: number;
}

export interface SearchDataType {
  index: number;
  keyword: string;
  count: number;
  range: number;
  status: number;
}

export interface OfflineDataType {
  name: string;
  cvr: number;
}

export interface OfflineChartData {
  date: number;
  type: number;
  value: number;
}

export interface RadarData {
  name: string;
  label: string;
  value: number;
}

export interface AnalysisData {
  visitData: DataItem[];
  visitData2: DataItem[];
  salesData: DataItem[];
  searchData: DataItem[];
  offlineData: OfflineDataType[];
  offlineChartData: DataItem[];
  salesTypeData: DataItem[];
  salesTypeDataOnline: DataItem[];
  salesTypeDataOffline: DataItem[];
  radarData: RadarData[];
}


export interface SummaryBoxData {
  daily: number;
  monthlyTarget: {count: number, target: number};
  monthlyTrend: number;
  total: number;
  weeklyTarget: {count: number, target: number};
  weeklyTrend: number;
}

export interface LiquidData {
  total: {rate: number};
  monthly: {rate: number};
  weekly: {rate: number};
}

export interface UserTrendData{
  date: string; 
  newUser: number; 
  activeUser: number; 
  total: number;
}

export interface MessageTrendData{
  date: string; 
  postback: number; 
  message: number; 
  total: number;
}

export interface ConversationTrendData{
  date: string; 
  total: number;
}