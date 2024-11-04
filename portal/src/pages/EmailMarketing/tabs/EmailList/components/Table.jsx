import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteList } from 'services/email-list.service';
import DataTable from 'components/shared/DataTable/index';
import { LIST_TYPE } from 'pages/EmailMarketing/utils/constants';

const ListTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
        formatter: (_, index) => <span className='bw_text_wrap'>{index + 1}</span>,
      },
      {
        header: 'Tên danh sách',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'email_list_name',
      },
      {
        header: 'Loại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'email_list_type',
        formatter: (item) => {
          return (
            <span className='bw_text_wrap'> {LIST_TYPE.find((_) => _.value === item.email_list_type)?.label}</span>
          );
        },
      },
      {
        header: 'Số lượng liên hệ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'customer_count',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [],
  );

  const handleDelete = useCallback(
    async (params) => {
      await deleteList(params);
      onRefresh();
    },
    [onRefresh],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'CRM_EMAILLIST_ADD',
        onClick: () => window._$g.rdr(`/email-list/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'CRM_EMAILLIST_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/email-list/edit/${p?.email_list_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'CRM_EMAILLIST_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/email-list/detail/${p?.email_list_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_EMAILLIST_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([_.email_list_id]),
            ),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(e) =>
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteList(e?.map((item) => item.email_list_id));
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default ListTable;
