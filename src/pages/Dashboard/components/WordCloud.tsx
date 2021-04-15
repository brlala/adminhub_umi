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
    wordField: 'id',
    weightField: 'count',
    colorField: 'id',
    color: [
      '#40a2ff',
      '#13c2c2',
      '#50cb73',
      '#A0D911',
      '#fbd445',
      '#FAAD14',
      '#FF745A',
      '#f2637b',
      '#9761e5',
      '#91d5ff',
      '#87e8de',
      '#b7eb8f',
      '#fffb8f',
      '#ffd591',
      '#ffa39e',
      '#ffadd2',
      '#d3adf7',
      '#bfbfbf',
    ],
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
