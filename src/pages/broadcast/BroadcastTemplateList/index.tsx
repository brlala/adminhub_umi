import { Card, Button, Form, List, Typography, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { FC, useState } from 'react';
import { Link, useRequest } from 'umi';

import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import { BroadcastTemplateListItem, componentsList } from './data.d';
import { queryBroadcastTemplateList, addBroadcastTemplate, updateBroadcastTemplate, deleteBroadcastTemplate } from './service';
import TemplateModal from './components/TemplateModal';
import styles from './style.less';
import { Route } from "react-router";
import NewBroadcast from './components/NewBroadcast/index'
import { TextComponent, ImageAttachmentComponent, VideoAttachmentComponent, GenericTemplatesComponent, ButtonTemplatesComponent, FlowComponent} from '@/components/FlowItems';

const FormItem = Form.Item;
const { Paragraph } = Typography;


const BroadcastTemplateList: FC = () => {

  const { data, loading, run } = useRequest((values: any) => {
    return queryBroadcastTemplateList(values);
  });

  const list = data? data : [];

  const [view, setView] = useState<string>('template');
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BroadcastTemplateListItem> | undefined>(undefined);
  
  const { run: postRun } = useRequest(
    (method, data) => {
      // if (method === 'remove') {
      //   return removeFakeList(params);
      // }
      console.log(data)
      if (method === 'delete') {
        return deleteBroadcastTemplate(data);
      }
      if (method === 'update') {
        return updateBroadcastTemplate(data);
      }
      return addBroadcastTemplate(data);
    }, {
      manual: true,
      onSuccess: (result) => {
        console.log('result', result)
        setVisible(false);
        message.success('Success');
        run({});
      },
      onError: (result) => {
        setVisible(true);
        message.error('Fail');
      },
    }
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = (values: BroadcastTemplateListItem) => {
    const id = current?.id || '';
    const method = id ? 'update' : 'add';
    console.log('method', method, id, current)
    postRun(method, { id, ...values });
  };


  const handleDelete = (id: string) => {
    const method = 'delete';
    postRun(method, { id });
    run({});
  };

  const showModal = () => {
    console.log(current)
    setVisible(true);
  };

  const renderComponent = (component: string, index: number) => {
    let renderedComponent;
    switch (component) {
      case 'text':
        renderedComponent = 'Text';
        break;
      case 'image':
        renderedComponent = 'Image';
        break;
      case 'genericTemplates':
        renderedComponent = 'Generic Templates';
        break;
      case 'buttonTemplates':
        renderedComponent = 'Button Templates';
        break;
      case 'flow':
        renderedComponent = 'Flow';
        break;
      default:
        renderedComponent = 'others';
    }
    return <Button size="small" key={index}> {renderedComponent}</Button>;
  };

  
  console.log( list )
  const cardList = list && (
    <List<BroadcastTemplateListItem>
      rowKey="id"
      loading={loading}
      grid={{ gutter: 12, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <Card 
            className={styles.card} 
            hoverable 
            actions={[<Link key="option0" to={`/broadcasts/broadcast-templates/${item.id}`}>Compose</Link>, <a key="option1" onClick={() => { setCurrent(item); showModal() }}>Edit</a>]}
            title={<a 
              onClick={() => { setCurrent(item); showModal() }}>{item.name}</a>}
            extra={<Button
              size="small" onClick={() => {setVisible(false); handleDelete(item.id)}}><DeleteOutlined /></Button>}>
            <Card.Meta
              description={
                <Space direction="horizontal" size={4} wrap>
                  {item.flow.map((item, index) => renderComponent(item, index)
                  )}
                </Space>
                
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );

  return (
    view === 'template'?
    (<div className={styles.coverCardList}>
      <Card bordered={false}>
        <Form
          layout="inline"
          initialValues={{
          }}
          onValuesChange={(_, values) => {
            run(values);
          }}
        >
          <StandardFormRow title="Platforms" block style={{ paddingBottom: 11 }}>
            <FormItem name="platforms">
              <TagSelect>
                <TagSelect.Option value="facebook">Messenger</TagSelect.Option>
                <TagSelect.Option value="line">Line</TagSelect.Option>
                <TagSelect.Option value="slack">Slack</TagSelect.Option>
                <TagSelect.Option value="whatsapp">Whatsapp</TagSelect.Option>
                <TagSelect.Option value="telegram">Telegram</TagSelect.Option>
              </TagSelect>
            </FormItem>
          </StandardFormRow>
        </Form>
      </Card>

      <div className={styles.cardList}>
        <List.Item>
          <Button type="dashed" className={styles.newButton} 
            onClick={() => { setCurrent({}); showModal()}}>
            <PlusOutlined /> New Template
          </Button>
        </List.Item>
        {cardList}
      </div>
      
      <TemplateModal
        current={current}
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>): 
    
    (
    <Route path="/broadcasts/broadcast-templates/:templateId">
      <NewBroadcast />
    </Route>
    )
  );
};

export default BroadcastTemplateList;









