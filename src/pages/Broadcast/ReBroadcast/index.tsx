import { Col, Form, Row, Button, Space } from 'antd';
import React, { FC, useState } from 'react';
import { useParams} from "react-router";
import { Redirect, useRequest } from 'umi';
import { sendBroadcast } from './service';
import styles from './style.less';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { NewBroadcastEntry } from '@/pages/Broadcast/BroadcastTemplateList/data';
import BroadcastMeta from '@/pages/Broadcast/components/BroadcastMeta';
import { queryBroadcastHistory } from '../BroadcastHistory/service';
import PhonePreview from '@/components/PhonePreview';

const FormItem = Form.Item;

const tailLayout = {
  wrapperCol: { offset: 12, span: 24 },
};

const ReBroadcast: FC = () => {
  let { broadcastId } = useParams<{broadcastId: string}>()
  const [redirect, setRedirect] = useState(false);

  const { data } = useRequest((values: any) => {
    return queryBroadcastHistory(broadcastId);
  });

  const { run: postRun } = useRequest(
    (data) => {
      return sendBroadcast(data);
    }, {
      manual: true,
      onSuccess: (result) => {
        console.log(result)
        setRedirect(true) 
      },
      throwOnError: true
    }
  );

  const list = data?.flow || [];

  const onFinish = (values: any) => {
    console.log('Values:', values);
    postRun({ 
      tags: values.tags, 
      exclude: values.exclude, 
      sendToAll: values.sendToAll, 
      flowId: data?.flowId, 
      scheduled: values.scheduled, 
      sendAt: values.sendAt} as NewBroadcastEntry)
  };

  return (
    redirect? (<Redirect to="/broadcasts/history" />):
    (<PageContainer>
      <div className={styles.coverCardList}>
        <Row>
        <Col span={12} key={1} style={{textAlign:"center"}}>
            <PhonePreview data={list}/>
        </Col>
        <Col span={12} key={2}>
        <ProCard>
            <Form 
              name="broadcast-form"
              initialValues={{tags: [], exclude: [], sendToAll: false, scheduled: false}} 
              onFinish={onFinish}
              hideRequiredMark>
                <FormItem >
                  <BroadcastMeta></BroadcastMeta>
                </FormItem>
                

              <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
            </Form>
        </ProCard></Col>

        </Row>
      </div>

    </PageContainer>)
  );
};

export default ReBroadcast;
