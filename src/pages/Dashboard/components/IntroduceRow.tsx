import { Col, Row } from 'antd';
import React from 'react';
import { useRequest } from 'umi';
import SummaryCard from './SummaryBox';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = () => {
  const { data: messageData, loading: messageLoading } = useRequest('http://localhost:5000/dashboard/top-part/messages')
  const { data: userData, loading: userLoading } = useRequest('http://localhost:5000/dashboard/top-part/users')
  const { data: conversationData, loading: conversationLoading } = useRequest('http://localhost:5000/dashboard/top-part/conversations')
  
  console.log('messageData', messageData)
  return (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <SummaryCard
        loading={userLoading}
        bordered={false}
        title="Users"
        tooltip="Total number of messages sent by users"
        data={userData}/>
    </Col>
    <Col {...topColResponsiveProps}>
      <SummaryCard
        loading={messageLoading}
        bordered={false}
        title="User Messages"
        tooltip="Total number of messages sent by users"
        data={messageData}/>
    </Col>
    <Col {...topColResponsiveProps}>
      <SummaryCard
        loading={conversationLoading}
        bordered={false}
        title="Conversations"
        tooltip="Conversations is consecutive user messages with no more than 3 minutes break"
        data={conversationData}/>
    </Col>

    {/* <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Total Users"
        action={
          <Tooltip title="Total Users">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total='108,846'
        footer={<Field label="Daily New Users" value='5' />}
        contentHeight={46}
      >
        {console.log(visitData)}
        <TinyArea
          color="#975FE4"
          line={{size: 0}}
          height={46}
          smooth
          data={visitData.map(d => d.y)}
        />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Total Conversations"
        action={
          <Tooltip title="Conversations is consecutive user messages with no more than 3 minutes break">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        footer={<Field label="Returning User Rate" value="60%" />}
        contentHeight={46}
      >
        <TinyColumn xField="x" height={46} forceFit yField="y" data={visitData.map(d => d.y)} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="Campaign Score Board"
        action={
          <Tooltip title="指标说明">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total="78%"
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="up" style={{ marginRight: 16 }}>
              Monthly Trend
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              Weekly Trend
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <Progress
          height={46}
          percent={0.78}
          color="#13C2C2"
          forceFit
          size={8}
          marker={[
            {
              value: 0.8,
              style: {
                stroke: '#13C2C2',
              },
            },
          ]}
        />
      </ChartCard>
    </Col> */}
  </Row>
)};

export default IntroduceRow;
