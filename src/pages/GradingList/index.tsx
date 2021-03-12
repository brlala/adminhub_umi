import React, { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { Button, Space, Tag, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { readMore } from '@/utils/utils';

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
    abbr: 'gelm2prod',
    senderId: '6002a710c530075070967bff',
    receiverId: '5c78f794df78b45f7f8c6a5e',
    createdAt: '2021-02-23T13:17:16.682000+08:00',
    nlp: {
      nlpResponse: {
        matchedQuestions: [
          {
            score: 0.9277533888816833,
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
  },
  // {
  //   id: 624691229,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 62474850,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 62469122,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 6247485,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 6246912,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 624748,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 624691,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 62474,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 62469,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 6247,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 6246,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 624,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 625,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 62,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 61,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 60,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 1,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 2,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 3,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
  // {
  //   id: 4,
  //   title: '活动名称一',
  //   decs: '这个活动真好玩',
  //   state: 'open',
  //   created_at: '2020-05-26T09:42:56Z',
  // },
  // {
  //   id: 5,
  //   title: '活动名称二',
  //   decs: '这个活动真好玩',
  //   state: 'closed',
  //   created_at: '2020-05-26T08:19:22Z',
  // },
];

export type TableListItem = {
  key: number;
  name: string;
  creator: string;
  createdAt: number;
};
const tableListDataSource: TableListItem[] = [];
const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];
for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    creator: creators[Math.floor(Math.random() * creators.length)],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
  });
}
const columns: ProColumns<TableListItem>[] = [
  {
    title: 'Message',
    dataIndex: 'text',
    width: '25%',
    render: (_, entity) => <a>{readMore((entity.answerFlow.flow[0].data.text as any).EN, 10)}</a>,
  },
  {
    title: 'User',
    dataIndex: 'fullname',
    hideInSearch: true,
  },
  {
    title: 'Topic',
    dataIndex: 'creator',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部' },
      付小小: { text: '付小小' },
      曲丽丽: { text: '曲丽丽' },
      林东东: { text: '林东东' },
      陈帅帅: { text: '陈帅帅' },
      兼某某: { text: '兼某某' },
    },
    render: (_, entity) => entity.answerFlow.topic,
  },
  {
    title: 'Date',
    key: 'since',
    dataIndex: 'createdAt',
    valueType: 'dateRange',
    render: (dom, entity) => {
      return moment(entity.createdAt).format('yyyy-MM-DD HH:mm:ss');
    },
  },
  {
    title: 'Accuracy',
    dataIndex: 'accuracy',
    valueType: 'checkbox',
    editable: false,
    render: (dom, entity) => {
      return `${(entity.nlp.nlpResponse.matchedQuestions?.[0].score * 100).toFixed(2)}%`;
    },
  },
  {
    title: 'Response',
    dataIndex: 'decs',
    editable: false,
    hideInSearch: true,
    render: (dom, entity) => {
      let tagColour;
      let tagKey;
      let tagText;
      if (entity.answerFlow?.name) {
        // valid flow
        tagColour = 'green';
        tagKey = 'Flow';
        tagText = entity.answerFlow.name;
      } else {
        // unnamed text flow
        tagColour = 'magenta';
        tagKey = 'Text';
        tagText = readMore((entity.answerFlow.flow[0].data.text as any).EN, 15);
        // tagText = (entity.answerFlow.flow[0].data.text as any).EN;
      }
      return (
        <Space>
          <Tag color={tagColour} key={entity.answerFlow?.id}>
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
    render: () => [<a key="delete">Skip</a>],
  },
];
export default () => {
  const [flows, setFlows] = useState([]);

  // useEffect(() => {
  //   if (form && !visible) {
  //     form.resetFields();
  //     setTemplateComponent([]);
  //   }
  // }, [visible]);

  return (
    <ProTable<TableListItem>
      columns={columns}
      request={(params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        console.log(params, sorter, filter);
        return Promise.resolve({
          data: defaultData,
          success: true,
        });
      }}
      rowKey="key"
      pagination={{
        showQuickJumper: true,
      }}
      search={{
        filterType: 'light',
      }}
      dateFormatter="string"
      headerTitle="Gradings"
      toolBarRender={() => [
        <Button type="primary" key="primary">
          Submit
        </Button>,
      ]}
    />
  );
};
