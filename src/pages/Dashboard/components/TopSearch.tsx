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
    <Row gutter={68}>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          style={{ paddingLeft: 24 }}
          subTitle={
            <span>
              Total Number
              <Tooltip title="指标说明">
                <InfoCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          gap={8}
          total={numeral(data?.total.value).format('0,0')}
          status={data?.total.trend<0?'down':'up'}
          subTotal={numeral(data?.total.trend).format('0.00%')}
        />
        <TinyArea height={45} smooth data={data?.total.history.map((d:any) => d.count)} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          style={{ paddingLeft: 24 }}
          subTitle={
            <span>
              Average Number
              <Tooltip title="指标说明">
                <InfoCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </span>
          }
          total={numeral(data?.average.value).format('0,0')}
          status={data?.average.trend<0?'down':'up'}
          subTotal={numeral(data?.average.trend).format('0.00%')}
          gap={8}
        />
        <TinyArea height={45} smooth data={data?.average.history.map((d:any) => d.average)} tooltip={{formatter: (datum: any) => numeral(datum).format('0.0')}}/>
      </Col>
    </Row>
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

export default TopSearch;
