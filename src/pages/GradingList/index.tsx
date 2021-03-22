import React, { useContext, useEffect, useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Input, List, message, Modal, Row, Slider, Space, Tag } from 'antd';
import ProProvider from '@ant-design/pro-provider';
import moment from 'moment';
import { readMore } from '@/utils/utils';
import {
  queryTopics,
  queryQuestionsFilter,
  skipMessage,
  updateMessageAnswer,
  queryGradings,
} from './service';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import './index.less';
import { useRequest } from 'umi';
import { queryConversation } from '../ConversationList/service';
import ProCard from '@ant-design/pro-card';
import type { ConversationMessage } from 'models/messages';
import { renderMessageComponent } from '../ConversationList/RenderMessage';

export type TableListItem = {
  key: number;
  name: string;
  creator: string;
  createdAt: number;
};

const ConvoModal: React.FC<{ convoId: TableListItem | null; setConvoId: any }> = ({
  convoId,
  setConvoId,
}) => {
  const { data, loading, pagination } = useRequest(
    ({ current, pageSize }) => {
      return queryConversation(convoId, { current, pageSize });
    },
    {
      refreshDeps: [convoId],
      formatResult: (response) => {
        return { ...response.data, list: response.data.data.reverse() };
      },
      paginated: true,
    },
  );

  return (
    <Modal
      style={{ whiteSpace: 'pre-line' }}
      width={600}
      visible={convoId != null}
      onOk={() => {
        setConvoId(null);
      }}
      onCancel={() => {
        setConvoId(null);
      }}
      footer={null}
    >
      <ProCard ghost>
        <List<ConversationMessage>
          dataSource={data?.list}
          loading={loading}
          pagination={{
            ...(pagination as any),
            onShowSizeChange: pagination.onChange,
            size: 'small',
            position: 'bottom',
          }}
          itemLayout="vertical"
          size="large"
          className="ConvoLog"
          renderItem={(item) => (
            <List.Item key={`message${item.id}`}>
              <Row justify={item.incomingMessageId || item.isBroadcast ? 'end' : 'start'}>
                {renderMessageComponent(
                  item.data,
                  item.type,
                  item.id,
                  item.incomingMessageId != null || item.isBroadcast,
                  item.isBroadcast,
                  '',
                )}
              </Row>
              {item.data.quickReplies ? (
                <Row
                  justify={item.incomingMessageId || item.isBroadcast ? 'end' : 'start'}
                  style={{ marginTop: '10px' }}
                >
                  {renderMessageComponent(
                    item.data,
                    'quickReplies',
                    item.id,
                    item.incomingMessageId != null || item.isBroadcast,
                    item.isBroadcast,
                    '',
                  )}
                </Row>
              ) : (
                <></>
              )}
              <Row justify={item.incomingMessageId || item.isBroadcast ? 'end' : 'start'}>
                <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.45)' }}>
                  {moment(item.createdAt).format('MM-DD HH:mm')}{' '}
                </div>
              </Row>
            </List.Item>
          )}
        />
      </ProCard>
    </Modal>
  );
};

const TagList: React.FC<{
  value?: {
    key: string;
    label: string;
  }[];
  onChange?: (
    value: {
      key: string;
      label: string;
    }[],
  ) => void;
}> = ({ value, onChange }) => {
  const ref = useRef<Input | null>(null);
  const [newTags, setNewTags] = useState<
    {
      key: string;
      label: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    const tempsTags = '[...(value || [])]';
    // if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
    //   tempsTags = [...tempsTags, { key: `new-${tempsTags.length}`, label: inputValue }];
    // }
    onChange?.(tempsTags);
    setNewTags([]);
    setInputValue('');
  };

  return (
    <Space>
      'test'
      <Input
        ref={ref}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </Space>
  );
};

const AccuracySlider: React.FC<{}> = ({ value, onChange }) => {
  // const ref = useRef<Input | null>(null);
  // const [range, setRange] = useState([]);
  //
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value);
  // };
  //
  const handleInputConfirm = () => {
    console.log('submitted');
  };

  return (
    <div className="icon-wrapper">
      <FrownOutlined />
      <Slider
        style={{ margin: '0px 20px 0px 20px' }}
        range
        defaultValue={[0, 100]}
        max={100}
        onAfterChange={(values) => onChange?.(values)}
      />
      <SmileOutlined />
    </div>
  );
};

const handleRemove = async (messageId: string) => {
  const hide = message.loading('Skipping');
  if (!messageId) return true;
  try {
    await skipMessage({
      messageId,
    });
    hide();
    message.success('Message skipped');
    return true;
  } catch (error) {
    hide();
    message.error('Message skipped fail, please retry!');
    return false;
  }
};

export default () => {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [convoId, setConvoId] = useState(null);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const values = useContext(ProProvider);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    queryTopics().then((res) => {
      setTopics(res);
    });
    queryQuestionsFilter('text').then((res) => {
      setQuestions(res);
    });
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      key: 'questionStatus',
      title: 'Status',
      dataIndex: 'status',
      valueType: 'radioButton',
      initialValue: 'Unanswered',
      hideInTable: true,
      hideInDescriptions: true,
      hideInSetting: true,
      hideInForm: true,
      valueEnum: {
        Unanswered: { text: 'Unanswered' },
        Answered: { text: 'Answered' },
      },
    },
    {
      title: 'Message',
      dataIndex: 'text',
      width: '20%',
      editable: false,
      copyable: true,
      render: (_, record) => {
        const tagText = record.data.text ? readMore(record.data.text, 15) : 'ux';
        return (
          <a
            onClick={() => {
              setConvoId(record.chatbot.convoId);
            }}
          >
            {tagText}
          </a>
        );
      },
    },
    {
      title: 'User',
      dataIndex: 'fullname',
      hideInSearch: true,
      editable: false,
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      valueType: 'select',
      editable: false,
      valueEnum: topics,
      render: (_, record) => {
        return record.answerQuestion?.topic ? record.answerQuestion.topic : '-';
      },
    },
    {
      title: 'Date',
      key: 'since',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      editable: false,
      width: '10%',
      render: (dom, record) => {
        return moment(record.createdAt).format('yyyy-MM-DD');
      },
    },
    {
      title: 'Accuracy',
      dataIndex: 'accuracy',
      valueType: 'accuracyRange',
      editable: false,
      width: '7%',
      tooltip: '* signifies the response of the question is changed',
      render: (dom, record) => {
        const unanswered = !(
          record.nlp?.nlpResponse?.matchedQuestions?.length > 0 || record?.chatbot?.qnid
        );
        const graded = record?.adminportal?.graded ? '*' : '';
        return unanswered
          ? '-'
          : `${graded + (record.nlp.nlpResponse.matchedQuestions?.[0]?.score * 100).toFixed(2)}%`;
      },
    },
    {
      title: 'Question',
      dataIndex: 'questionResponse',
      ellipsis: true,
      valueType: 'select',
      hideInSearch: true,
      valueEnum: questions,
      render: (dom, record) => {
        const unanswered = !(
          record.nlp?.nlpResponse?.matchedQuestions?.length > 0 || record?.chatbot?.qnid
        );
        return unanswered ? '-' : `${record.answerQuestion?.text.EN}`;
      },
    },
    {
      title: 'Response',
      dataIndex: 'decs',
      hideInSearch: true,
      editable: false,
      render: (dom, record) => {
        const unanswered = !(
          record.nlp?.nlpResponse?.matchedQuestions?.length > 0 || record?.chatbot?.qnid
        );
        let tagColour;
        let tagKey;
        let tagText;
        if (unanswered) {
          tagColour = 'default';
          tagKey = 'Unanswered';
          tagText = '-';
        } else if (record.answerFlow?.name) {
          // valid flow
          tagColour = 'green';
          tagKey = 'Flow';
          tagText = record.answerFlow.name;
        } else {
          // unnamed text flow
          tagColour = 'magenta';
          tagKey = 'Text';
          tagText = (record.answerFlow?.flow[0].data.text as any)?.EN
            ? readMore((record.answerFlow?.flow[0].data.text as any).EN, 10)
            : `[${record.answerFlow.flow[0].data.type}]`;
          // tagText = (record.answerFlow.flow[0].data.text as any).EN;
        }
        return (
          <Space>
            <Tag color={tagColour} key={record.answerFlow?.id}>
              {tagKey}
            </Tag>
            {tagText}
          </Space>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      width: '10%',
      render: (text, record, _, action) => {
        const unanswered = !(
          record.nlp?.nlpResponse?.matchedQuestions?.length > 0 || record?.chatbot?.qnid
        );
        const skip = (
          <a
            key="delete"
            onClick={async () => {
              await handleRemove(record.id);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Skip
          </a>
        );
        const edit = (
          <a
            key="editable"
            onClick={() => {
              action.startEditable?.(record.id);
            }}
          >
            Edit
          </a>
        );
        const availableAction = unanswered ? [edit, skip] : [edit];
        return [availableAction];
      },
    },
  ];

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: {
          accuracyRange: {
            renderFormItem: (text, props) => <AccuracySlider {...props} {...props?.fieldProps} />,
          },
          tags: {
            render: (text) => {
              return (
                <>
                  {[text].flat(1).map((item) => (
                    <Tag key={item.value}>{item.label}</Tag>
                  ))}
                </>
              );
            },
            renderFormItem: (text, props) => <TagList {...props} {...props?.fieldProps} />,
          },
        },
      }}
    >
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        // request={async (params, sorter, filter) => {
        //   return queryGradings({ sorter, filter, ...params });
        // }}
        request={async (params, sorter, filter) => queryGradings({ sorter, filter, ...params })}
        rowKey="id"
        editable={{
          editableKeys,
          type: 'single',
          onSave: async (_, newLine) => {
            const hide = message.loading('Saving');
            try {
              await updateMessageAnswer({
                messageId: newLine.id,
                messageResponse: newLine.questionResponse,
                messageText: newLine.data.text,
              });
              hide();
              message.success('Response saved');
              // return true;
            } catch (error) {
              hide();
              message.error('Response save fail, please retry!');
              // return false;
            }
            actionRef.current?.reloadAndRest?.();
          },
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
          onChange: setEditableRowKeys,
        }}
        pagination={{
          showQuickJumper: true,
        }}
        search={{
          filterType: 'light',
        }}
        dateFormatter="string"
        headerTitle="Gradings"
        // toolBarRender={() => [
        //   <Button type="primary" key="primary">
        //     Submit
        //   </Button>,
        // ]}
      />

      <ConvoModal convoId={convoId} setConvoId={setConvoId} />
    </ProProvider.Provider>
  );
};
