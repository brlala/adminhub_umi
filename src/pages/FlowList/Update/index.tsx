import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
// @ts-ignore
import { FormattedMessage, useIntl } from 'umi';
import { changeLanguage } from '@/utils/language';
import { Divider } from 'antd';
import styles from './index.less';
import NewComponentsList from '../components/NewComponentsList';
import FlowComponentsList from '@/pages/FlowList/components/FlowComponentsList';

changeLanguage('en-US');

const NewFlow: React.FC = () => {
  const [newComponentsList, setNewComponentsList] = useState([]);

  let newComponentsImplementation = [];
  return (
    <div className={styles.componentsList}>
      <ProCard
        title="New Flow"
        extra="2019年9月28日"
        split="vertical"
        tooltip="Start by clicking an item in the Components section"
        bordered
        headerBordered
      >
        <ProCard title="Flow Panel" colSpan="300px">
          <Divider style={{ marginTop: -6 }} orientation="center">
            Components
          </Divider>
          <FlowComponentsList newComponentsList={newComponentsList} />
          <Divider orientation="center">Current</Divider>
          <NewComponentsList />
        </ProCard>
        <ProCard title="Flow Content">
          <div style={{ height: 360 }}>右侧内容</div>
        </ProCard>
      </ProCard>
    </div>
  );
};

export default NewFlow;
