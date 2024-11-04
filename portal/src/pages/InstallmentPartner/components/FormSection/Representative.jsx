import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { VocativeOptions } from 'pages/InstallmentPartner/utils/constant';

const RepresentativeInfo = ({ disabled, title, id }) => {
  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_6'>
          <FormItem label='Họ và tên' disabled={disabled}>
            <div className='bw_row'>
              <div className='bw_col_3'>
                <FormSelect bordered field='contact_vocative' placeholder='Chọn' list={VocativeOptions} />
              </div>
              <div className='bw_col_9'>
                <FormInput field='contact_name' placeholder='Nhập họ tên' />
              </div>
            </div>
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div class='bw_col_6'>
              <FormItem label='Chức vụ' disabled={disabled}>
                <FormInput field='contact_position' placeholder='Nhập chức vụ' />
              </FormItem>
            </div>
            <div class='bw_col_6'>
              <FormItem label='Số điện thoại' disabled={disabled}>
                <FormInput field='contact_phone' placeholder='Nhập số điện thoại' />
              </FormItem>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default RepresentativeInfo;
