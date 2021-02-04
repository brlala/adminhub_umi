import { Button, Col, Row, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import type { DraggableListItems, FlowList } from '../data';
import { nanoid } from 'nanoid';

export type UpdateComponentsListProps = {
  setNewComponentsList: (p: (prevState: DraggableListItems[]) => DraggableListItems[]) => void;
};

const FlowComponentsList: React.FC<UpdateComponentsListProps> = ({ setNewComponentsList }) => {
  const componentsList: FlowList[] = [
    { name: 'Text', type: 'message' },
    { name: 'Image', type: 'image' },
    { name: 'Video', type: 'videos' },
    { name: 'File', type: 'files' },
    { name: 'Generic Template', type: 'genericTemplate' },
    { name: 'Button Template', type: 'buttonTemplate' },
    { name: 'Flow', type: 'flow' },
    { name: 'Quick Reply', type: 'quickReply' },
  ];

  const addComponent = (item: FlowList) => {
    const { name, type } = item;
    const uniqueId = `${type}-${nanoid(4)}`;
    let componentData;
    switch (type) {
      case 'message':
        componentData = { type, data: { text: {} } };
        break;
      case 'image':
        componentData = { type, data: { url: '' } };
        break;
      case 'genericTemplate':
        componentData = { type, data: { elements: [{ imageUrl: '', title: {}, subtitle: {}, buttons: [] } ] } };
        break;
      case 'buttonTemplate':
        componentData = { type, data: { text: {}, buttons: [] } };
        break;
      case 'videos':
        componentData = { type, data: { attachments: [] } };
        break;
      case 'files':
        componentData = {
          type,
          name: uniqueId,
          data: {
            attachments: [
              {
                name: 'test.pdf',
                url:
                  'https://pandai-admin-portal.s3-ap-southeast-1.amazonaws.com/portal/flows/If%20You%20Suspect%20That%20You%20Are%20Infected%20With%20Covid-19%20%28210124TEH%29%20%281%29.pdf',
                uid: 1,
              },
            ],
          },
        };
        break;
      case 'flow':
        componentData = { type, data: { flowId: '', params: [] } };
        break;
      case 'quickReply':
        componentData = {
          type,
          name: uniqueId,
          data: {
            buttons: [
              {
                text: 'button text1',
                type: 'url',
                content: 'www.firefox.com',
              },
              {
                text: 'button text',
                type: 'flow',
                content: '5e315217a38e6703b4d3f81d',
              },
            ],
          },
        };
        break;
      default:
        componentData = { type, data: {} };
    }
    const entry = {
      title: name,
      key: uniqueId,
      id: uniqueId,
      ...componentData
    };
    console.log(entry)

    setNewComponentsList((prevState) => [...prevState, entry]);
  };

  return (
    <Space direction="vertical" size={4}>
      {componentsList.map((item) => {
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
                  key={item.type}
                  value={item.type}
                  onClick={() => addComponent(item)}
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
