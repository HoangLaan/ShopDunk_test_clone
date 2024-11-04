import React, { useMemo } from 'react';
import DataTable from 'components/shared/DataTable/index';
import { formatPrice } from 'utils';
import { InputNumber } from 'antd';
import { showToast } from 'utils/helpers';

const CustomerTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  loading = false,
  closeModal,
  dataSelect,
  setDataSelect,
  setData,
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Số hóa đơn',
        classNameHeader: 'bw_text_center',
        accessor: 'invoice_no',
      },
      {
        header: 'Mã đơn mua hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'purchase_order_code',
      },
      {
        header: 'Tổng số tiền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_payment_price',
        formatter: (item) => formatPrice(item.total_payment_price, false, ','),
      },
      {
        header: 'Số tiền đã thanh toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_payment_price',
        formatter: (item) => formatPrice(item.paid_price, false, ','),
      },
      {
        header: 'Số tiền thanh toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_payment_price',
        formatter: (item, index) => {
          return (
            <InputNumber
              style={{ width: '200px' }}
              min={0}
              max={item?.total_payment_price - item?.paid_price >= 0 ? item?.total_payment_price - item?.paid_price : 0}
              value={item?.remaining_price}
              addonAfter='đ'
              formatter={(value) => formatPrice(value, false, ',')}
              onChange={(value) => {
                setData((previousData) => {
                  previousData.payment_list[index].remaining_price = value || 0;
                  return { ...previousData };
                });
                setDataSelect((previousData) => {
                  if (previousData[index]) {
                    previousData[index].remaining_price = value || 0;
                  }
                  return [...previousData];
                });
              }}
            />
          );
        },
      },
    ],
    [],
  );

  return (
    <DataTable
      customSumRow={[
        {
          index: 1,
          value: 'Tổng cộng',
          colSpan: 4,
          style: {
            textAlign: 'center',
          },
        },
        {
          index: 4,
          style: {
            textAlign: 'right',
          },
          value: formatPrice(
            dataSelect?.reduce((total, product) => total + (product?.total_payment_price || 0), 0),
            false,
            ',',
          ),
        },
        {
          index: 5,
          style: {
            textAlign: 'right',
          },
          value: formatPrice(
            dataSelect?.reduce((total, product) => total + (product?.paid_price || 0), 0),
            false,
            ',',
          ),
        },
        {
          index: 6,
          style: {
            textAlign: 'right',
          },
          value: formatPrice(
            dataSelect?.reduce((total, product) => total + product?.remaining_price, 0),
            false,
            ',',
          ),
        },
      ]}
      hiddenDeleteClick
      columns={columns}
      data={data}
      fieldCheck='invoice_id'
      actions={[]}
      defaultDataSelect={dataSelect}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      loading={loading}
      onChangeSelect={setDataSelect}
    />
  );
};

export default CustomerTable;
