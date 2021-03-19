import React from 'react';
import { MessageData } from 'models/messages';
import { ButtonTemplateDisplayComponent, PostbackDisplayComponent, FileDisplayComponent, GenericTemplateDisplayComponent, ImageDisplayComponent, QuickReplyDisplayComponent, TextDisplayComponent, VideoDisplayComponent, AudiosDisplayComponent, ImagesDisplayComponent, VideosDisplayComponent } from '@/components/FlowItems/ReadMessage';

export const renderMessageComponent = (component: MessageData, type: string, index: string, isBot: boolean, isBroadcast: boolean, searchQuery: string) => {
    let renderedComponent;
    switch (type) {
        case 'message':
            renderedComponent = (
                <TextDisplayComponent componentKey={index} componentData={component} isBot={isBot} isBroadcast={isBroadcast} searchQuery={searchQuery}/>
            );
            break;

        // BOT Only
        case 'image':
            renderedComponent = (
                <ImageDisplayComponent componentKey={index} componentData={component} isBroadcast={isBroadcast}/>
            );
            break;
        case 'video':
            renderedComponent = (
                <VideoDisplayComponent componentKey={index} componentData={component} isBroadcast={isBroadcast}/>
            );
            break;
        case 'file':
            renderedComponent = (
                <FileDisplayComponent componentKey={index} componentData={component} isBroadcast={isBroadcast}/>
            );
            break;
        case 'genericTemplate':
            renderedComponent = (
                <GenericTemplateDisplayComponent componentKey={index} componentData={component} isBroadcast={isBroadcast} searchQuery={searchQuery}/>
            );
            break;
        case 'buttonTemplate':
            renderedComponent = (
                <ButtonTemplateDisplayComponent componentKey={index} componentData={component} isBroadcast={isBroadcast} searchQuery={searchQuery}/>
            );
            break;
        case 'quickReplies':
            renderedComponent = (
                <QuickReplyDisplayComponent componentKey={index} componentData={component} isBroadcast={isBroadcast} searchQuery={searchQuery}/>
            );
            break;

        // User Only
        case 'postback':
            renderedComponent = (
                <PostbackDisplayComponent componentKey={index} componentData={component} searchQuery={searchQuery}/>
            );
            break;
        case 'audios':
            renderedComponent = (
                <AudiosDisplayComponent componentKey={index} componentData={component}/>
            );
            break;
        case 'images':
            renderedComponent = (
                <ImagesDisplayComponent componentKey={index} componentData={component}/>
            );
            break;
        case 'videos':
            renderedComponent = (
                <VideosDisplayComponent componentKey={index} componentData={component}/>
            );
            break;
        case 'files':
            renderedComponent = (
                <FileDisplayComponent componentKey={index} componentData={component}/>
            );
            break;
        default:
        renderedComponent = <div key={index}>Cannot render {component}</div>;
    }
    return renderedComponent;
};
