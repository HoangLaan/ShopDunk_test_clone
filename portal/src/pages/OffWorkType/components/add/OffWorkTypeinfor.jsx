import React from 'react';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { msgError } from 'pages/OffWorkType/helpers/msgError';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const OffWorkTypeinfor = ({ id, title, disabled, companyOpts = [] }) => {
  const methods = useFormContext();

  const ASK_TYPE = [
    { value: 0, label: 'Không', key: 'is_sub_time_off' },
    { value: 1, label: 'Có', key: 'is_sub_time_off' },
  ];

  return (
    <React.Fragment>
      <BWAccordion title={title} id={id}>
        <div className='bw_row'>
          <div className='bw_row'>
            <FormItem label='Tên loại phép' className='bw_col_4' isRequired={true} disabled={disabled}>
              <FormInput
                type='text'
                field='off_work_name'
                placeholder='Tên loại phép'
                validation={msgError['off_work_name']}
              />
            </FormItem>
            <FormItem label='Số ngày nghỉ tối đa' className='bw_col_4' disabled={disabled}>
              <FormInput
                type='number'
                field='max_day_off'
                placeholder='Số ngày nghỉ tối đa'
                validation={msgError['max_day_off']}
              />
            </FormItem>

            <FormItem label='Đăng ký trước' className='bw_col_4' isRequired={true} disabled={disabled}>
              <FormNumber field='before_day' placeholder='Đăng ký trước' validation={msgError['before_day']} />
              <span style={{ fontSize: 11, marginTop: 8 }}>
                Muốn đăng ký phép trước ngày hiện tại vui lòng để số âm (ví dụ: -5 thì sẽ được đăng ký trước ngày hiện
                tại 5 ngày)
              </span>
            </FormItem>
            <FormItem label='Công ty áp dụng' className='bw_col_6' isRequired={true} disabled={disabled}>
              <FormSelect
                field='company_id'
                id='company_id'
                list={companyOpts}
                allowClear={true}
                validation={msgError['company_id']}
              />
            </FormItem>
            <div className='bw_col_4'>
              <div className='bw_frm_box'>
                <label>
                  Trừ phép <span className='bw_red'>*</span>
                </label>
                <FormRadioGroup field='is_sub_time_off' list={ASK_TYPE} disabled={disabled} />
              </div>
            </div>
            <FormItem label='Mô tả' className='bw_col_12' disabled={disabled}>
              <FormInput type='textarea' field='description' placeholder='Nhập mô tả' />
            </FormItem>
          </div>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default OffWorkTypeinfor;
