import React, { FC, useRef, useState } from 'react';
import { AutoComplete, Divider, Input, message, Space, Tag } from 'antd';
import moment from 'moment';
import {
  UserOutlined,
  FormOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  MessageOutlined,
  TagsOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRequest } from 'umi';
import { patchUserTags, queryCurrent } from '@/pages/ConversationList/service';
import { getTags } from '@/pages/broadcast/NewBroadcast/service';

moment.locale('en-us');
const { Option } = AutoComplete;

const UserMetaDisplay: FC<{ userMeta: any }> = (props) => {
  const { userMeta } = props;

  const { data: tags, run: tagsRun } = useRequest(getTags);
  const ref = useRef<Input | null>(null);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const { data: userTags, refresh: tagsRefresh } = useRequest(
    () => {
      return queryCurrent(userMeta.id);
    },
    { 
      refreshDeps: [userMeta],
      formatResult: (response) => {
      return response.data.tags;
    } },
  );

  const { run: tagRun } = useRequest(
    (userId: string, tags: string[]) => {
      return patchUserTags(userId, tags);
    },
    {
      manual: true,
      onSuccess: () => {
        tagsRefresh();
      },
    },
  );

  const showInput = () => {
    setInputVisible(true);
    if (ref.current) {
      ref.current?.focus();
    }
  };

  const handleInputConfirm = () => {
    let tags: string[];
    if (inputValue === '') {
    } else if (
      inputValue &&
      userTags.filter((tag: string) => tag === inputValue).length === 0
    ) {
      tags = [...userTags, inputValue];
      tagRun(userMeta.id, tags);
      message.success(`Tag "${inputValue}" Added`);
    } else {
      message.info(`Tag "${inputValue}" already exists`);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleDeleteTag = (tag: string) => {
    let tags = userTags.filter((ele: string) => ele !== tag);
    tagRun(userMeta.id, tags);
    message.success(`Tag "${tag}" Deleted`);
  };
  return (
    <div>
      <div className="avatarHolder">
        <img
          alt=""
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
        />
      </div>
      <div className="avatarHolder">
        <Space direction="vertical">
          <div className="idField">
            <UserOutlined /> ID: {userMeta.id}{' '}
          </div>
          <div>
            <FormOutlined className="infoLogo" /> Registration Date:{' '}
            {moment(userMeta.createdAt).format('YYYY-MM-DD')}
          </div>
          <div>
            <ClockCircleOutlined className="infoLogo" /> Last Active:{' '}
            {moment(userMeta.lastActive.sentAt).fromNow()}
          </div>
          <div>
            <CommentOutlined className="infoLogo" /> Total Conversations: TBD
          </div>
          <div>
            <MessageOutlined className="infoLogo" /> Total Messages: TBD
          </div>
        </Space>
      </div>
      <Divider dashed />
      <div className="tags">
        <div className="tagsTitle">
          {' '}
          <TagsOutlined className="infoLogo" />
          Tags
        </div>
        {userTags&& userTags.map((item: string) => (
          <Tag closable onClose={() => handleDeleteTag(item)} key={'userTag' + item}>
            {item}
          </Tag>
        ))}
        {inputVisible && (
          <AutoComplete
            onSearch={tagsRun}
            ref={ref}
            size="small"
            style={{ width: 78 }}
            dropdownMatchSelectWidth={false}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e);
            }}
            onBlur={handleInputConfirm}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          >
            {tags &&
              tags.map((tag: string) =>
                userTags.indexOf(tag) > -1 ? (
                  <></>
                ) : (
                  <Option key={tag} value={tag}>
                    {tag}
                  </Option>
                ),
              )}
          </AutoComplete>
        )}
        {!inputVisible && (
          <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
            <PlusOutlined />
          </Tag>
        )}
      </div>
      <Divider style={{ marginTop: 16 }} dashed />
      <div className="team">
        <div className="teamTitle">
          <FormOutlined className="infoLogo" />
          Notes
        </div>
      </div>
    </div>
  );
};

export default UserMetaDisplay;
