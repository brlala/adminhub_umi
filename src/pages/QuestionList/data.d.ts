export type QuestionListItem = {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
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
