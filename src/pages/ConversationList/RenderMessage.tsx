import React from 'react';
import { MessageData } from 'models/messages';
import { ButtonTemplateDisplayComponent, PostbackDisplayComponent, FileDisplayComponent, GenericTemplateDisplayComponent, ImageDisplayComponent, QuickReplyDisplayComponent, TextDisplayComponent, VideoDisplayComponent } from '@/components/FlowItems/ReadMessage';

export const renderMessageComponent = (component: MessageData, type: string, index: string, isBot: boolean) => {
    let renderedComponent;
    switch (type) {
        case 'message':
        renderedComponent = (
            <TextDisplayComponent componentKey={index} componentData={component} isBot={isBot}/>
        );
        break;
        case 'postback':
        renderedComponent = (
            <PostbackDisplayComponent componentKey={index} componentData={component} />
        );
        break;
        case 'image':
        renderedComponent = (
            <ImageDisplayComponent componentKey={index} componentData={component} />
        );
        break;
        case 'video':
        renderedComponent = (
            <VideoDisplayComponent componentKey={index} componentData={component} />
        );
        break;
        case 'file':
        renderedComponent = (
            <FileDisplayComponent componentKey={index} componentData={component} />
        );
        break;
        case 'genericTemplate':
        renderedComponent = (
            <GenericTemplateDisplayComponent componentKey={index} componentData={component} />
        );
        break;
        case 'buttonTemplate':
        renderedComponent = (
            <ButtonTemplateDisplayComponent componentKey={index} componentData={component} />
        );
        break;
        case 'quickReplies':
        renderedComponent = (
            <QuickReplyDisplayComponent componentKey={index} componentData={component} />
        );
        break;
        default:
        renderedComponent = <div key={index}>Cannot render {component}</div>;
    }
    return renderedComponent;
};
