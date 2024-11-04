import React, { useCallback, useEffect, useMemo, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import AWCustomerTypeTable from './apply-with/customer-type/AWCustomerTypeTable';
import AWCategoryTable from './apply-with/category/AWCategoryTable';
import { useFormContext } from 'react-hook-form';

const ApplyWith = ({ disabled, title, isSubmit, listCategoryEdit, listProductEdit }) => {
  const { watch } = useFormContext();
  const isApplyAllCategory = watch('is_apply_all_category') === 1;
  const isApplyAllCustomerType = watch('is_apply_all_customer_type') === 1;

  return (
    <BWAccordion title={title}>
      <div style={{ marginBottom: '1em' }} className='bw_row'>
        <div className='bw_col_12'>
          <label className='bw_checkbox'>
            <FormInput disabled={disabled} type='checkbox' field='is_apply_all_customer_type' />
            <span />
            Áp dụng với tất cả các hạng khách hàng
          </label>
        </div>
        <div className='bw_col_12'>
          {!isApplyAllCustomerType && <AWCustomerTypeTable isSubmit={isSubmit} disabled={disabled} />}
        </div>
      </div>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <label className='bw_checkbox'>
            <FormInput disabled={disabled} type='checkbox' field='is_apply_all_category' />
            <span />
            Áp dụng với tất cả các ngành hàng
          </label>
        </div>
        <div className='bw_col_12'>
          {!isApplyAllCategory && (
            <AWCategoryTable
              listCategoryEdit={listCategoryEdit}
              listProductEdit={listProductEdit}
              isSubmit={isSubmit}
              disabled={disabled}
            />
          )}
        </div>
      </div>
    </BWAccordion>
  );
};
export default ApplyWith;
