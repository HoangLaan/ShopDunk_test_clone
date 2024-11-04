import React from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import CategoryList from './AttachmentList';
import ProductList from './ProductList';
import { useFormContext } from 'react-hook-form';

const ApplyForProduct = ({ disabled }) => {
  const methods = useFormContext();

  return (
    <div style={{ width: '100%', padding: '0 5px' }}>
      <div className='bw_row'>
        <div class='bw_col_12' style={{ marginLeft: '20px' }}>
          <label className='bw_checkbox' style={{ width: 'fit-content' }}>
            <FormInput type='checkbox' field='is_apply_all_category' disabled={disabled} />
            <span />
            Áp dụng cho tất cả ngành hàng
          </label>
        </div>
        {!methods.watch('is_apply_all_category') ? (
          <div className='bw_col_12'>
            <CategoryList disabled={disabled} />
            <ProductList disabled={disabled} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ApplyForProduct;
