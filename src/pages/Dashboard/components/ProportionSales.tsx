import { Card, Radio, Typography } from 'antd';
import numeral from 'numeral';
import { RadioChangeEvent } from 'antd/es/radio';
import React from 'react';
import { DataItem } from '../data.d';
import styles from '../style.less';
import { Pie } from '@ant-design/charts';
import { useRequest } from 'umi';

const { Text } = Typography;

const ProportionSales = ({
  dropdownGroup,
  salesType,
  salesPieData,
  handleChangeSalesType,
}: {
  dropdownGroup: React.ReactNode;
  salesType: 'all' | 'online' | 'stores';
  salesPieData: DataItem[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => {
  const { data, loading } = useRequest('http://localhost:5000/dashboard/bottom-part/top-topics',
  {formatResult: (response) => { 
    let total = 0;
    let selectedPie: any[] = []
    response.data.map((piece: any) => total += piece.count)
    response.data.map((piece: any) => {if (piece.count/total > 0.1) {selectedPie = [...selectedPie, piece]; total -= piece.count}})
    selectedPie = [...selectedPie, {count: total, id: "Others"}]
    return selectedPie
   }})
  return (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title="Topical Distribution"
    style={{
      height: '100%',
    }}
  >
    <div>
      <Pie
        // height={340}
        radius={0.8}
        angleField="count"
        colorField="id"
        innerRadius={0.5}
        data={data as any}
        label={false}
        color={[
          '#40a2ff',
          '#13c2c2',
          '#50cb73',
          '#A0D911',
          '#fbd445',
          '#FAAD14',
          '#FF745A',
          '#f2637b',
          '#9761e5',
          '#bfbfbf',
        ]}
        legend={{position: 'bottom', layout: 'vertical'}}
        statistic={{
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            formatter: function formatter() {
              return 'Topics';
            },
          }}
        }
      />
    </div>
  </Card>
)};

export default ProportionSales;
