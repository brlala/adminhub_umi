import { request } from 'umi';
import { AnalysisData } from './data.d';
import { getFakeChartData } from './_mock';

export async function demoChartData(): Promise<{ data: AnalysisData }> {
  // return {data: getFakeChartData};
  return request('/api/fake_analysis_chart_data');
}
