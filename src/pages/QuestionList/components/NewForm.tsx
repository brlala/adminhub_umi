import React, { useState } from 'react';
import ProForm, {
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormTextArea,
  StepsForm,
  ProFormCheckbox,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import { Button, Form, Input, message, Modal, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import styles from './NewForm.less';
import type { QuestionListItem, VariationListItem } from '../data.d';
import type { ActionType } from '@ant-design/pro-table';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<QuestionListItem>;

export type NewFormProps = {
  actionRef: React.MutableRefObject<ActionType | undefined>;
  createModalVisible: boolean;
  handleModalVisible: (modalVisible: boolean) => void;
  handleAdd: (fields: QuestionListItem) => Promise<boolean>;
};

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const NewForm: React.FC<NewFormProps> = ({
  createModalVisible,
  handleModalVisible,
  actionRef,
  handleAdd,
}) => {
  const intl = useIntl();
  return (
    <StepsForm
      onFinish={async (values) => {
        console.log(values);
        await waitTime(1000);
        handleModalVisible(false);
        message.success('提交成功');
      }}
      formProps={{
        validateMessages: {
          required: '此项为必填项',
        },
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            title="New Question"
            width={800}
            onCancel={() => handleModalVisible(false)}
            visible={createModalVisible}
            footer={submitter}
            destroyOnClose
          >
            {dom}
          </Modal>
        );
      }}
    >
      <StepsForm.StepForm
        name="base"
        title="Creating Question"
        onFinish={async () => {
          // await waitTime(2000);
          return true;
        }}
      >
        <ProFormSelect
          width="sm"
          name="topic"
          label="Topic"
          showSearch
          valueEnum={{
            1: 'Topic 1',
            2: 'Topic 2',
            3: 'Topic 3',
            4: 'Topic 4',
            5: 'Topic 5',
          }}
          tooltip="最长为 24 位"
        />
        <ProFormText
          width="xl"
          name="main-question"
          label="Main Question"
          placeholder="Please type the main question"
        />
        {/*<ProFormTextArea width="xs" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="sm" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="md" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="lg" label="Variations" name="variations" />*/}
        <ProFormTextArea width="xl" label="Variations" name="variations" />
        <ProFormTextArea width="xl" label="Response" name="response" />
      </StepsForm.StepForm>
      <StepsForm.StepForm name="checkbox" title="Creating Response">
        <ProFormCheckbox.Group
          name="checkbox"
          label="迁移类型"
          width="lg"
          options={['结构迁移', '全量迁移', '增量迁移', '全量校验']}
        />
        <ProForm.Group>
          <ProFormText width="md" name="dbname" label="业务 DB 用户名" />
          <ProFormDatePicker name="datetime" label="记录保存时间" width="sm" />
          <ProFormCheckbox.Group
            name="checkbox"
            label="迁移类型"
            options={['完整 LOB', '不同步 LOB', '受限制 LOB']}
          />
        </ProForm.Group>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="time" title="Configuration">
        <ProFormSelect
          width="xl"
          name="keywords"
          label="Keywords"
          valueEnum={{
            red: 'Red',
            green: 'Green',
            blue: 'Blue',
          }}
          fieldProps={{
            mode: 'multiple',
          }}
          placeholder="Please add keywords for question"
        />
        <ProFormDateRangePicker width="xl" name="questionTime" label="Question Active Time" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default NewForm;
