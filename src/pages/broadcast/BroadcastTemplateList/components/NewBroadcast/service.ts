import { FlowNew } from 'models/flows';
import request from 'umi-request';
import { BroadcastTemplateListItem } from '../../data';

export async function queryBroadcastTemplate(
  id: string,
): Promise<{ data: BroadcastTemplateListItem }> {
  return request(`http://localhost:5000/broadcasts/templates/${id}`);
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