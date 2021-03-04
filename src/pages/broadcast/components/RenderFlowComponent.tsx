import React from 'react';
import { FlowItem } from 'models/flows';
import { ButtonTemplateDisplayComponent, CustomDisplayComponent, GenericTemplateDisplayComponent, ImageDisplayComponent, QuickReplyDisplayComponent, TextDisplayComponent } from '@/components/FlowItems/ReadFlow';

export const renderDisplayComponent = (component: FlowItem, index: string) => {
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
        case 'custom':
        renderedComponent = (
            <CustomDisplayComponent componentKey={index} componentData={component.data} />
        );
        break;
        default:
        renderedComponent = <div key={index}>Cannot render {component}</div>;
    }

    if (component.data.quickReplies) {
        return [
        renderedComponent,
        <QuickReplyDisplayComponent componentKey={index} componentData={component.data} />,
        ];
    }
    return renderedComponent;
};
