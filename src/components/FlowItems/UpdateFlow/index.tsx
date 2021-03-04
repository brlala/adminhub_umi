import React, { useState, FC } from 'react';
import { ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Divider, Form, Input, message, Radio, Card, Space } from 'antd';
import { queryFlowsFilter } from '@/pages/QuestionList/service';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import { Modal } from 'antd';
const { TextArea } = Input;
import { DeleteOutlined, FileAddOutlined, FunctionOutlined, LoadingOutlined, PaperClipOutlined, PlusOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { ImageDisplayComponent } from '../ReadFlow';
import ImgCrop from 'antd-img-crop';
import { Tabs } from 'antd';
import './index.less';
import { DropdownProps } from '@/pages/QuestionList/data';
import Dragger from 'antd/lib/upload/Dragger'
import { AttachmentComponentDataProps, TextComponentDataProps, GenericTemplateComponentDataProps, TemplateComponentDataProps, ButtonTemplateComponentDataProps, FlowComponentDataProps,QuickReplyComponentDataProps, Buttons, CustomComponentDataProps } from './data';

const { TabPane } = Tabs;

export const TextComponent: FC<TextComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  return (
    <Card title='Text' size='small' style={{background: 'transparent'}} bordered={false}>
      {/* <Divider orientation="left">
        Text
      </Divider> */}
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
    </Card>
  );
};


export const CustomComponent: FC<CustomComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  return (
    <>
      <Divider orientation="left">
        Custom
      </Divider>
      <Form.Item
        key={'component' + componentKey.toString() + 'function'}
        name={'component' + componentKey.toString() + 'function'}
        initialValue={componentData?.function}
        rules={[{ required: true, message: 'Field is required' }]}
      >
        <Input
          prefix={<FunctionOutlined />}
          placeholder="Please input"
          onChange={(e) => {
            onChange((prevState: any) =>
              [...prevState].map((item, index) => {
                if (index === componentKey) {
                  return {...item, data: { function: e.target.value } };
                } else return item;
              }),
            );
          }}
        />
      </Form.Item>
    </>
  );
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
          <Divider orientation="left">
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
                <ImageDisplayComponent componentKey={componentKey.toString()} componentData={{url: previewImage}}/>
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
          <Divider orientation="left">
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
          <Divider orientation="left">
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
    <Card title='Generic Template' size='small' style={{background: 'transparent'}}>
      <div className="card-container">
        <Tabs
          type="editable-card"
          size='small'
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
      </div>
    </Card>
  );
};

export const TemplateComponent: FC<TemplateComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange, parentKey } = props
  const [previewImage, setPreviewImage] = useState(componentData.imageUrl);
  const [uploading, setUploading] = useState(componentData.imageUrl?true:false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState(false);
  const [selectedButton, setSelectedButton] = useState<Partial<Buttons>>();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>();
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
      <Form 
      initialValues={{
        Title: componentData?.title?.EN? componentData.title.EN : "",
        Subtitle: componentData?.subtitle?.EN? componentData.subtitle.EN: ""}}>
        <Card size="small" bordered={false}>
          <div className="GenericTemplate">
            {previewImage? 
              <Space>
                <ImageDisplayComponent componentKey={componentKey.toString()} componentData={{url: previewImage}}/>
                {/* <Button shape="round" onClick={() => setPreviewImage('')}><DeleteOutlined/></Button> */}
              </Space>
              : 
              <ImgCrop rotate aspect={1.91}>
                <Dragger  {...draggerProps}>
                  <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <PlusOutlined />} </p>
                  <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag image here to upload"}</p>
                </Dragger>
              </ImgCrop>}
          </div>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}>
            <img alt="image-preview" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Form.Item name='Title' rules={[{ required: true, message: 'Title is required' }]}>
            <Input
              allowClear
              placeholder="Title"
              onChange={(e) => {
                onChange((prevState: any) => [...prevState].map((item, index) => {
                  if (index === parentKey) {
                    return { ...item, data: {elements: 
                      item.data.elements.map((pane: any, paneIndex: number) => {
                        if (paneIndex === componentKey) {
                          return { ...pane, title: { EN: e.target.value }}
                        }
                        else return pane;})}}}
                  else return item;}))
              }}
            />
          </Form.Item>
          <Form.Item name='Subtitle'>
          <TextArea 
            allowClear
            placeholder="Subtitle (Optional)"
            onChange={(e) => {
              onChange((prevState: any) => [...prevState].map((item, index) => {
                if (index === parentKey) {
                  return { ...item, data: {elements: 
                    item.data.elements.map((pane: any, paneIndex: number) => {
                      if (paneIndex === componentKey) {
                        return { ...pane, subtitle: { EN: e.target.value }}
                      }
                      else return pane;})}}}
                else return item;}))
            }}
          />
        </Form.Item>
          {buttons&&buttons.map((button, buttonIndex) => (
            <Button
              key={"component" + parentKey + "pane" + componentKey + "button" + buttonIndex}
              block
              onClick={() => {
                console.log({ row: button });
                setSelectedButton(button);
                setSelectedButtonIndex(buttonIndex)
                showModal();
              }}
            >
              {button.title.EN}
            </Button>
          ))}
          {buttons&&buttons.length < 3 && (
            <Button
              key={"component" + parentKey + "pane" + componentKey + "buttonNew"}
              onClick={() => {
                showModal();
                setSelectedButtonIndex(buttons.length)
                setSelectedButton({type: 'flow', title: {EN: ''}});
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
                    let updatedButton: Buttons;
                    if (values.type === 'flow')
                      {updatedButton = {...values, title: {EN: values.title}, payload: {flowId: values.flowId}}}
                    else {updatedButton = {...values, title: {EN: values.title}}}
                    return { ...item, data: {elements: 
                      item.data.elements.map((pane: any, paneIndex: number) => {
                        if (paneIndex === componentKey) {
                          if (selectedButtonIndex === pane.buttons.length) {
                            setButtons((prevButtons: any) => [...prevButtons, updatedButton])
                            return { ...pane, buttons: [...pane.buttons, updatedButton]}
                          }
                          else{
                            setButtons((prevButtons: any) => prevButtons.map((button: Buttons, buttonIndex: number) => {
                              if (buttonIndex === selectedButtonIndex)
                                return updatedButton
                              return button 
                            }))
                            return { ...pane, buttons: pane.buttons.map((button: Buttons, buttonIndex: number) => {
                              if (buttonIndex === selectedButtonIndex)
                                return updatedButton
                              return button 
                            })}
                          }
                        }
                        else return pane;})
                    }}



                  }
                  else return item;
                }))
                message.success('Button added');
              }}
              initialValues={{
                title: selectedButton?.title.EN,
                content: selectedButton?.type,
                url: selectedButton?.type === 'url' ? selectedButton?.url : null,
              }}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item
                label="Display Text"
                name="title"
                rules={[{ required: true, message: 'Please input display text' }]}
                initialValue={selectedButton?.title.EN}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Type"
                name="type"
                initialValue={selectedButton ? selectedButton.type : 'flow'}
              >
                <Radio.Group
                  onChange={(event) => {
                    setSelectedButton({...selectedButton, type: event.target.value})
                  }}
                >
                  <Radio.Button value="flow">Flow</Radio.Button>
                  <Radio.Button value="url">URL</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {selectedButton?.type === 'url'? (
                  <ProFormTextArea
                    name="url"
                    label="URL"
                    placeholder="Link to URL"
                  />
                ):(
                  <ProFormSelect
                    name="flowId"
                    label="Flow Response"
                    initialValue={selectedButton?.type === 'flow' ? selectedButton?.payload?.flowId : null}
                    showSearch
                    // @ts-ignore
                    request={async () => {
                      return await queryFlowsFilter('name,params');
                    }}
                  />)
              }
            </Form>
          </Modal>
        </Card>
      </Form>
    </div>
  );
};

export const ButtonTemplateComponent: FC<ButtonTemplateComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props;
  const [selectedButton, setSelectedButton] = useState<Partial<Buttons>>();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>();
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

  return (
    <>
      <Divider orientation="left">
        Button Template
      </Divider>

      <Card size="small">
      <Form.Item
        key={componentKey.toString()}
        rules={[{ required: true, message: 'Field is required' }]}>
        <TextArea
          allowClear
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
        </Form.Item>
          {componentData?.buttons.map((button, buttonIndex) => (
            <Button
              key={"component" + componentKey + "button" + buttonIndex}
              block
              onClick={() => {
                console.log({ row: button });
                setSelectedButton(button);
                setSelectedButtonIndex(buttonIndex)
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
                setSelectedButtonIndex(componentData?.buttons.length)
                setSelectedButton({type: 'flow', title: {EN: ''}});
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
          ]}>
          <Form
            id="my-form"
            onFinish={(values) => {
              console.log('values', values)
              onChange((prevState: any) => [...prevState].map((item, index) => {
                if (index === componentKey) {
                  let updatedButton: Buttons;
                  if (values.type === 'flow')
                    {updatedButton = {...values, title: {EN: values.title}, payload: {flowId: values.flowId}}}
                  else {updatedButton = {...values, title: {EN: values.title}}}
                  if (selectedButtonIndex === item.data.buttons.length) 
                    return { ...item, data: {...item.data, buttons: [...item.data.buttons, updatedButton]}}
                  return { ...item, data: {...item.data, buttons: [item.data.buttons.map((button: Buttons, buttonIndex: number) => {
                    if (buttonIndex === selectedButtonIndex)
                      return updatedButton
                    return button 
                  })]}}
                }
                else return item;
              }))
              message.success('Button added');
            }}
            initialValues={{
              // text: selectRow?.text,
              // content: selectRow?.type,
              url: selectedButton?.type === 'url' ? selectedButton?.url : null,
            }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label="Display Text"
              name="title"
              rules={[{ required: true, message: 'Please input display text' }]}
              initialValue={selectedButton?.title.EN}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              initialValue={selectedButton ? selectedButton.type : 'flow'}
            >
              <Radio.Group
                onChange={(event) => {
                  setSelectedButton({...selectedButton, type: event.target.value})
                }}>
                <Radio.Button value="flow">Flow</Radio.Button>
                <Radio.Button value="url">URL</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {selectedButton?.type === 'url'? (
                <ProFormTextArea
                  name="url"
                  label="URL"
                  placeholder="Link to URL"
                />
              ):(
                <ProFormSelect
                  name="flowId"
                  label="Flow Response"
                  initialValue={selectedButton?.type === 'flow' ? selectedButton?.payload?.flowId : null}
                  showSearch
                  // @ts-ignore
                  request={async () => {
                    return await queryFlowsFilter('name,params');
                  }}
                />)
            }
          </Form>
        </Modal>
      </Card>
    </>
  );
};

export const FlowComponent: FC<FlowComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props

  return (
    <>
      <Divider orientation="left">
        Flow
      </Divider>
      <ProFormSelect
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
