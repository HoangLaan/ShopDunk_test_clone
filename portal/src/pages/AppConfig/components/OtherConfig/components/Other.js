import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionByDepartmentId, getOptionsPosition } from 'services/position.service';

const Other = () => {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const customToString = (data) => {
    data = mapDataOptions4Select(data);
    data.forEach((item) => {
      item.id = toString(item.id);
    });
    return data;
  };
  const handleChangeDepartment = (params) => {
    setValue('FI_DEPARTMENT_FINANCE', params);
    setValue('FI_DEPARTMENT_FINANCE_POSITION', null);
    getOptionByDepartmentId({department_id: watch('FI_DEPARTMENT_FINANCE')}).then((data)=>{
      setValue('position_option', customToString(data));
    })
  }
  return (
    <BWAccordion title='Cài đặt khác' id='bw_other_config' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Cài đặt tên nhãn hiệu SAMCENTER' isRequired={true} disabled={false}>
            <FormSelect
              field='BRANDNAME_SAMCENTER'
              list={mapDataOptions4Select(watch('brand_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='ID Phòng tài chính' isRequired={true} disabled={false}>
            <FormSelect
              field='FI_DEPARTMENT_FINANCE'
              list={mapDataOptions4Select(watch('department_option'))}
              onChange={handleChangeDepartment}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Cài đặt tên nhãn hiệu SHOPDUNK' isRequired={true} disabled={false}>
            <FormSelect
              field='BRANDNAME_SHOPDUNK'
              list={mapDataOptions4Select(watch('brand_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <div className='bw_frm_box'>
            <label style={{ fontSize: '14px' }}>ZALO_OA_REFRESH_TOKEN</label>
            <div style={{ display: 'flex' }}>
              <input type='text' value={watch('ZALO_OA_REFRESH_TOKEN')} onChange={(e)=>{
                setValue('ZALO_OA_REFRESH_TOKEN', e.target.value)
              }}/>
            </div>
          </div>
          {/* <div className='bw_frm_box'>
            <label style={{ fontSize: '14px' }}>ID vị trí duyệt của phòng tài chính</label>
            <div style={{ display: 'flex' }}>
              <input type='text' value={watch('FI_DEPARTMENT_FINANCE_POSITION')} />
            </div>
          </div> */}
          <FormItem label='ID vị trí duyệt của phòng tài chính' isRequired={true} disabled={false}>
            <FormSelect
              field='FI_DEPARTMENT_FINANCE_POSITION'
              list={mapDataOptions4Select(watch('position_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Loại công việc cho cửa hàng' isRequired={true} disabled={false}>
            <FormSelect
              field='TASKTYPEFORSHOP'
              list={mapDataOptions4Select(watch('task_type_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Công việc cho cửa hàng' isRequired={true} disabled={false}>
            <FormSelect
              field='TASKFORSHOP'
              list={mapDataOptions4Select(watch('task_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Loại khách hàng cho cửa hàng' isRequired={true} disabled={false}>
            <FormSelect
              field='CUSTOMERFORSHOP'
              list={mapDataOptions4Select(watch('customer_type_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default Other;
