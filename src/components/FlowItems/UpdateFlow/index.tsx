import React, { useEffect, useState, FC } from 'react';
import { ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Divider, Form, Input, message, Progress, Radio, Card, Space } from 'antd';
import { queryFlowsFilter } from '@/pages/QuestionList/service';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import { Upload, Modal } from 'antd';
const { TextArea } = Input;
import { DeleteOutlined, FileAddOutlined, LoadingOutlined, PaperClipOutlined, PlusOutlined, UploadOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ImageDisplayComponent } from '../ReadFlow';
import { StringObject } from 'models/flows';
import ImgCrop from 'antd-img-crop';
import { Tabs } from 'antd';
import './index.less';
import { DropdownProps } from '@/pages/QuestionList/data';
import Dragger from 'antd/lib/upload/Dragger'

export type TextComponentDataProps = {
  componentKey: number;
  componentData?: { text: StringObject };
  onChange: (prevState: any) => void;
};

export const TextComponent: FC<TextComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Text
      </Divider>
      <Form.Item
        key={'component' + componentKey.toString() + 'text'}
        name={'component' + componentKey.toString() + 'text'}
        initialValue={componentData?.text?.EN}
        rules={[{ required: true, message: 'Field is required' }]}
      >
        <TextArea
          rows={4}
          placeholder="Please input"
          onChange={(e) => {
            onChange((prevState: any) =>
              [...prevState].map((item, index) => {
                if (index === componentKey) {
                  return {...item, data: { text: { EN: e.target.value } } };
                } else return item;
              }),
            );
          }}
        />
      </Form.Item>
    </>
  );
};

export type AttachmentComponentDataProps = {
  componentKey: number;
  componentData:{ url: string, fileName?: string };
  onChange: (prevState: any) => void;
};

export const ImageComponent: FC<AttachmentComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  const [previewImage, setPreviewImage] = useState(componentData.url);
  const [uploading, setUploading] = useState(componentData.url?true:false);
  const draggerProps = {
    key: 'image' + componentKey.toString(),
    accept: "image/*",
    multiple: false,
    showUploadList: false,
    action: 'http://localhost:5000/upload',
    onChange(info: { file: { response?: any; name?: any; status?: any; }; fileList: any; }) {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(true)
      }
      else if (status === 'done') {
        setUploading(false)
        setPreviewImage(info.file.response.url)
        onChange((prevState: any) => [...prevState].map((item, index) => {
          if (index === componentKey) {
            return { ...item, data: {url: info.file.response.url, fileName: info.file.name}}
          }
          else return item;
        }))
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
        <>
          <Divider style={{ marginTop: -6 }} orientation="left">
            Image
          </Divider>
          <Form.Item
            key={'component' + componentKey.toString() + 'image'}
            name={'component' + componentKey.toString() + 'image'}
            initialValue={previewImage}
            rules={[{ required: true, message: 'Image is required' }]}
          >
            {previewImage? 
              <Space>
                <ImageDisplayComponent componentKey={componentKey} componentData={{url: previewImage}}/>
                <Button shape="round" onClick={() => setPreviewImage('')}><DeleteOutlined/></Button>
              </Space>
              : 
              <Dragger {...draggerProps}>
                <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <PlusOutlined style={{ fontSize: '40px'}} />} </p>
                <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag image here to upload"}</p>
              </Dragger>
              }
          </Form.Item>
      </>
  );
};

export const VideoComponent: FC<AttachmentComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  const [previewImage, setPreviewImage] = useState(componentData.url);
  const [uploading, setUploading] = useState(componentData.url?true:false);
  const draggerProps = {
    key: 'image' + componentKey.toString(),
    accept: "video/*",
    multiple: false,
    showUploadList: false,
    action: 'http://localhost:5000/upload',
    onChange(info: { file: { response?: any; name?: any; status?: any; }; fileList: any; }) {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(true)
      }
      else if (status === 'done') {
        setUploading(false)
        setPreviewImage(info.file.response.url)
        onChange((prevState: any) => [...prevState].map((item, index) => {
          if (index === componentKey) {
            return { ...item, data: {url: info.file.response.url, fileName: info.file.name}}
          }
          else return item;
        }))
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
        <>
          <Divider style={{ marginTop: -6 }} orientation="left">
            Video
          </Divider>
          <Form.Item
            key={'component' + componentKey.toString() + 'image'}
            name={'component' + componentKey.toString() + 'image'}
            initialValue={previewImage}
            rules={[{ required: true, message: 'Image is required' }]}
          >
            {previewImage? 
              <Space>
                <video key={componentKey} controls style={{ width: '100%' }} src={previewImage} />
                <Button shape="round" onClick={() => setPreviewImage('')}><DeleteOutlined/></Button>
              </Space>
              : 
              <Dragger {...draggerProps}>
                <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <VideoCameraAddOutlined style={{ fontSize: '40px'}} />} </p>
                <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag video here to upload"}</p>
              </Dragger>
              }
          </Form.Item>
      </>
  );
};

export const FileComponent: FC<AttachmentComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  const [fileName, setFileName] = useState(componentData.fileName);
  const [uploading, setUploading] = useState(componentData.url?true:false);
  const draggerProps = {
    key: 'image' + componentKey.toString(),
    multiple: false,
    action: 'http://localhost:5000/upload',
    onChange(info: { file: { response?: any; name?: any; status?: any; }; fileList: any; }) {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(true)
      }
      else if (status === 'done') {
        setUploading(false)
        setFileName(info.file.name)
        onChange((prevState: any) => [...prevState].map((item, index) => {
          if (index === componentKey) {
            return { ...item, data: {url: info.file.response.url, fileName: info.file.name}}
          }
          else return item;
        }))
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
        <>
          <Divider style={{ marginTop: -6 }} orientation="left">
            File
          </Divider>
          <Form.Item
            key={'component' + componentKey.toString() + 'image'}
            name={'component' + componentKey.toString() + 'image'}
            initialValue={fileName}
            rules={[{ required: true, message: 'Image is required' }]}
          >
            {fileName? 
              <Space>
                <PaperClipOutlined /> {fileName}
                <Button shape="round" onClick={() => setFileName('')}><DeleteOutlined/></Button>
              </Space>
              : 
              <Dragger {...draggerProps}>
                <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <FileAddOutlined style={{ fontSize: '40px'}} />} </p>
                <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag file here to upload"}</p>
              </Dragger>
            }
          </Form.Item>
      </>
  );
};

export type Buttons = {
  title: StringObject;
  type: string;
  url?: string;
  flowId?: string;
};

export type Templates = {
  imageUrl?: {};
  fileName?: string;
  title?: StringObject;
  subtitle?: StringObject;
  buttons?: Buttons[];
  closable?: boolean;
};

export type GenericTemplateComponentDataProps = {
  componentKey: number;
  componentData: { elements: Templates[] };
  onChange: (prevState: any) => void;
  current: any;
};

export const GenericTemplateComponent: FC<GenericTemplateComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange, current } = props
  const [activeKey, setActiveKey] = useState<number>(0);
  const [panes, setPanes] = useState(componentData.elements)
  
  const onEdit = (targetKey: any, action: string) => {
    if (action === 'add') {
      add();
    } else {
      remove(parseInt(targetKey))
    }
  };

  const add = () => {
    let activeIndex: number = 0
    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        activeIndex = item.data.elements.length
        setPanes([...item.data.elements, { title: null, buttons: [], subtitle: null, imageUrl: "", fileName: "" }])
        return { ...item, data: {elements: 
          [...item.data.elements, { title: null, buttons: [], subtitle: null, imageUrl: "", fileName: "" }]
        }}
      } 
      else return item}))
    setActiveKey(activeIndex)
  };

  const remove = (idx: number) => {
    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        const newPanes = item.data.elements
        newPanes.splice(idx, 1)
        console.log('current panes:', newPanes)
        setPanes(newPanes)
        return { ...item, data: { elements: newPanes }}
      } 
      else return item}))
    setActiveKey(Math.max(idx - 1, 0))
  };

  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Step : Generic Template
      </Divider>
      <Tabs
        type="editable-card"
        onChange={(activeKey: string) => {setActiveKey(parseInt(activeKey))}}
        activeKey={activeKey?.toString()}
        onEdit={onEdit}
        hideAdd={!(panes.length < 10)} >
        {panes.map((pane, index: number) => {
          return (
            <TabPane tab={index + 1} key={index.toString()} closable={panes.length !== 1} forceRender>
              <TemplateComponent componentKey={index} componentData={pane} onChange={onChange} parentKey={componentKey} />
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
};

export type TemplateComponentDataProps = {
  componentKey: number;
  componentData: Templates;
  onChange: (prevState: any) => void;
  parentKey: number;
};

const { TabPane } = Tabs;

export const TemplateComponent: FC<TemplateComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange, parentKey } = props
  const [previewImage, setPreviewImage] = useState(componentData.imageUrl);
  const [uploading, setUploading] = useState(componentData.imageUrl?true:false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState(false);
  const [selectRow, setSelectRow] = useState(null);
  const [responseType, setResponseType] = useState('flow');
  const [flows, setFlows] = useState<DropdownProps[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttons, setButtons] = useState(componentData.buttons)


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

  let responseArea;
  if (responseType === 'url') {
    responseArea = (
      <ProFormTextArea
        name="url"
        label="URL"
        placeholder="Link to URL"
      />
    );
  } else {
    responseArea = (
      <ProFormSelect
        name="flowId"
        label="Flow Response"
        initialValue={selectRow?.type === 'flow' ? selectRow?.content : null}
        showSearch
        // @ts-ignore
        request={async () => {
          const flowsRequest = await queryFlowsFilter('name,params');
          setFlows(flowsRequest);
        }}
        options={flows}
      />
    );
  }

  const draggerProps = {
    key: "Component" + parentKey.toString() + "Image"+ componentKey?.toString(),
    multiple: false,
    accept: "image/*",
    showUploadList: false,
    action: 'http://localhost:5000/upload',
    onChange(info: { file: { response?: any; name?: any; status?: any; }; fileList: any; }) {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(true)
      }
      else if (status === 'done') {
        setUploading(false)
        setPreviewImage(info.file.response.url)
        onChange((prevState: any) => [...prevState].map((item, index) => {
          if (index === parentKey) {
            return { ...item, data: {elements: 
              item.data.elements.map((pane: any, paneIndex: number) => {
                if (paneIndex === componentKey) {
                  return { ...pane, imageUrl: info.file.response.url, fileName: info.file.name}
                }
                else return pane;})
            }}
          }
          else return item;
        }))
        message.success(`${info.file.name} image uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} image upload failed.`);
      }
    },
  };

  return (
    <div>
      <Form.Item>
        <Card
          size="small"
          title={
            <>
              <div className="GenericTemplate">
              {previewImage? 
                <Space>
                  <ImageDisplayComponent componentKey={componentKey} componentData={{url: previewImage}}/>
                  <Button shape="round" onClick={() => setPreviewImage('')}><DeleteOutlined/></Button>
                </Space>
                : 
                <ImgCrop rotate aspect={1.91}>
                  <Dragger  {...draggerProps}>
                    <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <PlusOutlined />} </p>
                    <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag image here to upload"}</p>
                  </Dragger>
                </ImgCrop>
                }
              </div>
              
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img alt="image-preview" style={{ width: '100%' }} src={previewImage} />
              </Modal>
              <Input 
                placeholder="Title" 
                defaultValue={componentData?.title?.EN} 
                onChange={(e) => {
                  onChange((prevState: any) => [...prevState].map((item, index) => {
                    if (index === parentKey) {
                      return { ...item, data: {elements: 
                        item.data.elements.map((pane: any, paneIndex: number) => {
                          if (paneIndex === componentKey) {
                            return { ...pane, title: { EN: e.target.value }}
                          }
                          else return pane;})
                      }}
                    }
                    else return item;
                  }))
                }}
              />
            </>
          }
          style={{ width: 300 }}
        >
          <Input 
            placeholder="Subtitle" 
            defaultValue={componentData?.subtitle?.EN} 
            onChange={(e) => {
              onChange((prevState: any) => [...prevState].map((item, index) => {
                if (index === parentKey) {
                  return { ...item, data: {elements: 
                    item.data.elements.map((pane: any, paneIndex: number) => {
                      if (paneIndex === componentKey) {
                        return { ...pane, subtitle: { EN: e.target.value }}
                      }
                      else return pane;})
                  }}
                }
                else return item;
              }))
            }}
          />
          {buttons.map((button, buttonIndex) => (
            <Button
              key={"component" + parentKey + "pane" + componentKey + "button" + buttonIndex}
              block
              onClick={() => {
                console.log({ row: button });
                setSelectRow(button);
                setResponseType(button.type);
                showModal();
              }}
            >
              {button.title.EN}
            </Button>
          ))}
          {buttons.length < 3 && (
            <Button
              key={"component" + parentKey + "pane" + componentKey + "buttonNew"}
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
            width={450}
            footer={[
              <Button key="back" onClick={handleCancelModal}>
                Cancel
              </Button>,
              <Button type="primary" htmlType="submit" onClick={handleOkModal} form="my-form">
                Submit
              </Button>,
            ]}
          >
            <Form
              id="my-form"
              onFinish={async (values) => {
                console.log('button', values)
                onChange((prevState: any) => [...prevState].map((item, index) => {
                  if (index === parentKey) {
                    return { ...item, data: {elements: 
                      item.data.elements.map((pane: any, paneIndex: number) => {
                        if (paneIndex === componentKey) {
                          setButtons((prevButtons: any) => [...prevButtons, {...values, title: {EN: values.title}}])
                          return { ...pane, buttons: [...pane.buttons, {...values, title: {EN: values.title}}]}
                        }
                        else return pane;})
                    }}
                  }
                  else return item;
                }))
                message.success('Button added');
              }}
              initialValues={{
                // text: selectRow?.text,
                // content: selectRow?.type,
                url: selectRow?.type === 'url' ? selectRow?.content : null,
              }}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item
                label="Display Text"
                name="title"
                rules={[{ required: true, message: 'Please input display text' }]}
                initialValue={selectRow?.title.EN}
              >
                <Input />
              </Form.Item>
              {/*<ProFormText name="text" label="Display Text" initialValue={selectRow?.text} />*/}
              {/*{selectRow?.text}*/}
              <Form.Item
                label="Type"
                name="type"
                initialValue={selectRow ? selectRow.type : 'flow'}
              >
                <Radio.Group
                  onChange={(event) => {
                    console.log(event.target.value);
                    setResponseType(event.target.value);
                  }}
                >
                  <Radio.Button value="flow">Flow</Radio.Button>
                  <Radio.Button value="url">URL</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {responseArea}
            </Form>
          </Modal>
        </Card>
      </Form.Item>
    </div>
  );
};

export type ButtonTemplateComponentDataProps = {
  componentKey: number;
  componentData: {
    text: StringObject;
    buttons: Buttons[];
  };
  onChange: (prevState: any) => void;
};

export const ButtonTemplateComponent: FC<ButtonTemplateComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  const [responseType, setResponseType] = useState<string>('flow');
  const [selectRow, setSelectRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log(componentData);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };
  let responseArea;
  if (responseType === 'url') {
    responseArea = (
      <ProFormTextArea
        name="url"
        label="URL"
        placeholder="Link to URL"
      />
    );
  } else {
    responseArea = (
      <ProFormSelect
        name="flowId"
        label="Flow Response"
        initialValue={selectRow?.type === 'flow' ? selectRow?.content : null}
        showSearch
        // @ts-ignore
        request={async () => {
          return await queryFlowsFilter('name,params');
        }}
      />
    );
  }

  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Button Template
      </Divider>
      <Form.Item
        key={componentKey.toString()}
        rules={[{ required: true, message: 'Field is required' }]}
      >
        <TextArea
          rows={4}
          placeholder="Please input"
          defaultValue={componentData?.text?.EN}
          onChange={(e) => {
            onChange((prevState: any) =>
              [...prevState].map((item, index) => {
                if (index === componentKey) {
                  return {...item, data: { ...item.data, text: { EN: e.target.value } } };
                } else return item;
              }),
            );
          }}
        />
          {componentData?.buttons.map((button, buttonIndex) => (
            <Button
              key={"component" + componentKey + "button" + buttonIndex}
              block
              onClick={() => {
                console.log({ row: button });
                setSelectRow(button);
                setResponseType(button.type);
                showModal();
              }}
            >
              {button.title.EN}
            </Button>
          ))}
          {componentData?.buttons.length < 3 && (
            <Button
              key={"component" + componentKey + "buttonNew"}
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
          width={450}
          footer={[
            <Button key="back" onClick={handleCancelModal}>
              Cancel
            </Button>,
            <Button type="primary" htmlType="submit" onClick={handleOkModal} form="my-form">
              Submit
            </Button>,
          ]}
        >
          <Form
            id="my-form"
            onFinish={async (values) => {
              onChange((prevState: any) => [...prevState].map((item, index) => {
                if (index === componentKey) {
                  return { ...item, data: {...item.data, buttons: [...item.data.buttons, {...values, title: {EN: values.title}}]}}
                }
                else return item;
              }))
              message.success('Button added');
            }}
            initialValues={{
              // text: selectRow?.text,
              // content: selectRow?.type,
              urlResponse: selectRow?.type === 'url' ? selectRow?.content : null,
            }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label="Display Text"
              name="title"
              rules={[{ required: true, message: 'Please input display text' }]}
              initialValue={selectRow?.title.EN}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              initialValue={selectRow ? selectRow.type : 'flow'}
            >
              <Radio.Group
                onChange={(event) => {
                  console.log(event.target.value);
                  setResponseType(event.target.value);
                }}
              >
                <Radio.Button value="flow">Flow</Radio.Button>
                <Radio.Button value="url">URL</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {responseArea}
          </Form>
        </Modal>
      </Form.Item>
    </>
  );
};

export type FlowComponentDataProps = {
  componentKey: number;
  componentData: {
    flowId: string
  };
  onChange: (prevState: any) => void;
};

export const FlowComponent: FC<FlowComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props

  return (
    <>
      <Divider style={{ marginTop: -6 }} orientation="left">
        Flow
      </Divider>
      <ProFormSelect
        width="xl"
        name={componentData.name}
        showSearch
        fieldProps={{ onSelect: (e) => {
          console.log(e);
          onChange((prevState: any) =>
            [...prevState].map((item, index) => {
              if (index === componentKey) {
                return {...item, data: {...item.data, flowId: e } };
              } else return item;
            }),
          );
        }}}
        request={async () => {
          return await queryFlowsFilter('name,params');
        }}
        fieldProps={{ onSelect: (e) => console.log(e) }}
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

export type QrButtons = {
  text: StringObject;
  flowId?: string;
};

export type QuickReplyComponentDataProps = {
  componentKey: number;
  componentData: { quickReplies: QrButtons[] };
  onChange: (prevState: any) => void;
};

export const QuickReplyComponent: React.FC<QuickReplyComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectRow, setSelectRow] = useState<QrButtons>();
  const [flows, setFlows] = useState<DropdownProps[]>([]);
  const addNewQuickReplyButton = (
    <Button
      type="dashed"
      shape="round"
      icon={<PlusOutlined />}
      onClick={() => {
        showModal();
        setSelectRow(null);
      }}
    >
      Quick Reply
    </Button>
  );
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Form.Item style={{ marginTop: -6 }} >
        <Space>
          {componentData.quickReplies.map((button) => (
            <Button
              block
              shape="round"
              onClick={() => {
                console.log({ row: button });
                setSelectRow(button);
                showModal();
              }}
            >
              {button.text.EN}
            </Button>
          ))}
          {componentData.quickReplies.length < 3 && addNewQuickReplyButton}
        </Space>
        <Modal
          title="New Button"
          visible={isModalVisible}
          onOk={handleOkModal}
          onCancel={handleCancelModal}
          destroyOnClose={true}
          width={450}
          footer={[
            <Button key="back" onClick={handleCancelModal}>
              Cancel
            </Button>,
            <Button type="primary" htmlType="submit" onClick={handleOkModal} form="my-form">
              Submit
            </Button>,
          ]}
        >
          <Form
            id="my-form"
            onFinish={async (values) => {
              console.log(values);
              onChange((prevState: any) => [...prevState].map((item, index) => {
                if (index === componentKey) {
                  return { ...item, data: { ...item.data, quickReplies: [...item.data.quickReplies, {...values, text: {EN: values.text}}]}}
                }
                else return item;
              }))
              message.success('Button added');
            }}
            initialValues={{}}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}>
            <Form.Item
              label="Display Text"
              name="text"
              rules={[{ required: true, message: 'Please input display text' }]}
              initialValue={selectRow?.text.EN}>
              <Input />
            </Form.Item>
            <ProFormSelect
              name="flowId"
              label="Flow Response"
              initialValue={selectRow?.flowId}
              showSearch
              // @ts-ignore
              request={async () => {
                const flowsRequest = await queryFlowsFilter('name,params');
                setFlows(flowsRequest);
              }}
              options={flows}
            />
          </Form>
        </Modal>
      </Form.Item>
    </>
  );
};


//  ARCHIVES
export type Attachments = {
  name: string;
  url?: string;
  uid: string;
  response?: { url: string };
};
export type AttachmentsComponentData = {
  type: string;
  name: string;
  data: { attachments: Attachments[] };
};
export type AttachmentsComponentDataProps = {
  componentData: AttachmentsComponentData;
  index: Number;
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
          </Modal>
        </Form.Item>
        {progress > 0 ? <Progress percent={progress} /> : null}
      </Form.Item>
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
