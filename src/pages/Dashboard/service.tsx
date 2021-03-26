import request from 'umi-request';
import { AnalysisData } from './data';
import { getFakeChartData } from './_mock';

export async function demoChartData(): Promise<{ data: AnalysisData }> {
  return {data: getFakeChartData};
  // return request('/api/fake_analysis_chart_data');
}
