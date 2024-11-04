import React, { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import FormInput from '../BWFormControl/FormInput';
import FormItem from '../BWFormControl/FormItem';
import FormDatePicker from '../BWFormControl/FormDate';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import ZaloOAService from 'services/zalo-oa.service.';
import { getOptionSelected, mapDataOptions } from 'utils/helpers';
import FormSelect from '../BWFormControl/FormSelect';
import { compliedSMSTemplate } from './utils';
import FormTextArea from '../BWFormControl/FormTextArea';
import WrapUnregister from './WrapUnregister';

export const ZALO_TYPE_SEND = {
  SEND_SMS: 'SEND_SMS',
  SEND_ZNS: 'SEND_ZNS',
  SEND_ZNS_ZALO_PAY_SHOPDUNK: 'SEND_ZNS_ZALO_PAY_SHOPDUNK',
  SEND_ZNS_ZALO_PAY_SAMCENTER: 'SEND_ZNS_ZALO_PAY_SAMCENTER',
};

function FormZalo({ customer, methods }) {
  const zaloTemplateOptions = useGetOptions(optionType.zaloTemplate);

  const [znsTemplateOptions, setZnsTemplateOptions] = useState([]);
  const detailZNS = methods.watch('detail_zns');
  const zalo_type_send = methods.watch('zalo_type_send');

  useEffect(() => {
    methods.reset({ zalo_type_send: ZALO_TYPE_SEND.SEND_SMS });
  }, []);
  useEffect(() => {
    if (zalo_type_send === ZALO_TYPE_SEND.SEND_SMS) {
      methods.setValue('detail_zns', {});
      ZaloOAService.getListTemplate().then((res) => {
        setZnsTemplateOptions(
          mapDataOptions(res, { valueName: 'templateId', labelName: 'templateName', valueAsString: true }),
        );
      });
    }
    if (zalo_type_send === ZALO_TYPE_SEND.SEND_ZNS) {
      methods.unregister('zalo_sms_template');
      methods.unregister('zalo_sms_content');
    }
  }, [zalo_type_send]);
  useEffect(() => {
    if (detailZNS?.listParams?.length) {
      const listParamsKeys = Object.keys(detailZNS.listParams);
      if (listParamsKeys.indexOf('name') && customer?.full_name) {
        methods.setValue('name', customer.full_name);
      }
      if (listParamsKeys.indexOf('birthday') && customer?.birthday) {
        methods.setValue('birthday', customer.birthday);
      }
      if (listParamsKeys.indexOf('phone_number') && customer?.phone_number) {
        methods.setValue('phone_number', customer.phone_number);
      }
      if (listParamsKeys.indexOf('email') && customer?.email) {
        methods.setValue('email', customer.email);
      }
    }
  }, [detailZNS]);

  const renderSendSMS = () => {
    return (
      <>
        <FormItem label='Mẫu gửi' style='gray' isRequired={true}>
          <FormSelect
            field='zalo_sms_template'
            list={zaloTemplateOptions}
            onChange={(value) => {
              methods.clearErrors('zalo_sms_template');
              methods.setValue('zalo_sms_template', value);
              const zaloTemplate = getOptionSelected(zaloTemplateOptions, value);

              const zalo_sms_content = compliedSMSTemplate(zaloTemplate?.zalo_template, customer || {});
              methods.setValue('zalo_sms_content', zalo_sms_content);
            }}
            validation={{ required: 'Mẫu gửi là bắt buộc' }}
          />
        </FormItem>
        <FormItem label='Nội dung' style='gray' isRequired={true}>
          <FormTextArea
            field='zalo_sms_content'
            placeholder='Nội dung tin nhắn'
            rows={5}
            validation={{ required: 'Mẫu gửi là bắt buộc' }}
          />
        </FormItem>
      </>
    );
  };

  const renderSendZNS = () => {
    return (
      <>
        <FormItem label='Mẫu gửi' style='gray' isRequired={true}>
          <FormSelect
            field='zalo_zns_template'
            list={znsTemplateOptions}
            onChange={(value) => {
              methods.clearErrors('zalo_zns_template');
              methods.setValue('zalo_zns_template', value);
              ZaloOAService.getTemplateById({ template_id: value }).then((res) => {
                methods.setValue('detail_zns', res);
              });
            }}
            validation={{ required: 'Mẫu gửi là bắt buộc' }}
          />
        </FormItem>
        {detailZNS?.previewUrl && (
          <FormItem label='Bản xem trước của template' style='gray'>
            <a href={detailZNS?.previewUrl} target='_blank' rel='noreferrer'>
              {detailZNS?.previewUrl}
            </a>
          </FormItem>
        )}
        {detailZNS?.listParams?.length > 0 &&
          detailZNS.listParams.map((param, index) => {
            if (param.type === 'DATE') {
              return (
                <FormItem label={param.name || 'Nhập giá trị'} style='gray' key={index} isRequired={true}>
                  <WrapUnregister field={param.name}>
                    <FormDatePicker
                      field={param.name}
                      placeholder={'dd/mm/yyyy'}
                      style={{ width: '100%' }}
                      format='DD/MM/YYYY'
                      bordered={false}
                      validation={{ required: `${param.name} là bắt buộc` }}
                    />
                  </WrapUnregister>
                </FormItem>
              );
            }
            return (
              <FormItem label={param.name || 'Nhập giá trị'} style='gray' key={index} isRequired={true}>
                <WrapUnregister field={param.name}>
                  <FormInput
                    field={param.name}
                    placeholder={`Nhập ${param.name}`}
                    validation={{ required: `${param.name} là bắt buộc` }}
                  />
                </WrapUnregister>
              </FormItem>
            );
          })}
      </>
    );
  };

  return (
    <FormProvider {...methods}>
      <form>
        <FormItem label='Loại gửi' style='gray'>
          <FormSelect
            field='zalo_type_send'
            list={[
              { value: 'SEND_SMS', label: 'Gửi tin nhắn Zalo' },
              { value: 'SEND_ZNS', label: 'Gửi thông báo ZNS' },
            ]}
          />
        </FormItem>
        {methods.watch('zalo_type_send') === 'SEND_SMS' && renderSendSMS()}
        {methods.watch('zalo_type_send') === 'SEND_ZNS' && renderSendZNS()}
      </form>
    </FormProvider>
  );
}

export default FormZalo;
