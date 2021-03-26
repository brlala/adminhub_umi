import React, { FC, useCallback, useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
// @ts-ignore
import { FormattedMessage, Redirect, useIntl, useParams, useRequest } from 'umi';
import { changeLanguage } from '@/utils/language';
import { Button, Divider, Form, Input, List, message, Popover, Space } from 'antd';
import styles from './index.less';
import FlowComponentsList from '@/pages/FlowList/components/FlowComponentsList';
import {
  GenericTemplateComponent,
  TextComponent,
  FlowComponent,
  ButtonTemplateComponent,
  ImageComponent,
  QuickReplyComponent,
  VideoComponent,
  FileComponent,
  CustomComponent,
  InputComponent,
} from '@/components/FlowItems/UpdateFlow';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { CloseCircleOutlined, DeleteOutlined, RightOutlined } from '@ant-design/icons';
import { addFlow, editFlow, getFlow } from '../service';
import { FlowEditableComponent, FlowItem, FlowItemData } from 'models/flows';

import { Link } from '@umijs/preset-dumi/lib/theme';
import PhonePreview from '@/components/PhonePreview';
import ListSort from '../components/ListSort';

changeLanguage('en-US');

type InternalNamePath = (string | number)[];

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

const NewFlow: FC = (props) => {
  let { flowId } = useParams<{flowId: string}>()
  const [componentList, setComponentList] = useState<FlowItem[]>([]);
  const [error, setError] = useState<ErrorField[]>([]);
  const [redirect, setRedirect] = useState(false);
  const [action, setAction] = useState('updated');
  const [name, setName] = useState<string>('');

  const [componentLength, setComponentLength] = useState(0);

  const { data } = useRequest((values: any) => {
    console.log(flowId)
    if (flowId)
      return getFlow(flowId);
    return null
  },{
    onSuccess: (result) => {
      const currName = data?.name ||'';
      setName(currName);

      const list = data?.flow || [];
      let newList: FlowItem[];
      newList = []
      list.map((ele, index) => {
        newList = [...newList, ele]
        if ('quickReplies' in ele.data) {
          newList = [...newList, {type: 'quickReplies', data: {quickReplies: ele.data.quickReplies}}]
        }
      })
      console.log(newList)
      setComponentList(newList)
      setComponentLength(list.length)
    },
    throwOnError: true
  });

  const { run: postRun } = useRequest(
    (data) => {
      if (flowId) 
        return editFlow(data);
      else
        return addFlow(data);
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log(result);
        if (flowId) 
          message.success(`Flow "${data?.name}" ${action}`)
        else
          message.success('New flow added')
        setRedirect(true)

      },
      throwOnError: true,
    },
  );
  
  const handleDelete = () => {
    setAction('deleted')
    postRun({...data, isActive: false});
  }

  const onFinish = (values: any) => {
    let toSubmit: FlowItemData[] = [];
    // let lastElement = array.pop();
    componentList.map((item) => {
      if (item.type === 'quickReplies') {
        let prevItem = toSubmit.pop();
        toSubmit.push({ ...prevItem, data: { ...prevItem.data, ...item.data } });
      } else {
        toSubmit.push({ type: item.type, data: item.data });
      }
    });
    // const toSubmit = componentList.map((item)=> {
    //   return {type: item.type, data: item.data}
    // })
    console.log('values: ', values);
    console.log('componentList: ', toSubmit);
    if (flowId)
      postRun({ id: flowId, name: values.name? values.name : data?.name, flow: toSubmit, isActive: true});
    else
      postRun({ name: values.name? values.name : data?.name, flow: toSubmit, isActive: true });
  };

  const renderComponent = (component: { data: any; type: string }, index: number) => {
    const { data, type } = component;
    let renderedComponent;
    // console.log(type);
    switch (type) {
      case 'message':
        renderedComponent = (
          <TextComponent componentKey={index} componentData={data} onChange={setComponentList} />
        );
        break;
      case 'image':
        renderedComponent = (
          <ImageComponent componentKey={index} componentData={data} onChange={setComponentList} />
        );
        break;
      case 'genericTemplate':
        renderedComponent = (
          <GenericTemplateComponent
            componentKey={index}
            componentData={data}
            onChange={setComponentList}
            current={componentList}
          />
        );
        break;
      case 'buttonTemplate':
        renderedComponent = (
          <ButtonTemplateComponent
            componentKey={index}
            componentData={data}
            onChange={setComponentList}
          />
        );
        break;
      case 'video':
        renderedComponent = (
          <VideoComponent componentKey={index} componentData={data} onChange={setComponentList} />
        );
        break;
      case 'file':
        renderedComponent = (
          <FileComponent componentKey={index} componentData={data} onChange={setComponentList} />
        );
        break;
      case 'flow':
        renderedComponent = (
          <FlowComponent componentKey={index} componentData={data} onChange={setComponentList} />
        );
        break;
      case 'custom':
        renderedComponent = (
          <CustomComponent componentKey={index} componentData={data} onChange={setComponentList} disabled={flowId? true: false}/>
        );
        break;
      case 'input':
        renderedComponent = (
          <InputComponent componentKey={index} componentData={data} onChange={setComponentList} />
        );
        break;
      case 'quickReplies':
        renderedComponent = (
          <QuickReplyComponent
            componentKey={index}
            componentData={data}
            onChange={setComponentList}
          />
        );
        break;
      default:
        renderedComponent = <div>Cannot render {type}</div>;
    }
    return renderedComponent;
  };

  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          {/*<div className={styles.errorField}>{fieldLabels[key]}</div>*/}
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };
  
  const Refreshable: FC = () => {
    setComponentLength(componentList.length)
    return (
    <div className={'list-sort-demo-wrapper'}>
      <div className='list-sort-demo'>
        <ListSort
          component="List"
          dragClassName="list-drag-selected"
          appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}> 
            {componentList.map((flowNode, index) => <List className='list-sort-demo-list'>{renderComponent(flowNode, index)}</List>)}
        </ListSort>
      </div>
    </div>
    )
  };

  const handleChange = (data: any) => {
    console.log('handleChange', typeof(data), data.length)
    if (!data.length)
      return
    let newData: FlowItem[]; 
    newData = [...data]?.map((entry) => {
      console.log(entry.key)
      return componentList[Number(entry.key)]
    })
    setComponentList(newData);
  };

  return (
    redirect? (<Redirect to="/flows" />):(
      <Form name="complex-form" onFinish={onFinish} initialValues={{name: name}}>
        <PageContainer
          title={<Space> 
            {name? name : 'New Flow'} <RightOutlined />
            <Form.Item name="name" style={{margin: 0}} //validateFirst hasFeedback
            ><Input placeholder="Flow Name"/></Form.Item>
          </Space>}
      extra={flowId?<Button type="primary" danger onClick={handleDelete}><DeleteOutlined /> Delete </Button>:<></>}
    >
    <div className={styles.componentsList}>
        <ProCard
          split="vertical"
          bordered
          headerBordered
        >
          <ProCard title="Flow Panel" colSpan={5}>
            <Divider style={{ marginTop: -6 }} orientation="center">
              Add Component
            </Divider>
            <FlowComponentsList setNewComponentsList={setComponentList}/>
            <Divider orientation="center">
              Triggers
            </Divider>
          </ProCard>
          <ProCard title="Flow Content" colSpan={9} className={styles.FlowEditArea} >
            {(componentLength != componentList.length)? <Refreshable/>: <div className={'list-sort-demo-wrapper'}>
              <div className='list-sort-demo'>
                <ListSort
                  onChange={handleChange}
                  dragClassName="list-drag-selected"
                  appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}> 
                    {componentList.map((flowNode, index) => <div className='list-sort-demo-list' key={index}>
                      {renderComponent(flowNode, index)}</div>)}
                </ListSort>
              </div>
            </div>}
            <FooterToolbar>
              {getErrorInfo(error)}
              {/*<Button type="primary" onClick={() => form?.submit()} loading={submitting}>*/}
              <Link to="/flows">
                <Button key="3">Cancel</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={false}>
                Submit
              </Button>
            </FooterToolbar>
            {componentList.length === 0 && (
              <div style={{ height: 360 }}>Add a flow to see the contents here</div>
            )}
          </ProCard>
          <ProCard title="Preview" colSpan={10} style={{textAlign: 'center'}}>
            <PhonePreview data={componentList} editMode={true}/>
          </ProCard>
        </ProCard>
        </div></PageContainer>
      </Form>
    
  ));
};

export default NewFlow;
