import React, { useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useState } from 'react';
import ModalAddStocksType from './Modal/ModalAddStocksType/index';

const OrderTypeMapping = ({ disabled, title, id }) => {
  const [openModalAddStocksType, setOpenModalAddStocksType] = useState(false);
  const methods = useFormContext();
  const { control, setValue, getValues } = methods;

  const { remove, append } = useFieldArray({
    control,
    name: 'stocks_type_list',
  });

  const columns = [
    {
      header: 'STT',
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => index + 1,
    },
    {
      header: 'Mã loại kho',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      accessor: 'stocks_type_code',
    },
    {
      header: 'Tên loại kho',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'stocks_type_name',
    },
  ];

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm loại kho',
        permission: 'SL_ORDERTYPE_EDIT',
        onClick: () => {
          setOpenModalAddStocksType(true);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: 'SL_ORDERTYPE_EDIT',
        onClick: (_, index) => {
          if (!disabled) {
            remove(index);
          }
        },
      },
    ],
    [],
  );

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <DataTable
            noSelect
            noPaging
            actions={actions}
            columns={columns}
            data={methods.watch('stocks_type_list') || []}
          />
        </div>
      </div>
      {openModalAddStocksType && !disabled ? (
        <ModalAddStocksType
          open={openModalAddStocksType}
          onClose={() => setOpenModalAddStocksType(false)}
          title={'Danh sách loại kho'}
        />
      ) : null}
    </BWAccordion>
  );
};

export default OrderTypeMapping;
