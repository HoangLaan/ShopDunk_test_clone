import React, { useState, useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import DataTable from 'components/shared/DataTable/index';
import ModalAddProduct from '../../Modal/ModalAddProduct/index';

const ProductList = ({ disabled, title }) => {
  const dispatch = useDispatch();

  const methods = useFormContext();
  const [openModalAddCustomer, setOpenModalAddCustomer] = useState(false);
  const { control } = methods;

  const { remove } = useFieldArray({
    control,
    name: 'product_list',
  });

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Mã hàng hóa',
      disabled: disabled,
      accessor: 'product_code',
    },
    {
      header: 'Tên sản phẩm',
      disabled: disabled,
      accessor: 'product_name',
    },
    {
      header: 'Ngành hàng',
      disabled: disabled,
      accessor: 'category_name',
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm sản phẩm',
        permission: 'CRM_EMAILLIST_CUSTOMER_ADD',
        onClick: () => {
          setOpenModalAddCustomer(true);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: 'CRM_EMAILLIST_CUSTOMER_DEL',
        onClick: (_, index) => {
          if (!disabled) {
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  remove(index);
                },
              ),
            );
          }
        },
      },
    ],
    [],
  );

  return (
    <div className='bw_row'>
      <div className='bw_col_12'>
        <DataTable noSelect noPaging actions={actions} columns={columns} data={methods.watch('product_list') || []} />
      </div>
      {openModalAddCustomer && !disabled ? (
        <ModalAddProduct
          open={openModalAddCustomer}
          onClose={() => setOpenModalAddCustomer(false)}
          title='Danh sách sản phẩm'
        />
      ) : null}
    </div>
  );
};

export default ProductList;
