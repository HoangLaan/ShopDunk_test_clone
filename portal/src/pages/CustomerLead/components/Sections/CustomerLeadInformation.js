/* eslint-disable react/style-prop-object */
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getBase64, mapDataOptions } from 'utils/helpers';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import ICON_COMMON from 'utils/icons.common';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

import { phoneRule, phoneSecondaryRule } from 'pages/CustomerLead/utils/formRules';
import { GENDER } from 'pages/CustomerLead/utils/constants';
import CustomerLeadService from 'services/customer-lead.service';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import ModalAffiliate from '../Modals/ModalAffiliate';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { CUSTOMER_TYPE } from 'pages/CustomerType/utils/constants';

function CustomerLeadInformation({ disabled, title }) {
  const methods = useFormContext();
  const { watch, clearErrors, setValue, getValues } = methods;

  const { openModalAffiliate, onOpenModalAffiliate } = useCustomerLeadContext();

  const { copy } = useCopyToClipboard();

  const [optionsSource, setOptionsSource] = useState([]);
  const [presenterOptions, setPresenterOptions] = useState([]);
  const customerTypeOptions = useGetOptions(optionType.customerType);
  const _customerTypeOptions = customerTypeOptions.filter((x) => x.type_apply === CUSTOMER_TYPE.LEADS);

  const fetchPresenterOptions = async (search, limit = 100) => {
    const _presenter = await CustomerLeadService.getOptionsPresenter({ search, limit });
    setPresenterOptions(mapDataOptions(_presenter));
  };

  useEffect(() => {
    const getDataOptions = async () => {
      const _source = await CustomerLeadService.getOptionsSource();
      setOptionsSource(mapDataOptions(_source));
      fetchPresenterOptions();
    };
    getDataOptions();
  }, []);

  const renderAvatar = () => {
    if (methods.watch('image_avatar')) {
      return <img src={methods.watch('image_avatar')} alt='customer avatar' />;
    }
    return <img src='bw_image/default_avatar_v2.png' alt='customer avatar' />;
  };

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <div className='bw_load_image bw_mb_2 bw_text_center'>
            <label className='bw_choose_image'>
              <input
                accept='image/*'
                type='file'
                onChange={async (_) => {
                  const getFile = await getBase64(_.target.files[0]);
                  methods.setValue('image_avatar', getFile);
                }}
                disabled={disabled}
              />
              {renderAvatar()}
            </label>
            <p>Kích thước ảnh: 500px*500px.</p>
          </div>
          <FormItem label='Nguồn khách hàng' disabled={disabled}>
            <FormSelect placeholder='Chọn nguồn khách hàng' field='source_id' list={optionsSource} />
          </FormItem>
          <FormItem display='flex' label='Người giới thiệu' disabled={disabled}>
            <FormDebouneSelect
              style={{ width: '92%' }}
              field='presenter_id'
              showSearch
              options={presenterOptions}
              fetchOptions={fetchPresenterOptions}
              disabled={disabled}
              placeholder={'--Chọn--'}
              onChange={(value) => {
                clearErrors('presenter_id');
                setValue('presenter_id', value.value || value.id);
              }}
            />
            <span
              onClick={() => onOpenModalAffiliate(true)}
              className='bw_btn bw_btn_success'
              style={{ height: 30, width: 30 }}>
              <i className={ICON_COMMON.add} style={{}}></i>
            </span>
          </FormItem>
          <FormItem display='flex' disabled={disabled || !watch('affiliate')} label='Link giới thiệu'>
            <FormInput value={watch('affiliate')} />
            {watch('affiliate') && (
              <span
                onClick={() => copy(getValues('affiliate'))}
                className='bw_btn bw_btn_success'
                style={{ height: 30, width: 30, marginRight: 10 }}>
                <i className='fa fa-copy'></i>
              </span>
            )}
          </FormItem>
        </div>
        <div className='bw_col_8'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormItem label='Mã khách hàng' disabled={true}>
                <FormInput field='data_leads_code' disabled={disabled} />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Hạng khách hàng' disabled={disabled}>
                <FormSelect
                  field='customer_type_id'
                  list={_customerTypeOptions}
                  placeholder='Hạng khách hàng'
                  disabled={disabled}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Giới tính' disabled={disabled}>
                <FormRadioGroup
                  field={'gender'}
                  list={[
                    { value: GENDER.MALE, label: 'Nam' },
                    { value: GENDER.FEMALE, label: 'Nữ' },
                  ]}
                  disabled={disabled}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Họ và tên'>
                <FormInput
                  type='text'
                  field='full_name'
                  placeholder='Nhập họ và tên khách hàng'
                  validation={{
                    required: 'Họ và tên là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Ngày/Tháng/Năm sinh'>
                <FormDatePicker
                  style={{
                    width: '100%',
                    padding: '2px 0px',
                  }}
                  placeholder='Nhập ngày sinh'
                  bordered={false}
                  field='birthday'
                  format='DD/MM/YYYY'
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Email' disabled={disabled}>
                <FormInput field='email' placeholder='Nhập email' disabled={disabled} />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Số điện thoại' isRequired={true} disabled={disabled}>
                <FormInput
                  field='phone_number'
                  placeholder='Nhập số điện thoại'
                  validation={phoneRule}
                  disabled={disabled}
                  onChange={(e) => {
                    methods.clearErrors('phone_number');
                    methods.setValue('phone_number', e.target.value);
                    const affiliateId = e.target.value.replace(/^0+/, '');
                    methods.setValue('affiliate', `https://shopdunk.com/${affiliateId}`);
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Số điện thoại phụ' isRequired={false} disabled={disabled}>
                <FormInput
                  field='phone_number_secondary'
                  placeholder='Nhập số điện thoại phụ'
                  validation={phoneSecondaryRule}
                  disabled={disabled}
                  onChange={(e) => {
                    methods.clearErrors('phone_number_secondary');
                    methods.setValue('phone_number_secondary', e.target.value);
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Zalo ID' disabled={disabled}>
                <FormInput field='zalo_id' placeholder='Nhập Zalo' disabled={disabled} />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Facebook ID' disabled={disabled}>
                <FormInput field='facebook_id' placeholder='Nhập Facebook' disabled={disabled} />
              </FormItem>
            </div>
          </div>
        </div>
      </div>

      {openModalAffiliate && <ModalAffiliate />}
    </BWAccordion>
  );
}

export default CustomerLeadInformation;
