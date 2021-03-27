import { FlowNew } from 'models/flows';
import request from 'umi-request';

export async function queryFlow(
  id: string,
): Promise<{ data: any }> {
  return request(`http://localhost:5000/history/flow/${id}`);
}

export async function sendBroadcast(
  data: FlowNew,
): Promise<{}> {
  return request('http://localhost:5000/broadcasts/send', {
    method: 'post',
    data: data,
  });
}

export async function getTags(
  data: [],
): Promise<[]> {
  return request('http://localhost:5000/broadcasts/user-tags');
}