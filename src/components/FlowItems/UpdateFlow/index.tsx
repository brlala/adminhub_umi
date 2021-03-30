import React, { useState, FC } from 'react';
import { ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form, Input, message, Radio, Card, Space, Image, Tooltip, Typography, Select } from 'antd';
import { queryFlowsFilter } from '@/pages/QuestionList/service';
import { FormattedMessage } from '@@/plugin-locale/localeExports';
import { Modal } from 'antd';
const { TextArea, Search } = Input;
import { CloseOutlined, CloudUploadOutlined, DeleteOutlined, FileAddOutlined, FunctionOutlined, LeftCircleFilled, LeftCircleOutlined, LeftOutlined, LoadingOutlined, PaperClipOutlined, PlusOutlined, RightCircleOutlined, RightOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { Tabs } from 'antd';
import './index.less';
import Dragger from 'antd/lib/upload/Dragger'
import { AttachmentComponentDataProps, TextComponentDataProps, GenericTemplateComponentDataProps, TemplateComponentDataProps, ButtonTemplateComponentDataProps, FlowComponentDataProps,QuickReplyComponentDataProps, Buttons, CustomComponentDataProps, InputComponentDataProps, QrButtons } from './data';
import ButtonGroup from 'antd/lib/button/button-group';
const { TabPane } = Tabs;

export const handleDelete = (componentKey: number, onChange: any) => {
  onChange((prevState: any[]) => {
    const newArr = prevState.filter((_, index) => index !== componentKey);
    return newArr
  })
};

export const deleteButton = (componentKey: number, onChange: any) => {
  return <Tooltip placement="top" title='Remove Component'><Button shape="circle" onClick={() => handleDelete(componentKey, onChange)}><CloseOutlined /></Button></Tooltip>
}

export const TextComponent: FC<TextComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  return (
    <Card title='Text' size='small' style={{background: 'transparent'}} bordered={false} extra={deleteButton(componentKey, onChange)}>
      <Form.Item
        key={'component' + componentKey.toString() + 'text'}
        name={'component' + componentKey.toString() + 'text'}
        initialValue={componentData?.text?.EN}
        rules={[{ required: true, message: 'Field is required' }]}>
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
  const { componentKey, componentData, onChange, disabled } = props
  return (
    <Card title='Custom' size='small' style={{background: 'transparent'}} bordered={false} extra={deleteButton(componentKey, onChange)}>
      <Form.Item
        key={'component' + componentKey.toString() + 'function'}
        name={'component' + componentKey.toString() + 'function'}
        initialValue={componentData?.function}
        rules={[{ required: true, message: 'Field is required' }]}
      >
        <Input
          prefix={<FunctionOutlined />}
          placeholder={disabled?"Contact developer to add/update component":"Please input"}
          disabled={disabled}
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
    </Card>
  );
};

export const InputComponent: FC<InputComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  return (
    <Card title='Input' size='small' style={{background: 'transparent'}} bordered={false} extra={deleteButton(componentKey, onChange)}>
      <Form.Item
        key={'component' + componentKey.toString() + 'function'}
        name={'component' + componentKey.toString() + 'function'}
        initialValue={componentData?.inputName}
        rules={[{ required: true, message: 'Field is required' }]}>
        <Input
          placeholder="Input Name"
          onChange={(e) => {
            onChange((prevState: any) =>
              [...prevState].map((item, index) => {
                if (index === componentKey) {
                  return {...item, data: { inputName: e.target.value } };
                } else return item;
              }),
            );
          }}
        />
      </Form.Item>
    </Card>
  );
};

export const ImageComponent: FC<AttachmentComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  const [previewImage, setPreviewImage] = useState(componentData.url);
  const [uploading, setUploading] = useState(componentData.url?true:false);
  const [uploader, setUploader] = useState(true);
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

  const removeImage = () => {
    setPreviewImage('')
    setUploading(false)
    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        return { ...item, data: {url: ''}}
      }
      else return item;
    }))
  }

  return (
    <Card title={<Space>Image
      <Radio.Group defaultValue={uploader} onChange={(e) => setUploader(e.target.value)}>
        <Radio.Button value={true}>Upload</Radio.Button>
        <Radio.Button value={false}>Input URL</Radio.Button>
      </Radio.Group></Space>} size='small' style={{background: 'transparent'}} bordered={false} extra={deleteButton(componentKey, onChange)}>
      <Form.Item
        key={'component' + componentKey.toString() + 'image'}
        name={'component' + componentKey.toString() + 'image'}
        initialValue={previewImage}
      >
        {uploader? <>{previewImage? 
          <Space>
            <Image className='ImageComponent' key={componentKey} src={previewImage} 
              preview={{mask: <Button className='image-mask' shape="circle" size='large' onClick={removeImage}><DeleteOutlined/></Button>}}/>
          </Space>
          : <Dragger {...draggerProps}>
          <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <PlusOutlined style={{ fontSize: '40px'}} />} </p>
          <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag image here to upload"}</p>
        </Dragger>}</>: <>
          <Form.Item
            key={'component' + componentKey.toString() + 'urlimage'}
            name={'component' + componentKey.toString() + 'urlimage'}
            initialValue={previewImage}
          >
            <Search placeholder="Image URL" allowClear disabled={previewImage !== ''} enterButton={<CloudUploadOutlined/>} onSearch={(value) => {
              setPreviewImage(value);onChange((prevState: any) => [...prevState].map((item, index) => {
              if (index === componentKey) {
                return { ...item, data: {url: value}}
              }
              else return item;
            }))}} /> </Form.Item>
            {previewImage? 
          <Space>
            <Image className='ImageComponent' key={componentKey} src={previewImage} 
              preview={{mask: <Button className='image-mask' shape="circle" size='large' onClick={removeImage}><DeleteOutlined/></Button>}}/>
          </Space>:<></>}</>
          }
      </Form.Item>
    </Card>
  );
};

export const VideoComponent: FC<AttachmentComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  const [previewImage, setPreviewImage] = useState(componentData.url);
  const [uploading, setUploading] = useState(componentData.url?true:false);
  const [uploader, setUploader] = useState(true);
  const draggerProps = {
    key: 'video' + componentKey.toString(),
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
  
  const removeImage = () => {
    setPreviewImage('')
    setUploading(false)
    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        return { ...item, data: {url: ''}}
      }
      else return item;
    }))
  }

  return (
    <Card title={<Space>Video
      <Radio.Group defaultValue={uploader} onChange={(e) => setUploader(e.target.value)}>
        <Radio.Button value={true}>Upload</Radio.Button>
        <Radio.Button value={false}>Input URL</Radio.Button>
      </Radio.Group></Space>} size='small' style={{background: 'transparent'}} bordered={false} 
      extra={<Space> {previewImage?
        <Tooltip placement="top" title='Remove Video'>
          <Button shape="circle" onClick={removeImage}><DeleteOutlined/></Button>
        </Tooltip> :<></>}
        {deleteButton(componentKey, onChange)}</Space>}>
      <Form.Item
        key={'component' + componentKey.toString() + 'image'}
        name={'component' + componentKey.toString() + 'image'}
        initialValue={previewImage}
      >
        {uploader? <>{previewImage? 
          <Space>
            <video
              key={componentKey}
              className='ImageComponent'
              controls
              src={componentData.url}/>
          </Space>
          : <Dragger {...draggerProps}>
          <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <VideoCameraAddOutlined style={{ fontSize: '40px'}} />} </p>
          <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag video here to upload"}</p>
        </Dragger>}</>: <>
          <Form.Item
            key={'component' + componentKey.toString() + 'urlimage'}
            name={'component' + componentKey.toString() + 'urlimage'}
            initialValue={previewImage}
          >
            <Search placeholder="Video URL" allowClear disabled={previewImage !== ''} enterButton={<CloudUploadOutlined/>} onSearch={(value) => {
              setPreviewImage(value);onChange((prevState: any) => [...prevState].map((item, index) => {
              if (index === componentKey) {
                return { ...item, data: {url: value}}
              }
              else return item;
            }))}} /> </Form.Item>
            {previewImage? 
          <Space>
            <video
              key={componentKey}
              className='ImageComponent'
              controls
              src={componentData.url}/>
          </Space>:<></>}</>
        }
      </Form.Item>
    </Card>
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
    <Card title='File' size='small' style={{background: 'transparent'}} bordered={false} 
      extra={deleteButton(componentKey, onChange)}>
      <Form.Item
        key={'component' + componentKey.toString() + 'image'}
        name={'component' + componentKey.toString() + 'image'}
        initialValue={fileName}
        rules={[{ required: true, message: 'Image is required' }]}
      >
        {fileName? 
          <Space>
            <PaperClipOutlined /> {fileName}
            <Button shape="circle" onClick={() => setFileName('')}><DeleteOutlined/></Button>
          </Space>
          : 
          <Dragger {...draggerProps}>
            <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <FileAddOutlined style={{ fontSize: '40px'}} />} </p>
            <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag file here to upload"}</p>
          </Dragger>
        }
      </Form.Item>
    </Card>
  );
};

export const GenericTemplateComponent: FC<GenericTemplateComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange, current } = props
  let initalPanes = componentData.elements.map((element, index) => {return { ...element, key: index}});
  const [panes, setPanes] = useState(initalPanes)
  const [maxKey, setMaxKey] = useState(componentData.elements.length)
  const [activeKey, setActiveKey] = useState<number>(panes.length > 0?panes[0].key:maxKey);
  
  const onEdit = (targetKey: any, action: string) => {
    if (action === 'add') {
      add();
    } else if (action === 'left') {
      moveLeft();
    } else if (action === 'right') {
      moveRight();
    } else {
      remove()
    }
  };

  const add = () => {
    setMaxKey(prev => prev + 1)
    setPanes((prev) => { return [...prev, { key: maxKey, title: {}, buttons: [], subtitle: {}, imageUrl: "", fileName: "" }]})
    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        return { ...item, data: {elements: 
          [...item.data.elements, { title: {}, buttons: [], subtitle: {}, imageUrl: "", fileName: "" }]
        }}
      } 
      else return item}))
    setActiveKey(maxKey)
  };

  const remove = () => {
    let removeIndex: number = 0;
    let newPanes: any[] = [];
    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        panes.map((pane, index) => {
          if (pane.key === activeKey) removeIndex = index;
          else newPanes = [...newPanes, pane]
        })
        let newElements = item.data.elements;
        newElements.splice(removeIndex, 1)
        return { ...item, data: { elements: newElements }}
      } 
      else return item}))
    setPanes(newPanes)
    setActiveKey(newPanes[Math.max(removeIndex - 1, 0)].key)
  };


  const moveLeft = () => {
    console.log('Current index', activeKey)
    let newPanes = panes;
    let moveIndex: number = 0;
    panes.map((pane, index) => {if (pane.key === activeKey) moveIndex = index;})
    let temp = newPanes[moveIndex - 1];
    newPanes[moveIndex - 1] = newPanes[moveIndex];
    newPanes[moveIndex] = temp;
    setPanes(newPanes)

    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        let newElements = item.data.elements;
        let temp = newElements[moveIndex - 1];
        newElements[moveIndex - 1] = newElements[moveIndex];
        newElements[moveIndex] = temp;
        return { ...item, data: { elements: newElements }}
      } 
      else return item}))
      
    setActiveKey(newPanes[Math.max(moveIndex - 1, 0)].key)
  };

  const moveRight = () => {
    console.log('Current index', activeKey)
    let newPanes = panes;
    let moveIndex: number = 0;
    panes.map((pane, index) => {if (pane.key === activeKey) moveIndex = index;})
    let temp = newPanes[moveIndex + 1];
    newPanes[moveIndex + 1] = newPanes[moveIndex];
    newPanes[moveIndex] = temp;
    setPanes(newPanes)

    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        let newElements = item.data.elements;
        let temp = newElements[moveIndex + 1];
        newElements[moveIndex + 1] = newElements[moveIndex];
        newElements[moveIndex] = temp;
        return { ...item, data: { elements: newElements }}
      } 
      else return item}))
      
    setActiveKey(newPanes[Math.max(moveIndex + 1, 0)].key)
  };


  return (
    <Card title='Generic Template' size='small' bordered={false} style={{background: 'transparent'}}
      extra={deleteButton(componentKey, onChange)}>
      <div className="card-container">
        <Tabs
          type="editable-card"
          animated={true}
          tabBarExtraContent={{
          right: panes.length !== 1?<ButtonGroup>
            <Button size='small' disabled={activeKey===panes[0].key} onClick={moveLeft} >Move Left</Button>
            <Button size='small' disabled={activeKey===panes[panes.length - 1].key} onClick={moveRight} >Move Right</Button></ButtonGroup>: <></>}}
          size='small'
          onChange={(key: string) => {setActiveKey(parseInt(key))}}
          activeKey={activeKey?.toString()}
          onEdit={onEdit}
          hideAdd={!(panes.length < 10)} >
          {panes.map((pane, index: number) => {
            return (
              <TabPane tab={pane.title.EN? pane.title.EN.length > 5? pane.title.EN.substring(0, 5) + '...': pane.title.EN.substring(0, 5) : 'New Tab'}
                key={pane.key} closable={panes.length !== 1 && pane.key == activeKey}>
                <TemplateComponent componentKey={index} componentData={pane} setPanes={setPanes} onChange={onChange} parentKey={componentKey} />
                {/* {panes.length !== 1 && index === activeKey?<ButtonGroup><Button>Move Left</Button><Button>Move Right</Button></ButtonGroup>: <></>} */}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    </Card>
  );
};

export const TemplateComponent: FC<TemplateComponentDataProps> = (props) => {
  const { componentKey, componentData, setPanes, onChange, parentKey } = props
  const [previewImage, setPreviewImage] = useState(componentData.imageUrl);
  const [uploading, setUploading] = useState(componentData.imageUrl?true:false);
  const [selectedButton, setSelectedButton] = useState<Partial<Buttons>>();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(0);
  const [selectedFlow, setSelectedFlow] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttons, setButtons] = useState(componentData.buttons);
  const [wordCount, setWordCount] = useState(0);


  const showModal = () => {
    setIsModalVisible(true);
    setWordCount(selectedButton?.title.EN.length);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
  };

  const handleDeleteModal = () => {
    let newButtons = buttons?buttons:[];
    newButtons.splice(selectedButtonIndex, 1)
    setButtons(newButtons)

    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === parentKey) {
        return { ...item, data: {elements: 
          item.data.elements.map((pane: any, paneIndex: number) => {
            if (paneIndex === componentKey) {
              return { ...pane, buttons: buttons}
            }
            else return pane;})
        }}
      }
      else return item;
    }))
    message.success('Button deleted');
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

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
                <Image className='ImageComponent' key={componentKey} src={previewImage} 
                  preview={{mask: <Button className='image-mask' shape="circle" size='large' onClick={() => setPreviewImage('')}><DeleteOutlined/></Button>}}/>
              </Space>
              : 
              <ImgCrop rotate aspect={1.91}>
                <Dragger  {...draggerProps}>
                  <p style={{marginBottom: 12}}> {uploading ? <LoadingOutlined /> : <PlusOutlined />} </p>
                  <p className="ant-upload-hint">{uploading ? "Uploading" : "Click or drag image here to upload"}</p>
                </Dragger>
              </ImgCrop>}
          </div>
          <Form.Item name='Title' rules={[{ required: true, message: 'Title is required' }, { max: 80, message: 'Title cannot be longer than 80 characters' }]}>
            <TextArea
              maxLength={81}
              autoSize={{ minRows: 1 }}
              allowClear
              placeholder="Title"
              onChange={(e) => {
                setPanes((prevState: any) => [...prevState].map((pane, index) => {
                  if (index === componentKey) {
                    return { ...pane, title: { EN: e.target.value }}
                  }
                  else return pane;}))
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
          <Form.Item name='Subtitle' rules={[{ max: 80, message: 'Subtitle cannot be longer than 80 characters' }]}>
          <TextArea 
            maxLength={81}
            autoSize={{ minRows: 1 }}
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
              className='ant-btn-multiple'
              key={"component" + parentKey + "pane" + componentKey + "button" + buttonIndex}
              block
              onClick={() => {
                setSelectedButton(button);
                setSelectedButtonIndex(buttonIndex)
                showModal();
              }}>
              {button.title.EN}
            </Button>
          ))}
          {buttons&&buttons.length < 3 && (
            <Button
              className='ant-btn-multiple'
              key={"component" + parentKey + "pane" + componentKey + "buttonNew"}
              onClick={() => {
                showModal();
                setSelectedButtonIndex(buttons.length)
                setSelectedButton({type: 'postback', title: {EN: ''}});
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
            centered
            destroyOnClose={true}
            width={450}
            footer={[
              <Button type="primary" danger onClick={handleDeleteModal}>
                Delete
              </Button>,
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
                  if (index === parentKey) {
                    let updatedButton: Buttons;
                    if (values.type === 'postback')
                      {updatedButton = {...values, title: {EN: values.title}, payload: {flowId: selectedFlow}}}
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
                url: selectedButton?.type === 'web_url' ? selectedButton?.url : null,
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
                <Input maxLength={20} onChange={(e) => setWordCount(e.target.value.length)} suffix={<div style={{color:'#BEBEBE'}}> {wordCount}/20</div>}/>
              </Form.Item>
              <Form.Item
                label="Type"
                name="type"
                initialValue={selectedButton ? selectedButton.type : 'postback'}
              >
                <Radio.Group
                  onChange={(event) => {
                    setSelectedButton({...selectedButton, type: event.target.value})
                  }}
                >
                  <Radio.Button value="postback">Flow</Radio.Button>
                  <Radio.Button value="web_url">URL</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {selectedButton?.type === 'web_url'? (
                  <ProFormTextArea
                    name="url"
                    label="URL"
                    placeholder="Link to URL"
                  />
                ):(
                  <ProFormSelect
                    name="flowId"
                    label="Flow Response"
                    initialValue={selectedButton?.type === 'postback' ? selectedButton?.payload?.flowId : null}
                    showSearch
                    fieldProps={{ onSelect: (e, option) => {
                      setSelectedFlow(option.id)
                    }}}
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
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(0);
  const [selectedFlow, setSelectedFlow] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
    setWordCount(selectedButton?.title.EN.length);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
  };

  const handleDeleteModal = () => {
    let newButtons = componentData?.buttons||[];
    newButtons.splice(selectedButtonIndex, 1)
    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        return { ...item, data: {...item.data, buttons: newButtons}}}}))
    message.success('Button deleted');
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Card title='Button Template' size='small' style={{background: 'transparent'}} bordered={false} extra={deleteButton(componentKey, onChange)}>
      <Form.Item
        key={componentKey.toString()}
        rules={[{ required: true, message: 'Field is required' }, { max: 160, message: 'Text cannot be longer than 160 characters' }]}>
        <TextArea
          maxLength={161}
          autoSize={{ minRows: 1 }}
          allowClear
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
          {componentData?.buttons.map((button, buttonIndex) => {
             return <Button className='ant-btn-multiple'
                key={"component" + componentKey + "button" + buttonIndex}
                block
                onClick={() => {
                  setSelectedButton(button);
                  setSelectedButtonIndex(buttonIndex)
                  showModal();
                }}
              >
                {button.title.EN}
              </Button>
          })}
          {componentData?.buttons.length < 3 && (
            <Button
              key={"component" + componentKey + "buttonNew"}
              onClick={() => {
                setSelectedButtonIndex(componentData?.buttons.length)
                setSelectedButton({type: 'postback', title: {EN: ''}});
                showModal();
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
          centered
          width={450}
          footer={[
            <Button type="primary" danger onClick={handleDeleteModal}>
              Delete
            </Button>,
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
              onChange((prevState: any) => [...prevState].map((item, index) => {
                if (index === componentKey) {
                  let updatedButton: Buttons;
                  if (values.type === 'postback')
                    {updatedButton = {...values, title: {EN: values.title}, payload: {flowId: selectedFlow}}}
                  else {updatedButton = {...values, title: {EN: values.title}, url: values.url}}
                  if (selectedButtonIndex === item.data.buttons.length) {
                    return { ...item, data: {...item.data, buttons: [...item.data.buttons, updatedButton]}}}
                  return { ...item, data: {...item.data, buttons: item.data.buttons.map((button: Buttons, buttonIndex: number) => {
                    if (buttonIndex === selectedButtonIndex)
                      return updatedButton
                    return button 
                  })}}
                }
                else return item;
              }))
              message.success('Button added');
            }}
            initialValues={{
              title: selectedButton?.title.EN? selectedButton.title.EN : null,
              type: selectedButton? selectedButton.type : 'postback',
              url: selectedButton?.type === 'web_url' ? selectedButton?.url : null,
              flowId: selectedButton?.type === 'postback' ? selectedButton?.payload?.flowId : null
            }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              label="Display Text"
              name="title"
              rules={[{ required: true, message: 'Please input display text' }]}
            >
              <Input maxLength={20} onChange={(e) => setWordCount(e.target.value.length)} suffix={<div style={{color:'#BEBEBE'}}> {wordCount}/20</div>}/>
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
            >
              <Radio.Group
                onChange={(event) => {
                  setSelectedButton({...selectedButton, type: event.target.value})
                }}>
                <Radio.Button value="postback">Flow</Radio.Button>
                <Radio.Button value="web_url">URL</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {selectedButton?.type === 'web_url'? (
                <ProFormTextArea
                  name="url"
                  label="URL"
                  placeholder="Link to URL"
                />
              ):(
                <ProFormSelect
                  name="flowId"
                  label="Flow Response"
                  showSearch
                  fieldProps={{ onSelect: (e, option) => {
                    setSelectedFlow(option.id)
                  }}}
                  // @ts-ignore
                  request={async () => {
                    return await queryFlowsFilter('name,params');
                  }}
                />)
            }
          </Form>
        </Modal>
        
      </Card>
  );
};

export const FlowComponent: FC<FlowComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props

  return (
    <Card title='Flow' size='small' style={{background: 'transparent'}} bordered={false} extra={deleteButton(componentKey, onChange)}>
      <ProFormSelect
        name={componentData.name}
        showSearch
        fieldProps={{ onSelect: (e, option) => {
          onChange((prevState: any) =>
            [...prevState].map((item, index) => {
              if (index === componentKey) {
                return {...item, data: {...item.data, flow: {flowId: option.id, name: option.label}} };
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
    </Card>
  );
};

export const QuickReplyComponent: React.FC<QuickReplyComponentDataProps> = (props) => {
  const { componentKey, componentData, onChange } = props
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectRow, setSelectRow] = useState<QrButtons>();
  const [selectedFlow, setSelectedFlow] = useState<string>();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(0);
  const [wordCount, setWordCount] = useState(0);
  const addNewQuickReplyButton = (
    <Button
      type="dashed"
      style={{borderRadius: '4px'}}
      icon={<PlusOutlined />}
      onClick={() => {
        showModal();
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

  const handleDeleteModal = () => {
    let newButtons = componentData?.quickReplies||[];
    newButtons.splice(selectedButtonIndex, 1)
    onChange((prevState: any) => [...prevState].map((item, index) => {
      if (index === componentKey) {
        return { ...item, data: { ...item.data, quickReplies: newButtons}}}}))
    message.success('Button deleted');
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Card title='Quick Replies' size='small' style={{background: 'transparent'}} bordered={false} extra={deleteButton(componentKey, onChange)}>
      <Form.Item style={{ marginTop: -6 }} >
        <Space wrap>
          {componentData.quickReplies.map((button, index) => (
            <Button
              block
              style={{borderRadius: '4px'}}
              onClick={() => {
                setSelectRow(button);
                setSelectedButtonIndex(index);
                showModal();
              }}>
              {button.text.EN}
            </Button>
          ))}
          {componentData.quickReplies.length < 11 && addNewQuickReplyButton}
        </Space>
        <Modal
          title="New Quick Reply"
          visible={isModalVisible}
          onOk={handleOkModal}
          onCancel={handleCancelModal}
          destroyOnClose={true}
          width={450}
          centered
          footer={[
            <Button type="primary" danger onClick={handleDeleteModal}>
              Delete
            </Button>,
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
              console.log(values)
              onChange((prevState: any) => [...prevState].map((item, index) => {
                if (index === componentKey) {
                  return { ...item, data: { ...item.data, quickReplies: [...item.data.quickReplies, {payload: {flowId: selectedFlow}, text: {EN: values.text}}]}}
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
              rules={[{ required: true, message: 'Please input display text' }, { max: 20, message: 'Button title cannot be longer than 20 characters' }]}
              initialValue={selectRow?.text.EN}>
              <Input maxLength={20} onChange={(e) => setWordCount(e.target.value.length)} suffix={<div style={{color:'#BEBEBE'}}> {wordCount}/20</div>}/>
            </Form.Item>
            <ProFormSelect
              name="flowId"
              label="Flow Response"
              initialValue={selectRow?.payload.flowId}
              showSearch
              fieldProps={{ onSelect: (e, option) => {
                setSelectedFlow(option.id)
              }}}
              // @ts-ignore
              request={async () => {
                return await queryFlowsFilter('name,params');
              }}
            />
          </Form>
        </Modal>
      </Form.Item>
    </Card>
  );
};
