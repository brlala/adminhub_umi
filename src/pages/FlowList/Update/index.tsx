import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
// @ts-ignore
import { FormattedMessage, useIntl } from 'umi';
import { changeLanguage } from '@/utils/language';
import { Button, Divider, Form, Menu, Popover, Row, Space } from 'antd';
import styles from './index.less';
import NewComponentsList from '../components/NewComponentsList';
import FlowComponentsList from '@/pages/FlowList/components/FlowComponentsList';
import {
  GenericTemplatesComponent,
  ImageAttachmentComponent,
  TextComponent,
  FlowComponent,
  ButtonTemplatesComponent,
  VideoAttachmentComponent,
} from '@/components/FlowItems';
import { FlowList } from '@/pages/FlowList/data';
import { FooterToolbar } from '@ant-design/pro-layout';
import { CloseCircleOutlined } from '@ant-design/icons';

changeLanguage('en-US');

type InternalNamePath = (string | number)[];

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

const NewFlow: React.FC = () => {
  const [componentList, setNewComponentsList] = useState([]);
  const [componentsContentList, setComponentsContentList] = useState([]);
  const [error, setError] = useState<ErrorField[]>([]);

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
        renderedComponent = <VideoAttachmentComponent componentData={componentData} />;
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

  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          {/*<div className={styles.errorField}>{fieldLabels[key]}</div>*/}
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
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
          <Form name="complex-form" onFinish={onFinish}>
            {componentList.map((flowNode) => renderComponent(flowNode))}
            <FooterToolbar>
              {getErrorInfo(error)}
              {/*<Button type="primary" onClick={() => form?.submit()} loading={submitting}>*/}
              <Button key="3">重置</Button>
              <Button type="primary" onClick={() => form?.submit()} loading={false}>
                提交
              </Button>
            </FooterToolbar>
          </Form>
          {componentList.length === 0 && (
            <div style={{ height: 360 }}>Add a flow to see the contents here</div>
          )}
        </ProCard>
        <ProCard title="Placeholder"></ProCard>
      </ProCard>
    </div>
  );
};

export default NewFlow;
