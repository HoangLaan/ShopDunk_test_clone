import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteBusiness } from 'services/business.service';

const BusinessTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã miền',
        accessor: 'business_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên miền',
        accessor: 'business_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trực thuộc công ty',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Loại hình miền',
        accessor: 'business_type_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Khu vực',
        accessor: 'area_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày thành lập',
        accessor: 'opening_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Số điện thoại',
        accessor: 'business_phone_number',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Email',
        accessor: 'business_mail',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'AM_BUSINESS_ADD',
        onClick: () => window._$g.rdr(`/business/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'AM_BUSINESS_EDIT',
        onClick: (p) => window._$g.rdr(`/business/edit/${p?.business_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'AM_BUSINESS_VIEW',
        onClick: (p) => window._$g.rdr(`/business/detail/${p?.business_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'AM_BUSINESS_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteBusiness([parseInt(_?.business_id)]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

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
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteBusiness(e?.map((val) => parseInt(val?.business_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default BusinessTable;
