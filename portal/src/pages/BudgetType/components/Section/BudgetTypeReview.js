import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert } from 'antd';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BudgetReviewTable from './BudgetTypeReviewTable';

const BudgetTypeReview = ({ disabled }) => {
  const methods = useFormContext();
  const {
    watch,
    formState: { errors },
  } = methods;

  return (
    <React.Fragment>
      <BWAccordion title='Mức duyệt loại ngân sách' id='bw_confirm'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <label className='bw_checkbox bw_auto_confirm'>
                <FormInput type='checkbox' field='is_auto_review' value={watch('is_auto_review')} disabled={disabled} />
                <span></span>
                Loại ngân sách là tự động duyệt và kiểm soát sau
              </label>
            </div>
          </div>
        </div>

        {!watch('is_auto_review') ? <BudgetReviewTable disabled={disabled} /> : null}
      </BWAccordion>
    </React.Fragment>
  );
};

export default BudgetTypeReview;
