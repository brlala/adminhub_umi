import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Space, Tag } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import type { QuestionListItem } from './data.d';
import { queryQuestion, updateRule, removeQuestion } from './service';
import NewForm from '@/pages/QuestionList/components/NewForm';
import moment from 'moment';
import { changeLanguage } from '@/utils/language';
import UpdateForm from './components/UpdateForm';
import { readMore } from '@/utils/utils';
import { FormInstance } from 'antd/lib/form';

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
    await removeQuestion({
      key: selectedRows.map((row) => row.id),
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

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible }: { form: FormInstance; visible: boolean }) => {
  const prevVisibleRef = useRef<boolean>();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);
};

changeLanguage('en-US');
const QuestionList: React.FC = () => {
  /**
   * 新建窗口的弹窗
   */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * 编辑窗口的弹窗
   */
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  /**
   * 分布更新窗口的弹窗
   */
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
      dataIndex: 'topic',
      valueType: 'textarea',
      width: '10%',
    },
    {
      title: (
        <FormattedMessage
          id="pages.question.mainQuestion.mainQuestionLabel"
          defaultMessage="Main Question"
        />
      ),
      width: '25%',
      dataIndex: 'questionText',
      valueType: 'textarea',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {(entity.text as any).EN}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="pages.question.response.responseLabel" defaultMessage="Response" />
      ),
      dataIndex: 'answerFlow',
      valueType: 'textarea',
      width: '30%',
      hideInSearch: true,
      ellipsis: true,
      render: (dom, entity) => {
        let content;
        if (entity.answerFlow) {
          if (!entity.answerFlow.name) {
            content = (
              <>
                <Tag color={'magenta'} key={entity.answerFlow.name}>
                  Text
                </Tag>
                {/*{(entity.answerFlow.flow[0].data.text as any).EN}*/}
                {readMore((entity.answerFlow.flow[0].data.text as any).EN, 10)}
              </>
            );
          } else {
            content = (
              <>
                <Tag color={'green'} key={entity.answerFlow.name}>
                  Flow
                </Tag>
                {entity.answerFlow.name}
              </>
            );
          }
        }
        return <Space>{content}</Space>;
      },
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.timesTriggerNo" defaultMessage="Times Triggered" />
      ),
      dataIndex: 'callNo',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="状态" />,
      dataIndex: 'status',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
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
        <FormattedMessage id="pages.searchTable.titleUpdatedAt" defaultMessage="Last Updated" />
      ),
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
      width: '8%',
      render: (dom, entity) => {
        let date = moment(entity.createdAt).format('dd, DD-MMM-YY');
        return date;
      },
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.titleTriggeredAt" defaultMessage="Last Triggered" />
      ),
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateRange',
      width: '8%',
      render: (dom, entity) => {
        let date = moment(entity.updatedAt).format('dd, DD-MMM-YY');
        return date;
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
            handleEditModalVisible(true);
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
        // style={{ whiteSpace: 'pre-line' }}
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Status',
        })}
        actionRef={actionRef}
        rowKey="id"
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
        request={async (params, sorter, filter) => {
          return queryQuestion({ sorter, filter, ...params });
        }}
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
        createModalVisible={createModalVisible}
        handleModalVisible={handleModalVisible}
      />
      <UpdateForm
        actionRef={actionRef}
        editModalVisible={editModalVisible}
        handleEditModalVisible={handleEditModalVisible}
        values={currentRow}
        setCurrentRow={setCurrentRow}
      />
      {/*<UpdateForm*/}
      {/*  actionRef={actionRef}*/}
      {/*  editModalVisible={editModalVisible}*/}
      {/*  handleEditModalVisible={handleEditModalVisible}*/}
      {/*  values={currentRow}*/}
      {/*  setCurrentRow={setCurrentRow}*/}
      {/*  resetForm={useResetFormOnCloseModal}*/}
      {/*/>*/}

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<QuestionListItem>
            column={1}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<QuestionListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default QuestionList;
