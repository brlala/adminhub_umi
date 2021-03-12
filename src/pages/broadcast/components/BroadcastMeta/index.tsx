import { Form, Select, Switch, DatePicker, Space, Button, Tag } from 'antd';
import React, { FC, useState } from 'react';
import { useRequest } from 'umi';
import { getTags, getUsers } from './service';
import moment, { Moment } from 'moment';
import { ClockCircleOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const BroadcastMeta: FC = (props) => {
<<<<<<< HEAD
  const { data: tags, loading: tagsLoading, run: tagsRun, cancel: tagsCancel } = useRequest(
    getTags,
    {
      manual: true,
    },
  );
=======
  const { data: tags, loading: tagsLoading, run: tagsRun, cancel: tagsCancel } = useRequest(getTags, {
    manual: true
  });
>>>>>>> 8d7d040fb88ad358e39ac583f5f2bbd80fb979ba

  const [toAll, setToAll] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [excludedeTags, setExcludedeTags] = useState<string[]>([]);
  const [expand, setExpand] = useState(false);
<<<<<<< HEAD

  const disabledDate = (current: Moment) => current && current < moment().startOf('day');
=======
>>>>>>> 8d7d040fb88ad358e39ac583f5f2bbd80fb979ba

  const { data: users, run: usersRun } = useRequest(
    (userTags, userExcludes, all) => {
      console.log('Run Data', userTags, userExcludes, all);
      return getUsers({
        tags: userTags ? userTags : selectedTags,
        exclude: userExcludes ? userExcludes : excludedeTags,
        toAll: all,
      });
    },
    { manual: true },
  );

  const { data: users, run: usersRun } = useRequest((userTags, userExcludes, all) => {
    console.log('Run Data', userTags, userExcludes, all)
    return getUsers({tags: userTags? userTags: selectedTags, exclude: userExcludes? userExcludes: excludedeTags, toAll: all})
  }, {manual: true});

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
<<<<<<< HEAD
  };

=======
  }
  
>>>>>>> 8d7d040fb88ad358e39ac583f5f2bbd80fb979ba
  const disabledDateTime = (current: Moment) => {
    if (current > moment().endOf('day')) {
      return {};
    }
    return {
      disabledHours: () => range(0, moment().hour()),
      disabledMinutes: () => range(0, moment().minute()),
    };
  };

  const now = moment();

  return (
    <>
      <FormItem name="sendToAll" label="Broadcast to Everyone">
<<<<<<< HEAD
        <Switch
          checked={toAll}
          onChange={(value) => {
            setToAll(value);
            usersRun(null, null, value);
          }}
        />
      </FormItem>
      {toAll ? (
        <></>
      ) : (
        <FormItem
          name="tags"
          label="Select Tags"
          rules={[{ required: !toAll, message: 'Please Select User Tags or Choose Send to All' }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please Type / Select"
            disabled={toAll}
            defaultValue={[]}
            onChange={(value) => {
              setSelectedTags(value);
              usersRun(value, null, toAll);
            }}
            onSearch={tagsRun}
            onFocus={tagsRun}
            onBlur={tagsCancel}
            loading={tagsLoading}
          >
            {tags &&
              tags.map((i: string) => {
                return <Option key={i}>{i}</Option>;
              })}
          </Select>
        </FormItem>
      )}
=======
        <Switch checked={toAll} onChange={(value) => {setToAll(value);  usersRun(null, null, value)}} />
      </FormItem>
      {toAll? <></>: <FormItem name="tags" label="Select Tags"
        rules={[{ required: !toAll, message: 'Please Select User Tags or Choose Send to All' }]}>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please Type / Select"
          disabled={toAll}
          defaultValue={[]}
          onChange={(value) => {setSelectedTags(value); usersRun(value, null, toAll)}}
          onSearch={tagsRun}
          onFocus={tagsRun}
          onBlur={tagsCancel}
          loading={tagsLoading}>
          {tags && tags.map((i: string) => {
            return <Option key={i}>{i}</Option>
          })}
        </Select>
      </FormItem>}
>>>>>>> 8d7d040fb88ad358e39ac583f5f2bbd80fb979ba
      <FormItem name="exclude" label="Exclude Tags">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please Type / Select"
          defaultValue={[]}
<<<<<<< HEAD
          onChange={(value) => {
            setExcludedeTags(value);
            usersRun(null, value, toAll);
          }}
=======
          onChange={(value) => {setExcludedeTags(value); usersRun(null, value, toAll)}}
>>>>>>> 8d7d040fb88ad358e39ac583f5f2bbd80fb979ba
          onSearch={tagsRun}
          onFocus={tagsRun}
          onBlur={tagsCancel}
          loading={tagsLoading}
        >
          {tags &&
            tags.map((i: string) => {
              console.log(selectedTags, i, selectedTags.includes(i));
              if (selectedTags.includes(i)) {
                return (
                  <Option key={i} disabled>
                    {i}
                  </Option>
                );
              }
              return <Option key={i}>{i}</Option>;
            })}
        </Select>
      </FormItem>
      <FormItem label="Total Targets">
        <div>
<<<<<<< HEAD
          {users?.length || 0}
          {users?.length ? (
            <Button type="link" onClick={() => setExpand(!expand)}>
              {expand ? 'Hide Details' : 'Show Details'}{' '}
              {expand ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </Button>
          ) : (
            <></>
          )}
        </div>

        {expand ? (
          <div>
            {users?.map((user) => (
              <Tag>{user.name}</Tag>
            ))}
          </div>
        ) : (
          <></>
        )}
=======
          {users?.length||0} 
          {users?.length?<Button type='link' 
            onClick={() => setExpand(!expand)} >{expand?'Hide Details': 'Show Details'} {expand?<FullscreenExitOutlined />:<FullscreenOutlined />}</Button>:<></>}
        </div>
        
        {expand? <div>{users?.map((user) => <Tag>{user.name}</Tag>)}</div>: <></>}
>>>>>>> 8d7d040fb88ad358e39ac583f5f2bbd80fb979ba
      </FormItem>
      <Space direction="horizontal" size={32}>
        <FormItem name="scheduled" label="Send as Scheduled">
          <Switch checked={scheduled} onChange={setScheduled} />
        </FormItem>
        {scheduled ? (
          <FormItem name="sendAt" label={<ClockCircleOutlined />}>
            <DatePicker
              placeholder="Scheduled Time"
              // disabled={!scheduled}
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              minuteStep={5}
              showTime={{
                defaultValue: now.add(Math.ceil(now.minute() / 5) * 5 - now.minute(), 'm'),
              }}
            />
          </FormItem>
        ) : (
          <></>
        )}
      </Space>
    </>
  );
};

export default BroadcastMeta;
