import { request } from 'umi';
import { QuestionListParams } from '@/pages/QuestionList/data';

export async function queryTopics() {
  const topics: string[] = await request('http://localhost:5000/questions/topics');
  let results: Record<string, { text: string }> = {};
  topics.forEach((topic) => (results[topic] = { text: topic }));
  return results;
}

export async function queryQuestionsFilter(field: string) {
  const questions: any = await request(`http://localhost:5000/questions/fields?field=${field}`);
  let results: Record<string, { text: string }> = {};
  questions.forEach((flow: any) => (results[flow.id] = { text: flow.text.EN }));
  return results;
}

export async function skipMessage(params: { messageId: string }) {
  console.log(params);
  return request('http://localhost:5000/gradings/', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function queryGradings(params?: QuestionListParams) {
  console.log(params);
  let { sorter, filter, ...searchParam } = params;
  if (sorter == undefined) {
    sorter = {};
  }
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
  return request('http://localhost:5000/gradings', {
    params,
  });
}

export async function updateMessageAnswer(params: { messageId: string }) {
  console.log(params);
  return request('http://localhost:5000/gradings/', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
