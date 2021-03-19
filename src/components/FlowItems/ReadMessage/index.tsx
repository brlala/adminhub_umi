import React, { FC } from 'react';
import { Button, Card, Space, Carousel, Image, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import styles from './index.less';
import ProCard from '@ant-design/pro-card';
import { MessageData } from 'models/messages';
import {AudioOutlined, FileImageOutlined, LeftOutlined, NotificationOutlined, PaperClipOutlined, PictureOutlined, RightOutlined, VideoCameraOutlined } from '@ant-design/icons';
const { Text } = Typography;

interface DisplayComponentProps {
  componentKey: string;
  componentData: MessageData;
  isBot?: boolean;
  isBroadcast?: boolean;
  searchQuery?: string;
}

export const renderLabel = (label: string | undefined, searchQuery: string | undefined) => {
  if (searchQuery && label) {

      let index = label.toLowerCase().indexOf(searchQuery.toLowerCase());

      if (index !== -1) {

          let length = searchQuery.length;

          let prefix = label.substring(0, index);
          let suffix = label.substring(index + length);
          let match = label.substring(index, index + length);

          return (
              <span>
                  {prefix}<Text mark>{match}</Text>{suffix}
              </span>
          );
      }
  }

  return (
      <span>
          {label}
      </span>
  );
}

export const QuickReplyDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData, searchQuery } = props;
  return (
    componentData.quickReplies?.length?
    <>
      <Space wrap className={styles.QuickReplies}>
        {componentData &&
          componentData.quickReplies?.map((element, index) => (
            <Button  key={componentKey + 'qr' + index} type="default" style={{borderRadius: '4px'}}>
              {renderLabel(element.title, searchQuery)}
            </Button>
          ))}{' '}
      </Space>
    </>: <></>
  );
};

export const TextDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData, isBot, isBroadcast, searchQuery } = props;
  
  if (componentData?.text) 
    return (
      <div className={isBot?styles.TextComponentBot:styles.TextComponent}>
        <Space direction='horizontal'>{isBroadcast? <NotificationOutlined style={{color: '#1890ff'}}/>: <></>}
          <ProCard key={componentKey} size="small">
            {renderLabel(componentData.text, searchQuery)}
          </ProCard>
        </Space>
      </div>
    )
  return <></>
};

export const PostbackDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData, searchQuery } = props;
  if (componentData?.text) 
    return (
      <div className={styles.TextComponent}>
      <ProCard key={componentKey} size="small">
        <Space direction='horizontal' wrap>
          <div>Clicked: </div>
          <Button key={componentKey + 'qr'} type="default" style={{borderRadius: '4px'}}>
            {renderLabel(componentData.text, searchQuery)}
          </Button>
        </Space>
          
      </ProCard>
      </div>
    )
  return <></>
};

export const ImageDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData, isBroadcast } = props;
  return componentData.url?(
    <Space direction='horizontal'>{isBroadcast? <NotificationOutlined style={{color: '#1890ff'}}/>: <></>}
      <Image
        className={styles.ImageComponent}
        key={componentKey}
        src={componentData.url}/>
    </Space>
  ): <></>
};

export const VideoDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData, isBroadcast } = props;
  return componentData.url?(
    <Space direction='horizontal'>{isBroadcast? <NotificationOutlined style={{color: '#1890ff'}}/>: <></>}
      <video
        key={componentKey}
        className={styles.ImageComponent}
        controls
        src={componentData.url}/>
    </Space>
  ): <></>
};

export const FileDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, isBroadcast } = props;
  return (
    <Space direction='horizontal'>{isBroadcast? <NotificationOutlined style={{color: '#1890ff'}}/>: <></>}
      <div className={styles.TextComponent}>
        <ProCard key={componentKey} size="small">
          <PaperClipOutlined /> File
        </ProCard>
      </div>
    </Space>
  );
};

export const GenericTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData, isBroadcast, searchQuery } = props

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
    <Space direction='horizontal'>{isBroadcast? <NotificationOutlined style={{color: '#1890ff'}}/>: <></>}
      <div className={styles.GenericComponent}>
        <Carousel key={componentKey} dots={false} draggable arrows prevArrow={<CarouselPrevArrow/>} nextArrow={<CarouselNextArrow/>}>
          {componentData && componentData.elements?.map((element, index) => {
            if (element.title || element.subtitle || element.imageUrl || (element.buttons && element.buttons?.length > 0) ) 
              return (
                <Card key={index} size="small" bordered={false} cover={<img src={element ? element.imageUrl : ''} />}>
                  <p><b>{renderLabel(element.title, searchQuery)}</b></p>
                  <Meta description={renderLabel(element.subtitle, searchQuery)} />
                  {element.buttons?.map((button, buttonIdex) => (
                    <ProCard key={buttonIdex} size="small">
                      {renderLabel(button.title, searchQuery)}
                    </ProCard>))}
                </Card>)
            return <></>
          })}
        </Carousel>
      </div>
    </Space>: <></>
  )
};

export const ButtonTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData, isBroadcast, searchQuery } = props;
  if (componentData.text || componentData.buttons?.length) {
    return (
      <Space direction='horizontal'>{isBroadcast? <NotificationOutlined style={{color: '#1890ff'}}/>: <></>}
        <div className={styles.ButtonComponent}>
          <Card key={componentKey} bordered={false} size="small">
            {renderLabel(componentData.text, searchQuery)}
            {componentData.buttons?.map((button, buttonIdex) => (
              <ProCard key={buttonIdex} size="small">
                {renderLabel(button.title, searchQuery)}
              </ProCard>
              ))}
          </Card>
        </div>
      </Space>
    );
  }
  return <></>;
};


export const AudiosDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey } = props;
  return (
    <ProCard key={componentKey} size="small" className={styles.TextComponent}>
      <AudioOutlined /> Audios
    </ProCard>
    )
};


export const ImagesDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey } = props;
  return (
    <ProCard key={componentKey} size="small" className={styles.TextComponent}>
      <PictureOutlined /> Images
    </ProCard>
    )
};


export const VideosDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey } = props;
  return (
    <ProCard key={componentKey} size="small" className={styles.TextComponent}>
      <VideoCameraOutlined /> Videos
    </ProCard>
    )
};
