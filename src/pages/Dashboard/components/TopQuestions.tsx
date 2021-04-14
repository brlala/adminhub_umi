import { FireFilled, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Table, Tooltip } from 'antd';
import { TinyArea } from '@ant-design/charts';
import React from 'react';
import numeral from 'numeral';
import { DataItem } from '../data';

import NumberInfo from './NumberInfo';
import Trend from './Trend';
import styles from '../style.less';
import { useRequest } from 'umi';

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    width: 50,
    align: 'center',
    key: 'rank'
  },
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
    sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
    className: styles.alignRight,
    render: (element: any, _: any) => (<div style={{paddingRight: '10px'}}>{element}</div>)
  },
  {
    title: 'Trend',
    dataIndex: 'trend',
    sorter: (a: { trend: number }, b: { trend: number }) => a.trend - b.trend,
    key: 'trend',
    width: 150,
    render: (_: any, record: any) => (
      <div>
      {/* <Trend flag={record.trend <= 0? 'down' : 'up'}>
        <span style={{ marginRight: 4 }}>{numeral(record.trend).format('0%')}</span>
      </Trend> */}
      <span style={{paddingRight: '10px'}}>{numeral(record.trend).format('0%')}</span>
      {record.trend > 0.5? 
        <><FireFilled style={{color: 'red'}}/>
        <FireFilled style={{color: 'red'}}/>
        <FireFilled style={{color: 'red'}}/></>:
      record.trend > 0.2? 
        <><FireFilled style={{color: 'red'}}/>
        <FireFilled style={{color: 'red'}}/></>:
      record.trend === 0? 
        <></>:
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
      </div>
    ),
  },
];

const TopQuestions = ({
  visitData2,
  searchData,
  dropdownGroup,
}: {
  visitData2: DataItem[];
  dropdownGroup: React.ReactNode;
  searchData: DataItem[];
}) => {

  const { data, loading } = useRequest('http://localhost:5000/dashboard/middle-part/top-question')
  const dataSoure = data?.table||[]
  console.log('data?.total.history', data?.average.history)
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
    <Table<any>
      rowKey={(record) => record.index}
      size="small"
      columns={columns}
      dataSource={dataSoure}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 5,
      }}
    />
  </Card>
)};

export default TopQuestions;
