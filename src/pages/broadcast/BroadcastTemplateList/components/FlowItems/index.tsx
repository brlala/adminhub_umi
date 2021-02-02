import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import ProForm, {
  ModalForm,
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
  Carousel,
  Tabs,
} from 'antd';
const { Option } = Select;
import { queryFlowsFilter } from '@/pages/QuestionList/service';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import { Upload, Modal } from 'antd';
const { TextArea } = Input;
import { ColumnWidthOutlined, LeftCircleOutlined, LeftOutlined, MinusCircleOutlined, PlusOutlined, RightCircleOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
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
  componentKey: number;
  componentData: TextComponentData;
  onChange: (prevState: any) => void;
};

export type AttachmentsComponentDataProps = {
  componentData: AttachmentsComponentData;
};

export const TextComponent: React.FC<TextComponentDataProps> = ({ componentKey, componentData, onChange }) => {
  console.log(componentData, componentKey)
  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Text
      </Divider>
      <Form.Item id={componentKey.toString()} name={componentKey} rules={[{ required: true, message: 'Field is required' }]}>
        <TextArea rows={4} placeholder="Please input" defaultValue={componentData.data.textField} 
        
          onChange={(e) => {
            console.log('HERE', e.target.value)
            onChange((prevState: any) => [...prevState].map((item, index) => {
              if(index === componentKey) {
                return { ...item, data: {text: {EN: e.target.value }}}
              }
              else return item;
            }))
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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
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
          <Button block>Default</Button>
          <Button block>Default</Button>
          <Button type="dashed" block>
            Dashed
          </Button>
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

interface DisplayComponentProps {
  componentKey: number
  componentData: FlowItemData
}

export const QuickReplyDisplayComponent: React.FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  console.log(componentData)
  return (
    <Space>
      {componentData && componentData.quick_replies?.map((element, index) => (
        <Button key={componentKey + "qr" + index} type="default" style={{ borderRadius: 20 }} >{element.text.EN}</Button>
        ))} </Space>
    )
};

export const TextDisplayComponent: React.FC<DisplayComponentProps> = (props) =>  {
  const { componentKey, componentData } = props;
  if (componentData) {
    return (
      <ProCard key={componentKey} style={{ borderRadius: 20, background: "#F6F6F6" }} size="small">
        <div>{componentData.text?.EN}</div>
      </ProCard>
    )}
  return (
    <ProCard key={componentKey} style={{ borderRadius: 20, background: "#F6F6F6" }} size="small"> Placeholder Text </ProCard>
  )
};

export const ImageDisplayComponent: React.FC<DisplayComponentProps> = (props) =>  {
  const { componentKey, componentData } = props;
  if (componentData) {
    return (
      <Image
        width={300} 
        key={componentKey}
        src={componentData.url}
      />
    )}
  return (
    <Image width={300} key={componentKey} src="https://placekitten.com/300/150" />
  )
};

export const GenericTemplateDisplayComponent: React.FC<DisplayComponentProps> = (props) =>  {
  const { componentKey, componentData } = props;
  console.log('Here', componentData)

  const CarouselButtonGroup = (total: number, current: number) => {

    const items = []
    for (let x = 0; x < total; x++){
      items.push(<Button type={current===x?"primary":"default"} shape="circle">{x + 1}</Button>)
    }
    return (
      <Space style={{width: '100%', justifyContent: 'center', margin: '10px'}}>{items} </Space>
      )
  }
  
  const CarouselNextArrow = (carouselProps) => {
    const { className, style, onClick } = carouselProps
    return (
      <div
        className={className}
        style={{
          ...style,
          color: 'black',
          fontSize: '15px',
          lineHeight: '1.5715'
        }}
        onClick={onClick}
      >
      </div>
    )
  }
  
  const CarouselPrevArrow = (carouselProps) => {
    const { className, style, onClick } = carouselProps
    return (
      <div
        className={className}
        style={{
          ...style,
          color: 'black',
          fontSize: '15px',
          lineHeight: '1.5715'
        }}
        onClick={onClick}
      >
      </div>
    )
  }

  const contentStyle = {
    height: '600px',
    color: '#fff',
    lineHeight: '600px',
    textAlign: 'center',
    background: '#364d79'
  }

  return (
    <Carousel key={componentKey} className={styles.carousel} arrows {...{nextArrow: <CarouselNextArrow />, prevArrow: <CarouselPrevArrow />}}>
      {componentData && componentData.elements?.map((element, index) => (
          <div style={contentStyle}>
              {/* {CarouselButtonGroup(componentData.elements.length, index)} */}
              <Card key={index} style={{ borderRadius: 10, background: "#F6F6F6" }} size="small"
              cover={<img src={element?element.image_url:''} />}>
                <Meta title={element.title.EN} description={element.subtitle.EN} />
                {element.buttons?.map((button, buttonIdex) => (
                  <ProCard key={buttonIdex} style={{ borderRadius: 10, marginTop: 10, textAlign: 'center',}} size="small"> 
                    {button.title.EN}
                  </ProCard>))
                }
              </Card>
              </div>
            ))}
    </Carousel>
  )
};

export const ButtonTemplateDisplayComponent: React.FC<DisplayComponentProps> = (props) =>  {
  const { componentKey, componentData } = props;
  if (componentData) {
    return (
      <ProCard key={componentKey} style={{ borderRadius: 10, background: "#F6F6F6", width: 270 }} size="small">
          {componentData.title?.EN}
          {componentData.buttons?.map((button, buttonIdex) => (
            <Card key={buttonIdex} style={{ borderRadius: 10, marginTop: 10, textAlign: 'center'}} size="small"> 
              {button.title?.EN}
            </Card>))
          }
      </ProCard>
    )}
  return (
    <ProCard key={componentKey} style={{ borderRadius: 20, background: "#F6F6F6" }} size="small"> Placeholder Text </ProCard>
  )
};

export const FlowDisplayComponent: React.FC<DisplayComponentProps> = (props) =>  {
  const { componentKey, componentData } = props;
  if (componentData) {
    return (
      <ProCard key={componentKey} style={{ borderRadius: 10, background: "#F6F6F6", width: 270 }} size="small">
        <Meta title='GO TO' />
        <Card key={'Button' + componentKey} style={{ borderRadius: 10, marginTop: 10, textAlign: 'center'}} size="small"> 
              {componentData.flow?.name}
            </Card>
      </ProCard>
    )}
  return (
    <ProCard key={componentKey} style={{ borderRadius: 20, background: "#F6F6F6" }} size="small"> Placeholder Text </ProCard>
  )
};