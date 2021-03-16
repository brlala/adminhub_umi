export type ConversationMessage = {
  id: string;
  incomingMessageId?: string;
  isBroadcast: boolean;
  createdAt: string
  data: MessageData;
  type: 
    | 'message'
    | 'image'
    | 'video'
    | 'file'
    | 'genericTemplate'
    | 'buttonTemplate'
    | 'postback'
};

export type MessageData = {
  buttons?: ButtonData[];
  text?: string;
  url?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  elements?: MessageData[];
  quickReplies?: QrButtonData[];
};

export type ButtonData = {
  type: string;
  title: string;
  url?: string;
  payload?: {flowId?: string;}
};

export type QrButtonData = {
  title: string;
  payload: string;
};

export type FlowData = {
  name: string;
  flowId: string
  params: string[];
};

export type StringObject = {
  EN?: string;
  ZH?: string;
  TH?: string;
  BM?: string;
  ID?: string;
}