import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteList } from 'services/email-template.service';
import DataTable from 'components/shared/DataTable/index';
import { LIST_TYPE, MAIL_SUPPLIER_OPTS } from 'pages/EmailMarketing/utils/constants';

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
        header: 'Tên mẫu email',
        accessor: 'email_template_name',
      },
      {
        header: 'Nhà cung cấp',
        accessor: 'mail_supplier',
        formatter: (item) => {
          return (
            <span className='bw_text_wrap'>
              {MAIL_SUPPLIER_OPTS.find((_) => _.value === item.mail_supplier)?.label}
            </span>
          );
        },
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
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
        permission: 'CRM_EMAILTEMPLATE_ADD',
        onClick: () => window._$g.rdr(`/email-template/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'CRM_EMAILTEMPLATE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/email-template/edit/${p?.email_template_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'CRM_EMAILTEMPLATE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/email-template/detail/${p?.email_template_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_EMAILTEMPLATE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([_.email_template_id]),
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
              await deleteList(e?.map((item) => item.email_template_id));
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default ListTable;
