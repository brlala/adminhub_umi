import React, { useEffect, useRef, useState } from 'react';
import {
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';
import { Divider, Form, Input, message, Modal, Radio } from 'antd';
import type { DropdownProps, newQuestionItem, QuestionListItem } from '../data.d';
import type { ActionType } from '@ant-design/pro-table';
import { addQuestion, queryFlows, queryTopics } from '@/pages/QuestionList/service';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import moment from 'moment';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<QuestionListItem>;

export type NewFormProps = {
  actionRef: React.MutableRefObject<ActionType | undefined>;
  editModalVisible: boolean;
  handleEditModalVisible: (modalVisible: boolean) => void;
  values: Partial<QuestionListItem>;
};

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: newQuestionItem) => {
  const hide = message.loading('Adding');
  try {
    await addQuestion({ ...fields });
    hide();
    message.success('Add success');
    return true;
  } catch (error) {
    hide();
    message.error('Add fail, please retry!');
    return false;
  }
};

const NewForm: React.FC<NewFormProps> = ({
  editModalVisible,
  handleEditModalVisible,
  actionRef,
  values,
}) => {
  const [responseType, setResponseType] = useState<string>('text');
  const [tags, setTags] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState<string>('');
  const [topics, setTopics] = useState<DropdownProps[]>([]);
  const [flows, setFlows] = useState<DropdownProps[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [form] = Form.useForm();
  const dateFormat = 'YYYY/MM/DD';
  const onDropdownTopicChange = (event) => {
    setNewTopic(event.target.value);
  };

  useEffect(() => {
    if (values) {
      console.log('transformValues');
      let listVariations: string[] = [];
      let listKeywords: string[] = [];
      let schedule = [];

      // alternate questions
      if (values.alternateQuestions) {
        values.alternateQuestions.forEach((varEntry) => {
          if (varEntry.language === 'EN') {
            listVariations.push(varEntry.text);
          }
        });
      }

      // keywords
      console.log(values);
      if (values.keyword) {
        setTags(values.keyword);
      }

      // schedule
      if (values.activeAt) {
        schedule = [moment(values.activeAt, dateFormat), moment(values.expireAt, dateFormat)];
      }

      const body = {
        response: values.answerFlow.name
          ? values.answerFlow.name
          : values.answerFlow.flow[0].data.text?.EN,
        mainQuestion: values.text.EN,
        topic: values.topic,
        variations: listVariations.join('\n'),
        responseSelect: values.answerFlow.name ? 'flow' : 'text',
        tags: listKeywords,
        questionTime: schedule,
      };
      console.log(body);
      setSelectedQuestion(body);
    }
  }, [values]);

  const addNewTopic = () => {
    const topic: DropdownProps = { key: newTopic, value: newTopic, label: newTopic };
    setTopics([topic, ...topics]);
    setNewTopic('');
  };

  let responseArea;
  if (responseType === 'text') {
    form.setFieldsValue({ response: null });
    responseArea = (
      <ProFormTextArea
        width="xl"
        label="Response"
        name="response"
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.response"
                defaultMessage="Response is required"
              />
            ),
          },
        ]}
      />
    );
  } else {
    form.setFieldsValue({ response: null });
    responseArea = (
      <ProFormSelect
        width="xl"
        name="response"
        label="Response"
        showSearch
        request={async () => {
          const flows = await queryFlows('name,params');
          setFlows(flows);
        }}
        options={flows}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.response"
                defaultMessage="Response is required"
              />
            ),
          },
        ]}
      />
    );
  }
  return (
    <StepsForm
      onFinish={async (values) => {
        const newValues = { ...values, responseType, tags };
        console.log(tags);
        const success = await handleAdd((newValues as unknown) as newQuestionItem);
        if (success) {
          handleEditModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      }}
      formProps={{
        validateMessages: {
          required: 'This field is required',
        },
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            title="New Question"
            width={800}
            onCancel={() => handleEditModalVisible(false)}
            visible={editModalVisible}
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
        title="Editing Question"
        onFinish={async () => {
          // await waitTime(2000);
          return true;
        }}
      >
        <ProFormSelect
          request={async () => {
            const topics = await queryTopics();
            setTopics(topics);
          }}
          options={topics}
          // initialValue={...selectedQuestion}
          fieldProps={{
            dropdownRender: (menu) => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input
                    style={{ flex: 'auto' }}
                    value={newTopic}
                    onChange={onDropdownTopicChange}
                  />
                  <a
                    style={{ flex: 'none', padding: '4px', display: 'block', cursor: 'pointer' }}
                    onClick={addNewTopic}
                  >
                    <PlusOutlined /> Add item
                  </a>
                </div>
              </div>
            ),
          }}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id="pages.searchTable.topic" defaultMessage="Topic is required" />
              ),
            },
          ]}
          width="sm"
          name="topic"
          label="Topic"
          showSearch
        />
        <ProFormText
          width="xl"
          name="mainQuestion"
          label="Main Question"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.mainQuestion"
                  defaultMessage="Main Question is required"
                />
              ),
            },
          ]}
          placeholder="Please type the main question"
        />
        {/*<ProFormTextArea width="xs" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="sm" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="md" label="Variations" name="variations" />*/}
        {/*<ProFormTextArea width="lg" label="Variations" name="variations" />*/}
        <ProFormTextArea width="xl" label="Variations" name="variations" />
      </StepsForm.StepForm>
      <StepsForm.StepForm name="checkbox" title="Creating Response" form={form}>
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
      <StepsForm.StepForm name="time" title="Configuration (Optional)">
        <div className="ant-row ant-form-item">
          <div className="ant-col ant-form-item-label">
            <label htmlFor="time_questionTime" className="" title="Keyword Tags">
              Keyword Tags
            </label>
          </div>
          <div className="ant-col ant-form-item-control"></div>
        </div>

        <ProFormDateRangePicker width="xl" name="questionTime" label="Question Active Time" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default NewForm;
