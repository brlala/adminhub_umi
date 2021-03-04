import React, { FC } from 'react';
import { Button, Card, Space, Carousel, Image, Popover } from 'antd';
import Meta from 'antd/lib/card/Meta';
import styles from './index.less';
import ProCard from '@ant-design/pro-card';
import { FlowItemData } from 'models/flows';
import { FunctionOutlined, LeftOutlined, LinkOutlined, PaperClipOutlined, RightOutlined } from '@ant-design/icons';

interface DisplayComponentProps {
  componentKey: string;
  componentData: FlowItemData;
}

export const QuickReplyDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  return (
    <Space>
      {componentData &&
        componentData.quickReplies?.map((element, index) => (
          <Button key={componentKey + 'qr' + index} type="default" style={{ borderRadius: 20 }}>
            {element.text.EN}
          </Button>
        ))}{' '}
    </Space>
  );
};

export const TextDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  if (componentData?.text?.EN) 
    return (
      <div className={styles.TextComponent}>
      <ProCard key={componentKey} size="small">
        {componentData.text?.EN}
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
  return (
    <video
      key={componentKey}
      className={styles.ImageComponent}
      controls
      src={componentData.url}/>
  );
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
  if (button.type == 'flow') {
    return (
      <ProCard key={'reference' + buttonIdex} size="small">
        {button.title?.EN}
      </ProCard>)}
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
    <div className={styles.GenericComponent}>
      <Carousel key={componentKey} dots={false} draggable arrows prevArrow={<CarouselPrevArrow/>} nextArrow={<CarouselNextArrow/>}>
        {componentData && componentData.elements?.map((element, index) => {
          if (element.title?.EN || element.subtitle?.EN || element.imageUrl || (element.buttons && element.buttons?.length > 0) ) 
            return (
              <Card key={index} size="small" bordered={false} cover={<img src={element ? element.imageUrl : ''} />}>
                <Meta title={element.title?.EN} description={element.subtitle?.EN} />
                {element.buttons?.map((button, buttonIdex) => (
                  <Popover placement="right" content={getNextFlow(button, buttonIdex)} trigger="hover">
                    <ProCard key={buttonIdex} size="small">
                      {button.title?.EN}
                    </ProCard>
                  </Popover>))}
              </Card>)
          return <></>
        })}
      </Carousel>
    </div>
  )
};

export const ButtonTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;


  if (componentData) {
    return (
      <div className={styles.ButtonComponent}>
        <Card key={componentKey} bordered={false} size="small">
          {componentData.text?.EN}
          {componentData.buttons?.map((button, buttonIdex) => (
            <Popover placement="right" title='Button To' content={getNextFlow(button, buttonIdex)} trigger="hover">
              <ProCard key={buttonIdex} size="small">
                {button.title?.EN}
              </ProCard>
            </Popover>
            ))}
        </Card>
      </div>
    );
  }
  return (
    <div className={styles.ButtonComponent}>
      <Card key={componentKey} bordered={false} size="small">
        Placeholder Text
      </Card>
    </div>
  );
};

export const FlowDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  return (
    <div className={styles.ButtonComponent}>
      <Card key={componentKey} bordered={false} size="small">
        <Meta title="GO TO" />
        <ProCard key={'Button' + componentKey} size="small">
          {componentData.flow?.name}
        </ProCard>
      </Card>
    </div>
  );
};


export const CustomDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  return (
    <div className={styles.ButtonComponent}>
      <Card key={componentKey} bordered={false} size="small">
        <Meta title="Custom Function" />
        <ProCard key={'Button' + componentKey} size="small">
          <FunctionOutlined />{componentData.function}
        </ProCard>
      </Card>
    </div>
  );
};

