import { Card, Radio, Typography } from 'antd';
import numeral from 'numeral';
import { RadioChangeEvent } from 'antd/es/radio';
import React from 'react';
import { DataItem } from '../data.d';
import styles from '../style.less';
import { Pie } from '@ant-design/charts';

const { Text } = Typography;

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}: {
  loading: boolean;
  dropdownGroup: React.ReactNode;
  salesType: 'all' | 'online' | 'stores';
  salesPieData: DataItem[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title="Topical Distribution"
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="online">Text</Radio.Button>
            <Radio.Button value="stores">Click</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <Text>Topics</Text>
      <Pie
        height={340}
        radius={0.8}
        angleField="y"
        colorField="x"
        innerRadius={0.6}
        data={salesPieData as any}
        label= {{
          type: 'spider',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 14,
          },
          formatter: (text, item) => {
            // eslint-disable-next-line no-underscore-dangle
            return `${item._origin.x}: ${numeral(item._origin.y).format('0,0')}`;
          }
        }}
        statistic={{
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            formatter: function formatter() {
              return 'Sales';
            },
          }}
        }
      />
    </div>
  </Card>
);

export default ProportionSales;
