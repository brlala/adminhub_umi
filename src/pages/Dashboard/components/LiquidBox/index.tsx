import { Card, Col, Row, Tooltip } from 'antd';
import { CardProps } from 'antd/es/card';
import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import numeral from 'numeral';
import { LiquidData, SummaryBoxData } from '../../data';
import { Field } from '../Charts';
import Trend from '../Trend';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Gauge, Liquid } from '@ant-design/charts';

type totalType = () => React.ReactNode;

const renderTotal = (total?: number | totalType | React.ReactNode) => {
  if (!total && total !== 0) {
    return null;
  }
  console.log( 'total',total)
  let totalDom;
  switch (typeof total) {
    case 'undefined':
      totalDom = null;
      break;
    case 'function':
      totalDom = <div className={styles.total}>{total()}</div>;
      break;
    default:
      totalDom = <div className={styles.total}>{numeral(total).format('0,0')}</div>;
  }
  return totalDom;
};

export interface LiquidCardProps extends CardProps {
  title: React.ReactNode;
  tooltip: React.ReactNode;
  action?: React.ReactNode;
  data?: LiquidData;
  avatar?: React.ReactNode;
  style?: React.CSSProperties;

}

const LiquidCard: FC<LiquidCardProps> = (props) => {
  const { title, avatar, tooltip, data, loading } = props;
  console.log('data?.total.rate', data?.total.rate)
  var ref;
  var ticks = [0, 1 / 2, 4 / 5, 1];
  var color = ['#F4664A', '#FAAD14', '#30BF78'];
  var config = {
    width: 200,
    height: 160,
    percent: data?.total?.rate||0,
    range: {
      ticks: [0, 1],
      color: ['l(0) 0:#F4664A 0.5:#FAAD14 1:#30BF78'],
    },
    indicator: {
      pointer: { style: { stroke: '#D0D0D0' } },
      pin: { style: { stroke: '#D0D0D0' } },
    },
    statistic: {
      title: {
        formatter: function formatter(_ref) {
          var percent = _ref.percent;
          if (percent < ticks[1]) {
            return 'Alert';
          }
          if (percent < ticks[2]) {
            return 'Moderate';
          }
          return 'Excellent';
        },
        style: function style(_ref2) {
          var percent = _ref2.percent;
          return {
            fontSize: '16px',
            lineHeight: 1,
            color: percent < ticks[1] ? color[0] : percent < ticks[2] ? color[1] : color[2],
          };
        },
      },
    },
  };
  return (
    <Card loading={loading} bodyStyle={{ padding: '20px 24px 8px 24px' }} bordered={false}>
      <div className={styles.chartCard}>
        <div className={classNames(styles.chartTop)}>
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.metaWrap}>
            <div className={styles.meta}>
              <span className={styles.title}>{title}</span>
              <span className={styles.action}><Tooltip title={tooltip}>
                <InfoCircleOutlined />
              </Tooltip></span>
            </div>
            <Row gutter={20}>
            <Col><div className={styles.total}>{numeral(data?.total.rate).format('0.00%')}</div></Col>
            <Col><Gauge {...config} chartRef={(chartRef) => (ref = chartRef)} /></Col></Row>
           {/* <Liquid {...config} /> */}
          </div>
        </div>
        {/* <div
          className={classNames(styles.footer, {
            [styles.footerMargin]: !children,
          })}
        style={{ height: 66 || 'auto' }}>
          <Row className={styles.contentFixed}>
            <Col span={12}>
              <div> MTD
                <div className={styles.progressText}>{numeral(data?.monthly.rate).format('0.0%')}</div>
              </div>
            
            </Col>
            <Col span={12}>
              <div> WTD 
                <div className={styles.progressText}>{numeral(data?.weekly.rate).format('0.0%')}</div>
              </div>
            </Col>
          </Row>
        </div> */}
      </div>
    </Card>
  )
};

export default LiquidCard;
