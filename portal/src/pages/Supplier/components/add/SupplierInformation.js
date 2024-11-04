import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { getBase64 } from 'utils/helpers';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const SupplierInformation = ({ disabled, onChangeSupplierCode }) => {
  const methods = useFormContext();
  const { register } = methods;

  useEffect(() => {
    register('logo_url');
  }, [register]);

  return (
    <BWAccordion title='Thông tin nhà cung cấp'>
      <div className='bw_row'>
        <div className='bw_col_3'>
          <div className='bw_load_image bw_mb_2 bw_text_center'>
            <label className='bw_choose_image'>
              <input
                type='file'
                accept='image/*'
                disabled={disabled}
                onChange={async (_) => {
                  const getFile = await getBase64(_.target.files[0]);
                  methods.setValue('logo_url', getFile);
                }}
              />
              {methods.watch('logo_url') ? (
                <img alt='logo' style={{ width: '100%' }} src={methods.watch('logo_url') ?? ''}></img>
              ) : (
                <span className='fi fi-rr-picture' />
              )}
            </label>
            <p>Kích thước ảnh: 500px*500px.</p>
          </div>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Mã nhà cung cấp'>
            <FormInput
              type='text'
              field='supplier_code'
              placeholder='Nhập mã nhà cung cấp'
              onChange={onChangeSupplierCode}
              validation={{
                required: 'Mã nhà cung cấp là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem disabled={disabled} isRequired label='Tên nhà cung cấp'>
            <FormInput
              type='text'
              field='supplier_name'
              placeholder='Nhập tên nhà cung cấp'
              validation={{
                required: 'Tên nhà cung cấp là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem disabled={disabled} label='Tên thay thế'>
            <FormInput type='text' field='altname' placeholder='Tên thay thế' />
          </FormItem>
          <FormItem disabled={disabled} label='Tên hiển thị'>
            <FormInput type='text' field='display_name' placeholder='Nhập tên hiển thị' />
          </FormItem>
          <FormItem disabled={disabled} label='Chức vụ'>
            <FormInput field='representative_position' placeholder='Nhập chức vụ' />
          </FormItem>
        </div>
        <div className='bw_col_5'>
          <FormItem
            disabled={disabled}
            label='Mã số thuế'
            linkLabelHref={'https://tracuunnt.gdt.gov.vn/tcnnt/mstdn.jsp'}
            labelHref={'(Tra cứu mã số thuế)'}>
            <FormInput type='text' field='tax_code' placeholder='Nhập mã số thuế' />
          </FormItem>
          <FormItem className='bw_relative' disabled={disabled} label='Tên người đại diện'>
            <FormSelect
              className='bw_absolute'
              style={{ top: 24, left: 15, width: '60px' }}
              field='representative_gender'
              list={[
                {
                  label: 'Ông',
                  value: 1,
                },
                {
                  label: 'Bà',
                  value: 0,
                },
              ]}
            />
            <FormInput
              style={{ marginLeft: '60px' }}
              type='text'
              field='representative_name'
              placeholder='Tên người đại diện'
            />
          </FormItem>
          <FormItem disabled={disabled} label='Email'>
            <FormInput
              type='text'
              field='representative_email'
              placeholder='Email'
              validation={{
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Email sai định dạng',
                },
              }}
            />
          </FormItem>
          <FormItem disabled={disabled} label='Số điện thoại'>
            <FormInput
              field='representative_phonenumber'
              placeholder='Số điện thoại'
              validation={{
                pattern: {
                  value: /^\d{10,14}$/,
                  message: 'Số điện thoại sai định dạng',
                },
              }}
            />
          </FormItem>
          <FormItem disabled={disabled} label='Thời hạn thanh toán'>
            <FormNumber
              field='payment_period'
              placeholder='Thời hạn thanh toán'
              validation={{
                min: {
                  value: 1,
                  message: 'Giá trị phải lớn hơn 0',
                },
              }}
              addonAfter='Ngày'
            />
          </FormItem>
        </div>
        <div className='bw_col_3'></div>
        <div className='bw_col_9'>
          <FormItem disabled={disabled} label='Mô tả'>
            <FormTextArea type='text' field='description' placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default SupplierInformation;
