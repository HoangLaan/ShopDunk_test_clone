import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getBase64 } from 'utils/helpers';

const ManufacturerInformation = ({ disabled }) => {
  const methods = useFormContext();

  useEffect(() => {
    methods.register('logo_url');
  }, []);
  return (
    <BWAccordion title='Thông tin hãng'>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <div className='bw_load_image bw_mb_2 bw_text_center'>
            <label className='bw_choose_image'>
              <input
                accept='image/*'
                type='file'
                onChange={async (_) => {
                  const getFile = await getBase64(_.target.files[0]);
                  methods.setValue('logo_url', getFile);
                }}
              />
              {methods.watch('logo_url') ? (
                <img style={{ width: '100%' }} src={methods.watch('logo_url') ?? ''}></img>
              ) : (
                <span className='fi fi-rr-picture' />
              )}
            </label>
            <p>Kích thước ảnh: 500px*500px.</p>
          </div>
        </div>
        <div className='bw_col_4'>
          <FormItem isRequired label='Mã hãng'>
            <FormInput
              disabled={disabled}
              type='text'
              field='manufacturer_code'
              placeholder='Nhập mã hãng'
              validation={{
                required: 'Mã hãng cần nhập là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem isRequired label='Tên hãng'>
            <FormInput
              disabled={disabled}
              type='text'
              field='manufacturer_name'
              placeholder='Nhập tên hãng'
              validation={{
                required: 'Tên hãng cần nhập là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem isRequired label='Tên thay thế'>
            <FormInput
              disabled={disabled}
              type='text'
              field='alt_name'
              placeholder='Tên thay thế'
              validation={{
                required: 'Tên thay thế là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem isRequired label='Tên hiển thị'>
            <FormInput
              disabled={disabled}
              type='text'
              field='display_name'
              placeholder='Nhập tên hiển thị'
              validation={{
                required: 'Tên hiển thị cần nhập là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem isRequired label='Tên người đại diện'>
            <FormInput
              disabled={disabled}
              type='text'
              field='representative_name'
              placeholder='Tên người đại diện'
              validation={{
                required: 'Tên người đại diện là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem isRequired label='Email'>
            <FormInput
              disabled={disabled}
              type='text'
              field='email'
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
          </FormItem>{' '}
          <FormItem isRequired label='Số điện thoại'>
            <FormInput
              disabled={disabled}
              field='phone_number'
              placeholder='Số điện thoại'
              pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
              type='number'
              validation={{
                required: 'Số điện thoại cần nhập là bắt buộc',
                pattern: {
                  value: /^\d{10,14}$/,
                  message: 'Số điện thoại sai định dạng',
                },
              }}
            />
          </FormItem>{' '}
          <FormItem isRequired label='Chức vụ'>
            <FormInput
              disabled={disabled}
              field='representative_position'
              placeholder='Chức vụ'
              validation={{
                required: 'Chức vụ cần nhập là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'></div>
        <div className='bw_col_8'>
          <FormItem label='Mô tả'>
            <FormTextArea type='text' field='descriptions' placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default ManufacturerInformation;
