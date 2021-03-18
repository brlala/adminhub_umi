import React, { useContext, useEffect, useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { ActionType, TableDropdown } from '@ant-design/pro-table';
import { Button, Input, message, Slider, Space, Tag, Tooltip } from 'antd';
import ProProvider from '@ant-design/pro-provider';
import moment from 'moment';
import { readMore } from '@/utils/utils';
import { queryTopics, queryQuestionsFilter, skipMessage, queryGradings } from './service';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import './index.less';
import { queryQuestions } from '@/pages/QuestionList/service';

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};
const defaultData: DataSourceType[] = [
  {
    id: '60348fdc157827006929ab6c',
    type: 'message',
    data: {
      text: 'easipay',
    },
    chatbot: {
      convoId: '5575089b-59d8-436c-9a54-f59e7697910e',
    },
    platform: 'facebook',
    senderPlatformId: '3677170722322187',
    receiverPlatformId: '308535416459823',
    isBroadcast: false,
    abbr: 'gelm2prod',
    senderId: '6002a710c530075070967bff',
    receiverId: '5c78f794df78b45f7f8c6a5e',
    createdAt: '2021-02-23T13:17:16.682000+08:00',
    nlp: {
      nlpResponse: {
        matchedQuestions: [
          {
            score: 1,
            questionId: '5cb944dfc2565a4034eb1c09',
            questionText: 'Show {form}',
            questionTopic: 'Forms',
          },
          {
            score: 1,
            questionId: '5d089461a38e6703a71ed4b2',
            questionText: 'EasiPay Menu',
            questionTopic: 'Quick Menu',
          },
          {
            score: 0.9277533888816833,
            questionId: '5cf8ee82a38e6703829ffeac',
            questionText:
              'How to submit the {epay_attribute-value=[c957d00e-d069-471c-b8bc-fe5de606c20a]} form?',
            questionTopic: 'Taxonomy - ePay, Easipay, GIRO, Direct Credit',
          },
        ],
      },
    },
    fullname: 'Yasodharran Krishnan',
    answerFlow: {
      id: '5d089432a38e6703a71ed4b0',
      createdAt: '2019-06-18T15:35:14.061000+08:00',
      createdBy: '5c131cc62aca8e52100a8acb',
      updatedAt: '2019-08-20T11:10:54.397000+08:00',
      updatedBy: '5c131cc62aca8e52100a8acb',
      topic: 'EasiPay FAQ',
      isActive: true,
      name: 'Easipay Quick Jump',
      flow: [
        {
          type: 'message',
          data: {
            quickReplies: [
              {
                text: {
                  EN: 'FAQ',
                },
                payload: {
                  flowId: '5cc86e1da38e676f55fed6b4',
                  params: ['EasiPay FAQ', '0'],
                },
              },
              {
                text: {
                  EN: 'Form',
                },
                payload: {
                  flowId: '5d2dda53a38e670397d216cc',
                  params: ['psf16'],
                },
              },
            ],
            text: {
              EN: 'What would you like to know about Easi-pay?\n',
            },
          },
        },
      ],
      type: 'storyboard',
      platforms: ['facebook'],
      params: [],
    },
    answerQuestion: {
      triggered_count: 3546,
      id: '5d089461a38e6703a71ed4b2',
      created_at: '2019-06-18T15:36:01.332000+08:00',
      created_by: '5c131cc62aca8e52100a8acb',
      updated_at: '2019-08-05T11:48:40.517000+08:00',
      updated_by: '5d23f0b09bb5850f4529d462',
      text: {
        EN: 'EasiPay Menu',
      },
      internal: false,
      answers: [
        {
          id: '1',
          flow: {
            params: [],
            flow_id: '5d089432a38e6703a71ed4b0',
          },
          bot_user_group: '1',
        },
      ],
      alternate_questions: [
        {
          id: 'e1fc93c2-0396-460f-b794-737967a3913e',
          text: 'Email the easi pay',
          language: 'EN',
          internal: false,
        },
        {
          id: '14d1191f-b7b3-4b83-8fbf-994f70c325e8',
          text: 'E payment',
          language: 'EN',
          internal: false,
        },
        {
          id: '4168434d-fd54-4004-b772-87485a0da056',
          text: 'Pls send easi pay form to mykhlim@gmail.com',
          language: 'EN',
          internal: false,
        },
        {
          id: '72f6ba02-311e-4d8c-8b23-5247547e8c6a',
          text: 'Eazy paid form',
          language: 'EN',
          internal: false,
        },
        {
          id: '21473038-bc20-45d8-856a-c6f4a6984764',
          text: 'easi pay',
          language: 'EN',
          internal: false,
        },
      ],
      topic: 'Quick Menu',
      is_active: true,
    },
  },
  {
    id: '603489fd157827006929aae1',
    type: 'message',
    data: {
      text: 'Thank you Gesica',
    },
    chatbot: {
      convoId: '0bd6d30a-49ea-4a96-814d-835392f2e3db',
    },
    platform: 'facebook',
    senderPlatformId: '2930975750260772',
    receiverPlatformId: '308535416459823',
    isBroadcast: false,
    abbr: 'gelm2prod',
    senderId: '5cdccd848a56e376756a507f',
    receiverId: '5c78f794df78b45f7f8c6a5e',
    createdAt: '2021-02-23T12:52:13.179000+08:00',
    nlp: {
      nlpResponse: {
        matchedQuestions: [
          {
            score: 1,
            questionId: '5ef186b9ace28f43f1900e41',
            questionText: 'Thank you mate',
            questionTopic: 'Chitchat / Feedback',
          },
        ],
      },
    },
    fullname: 'Michelle Cheong',
    answerFlow: {
      id: '5ef2903f5706441fd5073a32',
      createdAt: '2020-06-24T07:29:03.665000+08:00',
      createdBy: '5e6217be51cc760b8677707e',
      updatedAt: '2020-06-24T07:29:03.665000+08:00',
      updatedBy: '5e6217be51cc760b8677707e',
      isActive: true,
      flow: [
        {
          type: 'message',
          data: {
            text: {
              EN: 'You are welcome, {name}. I am glad that I could help you 😊',
            },
          },
        },
      ],
      type: 'storyboard',
      platforms: ['facebook'],
    },
    answerQuestion: {
      triggered_count: 1150,
      id: '5ef186b9ace28f43f1900e41',
      created_at: '2020-06-23T12:36:09.547000+08:00',
      created_by: '5e6217be51cc760b8677707e',
      updated_at: '2020-06-24T07:29:03.715000+08:00',
      updated_by: '5e6217be51cc760b8677707e',
      text: {
        EN: 'Thank you mate',
      },
      internal: false,
      answers: [
        {
          id: '1',
          flow: {
            flow_id: '5ef2903f5706441fd5073a32',
          },
          bot_user_group: '1',
        },
      ],
      alternate_questions: [
        {
          id: '0d23e48c-2d60-4cf4-9090-c7b418d96e9a',
          text: 'Terima kasihhh',
          language: 'EN',
          internal: false,
        },
        {
          id: '3e50207f-e8f1-4072-99b3-5b17f1d909ad',
          text: 'Terima kasihh',
          language: 'EN',
          internal: false,
        },
        {
          id: 'c29f5db1-ac34-450a-9228-2311c15afe9c',
          text: 'Terima kaseh',
          language: 'EN',
          internal: false,
        },
        {
          id: '3c1363ae-df1f-410d-83b3-5d0243539eb0',
          text: 'Trm ksh',
          language: 'EN',
          internal: false,
        },
        {
          id: '59f2b5c8-9ce1-4ceb-a53a-80ab7e10093f',
          text: 'Terima kasih',
          language: 'EN',
          internal: false,
        },
        {
          id: 'fb32e6a5-532e-46cb-ba41-b5d72cabe47b',
          text: 'Thank much gesica',
          language: 'EN',
          internal: false,
        },
        {
          id: '2034495e-88de-4c06-b729-eeb6fcd5969c',
          text: 'Tks so much',
          language: 'EN',
          internal: false,
        },
        {
          id: 'a34493b5-f7bd-4571-b8bc-369faa595eca',
          text: 'Thank lots pal',
          language: 'EN',
          internal: false,
        },
        {
          id: 'ee37b8e8-3ebe-45b5-b016-1bc4b79171d6',
          text: 'Tks a lot gesica',
          language: 'EN',
          internal: false,
        },
        {
          id: '1a09a0f5-02f7-4d06-a451-13540af69c33',
          text: 'Thank yes',
          language: 'EN',
          internal: false,
        },
        {
          id: '995542ec-0bc4-42d5-b05f-14d9a3e532ce',
          text: 'Tks you pal',
          language: 'EN',
          internal: false,
        },
        {
          id: 'cb75f99f-394b-444a-af04-9b6bdb121ce7',
          text: 'Thank you gesica',
          language: 'EN',
          internal: false,
        },
        {
          id: 'c4b28f15-baeb-4650-97ac-dcbfc25478cf',
          text: 'Thanks',
          language: 'EN',
          internal: false,
        },
        {
          id: 'b3e9b1f5-f2e3-41d0-ae21-cbeaa5ec5941',
          text: 'Ok thank you very much',
          language: 'EN',
          internal: false,
        },
        {
          id: '495681ec-0294-4ca7-8c31-050e66f066fd',
          text: 'Appreciate it',
          language: 'EN',
          internal: false,
        },
        {
          id: '760bcc48-da86-4253-9cb1-20308a3c3384',
          text: 'Thanks a lot',
          language: 'EN',
          internal: false,
        },
        {
          id: 'b08e51a9-9ba6-47d9-982f-d1b7eb1380ce',
          text: 'Thanks much',
          language: 'EN',
          internal: false,
        },
        {
          id: 'd2b5abd2-1682-4017-83fd-6208b38305ac',
          text: 'Thank you very much',
          language: 'EN',
          internal: false,
        },
        {
          id: '17554f61-0b09-484a-ab76-e39ff95ef9af',
          text: 'Ok thks very much gesica',
          language: 'EN',
          internal: false,
        },
        {
          id: '341c79e0-515b-4758-ae02-3224a4636fd8',
          text: 'Thx pal',
          language: 'EN',
          internal: false,
        },
        {
          id: '405671bb-ff15-4725-881c-20c7a3b6fc99',
          text: 'Got it cheers alot buddy',
          language: 'EN',
          internal: false,
        },
        {
          id: '72c60e51-7102-4d73-b5be-7b6e647af863',
          text: 'Thanks a lot mate',
          language: 'EN',
          internal: false,
        },
      ],
      topic: 'Chitchat / Feedback',
      is_active: true,
    },
  },
  {
    id: '60348edd157827006929ab67',
    type: 'message',
    data: {
      text: 'aedes',
    },
    chatbot: {
      convoId: '9a2bd027-7830-4b35-84e6-3efa97e843ad',
    },
    platform: 'facebook',
    senderPlatformId: '2225562747524493',
    receiverPlatformId: '308535416459823',
    abbr: 'gelm2prod',
    senderId: '5c7770008a56e30921c6f5b4',
    receiverId: '5c78f794df78b45f7f8c6a5e',
    createdAt: '2021-02-23T13:13:01.342000+08:00',
    nlp: {
      nlpResponse: {
        matchedQuestions: [],
      },
    },
    fullname: 'Vickie Lim',
  },
];

export type TableListItem = {
  key: number;
  name: string;
  creator: string;
  createdAt: number;
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
    let tempsTags = '[...(value || [])]';
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
      messageId: messageId,
    });
    hide();
    message.success('Message skipped');
    return true;
  } catch (error) {
    hide();
    message.error('Delete fail, please retry!');
    return false;
  }
};

export default () => {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
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
        return tagText;
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
        return record.answerFlow?.topic ? record.answerFlow.topic : '-';
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
        return moment(record.createdAt).format('yyyy-MM-DD HH:mm:ss');
      },
    },
    {
      title: 'Accuracy',
      dataIndex: 'accuracy',
      valueType: 'accuracyRange',
      editable: false,
      width: '5%',
      render: (dom, record) => {
        const unanswered = !(record.nlp?.nlpResponse?.matchedQuestions?.length > 0);
        return unanswered
          ? '-'
          : `${(record.nlp.nlpResponse.matchedQuestions?.[0]?.score * 100).toFixed(2)}%`;
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
        const unanswered = !(record.nlp?.nlpResponse?.matchedQuestions?.length > 0);
        return unanswered ? '-' : `${record.answerQuestion?.text.EN}`;
      },
    },
    {
      title: 'Response',
      dataIndex: 'decs',
      hideInSearch: true,
      editable: false,
      render: (dom, record) => {
        const unanswered = !(record.nlp?.nlpResponse?.matchedQuestions?.length > 0);
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
            ? readMore((record.answerFlow.flow[0].data.text as any).EN, 10)
            : 'ux';
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
        const unanswered = !(record.nlp?.nlpResponse?.matchedQuestions?.length > 0);
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
          type: 'single',
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
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
    </ProProvider.Provider>
  );
};
