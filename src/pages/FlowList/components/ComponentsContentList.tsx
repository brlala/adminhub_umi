import { DraggableListItems } from '@/pages/FlowList/data';
import React from 'react';

export type ComponentsContentListProps = {
  setComponentsContentList: (items: any[]) => void;
  componentContentList: any[];
};

const ComponentsContentList: React.FC<ComponentsContentListProps> = ({
  setComponentsContentList,
  componentContentList,
}) => {};

export default ComponentsContentList;
