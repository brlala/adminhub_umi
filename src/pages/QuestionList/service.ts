import { request } from 'umi';
import type { QuestionListParams, newQuestionItem, DropdownProps } from './data.d';

export async function queryQuestions(params?: QuestionListParams) {
  let { sorter, filter, ...searchParam } = params;
  let sortQuery: string = '';
  if (sorter == undefined) {
    sorter = {};
  }
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

export async function queryTopics() {
  const topics: string[] = await request('http://localhost:5000/questions/topics');
  let results: DropdownProps[] = [];
  topics.forEach((topic) => results.push({ label: topic, value: topic, id: topic }));
  return results;
}

export async function queryFlowsFilter(field: string) {
  const flows: any = await request(`http://localhost:5000/flows/fields?field=${field}`);
  let results: DropdownProps[] = [];
  flows.forEach((flow: any) => results.push({ label: flow.name, value: flow.name, id: flow.id }));
  return results;
}

export async function removeQuestion(params: { key: string[] }) {
  console.log(params);
  return request('http://localhost:5000/questions/', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function addQuestion(params: newQuestionItem) {
  return request('http://localhost:5000/questions/', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function editQuestion(params: newQuestionItem) {
  return request('http://localhost:5000/questions', {
    method: 'PUT',
    data: {
      ...params,
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
