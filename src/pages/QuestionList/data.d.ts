import { FlowDb } from '../../../models/flows';

export type QuestionListItem = {
  id: string;
  activeAt?: boolean;
  alternateQuestions: Object[];
  answers: Object[];
  createdAt: string;
  createdBy: string;
  expireAt?: string;
  internal: boolean;
  isActive: boolean;
  keyword: string[];
  text: Object[];
  topic: string;
  updatedAt: string;
  updatedBy: string;
  answerFlow: FlowDb;
};

export type VariationListItem = {
  text: string;
};

export type QuestionListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type QuestionListData = {
  list: QuestionListItem[];
  pagination: Partial<QuestionListPagination>;
};

export type QuestionListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
