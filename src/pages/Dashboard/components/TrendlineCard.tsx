import { Card, Col, DatePicker, Row, Table, Tabs } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import moment from 'moment';
import { Area, Column, Line } from '@ant-design/charts';

import React, { useState } from 'react';
import numeral from 'numeral';
import { ConversationTrendData, DataItem, MessageTrendData, UserTrendData } from '../data';
import styles from '../style.less';
import { useRequest } from 'umi';
import ProCard from '@ant-design/pro-card';

type RangePickerValue = RangePickerProps<moment.Moment>['value'];
export type TimeType = 'today' | 'week' | 'month' | 'year';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData: { title: string; total: number }[] = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `Item ranking ${i}`,
    total: 323234,
  });
}

const TrendlineCard = ({
  rangePickerValue,
  salesData,
  handleRangePickerChange,
  offlineChartData,
  loading,
  selectDate,
}: {
  rangePickerValue: RangePickerValue;
  salesData: DataItem[];
  offlineChartData: DataItem[];
  loading: boolean;
  handleRangePickerChange: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  selectDate: (key: TimeType) => void;
}) => {
  // const [dateRange, setDateRange] = useState<moment.Moment[]>([moment().add(-30, 'd'), moment()]);
  const [isActive, setIsActive] = useState<string>('30');
  
  const formatDateParams = (params: moment.Moment[]) => {
    return params.map(element => element.format('YYYY-MM-DD'))
  }

  const updateDates = (selection: string) => {
    let dateRange: moment.Moment[];
    switch(selection) {
      case "30": 
        dateRange = [moment().add(-30, 'd'), moment()]
        break
      case "wtd":
        dateRange = [moment().startOf('week'), moment()]
        break;
      case "mtd":
        dateRange = [moment().startOf('month'), moment()]
        break;
      case "ytd":
        dateRange = [moment().startOf('year'), moment()]
        break;
      default:
        dateRange = [moment().add(-30, 'd'), moment()]
    }
    setIsActive(selection);
    console.log('update dates', isActive, dateRange)
    userRun(formatDateParams(dateRange));
    messageRun(formatDateParams(dateRange));
    conversationRun(formatDateParams(dateRange));
    questionRun(formatDateParams(dateRange));
  }
  
  const { data: userData, run: userRun, loading: userLoading } = useRequest((params) => ({
    url: 'http://localhost:5000/dashboard/middle-part/user-trend', method: 'post', data: params?params:formatDateParams([moment().add(-30, 'd'), moment()])
  }), {
    formatResult: (response) => {return [...response.data.map((entry: UserTrendData) => {return {date: entry.date, value: entry.newUser, type: 'New Users'}}), 
    ...response.data.map((entry: UserTrendData) => {return {date: entry.date, value: entry.activeUser, type: 'Active Users'}})]}
  })
  const { data: messageData, run: messageRun } = useRequest((params) => ({
    url: 'http://localhost:5000/dashboard/middle-part/message-trend', method: 'post', data: params?params:formatDateParams([moment().add(-30, 'd'), moment()])
  }), {
    formatResult: (response) => {return [...response.data.map((entry: MessageTrendData) => {return {date: entry.date, value: entry.message, type: 'Text Messages'}}), 
    ...response.data.map((entry: MessageTrendData) => {return {date: entry.date, value: entry.postback, type: 'Click Messages'}})]}
  })
  const { data: conversationData, run: conversationRun } = useRequest((params) => ({
    url: 'http://localhost:5000/dashboard/middle-part/conversation-trend', method: 'post', data: params?params:formatDateParams([moment().add(-30, 'd'), moment()])
  }), {
    formatResult: (response) => {return [...response.data.map((entry: ConversationTrendData) => {return {date: entry.date, value: entry.total, type: 'Conversations'}})]}
  })
  const { data: questionData, run: questionRun } = useRequest((params) => ({
    url: 'http://localhost:5000/dashboard/middle-part/top-question', method: 'post', data: params?params:formatDateParams([moment().add(-30, 'd'), moment()])
  }))

  console.log('nlpData', questionData)
  const columns = [
    {
      title: 'Question Text',
      dataIndex: 'text',
      key: 'text',
      ellipsis: true
      // render: (text: React.ReactNode) => <a href="/">{text}</a>,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      align: 'right',
      width: 80,
      // className: styles.alignRight,
      // render: (element: any, _: any) => (<div style={{paddingRight: '10px'}}>{element}</div>)
    }
  ];

  return (
  <ProCard loading={loading} headerBordered split="vertical" bodyStyle={{ padding: 0 }} title='Trend Data' extra={
    <div className={styles.salesExtraWrap}>
      <div className={styles.salesExtra}>
        <a className={isActive === '30'?styles.currentDate:''} onClick={() => updateDates('30')}>
          Past 30 Days
        </a>
        <a className={isActive === 'wtd'?styles.currentDate:''} onClick={() => updateDates('wtd')}>
          WTD
        </a>
        <a className={isActive === 'mtd'?styles.currentDate:''} onClick={() => updateDates('mtd')}>
          MTD
        </a>
        <a className={isActive === 'ytd'?styles.currentDate:''} onClick={() => updateDates('ytd')}>
          YTD
        </a>
      </div>
      <RangePicker
        value={rangePickerValue}
        onChange={handleRangePickerChange}
        style={{ width: 256 }}
      />
    </div>
  }>
    <ProCard className={styles.salesCard} bodyStyle={{ padding: 0 }} colSpan={{xl: 16, lg: 24, md: 24, sm: 24, xs: 24}}>
      <Tabs
        size="large"
        tabBarStyle={{ marginBottom: 24, paddingLeft: 24 }}>
        <TabPane tab="Users" key="usersTrend">
            <div className={styles.salesBar}>
              <Line
                height={300}
                data={userData?userData:[]}
                loading={userLoading}
                xField="date"
                yField="value"
                seriesField="type"
                interactions={[
                  {
                    type: 'slider',
                    cfg: {},
                  },
                ]}
                smooth
                yAxis= {{
                  grid: null,
                  label: null
                }}
                legend={{
                  position: 'top',
                }}
              />
            </div>
        </TabPane>
        <TabPane tab="Messages" key="messagesTrend">
          <div className={styles.salesBar}>
            <Area
              height={300}
              data={messageData?messageData:[]}
              xField="date"
              yField="value"
              seriesField="type"
              interactions={[
                {
                  type: 'slider',
                  cfg: {},
                },
              ]}
              smooth
              yAxis= {{
                grid: null,
                label: null
              }}
              legend={{
                position: 'top',
              }}
            />
          </div>
        </TabPane>
        <TabPane tab="Conversations" key="conversationsTrend">
          <div className={styles.salesBar}>
            <Line
              height={300}
              data={conversationData?conversationData:[]}
              xField="date"
              yField="value"
              seriesField="type"
              interactions={[
                {
                  type: 'slider',
                  cfg: {},
                },
              ]}
              smooth
              yAxis= {{
                grid: null,
                label: null
              }}
              legend={{
                position: 'top',
              }}
            />
          </div>
        </TabPane>
      </Tabs>
    </ProCard>
    <ProCard className={styles.salesCard} title='Top Questions' colSpan={{xl: 8, lg: 24, md: 24, sm: 24, xs: 24}}>
     <ul className={styles.rankingList}>
        {questionData && questionData.map((item: any, i: number) => (
          <li key={item.id}>
            <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
              {i + 1}
            </span>
            <span className={styles.rankingItemTitle} title={item.text}>
              {item.text}
            </span>
            <span className={styles.rankingItemValue}>
              {numeral(item.count).format('0,0')}
            </span>
          </li>
        ))}
      </ul>
    </ProCard>
  </ProCard>
)};

export default TrendlineCard;
