import { Card, Col, Divider, Form, List, Row, Button, Typography, Select } from 'antd';
import React, { FC, useState } from 'react';
import { useParams} from "react-router";
import { useRequest } from 'umi';
import { Params, BroadcastTemplateListItem, BroadcastFlowList } from './data.d';
import { getTags, queryBroadcastTemplate } from './service';
import styles from './style.less';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { TextComponent, ImageComponent, VideoAttachmentComponent, GenericTemplatesComponent, ButtonTemplatesComponent, FlowComponent } from '@/components/FlowItems/UpdateFlow';

const FormItem = Form.Item;
const { Paragraph } = Typography;


const tailLayout = {
  wrapperCol: { offset: 12, span: 24 },
};

const { Option } = Select;

const NewBroadcast: FC = () => {
  let { templateId } = useParams()
  type component = {
    type: string,
    data: {}
  }
  const [componentList, setComponentsList] = useState<component[]>([]);

  const { data, loading, run} = useRequest((values: any) => {
    return queryBroadcastTemplate(templateId);
  });

  const renderComponent = (component: string, index: number) => {
    let renderedComponent;
    const componentData = { type: component, data: {} }

    if (componentList.length < index + 1) {setComponentsList((prevArray) => [...prevArray, componentData])}
    console.log('componentList', componentList)
    
    console.log(componentData, index)
    switch (component) {
      case 'text':
        renderedComponent = <TextComponent componentKey={index} onChange={setComponentsList} />;
        break;
      case 'image':
        renderedComponent = <ImageComponent componentKey={index} onChange={setComponentsList} />;
        break;
      // case 'videoAttachments':
      //   renderedComponent = <VideoAttachmentComponent key={index} />;
      //   break;
      case 'fileAttachments':
        renderedComponent = <div key={index} >Not implemented yet</div>;
        break;
      case 'genericTemplates':
        renderedComponent = <GenericTemplatesComponent key={index} />;
        break;
      case 'buttonTemplates':
        renderedComponent = <ButtonTemplatesComponent key={index} />;
        break;
      case 'flow':
        renderedComponent = <FlowComponent key={index} />;
        break;
      default:
        renderedComponent = <div key={index} >Cannot render {component}</div>;
    }
    return renderedComponent
  };


  const list = data?.flow || [];

  const onFinish = (values: any) => {
    console.log('Success:', values, componentList );
  };

  const { data: tags, loading: tagsLoading, run: tagsRun, cancel: tagsCancel } = useRequest(getTags, {
    manual: true
  });

  return (
    <PageContainer>
      <div className={styles.coverCardList}>
        <ProCard title="Create New Broadcast">
            <Form 
              name="broadcast-form" 
              onFinish={onFinish}>
              <Row>
                <Col span={12} key={1}>
                  <FormItem 
                    name="flow" >
                    <ProCard title="Component">
                      {list.map((flowNode, index) => renderComponent(flowNode, index))}
                    </ProCard>
                  </FormItem>
                </Col>
                <Col span={12} key={2}>
                <FormItem >
                <ProCard title="Audience">

                  <FormItem 
                    name="tags">
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onSearch={tagsRun}
                      onFocus={tagsRun}
                      onBlur={tagsCancel}
                      loading={tagsLoading}
                      // onChange={handleChange}
                    >
                      {tags && tags.map(i => {
                        return <Option key={i}>{i}</Option>
                      })}
                    </Select>
                  </FormItem>
                </ProCard>
                </FormItem>
                </Col>
              </Row>

              <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
            </Form>
        </ProCard>
      </div>

    </PageContainer>
  );
};

export default NewBroadcast;
