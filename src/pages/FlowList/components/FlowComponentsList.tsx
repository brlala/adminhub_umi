import { Button, Col, Row, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { DraggableListItems } from '../data';
import { nanoid } from 'nanoid';
import {
  AttachmentComponent,
  ButtonTemplatesComponent,
  FlowComponent,
  GenericTemplatesComponent,
  TextComponent,
} from '@/components/FlowItems';

export type UpdateComponentsListProps = {
  setNewComponentsList: (p: (prevState: DraggableListItems[]) => DraggableListItems[]) => void;
  componentList: DraggableListItems[];
  setComponentsComponentsList: () => void;
};

const FlowComponentsList: React.FC<UpdateComponentsListProps> = ({
  setNewComponentsList,
  componentList,
  setComponentsComponentsList,
}) => {
  const componentsList = [
    { name: 'Text', key: 'text' },
    { name: 'Attachments', key: 'attachments' },
    { name: 'Generic Templates', key: 'genericTemplates' },
    { name: 'Button Templates', key: 'buttonTemplates' },
    { name: 'Flow', key: 'flow' },
  ];

  const addComponent = (item) => {
    const { name, key } = item;
    console.log(name);
    const uniqueId = `${key}-${nanoid(4)}`;
    let componentData;
    switch (key) {
      case 'text':
        componentData = { type: key, name: uniqueId, data: { qrs: [], textField: null } };
        break;
      case 'attachments':
        componentData = { type: key, name: uniqueId, data: { qrs: [], attachments: [] } };
        break;
      case 'genericTemplates':
        componentData = { type: key, name: uniqueId, data: { qrs: [], templates: null } };
        break;
      case 'buttonTemplates':
        componentData = { type: key, name: uniqueId, data: { textField: [], buttons: [] } };
        break;
      case 'flow':
        componentData = { type: key, name: uniqueId, data: { flowId: null, params: [] } };
        break;
    }
    const entry = {
      title: name,
      key: uniqueId,
      id: uniqueId,
      componentData: componentData,
    };

    setNewComponentsList((prevState) => [...prevState, entry]);
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
