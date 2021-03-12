import { FlowNew } from 'models/flows';
import { request } from 'umi';
import type { FlowListParams, newQuestionItem, DropdownProps } from './data.d';

export async function queryFlows(params?: FlowListParams) {
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
  return request('http://localhost:5000/flows', {
    params,
  });
}

export async function removeFlows(params: { key: string[] }) {
  console.log(params);
  return request('http://localhost:5000/flows/', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function addFlow(data
): Promise<{}> {
  return request('http://localhost:5000/flows/', {
    method: 'post',
    data: data,
  });
}

export async function editFlow(data
  ): Promise<{}> {
    return request('http://localhost:5000/flows/', {
      method: 'put',
      data: data,
    });
  }

export async function getFlow(id: string,
  ): Promise<{data: FlowNew}> {
    return request(`http://localhost:5000/flows/${id}`, {
    });
  }
  