import { Col, message, Row, Tree } from 'antd';
import React, { useState } from 'react';
import { DraggableListItems } from '@/pages/FlowList/data';
import { DeleteTwoTone, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

export type NewComponentsListProps = {
  componentList: DraggableListItems[];
  setComponentsList: (items: DraggableListItems[]) => void;
};

const NewComponentsList: React.FC<NewComponentsListProps> = ({
  componentList,
  setComponentsList,
}) => {
  // console.log(componentList);
  const onDragEnter = (info) => {
    // console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };
  const onClickRemove = (key: string) => {
    const newArr = componentList.filter((obj) => obj.key !== key);
    setComponentsList(newArr);
  };

  const onDrop = (info) => {
    // blocked dropping from parent node into children node
    // if (!info.dropToGap) {
    //   message.error('Not allowed!');
    //   return;
    // }
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...componentList];

    // Find dragObject
    let dragObj: DraggableListItems;
    loop(data, dragKey, (item, index: number, arr: DraggableListItems[]) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DraggableListItems[];
      let i: number;
      loop(data, dropKey, (item, index: number, arr: DraggableListItems[]) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setComponentsList(data);
  };

  return (
    <Tree
      className="draggable-tree"
      draggable
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      treeData={componentList}
      titleRender={(nodeData) => {
        const content = (
          <Row>
            <Col span={22}>{nodeData.key}</Col>
            <Col span={2}>
              <DeleteTwoTone twoToneColor="#eb2f96" onClick={() => onClickRemove(nodeData.key)} />
            </Col>
          </Row>
        );
        return content;
      }}
    />
  );
};

export default NewComponentsList;
