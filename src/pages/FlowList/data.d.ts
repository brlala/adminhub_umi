import { FlowDb } from '../../../models/flows';

export type FlowListItem = FlowDb;
//
// export type newQuestionItem = {
//   id?: string;
//   mainQuestion: string;
//   questionTime?: string[];
//   response: string;
//   responseType: string;
//   tags?: string[];
//   topic: string;
//   variations: string;
// };
//
// export type DropdownProps = {
//   value: string;
//   label: string;
//   key: string;
// };
//
// export type VariationListItem = {
//   text: string;
// };
//
// export type QuestionListPagination = {
//   total: number;
//   pageSize: number;
//   current: number;
// };
//
// export type QuestionListData = {
//   list: QuestionListItem[];
//   pagination: Partial<QuestionListPagination>;
// };
//
export type FlowListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter: Record<string, any[]> | {};
  sorter: Record<string, any> | {};
};

export type FlowList = {
  name: string;
  type:
    | 'message'
    | 'image'
    | 'video'
    | 'file'
    | 'genericTemplate'
    | 'buttonTemplate'
    | 'flow'
    | 'custom'
    | 'quickReplies';
};

export type DraggableListItems = {
  title: string;
  key: string;
  children?: DraggableListItems[];
  id: string;
};
