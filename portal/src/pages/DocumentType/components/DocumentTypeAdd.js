import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { useForm, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { useState } from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getCompany } from 'services/document-type.service';


export function DocumentTypeInfo({ disabled }) {

  const { reset, handleSubmit, register, watch, setValue } = useFormContext();

  const [companyData, setCompanyData] = useState()

  const getListCompany = async () => {
    try {
      const result = await getCompany({
        is_active: 1,
      })
      if (result) {
        setCompanyData(result);
        setValue('company_id', result[0]?.id)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    getListCompany()
  }, [])

  return (
    <BWAccordion title='Thông tin loại hồ sơ' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tên loại hồ sơ' isRequired>
            <FormInput
              type='text'
              field='document_type_name'
              placeholder='Nhập tên loại hồ sơ'
              validation={{
                required: 'Tên loại hồ sơ là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_required' value={watch('is_required')} disabled={disabled} />
                <span />
                Bắt buộc
              </label>
            </div>
          </div>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Công ty'>
            <FormSelect
              disabled={disabled}
              field='company_id'
              placeholder="Chọn công ty áp dụng"
              onChange={e => setValue('company_id', e)}
              list={
                companyData?.map(e => {
                  return {
                    value: e?.id,
                    label: e?.name,
                  };
                }) || []
              }
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea field='description' rows={3} disabled={disabled} placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}
export function DocumentTypeStatus({ disabled }) {

  const { watch } = useForm();

  return (
    <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' value={watch('is_active')} disabled={disabled} />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_system' />
                <span />
                Hệ thống
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}
