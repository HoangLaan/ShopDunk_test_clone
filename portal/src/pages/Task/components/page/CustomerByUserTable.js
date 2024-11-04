import React, { Fragment, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import { TASK_PERMISSION } from 'pages/Task/utils/const';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import { useDispatch } from 'react-redux';
import { GENDER_OPTIONS } from 'utils/constants';
import ModalZalo from '../modals/ModalZalo';
import ColumnCheckbox from '../shares/ColumnCheckbox';

const CustomerByUserTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const dispatch = useDispatch();

  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);
  const [modalZaloData, setModalZaloData] = useState({
    customer: {},
  });
  const columns = useMemo(
    () => [
      {
        header: 'Công việc',
        accessor: 'task_name',
        classNameHeader: ' bw_name_sticky',
        classNameBody: ' bw_name_sticky',
      },
      {
        header: 'Mã khách hàng',
        accessor: 'customer_code',
        classNameHeader: ' bw_name_sticky',
        classNameBody: ' bw_name_sticky',
      },
      {
        header: 'Tên khách hàng',
        accessor: 'full_name',
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => GENDER_OPTIONS.find((x) => x.value === item?.gender)?.label || '',
      },
      {
        header: 'Ngày sinh',
        accessor: 'birthday',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone_number',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => (
          <>
            {item.phone_number}
            {item.phone_number && (
              <span class='bw_label bw_label_success' onClick={() => callPhone(item.phone_number)}>
                Gọi nhanh
              </span>
            )}
          </>
        ),
      },
      {
        header: 'Đã liên hệ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => <ColumnCheckbox checked={item?.is_called} />
      },
      {
        header: 'Email',
        accessor: 'email',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address',
      },
      {
        header: 'Trạng thái CSKH',
        accessor: 'workflow_name',
      },
      {
        header: 'Trạng thái khách hàng',
        formatter: (item) => (item?.is_workflow_completed ? 'Đã hoàn thành' : 'Đang xử lý'),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fa fa-comments',
        color: 'green',
        permission: TASK_PERMISSION.VIEW,
        onClick: (p) => {
          setIsOpenModalZalo(true);
          setModalZaloData({ customer: p });
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: TASK_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/task/detail/${p?.task_detail_id}`),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <Fragment>
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
        hiddenDeleteClick
        noSelect
        selectedHidden
      />
      {isOpenModalZalo && <ModalZalo onClose={() => setIsOpenModalZalo(false)} customer={modalZaloData.customer} />}
    </Fragment>
  );
};

export default CustomerByUserTable;
