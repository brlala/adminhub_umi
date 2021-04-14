import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import moment from 'moment';
import { Area, Column, Line } from '@ant-design/charts';

import React, { useState } from 'react';
import numeral from 'numeral';
import { ConversationTrendData, DataItem, MessageTrendData, UserTrendData } from '../data';
import styles from '../style.less';
import { useRequest } from 'umi';

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

  return (
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }} >
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
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
            {/* <RangePicker
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              style={{ width: 256 }}
            /> */}
          </div>
        }
        size="large"
        tabBarStyle={{ marginBottom: 24, paddingLeft: 24 }}
      >
        <TabPane tab="Users" key="usersTrend">
          <div className={styles.salesBar}>
            <Line
              forceFit
              height={300}
              data={userData?userData:[]}
              loading={userLoading}
              responsive
              xField="date"
              yField="value"
              seriesField="type"
              interactions={[
                {
                  type: 'slider',
                  cfg: {},
                },
              ]}
              animate
              smooth
              yAxis= {{
                grid: null,
                label: null
              }}
              legend={{
                position: 'top-center',
              }}
            />
          </div>
        </TabPane>
        <TabPane tab="Messages" key="messagesTrend">
          <div className={styles.salesBar}>
            <Area
              forceFit
              height={300}
              data={messageData?messageData:[]}
              responsive
              xField="date"
              yField="value"
              seriesField="type"
              interactions={[
                {
                  type: 'slider',
                  cfg: {},
                },
              ]}
              animate
              smooth
              yAxis= {{
                grid: null,
                label: null
              }}
              legend={{
                position: 'top-center',
              }}
            />
          </div>
        </TabPane>
        <TabPane tab="Conversations" key="conversationsTrend">
          <div className={styles.salesBar}>
            <Line
              forceFit
              height={300}
              data={conversationData?conversationData:[]}
              responsive
              xField="date"
              yField="value"
              seriesField="type"
              interactions={[
                {
                  type: 'slider',
                  cfg: {},
                },
              ]}
              animate
              smooth
              yAxis= {{
                grid: null,
                label: null
              }}
              legend={{
                position: 'top-center',
              }}
            />
          </div>
        </TabPane>
        
        {/* <TabPane tab="Conversations" key="conversationsTrend">
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Column
                  height={300}
                  forceFit
                  data={salesData as any}
                  xField="x"
                  yField="y"
                  xAxis={{
                    visible: true,
                    title: {
                      visible: false,
                    },
                  }}
                  yAxis={{
                    visible: true,
                    title: {
                      visible: false,
                    },
                  }}
                  title={{
                    visible: true,
                    text: 'Conversations Trend',
                    style: {
                      fontSize: 14,
                    },
                  }}
                  meta={{
                    y: {
                      alias: 'Conversations',
                    },
                  }}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>Top Questions</h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                        {item.title}
                      </span>
                      <span>{numeral(item.total).format('0,0')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </TabPane>
       */}
      </Tabs>
    </div>
  </Card>
)};

export default TrendlineCard;
