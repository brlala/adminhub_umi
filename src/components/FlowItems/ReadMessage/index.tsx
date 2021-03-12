import React, { FC, useState } from 'react';
import { Button, Card, Space, Carousel, Image, Popover, Divider } from 'antd';
import Meta from 'antd/lib/card/Meta';
import styles from './index.less';
import ProCard from '@ant-design/pro-card';
import { MessageData } from 'models/messages';
import { ApartmentOutlined, FunctionOutlined, LeftOutlined, LinkOutlined, PaperClipOutlined, RightOutlined } from '@ant-design/icons';
import PhonePreview from '@/components/PhonePreview';
import { useRequest } from 'umi';
import { getFlow } from '@/pages/FlowList/service';

interface DisplayComponentProps {
  componentKey: string;
  componentData: MessageData;
  isBot?: boolean;
}

export const QuickReplyDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  return (
    componentData.quickReplies?.length?
    <>
      <Space wrap className={styles.QuickReplies}>
        {componentData &&
          componentData.quickReplies?.map((element, index) => (
            <Button shape='round' key={componentKey + 'qr' + index} type="default">
              {element.title}
            </Button>
          ))}{' '}
      </Space>
    </>: <></>
  );
};

export const TextDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData, isBot } = props;
  if (componentData?.text) 
    return (
      <div className={isBot?styles.TextComponentBot:styles.TextComponent}>
      <ProCard key={componentKey} size="small">
        {isBot?'True': 'False'}{componentData.text}
      </ProCard>
      </div>
    )
  return <></>
};


export const PostbackDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  if (componentData?.text) 
    return (
      <div className={styles.TextComponent}>
      <ProCard key={componentKey} size="small">
        <Space direction='horizontal' wrap>
          <div>Clicked: </div>
          <Button shape='round' key={componentKey + 'qr'} type="default">
            {componentData.text}
          </Button>
        </Space>
          
      </ProCard>
      </div>
    )
  return <></>
};

export const ImageDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  return componentData.url?(
    <Image
      className={styles.ImageComponent}
      key={componentKey}
      src={componentData.url}/>
  ): <></>
};

export const VideoDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  return componentData.url?(
    <video
      key={componentKey}
      className={styles.ImageComponent}
      controls
      src={componentData.url}/>
  ): <></>
};

export const FileDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey } = props;
  return (
    <div className={styles.TextComponent}>
      <ProCard key={componentKey} size="small">
        <PaperClipOutlined /> File
      </ProCard>
    </div>
  );
};

export const getNextFlow = (button: any, buttonIdex: number) => {
  if (!button.type || button.type === 'postback') {

    const { data, run } = useRequest((values: any) => {
      if (button.payload?.flowId)
        return getFlow(button.payload?.flowId);
      return null
    });
    const list = data?.flow || [];
    return (
        <PhonePreview key={'reference' + buttonIdex} data={list} editMode={false}/>
      )}
  return <a target='_blank' href={button.url}><LinkOutlined /> Open Link</a>
}

export const GenericTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props

  const CarouselPrevArrow = (carouselProps: any) => {
    const { onClick } = carouselProps
    return (
      <div className={styles.CarouselSlickLeft} onClick={onClick}>
        <LeftOutlined/>
      </div>)}

  const CarouselNextArrow = (carouselProps: any) => {
    const { onClick } = carouselProps
    return (
      <div className={styles.CarouselSlickRight} onClick={onClick}>
        <RightOutlined/>
      </div>)}

  return (
    componentData.elements?.length?
    <div className={styles.GenericComponent}>
      <Carousel key={componentKey} dots={false} draggable arrows prevArrow={<CarouselPrevArrow/>} nextArrow={<CarouselNextArrow/>}>
        {componentData && componentData.elements?.map((element, index) => {
          if (element.title || element.subtitle || element.imageUrl || (element.buttons && element.buttons?.length > 0) ) 
            return (
              <Card key={index} size="small" bordered={false} cover={<img src={element ? element.imageUrl : ''} />}>
                <p><b>{element.title}</b></p>
                <Meta description={element.subtitle} />
                {element.buttons?.map((button, buttonIdex) => (
                  <ProCard key={buttonIdex} size="small">
                    {button.title}
                  </ProCard>))}
              </Card>)
          return <></>
        })}
      </Carousel>
    </div>: <></>
  )
};

export const ButtonTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  if (componentData.text || componentData.buttons?.length) {
    return (
      <div className={styles.ButtonComponent}>
        <Card key={componentKey} bordered={false} size="small">
          {componentData.text}
          {componentData.buttons?.map((button, buttonIdex) => (
            <ProCard key={buttonIdex} size="small">
              {button.title}
            </ProCard>
            ))}
        </Card>
      </div>
    );
  }
  return <></>;
};
