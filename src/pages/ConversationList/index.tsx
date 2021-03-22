import React, { FC, useState } from 'react';
import {
  Typography,
  Card,
  Col,
  List,
  Row,
  Tag,
  Divider,
  Dropdown,
  Input,
  Button,
  Tooltip,
} from 'antd';
import ProCard from '@ant-design/pro-card';
// @ts-ignore
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import {
  queryConversation,
  queryConversations,
  queryConversationsUsers,
  queryCurrent,
  queryMessages,
} from './service';
import moment from 'moment';
import { useRequest } from 'umi';
import { getTags } from '../broadcast/components/BroadcastMeta/service';
import {
  DownOutlined,
  FilterFilled,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { BotUsers, ConversationUsers } from './data';
import TagSelect from '../../components/TagSelect';
import ConversationDisplay from '@/components/BotUsers/Conversations';
import UserMetaDisplay from '@/components/BotUsers/UserMeta';

moment.locale('en-us');
const { Text } = Typography;
const { CheckableTag } = Tag;

const ConversationList: FC = () => {
  const { data: tags } = useRequest('http://localhost:5000/broadcasts/user-tags');
  const [dropdownTag, setDropdownTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showConversationSearch, setShowConversationSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentConvoList, setCurrentConvoList] = useState<string[]>();
  const [currentConvo, setCurrentConvo] = useState<number>(0);

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
            {prefix}
            <Text mark>{match}</Text>
            {suffix}
          </span>
        );
      }
    }

    return <span>{label}</span>;
  };

  const {
    data: userData,
    loading: userLoading,
    pagination: userPagination,
    refresh: userRefresh,
  } = useRequest(
    ({ current, pageSize }) => {
      if (searchQuery.length > 0) pageSize -= 1;
      return queryConversationsUsers({
        current: current,
        pageSize: pageSize,
        searchQuery: searchQuery,
        tags: selectedTags,
      });
    },
    {
      debounceInterval: 500,
      refreshDeps: [searchQuery, selectedTags],
      formatResult: (response) => {
        return { ...response.data, list: response.data.data };
      },
      onSuccess: (response) => {
        currentRun(response.list[0].id);
      },
      paginated: true,
    },
  );
  
  const { data: convosData, loading: convosLoading, pagination: convosPagination } = useRequest(
    ({ current, pageSize }) => {
      return queryConversations({
        current: current,
        pageSize: pageSize,
        searchQuery: searchQuery,
      });
    },
    {
      debounceInterval: 500,
      refreshDeps: [searchQuery, selectedTags, showConversationSearch],
      formatResult: (response) => {
        return { ...response.data, list: response.data.data };
      },
      onSuccess: (response) => {
        if (showConversationSearch) {
          currentRun(response.list[0].user.id);
          setCurrentConvoList(response.list[0].convoId);
        }
      },
      paginated: true,
    },
  );

  const { data: convoData, loading: convoLoading, pagination: convoPagination } = useRequest(
    ({ current, pageSize }) => {
      
      currentConvoList?queryConversation(currentConvoList[currentConvo], {
        current: current,
        pageSize: pageSize,
      }):{};
    },
    {
      debounceInterval: 500,
      refreshDeps: [currentConvoList, currentConvo],
      formatResult: (response) => {
        console.log(response.data);
        return { ...response.data, list: response.data.data.reverse() };
      },
      paginated: true,
    },
  );

  const { data: currentUser, run: currentRun } = useRequest(
    (userId: string) => ({url: `http://localhost:5000/botuser/${userId}`, getResponse: true }),
    { manual: true, onSuccess: (res) => metaRun(res.id) },
  );

  const { data: userMeta, run: metaRun, loading: metaLoading } = useRequest(
    (userId: string) => ({url: `http://localhost:5000/botuser/${userId}`, getResponse: true }),
    { manual: true },
  );

  const { data: messageData, loading: messageLoading, pagination: messagePagination } = useRequest(
    ({ current, pageSize }) => {
      return queryMessages(currentUser.id, { current: current, pageSize: pageSize });
    },
    {
      debounceInterval: 500,
      refreshDeps: [currentUser],
      formatResult: (response) => {
        return { ...response.data, list: response.data.data.reverse() };
      },
      paginated: true,
    },
  );

  const SearchBar = (
    <Card bordered={false}>
      <Row>
        <Col flex="auto">
          <Input
            prefix={<SearchOutlined className="site-form-item-icon" />}
            placeholder="Search Conversations"
            allowClear
            onChange={(value) => {
              setShowConversationSearch(false);
              setSearchQuery(value.target.value);
            }}
            suffix={
              selectedTags.length ? (
                <Tag key={'selectedTagCount'} closable onClose={() => setSelectedTags([])}>
                  {' '}
                  + {selectedTags.length} Tags
                </Tag>
              ) : (
                <></>
              )
            }
          ></Input>
        </Col>
        <Col flex="none" style={{ textAlign: 'right', fontSize: '20px', paddingLeft: '20px' }}>
          <Tooltip title="Add Filters">
            <Dropdown
              trigger={['click']}
              onVisibleChange={(visible) => setDropdownTag(visible)}
              visible={dropdownTag}
              overlay={
                <Card bordered className="dropdown">
                  <Divider orientation="left">Tags</Divider>
                  <div className="tagDropdown">
                    <TagSelect value={selectedTags} onChange={(value) => setSelectedTags(value)}>
                      {tags &&
                        tags.map((tag, index) => (
                          <TagSelect.Option
                            value={tag}
                            key={'tagsSelect' + index}
                            onChange={(value) => console.log(value)}
                            checked={selectedTags.indexOf(tag) >= 0}
                          >
                            {tag}
                          </TagSelect.Option>
                        ))}
                    </TagSelect>
                  </div>
                </Card>
              }
            >
              {selectedTags.length ? <FilterFilled /> : <FilterOutlined />}
            </Dropdown>
          </Tooltip>
        </Col>
        <Col flex="none" style={{ textAlign: 'right', fontSize: '20px', paddingLeft: '20px' }}>
          <Tooltip title="Refresh Users">
            <ReloadOutlined onClick={userRefresh} />
          </Tooltip>
        </Col>
      </Row>
    </Card>
  );

  const UsersConversationList = (
    <List<ConversationUsers>
      style={{ height: 'calc(100vh - 280px)', overflow: 'scroll' }}
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
      renderItem={(item, index) => (
        <List.Item
          key={'userConvoList' + item.user.id}
          className={item.user.id === currentUser?.id ? 'current' : 'selectable'}
          onClick={() => {
            currentRun(item.user.id);
            setCurrentConvoList(item.convoId);
          }}
        >
          <div
            id={index === convosPagination.pageSize - 1 ? 'Message - Latest' : 'Message - ' + index}
            key={'convoList' + item.user.id}
          />
          <Row wrap={false}>
            <Col
              flex="auto"
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              <span style={{ fontWeight: 'bolder', marginRight: '6px' }}>{item.fullname} </span>
            </Col>
            <Col
              flex="70px"
              style={{ fontSize: '11px', textAlign: 'right', color: 'rgba(0,0,0,0.45)' }}
            >
              {moment(item.lastMessageDate).format('MM-DD HH:mm')}{' '}
            </Col>
          </Row>
          <Row style={{ width: '100%' }}>
            <Text ellipsis style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)' }}>
              {item.convoCount} Conversations{' '}
            </Text>
          </Row>
        </List.Item>
      )}
    />
  );

  const UsersList = (
    <List<BotUsers>
      dataSource={userData?.list}
      loading={userLoading}
      pagination={{
        ...(userPagination as any),
        onShowSizeChange: userPagination.onChange,
        simple: true,
        position: 'bottom',
        responsive: true,
      }}
      itemLayout="vertical"
      size="large"
      style={{
        height:
          searchQuery && searchQuery.length > 0 ? 'calc(100vh - 290px)' : 'calc(100vh - 250px)',
      }}
      className="UserList"
      renderItem={(item) => (
        <List.Item
          key={'userList' + item.id}
          className={item.id === currentUser?.id ? 'current' : 'selectable'}
          onClick={() => {
            currentRun(item.id);
          }}
        >
          <div className="selectable">
            <Row wrap={false}>
              <Col
                flex="auto"
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                <span style={{ fontWeight: 'bolder', marginRight: '6px' }}>
                  {renderLabel(item?.fullname || '')}{' '}
                </span>
                {selectedTags.map((tag) =>
                  item.tags.indexOf(tag) > -1 ? (
                    <CheckableTag key={'userTag' + item.id + tag} checked>
                      {tag}
                    </CheckableTag>
                  ) : (
                    <></>
                  ),
                )}
                {item.tags.map((tag) =>
                  selectedTags.indexOf(tag) > -1 ? (
                    <></>
                  ) : (
                    <Tag key={'userTag' + item.id + tag}>{tag}</Tag>
                  ),
                )}
              </Col>
              <Col
                flex="70px"
                style={{ fontSize: '11px', textAlign: 'right', color: 'rgba(0,0,0,0.45)' }}
              >
                {moment(item.lastMessage.createdAt).format('MM-DD HH:mm')}{' '}
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Text ellipsis style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)' }}>
                {item.lastMessage.message}{' '}
              </Text>
            </Row>
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="30%" ghost>
          {SearchBar}
          {searchQuery.length > 0 && !showConversationSearch ? (
            <>
              <Divider className="plainDivider" />{' '}
              <Button
                size="large"
                type="link"
                onClick={() => setShowConversationSearch(true)}
                style={{ width: '100%' }}
              >
                <SearchOutlined /> Search in User Conversation
              </Button>
            </>
          ) : (
            <></>
          )}
          <Divider className="plainDivider" />
          {showConversationSearch ? UsersConversationList : UsersList}
        </ProCard>
        {currentUser?.id &&
          (showConversationSearch ? (
            <ProCard
              title={currentUser.firstName + ' ' + currentUser.lastName}
              ghost
              split="horizontal"
            >
              <ProCard className="navBar">
                <ProCard style={{ padding: '6px' }} ghost>
                  Showing messages from conversation {currentConvo + 1} / {currentConvoList?.length}
                </ProCard>
                <ProCard ghost colSpan={'120px'}>
                  <Button
                    type="link"
                    style={{ padding: '6px' }}
                    onClick={() => setCurrentConvo((prev) => prev - 1)}
                    disabled={currentConvo === 0}
                  >
                    <UpOutlined />
                  </Button>
                  <Button
                    type="link"
                    style={{ padding: '6px' }}
                    onClick={() => setCurrentConvo((prev) => prev + 1)}
                    disabled={currentConvo + 1 === currentConvoList?.length}
                  >
                    <DownOutlined />
                  </Button>
                  <Button
                    type="text"
                    style={{ padding: '6px' }}
                    onClick={() => setShowConversationSearch(false)}
                  >
                    Close
                  </Button>
                </ProCard>
              </ProCard>
              {convoData && (
                <ConversationDisplay
                  data={convoData.list}
                  loading={convoLoading}
                  pagination={convoPagination}
                  style={{ height: 'calc(100vh - 285px)' }}
                  searchQuery={searchQuery}
                />
              )}
            </ProCard>
          ) : (
            <ProCard title={currentUser.firstName + ' ' + currentUser.lastName} ghost>
              {messageData && (
                <ConversationDisplay
                  data={messageData.list}
                  loading={messageLoading}
                  pagination={messagePagination}
                  searchQuery={searchQuery}
                />
              )}
            </ProCard>
          ))}

        <ProCard colSpan="25%" loading={metaLoading}>
          {!metaLoading && userMeta && <UserMetaDisplay userMeta={userMeta} />}
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default ConversationList;
