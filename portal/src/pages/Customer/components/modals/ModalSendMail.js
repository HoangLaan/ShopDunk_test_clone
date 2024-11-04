import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import omit from 'lodash/omit'

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWButton from 'components/shared/BWButton/index';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

import { sentOneMail, getSender } from 'services/email-marketing.service';
import { mapDataOptions4SelectCustom, openInNewTab, showToast } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';

function ModalSendMail({ onClose, selectedCustomer }) {
  const dispatch = useDispatch();
  const emailTemplateData = useSelector((state) => state.global.emailTemplateData);

  const [loading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues: {
      mail_supplier: 1,
      mail_type: 1, // 1 gửi thường , 2 gửi theo lịch
      customer_list: selectedCustomer,
    },
  });

  useEffect(() => {
    dispatch(getOptionsGlobal('emailTemplate'));
    dispatch(getOptionsGlobal('emailList'));
    getSender().then((data) => {
      if (data && data.length > 0) {
        const address = data[0]?.address;
        methods.setValue('mail_from', address);
        methods.setValue('mail_reply', address);
      }
    });
  }, []);

  const sendMail = async (data) => {
    if (!selectedCustomer?.length) return;
    let errorCount = 0;
    for (let i = 0; i < selectedCustomer.length; i++) {
      try {
        const { data_leads_id, member_id, email, customer_code, data_leads_code } = selectedCustomer[i];
        if ((!member_id && !data_leads_id) || !email) {
          throw new Error('Thiếu thông tin để send mail');
        }
        await sentOneMail({
          ...omit(data, 'customer_list'),
          data_leads_id,
          member_id,
          mail_to: email,
          task_detail_id: -1,
          subject: data?.mail_subject,
          customer_code: customer_code || data_leads_code,
          data_leads_code,
        });
      } catch (error) {
        errorCount++;
      }
    }
    showToast.success(`Gửi email thành công: ${selectedCustomer.length - errorCount}/${selectedCustomer.length} khách hàng`);
    setLoading(false);
    onClose()
  };

  return (
    <ModalPortal
      title='Gửi Email'
      onClose={onClose}
      confirmText='Gửi Email'
      onConfirm={methods.handleSubmit(sendMail)}
      loading={loading}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(sendMail)}>
          <div className='bw_main_modal'>
            <FormItem className='bw_col_12' label='Nhà cung cấp' isRequired style="gray">
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
                validation={{
                  required: 'Nhà cung cấp không được để trống',
                }}
              />
            </FormItem>
            <FormItem className='bw_col_12' label='Chủ đề mail' isRequired style="gray">
              <FormInput
                type='text'
                field='mail_subject'
                placeholder='Nhập chủ đề mail'
                validation={{
                  required: 'Chủ đề mail không được để trống',
                }}
              />
            </FormItem>
            <FormItem className='bw_col_12' label='Email người gửi' isRequired style="gray">
              <FormInput
                type='text'
                field='mail_from'
                placeholder='Gửi mail từ'
                validation={{
                  required: 'Gửi mail từ không được để trống',
                }}
              />
            </FormItem>
            <FormItem className='bw_col_12' label='Tên hiển thị' style="gray">
              <FormInput type='text' field='mail_from_name' placeholder='Nhập tên hiển thị' />
            </FormItem>
            <FormItem className='bw_col_12' label='Phản hồi tới' style="gray">
              <FormInput type='text' field='mail_reply' placeholder='Nhập mail phản hổi' />
            </FormItem>
            <FormItem className='bw_col_12' label='Mẫu gửi' isRequired style="gray">
              <FormSelect
                field='email_template_id'
                placeholder='Mẫu gửi mail'
                list={mapDataOptions4SelectCustom(emailTemplateData)}
                validation={{
                  required: 'Mẫu gửi mail không được để trống',
                }}
              />
            </FormItem>
            <FormItem className='bw_col_12' label='Gửi theo lịch' style="gray">
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
            <FormItem className='bw_col_12' style="gray">
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
        </form>
      </FormProvider>
    </ModalPortal>
  );
}

export default ModalSendMail;
