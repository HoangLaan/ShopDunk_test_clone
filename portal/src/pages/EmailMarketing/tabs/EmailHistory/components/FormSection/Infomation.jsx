import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { LIST_TYPE, MAIL_STATUS } from 'pages/EmailMarketing/utils/constants';
import { useFormContext } from 'react-hook-form';
import FormEditor from 'components/shared/BWFormControl/FormEditor';

const EmailHistoryInfo = ({ disabled, title, id }) => {
  const methods = useFormContext();

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_6'>
          <FormItem label='Mail gửi' isRequired disabled>
            <FormInput
              type='text'
              field='email_from'
              placeholder='Thông tin mail gửi'
              validation={{
                required: 'Mail gửi là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem label='Mail nhận' isRequired disabled>
            <FormInput
              type='text'
              field='email_to'
              placeholder='Thông tin mail nhận'
              validation={{
                required: 'Mail nhận là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div class='bw_col_12'>
          <FormItem label='Tiêu đề gửi' isRequired disabled>
            <FormInput
              type='text'
              field='subject'
              placeholder='Tiêu đề gửi là bắt buộc'
              validation={{
                required: 'Tiêu đề gửi mail là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem label='Nhà cung cấp' isRequired disabled>
            <FormInput
              type='text'
              field='email_from'
              placeholder='Thông tin mail gửi'
              validation={{
                required: 'Mail gửi là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem label='Thời gian gửi' isRequired disabled>
            <FormInput type='text' field='send_time' />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem label='Trạng thái gửi' isRequired disabled={disabled}>
            <FormSelect
              field='status'
              placeholder='Chọn'
              list={MAIL_STATUS}
              validation={{
                required: 'Trạng thái gửi là bắt buộc',
              }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default EmailHistoryInfo;
