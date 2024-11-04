import React, { useMemo } from 'react';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import ICON_COMMON from 'utils/icons.common';
import { PromotionCodeTypeOptions } from 'pages/DiscountProgram/ultils/constant';

import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormCurrency from 'pages/DiscountProgram/components/shared/FormCurrency';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';

const DiscountProgramDirectDiscount = ({ loading, disabled }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const dispatch = useDispatch();

  const promotion_code_list = watch('promotion_code_list');
  const supplier_promotion_code = watch('supplier_promotion_code');
  const is_apply_direct_discount = watch('is_apply_direct_discount');

  const columns = useMemo(
    () => [
      {
        header: (
          <>
            Mã khuyến mại <span className='bw_red'>*</span>
          </>
        ),
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <FormInput
            field={`promotion_code_list.[${idx}].promotion_code`}
            bordered
            disabled={disabled}
            validation={{ required: 'Mã Khuyến mại là bắt buộc' }}
          />
        ),
      },
      {
        header: (
          <>
            Giá trị <span className='bw_red'>*</span>
          </>
        ),
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <div style={{ display: 'flex' }}>
            <FormCurrency
              fieldType={`promotion_code_list.[${idx}].code_type`}
              fieldValue={`promotion_code_list.[${idx}].code_value`}
              disabled={disabled}
            />
          </div>
        ),
      },
      {
        header: 'Số lượng tối đa',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <FormNumber field={`promotion_code_list.[${idx}].quantity`} bordered disabled={disabled} />
        ),
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm dòng',
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        hidden: disabled,
        onClick: () => {
          let promotion_code_list = _.cloneDeep(methods.watch('promotion_code_list')) || [];
          methods.setValue(
            'promotion_code_list',
            promotion_code_list?.concat({
              coupon_code: '',
              code_value: 0,
              code_type: 1,
            }),
          );
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        onClick: (value, idx) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.coupon_code} khỏi danh sách mã khuyến mại áp dụng ?`], () => {
              let promotion_code_list = _.cloneDeep(methods.watch('promotion_code_list'));
              promotion_code_list?.splice(idx, 1);
              methods.setValue('promotion_code_list', promotion_code_list);
              return;
            }),
          );
        },
      },
    ];
  }, [methods, dispatch, disabled]);

  return (
    <div className='bw_frm_box bw_mt_1 bw_col_12'>
      <FormRadioGroup field='supplier_promotion_code' list={PromotionCodeTypeOptions} />

      {!supplier_promotion_code && (
        <>
          <DataTable
            hiddenActionRow
            noPaging
            noSelect
            loading={loading}
            data={promotion_code_list}
            columns={columns}
            actions={actions}
            validation={{
              validate: (value) => {
                if (is_apply_direct_discount && !promotion_code_list?.length) {
                  return 'Mã khuyến mại mới là bắt buộc';
                }

                return true;
              },
            }}
          />

          <FormInput
            hidden={true}
            disabled={disabled}
            type='text'
            field='check_promotion_code_list'
            style={{ lineHeight: 1, display: 'none' }}
          />
        </>
      )}
    </div>
  );
};

DiscountProgramDirectDiscount.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DiscountProgramDirectDiscount;
