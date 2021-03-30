import React, { useEffect, useState } from 'react';
import {
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';
import { Divider, Input, message, Modal, Radio } from 'antd';
import type { DropdownProps, newQuestionItem, QuestionListItem } from '../data.d';
import type { ActionType } from '@ant-design/pro-table';
import { editQuestion, queryFlowsFilter, queryTopics } from '@/pages/QuestionList/service';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import moment from 'moment';
import { useRequest } from 'umi';

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
  showDetail: boolean;
  setShowDetail: (modalVisible: boolean) => void;
  values: Partial<QuestionListItem> | undefined;
  setCurrentRow: (item: QuestionListItem | undefined) => void;
};

const handleEdit = async (fields: newQuestionItem) => {
  const hide = message.loading('Editing');
  try {
    await editQuestion({ ...fields });
    hide();
    message.success('Edit success');
    return true;
  } catch (error) {
    hide();
    message.error('Edit fail, please retry!');
    return false;
  }
};

const NewForm: React.FC<NewFormProps> = ({
  editModalVisible,
  handleEditModalVisible,
  showDetail,
  setShowDetail,
  actionRef,
  values,
  setCurrentRow,
}) => {
  const [responseType, setResponseType] = useState<string>();
  const [newTopic, setNewTopic] = useState<string>('');
  const [flow, setFlow] = useState<string>('');
  const [topics, setTopics] = useState<DropdownProps[]>([]);
  const [questionBody, setQuestionBody] = useState({});
  const dateFormat = 'YYYY/MM/DD';
  const onDropdownTopicChange = (event: any) => {
    setNewTopic(event.target.value);
  };

  useEffect(() => {
    if (values) {
      let listVariations: string[] = [];

      // alternate questions
      if (values.alternateQuestions) {
        values.alternateQuestions.forEach((varEntry) => {
          if (varEntry.language === 'EN') {
            listVariations.push(varEntry.text);
          }
        });
      }

      const responseSelect = values.answerFlow?.name ? 'flow' : 'text';
      const flowResponseId = responseSelect === 'flow' ? flow : null;
      console.log(flow)

      const body = {
        id: values.id,
        [`${responseSelect}Response`]: flowResponseId || values.answerFlow?.flow[0].data.text?.EN,
        mainQuestion: values.text?.EN,
        responseSelect,
        topic: values.topic,
        variations: listVariations.join('\n'),
        tags: values.keyword || [],
        questionTime: values.activeAt
          ? [moment(values.activeAt, dateFormat), moment(values.expireAt, dateFormat)]
          : [],
      };
      setResponseType(body.responseSelect);
      setQuestionBody(body);
    }
  }, [editModalVisible]);

  const { data, refresh } = useRequest(queryTopics, 
    {
      formatResult: (response) => {
        console.log('response', response)
        return [ ...topics, ...response.data];
      }
    });
    
  const addNewTopic = () => {
    if (newTopic === '') return 
    const topic: DropdownProps = { id: newTopic, value: newTopic, label: newTopic };
    setTopics([topic, ...topics]);
    setNewTopic('');
    refresh();
  };

  let responseArea;
  if (responseType === 'text') {
    responseArea = (
      <ProFormTextArea
        width="xl"
        label="Response"
        name="textResponse"
      />
    );
  } else {
    responseArea = (
      <ProFormSelect
        width="xl"
        name="flowResponse"
        label="Response"
        showSearch
        fieldProps={{ onSelect: (e, option) => {
          setFlow(option.id)
        }}}
        // @ts-ignore
        request={async () => {
          return await queryFlowsFilter('name,params');
        }}
      />
    );
  }
  return (
    <StepsForm
      onFinish={async (valueStore) => {
        const newValues = { ...valueStore, responseType, id: questionBody.id, flowResponse: flow };
        const success = await handleEdit((newValues as unknown) as newQuestionItem);
        if (success) {
          handleEditModalVisible(false);
          setShowDetail(false);
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
            title="Edit Question"
            width={800}
            onCancel={() => {
              if (!showDetail) setCurrentRow(undefined);
              handleEditModalVisible(false);
            }}
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
        initialValues={{ ...questionBody }}
        name="base"
        title="Creating Question"
        onFinish={async () => {
          return true;
        }}
      >
        <ProFormSelect
          options={data}
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
        <ProFormTextArea width="xl" label="Variations" name="variations" />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="checkbox"
        title="Creating Response"
        initialValues={{ ...questionBody }}
      >
        <div className="ant-row ant-form-item">
          <div className="ant-col ant-form-item-label">
            <label title="Type of Response">Type of Response</label>
          </div>
          <div className="ant-col ant-form-item-control">
            <Radio.Group
              onChange={(event) => setResponseType(event.target.value)}
              defaultValue={questionBody.responseSelect}
              name="responseSelect"
            >
              <Radio.Button value="text">Text</Radio.Button>
              <Radio.Button value="flow">Flow</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        {responseArea}
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="time"
        title="Configuration (Optional)"
        initialValues={{ ...questionBody }}
      >
        <div className="ant-row ant-form-item">
          <div className="ant-col ant-form-item-label">
            <label htmlFor="time_questionTime" className="" title="Keyword Tags">
              Keyword Tags
            </label>
          </div>
          <div className="ant-col ant-form-item-control">
            <ProFormSelect
              name="tags"
              label="Keywords"
              fieldProps={{
                mode: 'tags',
              }}
              width="lg"
            />
          </div>
        </div>

        <ProFormDateRangePicker width="xl" name="questionTime" label="Question Active Time" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default NewForm;
