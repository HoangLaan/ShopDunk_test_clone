import React, { useEffect } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { useSelector, useDispatch } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';

const AccountingPeriodInfo = ({ disabled, title, id }) => {
  const dispatch = useDispatch();
  const { companyData } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(getOptionsGlobal('company'));
  }, []);
  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_6'>
          <FormItem label='Tên kỳ kế toán' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='accounting_period_name'
              placeholder='Nhập tên kỳ kế toán'
              validation={{
                required: 'Tên kỳ kế toán là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div class='bw_col_6'>
          <FormItem label='Công ty' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              placeholder='Chọn'
              list={mapDataOptions4SelectCustom(companyData)}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div class='bw_col_6'>
          <FormItem label='Ngày bắt đầu - kết thúc' isRequired disabled={disabled}>
            <FormDateRange
              allowClear={true}
              fieldStart={'apply_from_date'}
              fieldEnd={'apply_to_date'}
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'DD/MM/YYYY'}
              validation={{
                required: 'Ngày áp dụng là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea field='description' rows={2} placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default AccountingPeriodInfo;
