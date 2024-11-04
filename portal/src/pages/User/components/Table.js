import DataTable from 'components/shared/DataTable/index';
import i__cus_home from 'assets/bw_image/icon/i__cus_home.svg';
import React, { useMemo } from 'react';
import BWImage from 'components/shared/BWImage/index';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { syncExtensionVoip } from 'services/users.service';
import { USER_STATUS } from '../helpers/constants';

const Table = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleActionRow,
  handleBulkAction,
  onRefresh,
  handleExportExcel,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Mã NV',
        accessor: 'user_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.user_name}</b>,
      },
      // {
      //   header: 'Mã phụ',
      //   formatter: (p) => <b>{p?.sub_username}</b>,
      // },
      {
        header: 'Họ và tên',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <BWImage src={p?.default_picture_url} />
            {p?.full_name}
          </div>
        ),
      },
      {
        header: 'Vị trí',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <>{p?.position_name}</>,
      },
      {
        header: 'Phòng ban',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <>{p?.department_name}</>,
      },
      {
        header: 'Cấp bậc',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <>{p?.position_level_name}</>,
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <>{p?.gender ? 'Nam' : 'Nữ'}</>,
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <>{p?.phone_number}</>,
      },
      // {
      //   header: 'Địa chỉ',
      //   formatter: (p) => <>{p?.address}</>,
      // },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <>{p?.email}</>,
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        accessor: 'user_status',
        formatter: (p) => {
          if (p?.user_status === USER_STATUS.WORKING) {
            return <span className='bw_label_outline bw_label_outline_success text-center'>Đang làm việc</span>;
          } else if (p?.user_status === USER_STATUS.MATERNITY_LEAVE) {
            return <span className='bw_label_outline bw_label_outline_success text-center'>Nghỉ thai sản</span>;
          } else {
            return <span className='bw_label_outline bw_label_outline_danger text-center'>Đã nghỉ việc</span>;
          }
        },
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        outline: true,
        content: 'Export',
        onClick: () => handleExportExcel(),
        permission: 'SYS_USER_EXPORT',
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        onClick: () => window._$g.rdr('/users/add'),
        permission: 'SYS_USER_ADD',
      },
      {
        icon: 'fi fi-rr-lock',
        color: 'orangce',
        onClick: (p) => handleActionRow(p, 'change_password'),
        permission: 'SYS_USER_PASSWORD',
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        onClick: (p) => handleActionRow(p, 'edit'),
        permission: 'SYS_USER_EDIT',
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        onClick: (p) => handleActionRow(p, 'detail'),
        permission: 'SYS_USER_VIEW',
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (p) => handleActionRow(p, 'delete'),
        permission: 'SYS_USER_DEL',
      },
      // {
      //   globalAction: true,
      //   outline: true,
      //   type: 'success',
      //   content: 'Đồng bộ Voip',
      //   icon: 'fi fi-rr-refresh',
      //   onClick: (p) => {
      //     console.log(p)
      //   },
      // },
      // {
      //   outline: true,
      //   type: 'success',
      //   hidden: (p) => p?.is_sync_voip,
      //   icon: 'fi fi-rr-refresh',
      //   onClick: (p) => {
      //     dispatch(
      //       showConfirmModal(
      //         ['Thiết lập máy nhánh cho nhân viên ' + p?.full_name],
      //         async () => {
      //           await syncExtensionVoip({
      //             user_name: p?.user_name,
      //           });
      //           onRefresh();
      //         },
      //         'Đồng ý',
      //       ),
      //     );
      //   },
      // },
    ];
  }, []);

  const title = (
    <div className='bw_count_cus'>
      <img src={i__cus_home} />
      Tổng số nhân viên: {totalItems}
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={handleBulkAction}
      title={title}
    />
  );
};

export default Table;
