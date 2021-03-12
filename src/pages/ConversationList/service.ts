import { request } from 'umi';
import type { DropdownProps, ConversationParams } from './data.d';

export async function queryConversationsUsers(params: ConversationParams) {
  return request('http://localhost:5000/conversations/', { params: params, getResponse: true });
}

export async function queryConversations(params: ConversationParams) {
  return request('http://localhost:5000/conversations/messages/', {
    params: params,
    getResponse: true,
  });
}

export async function queryMessages(userId: string, params: ConversationParams) {
  return request(`http://localhost:5000/conversations/users/${userId}`, {
    params: params,
    getResponse: true,
  });
}

export async function queryCurrent(userId: string) {
  return request(`http://localhost:5000/botuser/${userId}`, { getResponse: true });
}

export async function patchUserTags(userId: string, tags: string[]) {
  return request(`http://localhost:5000/botuser/${userId}`, {
    params: { tags: tags },
    method: 'patch',
  });
}

export async function queryTopics() {
  const topics: string[] = await request('http://localhost:5000/questions/topics');
  let results: DropdownProps[] = [];
  topics.forEach((topic) => results.push({ label: topic, value: topic, key: topic }));
  return results;
}

export async function queryFlowsFilter(field: string) {
  const flows: any = await request(`http://localhost:5000/flows/fields?field=${field}`);
  let results: DropdownProps[] = [];
  flows.forEach((flow: any) => results.push({ label: flow.name, value: flow.id, key: flow.id }));
  return results;
}
