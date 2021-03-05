import { Card, Button, Form, List, message, Space, Switch, Row, Col, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { FC, useState } from 'react';
import { Link, useRequest } from 'umi';

import { BroadcastTemplateListItem } from './data.d';
import { queryBroadcastTemplateList, addBroadcastTemplate, updateBroadcastTemplate, deleteBroadcastTemplate } from './service';
import TemplateModal from './components/TemplateModal';
import styles from './style.less';
import { PageContainer } from '@ant-design/pro-layout';
import TagSelect from '../components/TagSelect';
import StandardFormRow from '../components/StandardFormRow';

const FormItem = Form.Item;


const BroadcastTemplateList: FC = () => {

  const { data, loading, run } = useRequest((values: any) => {
    return queryBroadcastTemplateList(values);
  });

  const [visible, setVisible] = useState<boolean>(false);
  const [alert, setAlert] = useState<Partial<BroadcastTemplateListItem>>();
  const [current, setCurrent] = useState<Partial<BroadcastTemplateListItem>>();
  
  const { run: postRun } = useRequest(
    (method, data) => {
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
        setVisible(false);
        message.success('Success');
        run({}).catch();
      },
      throwOnError: true
    }
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async (values: BroadcastTemplateListItem) => {
    const id = current?.id || '';
    const method = id ? 'update' : 'add';
    postRun(method, values)
    .catch((response) => {
      setVisible(true);
      message.error(response);
    });
    setAlert({});
  };


  const handleDelete = (item: Partial<BroadcastTemplateListItem>) => {
    console.log(item)
    const method = 'delete';
    setVisible(false); 
    setAlert(item);
    postRun(method, {id: item.id});
    run({});
  };

  const handleUndoDelete = () => {
    postRun('update', {...alert, isActive: true});
    setAlert({});
  };

  const showModal = () => {
    setAlert({});
    setVisible(true);
  };

  const renderComponent = (component: string, index: number) => {
    let renderedComponent;
    switch (component) {
      case 'message':
        renderedComponent = 'Text';
        break;
      case 'image':
        renderedComponent = 'Image';
        break;
      case 'genericTemplate':
        renderedComponent = 'Generic Template';
        break;
      case 'buttonTemplate':
        renderedComponent = 'Button Template';
        break;
      case 'video':
        renderedComponent = 'Video';
        break;
      default:
        renderedComponent = 'others';
    }
    return <Button size="small" key={index}> {renderedComponent}</Button>;
  };
  
  const nullData: Partial<BroadcastTemplateListItem> = {};
  const cardList = data && (
    <List
      rowKey="id"
      loading={loading}
      grid={{ gutter: 16, xl: 4, lg: 3, md: 3, sm: 2, xs: 1, column: 5 }}
      dataSource={[nullData, ...data]}
      renderItem={(item) => {
        if (item && item.id && item.flow) {
          return (
            <List.Item>
              <Card 
                className={styles.card} 
                hoverable 
                actions={[<Link key="option0" to={`/broadcasts/broadcast-templates/${item.id}`}>Compose</Link>, <a key="option1" onClick={() => { setCurrent(item); showModal() }}>Edit</a>]}
                title={<a 
                  onClick={() => { setCurrent(item); showModal() }}>{item.name}</a>}
                extra={<Button
                  size="small" onClick={() => handleDelete(item)}><DeleteOutlined /></Button>}>
                <Card.Meta
                  description={
                    <Space direction="horizontal" size={4} wrap>
                      {item.flow.map((item, index) => renderComponent(item, index)
                      )}
                    </Space>}/>
              </Card>
            </List.Item> )}
        return (
          <List.Item>
            <Card 
              className={styles.cardEmpty} 
              hoverable
              onClick={() => { setCurrent({}); showModal()}}>
                <p style={{marginBottom: 12}}> <PlusOutlined style={{ fontSize: '30px'}} /> </p>
                <p className="ant-upload-hint">New Template</p>
            </Card>
          </List.Item>)}}/>)

  return (
    <PageContainer>  <Space direction='vertical' className={styles.coverCardList}>
      <Card bordered={false}>
        <Form
          layout="inline"
          initialValues={{
          }}
          onValuesChange={(_, values) => {
            run(values);
          }}
        >
          <StandardFormRow title="Contains" last>
            <Row>
              <Col span={2}>
                <FormItem name="intersect">
                  <Switch checkedChildren="ALL" unCheckedChildren="OR" />
                </FormItem>
              </Col>
              <FormItem name="flow">
                <TagSelect hideCheckAll>
                  <TagSelect.Option value="message">Text</TagSelect.Option>
                  <TagSelect.Option value="image">Image</TagSelect.Option>
                  <TagSelect.Option value="video">Video</TagSelect.Option>
                  <TagSelect.Option value="genericTemplate">Generic Template</TagSelect.Option>
                  <TagSelect.Option value="buttonTemplate">Button Template</TagSelect.Option>
                </TagSelect>
              </FormItem>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      {alert && alert.id?<Alert
        message={"Deleted Template " + alert.name}
        type="success"
        banner
        showIcon
        action={
          <Button size="small" type="default" onClick={handleUndoDelete} >
            Undo
          </Button>
        }
        closable
      />:<></>}
      <div className={styles.cardList}>
        {cardList}
      </div>
      
      <TemplateModal
        current={current}
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </Space></PageContainer>
  );
};

export default BroadcastTemplateList;









