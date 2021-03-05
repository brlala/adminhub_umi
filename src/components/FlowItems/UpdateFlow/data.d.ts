export type TextComponentDataProps = {
componentKey: number;
componentData?: { text: StringObject };
onChange: (prevState: any) => void;
};

export type CustomComponentDataProps = {
    componentKey: number;
    componentData?: { function: string };
    onChange: (prevState: any) => void;
    disabled: boolean;
    };

export type AttachmentComponentDataProps = {
componentKey: number;
componentData:{ url: string, fileName?: string };
onChange: (prevState: any) => void;
};

export type Buttons = {
title: StringObject;
type: string;
url?: string;
payload?: {flowId: string; params?: string[]}
};

export type Templates = {
imageUrl?: {};
fileName?: string;
title?: StringObject;
subtitle?: StringObject;
buttons?: Buttons[];
closable?: boolean;
};

export type GenericTemplateComponentDataProps = {
componentKey: number;
componentData: { elements: Templates[] };
onChange: (prevState: any) => void;
current: any;
};

export type TemplateComponentDataProps = {
    componentKey: number;
    componentData: Templates;
    onChange: (prevState: any) => void;
    parentKey: number;
  };
  
export type ButtonTemplateComponentDataProps = {
componentKey: number;
componentData: {
    text: StringObject;
    buttons: Buttons[];
};
onChange: (prevState: any) => void;
};

export type FlowComponentDataProps = {
componentKey: number;
componentData: {
    flowId: string
};
onChange: (prevState: any) => void;
};

export type InputComponentDataProps = {
    componentKey: number;
    componentData: {
        inputName: string;
        inputType: string;
        customRegex: string;
        isTemporary: boolean;
        invalidMessage: string;
    };
    onChange: (prevState: any) => void;
    };

export type QrButtons = {
text: StringObject;
flowId?: string;
};

export type QuickReplyComponentDataProps = {
componentKey: number;
componentData: { quickReplies: QrButtons[] };
onChange: (prevState: any) => void;
};

