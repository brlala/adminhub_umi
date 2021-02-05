import request from 'umi-request';
import { Params, BroadcastTemplateListItem, NewBroadcastTemplate } from './data.d';

export async function queryBroadcastTemplateList(
  params: Params,
): Promise<{ data: BroadcastTemplateListItem[] }> {
  return request('http://localhost:5000/broadcasts/templates', {params});
}


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
  })
  .catch(err => {
    throw err.data?.detail || "You Have encounterded an Error"
  });
}

export async function updateBroadcastTemplate(
  data: BroadcastTemplateListItem,
): Promise<{}> {
  console.log(data)
  return request(`http://localhost:5000/broadcasts/templates/${data.id}`, {
    method: 'put',
    data: data,
  });
}

export async function deleteBroadcastTemplate(
  data: BroadcastTemplateListItem,
): Promise<{}> {
  return request(`http://localhost:5000/broadcasts/templates/${data.id}`, {
    method: 'delete',
    data: data,
  });
}