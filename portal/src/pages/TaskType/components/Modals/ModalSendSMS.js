import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useState } from 'react';
import { useEffect } from 'react';
import { getBrandnameOptions, getSmsTemplateOptions } from 'services/task.service';
import { mapDataOptions, mapDataOptions4Select } from 'utils/helpers';
// import useDetectHookFormChange from 'hooks/useDetectHookFormChange';
import useIsMount from 'hooks/useIsMount';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { SMS_TEMPLATE_FIELDS } from 'pages/TaskType/utils/constants';
import FormTimePicker from 'components/shared/BWFormControl/FormTime';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

function ModalSendSMS({ onClose, taskWorkflowList, onConfirm, onReject, modalSendSMSData }) {
  const methods = useForm();

  const taskWorkflowOptions = mapDataOptions(taskWorkflowList, {
    valueName: 'task_work_flow_id',
    labelName: 'work_flow_name',
  });

  const content_template = methods.watch('content_template') || '';

  const [brandnameOptions, setBrandnameOptions] = useState([]);
  const [smsTemplateOptions, setSmsTemplateOptions] = useState([]);

  useEffect(() => {
    getBrandnameOptions().then((res) => {
      setBrandnameOptions(mapDataOptions4Select(res));
    });
    methods.reset(modalSendSMSData);
  }, []);

  const brandname = methods.watch('brandname');
  useEffect(() => {
    if (brandname) {
      getSmsTemplateOptions({ brandname }).then((res) => {
        setSmsTemplateOptions(mapDataOptions4Select(res));
      });
    }
  }, [brandname]);

  // useDetectHookFormChange(methods);
  // console.log('Modal Send SMS', methods.watch())

  const regexp = /\{(.+?)\,(\d*)\}/g;
  const arrayRegex = useMemo(() => [...content_template.matchAll(regexp)], [content_template]);

  const render_sms = () => {
    return arrayRegex.map((o, i) => (
      <div className='bw_row' key={i}>
        <FormItem label='Loại' className='bw_col_4' style='gray'>
          <FormSelect
            field={`message_type_${o?.index}`}
            list={[
              { label: 'Nhập nội dung', value: 1 },
              { label: 'Theo dữ liệu', value: 2 },
            ]}
            defaultValue={1}
          />
        </FormItem>
        <FormItem className='bw_col_8' label={'Nội dung ' + (i + 1)} style='gray' key={i}>
          {methods.watch(`message_type_${o?.index}`) === 2 ? (
            <FormSelect
              field={`message_${o?.index}`}
              list={SMS_TEMPLATE_FIELDS}
              validation={{
                required: 'Nội dung là bắt buộc',
              }}
            />
          ) : (
            <FormInput field={`message_${o?.index}`} />
          )}
        </FormItem>
      </div>
    ));
  };

  const messageContent = content_template.replace(regexp, (value, __, ___, index) => {
    let content = methods.watch(`message_${index}`);
    if (content === '') {
      content = undefined;
    }
    return content ?? value;
  });

  const isMounted = useIsMount();

  useEffect(() => {
    if (!isMounted) {
      methods.setValue('content_sms', messageContent);
    }
  }, [messageContent]);

  return (
    <ModalPortal
      title='Thông tin gửi SMS'
      onClose={onClose}
      onReject={onReject}
      onConfirm={methods.handleSubmit(onConfirm)}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onConfirm)}>
          <FormItem className='bw_col_12' label='Chọn bước gửi SMS' style='gray' disabled={true}>
            <FormSelect
              list={taskWorkflowOptions}
              field='task_work_flow_id'
              disabled={true}
            />
          </FormItem>
          <FormItem className='bw_col_12' label='Brandname' style='gray' isRequired={true}>
            <FormSelect list={brandnameOptions} field='brandname' validation={{ required: 'Brandname là bắt buộc' }} />
          </FormItem>
          <FormItem className='bw_col_12' label='Nội dung mẫu' disabled={!brandname} style='gray'>
            <FormSelect
              list={smsTemplateOptions}
              field='sms_template_id'
              validation={{ required: 'Nội dung mẫu là bắt buộc' }}
              onChange={(value) => {
                methods.clearErrors('sms_template_id');
                methods.setValue('sms_template_id', value);
                const contentTemplate = smsTemplateOptions.find((e) => e.value === value).label;
                methods.setValue('content_template', contentTemplate);
              }}
            />
          </FormItem>
          {render_sms()}
          <FormItem disabled className='bw_col_12' label='Nội dung tin nhắn' style='gray'>
            <span id='content_sms_brand' value={methods.watch('content_sms')}>
              {methods.watch('content_sms')}
            </span>
          </FormItem>
          <div className='bw_row'>
            <FormItem className='bw_col_4' label='Giờ gửi' style='gray'>
              <FormTimePicker
                field='send_schedule_time'
                type='time'
                format='HH:mm'
                placeholder='Chọn giờ'
                bordered={false}
                style={{ width: '100%' }}
                allowClear
              />
            </FormItem>
            <FormItem className='bw_col_8' label='Gửi sau' style='gray'>
              <FormNumber field='send_schedule_after_days' min={0} addonAfter='ngày' allowClear  />
            </FormItem>
          </div>
        </form>
      </FormProvider>
    </ModalPortal>
  );
}

export default ModalSendSMS;
