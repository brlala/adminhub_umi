import { FlowComponentData } from "@/components/FlowItems/UpdateFlow";
import { FlowListItem } from "@/pages/FlowList/data";
import { NewFormProps } from "@/pages/QuestionList/components/UpdateForm";

export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface Params {
  type?: string[];
}


export interface BroadcastTemplateComponent {
  name: string;
  key: string;
}


export interface NewBroadcastTemplate {
  id?: string;
  name: string;
  flow: string[];
  platforms?: string[];
}

export interface NewBroadcastEntry {
  id?: string;
  name: string;
  flow: NewFlow[];
  tags: string[];
  platforms?: string[];
}

export interface BroadcastTemplateListItem {
  id: string;
  name: string;
  flow: string[];
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  platforms: string[];
  updatedAt: string;
  updatedBy: string;
}

export const componentsList = [
  { name: 'Text', key: 'text' },
  { name: 'Image', key: 'image' },
  { name: 'Generic Template', key: 'genericTemplate' },
  { name: 'Button Template', key: 'buttonTemplate' },
  { name: 'Flow', key: 'flow' },
];
