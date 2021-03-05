import request from 'umi-request';

export async function getTags(): Promise<{data: string[]}> {
  return request('http://localhost:5000/broadcasts/user-tags');
}