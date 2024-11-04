import React from 'react';

import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { RulePrice } from 'pages/InstallmentForm/utils/validate';
import { useState } from 'react';

const ApplyForOrder = ({ disabled }) => {
  return (
    <div style={{ width: '100%' }}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <div style={{ marginLeft: '26px', height: '100%' }} className='bw_flex bw_align_items_center'>
            Giá trị đơn hàng nằm trong khoảng
          </div>
        </div>
        <div className='bw_col_6'>
          <div className='bw_row'>
            <div className='bw_col_5'>
              <FormNumber
                disabled={disabled}
                validation={RulePrice}
                field={'order_price_from'}
                addonAfter='VND'
                bordered
              />
            </div>
            <div className='bw_col_2 bw_text_center bw_flex bw_align_items_center bw_justify_content_center'>
              <span> đến </span>
            </div>
            <div className='bw_col_5'>
              <FormNumber
                disabled={disabled}
                field={'order_price_to'}
                validation={RulePrice}
                addonAfter='VND'
                bordered
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForOrder;
