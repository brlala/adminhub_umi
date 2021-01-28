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
  buttons?: Object;
  text?: Object;
};
