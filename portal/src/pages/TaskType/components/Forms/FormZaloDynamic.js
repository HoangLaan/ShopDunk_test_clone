import React, { Fragment, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTimePicker from 'components/shared/BWFormControl/FormTime';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormInput from 'components/shared/BWFormControl/FormInput';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import ZaloOAService from 'services/zalo-oa.service.';
import { getOptionSelected, mapDataOptions } from 'utils/helpers';
import useDeepMemo from 'hooks/useDeepMemo';
import { TEMPLATE_PARAMS, compliedTemplate, getTemplateFields } from 'components/shared/FormZalo/utils';
import WrapUnregister from 'components/shared/FormZalo/WrapUnregister';

export const ZALO_TYPE_SEND = {
  SEND_SMS: 'SEND_SMS',
  SEND_ZNS: 'SEND_ZNS',
};

export const ZALO_DATA_TYPE = {
  INPUT: 1,
  DATA: 2,
};

function FormZaloDynamic({ customer, methods }) {
  const zaloTemplateOptions = useGetOptions(optionType.zaloTemplate);

  const [znsTemplateOptions, setZnsTemplateOptions] = useState([]);
  const detailZNS = methods.watch('detail_zns');
  const zalo_type_send = methods.watch('zalo_type_send');
  const zalo_sms_list_params = methods.watch('zalo_sms_list_params') || [];

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

  const zalo_sms_message = methods.watch('zalo_sms_message') || [];
  const zalo_sms_type = methods.watch('zalo_sms_type') || [];
  const zalo_sms_content_origin = methods.watch('zalo_sms_content_origin');
  const zalo_sms_content_complied = useDeepMemo(() => {
    const compliedObj = {};
    for (let i = 0; i < zalo_sms_type.length; i++) {
      if (zalo_sms_type[i] !== ZALO_DATA_TYPE.DATA && zalo_sms_message[i]) {
        compliedObj[zalo_sms_list_params[i]] = zalo_sms_message[i];
      }
    }
    return compliedTemplate(zalo_sms_content_origin, compliedObj);
  }, [zalo_sms_message, zalo_sms_type, zalo_sms_content_origin, zalo_sms_list_params]);
  useEffect(() => {
    methods.setValue('zalo_sms_content_complied', zalo_sms_content_complied);
  }, [zalo_sms_content_complied]);

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

              if (zaloTemplate?.image_url) {
                methods.setValue('zalo_sms_image_url', zaloTemplate.image_url);
              }

              methods.setValue('zalo_sms_content_origin', zaloTemplate.zalo_template);
              methods.setValue('zalo_sms_content', zaloTemplate.zalo_template);
              methods.setValue('zalo_sms_content_complied', zaloTemplate.zalo_template);

              methods.setValue('zalo_sms_list_params', getTemplateFields(zaloTemplate?.zalo_template || ''));
            }}
            validation={{ required: 'Mẫu gửi là bắt buộc' }}
          />
        </FormItem>
        <FormItem label='Nội dung' style='gray' disabled={true}>
          <textarea
            rows={5}
            className='form-control'
            disabled={true}
            placeholder='Nội dung tin nhắn'
            value={zalo_sms_content_complied}
            onChange={(e) => {}}
          />
        </FormItem>
        <div className='bw_row'>
          {zalo_sms_list_params
            .filter((x) => x !== 'INTERESTID')
            .map((param, index) => {
              return (
                <Fragment>
                  <FormItem label='Tham số' className='bw_col_4' style='gray'>
                    <FormSelect
                      field={`zalo_sms_type.${index}`}
                      list={[
                        { label: 'Nhập nội dung', value: ZALO_DATA_TYPE.INPUT },
                        { label: 'Theo dữ liệu', value: ZALO_DATA_TYPE.DATA },
                      ]}
                      defaultValue={ZALO_DATA_TYPE.INPUT}
                    />
                  </FormItem>
                  <FormItem className='bw_col_8' label={param} style='gray'>
                    {methods.watch(`zalo_sms_type.${index}`) === ZALO_DATA_TYPE.DATA ? (
                      <FormSelect
                        field={`zalo_sms_params.${index}`}
                        list={TEMPLATE_PARAMS}
                        validation={{
                          required: 'Nội dung là bắt buộc',
                        }}
                      />
                    ) : (
                      <FormInput field={`zalo_sms_message.${index}`} />
                    )}
                  </FormItem>
                </Fragment>
              );
            })}
        </div>
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
            return (
              <div className='bw_row'>
                <FormItem label='Tham số' className='bw_col_4' style='gray'>
                  <FormSelect
                    field={`zalo_zns_type.${index}`}
                    list={[
                      { label: 'Nhập nội dung', value: ZALO_DATA_TYPE.INPUT },
                      { label: 'Theo dữ liệu', value: ZALO_DATA_TYPE.DATA },
                    ]}
                    defaultValue={ZALO_DATA_TYPE.INPUT}
                  />
                </FormItem>
                <FormItem
                  className='bw_col_8'
                  label={param.name || 'Nhập giá trị'}
                  style='gray'
                  key={index}
                  isRequired={true}>
                  {methods.watch(`zalo_zns_type.${index}`) !== ZALO_DATA_TYPE.DATA && param.type === 'DATE' && (
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
                  )}
                  {methods.watch(`zalo_zns_type.${index}`) !== ZALO_DATA_TYPE.DATA && param.type !== 'DATE' && (
                    <WrapUnregister field={param.name}>
                      <FormInput
                        field={param.name}
                        placeholder={`Nhập ${param.name}`}
                        validation={{ required: `${param.name} là bắt buộc` }}
                      />
                    </WrapUnregister>
                  )}
                  {methods.watch(`zalo_zns_type.${index}`) === ZALO_DATA_TYPE.DATA && (
                    <WrapUnregister field={param.name}>
                      <FormSelect
                        field={param.name}
                        list={TEMPLATE_PARAMS}
                        validation={{
                          required: 'Nội dung là bắt buộc',
                        }}
                      />
                    </WrapUnregister>
                  )}
                </FormItem>
              </div>
            );
          })}
      </>
    );
  };

  return (
    <FormProvider {...methods}>
      <form>
        {/* <FormItem label='Loại gửi' style='gray'>
          <FormSelect
            field='zalo_type_send'
            list={[
              { value: 'SEND_SMS', label: 'Gửi tin nhắn Zalo' },
              { value: 'SEND_ZNS', label: 'Gửi thông báo ZNS' },
            ]}
          />
        </FormItem> */}
        {methods.watch('zalo_type_send') === 'SEND_SMS' && renderSendSMS()}
        {methods.watch('zalo_type_send') === 'SEND_ZNS' && renderSendZNS()}
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
            <FormNumber field='send_schedule_after_days' min={0} addonAfter='ngày' allowClear />
          </FormItem>
        </div>
      </form>
    </FormProvider>
  );
}

export default FormZaloDynamic;