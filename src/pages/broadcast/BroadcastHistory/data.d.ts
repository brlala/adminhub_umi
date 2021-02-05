import { FlowComponentData } from '@/components/FlowItems/UpdateFlow';
import { FlowItem } from 'models/flows';

export interface Member {
  avatar?: string;
  username: string;
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

export interface BroadcastHistoryListItem {
  id: string;
  status: string;
  tags: string[];
  exclude: string[];
  sendToAll: boolean;
  sent: number;
  processed: number;
  total: number;
  sendAt: string;
  createdBy: Member;
}

export interface BroadcastHistoryItem {
  processed: number;
  id: string;
  flow: FlowItem[];
  status: string;
  tags: string[];
  exclude: string[];
  sendToAll: boolean;
  sent: number;
  total: number;
  sendAt: string;
  createdAt: string;
  createdBy: Member;
}
