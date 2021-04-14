import { FireFilled, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Table, Tooltip } from 'antd';
import { TinyArea, WordCloud } from '@ant-design/charts';
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

const WordCloudCard = ({
  visitData2,
  searchData,
  dropdownGroup,
}: {
  visitData2: DataItem[];
  dropdownGroup: React.ReactNode;
  searchData: DataItem[];
}) => {

  const { data, loading } = useRequest('http://localhost:5000/dashboard/bottom-part/word-cloud')
  var config = {
    data: data,
    height: 300,
    wordField: 'id',
    weightField: 'count',
    colorField: 'id',
    wordStyle: {
      fontFamily: 'Helvetica Neue',
      fontSize: [16, 64],
      rotation: 0,
    },
    random: function random() {
      return 0.5;
    },
  };
  return <Card
    loading={loading}
    bordered={false}
    title="Word Cloud"
    style={{
      height: '100%',
    }}
  >
    <div>
      <WordCloud {...config} />
    </div>
  </Card>
};

export default WordCloudCard;
