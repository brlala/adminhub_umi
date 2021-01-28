import { Card, Col, Divider, Form, List, Row, Button, Typography } from 'antd';
import React, { FC, useState } from 'react';
import { useParams} from "react-router";
import { useRequest } from 'umi';
import { Params, BroadcastTemplateListItem, BroadcastFlowList } from './data.d';
import { queryBroadcastTemplate } from './service';
import styles from './style.less';
import ProCard from '@ant-design/pro-card';
import { TextComponent, ImageAttachmentComponent, VideoAttachmentComponent, GenericTemplatesComponent, ButtonTemplatesComponent, FlowComponent} from '@/components/FlowItems';

const FormItem = Form.Item;
const { Paragraph } = Typography;


const tailLayout = {
  wrapperCol: { offset: 12, span: 24 },
};

const NewBroadcast: FC = () => {
  let { templateId } = useParams()
  const [componentList, setNewComponentsList] = useState([]);

  const { data, loading, run} = useRequest((values: any) => {
    return queryBroadcastTemplate(templateId);
  });

  const renderComponent = (component: string, index: number) => {
    let componentData;
    let renderedComponent;
    switch (component) {
      case 'text':
        componentData = { type: component, name: index, data: { textField: null } };
        break;
      case 'imageAttachments':
        componentData = { type: component, name: index, data: { attachments: [] } };
        break;
      case 'videoAttachments':
        componentData = { type: component, name: index, data: { attachments: [] } };
        break;
      case 'fileAttachments':
        componentData = { type: component, name: index, data: { attachments: [] } };
        break;
      case 'genericTemplates':
        componentData = { type: component, name: index, data: { templates: [] } };
        break;
      case 'buttonTemplates':
        componentData = { type: component, name: index, data: { textField: null, buttons: [] } };
        break;
      case 'flow':
        componentData = { type: component, name: index, data: { flowId: null, params: [] } };
        break;
      default:
        componentData = { type: component, name: index, data: {} };
    }
    switch (component) {
      case 'text':
        renderedComponent = <TextComponent key={index} componentData={componentData} />;
        break;
      case 'imageAttachments':
        renderedComponent = <ImageAttachmentComponent key={index}  componentData={componentData} />;
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
    return renderedComponent;
  };


  const list = data?.flow || [];

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <div className={styles.coverCardList}>
      <ProCard title="Create New Broadcast">
          <Form 
            name="broadcast-form" 
            onFinish={onFinish}>
            <Row>
              <Col span={12} key={1}>
                <FormItem 
                  name="flow">
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
  );
};

export default NewBroadcast;
