import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWButton from 'components/shared/BWButton/index';

import { getSender } from 'services/email-marketing.service';
import { mapDataOptions, mapDataOptions4SelectCustom, openInNewTab } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import FormTimePicker from 'components/shared/BWFormControl/FormTime';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

function ModalSendEmail({ onClose, onConfirm, onReject, taskWorkflowList, modalSendEmailData }) {
  const dispatch = useDispatch();
  const emailTemplateData = useSelector((state) => state.global.emailTemplateData);

  const methods = useForm();

  const taskWorkflowOptions = mapDataOptions(taskWorkflowList, {
    valueName: 'task_work_flow_id',
    labelName: 'work_flow_name',
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
    methods.reset({
      mail_supplier_id: 1,
      mail_type: 1, // 1 gửi thường , 2 gửi theo lịch
      ...modalSendEmailData,
    });
  }, []);

  return (
    <ModalPortal
      title='Thông tin gửi Email'
      onClose={onClose}
      confirmText='Xác nhận'
      onConfirm={methods.handleSubmit(onConfirm)}
      onReject={onReject}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onConfirm)}>
          <div className='bw_main_modal'>
            <FormItem className='bw_col_12' label='Bước gửi Email' style='gray' disabled={true}>
              <FormSelect list={taskWorkflowOptions} field='task_work_flow_id' disabled={true} />
            </FormItem>
            <FormItem className='bw_col_12' label='Nhà cung cấp' isRequired style='gray'>
              <FormSelect
                field='mail_supplier_id'
                placeholder='Chọn nhà cung cấp'
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
            <FormItem className='bw_col_12' label='Chủ đề mail' isRequired style='gray'>
              <FormInput
                type='text'
                field='mail_subject'
                placeholder='Nhập chủ đề mail'
                validation={{
                  required: 'Chủ đề mail không được để trống',
                }}
              />
            </FormItem>
            <FormItem className='bw_col_12' label='Email người gửi' isRequired style='gray'>
              <FormInput
                type='text'
                field='mail_from'
                placeholder='Gửi mail từ'
                validation={{
                  required: 'Gửi mail từ không được để trống',
                }}
              />
            </FormItem>
            <FormItem className='bw_col_12' label='Tên hiển thị' style='gray'>
              <FormInput type='text' field='mail_from_name' placeholder='Nhập tên hiển thị' />
            </FormItem>
            <FormItem className='bw_col_12' label='Phản hồi tới' style='gray'>
              <FormInput type='text' field='mail_reply' placeholder='Nhập mail phản hổi' />
            </FormItem>
            <FormItem className='bw_col_12' label='Mẫu gửi' isRequired style='gray'>
              <FormSelect
                field='email_template_id'
                placeholder='Mẫu gửi mail'
                list={mapDataOptions4SelectCustom(emailTemplateData)}
                validation={{
                  required: 'Mẫu gửi mail không được để trống',
                }}
              />
            </FormItem>
            <div className='bw_row'>
              <FormItem className='bw_col_4' label='Giờ gửi' style='gray'>
                <FormTimePicker
                  key={methods.watch('send_schedule_time')}
                  field='send_schedule_time'
                  format='HH:mm'
                  placeholder='Chọn giờ'
                  bordered={false}
                  style={{ width: '100%' }}
                  allowClear
                />
              </FormItem>
              <FormItem className='bw_col_8' label='Gửi sau' style='gray'>
                <FormNumber field='send_schedule_after_days' min={0} addonAfter='ngày' allowClear />
              </FormItem>
            </div>
            <FormItem className='bw_col_12' style='gray'>
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

export default ModalSendEmail;
