import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FIELD_STOCKSTAKEREQUEST } from 'pages/StocksTakeRequest/utils/constants';
import { reviewTypes } from 'pages/StocksTakeRequest/utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';

const StocksTakeRequestCommon = ({ title, disabled, isAdd }) => {
  const methods = useFormContext();
  const is_reviewed = methods.watch('is_reviewed');

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <FormItem disabled label='Số phiếu kiểm kê'>
              <FormInput
                type='text'
                disabled={disabled}
                field={FIELD_STOCKSTAKEREQUEST.stocks_take_request_code}
                placeholder='Số phiếu kiểm kê'
                validation={{
                  required: 'Số phiếu kiểm kê là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled label='Ngày tạo'>
              <FormInput
                disabled={disabled}
                type='text'
                field={FIELD_STOCKSTAKEREQUEST.stocks_take_request_date}
                placeholder='Ngày tạo'
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled label='Trạng thái kiểm kê'>
              <FormInput value={isAdd ? 'Tạo mới' : reviewTypes[is_reviewed]?.label} />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled label='Người tạo'>
              <FormInput field='created_user' />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default StocksTakeRequestCommon;
