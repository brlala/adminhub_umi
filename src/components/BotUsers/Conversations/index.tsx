import React, { FC } from 'react';
import { List, Row } from 'antd';
import { renderMessageComponent } from '@/pages/ConversationList/RenderMessage';
import { ConversationMessage } from 'models/messages';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';

const ConversationDisplay: FC<{ data: any; loading: any; pagination: any; style?: any }> = (
  props,
) => {
  const { data, loading, pagination, style } = props;
  return (
    <ProCard ghost>
      <List<ConversationMessage>
        dataSource={data}
        loading={loading}
        pagination={{
          ...(pagination as any),
          onShowSizeChange: pagination.onChange,
          size: 'small',
          position: 'bottom',
        }}
        itemLayout="vertical"
        size="large"
        style={style}
        className="ConvoLog"
        renderItem={(item) => (
          <List.Item key={'message' + item.id}>
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
  );
};

export default ConversationDisplay;
