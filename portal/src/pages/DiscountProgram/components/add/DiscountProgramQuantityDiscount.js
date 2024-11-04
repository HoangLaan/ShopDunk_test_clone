import React, { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import FormCurrency from 'pages/DiscountProgram/components/shared/FormCurrency';
import { CurrencyType } from 'pages/DiscountProgram/ultils/constant';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const DiscountProgramQuantityDiscount = ({ loading, disabled }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const product_list = watch('product_list');
  const discount_product_list = watch('discount_product_list');
  const is_apply_quantity_discount = watch('is_apply_quantity_discount');

  useEffect(() => {
    setValue(
      'discount_product_list',
      product_list?.map((o) => ({
        ...o,
        number_of_product: o.number_of_product || 0,
        value: o.value || 0,
        value_type: o.value_type || CurrencyType.MONEY,
      })),
    );
  }, [setValue, product_list]);

  const columns = useMemo(
    () => [
      {
        header: 'Sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_name}</b>,
      },
      {
        header: 'Điều kiện số lượng sản phẩm tối thiểu cần bán ra',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <FormNumber
            field={`discount_product_list.[${idx}].number_of_product`}
            validation={{
              required: 'Số lượng là bắt buộc',
              min: {
                value: 0.00000001,
                message: 'Giá trị phải lớn hơn 0',
              },
            }}
            bordered
            disabled={disabled}
          />
        ),
      },
      {
        header: 'Giá trị chiết khấu được hưởng/Số lượng sản phẩm bán',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <FormCurrency
            fieldValue={`discount_product_list.[${idx}].value`}
            fieldType={`discount_product_list.[${idx}].value_type`}
            disabled={disabled}
          />
        ),
      },
    ],
    [disabled],
  );

  // const actions = useMemo(() => {
  //   return [
  //     {
  //       icon: ICON_COMMON.trash,
  //       color: 'red',
  //       hidden: disabled,
  //       permission: 'PO_DISCOUNT_PROGRAM_ADD',
  //       onClick: (value) => {
  //         dispatch(
  //           showConfirmModal(
  //             [`Xoá ${value?.product_name} khỏi danh sách chiết khấu theo thời gian và số lượng ?`],
  //             () => {
  //               let discount_product_list = _.cloneDeep(methods.watch('discount_product_list'));
  //               methods.setValue(
  //                 'discount_product_list',
  //                 discount_product_list.filter((o) => parseInt(o?.product_id) !== parseInt(value?.product_id)),
  //               );
  //               return;
  //             },
  //           ),
  //         );
  //       },
  //     },
  //   ];
  // }, [methods, dispatch, disabled]);

  return (
    <div className='bw_frm_box bw_mt_1 bw_col_12'>
      <DataTable
        hiddenActionRow
        noPaging
        noSelect
        loading={loading}
        data={discount_product_list}
        columns={columns}
        // actions={actions}
      />
      <FormInput
        hidden={true}
        disabled={disabled}
        type='text'
        field='check_discount_product_list'
        style={{ lineHeight: 1, display: 'none' }}
        validation={{
          validate: (value) => {
            if (is_apply_quantity_discount && !discount_product_list?.length) {
              return 'Chương trình thu cũ đổi mới là bắt buộc';
            }

            return true;
          },
        }}
      />
    </div>
  );
};

DiscountProgramQuantityDiscount.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DiscountProgramQuantityDiscount;
