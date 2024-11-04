import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deletePayPartner } from 'services/pay-partner.service';
import { cdnPath } from 'utils/index';
import { PERMISSION_PAY_PARTNER } from '../utils/constants';

const PartnerPaymentTable = ({
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
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Mã đối tác',
        accessor: 'pay_partner_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Logo',
        accessor: 'logo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => (
          <img
            style={{
              width: '50px',
              height: '50px',
            }}
            src={item.logo ? cdnPath(item.logo) : null}
          />
        ),
      },
      {
        header: 'Tên viết tắt',
        accessor: 'pay_partner_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tên đầy đủ đối tác',
        accessor: 'pay_partner_full_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'create_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
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
        permission: PERMISSION_PAY_PARTNER.ADD,
        onClick: () => window._$g.rdr(`/pay-partner/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        title: 'Sửa',
        permission: PERMISSION_PAY_PARTNER.EDIT,
        onClick: (p) => window._$g.rdr(`/pay-partner/edit/${p?.pay_partner_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        title: 'Chi tiết',
        permission: PERMISSION_PAY_PARTNER.VIEW,
        onClick: (p) => window._$g.rdr(`/pay-partner/detail/${p?.pay_partner_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: PERMISSION_PAY_PARTNER.DELETE,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePayPartner([_?.pay_partner_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

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
              await deletePayPartner(e?.map((val) => parseInt(val?.pay_partner_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default PartnerPaymentTable;
