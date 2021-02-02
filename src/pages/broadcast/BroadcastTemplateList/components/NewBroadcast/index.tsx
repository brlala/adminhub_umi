import { Card, Col, Divider, Form, List, Row, Button, Typography } from 'antd';
import React, { FC, useState } from 'react';
import { useParams} from "react-router";
import { useRequest } from 'umi';
import { Params, BroadcastTemplateListItem, BroadcastFlowList } from './data.d';
import { queryBroadcastTemplate } from './service';
import styles from './style.less';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { ImageAttachmentComponent, TextComponent, VideoAttachmentComponent, GenericTemplatesComponent, ButtonTemplatesComponent, FlowComponent } from '@/components/FlowItems/UpdateFlow';

const FormItem = Form.Item;
const { Paragraph } = Typography;


const tailLayout = {
  wrapperCol: { offset: 12, span: 24 },
};

const NewBroadcast: FC = () => {
  let { templateId } = useParams()
  const [componentList, setComponentsList] = useState([]);

  const { data, loading, run} = useRequest((values: any) => {
    return queryBroadcastTemplate(templateId);
  });

  const renderComponent = (component: string, index: number) => {
    let componentData;
    let renderedComponent;
    switch (component) {
      case 'text':
        componentData = { type: component, data: { text: '' } };
        break;
      case 'image':
        componentData = { type: component, data: { url: '' } };
        break;
      case 'videoAttachments':
        componentData = { type: component, data: { attachments: [] } };
        break;
      case 'fileAttachments':
        componentData = { type: component, data: { attachments: [] } };
        break;
      case 'genericTemplates':
        componentData = { type: component, data: { templates: [] } };
        break;
      case 'buttonTemplates':
        componentData = { type: component, data: { textField: null, buttons: [] } };
        break;
      case 'flow':
        componentData = { type: component, data: { flowId: null, params: [] } };
        break;
      default:
        componentData = { type: component, data: {} };
    }

    if (componentList.length < index + 1) {setComponentsList(prevArray => [...prevArray, componentData])}
    console.log('componentList', componentList)
    
    switch (component) {
      case 'text':
        renderedComponent = <TextComponent componentKey={index} componentData={componentData} onChange={setComponentsList} />;
        break;
      case 'image':
        renderedComponent = <ImageAttachmentComponent componentKey={index}  componentData={componentData} onChange={setComponentsList} />;
        break;
      case 'videoAttachments':
        renderedComponent = <VideoAttachmentComponent key={index}  componentData={componentData} />;
        break;
      case 'fileAttachments':
        renderedComponent = <div key={index} >Not implemented yet</div>;
        break;
      case 'genericTemplates':
        renderedComponent = <GenericTemplatesComponent key={index}  componentData={componentData} />;
        break;
      case 'buttonTemplates':
        renderedComponent = <ButtonTemplatesComponent key={index}  componentData={componentData} />;
        break;
      case 'flow':
        renderedComponent = <FlowComponent key={index}  componentData={componentData} />;
        break;
      default:
        renderedComponent = <div key={index} >Cannot render {component}</div>;
    }
    return renderedComponent
  };


  const list = data?.flow || [];

  const onFinish = (values: any) => {
    console.log('Success:', values,componentList );
  };

  return (
    <PageContainer>
      <div className={styles.coverCardList}>
        <ProCard title="Create New Broadcast">
            <Form 
              name="broadcast-form" 
              onFinish={onFinish}>
              <Row>
                <Col span={12} key={1}>
                  <FormItem 
                    name="flow" >
                    <ProCard title="Component">
                      {list.map((flowNode, index) => renderComponent(flowNode, index))}
                    </ProCard>
                  </FormItem>
                </Col>
                <Col span={12} key={2}>
                <FormItem >
                <ProCard title="Audience">
                </ProCard>
                </FormItem>
                </Col>
              </Row>

              <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
            </Form>
        </ProCard>
      </div>

    </PageContainer>
  );
};

export default NewBroadcast;
