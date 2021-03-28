import { AnalysisData } from './data.d';
import { getFakeChartData } from './_mock';

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request('/api/fake_analysis_chart_data');
}
