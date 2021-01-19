import { Button, Col, Row, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import React from 'react';
import { ActionType } from '@ant-design/pro-table';

export type UpdateComponentsListProps = {
  newComponentsList: string[];
};

const FlowComponentsList: React.FC<UpdateComponentsListProps> = ({ newComponentsList }) => {
  const componentsList = [
    { name: 'Text', key: 'text' },
    { name: 'Attachments', key: 'attachments' },
    { name: 'Generic Templates', key: 'genericTemplates' },
    { name: 'Button Templates', key: 'buttonTemplates' },
    { name: 'Flow', key: 'flow' },
  ];

  const addComponent = (event) => {
    console.log(event);
    newComponentsList.push(event.target);
  };

  return (
    <Space direction="vertical" size={4}>
      {componentsList.map((item, index) => {
        return (
          <>
            <Row gutter={32}>
              <Col className="gutter-row" span={18}>
                {item.name}
              </Col>
              <Col className="gutter-row" span={6}>
                <Button
                  size="small"
                  type="primary"
                  ghost
                  key={item.key}
                  value={item.key}
                  onClick={() => addComponent(item.key)}
                >
                  <PlusOutlined /> Add
                </Button>
              </Col>
              <br />
            </Row>
          </>
        );
      })}
    </Space>
  );
};

export default FlowComponentsList;
