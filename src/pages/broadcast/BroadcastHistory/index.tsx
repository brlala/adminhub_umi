import { Card, Button, Form, List, Typography, message, Drawer, Tag } from 'antd';
import React, { FC, useState } from 'react';
import { Link, useIntl, useRequest, FormattedMessage } from 'umi';

import type { ProColumns, ActionType } from '@ant-design/pro-table';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import { BroadcastHistoryListItem, BroadcastHistoryItem } from './data.d';
import TemplateModal from './components/TemplateModal';
import styles from './style.less';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { queryBroadcastHistory, queryBroadcastHistoryList } from './service';
import ProDescriptions from '@ant-design/pro-descriptions';
import BroadcastHistoryDrawer from './components/BroadcastHistoryDrawer';

const FormItem = Form.Item;
const { Paragraph } = Typography;


const BroadcastHistory: FC = () => {

  const { data, loading, run } = useRequest((values: any) => {
    return queryBroadcastHistoryList(values);
  });

  const list = data? data : [];

  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BroadcastHistoryListItem> | undefined>(undefined);
  
  const onClose = () => {
    setVisible(false);
  };

  const { run: postRun } = useRequest(
    (id: string) => {
      console.log(id)
      return queryBroadcastHistory(id);
    }, {
      manual: true,
      onSuccess: (result) => {
        setCurrent(result);
      }
    }
  );
  
  const intl = useIntl();
  
  const columns: ProColumns<BroadcastHistoryListItem>[] = [
    {
      title: <FormattedMessage id="pages.broadcast.author.authorLabel" defaultMessage="Author" />,
      hideInSearch: true,
      dataIndex: 'createdBy'
    },
    {
      title: <FormattedMessage id="pages.broadcast.sendAt.sendAtLabel" defaultMessage="Broadcast Time" />,
      dataIndex: 'sendAt',
      valueType: 'dateTimeRange',
      sorter: (a, b) => a.total - b.total,
      render: (_, object) => {
        return moment(object.sendAt).format('yyyy-MM-DD HH:mm');
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        'Completed': {
          text: (
            <FormattedMessage id="pages.broadcast.status.completed" defaultMessage="Completed" />
          ),
          status: 'Success',
        },
        'Sending': {
          text: (
            <FormattedMessage id="pages.broadcast.status.sending" defaultMessage="Sending" />
          ),
          status: 'Processing',
        },
        'Scheduled': {
          text: (
            <FormattedMessage id="pages.broadcast.status.scheduled" defaultMessage="Scheduled" />
          ),
          status: 'Warning',
        },
        'Failed': {
          text: (
            <FormattedMessage id="pages.broadcast.status.failed" defaultMessage="Failed" />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.broadcast.reach.reachLabel" defaultMessage="Reach" />,
      dataIndex: 'total',
      hideInSearch: true,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleTags" defaultMessage="Tags" />,
      dataIndex: 'tags',
      hideInSearch: true,
      render: (_, object) => (
        <>
          {object.tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: <FormattedMessage id="pages.broadcast.view.viewLabel" defaultMessage="View" />,
      hideInSearch: true,
      valueType: 'option',
      render: (_, record) => [
        <a key="viewButton" onClick={() => {setVisible(true); postRun(record.id)}}>
          <FormattedMessage id="pages.broadcast.view" defaultMessage="View" />
        </a>,
      ],
    },
  ];

  console.log( columns )
  console.log( list )

  return <div className={styles.coverCardList}>
      <Card bordered={false}>
        <Form
          layout="inline"
          initialValues={{
          }}
          onValuesChange={(_, values) => {
            run(values);
          }}
        >
          <StandardFormRow title="Tags" block style={{ paddingBottom: 11 }}>
            <FormItem name="tags">
              <TagSelect>
                <TagSelect.Option value="Pandai">Pandai</TagSelect.Option>
                <TagSelect.Option value="BBL">BBL</TagSelect.Option>
                <TagSelect.Option value="RMs">RMs</TagSelect.Option>
              </TagSelect>
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="Status" block style={{ paddingBottom: 11 }}>
            <FormItem name="status">
              <TagSelect>
                <TagSelect.Option value="completed">Completed</TagSelect.Option>
                <TagSelect.Option value="sending">Sending</TagSelect.Option>
                <TagSelect.Option value="scheduled">Scheduled</TagSelect.Option>
                <TagSelect.Option value="failed">Failed</TagSelect.Option>
              </TagSelect>
            </FormItem>
          </StandardFormRow>
        </Form>
      </Card>

      <ProTable<BroadcastHistoryListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '查询表格',
        })}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        loading={loading}
        dataSource={list}
        columns={columns}
      />
      
      <BroadcastHistoryDrawer 
        visible={visible}
        current={current}
        onClose={onClose}
      />
    </div>
};

export default BroadcastHistory;









