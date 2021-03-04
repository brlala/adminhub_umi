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

export type FlowNew = {
  name?: string;
  topic?: string | null;
  flow: FlowItem[];
  platforms: string[];
  params?: string[];
  type: "storyboard" | "broadcast";
};

export type FlowItem = {
  data: FlowItemData;
  type: 
    | 'message'
    | 'image'
    | 'video'
    | 'file'
    | 'genericTemplate'
    | 'buttonTemplate'
    | 'flow'
    | 'custom'
    | 'input'
    | 'quickReplies';
};

export type FlowItemData = {
  buttons?: ButtonData[];
  text?: StringObject;
  url?: string;
  imageUrl?: string;
  function?: string;
  title?: StringObject;
  subtitle?: StringObject;
  elements?: FlowItemData[];
  flow?: FlowData;
  quickReplies?: QrButtonData[];
};

export type FlowEditableComponent = {
  title: string;
  key: string;
  id?: string;
  type: 
    | 'text'
    | 'image'
    | 'video'
    | 'file'
    | 'genericTemplate'
    | 'buttonTemplate'
    | 'flow'
    | 'custom'
    | 'input'
    | 'quickReplies';
  data: {
    buttons?: ButtonData[];
    text?: StringObject;
    url?: string;
    imageUrl?: string;
    title?: StringObject;
    subtitle?: StringObject;
    elements?: FlowItemData[];
    flow?: FlowData;
    quickReplies?: QrButtonData[];
  }
}

export type ButtonData = {
  type: string;
  title: StringObject;
  url?: string;
  payload?: {flowId?: string;}
};

export type QrButtonData = {
  text: StringObject;
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