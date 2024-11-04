import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { TABS } from './CustomerCare';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWButton from 'components/shared/BWButton/index';
import { mapDataOptions4SelectCustom, openInNewTab } from 'utils/helpers';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOptionsGlobal } from 'actions/global';
import { useFormContext } from 'react-hook-form';

import { getSender } from 'services/email-marketing.service';

function CustomerCareEmail({ currTab, customerEmail, taskDetailId, memberId, dataLeadsId }) {
  const dispatch = useDispatch();
  const methods = useFormContext();

  const emailTemplateData = useSelector((state) => state.global.emailTemplateData);

  useEffect(() => {
    dispatch(getOptionsGlobal('emailTemplate'));
    methods.setValue('mail_to', customerEmail);
    methods.setValue('task_detail_id', taskDetailId);
    methods.setValue('member_id', memberId);
    methods.setValue('dataleads_id', dataLeadsId);
    methods.setValue('subject', 'Gửi mail chăm sóc khách hàng');
    methods.setValue('mail_supplier', 1);

    getSender().then((data) => {
      if (data && data.length > 0) {
        const address = data[0]?.address;
        methods.setValue('mail_from', address);
        methods.setValue('mail_reply', address);
      }
    });

    return () => {
      methods.unregister('mail_supplier');
      methods.unregister('subject');
      methods.unregister('mail_from');
      methods.unregister('mail_to');
      methods.unregister('mail_from_name');
      methods.unregister('mail_reply');
      methods.unregister('email_template_id');
      methods.unregister('send_schedule');
    }
  }, []);

  const isValidate = currTab === TABS.EMAIL.value ? null : {};

  return (
    <div className='bw_tab_items bw_active'>
      <FormItem className='bw_col_12' label='Nhà cung cấp' isRequired>
        <FormSelect
          field='mail_supplier'
          placeholder='Chọn nhà cung cấp'
          defaultValue={1}
          list={[
            {
              label: 'Mailchimp',
              value: 1,
            },
          ]}
          validation={
            isValidate ?? {
              required: 'Nhà cung cấp không được để trống',
            }
          }
        />
      </FormItem>
      <FormItem className='bw_col_12' label='Chủ đề mail' isRequired>
        <FormInput
          type='text'
          field='subject'
          placeholder='Nhập chủ đề mail'
          validation={
            isValidate ?? {
              required: 'Chủ đề mail không được để trống',
            }
          }
        />
      </FormItem>
      <FormItem className='bw_col_12' label='Email người gửi' isRequired>
        <FormInput
          type='text'
          field='mail_from'
          placeholder='Gửi mail từ'
          validation={
            isValidate ?? {
              required: 'Gửi mail từ không được để trống',
            }
          }
        />
      </FormItem>
      <FormItem className='bw_col_12' label='Email người nhận' isRequired>
        <FormInput
          type='text'
          field='mail_to'
          placeholder='Mail người nhận'
          validation={
            isValidate ?? {
              required: 'Mail người nhận là bắt buộc',
            }
          }
        />
      </FormItem>
      <FormItem className='bw_col_12' label='Tên hiển thị'>
        <FormInput type='text' field='mail_from_name' placeholder='Nhập tên hiển thị' />
      </FormItem>
      <FormItem className='bw_col_12' label='Phản hồi tới'>
        <FormInput type='text' field='mail_reply' placeholder='Nhập mail phản hổi' />
      </FormItem>
      <FormItem className='bw_col_12' label='Mẫu gửi' isRequired>
        <FormSelect
          field='email_template_id'
          placeholder='Mẫu gửi mail'
          list={mapDataOptions4SelectCustom(emailTemplateData)}
          validation={
            isValidate ?? {
              required: 'Mẫu gửi mail không được để trống',
            }
          }
        />
      </FormItem>
      <FormItem className='bw_col_12' label='Gửi theo lịch'>
        <FormDatePicker
          field='send_schedule'
          showTime
          placeholder={'hh:mm A DD/MM/YYYY'}
          style={{
            width: '100%',
          }}
          format={'hh:mm A DD/MM/YYYY'}
          bordered={false}
          allowClear
        />
      </FormItem>
      <FormItem className='bw_col_12'>
        <BWButton
          type='success'
          icon='fi fi-rr-add'
          content='Tạo mẫu gửi'
          onClick={() => {
            openInNewTab(`/email-template/add`);
          }}
        />
      </FormItem>
    </div>
  );
}

export default CustomerCareEmail;
