import React from 'react';
import { FlowItem } from 'models/flows';
import { ButtonTemplateDisplayComponent, CustomDisplayComponent, FileDisplayComponent, FlowDisplayComponent, GenericTemplateDisplayComponent, ImageDisplayComponent, InputDisplayComponent, QuickReplyDisplayComponent, TextDisplayComponent, VideoDisplayComponent } from '@/components/FlowItems/ReadFlow';

export const renderDisplayComponent = (component: FlowItem, index: string, editMode: boolean) => {
    let renderedComponent;
    switch (component.type) {
        case 'message':
        renderedComponent = (
            <TextDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'image':
        renderedComponent = (
            <ImageDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'video':
        renderedComponent = (
            <VideoDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'file':
        renderedComponent = (
            <FileDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'genericTemplate':
        renderedComponent = (
            <GenericTemplateDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'buttonTemplate':
        renderedComponent = (
            <ButtonTemplateDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'flow':
        renderedComponent = (
            <FlowDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'custom':
        renderedComponent = (
            <CustomDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'input':
        renderedComponent = (
            <InputDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        case 'quickReplies':
        renderedComponent = (
            <QuickReplyDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        default:
        renderedComponent = <div key={index}>Cannot render {component}</div>;
    }
    console.log('editMode', component, editMode, !editMode && component.data.quickReplies)

    if (!editMode) {
        if (component.data.quickReplies) {
            return [
            renderedComponent,
            <QuickReplyDisplayComponent componentKey={index} componentData={component.data} />,
            ];
        }
    }
    return renderedComponent;
};
