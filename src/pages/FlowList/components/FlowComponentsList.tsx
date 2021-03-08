import { Button, Col, Row, Space } from 'antd';
import { ApartmentOutlined, AppstoreOutlined, ClusterOutlined, EditOutlined, FontSizeOutlined, FunctionOutlined, MessageOutlined, PaperClipOutlined, PartitionOutlined, PictureOutlined, PlusOutlined, SendOutlined, VideoCameraOutlined } from '@ant-design/icons';
import React from 'react';
import type { DraggableListItems, FlowList } from '../data';
import { nanoid } from 'nanoid';

export type UpdateComponentsListProps = {
  setNewComponentsList: (p: (prevState: DraggableListItems[]) => DraggableListItems[]) => void;
};

const FlowComponentsList: React.FC<UpdateComponentsListProps> = ({ setNewComponentsList }) => {
  const componentsList: FlowList[] = [
    { name: 'Text', type: 'message', icon: <FontSizeOutlined /> },
    { name: 'Image', type: 'image', icon: <PictureOutlined /> },
    { name: 'Video', type: 'video', icon: <VideoCameraOutlined /> },
    { name: 'File', type: 'file', icon: <PaperClipOutlined /> },
    { name: 'Generic Template', type: 'genericTemplate', icon: <ClusterOutlined /> },
    { name: 'Button Template', type: 'buttonTemplate', icon: <AppstoreOutlined /> },
    { name: 'Flow', type: 'flow', icon: <ApartmentOutlined /> },
    { name: 'Custom', type: 'custom', icon: <FunctionOutlined /> },
    { name: 'Input', type: 'input', icon: <EditOutlined /> },
    { name: 'Quick Replies', type: 'quickReplies', icon: <SendOutlined /> },
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
      case 'video':
        componentData = { type, data: { url: '' } };
        break;
      case 'genericTemplate':
        componentData = { type, data: { elements: [{ imageUrl: '', title: {}, subtitle: {}, buttons: [] } ] } };
        break;
      case 'buttonTemplate':
        componentData = { type, data: { text: {}, buttons: [] } };
        break;
      case 'file':
        componentData = { type, data: { url: '' } };
        break;
      case 'flow':
        componentData = { type, data: { flow: { name: '', flowId: '', params: [] } } };
        break;
      case 'custom':
        componentData = { type, data: { function: '' } };
        break;
      case 'input':
        componentData = { type, data: { inputName: '', isTemporary: true, inputType: '', customRegex: '', invalidMessage: '' } };
        break;
      case 'quickReplies':
        componentData = { type, data: { quickReplies: []}};
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
              <Col className="gutter-row" span={6}>
                <Button
                  size="small"
                  type="primary"
                  ghost
                  key={item.type}
                  value={item.type}
                  onClick={() => addComponent(item)}
                >
                  {/* <PlusOutlined /> */}
                  {item.icon} {item.name}
                </Button>
              </Col>
            </Row>
          </>
        );
      })}
    </Space>
  );
};

export default FlowComponentsList;
