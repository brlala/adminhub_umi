import request from 'umi-request';
import { Params, BroadcastHistoryListItem, BroadcastHistoryItem } from './data.d';

export async function queryBroadcastHistoryList(
  params: Params
): Promise<{ data: BroadcastHistoryListItem[] }> {
  return request('http://localhost:5000/broadcasts/history', {params});
}

export async function queryBroadcastHistory(
  id: string
): Promise<{ data: BroadcastHistoryItem }> {
  return request(`http://localhost:5000/broadcasts/history/${id}`);
}
