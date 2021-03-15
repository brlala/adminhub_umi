import React, { FC, useState } from 'react';
import { Button, Card, Space, Carousel, Image, Popover, Divider, Drawer } from 'antd';
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


export const NextFlow: FC<{flowId: string}> = (props) => {
  const {flowId} = props
  const { data } = useRequest(() => {
    return getFlow(flowId);
  });
  return (
    <ProCard title={data?.name} ghost style={{alignItems: 'center'}}>
      <PhonePreview key={'reference' + flowId} data={data?.flow|| []} editMode={false}/>
    </ProCard>
    )
}

export const QuickReplyDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [curId, setCurId] = useState<string>('')

  return (
    componentData.quickReplies?.length?
    <>
      <Space style={{ width: '260px', overflow: "scroll"}}>
        {componentData &&
          componentData.quickReplies?.map((element, index) => (
            <Button key={componentKey + 'qr' + index} type="default" style={{ borderRadius: '4px' }} onClick={() => {setCurId(element.payload.flowId); setDrawerVisible(true)}}>
              {element.text.EN}
            </Button>
          ))}{' '}
      </Space>
      <Drawer
        width={364}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setCurId('');
        }}
      >
        {curId && <NextFlow flowId={curId}/>}
      </Drawer>
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

export const GenericTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [curId, setCurId] = useState<string>('')

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
                  <ProCard key={buttonIdex} size="small" onClick={() => {setCurId(button.payload.flowId); setDrawerVisible(true)}}>
                    {button.title?.EN}
                  </ProCard>:
                  <Popover placement="right" content={<a target='_blank' href={button.url}><LinkOutlined /> Open Link</a>} trigger="click">
                    <ProCard key={buttonIdex} size="small">
                      {button.title?.EN}
                    </ProCard>
                  </Popover>))}
              </Card>)
          return <></>
        })}
      </Carousel>
      <Drawer
        width={364}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setCurId('');
        }}>
        {curId && <NextFlow flowId={curId}/>}
      </Drawer>
    </div>: <></>
  )
};

export const ButtonTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [curId, setCurId] = useState<string>('')
  
  if (componentData.text?.EN || componentData.buttons?.length) {
    return (
      <div className={styles.ButtonComponent}>
        <Card key={componentKey} bordered={false} size="small">
          {componentData.text?.EN}
          {componentData.buttons?.map((button, buttonIdex) => (
            button.type === 'postback'? 
            <ProCard key={buttonIdex} size="small" onClick={() => {setCurId(button.payload.flowId); setDrawerVisible(true)}}>
              {button.title?.EN}
            </ProCard>:
            <Popover placement="right" content={<a target='_blank' href={button.url}><LinkOutlined /> Open Link</a>} trigger="click">
              <ProCard key={buttonIdex} size="small">
                {button.title?.EN}
              </ProCard>
            </Popover>
            ))}
        </Card>
        <Drawer
          width={364}
          visible={drawerVisible}
          onClose={() => {
            setDrawerVisible(false);
            setCurId('');
          }}>
          {curId && <NextFlow flowId={curId}/>}
        </Drawer>
      </div>
    );
  }
  return <></>;
};

export const FlowDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [curId, setCurId] = useState<string>('')

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
      
      <ProCard key={'reference' + componentKey} size="small" 
        onClick={() => {setCurId(componentData.flow.flowId); setDrawerVisible(true)}}>
        <Space> <ApartmentOutlined /> View {componentData.flow?.name} </Space>
      </ProCard>
      </Space>
      <Drawer
        width={364}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setCurId('');
        }}>
        {curId && <NextFlow flowId={curId}/>}
      </Drawer>
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

