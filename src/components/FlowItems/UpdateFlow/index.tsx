import React, { useEffect, useState } from 'react';
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';
import { Button, Divider, Form, Input, message, Progress, Radio, Card } from 'antd';
import { queryFlowsFilter } from '@/pages/QuestionList/service';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import { Upload, Modal } from 'antd';
const { TextArea } = Input;
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import ImgCrop from 'antd-img-crop';
import { Tabs } from 'antd';

import './index.less';
import { DropdownProps } from '@/pages/QuestionList/data';

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
  text: string;
  type: string;
  content: string;
};
export type Templates = {
  attachments: Attachments[];
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
// export type TextComponentDataProps = {
//   componentData: TextComponentData;
// };

export type TextComponentDataProps = {
  componentData: TextComponentData;
  index: Number;
};
export type GenericTemplateComponentDataProps = {
  componentData: GenericTemplatesComponentData[];
  index: Number;
};

export type AttachmentsComponentDataProps = {
  componentData: AttachmentsComponentData;
  index: Number;
};

export const TextComponent: React.FC<TextComponentDataProps> = ({
  componentKey,
  componentData,
  onChange,
}) => {
  console.log(componentData, componentKey);
  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Text
      </Divider>
      <Form.Item
        id={componentKey.toString()}
        name={componentKey}
        rules={[{ required: true, message: 'Field is required' }]}
      >
        <TextArea
          rows={4}
          placeholder="Please input"
          defaultValue={componentData.data.textField}
          onChange={(e) => {
            console.log('HERE', e.target.value);
            onChange((prevState: any) =>
              [...prevState].map((item, index) => {
                if (index === componentKey) {
                  return { ...item, data: { text: { EN: e.target.value } } };
                } else return item;
              }),
            );
          }}
        />
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

const initialPanes = [{ title: '1sa', content: 'Content of Tab 1', key: '1' }];
const { TabPane } = Tabs;

export const GenericTemplatesComponent = ({ componentData }, index) => {
  const [tabIndex, setTabIndex] = useState(2);
  const [activeKey, setActiveKey] = useState(initialPanes[0].key);
  console.log(componentData.data.templates);
  const [panes, setPanes] = useState(componentData.data.templates);

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
    const activeKey = `newTab${tabIndex}`;
    const newPanes = [...panes];
    newPanes.push({
      title: `${tabIndex}`,
      content: {
        title: null,
        subtitle: null,
        buttons: [],
      },
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
          <TabPane tab={pane.title} key={pane.title} closable={pane.closable}>
            <TemplateComponent componentData={pane} />
          </TabPane>
        ))}
      </Tabs>
    </>
  );
};

export const TemplateComponent: React.FC<Templates> = ({ componentData }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState(false);
  // const [fileList, setFileList] = useState(componentData.data.attachments);
  const [fileList, setFileList] = useState(componentData.attachments);
  const [selectRow, setSelectRow] = useState(null);
  const [responseType, setResponseType] = useState('flow');
  const [flows, setFlows] = useState<DropdownProps[]>([]);

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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  let responseArea;
  if (responseType === 'url') {
    responseArea = (
      <ProFormTextArea
        width="xl"
        label="URL"
        name="urlResponse"
        placeholder="Link to URL"
        // rules={[
        //   {
        //     required: true,
        //     message: (
        //       <FormattedMessage
        //         id="pages.searchTable.response"
        //         defaultMessage="Response is required"
        //       />
        //     ),
        //   },
        // ]}
      />
    );
  } else {
    responseArea = (
      <ProFormSelect
        width="xl"
        name="flowResponse"
        label="Flow Response"
        initialValue={selectRow?.type === 'flow' ? selectRow?.content : null}
        showSearch
        // @ts-ignore
        request={async () => {
          const flowsRequest = await queryFlowsFilter('name,params');
          setFlows(flowsRequest);
        }}
        options={flows}
        // rules={[
        //   {
        //     required: true,
        //     message: (
        //       <FormattedMessage
        //         id="pages.searchTable.response"
        //         defaultMessage="Response is required"
        //       />
        //     ),
        //   },
        // ]}
      />
    );
  }

  return (
    <div>
      <Form.Item>
        <Card
          size="small"
          title={
            <>
              <div className="GenericTemplate">
                <ImgCrop rotate aspect={1.91}>
                  <Upload
                    customRequest={uploadImage}
                    onChange={handleChange}
                    accept=".jpg,.jpeg"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </ImgCrop>
              </div>
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img alt="image-preview" style={{ width: '100%' }} src={previewImage} />
              </Modal>
              <Input placeholder="Title" defaultValue={componentData.title} />
            </>
          }
          style={{ width: 300 }}
        >
          <Input placeholder="Subtitle" defaultValue={componentData.subtitle} />
          {componentData.buttons.map((button) => (
            <Button
              block
              onClick={() => {
                console.log({ row: button });
                setSelectRow(button);
                setResponseType(button.type);
                showModal();
              }}
            >
              {button.text}
            </Button>
          ))}
          {componentData.buttons.length < 3 && (
            <Button
              onClick={() => {
                showModal();
                setSelectRow(null);
              }}
              type="dashed"
              block
            >
              <PlusOutlined /> Add Button
            </Button>
          )}
          <Modal
            title="New Button"
            visible={isModalVisible}
            onOk={handleOkModal}
            onCancel={handleCancelModal}
            destroyOnClose={true}
            width={900}
          >
            <ProForm
              // onFinish={async (values) => {
              //   console.log(values);
              //   message.success('Button added');
              // }}
              initialValues={{
                text: selectRow?.text,
                content: selectRow?.type,
                urlResponse: selectRow?.type === 'url' ? selectRow?.content : null,
                urlResponse: selectRow?.type === 'url' ? selectRow?.content : null,
              }}
              submitter={false}
            >
              <ProForm.Item
                name="dataSource"
                // initialValue={defaultData}
                trigger="onValuesChange"
              >
                <ProFormText name="text" label="Display Text" />
                <div className="ant-row ant-form-item">
                  <div className="ant-col ant-form-item-label">
                    <label title="Type of Response">Type of Response</label>
                  </div>
                  <div className="ant-col ant-form-item-control">
                    <Radio.Group
                      onChange={(event) => {
                        console.log(event.target.value);
                        setResponseType(event.target.value);
                      }}
                      defaultValue={selectRow ? selectRow.type : 'flow'}
                      name="type"
                    >
                      <Radio.Button value="flow">Flow</Radio.Button>
                      <Radio.Button value="url">URL</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                {responseArea}
              </ProForm.Item>
            </ProForm>
          </Modal>
        </Card>
      </Form.Item>
    </div>
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

export const FileAttachmentComponent: React.FC<AttachmentsComponentDataProps> = ({
  componentData,
}) => {
  const [fileList, setFileList] = useState(componentData.data.attachments);
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  return (
    <>
      <Form.Item>
        <Divider style={{ marginTop: -6 }} orientation="left">
          File
        </Divider>
        <Upload onChange={handleChange} action={'http://localhost:5000/upload'} fileList={fileList}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>
    </>
  );
};
