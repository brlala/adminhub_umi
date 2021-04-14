import { FireFilled, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Table, Tooltip } from 'antd';
import { TinyArea } from '@ant-design/charts';
import React from 'react';
import numeral from 'numeral';
import { DataItem } from '../data.d';

import NumberInfo from './NumberInfo';
import Trend from './Trend';
import styles from '../style.less';
import { useRequest } from 'umi';

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: 'Question Text',
    dataIndex: 'text',
    key: 'text',
    // render: (text: React.ReactNode) => <a href="/">{text}</a>,
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
    className: styles.alignRight,
  },
  {
    title: 'Trend',
    dataIndex: 'trend',
    key: 'trend',
    render: (_: any, record: any) => (
      <>
      {/* <Trend flag={record.trend < 0? 'down' : 'up'}>
        <span style={{ marginRight: 4 }}>{numeral(record.trend).format('0%')}</span>
      </Trend> */}
      {record.trend > 0.5? 
        <><FireFilled style={{color: 'red'}}/>
        <FireFilled style={{color: 'red'}}/>
        <FireFilled style={{color: 'red'}}/></>:
        record.trend > 0.2? 
          <><FireFilled style={{color: 'red'}}/>
          <FireFilled style={{color: 'red'}}/></>:
          record.trend > 0? 
          <><FireFilled style={{color: 'red'}}/></>:
          record.trend > -0.2? 
            <><FireFilled style={{color: '#1890ff'}}/></>:
            record.trend > -0.5? 
              <><FireFilled style={{color: '#1890ff'}}/>
              <FireFilled style={{color: '#1890ff'}}/></>:
              <><FireFilled style={{color: '#1890ff'}}/>
              <FireFilled style={{color: '#1890ff'}}/>
              <FireFilled style={{color: '#1890ff'}}/></>
      }
      </>
    ),
  },
];

const TopSearch = ({
  visitData2,
  searchData,
  dropdownGroup,
}: {
  visitData2: DataItem[];
  dropdownGroup: React.ReactNode;
  searchData: DataItem[];
}) => {

  const { data, loading } = useRequest('http://localhost:5000/dashboard/bottom-part/questions-trend')
  const dataSoure = data?.table||[]
  return (
  <Card
    loading={loading}
    bordered={false}
    title="Trending Questions"
    extra={dropdownGroup}
    style={{
      height: '100%',
    }}
  >
    {/* <Row gutter={68}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              Total Number
              <Tooltip title="指标说明">
                <InfoCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          gap={8}
          total={numeral(12321).format('0,0')}
          status="up"
          subTotal={17.1}
        />
        <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData2.map(d => d.y)} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              Average Number
              <Tooltip title="指标说明">
                <InfoCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          total={2.7}
          status="down"
          subTotal={26.2}
          gap={8}
        />
        <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData2.map(d => d.y)} />
      </Col>
    </Row> */}
    <Table<any>
      rowKey={(record) => record.index}
      size="small"
      columns={columns}
      dataSource={dataSoure}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 10,
      }}
    />
  </Card>
)};

export default TopSearch;
