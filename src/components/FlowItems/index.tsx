import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import ProForm, {
  ModalForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormUploadDragger,
  StepsForm,
} from '@ant-design/pro-form';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Tooltip,
  Select,
  Row,
  message,
  Progress,
  Space,
  Popconfirm,
  Radio,
} from 'antd';
const { Option } = Select;
import { queryFlowsFilter } from '@/pages/QuestionList/service';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import { Upload, Modal } from 'antd';
const { TextArea } = Input;
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import styles from './index.less';

export type TextComponentData = {
  type: string;
  name: string;
  data: { textField: string };
};
export type Attachments = {
  name: string;
  url?: string;
  uid: string;
  response?: { url: string };
};
export type Buttons = {
  type: string;
  response: string;
};
export type Templates = {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttons: Buttons[];
};
export type AttachmentsComponentData = {
  type: string;
  name: string;
  data: { attachments: Attachments[] };
};

export type GenericTemplatesComponentData = {
  type: string;
  name: string;
  data: Templates[];
};
export type ButtonTemplatesComponentData = {
  type: string;
  name: string;
  data: { textField: string; buttons: Buttons[] };
};

export type FlowComponentData = {
  type: string;
  name: string;
  data: { flowId: string; params: string[] };
};
export type TextComponentDataProps = {
  componentData: TextComponentData;
};

export type AttachmentsComponentDataProps = {
  componentData: AttachmentsComponentData;
};

export const TextComponent: React.FC<TextComponentDataProps> = ({ componentData }) => {
  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Text
      </Divider>
      <Form.Item name="text" rules={[{ required: true, message: 'Field is required' }]}>
        <TextArea rows={4} placeholder="Please input" defaultValue={componentData.data.textField} />
      </Form.Item>
    </>
  );
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const ImageAttachmentComponent: React.FC<AttachmentsComponentDataProps> = ({
  componentData,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState(componentData.data.attachments); // old items is in "url", new items is in "response" key

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const formData = new FormData();
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData, config);
      onSuccess({ url: res.data.url });
      console.log('server res: ', res);
    } catch (err) {
      console.log('Error: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  };

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Image
      </Divider>
      <Form.Item>
        <Form.Item noStyle rules={[{ required: true, message: 'Image is required' }]}>
          <Upload
            customRequest={uploadImage}
            onChange={handleChange}
            accept="image/*"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            // previewFile={(file) => {
            //   return new Promise((resolve) => {
            //     const reader = new FileReader();
            //     reader.readAsDataURL(file);
            //     reader.onload = function (e) {
            //       const dataUrl = e.target.result;
            //       resolve(
            //         'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3498227956,2363956367&fm=26&gp=0.jpg',
            //       );
            //     };
            //   });
            // }}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="image-preview" style={{ width: '100%' }} src={previewImage} />
            {/*<object*/}
            {/*  style={{ width: '100%', height: '1000px' }}*/}
            {/*  data="http://www.africau.edu/images/default/sample.pdf"*/}
            {/*/>*/}
          </Modal>
        </Form.Item>
        {progress > 0 ? <Progress percent={progress} /> : null}
      </Form.Item>
    </>
  );
};

export const ButtonTemplatesComponent: React.FC = ({ componentData }) => {
  const [buttonIndex, setButtonIndex] = useState(0);
  const [responseType, setResponseType] = useState<string>('flow');
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  let responseArea;
  if (responseType === 'url') {
    responseArea = (
      <ProFormText
        width="xl"
        label="URL"
        name="urlResponse"
        rules={[
          {
            required: true,
            message: <FormattedMessage id="pages.flowTable.url" defaultMessage="URL is required" />,
          },
        ]}
      />
    );
  } else {
    responseArea = (
      <ProFormSelect
        width="xl"
        prop
        name="flowResponse"
        label="Response"
        showSearch
        // request={async () => {
        //   const topics = await queryTopics();
        //   setTopics(topics);
        // }}
        // options={topics}
        request={async () => {
          return await queryFlowsFilter('name,params');
        }}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.response"
                defaultMessage="Response is required"
              />
            ),
          },
        ]}
      />
    );
  }

  return (
    <>
      <Form.Item>
        <Divider style={{ marginTop: -6 }} orientation="left">
          Button Templates
        </Divider>
        <Form.Item
          // name={`${componentData.name}-text`}
          rules={[{ required: true, message: 'Field is required' }]}
        >
          <TextArea rows={4} placeholder="Please input" />
          <Form.Item>
            <ModalForm<{
              name: string;
              company: string;
            }>
              title="Add Button"
              trigger={
                <Button type="dashed">
                  <PlusOutlined />
                  Add Button
                </Button>
              }
              modalProps={{
                onCancel: () => console.log('run'),
              }}
              onFinish={async (values) => {
                await waitTime(2000);
                console.log(values.name);
                message.success('提交成功');
                return true;
              }}
            >
              <ProForm.Group>
                <ProFormText
                  width="sm"
                  name="textas"
                  label="Display Button Text"
                  placeholder="Please enter"
                />
              </ProForm.Group>
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-form-item-label">
                  <label title="Type of Button">Type of Response</label>
                </div>
                <div className="ant-col ant-form-item-control">
                  <Radio.Group
                    onChange={(event) => setResponseType(event.target.value)}
                    defaultValue="text"
                    name="responseSelect"
                  >
                    <Radio.Button value="url">URL</Radio.Button>
                    <Radio.Button value="flow">Flow</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <ProForm.Group>{responseArea}</ProForm.Group>
            </ModalForm>
          </Form.Item>
          {/*<Button type="dashed" block>*/}
          {/*  Dashed*/}
          {/*</Button>*/}
        </Form.Item>
      </Form.Item>
      {/*<Form.Item label="Username">*/}
      {/*  <Form.Item*/}
      {/*    name="username"*/}
      {/*    noStyle*/}
      {/*    rules={[{ required: true, message: 'Username is required' }]}*/}
      {/*  >*/}
      {/*    <Input style={{ width: 160 }} placeholder="Please input" />*/}
      {/*  </Form.Item>*/}
      {/*  <Tooltip title="Useful information">*/}
      {/*    <a href="#API" style={{ margin: '0 8px' }}>*/}
      {/*      Need Help?*/}
      {/*    </a>*/}
      {/*  </Tooltip>*/}
      {/*</Form.Item>*/}
      {/*<Form.Item label="Address">*/}
      {/*  <Input.Group compact>*/}
      {/*    <Form.Item*/}
      {/*      name={['address', 'province']}*/}
      {/*      noStyle*/}
      {/*      rules={[{ required: true, message: 'Province is required' }]}*/}
      {/*    >*/}
      {/*      <Select placeholder="Select province">*/}
      {/*        <Option value="Zhejiang">Zhejiang</Option>*/}
      {/*        <Option value="Jiangsu">Jiangsu</Option>*/}
      {/*      </Select>*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item*/}
      {/*      name={['address', 'street']}*/}
      {/*      noStyle*/}
      {/*      rules={[{ required: true, message: 'Street is required' }]}*/}
      {/*    >*/}
      {/*      <Input style={{ width: '50%' }} placeholder="Input street" />*/}
      {/*    </Form.Item>*/}
      {/*  </Input.Group>*/}
      {/*</Form.Item>*/}
      {/*<Form.Item label="BirthDate" style={{ marginBottom: 0 }}>*/}
      {/*  <Form.Item*/}
      {/*    name="year"*/}
      {/*    rules={[{ required: true }]}*/}
      {/*    style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}*/}
      {/*  >*/}
      {/*    <Input placeholder="Input birth year" />*/}
      {/*  </Form.Item>*/}
      {/*  <Form.Item*/}
      {/*    name="month"*/}
      {/*    rules={[{ required: true }]}*/}
      {/*    style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}*/}
      {/*  >*/}
      {/*    <Input placeholder="Input birth month" />*/}
      {/*  </Form.Item>*/}
      {/*</Form.Item>*/}
      {/*<Form.Item label=" " colon={false}>*/}
      {/*  <Button type="primary" htmlType="submit">*/}
      {/*    Submit*/}
      {/*  </Button>*/}
      {/*</Form.Item>*/}
    </>
  );
};

import { Icon, Spin } from 'antd';

export const VideoAttachmentComponent: React.FC<AttachmentsComponentDataProps> = ({
  componentData,
}) => {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);
  const [fileList, setFileList] = useState(componentData.data.attachments);

  useEffect(() => {
    if (componentData.data.attachments.length > 0) {
      setUrl(componentData.data.attachments[0].url);
    }
  }, [componentData]);
  const uploadVideo = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const formData = new FormData();
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData, config);
      onSuccess({ url: res.data.url });
      setUrl(res.data.url);
      console.log('server res: ', res);
    } catch (err) {
      console.log('Error: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  };
  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <>
      <Form.Item>
        <Divider style={{ marginTop: -6 }} orientation="left">
          Video
        </Divider>
        {url && <video controls style={{ width: '100%' }} src={url} />}
        <Upload
          customRequest={uploadVideo}
          accept="video/mp4"
          onChange={handleChange}
          fileList={fileList}
          onRemove={() => setUrl(null)}
          action="http://localhost:5000/upload"
          listType="picture"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
        </Upload>
        {/*{progress > 0 ? <Progress percent={progress} /> : null}*/}
      </Form.Item>
    </>
  );
};

<<<<<<< HEAD
import { Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { AutoCompleteProps } from 'antd/es/auto-complete';
import immer, { produce } from 'immer';
import { plugin } from '@@/core/plugin';
import { ApplyPluginsType } from 'umi';

const { Meta } = Card;
export const GenericTemplatesComponent: React.FC = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
=======
import ImgCrop from 'antd-img-crop';
import { Tabs } from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import ProCard from '@ant-design/pro-card';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import FormItemLabel from 'antd/es/form/FormItemLabel';

const initialPanes = [{ title: '1', content: 'Content of Tab 1', key: '1' }];
const { TabPane } = Tabs;

export const GenericTemplatesComponent = (componentData, index) => {
  const [tabIndex, setTabIndex] = useState(2);
  const [activeKey, setActiveKey] = useState(initialPanes[0].key);
  const [panes, setPanes] = useState(initialPanes);

  const onChange = (activeKey) => {
    setActiveKey(activeKey);
  };

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  const add = () => {
    console.log(tabIndex);
    const activeKey = `newTab${tabIndex}`;
    const newPanes = [...panes];
    newPanes.push({
      title: `${tabIndex}`,
      content: <TemplateComponent componentData={componentData} />,
      key: activeKey,
    });
    setPanes(newPanes);
    setTabIndex(tabIndex + 1);
    setActiveKey(activeKey);
  };

  const remove = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex && lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Step : Generic Template
      </Divider>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        hideAdd={!(panes.length < 10)}
      >
        {panes.map((pane) => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </>
  );
};

export const TemplateComponent: React.FC<GenericTemplateComponentDataProps> = ({
  componentData,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState(false);
  // const [fileList, setFileList] = useState(componentData.data.attachments);
  const [fileList, setFileList] = useState([]);
  const [buttonType, setButtonType] = useState(['flow', 'flow', 'flow']);

  // useEffect(() => {
  //   if (componentData.data.attachments.length > 0) {
  //     setUrl(componentData.data.attachments[0].url);
  //   }
  // }, [componentData]);
  const [progress, setProgress] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const formData = new FormData();
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData, config);
      onSuccess({ url: res.data.url });
      console.log('server res: ', res);
    } catch (err) {
      console.log('Error: ', err);
      const error = new Error('Some error');
      onError({ err });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList && newFileList[newFileList.length - 1]?.response?.url) {
      newFileList[newFileList.length - 1].url = newFileList[newFileList.length - 1].response?.url;
      newFileList[newFileList.length - 1].thumbUrl = null;
    }
    setFileList(newFileList);
  };
>>>>>>> master

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
<<<<<<< HEAD
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        setImageUrl(imageUrl);
      });
    }
  };
  return (
    <>
=======

  const getButtonField = (index: Number) => {
    console.log(index);
    if (buttonType[index] === 'url') {
      return <ProFormText width="md" name={`url${index}`} label="Content" />;
    }
    return (
      <ProFormSelect
        width="md"
        prop
        name={`flow${index}`}
        label="Content"
        showSearch
        // request={async () => {
        //   const topics = await queryTopics();
        //   setTopics(topics);
        // }}
        // options={topics}
        request={async () => {
          return await queryFlowsFilter('name,params');
        }}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.response"
                defaultMessage="Response is required"
              />
            ),
          },
        ]}
      />
    );
  };

  return (
    <div>
>>>>>>> master
      <Form.Item>
        <Divider style={{ marginTop: -6 }} orientation="left">
          Generic Templates
        </Divider>
        <Card
          size="small"
          title={
            <>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-upsloader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={'imageUrl'} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
              <Input placeholder="Title" />
              <Input placeholder="Subtitle" />
            </>
          }
          style={{ width: 300 }}
        >
          <Input placeholder="Subtitle" />
<<<<<<< HEAD
          <Button block>Default</Button>
          <Button block>Default</Button>
          <Button type="dashed" block>
            Dashed
=======
          <Button onClick={showModal} type="dashed" block>
            <PlusOutlined /> Add Button
>>>>>>> master
          </Button>
          <Modal
            title="New Button"
            visible={isModalVisible}
            onOk={handleOkModal}
            onCancel={handleCancelModal}
            destroyOnClose={true}
            width={900}
          >
            <ProForm<{
              name: string;
              company: string;
            }>
              onFinish={async (values) => {
                console.log(values);
                message.success('提交成功');
              }}
              initialValues={{
                name: '蚂蚁设计有限公司',
                useMode: 'chapter',
              }}
            >
              <ProFormText width="sm" name="title" label="Title" tooltip="最长为 24 位" />
              <ProFormTextArea
                name="subtitle"
                label="Subtitle"
                fieldProps={{ maxLength: '80', showCount: true }}
              />
              <ProForm.Item
                name="dataSource"
                // initialValue={defaultData}
                trigger="onValuesChange"
              >
                <ProForm.Group>
                  Button 1:
                  <ProFormText name="text1" label="Display Text" />
                  <ProFormSelect
                    initialValue={buttonType[0]}
                    label="Type"
                    options={[
                      {
                        value: 'url',
                        label: 'URL',
                      },
                      {
                        value: 'flow',
                        label: 'Flow',
                      },
                    ]}
                    width="xs"
                    name="type1"
                  />
                  {getButtonField(0)}
                </ProForm.Group>
                {/*<ProForm.Group>*/}
                {/*  Button 2:*/}
                {/*  <ProFormText name="text2" label="Display Text" />*/}
                {/*  <ProFormText width="sm" name="type2" label="type" />*/}
                {/*  <ProFormText width="sm" name="type" label="type" />*/}
                {/*</ProForm.Group>*/}
                {/*<ProForm.Group>*/}
                {/*  Button 3:*/}
                {/*  <ProFormText name="text3" label="Display Text" />*/}
                {/*  <ProFormText width="sm" name="type3" label="type" />*/}
                {/*  <ProFormText width="sm" name="type" label="type" />*/}
                {/*</ProForm.Group>*/}
                {/*<Form.Item>*/}

                {/*{getButtonField(1)}*/}
                {/*{getButtonField(2)}*/}
                {/*  Button 1:*/}
                {/*  <Input placeholder="Basic usage" />*/}
                {/*  <Input placeholder="Basic usage" />*/}
                {/*  <Input placeholder="Basic usage" />*/}
                {/*</Form.Item>*/}
              </ProForm.Item>
            </ProForm>
          </Modal>
        </Card>
      </Form.Item>
    </>
  );
};

export const FlowComponent: React.FC = () => {
  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Flow
      </Divider>
      <ProFormSelect
        width="xl"
        prop
        name="flowResponse"
        showSearch
        // request={async () => {
        //   const topics = await queryTopics();
        //   setTopics(topics);
        // }}
        // options={topics}
        request={async () => {
          return await queryFlowsFilter('name,params');
        }}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.response"
                defaultMessage="Response is required"
              />
            ),
          },
        ]}
      />
    </>
  );
};

export const FileAttachmentComponent: React.FC = () => {
  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Flow
      </Divider>
      Flow Component Here <div />
    </>
  );
};

import { FlowItemData } from 'models/flows';
import { Image } from 'antd';

interface DisplayCompoenntProps {
  componentKey: number
  componentData: FlowItemData
}

export const TextDisplayComponent: React.FC<DisplayCompoenntProps> = (props) =>  {
  const { componentKey, componentData } = props;
  console.log('Here',  componentKey, componentData)
  return (componentData?.text &&
      <ProCard key={componentKey} style={{ borderRadius: 20, background: "#F6F6F6" }} size="small">
        <div>{componentData.text.TH}</div>
      </ProCard>
  );
};

export const ImageDisplayComponent: React.FC<DisplayCompoenntProps> = (props) =>  {
  const { componentKey, componentData } = props;
  console.log('Here',  componentKey, componentData)
  return (componentData?.url &&
    <Image
      width={300}
      src={componentData.url}
    />
  );
};
