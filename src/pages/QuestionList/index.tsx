import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
// @ts-ignore
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { QuestionListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule } from './service';
import NewForm from '@/pages/QuestionList/components/NewForm';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: QuestionListItem) => {
  const hide = message.loading('Adding');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Add success');
    return true;
  } catch (error) {
    hide();
    message.error('Add fail, please retry!');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Updating');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Update success');
    return true;
  } catch (error) {
    hide();
    message.error('Update fail, please retry!');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: QuestionListItem[]) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Delete success, reloading page');
    return true;
  } catch (error) {
    hide();
    message.error('Delete fail, please retry!');
    return false;
  }
};

const QuestionList: React.FC = () => {
  /**
   * 新建窗口的弹窗
   */
  const [createModalVisible, handleModalVisible] = useState<boolean>(true);
  /**
   * 分布更新窗口的弹窗
   */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<QuestionListItem>();
  const [selectedRowsState, setSelectedRows] = useState<QuestionListItem[]>([]);

  /**
   * 国际化配置
   */
  const intl = useIntl();

  const columns: ProColumns<QuestionListItem>[] = [
    {
      title: <FormattedMessage id="pages.question.topic.topicLabel" defaultMessage="Topic" />,
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.question.mainQuestion.mainQuestionLabel"
          defaultMessage="Main Question"
        />
      ),
      dataIndex: 'desc',
      valueType: 'textarea',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
        // tip: 'Each question should be unique',
      },
    },
    {
      title: (
        <FormattedMessage id="pages.question.response.responseLabel" defaultMessage="Response" />
      ),
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInSearch: true,
      render: (dom, entity) => {
        return <>This is the answer for the intents at the left</>;
      },
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.timesTriggerNo" defaultMessage="Times Triggered" />
      ),
      dataIndex: 'callNo',
      sorter: true,
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="状态" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.inactive"
              defaultMessage="inactive"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.scheduled"
              defaultMessage="scheduled"
            />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="online" />
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.deleted" defaultMessage="deleted" />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleUpdatedAt"
          defaultMessage="Last Triggered at"
        />
      ),
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Option" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<QuestionListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Status',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="item" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total Number of Service Calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}
      <NewForm
        actionRef={actionRef}
        handleAdd={handleAdd}
        createModalVisible={createModalVisible}
        handleModalVisible={handleModalVisible}
      />
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<QuestionListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<QuestionListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default QuestionList;
