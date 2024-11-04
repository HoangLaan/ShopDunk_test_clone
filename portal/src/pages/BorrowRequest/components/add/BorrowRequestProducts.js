import React, { Fragment, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Tooltip } from 'antd';

import ICON_COMMON from 'utils/icons.common';
import { reviewStatus } from 'pages/BorrowRequest/helper/constants';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import ModalAddProduct from './modals/ModalAddProduct';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

function BorrowRequestProducts({ disabled, title }) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const methods = useFormContext();
  const {
    formState: { errors },
    clearErrors,
    // setValue,
    watch,
  } = methods;

  const { remove } = useFieldArray({
    name: 'list_product_borrow',
    rules: {
      required: false,
      validate: (field) => {
        let msg = field?.length ? '' : 'Vui lòng chọn sản phẩm mượn';
        if (msg) return msg;
        else {
          if (errors['list_product_borrow']) clearErrors('list_product_borrow');
        }
      },
    },
  });

  const stock_out_id = watch('stock_out_id');

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (_, i) => {
          return i + 1;
        },
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <Tooltip title={p?.product_name}>
            {p?.product_name?.length > 43 ? p?.product_name.slice(0, 40) + '...' : p?.product_name}
          </Tooltip>
        ),
      },
      {
        header: 'Tên nhà sản xuất',
        accessor: 'manufacture_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số lượng',
        formatter: (_, index) => {
          return (
            <div className='bw_col_12'>
              <FormNumber
                className='bw_frm_box'
                // min={1}
                style={{ width: '100%' }}
                field={`list_product_borrow.${index}.quantity`}
                validation={{
                  required: 'Số lượng là bắt buộc',
                  validate: (value, data) => {
                    if (typeof +value === 'number') {
                      if (value < 1) {
                        return 'Số lượng phải lớn hơn 0';
                      }

                      if (
                        +data.is_review === reviewStatus.NOT_REVIEW && // khôgn check khi đơn đã duyệt
                        value > data.list_product_borrow[index].total_inventory
                      ) {
                        return 'Số lượng không vượt quá tồn';
                      }
                    }

                    return true;
                  },
                }}
                placeholder='Nhập số lượng mượn'
                disabled={disabled}
              />
            </div>
          );
        },
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        styleHeader: { width: '14px' },
      },
      {
        header: 'Tổng tồn',
        classNameHeader: 'bw_text_center',
        accessor: 'total_inventory',
        hidden: +watch('is_review') !== reviewStatus.NOT_REVIEW, // ẩn khi đơn đã duyệt
        classNameBody: 'bw_text_center',
      },
      // {
      //   header: 'Là sản phẩm mới',
      //   classNameBody: 'bw_text_center',
      //   formatter: (_, i) => {
      //     return <FormInput type={'checkbox'} field='search' disabled={disabled} />;
      //   },
      // },
      {
        header: 'Lý do mượn',
        formatter: (_, index) => {
          return (
            <div className='bw_col_12'>
              <FormInput
                className='bw_frm_box'
                field={`list_product_borrow.${index}.reason`}
                style={{ width: '100%' }}
                placeholder='Nhập lý do mượn'
                disabled={disabled}
              />
            </div>
          );
        },
        classNameHeader: 'bw_text_center',
      },
    ],
    [disabled, watch],
  );

  const actions = useMemo(() => {
    if (disabled) return [];

    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: 'SL_BORROWREQUEST_ADD',
        onClick: () => setIsOpenModal(true),
        disabled: !stock_out_id,
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'SL_BORROWREQUEST_DEL',
        onClick: (p, index) => remove(index),
      },
    ];
  }, [remove, disabled, stock_out_id]);

  return (
    <Fragment>
      <BWAccordion style={{ padding: '0 0' }} title={title}>
        <DataTable
          columns={columns}
          data={watch('list_product_borrow')}
          noSelect={true}
          noPaging={true}
          actions={actions}
        />
        {errors['list_product_borrow'] && <ErrorMessage message={errors.list_product_borrow?.root?.message} />}
      </BWAccordion>

      {isOpenModal && <ModalAddProduct setIsOpenModal={setIsOpenModal} stockId={watch('stock_out_id')} />}
    </Fragment>
  );
}

export default BorrowRequestProducts;
