/* eslint-disable react/style-prop-object */
import React, { useEffect, useState } from 'react';

import { mapDataOptions4Select } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';

import { phoneRule } from 'pages/CustomerLead/utils/formRules';
import { GENDER } from 'pages/CustomerLead/utils/constants';
import CustomerLeadService from 'services/customer-lead.service';

function ModalAffiliateInformation({ disabled, title }) {
  const [optionsSource, setOptionsSource] = useState([]);
  const [optionsCustomerType, setOptionsCustomerType] = useState([]);

  useEffect(() => {
    const getDataOptions = async () => {
      const _source = await CustomerLeadService.getOptionsSource();
      setOptionsSource(mapDataOptions4Select(_source));

      const _customerType = await CustomerLeadService.getOptionsCustomerType();
      setOptionsCustomerType(mapDataOptions4Select(_customerType));
    };
    getDataOptions();
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Mã khách hàng' disabled={true}>
            <FormInput field='data_leads_code' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Nguồn khách hàng' disabled={disabled}>
            <FormSelect placeholder='Chọn nguồn khách hàng' field='source_id' list={optionsSource} />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Loại khách hàng' isRequired={true}>
            <FormSelect
              field='customer_type_id'
              list={optionsCustomerType}
              placeholder='Loại khách hàng'
              validation={{
                required: 'Loại khách hàng là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Họ tên'>
            <FormInput
              field='full_name'
              placeholder='Nhập họ tên khách hàng'
              validation={{
                required: 'Họ tên là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
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
        <div className='bw_col_4'>
          <FormItem label='Giới tính'>
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
          <FormItem label='Email'>
            <FormInput field='email' placeholder='Nhập email' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Số điện thoại' isRequired={true}>
            <FormInput
              field='phone_number'
              placeholder='Nhập số điện thoại'
              validation={phoneRule}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Zalo ID'>
            <FormInput field='zalo_id' placeholder='Nhập Zalo' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Facebook ID'>
            <FormInput field='facebook_id' placeholder='Nhập Facebook' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default ModalAffiliateInformation;
