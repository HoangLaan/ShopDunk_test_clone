/* eslint-disable react/style-prop-object */
import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';

function ModalSupplierInformation({ disabled, title }) {
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Mã nhà cung cấp'>
            <FormInput
              type='text'
              field='supplier_code'
              placeholder='Nhập mã nhà cung cấp'
              validation={{
                required: 'Nhập mã nhà cung cấp là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Tên nhà cung cấp'>
            <FormInput
              type='text'
              field='supplier_name'
              placeholder='Nhập tên nhà cung cấp'
              validation={{
                required: 'Nhập tên nhà cung cấp là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Tên thay thế'>
            <FormInput
              type='text'
              placeholder='Tên thay thế'
              validation={{
                required: 'Tên thay thế là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Tên người đại diện'>
            <FormInput
              type='text'
              field='representative_name'
              placeholder='Tên người đại diện'
              validation={{
                required: 'Tên người đại diện là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Chức vụ'>
            <FormInput
              field='representative_position'
              placeholder='Chức vụ'
              validation={{
                required: 'Code là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Số điện thoại'>
            <FormInput
              field='representative_phonenumber'
              placeholder='Số điện thoại'
              validation={{
                required: 'Số điện thoại cần nhập là bắt buộc',
                pattern: {
                  value: /^\d{10,14}$/,
                  message: 'Số điện thoại sai định dạng',
                },
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Email'>
            <FormInput
              type='text'
              field='representative_email'
              placeholder='Email'
              validation={{
                required: 'Email cần nhập là bắt buộc',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Email sai định dạng',
                },
              }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default ModalSupplierInformation;
