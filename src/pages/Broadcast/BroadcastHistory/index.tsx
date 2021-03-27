import { Card, Form, Tag, Tooltip, Progress, Row, Switch, Col, Button } from 'antd';
import React, { FC, useState } from 'react';
import { useIntl, useRequest, FormattedMessage } from 'umi';

import type { ProColumns } from '@ant-design/pro-table';
import { BroadcastHistoryItem, BroadcastHistoryListItem } from './data';
import styles from './style.less';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';

import { PageContainer } from '@ant-design/pro-layout';
import TagSelect from '../../../components/TagSelect';
import StandardFormRow from '../components/StandardFormRow';
import BroadcastHistoryDrawer from './components/broadcastHistoryDrawerColumns';
import { getTags } from '../components/BroadcastMeta/service';
import { queryBroadcastHistory, queryBroadcastHistoryList } from './service';

const { CheckableTag } = Tag;
const FormItem = Form.Item;

const BroadcastHistory: FC = () => {
  const { data, loading, run } = useRequest((values: any) => {
    return queryBroadcastHistoryList(values);
  });

  const list = data ? data : [];

  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<BroadcastHistoryItem | undefined>(undefined);

  const onClose = () => {
    setVisible(false);
  };

  const { run: postRun } = useRequest(
    (id: string) => {
      return queryBroadcastHistory(id);
    },
    {
      manual: true,
      onSuccess: (result) => {
        setCurrent(result);
      },
    },
  );

  const { data: tags } = useRequest(getTags);

  const intl = useIntl();

  const columns: ProColumns<BroadcastHistoryListItem>[] = [
    {
      title: <FormattedMessage id="pages.broadcast.author.authorLabel" defaultMessage="Author" />,
      hideInSearch: true,
      dataIndex: 'createdBy',
      render: (_, object) => {
        return object.createdBy.username;
      },
    },
    {
      title: (
        <FormattedMessage id="pages.broadcast.sendAt.sendAtLabel" defaultMessage="Broadcast Time" />
      ),
      dataIndex: 'sendAt',
      valueType: 'dateTimeRange',
      hideInSearch: true,
      sorter: (a, b) => a.total - b.total,
      render: (_, object) => {
        return moment(object.sendAt).format('yyyy-MM-DD HH:mm');
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleTags" defaultMessage="Tags" />,
      hideInSearch: true,
      render: (_, object, index) => (
        <>
          {object.sendToAll ? (
            <Tag color="green" key="everyone">
              Everyone
            </Tag>
          ) : (
            ''
          )}
          {object.tags.map((tag) => {
            return (
              <Tag color="geekblue" key={index + 'tag' + tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
          {object.exclude.map((tag) => {
            return (
              <Tag color="red" key={index + 'tag' + tag}>
                {'- ' + tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        Completed: {
          text: (
            <FormattedMessage id="pages.broadcast.status.completed" defaultMessage="Completed" />
          ),
          status: 'Success',
        },
        Sending: {
          text: <FormattedMessage id="pages.broadcast.status.sending" defaultMessage="Sending" />,
          status: 'Processing',
        },
        Scheduled: {
          text: (
            <FormattedMessage id="pages.broadcast.status.scheduled" defaultMessage="Scheduled" />
          ),
          status: 'Warning',
        },
        Failed: {
          text: <FormattedMessage id="pages.broadcast.status.failed" defaultMessage="Failed" />,
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.broadcast.reach.reachLabel" defaultMessage="Reach" />,
      dataIndex: 'total',
      hideInSearch: true,
      sorter: (a, b) => a.total - b.total,
      render: (_, object) => (
        <>
          <Tooltip title={object.sent + ' / ' + object.total}>
            <Progress
              percent={(object.processed * 100) / object.total}
              success={{ percent: (object.sent * 100) / object.total }}
              strokeColor="red"
              showInfo={false}
            />
          </Tooltip>
        </>
      ),
    },
    {
      title: <FormattedMessage id="pages.broadcast.view.viewLabel" defaultMessage="View" />,
      hideInSearch: true,
      valueType: 'option',
      render: (_, record) => [
        <a
          key="viewButton"
          onClick={() => {
            setVisible(true);
            postRun(record.id);
          }}
        >
          <FormattedMessage id="pages.broadcast.view" defaultMessage="View" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <div className={styles.coverCardList}>
        <Card bordered={false}>
          <Form
            layout="inline"
            initialValues={{}}
            onValuesChange={(_, values) => {
              run(values);
            }}
          >
            <StandardFormRow title="Tags" block>
              {/* <Row>
                <Col span={2}>
                  <FormItem name="intersect">
                    <Switch checkedChildren="ALL" unCheckedChildren="OR" />
                  </FormItem>
                </Col> */}
              <FormItem name="tags">
                {/* <Button key='tagClear' size='small' type='link' >Clear</Button>
                    {tags && tags.map((tag) =>
                      <CheckableTag key={'allTag' + tag} checked={false}>{tag}</CheckableTag>)} */}
                <TagSelect>
                  {tags &&
                    tags.map((tag, index) => (
                      <TagSelect.Option value={tag} key={'tagsSelect' + index}>
                        {tag}
                      </TagSelect.Option>
                    ))}
                </TagSelect>
              </FormItem>
              {/* </Row> */}
            </StandardFormRow>
            <StandardFormRow title="Status" last>
              <Row>
                <FormItem name="status">
                  <TagSelect hideCheckAll singleOption>
                    <TagSelect.Option value="completed">Completed</TagSelect.Option>
                    <TagSelect.Option value="sending">Sending</TagSelect.Option>
                    <TagSelect.Option value="scheduled">Scheduled</TagSelect.Option>
                    <TagSelect.Option value="failed">Failed</TagSelect.Option>
                  </TagSelect>
                </FormItem>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
      </div>
      <ProTable<BroadcastHistoryListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.broadcast.history',
          defaultMessage: 'Broadcast History',
        })}
        rowKey="id"
        search={false}
        loading={loading}
        dataSource={list}
        columns={columns}
      />

      <BroadcastHistoryDrawer visible={visible} current={current} onClose={onClose} />
    </PageContainer>
  );
};

export default BroadcastHistory;
