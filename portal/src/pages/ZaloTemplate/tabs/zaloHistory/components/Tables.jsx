import React, { useCallback, useState } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { showConfirmModal } from 'actions/global';
import { deleteList } from 'services/email-history.service';
import DataTable from 'components/shared/DataTable/index';
import { MAIL_STATUS } from 'pages/EmailMarketing/utils/constants';

const Table = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  openModalSendMail,
}) => {
  const dispatch = useDispatch();
console.log('data', data);
  const columns = useMemo(
    () => [
      {
        header: 'Tiêu đề gửi mail',
        accessor: 'subject',
      },
      {
        header: 'Mail gửi',
        accessor: 'email_from',
      },
      {
        header: 'Mail nhận',
        accessor: 'email_to',
      },
      {
        header: 'Thời gian gửi',
        formatter: (item) => {
          return <span>{item.send_time ? moment(item.send_time).format('HH:mm A DD/MM/YYYY') : '-'}</span>;
        },
      },
      {
        header: 'Lịch gửi',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => {
          return <span>{item.schedule_time ? moment.utc(item.schedule_time).format('HH:mm A DD/MM/YYYY') : '-'}</span>;
        },
      },

      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'status',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          const status = MAIL_STATUS.find((_) => p.status === _.value);
          return <span className={`bw_label_outline bw_label_outline_${status?.class} text-center`}>{status?.label}</span>;
        },
      },
      // {
      //   header: 'Trạng thái xem mail',
      //   formatter: (p) => {
      //     return (
      //       <span class={`bw_label_outline bw_label_outline_${p.is_open ? 'success' : 'danger'} text-center`}>
      //         {p.is_open ? 'Đã mở' : 'Chưa mở'}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   header: 'Ấn vào liên kết',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   formatter: (p) => {
      //     return (
      //       <span class={`bw_label_outline bw_label_outline_${p.is_clicked ? 'success' : 'danger'} text-center`}>
      //         {p.is_clicked ? 'Đã ấn' : 'Chưa ấn'}
      //       </span>
      //     );
      //   },
      // },
      {
        header: 'Ghi chú',
        accessor: 'note',
        classNameHeader: 'bw_text_center',
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
        content: 'Gửi Email',
        permission: 'EMAIL_MARKETING_SEND',
        onClick: () => {
          openModalSendMail();
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'CRM_EMAILHISTORY_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/email-history/detail/${p?.email_history_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_EMAILHISTORY_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([_.email_history_id]),
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
              await deleteList(e?.map((item) => item.email_history_id));
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default Table;
