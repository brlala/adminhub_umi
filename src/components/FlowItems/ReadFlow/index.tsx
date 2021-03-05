import React, { FC, useState } from 'react';
import { Button, Card, Space, Carousel, Image, Popover, Divider } from 'antd';
import Meta from 'antd/lib/card/Meta';
import styles from './index.less';
import ProCard from '@ant-design/pro-card';
import { FlowItemData } from 'models/flows';
import { ApartmentOutlined, FunctionOutlined, LeftOutlined, LinkOutlined, PaperClipOutlined, RightOutlined } from '@ant-design/icons';
import PhonePreview from '@/components/PhonePreview';
import { useRequest } from 'umi';
import { getFlow } from '@/pages/FlowList/service';

interface DisplayComponentProps {
  componentKey: string;
  componentData: FlowItemData;
}

export const QuickReplyDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  return (
    componentData.quickReplies?.length?
    <>
      <Space style={{ width: '260px', overflow: "scroll"}}>
        {componentData &&
          componentData.quickReplies?.map((element, index) => (
            <Popover placement="right" content={getNextFlow(element, index)} trigger="click" color='transparent' overlayInnerStyle={{boxShadow:'none'}}>
              <Button key={componentKey + 'qr' + index} type="default" style={{ borderRadius: 20 }}>
                {element.text.EN}
              </Button>
            </Popover>
            
          ))}{' '}
      </Space>
    </>: <></>
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
          if (element.title?.EN || element.subtitle?.EN || element.imageUrl || (element.buttons && element.buttons?.length > 0) ) 
            return (
              <Card key={index} size="small" bordered={false} cover={<img src={element ? element.imageUrl : ''} />}>
                <p><b>{element.title?.EN}</b></p>
                <Meta description={element.subtitle?.EN} />
                {element.buttons?.map((button, buttonIdex) => (
                  button.type === 'postback'? 
                  <Popover placement="right" content={getNextFlow(button, buttonIdex)} trigger="click" color='transparent' overlayInnerStyle={{boxShadow:'none'}}>
                    <ProCard key={buttonIdex} size="small">
                      {button.title?.EN}
                    </ProCard>
                  </Popover>:
                  <Popover placement="right" content={<a target='_blank' href={button.url}><LinkOutlined /> Open Link</a>} trigger="click">
                    <ProCard key={buttonIdex} size="small">
                      {button.title?.EN}
                    </ProCard>
                  </Popover>))}
              </Card>)
          return <></>
        })}
      </Carousel>
    </div>: <></>
  )
};

export const ButtonTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  if (componentData.text?.EN || componentData.buttons?.length) {
    return (
      <div className={styles.ButtonComponent}>
        <Card key={componentKey} bordered={false} size="small">
          {componentData.text?.EN}
          {componentData.buttons?.map((button, buttonIdex) => (
            button.type === 'postback'? 
            <Popover placement="right" content={getNextFlow(button, buttonIdex)} trigger="click" color='transparent' overlayInnerStyle={{boxShadow:'none'}}>
              <ProCard key={buttonIdex} size="small">
                {button.title?.EN}
              </ProCard>
            </Popover>:
            <Popover placement="right" content={<a target='_blank' href={button.url}><LinkOutlined /> Open Link</a>} trigger="click">
              <ProCard key={buttonIdex} size="small">
                {button.title?.EN}
              </ProCard>
            </Popover>
            ))}
        </Card>
      </div>
    );
  }
  return <></>;
};

export const FlowDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  console.log('componentData', componentData)

  const { data, run } = useRequest((values: any) => {
    console.log('componentData', componentData, componentData.flow?.flowId)
    if (componentData.flow?.flowId)
      return getFlow(componentData.flow?.flowId);
    return null
  }, {manual: true});
  const list = data?.flow || [];

  return (
    componentData.flow?.flowId?
    <>
      <Divider plain style={{margin: '6px', color: 'gray'}}>
        To Next Flow
      </Divider>
      <Space>
      
      <Popover placement="right" trigger="click" color='transparent' overlayInnerStyle={{boxShadow:'none'}}
        content={<PhonePreview data={list} editMode={false}/>}>
        <ProCard key={'reference' + componentKey} size="small" onMouseEnter={run}>
          <Space> <ApartmentOutlined /> View {componentData.flow?.name} </Space>
        </ProCard>
      </Popover>
      </Space>
      <Divider plain style={{margin: '6px'}}>
      </Divider>
    </>: <></>
  );
};


export const CustomDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentData } = props;
  return (
    <>
      <Divider plain style={{margin: '6px', color: 'gray'}}>
        Custom Function
      </Divider>
      <Space>
      <FunctionOutlined />{componentData.function}
      </Space>
      <Divider plain style={{margin: '6px'}}>
      </Divider>
    </>
    // <div className={styles.ButtonComponent}>
    //   <Card key={componentKey} bordered={false} size="small" title="Custom Function">
    //     <FunctionOutlined />{componentData.function}
    //   </Card>
    // </div>
  );
};


export const InputDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentData } = props;
  return (
    <>
      <Divider plain style={{margin: '6px', color: 'gray'}}>
        Input: {componentData.inputName}
      </Divider>
    </>
  );
};

