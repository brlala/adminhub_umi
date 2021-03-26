import request from 'umi-request';
import type { ConversationParams } from './data.d';

export async function queryConversationsUsers(params: ConversationParams) {
  return request('http://localhost:5000/conversations/', { params: params, getResponse: true });
}

export async function queryConversations(params: ConversationParams) {
  return request('http://localhost:5000/conversations/messages/', {
    params: params,
    getResponse: true,
  });
}

export async function queryConversation(convoId: string|null, params: ConversationParams) {
  if (convoId)
    return request(`http://localhost:5000/conversations/convos/${convoId}`, {
      params: params,
      getResponse: true,
    });
  return {}
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

export async function patchUser(userId: string, tags: string[], note: string) {
  return request(`http://localhost:5000/botuser/${userId}`, {
    data: { tags, note },
    method: 'patch',
  });
}
