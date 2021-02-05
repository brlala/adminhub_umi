import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Result, Button, Form, List, Input, Space, Row, Col } from 'antd';

import ProCard from '@ant-design/pro-card';
import TagSelect from '../components/TagSelect';
import { BroadcastTemplateListItem } from '../data';
import styles from '../style.less';

interface OperationModalProps {
  visible: boolean;
  current?: Partial<BroadcastTemplateListItem>;
  onSubmit: (values: BroadcastTemplateListItem) => void;
  onCancel: () => void
}

const TemplateModal: FC<OperationModalProps> = (props) => {
  const [form] = Form.useForm();
  const { visible, current, onCancel, onSubmit } = props;

  const component = current?.flow || []
  const [templateComponent, setTemplateComponent] = useState(component);

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
      setTemplateComponent([])
    }
  }, [visible]);

  useEffect(() => {
    if (current) {
      setTemplateComponent(component)
      form.setFieldsValue({
        ...current,
        createdAt: current.createdAt ? moment(current.createdAt) : null,
      });
    }
  }, [current, visible]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit({...current, ...values, flow: templateComponent} as BroadcastTemplateListItem);
    }
  };

  const componentsList = [
    { name: 'Text', key: 'message' },
    { name: 'Image', key: 'image' },
    { name: 'Generic Template', key: 'genericTemplate' },
    { name: 'Button Template', key: 'buttonTemplate' },
    { name: 'Video', key: 'video' },
  ];


  const modalFooter = { okText: 'Save Template', onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    return (
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item name="name" key='name'
          rules={[{ required: true, message: 'Please enter a template name' }]}>
          <Input placeholder={current?.name || "Template Name"} />
        </Form.Item>
        <Form.Item name="platforms" key='platforms'>
          <TagSelect>
            <TagSelect.Option value="facebook">Messenger</TagSelect.Option>
            <TagSelect.Option value="line">Line</TagSelect.Option>
            <TagSelect.Option value="slack">Slack</TagSelect.Option>
            <TagSelect.Option value="whatsapp">Whatsapp</TagSelect.Option>
            <TagSelect.Option value="telegram">Telegram</TagSelect.Option>
          </TagSelect>
        </Form.Item>
        <Form.Item name="flow">
        <div className={styles.componentsList}>
          <ProCard split="vertical">
            <ProCard title="Component" colSpan="200px">
              <Space direction="vertical" size={4}>
                {componentsList.map((item, index) => {
                  return (
                    <Button
                      size="small"
                      type="primary"
                      ghost
                      key={index}
                      value={item.name}
                      onClick={() => setTemplateComponent([...templateComponent, item.key])}>
                      <PlusOutlined /> {item.name}
                    </Button>
                  );
                  })}
              </Space>
            </ProCard>

            <ProCard title="Selected Component" >
              <List
                dataSource={templateComponent}
                renderItem={(item, idx) => (
                  <List.Item key={ idx }  extra={<Button 
                    size="small"
                    onClick={() => {
                      templateComponent.splice(idx, 1);
                      setTemplateComponent([...templateComponent])}}><DeleteOutlined /></Button>}>
                    {item}
                  </List.Item>
                )}
              />
            </ProCard>
          </ProCard>
        </div>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={`Broadcast Template ${current ? 'Edit' : 'New'}`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={{ padding: '16px 16px 0' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default TemplateModal;
