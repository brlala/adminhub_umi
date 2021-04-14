import { Card, Col, Row, Tooltip } from 'antd';
import { CardProps } from 'antd/es/card';
import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import numeral from 'numeral';
import { SummaryBoxData } from '../../data';
import { Field } from '../Charts';
import Trend from '../Trend';
import { InfoCircleOutlined } from '@ant-design/icons';

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

export interface SummaryCardProps extends CardProps {
  title: React.ReactNode;
  tooltip: React.ReactNode;
  action?: React.ReactNode;
  data?: SummaryBoxData;
  avatar?: React.ReactNode;
  style?: React.CSSProperties;

}

const SummaryCard: FC<SummaryCardProps> = (props) => {
  const { title, avatar, tooltip, data, children, loading } = props;
  console.log(data?.monthlyTrend!= 0)
  return (
    <Card loading={loading} bodyStyle={{ padding: '20px 24px 8px 24px' }} bordered={false}>
      <div className={styles.chartCard}>
        <div className={classNames(styles.chartTop)}>
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.metaWrap}>
            <div className={styles.meta}>
              <span className={styles.title}>{"Total " + title}</span>
              <span className={styles.action}><Tooltip title={tooltip}>
                <InfoCircleOutlined />
              </Tooltip></span>
            </div>
            {renderTotal(data?.total)}
          </div>
        </div>
        <div
          className={classNames(styles.footer, {
            [styles.footerMargin]: !children,
          })}
        style={{ height: 46 || 'auto' }}>
          <Row className={styles.contentFixed}>
            <Col span={12}>
              <div>
                MTD
                {data?.monthlyTrend && data?.monthlyTrend != 0?<Trend flag={data?.monthlyTrend > 0?"up":"down"} className={styles.trendText}>{data?.monthlyTrend}%</Trend>
                :<span className={styles.trendText}>-</span>}
                <div className={styles.targetText}><span className={styles.progressText}>{data?.monthlyTarget.count}</span> / {data?.monthlyTarget.target}</div>
              </div>
            
            </Col>
            <Col span={12}>
              <div> WTD 
                {data?.weeklyTrend && data?.weeklyTrend != 0?<Trend flag={data?.weeklyTrend > 0?"up":"down"} className={styles.trendText}>{data?.weeklyTrend}%</Trend>
                :<span className={styles.trendText}>-</span>}
                <div className={styles.targetText}><span className={styles.progressText}>{data?.weeklyTarget.count}</span> / {data?.weeklyTarget.target}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div
          className={classNames(styles.footer, {
            [styles.footerMargin]: !children,
          })}
        >
          <Field label={"Daily " + title} value={numeral(data?.daily).format('0,0')} />
        </div>
      </div>
    </Card>
  )
};

export default SummaryCard;