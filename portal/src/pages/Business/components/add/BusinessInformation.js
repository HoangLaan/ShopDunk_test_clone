import React, { useCallback, useEffect, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { getOptionsCompany } from 'services/company.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { getBusinessTypeOptions } from 'services/business-type.service';
import { getOptionsArea } from 'services/area.service';

const BusinessInformation = ({ disabled, title }) => {
  const [companyOptions, setCompanyOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState([]);

  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4Select(res));
    });

    getBusinessTypeOptions().then((res) => {
      setBusinessTypeOptions(mapDataOptions4Select(res));
    });

    getOptionsArea().then((res) => {
      setAreaOptions(mapDataOptions4Select(res));
    });
  }, []);

  useEffect(getOptions, [getOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <div className='bw_flex bw_align_items_center bw_lb_sex'>
                <label className='bw_checkbox' style={{ width: '100%' }}>
                  <FormInput disabled={disabled} type='checkbox' field='is_business_place' />
                  <span />
                  Là địa điểm kinh doanh
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Mã miền' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='business_code'
              placeholder='Nhập mã miền'
              validation={{
                required: 'Mã miền là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Mã số thuế' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='business_tax_code'
              placeholder='Nhập mã số thuế'
              validation={{
                required: 'Mã số thuế là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Tên miền' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='business_name'
              placeholder='Nhập tên miền'
              validation={{
                required: 'Tên miền là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Tên viết tắt' disabled={disabled}>
            <FormInput type='text' field='business_short_name' placeholder='Nhập viết tắt' />
          </FormItem>

          <FormItem className='bw_col_6' label='Người đại diện' disabled={disabled}>
            <FormInput type='text' field='representative_name' placeholder='Nhập người đại diện' />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Thuộc công ty' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              list={companyOptions}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Thuộc khu vực' isRequired disabled={disabled}>
            <FormSelect
              field='area_id'
              list={areaOptions}
              validation={{
                required: 'Khu vực là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Loại miền' isRequired disabled={disabled}>
            <FormSelect
              field='business_type_id'
              list={businessTypeOptions}
              validation={{
                required: 'Loại miền là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Ngày thành lập' disabled={disabled}>
            <FormDatePicker
              field='opening_date'
              placeholder={'dd/mm/yyyy'}
              style={{
                width: '100%',
              }}
              format='DD/MM/YYYY'
              bordered={false}
              allowClear
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Số điện thoại' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='business_phone_number'
              placeholder='Số điện thoại'
              validation={{
                required: 'Số điện thoại là bắt buộc',
                pattern: {
                  value:
                    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                  message: 'Số điện thoại không hợp lệ',
                },
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Email' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='business_mail'
              placeholder='Email'
              validation={{
                required: 'Email là bắt buộc',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Email không hợp lệ',
                },
              }}
            />
          </FormItem>
        </div>

        <FormItem className='bw_col_12' label='Mô tả'>
          <FormTextArea field='description' rows={3} placeholder='Mô tả' disabled={disabled} />
        </FormItem>
      </div>
    </BWAccordion>
  );
};
export default BusinessInformation;
