import DataTable from 'components/shared/DataTable/index';
import { formatCurrency } from 'pages/Component/helpers/index';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import DetailModel from './DetailModal';

const DiscountProgramProductTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  exportExcel,
  sum,
}) => {
  const dispatch = useDispatch();
  const [openModel, setOpenModel] = useState(false);
  const [itemView, setItemView] = useState({});

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        classNameHeader: 'bw_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_text_center',
        accessor: 'index',
      },
      {
        header: 'Mã sản phẩm',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên sản phẩm',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngành hàng',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        accessor: 'category_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Model',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        accessor: 'model_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Thời gian áp dụng CTCK',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        classNameHeader: 'bw_text_center',
        formatter: (d) => {
          return d.from_date && d.from_date ? `${d.from_date} - ${d.to_date}` : '';
        },
      },
      {
        header: 'Thuộc chương trình chiết khấu',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        accessor: 'discount_program_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số lượng',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        accessor: 'quantity',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Số tiền thưởng dự tính',
        style: (_) => (_.record_type === 'START' ? { backgroundColor: 'rgba(255, 165, 9, 0.5)' } : {}),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => <b>{p.discount_money ? formatCurrency(p.discount_money) : ''}</b>,
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
        content: 'Xuất excel',
        outline: true,
        permission: 'PO_DISCOUNTPROGRAMPRODUCT_APPLY_EXPORT',
        onClick: () => exportExcel(),
      },
      {
        icon: 'fi fi-rr-eye',
        type: 'primary',
        content: 'Chi tiết',
        permission: 'PO_DISCOUNTPROGRAMPRODUCT_VIEW',
        onClick: (p) => {
          if (p.product_id && p.discount_program_id) {
            setOpenModel(true);
            setItemView(p);
          }
        },
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <React.Fragment>
      <DataTable
        customSumRow={[
          {
            index: 1,
            value: 'Tổng cộng',
            colSpan: 3,
            style: {
              textAlign: 'center',
            },
          },
          {
            index: 9,
            style: {
              textAlign: 'right',
            },
            value: formatCurrency(sum),
          },
        ]}
        noSelect={true}
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
      />
      {openModel && (
        <DetailModel
          item={itemView}
          title='Danh sách đơn hàng'
          onClose={() => {
            setOpenModel(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default DiscountProgramProductTable;
