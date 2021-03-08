import React, { FC } from 'react';
import { Space, Drawer, Tag, Tooltip, Progress, Button, List } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { FormattedMessage, Link } from 'umi';
import { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import { BroadcastHistoryItem } from '../../data';
import PhonePreview from '@/components/PhonePreview';

interface OperationDrawerProps {
  visible: boolean;
  current: BroadcastHistoryItem | undefined;
  onClose: () => void;
}

const BroadcastHistoryDrawer: FC<OperationDrawerProps> = (props) => {
  const { visible, current, onClose } = props;
  let failedId: string[] = [];

  const broadcastHistoryDrawerColumns: ProColumns<BroadcastHistoryItem>[] = [
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
        <FormattedMessage id="pages.searchTable.titleCreatedAt" defaultMessage="Created At" />
      ),
      dataIndex: 'createdAt',
      valueType: 'dateTimeRange',
      render: (_, object) => {
        return moment(object.sendAt).format('yyyy-MM-DD HH:mm');
      },
    },
    {
      title: (
        <FormattedMessage id="pages.broadcast.sendAt.sendAtLabel" defaultMessage="Broadcast Time" />
      ),
      dataIndex: 'sendAt',
      valueType: 'dateTimeRange',
      render: (_, object) => {
        return moment(object.sendAt).format('yyyy-MM-DD HH:mm');
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleTags" defaultMessage="Tags" />,
      dataIndex: 'tags',
      hideInSearch: true,
      render: (_, object, index) => (
        <>
          {object.sendToAll? <Tag color='green' key={index + 'tagEveryone'}>Everyone</Tag>: ""}
          {object.tags.map((tag) => {
            return (
              <Tag color='geekblue' key={index + 'tag' + tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
          {object.exclude.map((tag) => {
            return (
              <Tag color='red' key={index + 'tag' + tag}>
                {"- " + tag.toUpperCase()}
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
      sorter: true,
      render: (_, object) => (
        <>
          <Tooltip title={object.sent + ' / ' + object.total}>
            <Progress percent={(object.processed * 100) / object.total} 
              success={{percent: (object.sent * 100) / object.total}} strokeWidth='12px'
              strokeColor='red' showInfo={false}/>
          </Tooltip>
        </>
      ),
    },
    {
      title: <FormattedMessage id="pages.broadcast.flow.flowLabel" defaultMessage="Flow" />,
      dataIndex: 'flow',
      render: (_, object) => {
        return <PhonePreview data={object.flow} editMode={false}/>;
      },
    },
    {
      title: <FormattedMessage id="pages.broadcast.target.targetLabel" defaultMessage="Reached Target" />,
      dataIndex: 'targets',
      hideInSearch: true,
      render: (_, object, index) => (
        <List size="small">
          {object.failed && object.failed.map((user) => {
            failedId = [...failedId, user.id]
            return (
              <Tag color='red' key={index + 'user' + user.id}>{user.name}</Tag>
            );
          })}
          {object.targets && object.targets.map((user) => {
            if (failedId.indexOf(user.id ) < 0)
              return (
                <Tag color='green' key={index + 'user' + user.id}>{user.name}</Tag>
              );
            else return <></>
          })}
        </List>
      ),
    },
  ];

  return (
    <Drawer
      style={{ whiteSpace: 'pre-line' }}
      width={450}
      visible={visible}
      // closable={false}
      onClose={onClose}
      footer={[
          <Link to={`/broadcasts/history/${current?.id}`}>
            <Button type="primary" key={current?.id}>Retarget Broadcast</Button>
          </Link>]}
      footerStyle={{ textAlign: 'center' }}
    >
      {current?.flow && (
        <ProDescriptions<BroadcastHistoryItem>
          column={1}
          title={
            <b
              style={{
                fontSize: 20,
              }}
            >
              Broadcast Details
            </b>
          }
          request={async () => ({
            data: current || {},
          })}
          params={{
            id: current?.id,
          }}
          columns={
            broadcastHistoryDrawerColumns as ProDescriptionsItemProps<BroadcastHistoryItem>[]
          }
        />
      )}
    </Drawer>
  );
};

export default BroadcastHistoryDrawer;
