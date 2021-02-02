export type FlowDb = {
  id: string;
  updatedAt: Date;
  name?: string;
  createdBy: string | null;
  updatedBy: string | null;
  topic: string | null;
  flow: FlowItem[];
  isActive: boolean;
  platforms: string[];
  createdAt: Date;
  params: string[];
  type: string;
};

export type FlowItem = {
  data: FlowItemData;
  type: string;
};

export type FlowItemData = {
  buttons?: ButtonData[];
  text?: StringObject;
  url?: string;
  image_url?: string;
  title?: StringObject;
  subtitle?: StringObject;
  elements?: FlowItemData[];
  flow?: FlowData;
  quick_replies?: QrButtonData[];
};

export type ButtonData = {
  type: string;
  title: StringObject;
  url?: string;
  payload?: string;
};

export type QrButtonData = {
  title: StringObject;
  payload: string;
};

export type FlowData = {
  name: string;
  flow_id: string
  params: string[];
};

export type StringObject = {
  EN?: string;
  ZH?: string;
  TH?: string;
  BM?: string;
  ID?: string;
}