import React, { FC } from 'react';
import { Space,  Drawer, Tag } from 'antd';

import { BroadcastHistoryItem } from '../data';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { FormattedMessage } from 'umi';
import { ProColumns } from '@ant-design/pro-table';
import { FlowItem } from 'models/flows';
import { ButtonTemplateDisplayComponent, GenericTemplateDisplayComponent, ImageDisplayComponent, QuickReplyDisplayComponent, TextDisplayComponent } from '@/components/FlowItems';
import moment from 'moment';

interface OperationDrawerProps {
  visible: boolean;
  current: BroadcastHistoryItem | undefined;
  onClose: () => void;
}

const BroadcastHistoryDrawer: FC<OperationDrawerProps> = (props) => {
  const { visible, current, onClose } = props;

  const renderComponent = (component: FlowItem, index: number) => {
    let renderedComponent;
    switch (component.type) {
      case 'message':
        renderedComponent = <TextDisplayComponent componentKey={index} componentData={component.data} />;
        break;
      case 'image':
        renderedComponent = <ImageDisplayComponent componentKey={index} componentData={component.data} />;
        break;
    case 'generic_template':
        renderedComponent = <GenericTemplateDisplayComponent componentKey={index} componentData={component.data} />;
        break;
    case 'button_template':
        renderedComponent = <ButtonTemplateDisplayComponent componentKey={index} componentData={component.data} />;
        break;
      default:
        renderedComponent = <div key={index} >Cannot render {component}</div>;
    }
    
    if (component.data.quick_replies) {
        return [renderedComponent, <QuickReplyDisplayComponent componentKey={index} componentData={component.data} />]
    }
    return renderedComponent;
  };

  const broadcastHistoryDrawerColumns: ProColumns<BroadcastHistoryItem>[] = [
    {
      title: <FormattedMessage id="pages.broadcast.author.authorLabel" defaultMessage="Author" />,
      hideInSearch: true,
      dataIndex: 'createdBy',
      render: (_, object) => {
        return object.createdBy.username;
      }
    },
    {
      title: <FormattedMessage id="pages.broadcast.sendAt.sendAtLabel" defaultMessage="Broadcast Time" />,
      dataIndex: 'sendAt',
      valueType: 'dateTimeRange',
      render: (_, object) => {
        return moment(object.sendAt).format('yyyy-MM-DD HH:mm');
      }
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
      sorter: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleTags" defaultMessage="Tags" />,
      dataIndex: 'tags',
      hideInSearch: true,
      render: (_, object) => (
        <>
          {object.tags.map(tag => {
            return (
              <Tag color='geekblue' key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: <FormattedMessage id="pages.broadcast.flow.flowLabel" defaultMessage="Flow" />,
      dataIndex: 'flow',
      render: (_, components) => {
        return <>
            <Space direction="vertical" size={16}>
                {components.flow.map((component, index) => renderComponent(component, index))}
            </Space>
        </>
      },
    }
  ];
  
  return (
    <Drawer
        style={{ whiteSpace: 'pre-line' }}
        width={600}
        visible={visible}
        closable={false}
        onClose={onClose}>
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
            columns={broadcastHistoryDrawerColumns as ProDescriptionsItemProps<BroadcastHistoryItem>[]}
          />
        )}
      </Drawer>
  );
};

export default BroadcastHistoryDrawer;
