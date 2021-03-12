import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Slider, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { FormattedMessage, useIntl } from 'umi';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FlowListItem } from './data.d';
import { queryFlows, removeFlows, updateRule } from './service';
import moment from 'moment';
import { changeLanguage } from '@/utils/language';
import { Link } from '@umijs/preset-dumi/lib/theme';
import PhonePreview from '@/components/PhonePreview';

/**
 * 更新节点
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('Updating');
//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();
//
//     message.success('Update success');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Update fail, please retry!');
//     return false;
//   }
// };

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: FlowListItem[]) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;
  try {
    await removeFlows({
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

changeLanguage('en-US');
const FlowList: React.FC = () => {
  /**
   * 分布更新窗口的弹窗
   */
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<FlowListItem>();
  const [selectedRowsState, setSelectedRows] = useState<FlowListItem[]>([]);
  const [maxTriggeredCount, setMaxTriggeredCount] = useState<number>(5000);

  /**
   * 国际化配置
   */
  const intl = useIntl();

  const columns: ProColumns<FlowListItem>[] = [
    {
      title: <FormattedMessage id="pages.flow.flowName.flowNameLabel" defaultMessage="Flow Name" />,
      width: '40%',
      dataIndex: 'name',
      valueType: 'text',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {entity.name}
          </a>
        );
      },
    },

    {
      title: <FormattedMessage id="pages.flow.size.sizeLabel" defaultMessage="Size" />,
      dataIndex: 'size',
      valueType: 'digit',
      hideInSearch: true,
      render: (dom, entity) => entity.flow.length,
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.timesTriggerNo" defaultMessage="Times Triggered" />
      ),
      dataIndex: 'triggeredCount',
      sorter: true,
      align: 'right',
      hideInForm: true,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <Slider
            style={{ margin: '0px 20px 0px 20px' }}
            range
            defaultValue={[0, maxTriggeredCount]}
            max={maxTriggeredCount}
          />
        );
      },
    },
    {
      title: <FormattedMessage id="pages.flow.size.sizeLabel" defaultMessage="Preview" />,
      dataIndex: 'preview',
      valueType: 'digit',
      hideInSearch: true,
      hideInForm: true,
      hideInTable: true,
      render: (dom, entity) => {
        console.log(entity.flow)
        return <PhonePreview data={entity.flow}/>

      }
      ,
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.timesReferenced" defaultMessage="Referenced" />
      ),
      dataIndex: 'referenceCount',
      align: 'right',
      hideInSearch: true,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <Slider
            style={{ margin: '0px 20px 0px 20px' }}
            range
            defaultValue={[0, maxTriggeredCount]}
            max={maxTriggeredCount}
          />
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleUpdatedAt" defaultMessage="Updated" />,
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
      // width: '8%',
      render: (dom, entity) => {
        return moment(entity.createdAt).format('yyyy-MM-DD HH:mm:ss');
      },
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.titleTriggeredAt" defaultMessage="Triggered" />
      ),
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateRange',
      // width: '8%',
      render: (dom, entity) => {
        return moment(entity.updatedAt).format('yyyy-MM-DD HH:mm:ss');
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInTable: true,
      render: (_, record) => [
        <Button type='text' style={{color: 'red'}} onClick={()=> {handleRemove([record]); 
          setSelectedRows([]);
          actionRef.current?.reloadAndRest?.();setShowDetail(false)}}>
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="Delete" />
        </Button>
      ],
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Option" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link to={"/flows/" + record.id}>
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        </Link>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<FlowListItem>
        // style={{ whiteSpace: 'pre-line' }}
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Status',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          defaultCollapsed: true,
          labelWidth: 'auto',
          // layout: 'vertical',
        }}
        toolBarRender={() => [
          <Link to="/flows/new">
            <Button type="primary" key="primary">
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button>
          </Link>,
        ]}
        request={async (params, sorter, filter) => {
          const flows = await queryFlows({ sorter, filter, ...params });
          console.log({ flows });
          return flows;
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
      <Drawer
        style={{ whiteSpace: 'pre-line' }}
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<FlowListItem>
            column={1}
            title={
              <b
                style={{
                  fontSize: 20,
                }}
              >
                Flow Details
              </b>
            }
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<FlowListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default FlowList;
