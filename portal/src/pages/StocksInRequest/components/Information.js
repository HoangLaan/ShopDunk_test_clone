import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { stockInStatusOption } from 'utils/helpers';
import { reviewStatusOption } from './utils/constants';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

function Information({ disabled }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  return (
    <BWAccordion title='Thông tin phiếu nhập kho' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Số phiếu nhập' className='bw_col_4' disabled>
          <FormInput type='text' field='stocks_in_code' disabled />
        </FormItem>
        <FormItem label='Ngày tạo' className='bw_col_4' disabled>
          <FormInput type='text' field='created_date' disabled />
        </FormItem>
        <FormItem label='Trạng thái duyệt' className='bw_col_4' disabled>
          <FormSelect field='status_reviewed' list={reviewStatusOption} disabled />
        </FormItem>
        <FormItem label='Trạng thái nhập' className='bw_col_4' disabled>
          <FormSelect field='is_imported' list={stockInStatusOption} disabled />
        </FormItem>
        <FormItem label='Người tạo' className='bw_col_4' disabled>
          <FormInput type='text' field='created_user' disabled />
        </FormItem>
      </div>
    </BWAccordion>
  );
}

export default Information;
