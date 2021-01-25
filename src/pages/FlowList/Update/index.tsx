import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
// @ts-ignore
import { FormattedMessage, useIntl } from 'umi';
import { changeLanguage } from '@/utils/language';
import { Divider, Form, Menu, Row, Space } from 'antd';
import styles from './index.less';
import NewComponentsList from '../components/NewComponentsList';
import FlowComponentsList from '@/pages/FlowList/components/FlowComponentsList';
import {
  GenericTemplatesComponent,
  ImageAttachmentComponent,
  TextComponent,
  FlowComponent,
  ButtonTemplatesComponent,
} from '@/components/FlowItems';
import { FlowList } from '@/pages/FlowList/data';

changeLanguage('en-US');

const NewFlow: React.FC = () => {
  const [componentList, setNewComponentsList] = useState([]);
  const [componentsContentList, setComponentsContentList] = useState([]);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const renderComponent = (component: { componentData: FlowList }) => {
    const { componentData } = component;
    let renderedComponent;
    switch (componentData.type) {
      case 'text':
        renderedComponent = <TextComponent componentData={componentData} />;
        break;
      case 'imageAttachments':
        renderedComponent = <ImageAttachmentComponent componentData={componentData} />;
        break;
      case 'videoAttachments':
        renderedComponent = <div>Not implemented yet</div>;
        break;
      case 'fileAttachments':
        renderedComponent = <div>Not implemented yet</div>;
        break;
      case 'genericTemplates':
        renderedComponent = <GenericTemplatesComponent componentData={componentData} />;
        break;
      case 'buttonTemplates':
        renderedComponent = <ButtonTemplatesComponent componentData={componentData} />;
        break;
      case 'flow':
        renderedComponent = <FlowComponent componentData={componentData} />;
        break;
      default:
        renderedComponent = <div>Cannot render {componentData.type}</div>;
    }
    return renderedComponent;
  };
  console.log(componentsContentList);
  let newComponentsImplementation = [];
  return (
    <div className={styles.componentsList}>
      <ProCard
        title="New Flow"
        extra="2019年9月28日"
        split="vertical"
        tooltip="Start by clicking an item in the Components section"
        bordered
        headerBordered
      >
        <ProCard title="Flow Panel" colSpan="300px">
          <Divider style={{ marginTop: -6 }} orientation="center">
            Components
          </Divider>
          <FlowComponentsList
            componentList={componentList}
            setNewComponentsList={setNewComponentsList}
            setComponentsComponentsList={setComponentsContentList}
          />
          <Divider orientation="center">Current</Divider>
          <NewComponentsList
            componentList={componentList}
            setComponentsList={setNewComponentsList}
          />
        </ProCard>
        <ProCard title="Flow Content">
          {componentList.map((flowNode) => {
            return (
              <Form
                name="complex-form"
                onFinish={onFinish}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 16 }}
              >
                {renderComponent(flowNode)}
                <Divider />
              </Form>
            );
          })}
          {componentList.length === 0 && (
            <div style={{ height: 360 }}>Add a flow to see the contents here</div>
          )}
        </ProCard>
      </ProCard>
    </div>
  );
};

export default NewFlow;
