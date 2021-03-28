import React, { FC, useRef, useState } from 'react';
import { AutoComplete, Avatar, Divider, Input, message, Space, Tag } from 'antd';
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
import { patchUser, queryCurrent } from '@/pages/ConversationList/service';
import { getTags } from '@/pages/Broadcast/NewBroadcast/service';

moment.locale('en-us');
const { Option } = AutoComplete;
const { TextArea } = Input;

export const ColorList = [
  { color: '#B3791B', backgroundColor: '#FDDC87' }, 
  { color: '#287391', backgroundColor: '#87D6E4' }, 
  { color: '#8A3035', backgroundColor: '#F4837D' }, 
  { color: '#693C87', backgroundColor: '#D094D9' }, 
  { color: '#39792F', backgroundColor: '#98D66D' }]

const UserMetaDisplay: FC<{ userMeta: any }> = (props) => {
  const { userMeta } = props;

  const { data: tags, run: tagsRun } = useRequest(getTags);
  const ref = useRef<Input | null>(null);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [noteVisible, setNoteVisible] = useState<boolean>(false);
  const [noteValue, setNoteValue] = useState<string>('');

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

  const { data: userNote, refresh: noteRefresh } = useRequest(
    () => {
      return queryCurrent(userMeta.id);
    },
    { 
      refreshDeps: [userMeta],
      onSuccess: (response) => setNoteValue(response),
      formatResult: (response) => {
      return response.data.chatbot.note;
    } },
  );

  const { run } = useRequest(
    (userId: string, tags: string[]) => {
      return patchUser(userId, tags, noteValue);
    },
    {
      manual: true,
      onSuccess: () => {
        tagsRefresh();
        noteRefresh();
      },
    },
  );

  const showInput = () => {
    setInputVisible(true);
    if (ref.current) {
      ref.current?.focus();
    }
  };

  const showNote = () => {
    setNoteVisible(true);
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
      run(userMeta.id, tags);
      message.success(`Tag "${inputValue}" Added`);
    } else {
      message.info(`Tag "${inputValue}" already exists`);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleNoteConfirm = () => {
    run(userMeta.id, userMeta.tags);
    message.success(`Note updated`);
    setNoteVisible(false);
    setNoteValue('');
  };

  const handleDeleteTag = (tag: string) => {
    let tags = userTags.filter((ele: string) => ele !== tag);
    run(userMeta.id, tags);
    message.success(`Tag "${tag}" Deleted`);
  };
  return (
    <div>
      <div className="avatarHolder">
        {userMeta.firstName?<Avatar size={96} style={ColorList[userMeta.firstName.charCodeAt(0)%5]} > <div style={{fontSize: '64px'}}>{userMeta.firstName[0]}</div></Avatar>:
        <Avatar size={96} style={ColorList[userMeta.facebook.id.charCodeAt(0)%5]} > <div style={{fontSize: '64px'}}>{userMeta.facebook.id[0]}</div></Avatar>}
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
        
        {noteVisible && (
          <TextArea
            ref={ref}
            autoSize={{maxRows: 6}}
            value={noteValue}
            onChange={(e) => {
              setNoteValue(e.target.value);
            }}
            
            onBlur={handleNoteConfirm}
          />
        )}
        {!noteVisible && (<>
          {userNote?<div onClick={showNote} style={{whiteSpace: "pre-wrap", height: '150px', overflow: 'scroll'}} >{userNote}</div>:
            <Tag onClick={showNote} style={{ borderStyle: 'dashed' }}>
              <PlusOutlined />
            </Tag>}</>
        )}
      </div>
    </div>
  );
};

export default UserMetaDisplay;
