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
    { name: 'Text', type: 'text' },
    { name: 'Image', type: 'imageAttachments' },
    { name: 'Video', type: 'videoAttachments' },
    { name: 'File', type: 'fileAttachments' },
    { name: 'Generic Templates', type: 'genericTemplates' },
    { name: 'Button Templates', type: 'buttonTemplates' },
    { name: 'Flow', type: 'flow' },
  ];

  const addComponent = (item: FlowList) => {
    const { name, type } = item;
    const uniqueId = `${type}-${nanoid(4)}`;
    let componentData;
    switch (type) {
      case 'text':
        componentData = { type, name: uniqueId, data: { buttons: [], textField: null } };
        break;
      case 'imageAttachments':
        componentData = { type, name: uniqueId, data: { attachments: [] } };
        break;
      case 'videoAttachments':
        componentData = { type, name: uniqueId, data: { attachments: [] } };
        break;
      case 'fileAttachments':
        componentData = { type, name: uniqueId, data: { attachments: [] } };
        break;
      case 'genericTemplates':
        componentData = { type, name: uniqueId, data: { qrs: [], templates: null } };
        break;
      case 'buttonTemplates':
        componentData = { type, name: uniqueId, data: { textField: [], buttons: [] } };
        break;
      case 'flow':
        componentData = { type, name: uniqueId, data: { flowId: null, params: [] } };
        break;
      default:
        componentData = { type, name: uniqueId, data: {} };
    }
    const entry = {
      title: name,
      key: uniqueId,
      id: uniqueId,
      componentData,
    };

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