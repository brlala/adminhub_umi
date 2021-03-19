import React, { FC, useRef, useState } from 'react';
import { Typography, Card, Col, List, Row, Space, Tag, Divider, Dropdown, Input, message, AutoComplete } from 'antd';
import { Button } from 'antd';
import ProCard from '@ant-design/pro-card';
// @ts-ignore
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { patchUserTags, queryConversation, queryConversations, queryConversationsUsers, queryCurrent, queryMessages } from './service';
import moment from 'moment';
import { useRequest } from 'umi';
import { getTags } from '../broadcast/components/BroadcastMeta/service';
import { ClockCircleOutlined, CommentOutlined, DownOutlined, FilterFilled, FilterOutlined, FormOutlined, MessageOutlined, PlusOutlined, SearchOutlined, TagsOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';
import { BotUsers, ConversationUsers } from './data';
import { ConversationMessage } from '../../../models/messages';
import { renderMessageComponent } from './RenderMessage';

const { Text } = Typography;
const { CheckableTag } = Tag;
const { Option } = AutoComplete;

const ConversationList: FC = () => {

  const { data: tags, run: tagsRun} = useRequest(getTags);
  const [dropdownTag, setDropdownTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showConversationSearch, setShowConversationSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentConvoList, setCurrentConvoList] = useState<string[]>();
  const [currentConvo, setCurrentConvo] = useState<number>(0);
  
  const updateTags = (checked: boolean, tag: string) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag])
    }
    else {
      setSelectedTags(selectedTags.filter((ele) => ele !== tag))
    }
  }
  
  const renderLabel = (label: string) => {
    if (searchQuery) {

        let index = label.toLowerCase().indexOf(searchQuery.toLowerCase());

        if (index !== -1) {

            let length = searchQuery.length;

            let prefix = label.substring(0, index);
            let suffix = label.substring(index + length);
            let match = label.substring(index, index + length);

            return (
                <span>
                    {prefix}<Text mark>{match}</Text>{suffix}
                </span>
            );
        }
    }

    return (
        <span>
            {label}
        </span>
    );
  }

  const { data: userData, loading: userLoading, pagination: userPagination } = useRequest(
    ({ current, pageSize }) => {
      if (searchQuery.length > 0) pageSize -= 1
      return queryConversationsUsers({ current: current, pageSize: pageSize, searchQuery: searchQuery, tags: selectedTags  })
    },
    { 
      refreshDeps: [searchQuery, selectedTags],
      formatResult: (response) => {return {...response.data, list: response.data.data}},
      onSuccess: (response) => {currentRun(response.list[0].id)}, 
      paginated: true,
    }
  )
  
  const { data: convosData, loading: convosLoading, pagination: convosPagination } = useRequest(
    ({ current, pageSize }) => {
      return queryConversations({ current: current, pageSize: pageSize, searchQuery: searchQuery })
    },
    { 
      refreshDeps: [searchQuery, selectedTags],
      formatResult: (response) => {return {...response.data, list: response.data.data}},
      onSuccess: (response) => {currentRun(response.list[0].user.id)}, 
      paginated: true,
    }
  )

  const { data: convoData, loading: convoLoading, pagination: convoPagination } = useRequest(
    ({ current, pageSize }) => {
      if (currentConvoList)
        return queryConversation( currentConvoList[currentConvo], { current: current, pageSize: pageSize})
      return {}
    },
    { 
      refreshDeps: [currentConvoList, currentConvo],
      formatResult: (response) => {console.log(response.data); return {...response.data, list: response.data.data.reverse()}},
      paginated: true,
    }
  )
  
  const { data: currentUser, refresh: refreshUser, run: currentRun, loading: currentLoading } = useRequest((userId: string) => {
    return queryCurrent(userId);
  },
  {manual: true}
  );

  const { run: tagRun } = useRequest((userId: string, tags: string[]) => {
    return patchUserTags(userId, tags);
  },
  {manual: true,
    onSuccess: () => {
      refreshUser()}}
  );

  const { data: messageData, loading: messageLoading, pagination: messagePagination } = useRequest(
    ({ current, pageSize }) => {
      return queryMessages(currentUser.id, { current: current, pageSize: pageSize})
    },
    { 
      refreshDeps: [currentUser],
      formatResult: (response) => {return {...response.data, list: response.data.data.reverse()}},
      paginated: true,
    }
  )

  const SearchBar = <Card bordered={false}>
    <Row>
      <Col flex="auto">
        <Input prefix={<SearchOutlined className="site-form-item-icon" />} placeholder='Search Conversations'
          allowClear onChange={(value) => {setShowConversationSearch(false); setSearchQuery(value.target.value); }} 
          suffix={selectedTags.length?<Tag key={'selectedTagCount'} closable onClose={() => setSelectedTags([])}> + {selectedTags.length} Tags</Tag>: <></>}></Input>
      </Col>
      <Col flex="50px" style={{textAlign: 'right', fontSize: '20px'}}>
        <Dropdown trigger={['click']} 
          onVisibleChange={(visible) => setDropdownTag(visible)}
          visible={dropdownTag}
          overlay={
          <Card bordered className='dropdown'>
          <Divider orientation='left'>Tags</Divider>
          <div className='tagSelect'>
            <Button key='tagClear' size='small' type='link' onClick={() => setSelectedTags([])} >Clear</Button>
            {tags && tags.map((tag) => 
              <CheckableTag key={'allTag' + tag} onChange={(checked) => updateTags(checked, tag)} checked={selectedTags.indexOf(tag) >= 0}>{tag}</CheckableTag>)}
          </div></Card>}>
            {selectedTags.length? <FilterFilled /> :<FilterOutlined/>}
        </Dropdown>
      </Col>
    </Row>
  </Card>
  
  const UsersConversationList = <List<ConversationUsers>
    style={{height: "calc(100vh - 250px)", overflow: 'scroll'}}
    dataSource={convosData?.list}
    loading={convosLoading}
    pagination={{
      ...(convosPagination as any),
      onShowSizeChange: convosPagination.onChange,
      simple: true,
      position: 'bottom',
      responsive: true,
    }}
    itemLayout="vertical"
    size="large"
    renderItem={(item) => 
    <List.Item key={'convoList' + item.user.id} className={item.user.id === currentUser?.id?'current':'selectable'} onClick={() => {
      currentRun(item.user.id); setCurrentConvoList(item.convoId)}}>
      <Row wrap={false}>
        <Col flex='auto' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          <span style={{fontWeight: "bolder", marginRight: '6px'}}>{item.fullname} </span>
        </Col>
        <Col flex="70px" style={{fontSize: "11px", textAlign: 'right', color: 'rgba(0,0,0,0.45)'}}>{moment(item.lastMessageDate).format('MM-DD HH:mm')} </Col>
      </Row>
      <Row style={{width: '100%'}}>
      <Text ellipsis style={{fontSize: "12px", color: 'rgba(0,0,0,0.65)'}}>{item.convoCount} Conversations </Text>
      </Row>
    </List.Item>}
    />
    
  const UsersList = <List<BotUsers>
    dataSource={userData?.list}
    loading={userLoading}
    pagination={{
      ...(userPagination as any),
      onShowSizeChange: userPagination.onChange,
      simple: true,
      position: 'bottom',
      responsive: true
    }}
    itemLayout="vertical"
    size="large"
    style={{height: searchQuery && searchQuery.length > 0 ? 'calc(100vh - 290px)': 'calc(100vh - 250px)'}}
    className='UserList'
    renderItem={(item) => 
    <List.Item key={'userList' + item.id} className={item.id === currentUser?.id?'current':'selectable'} onClick={() => {currentRun(item.id)}}>
      <div className='selectable'>
      <Row wrap={false}>
        <Col flex='auto' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          <span style={{fontWeight: "bolder", marginRight: '6px'}}>{renderLabel(item?.fullname||'')} </span>
          {item.tags.map((tag) => <Tag key={'userTag' + item.id + tag}>{tag}</Tag>)}
        </Col>
        <Col flex="70px" style={{fontSize: "11px", textAlign: 'right', color: 'rgba(0,0,0,0.45)'}}>{moment(item.lastMessage.createdAt).format('MM-DD HH:mm')} </Col>
      </Row>
      <Row style={{width: '100%'}}>
      <Text ellipsis style={{fontSize: "12px", color: 'rgba(0,0,0,0.65)'}}>{item.lastMessage.message} </Text>
      </Row>
      </div>
    </List.Item>}
    />     
  
  const ref = useRef<Input | null>(null);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const showInput = () => {
    setInputVisible(true);
    if (ref.current) {
      // eslint-disable-next-line no-unused-expressions
      ref.current?.focus();
    }
  };

  const handleInputConfirm = () => {
    let tags: string[];
    if (inputValue === '') {}
    else if (inputValue && currentUser.tags.filter((tag: string) => tag === inputValue).length === 0) {
      tags = [...currentUser.tags, inputValue]
      tagRun(currentUser.id, tags)
      message.success(`Tag "${inputValue}" Added`)
    }
    else {
      message.info(`Tag "${inputValue}" already exists`)
    }
    setInputVisible(false);
    setInputValue('');
  };
  
  const handleDeleteTag = (tag: string) => {
    let tags = currentUser.tags.filter((ele: string) => ele !== tag)
    tagRun(currentUser.id, tags)
    message.success(`Tag "${tag}" Deleted`)
  };

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="30%" ghost>
          {SearchBar}
          {searchQuery.length > 0 && !showConversationSearch ? 
            <><Divider className='plainDivider' /> <Button size='large' type='link' onClick={() => setShowConversationSearch(true)} style={{width: '100%'}}>
              <SearchOutlined/> Search in User Conversation</Button></> 
            : <></>}
          <Divider className='plainDivider' />
          {showConversationSearch? UsersConversationList:UsersList}
        </ProCard>
        {currentUser?.id && (showConversationSearch?
        <ProCard title={currentUser.firstName + ' ' + currentUser.lastName} ghost split='horizontal'>
          <ProCard className='navBar'>
            <ProCard style={{padding: '6px'}} ghost>
              Showing messages from conversation {currentConvo + 1} / {currentConvoList?.length}
            </ProCard>
            <ProCard ghost colSpan={'120px'}>
              <Button type='link' style={{padding: '6px'}} onClick={() => setCurrentConvo(prev => prev - 1)} disabled={currentConvo === 0}>
                <UpOutlined />
              </Button>
              <Button type='link' style={{padding: '6px'}} onClick={() => setCurrentConvo(prev => prev + 1)} disabled={currentConvo + 1 === currentConvoList?.length}>
                <DownOutlined />
              </Button>
              <Button type='text' style={{padding: '6px'}} onClick={() => setShowConversationSearch(false)}>
                Close
              </Button>
            </ProCard>
          </ProCard>
          <ProCard ghost>
            <List<ConversationMessage>
              dataSource={convoData?.list}
              loading={convoLoading}
              pagination={{
                ...(convoPagination as any),
                onShowSizeChange: convoPagination.onChange,
                size: 'small',
                // simple: true,
                position: 'bottom',
                // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} messages`,
              }}
              itemLayout="vertical"
              size="large"
              style={{height: 'calc(100vh - 285px)'}}
              className='ConvoLog'
              renderItem={(item) => 
              <List.Item key={'message' + item.id} >
                <Row justify={item.incomingMessageId || item.isBroadcast?'end':'start'}>
                {renderMessageComponent(item.data, item.type, item.id, item.incomingMessageId != null || item.isBroadcast, item.isBroadcast, searchQuery)}
                </Row>
                {item.data.quickReplies? <Row justify={item.incomingMessageId || item.isBroadcast?'end':'start'} style={{marginTop: '10px'}}>
                {renderMessageComponent(item.data, 'quickReplies', item.id, item.incomingMessageId != null || item.isBroadcast, item.isBroadcast, searchQuery)}
                </Row>:<></>}
                <Row justify={item.incomingMessageId || item.isBroadcast?'end':'start'}>
                <div style={{fontSize: "11px", color: 'rgba(0,0,0,0.45)'}}>{moment(item.createdAt).format('MM-DD HH:mm')} </div></Row>
              </List.Item>}/> 
          </ProCard>  
        </ProCard>:
        <ProCard title={currentUser.firstName + ' ' + currentUser.lastName} ghost>
          <List<ConversationMessage>
            dataSource={messageData?.list}
            loading={messageLoading}
            pagination={{
              ...(messagePagination as any),
              onShowSizeChange: messagePagination.onChange,
              size: 'small',
              // simple: true,
              position: 'bottom',
              // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} messages`,
            }}
            itemLayout="vertical"
            size="large"
            className='ConvoLog'
            renderItem={(item) => 
            <List.Item key={'message' + item.id} >
              <Row justify={item.incomingMessageId || item.isBroadcast?'end':'start'}>
              {renderMessageComponent(item.data, item.type, item.id, item.incomingMessageId != null || item.isBroadcast, item.isBroadcast, searchQuery)}
              </Row>
              {item.data.quickReplies? <Row justify={item.incomingMessageId || item.isBroadcast?'end':'start'} style={{marginTop: '10px'}}>
              {renderMessageComponent(item.data, 'quickReplies', item.id, item.incomingMessageId != null || item.isBroadcast, item.isBroadcast, searchQuery)}
              </Row>:<></>}
              <Row justify={item.incomingMessageId || item.isBroadcast?'end':'start'}>
              <div style={{fontSize: "11px", color: 'rgba(0,0,0,0.45)'}}>{moment(item.createdAt).format('MM-DD HH:mm')} </div></Row>
            </List.Item>}/>   
        </ProCard>)}
        
        <ProCard colSpan="25%" loading={currentLoading}>
            {!currentLoading && currentUser && (
              <div>
                <div className='avatarHolder'>
                  <img alt="" src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' />
                  <Space direction='vertical'>
                    <div className='idField'><UserOutlined /> ID: {currentUser.id}</div>
                    <div ><FormOutlined className='infoLogo'/> Registration Date: {moment(currentUser.createdAt).format('YYYY-MM-DD')}</div>
                    <div ><ClockCircleOutlined className='infoLogo'/> Last Active: {moment(currentUser.lastActive.sentAt).toNow()}</div>
                    <div ><CommentOutlined className='infoLogo'/> Total Conversations: TBD</div>
                    <div ><MessageOutlined className='infoLogo'/> Total Messages: TBD</div>
                  </Space>
                </div>
                {/* {renderUserInfo(currentUser)} */}
                <Divider dashed />
                <div className='tags'>
                  <div className='tagsTitle'> <TagsOutlined className='infoLogo'/>Tags</div>
                  {currentUser.tags.map((item: string) => (
                    <Tag closable onClose={() => handleDeleteTag(item)} key={'userTag' + item}>{item}</Tag>
                  ))}
                  {inputVisible && (
                    // <Select
                    //   showSearch
                    //   style={{ width: '100%' }}
                    //   onChange={(e) => {console.log('onchange'm e);}} //setInputValue()}}
                    //   onBlur={handleInputConfirm}
                    //   // onPressEnter={handleInputConfirm}
                    //   onSearch={tagsRun}
                    //   onFocus={tagsRun}
                    //   loading={tagsLoading}>
                    //   {tags &&
                    //     tags.map((i: string) => {
                    //       return <Option key={i} value={i}>{i}</Option>;
                    //     })}
                    // </Select>

                    <AutoComplete
                      onSearch={tagsRun}
                      ref={ref}
                      // options={options}
                      size="small"
                      style={{ width: 78 }}
                      dropdownMatchSelectWidth={false}
                      value={inputValue}
                      onChange={(e) => {setInputValue(e)}}
                      onBlur={handleInputConfirm}
                      // onPressEnter={handleInputConfirm}
                      filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    >
                      {tags&&tags.map((tag: string) => (<Option key={tag} value={tag}>{tag}</Option>))}
                    </AutoComplete>
                  )}
                  {!inputVisible && (
                    <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
                      <PlusOutlined />
                    </Tag>
                  )}
                </div>
                <Divider style={{ marginTop: 16 }} dashed />
                <div className='team'>
                  <div className='teamTitle'><FormOutlined className='infoLogo'/>Notes</div>
                </div>
              </div>
            )}
            </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default ConversationList;
