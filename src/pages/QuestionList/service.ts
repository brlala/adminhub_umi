import { request } from 'umi';
import type { QuestionListParams, QuestionListItem } from './data.d';

export async function queryQuestion(params?: QuestionListParams) {
  let { sorter, filter, ...searchParam } = params;
  let sortQuery: string = '';
  if (Object.keys(sorter).length !== 0) {
    let temp: string[] = [];
    for (const [key, value] of Object.entries(sorter)) {
      if (value === 'ascend') {
        temp.push(`+${key}`);
      } else {
        temp.push(`-${key}`);
      }

      sortQuery = temp.join();
    }
    searchParam = { ...searchParam, sortBy: sortQuery };
  }
  params = { ...searchParam };

  // return request('/api/rule', {
  return request('http://localhost:5000/questions', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: QuestionListItem) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: QuestionListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
