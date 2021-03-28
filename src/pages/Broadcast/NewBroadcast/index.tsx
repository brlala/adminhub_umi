import { Col, Form, Row, Button, message } from 'antd';
import React, { FC, useState } from 'react';
import { useParams} from "react-router";
import { Link, Redirect, useRequest } from 'umi';
import { queryBroadcastTemplate, sendBroadcast } from './service';
import styles from './style.less';
import ProCard from '@ant-design/pro-card';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { TextComponent, ImageComponent, VideoAttachmentComponent, GenericTemplateComponent, ButtonTemplateComponent, VideoComponent } from '@/components/FlowItems/UpdateFlow';
import BroadcastMeta from '@/pages/Broadcast/components/BroadcastMeta';
import { NewBroadcastEntry } from '../BroadcastTemplateList/data';
import PhonePreview from '@/components/PhonePreview';

const FormItem = Form.Item;

const NewBroadcast: FC = () => {
  let { templateId } = useParams<{templateId: string}>()
  type component = {
    type: string,
    data: {}
  }
  const [componentList, setComponentList] = useState<component[]>([]);
  const [redirect, setRedirect] = useState(false);

  const { data } = useRequest((values: any) => {
    return queryBroadcastTemplate(templateId);
  });

  const { run: postRun } = useRequest(
    (data) => {
      return sendBroadcast(data);
    }, {
      manual: true,
      onSuccess: (result) => {
        console.log('result', result)
        setRedirect(true)
        message.success('Broadcast Created', 2.5)
      },
      throwOnError: true
    }
  );

  const setComponent = (component: string, index: number) => {
    let componentData: any;
    switch (component) {
      case 'message':
        componentData = { type: component, data: { text: {} } };
        break;
      case 'image':
        componentData = { type: component, data: { url: '' } };
        break;
      case 'video':
        componentData = { type: component, data: { url: '' } };
        break;
      case 'genericTemplate':
        componentData = { type: component, data: { elements: [{ imageUrl: '', title: {}, subtitle: {}, buttons: [] } ] } };
        break;
      case 'buttonTemplate':
        componentData = { type: component, data: { text: {}, buttons: [] } };
        break;
      case 'video':
        componentData = { type: component, data: { url: '' } };
        break;
      default:
        componentData = { type: component, data: {} };
    }
    
    if (componentList.length < index + 1) {setComponentList((prevArray) => [...prevArray, componentData])}
  };

  const renderComponent = (component: { data: any; type: string }, index: number) => {
    const { data, type } = component;
    let renderedComponent;

    console.log('render', componentList, index)
    switch (type) {
      case 'message':
        renderedComponent = <TextComponent 
          componentKey={index} 
          componentData={data} 
          onChange={setComponentList} />;
        break;
      case 'image':
        renderedComponent = <ImageComponent 
          componentKey={index} 
          componentData={data} 
          onChange={setComponentList} />;
        break;
        case 'video':
          renderedComponent = <VideoComponent
            componentKey={index} 
            componentData={data} 
            onChange={setComponentList} />;
          break;
      case 'genericTemplate':
        renderedComponent = <GenericTemplateComponent 
          componentKey={index} 
          componentData={data} 
          current={componentList}
          onChange={setComponentList} />;
        break;
      case 'buttonTemplate':
        renderedComponent = <ButtonTemplateComponent
          componentKey={index} 
          componentData={data} 
          onChange={setComponentList} />;
        break;
      default:
        renderedComponent = <div key={index} >Cannot render {component}</div>;
    }
    return <div key={'component' + index}> {renderedComponent} </div>
  };


  const list = data?.flow || [];

  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Values:', values);
    console.log('componentList:', componentList);
    postRun({ 
      tags: values.tags, 
      exclude: values.exclude, 
      sendToAll: values.sendToAll, 
      flow: componentList, 
      scheduled: values.scheduled, 
      sendAt: values.sendAt} as NewBroadcastEntry)
  };

  return (
    redirect? (<Redirect to="/broadcasts/history" />):
    (<PageContainer>
        <Row>
          <Col span={18}>
            <Form 
              form={form}
            
              name="broadcast-form"
              hideRequiredMark
              initialValues={{tags: [], exclude: [], sendToAll: false, scheduled: false}} 
              onFinish={onFinish}>
                <ProCard split="horizontal">
                  <ProCard split="vertical">
                    <ProCard title="Component">
                      {list.map((flowNode, index) => setComponent(flowNode, index))}
                      {componentList.map((flowNode, index) => renderComponent(flowNode, index))}
                    </ProCard>
                    <ProCard title="Audience">
                      <FormItem>
                        <BroadcastMeta parentForm={form}></BroadcastMeta>
                      </FormItem>
                    </ProCard>
                  </ProCard>
                  <ProCard>
                    <Col style={{ textAlign: 'center' }}>
                      <Link to="/broadcasts/broadcast-templates">
                        <Button key="cancel">
                          Cancel
                        </Button>
                      </Link>
                      <Button style={{ margin: '0 16px' }} type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Col>
                  </ProCard>
                </ProCard>
              </Form>
          </Col>
          <Col span={6} style={{textAlign: "center"}}>
            <PhonePreview data={componentList}/>
          </Col>
        </Row>
    </PageContainer>)
  );
};

export default NewBroadcast;
