import { Form, Select, Switch, DatePicker, Row, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { getTags } from './service';
import ProCard from '@ant-design/pro-card';
import moment, { Moment } from 'moment';
import { ClockCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;

const BroadcastMeta: FC = (props) => {
  const { parentForm } = props
  const { data: tags, loading: tagsLoading, run: tagsRun, cancel: tagsCancel } = useRequest(getTags, {
    manual: true
  });

  const [toAll, setToAll] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // useEffect(() => {
  //   parentForm.validateFields(['tags']);
  // }, [selectedTags]);

  const disabledDate = (current: Moment) => current && current < moment().startOf('day')

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const disabledDateTime = (current: Moment) => {
    if (current > moment().endOf('day')) {
        return {}
    }
    return {
      disabledHours: () => range(0, moment().hour()),
      disabledMinutes: () => range(0, moment().minute()),
    };
  }
  
  const now = moment()

  return (
    <>
      <FormItem name="sendToAll" label="Broadcast to Everyone">
        <Switch checked={toAll} onChange={setToAll} />
      </FormItem>
        <FormItem name="tags" label="Select Tags"
          rules={[{ required: !toAll, message: 'Please Select User Tags or Choose Send to All' }]}>
        
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please Type / Select"
          disabled={toAll}
          defaultValue={[]}
          onChange={(value) => setSelectedTags(value)}
          onSearch={tagsRun}
          onFocus={tagsRun}
          onBlur={tagsCancel}
          loading={tagsLoading}>
          {tags && tags.map((i: string) => {
            return <Option key={i}>{i}</Option>
          })}
        </Select>
      </FormItem>
      <FormItem name="exclude" label="Exclude Tags">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please Type / Select"
          defaultValue={[]}
          onSearch={tagsRun}
          onFocus={tagsRun}
          onBlur={tagsCancel}
          loading={tagsLoading}>
          {tags && tags.map((i: string) => {
            console.log(selectedTags, i, selectedTags.includes(i))
            if (selectedTags.includes(i)) {
              return <Option key={i} disabled>{i}</Option>}
            return <Option key={i}>{i}</Option>
          })}
        </Select>
        {/* Target Selected:   */}
      </FormItem>
      <Space direction="horizontal" size={32}>
        <FormItem name="scheduled" label="Send as Scheduled">
          <Switch checked={scheduled} onChange={setScheduled} />
        </FormItem>
        {scheduled?<FormItem name="sendAt" label={<ClockCircleOutlined />}>
          <DatePicker
            placeholder='Scheduled Time'
            // disabled={!scheduled}
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            minuteStep={5}
            showTime={{ defaultValue: now.add(Math.ceil(now.minute()/5)*5 - now.minute(), "m") }}/>
        </FormItem>:<></>}
        
      </Space>
    </>
  );
};

export default BroadcastMeta;
