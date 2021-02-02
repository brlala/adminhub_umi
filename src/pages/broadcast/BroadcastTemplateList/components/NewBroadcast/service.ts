import request from 'umi-request';
import { BroadcastTemplateListItem, NewBroadcastTemplate } from '../../data';

export async function queryBroadcastTemplate(
  id: string,
): Promise<{ data: BroadcastTemplateListItem }> {
  return request(`http://localhost:5000/broadcasts/templates/${id}`);
}

export async function addBroadcastTemplate(
  data: NewBroadcastTemplate,
): Promise<{}> {
  return request('http://localhost:5000/broadcasts/templates', {
    method: 'post',
    data: data,
  });
}

export async function getTags(
  data: [],
): Promise<[]> {
  return request('http://localhost:5000/broadcasts/user-tags');
}