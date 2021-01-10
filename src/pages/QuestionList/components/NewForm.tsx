import React, { useState } from 'react';
import {
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';
import { message, Modal, Radio } from 'antd';
import type { QuestionListItem } from '../data.d';
import type { ActionType } from '@ant-design/pro-table';
import EditableTagGroup from '@/pages/QuestionList/components/Tag';

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
  const [responseType, setResponseType] = useState<string>('text');
  const [tags, setTags] = useState<string[]>(['hi', 'hi2']);

  let responseArea;
  if (responseType === 'text') {
    responseArea = <ProFormTextArea width="xl" label="Response" name="response" />;
  } else {
    responseArea = (
      <ProFormSelect
        width="xl"
        name="response"
        label="Response"
        showSearch
        valueEnum={{
          1: 'Flow 1',
          2: 'Flow 2',
        }}
      />
    );
  }
  return (
    <StepsForm
      onFinish={async (values) => {
        const newValues = { ...values, responseType, tags };
        console.log(newValues);
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
          name="mainQuestion"
          label="Main Question"
          placeholder="Please type the main question"
        />
        {/*<ProFormTextArea width="xs" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="sm" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="md" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="lg" label="Variations" name="variations" />*/}
        <ProFormTextArea width="xl" label="Variations" name="variations" />
      </StepsForm.StepForm>
      <StepsForm.StepForm name="checkbox" title="Creating Response">
        <div className="ant-row ant-form-item">
          <div className="ant-col ant-form-item-label">
            <label title="Type of Response">Type of Response</label>
          </div>
          <div className="ant-col ant-form-item-control">
            <Radio.Group
              onChange={(event) => setResponseType(event.target.value)}
              defaultValue="text"
              name="responseSelect"
            >
              <Radio.Button value="text">Text</Radio.Button>
              <Radio.Button value="flow">Flow</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        {responseArea}
      </StepsForm.StepForm>
      <StepsForm.StepForm name="time" title="Configuration">
        <div className="ant-row ant-form-item">
          <div className="ant-col ant-form-item-label">
            <label htmlFor="time_questionTime" className="" title="Keyword Tags">
              Keyword Tags
            </label>
          </div>
          <div className="ant-col ant-form-item-control">
            <EditableTagGroup tags={tags} setTags={setTags} />
          </div>
        </div>

        <ProFormDateRangePicker width="xl" name="questionTime" label="Question Active Time" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default NewForm;
