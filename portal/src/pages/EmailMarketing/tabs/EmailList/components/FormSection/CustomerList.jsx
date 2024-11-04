import React, { useState, useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import ModalAddCustomer from '../Modal/ModalAddCustomer';

const CustomerList = ({ disabled, title }) => {
  const dispatch = useDispatch();

  const methods = useFormContext();
  const [openModalAddCustomer, setOpenModalAddCustomer] = useState(false);
  const { control } = methods;

  const { remove } = useFieldArray({
    control,
    name: 'customer_list',
  });

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên khách hàng',
      disabled: disabled,
      accessor: 'customer_name',
    },
    {
      header: 'Email',
      disabled: disabled,
      accessor: 'customer_email',
    },
    {
      header: 'Số điện thoại',
      disabled: disabled,
      accessor: 'customer_phone',
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm khách hàng',
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
    <BWAccordion title={title} isRequired={true}>
      <div className='bw_col_12'>
        <DataTable noSelect noPaging actions={actions} columns={columns} data={methods.watch('customer_list')} />
      </div>
      {openModalAddCustomer && !disabled ? (
        <ModalAddCustomer open={openModalAddCustomer} onClose={() => setOpenModalAddCustomer(false)} />
      ) : null}
    </BWAccordion>
  );
};

export default CustomerList;
