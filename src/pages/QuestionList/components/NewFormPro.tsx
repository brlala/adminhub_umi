import React, { useState } from 'react';
import ProForm, {
  ProFormText,
  ProFormDateRangePicker,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import { Button, Form, Input, message, Modal, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import styles from './NewForm.less';
console.log(styles);
import type { QuestionListItem, VariationListItem } from '../data.d';
import type { ActionType } from '@ant-design/pro-table';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<QuestionListItem>;

export type NewFormProps = {
  actionRef: React.MutableRefObject<ActionType | undefined>;
  createModalVisible: boolean;
  handleModalVisible: (modalVisible: boolean) => void;
  handleAdd: (fields: QuestionListItem) => Promise<boolean>;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4000 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const NewForm: React.FC<NewFormProps> = ({
  createModalVisible,
  handleModalVisible,
  actionRef,
  handleAdd,
}) => {
  const intl = useIntl();
  const [variations, setVariations] = useState<VariationListItem[]>([]);
  const addVariation = (text: string) => {
    const newVariation: VariationListItem = {
      text,
    };
    setVariations((v) => [...v, newVariation]);
  };
  return (
    // <Modal
    //   visible={createModalVisible}
    //   title="Create a New Question"
    //   okText="Create"
    //   cancelText="Cancel"
    //   onCancel={() => {
    //     handleModalVisible(false);
    //   }}
    //   onOk={async (value) => {
    //     console.log(value);
    //     // const success = await handleAdd(value as QuestionListItem);
    //     // if (success) {
    //     //   handleModalVisible(false);
    //     //   if (actionRef.current) {
    //     //     actionRef.current.reload();
    //     //   }
    //     //
    //   }}
    //   onOk={() => {
    //     form
    //       .validateFields()
    //       .then((values) => {
    //         form.resetFields();
    //         console.log(values);
    //       })
    //       .catch((info) => {
    //         console.log('Validate Failed:', info);
    //       });
    //   }}
    // >
    //   <Form
    //     form={form}
    //     layout="vertical"
    //     name="form_in_modal"
    //     initialValues={{
    //       modifier: 'public',
    //     }}
    //   >
    //     <Form.Item
    //       name="title"
    //       label="Title"
    //       rules={[
    //         {
    //           required: true,
    //           message: 'Please input the title of collection!',
    //         },
    //       ]}
    //     >
    //       <Input />
    //     </Form.Item>
    //     <Form.Item name="description" label="Description">
    //       <Input type="textarea" />
    //     </Form.Item>
    //     <Form.Item name="modifier" className="collection-create-form_last-form-item">
    //       <Radio.Group>
    //         <Radio value="public">Public</Radio>
    //         <Radio value="private">Private</Radio>
    //       </Radio.Group>
    //     </Form.Item>
    //   </Form>
    // </Modal>
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.searchTable.createForm.newQuestion',
        defaultMessage: 'New Question',
      })}
      visible={createModalVisible}
      onVisibleChange={handleModalVisible}
      onFinish={async (value) => {
        const success = await handleAdd(value as QuestionListItem);
        if (success) {
          handleModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      }}
    >
      <ProFormSelect
        width="xl"
        name="topic"
        label="Topic"
        showSearch
        valueEnum={{
          1: 'Topic 1',
          2: 'Topic 2',
          3: 'Topic 3',
          4: 'Topic 4',
          5: 'Topic 5',
        }}
        tooltip="最长为 24 位"
      />
      <ProFormText
        width="xl"
        name="main-question"
        label="Main Question"
        placeholder="Please type the main question"
      />
      <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<PlusOutlined />}>
        Add field
      </Button>
      <ProFormTextArea width="xl" label="Variations" name="variations" />
      <div className={styles.container}>
        <ProFormText
          width="xl"
          name="response"
          label="Response"
          placeholder="Please type the response"
        />
        <Button>
          <SwapOutlined />
        </Button>
      </div>
      <ProForm.Group>
        <ProFormText width="md" name="contract" label="合同名称" placeholder="请输入名称" />
        <ProFormDateRangePicker name="contractTime" label="合同生效时间" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={[
            {
              value: 'chapter',
              label: '盖章后生效',
            },
          ]}
          width="xs"
          name="useMode"
          label="合同约定生效方式"
        />
        <ProFormSelect
          width="xs"
          options={[
            {
              value: 'time',
              label: '履行完终止',
            },
          ]}
          name="unusedMode"
          label="合同约定失效效方式"
        />
      </ProForm.Group>
      <ProFormText width="sm" name="id" label="主合同编号" />
      <ProFormText name="project" disabled label="项目名称" initialValue="xxxx项目" />
      <ProFormText width="xs" name="mangerName" disabled label="商务经理" initialValue="启途" />
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.ruleName"
                defaultMessage="Rule name is required"
              />
            ),
          },
        ]}
        width="md"
        name="name"
      />
    </ModalForm>
  );
};

export default NewForm;
