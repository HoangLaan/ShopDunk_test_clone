import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { getBase64 } from 'utils/helpers';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const BankInformation = ({ disabled, title }) => {
  const methods = useFormContext();
  const { register } = methods;

  useEffect(() => {
    register('bank_logo');
  }, [register]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_8'>
          <div className='bw_row'>
            <FormItem disabled={disabled} isRequired label='Tên viêt tắt' className='bw_col_4'>
              <FormInput
                type='text'
                field='bank_code'
                placeholder='Nhập tên viết tắt'
                validation={{
                  required: 'Tên viết tắt cần nhập là bắt buộc',
                }}
              />
            </FormItem>

            <FormItem disabled={disabled} isRequired label='Tên đầy đủ' className='bw_col_8'>
              <FormInput
                type='text'
                field='bank_name'
                placeholder='Nhập tên đầy đủ'
                validation={{
                  required: 'Tên đầy đủ cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>

          <FormItem disabled={disabled} label='Tên Tiếng Anh'>
            <FormInput type='text' field='bank_name_en' placeholder='Nhập tên Tiếng Anh' />
          </FormItem>
        </div>

        <div className='bw_col_4'>
          <div className='bw_load_image bw_mb_2 bw_text_center'>
            <label className='bw_choose_image'>
              <input
                type='file'
                accept='image/*'
                disabled={disabled}
                onChange={async (_) => {
                  const getFile = await getBase64(_.target.files[0]);
                  methods.setValue('bank_logo', getFile);
                }}
              />

              {methods.watch('bank_logo') ? (
                <img alt='logo' style={{ width: '100%' }} src={methods.watch('bank_logo') ?? ''}></img>
              ) : (
                <span className='fi fi-rr-picture' />
              )}
            </label>
            {Boolean(methods.watch('bank_logo')) && !disabled && (
              <a
                className='bw_btn_table bw_red'
                href='javascript:void(0);'
                style={{ marginLeft: '10px', marginRight: '-40px' }}
                onClick={() => methods.setValue('bank_logo', null)}>
                <i class='fi fi fi-rr-trash'></i>
              </a>
            )}
            <p>Kích thước ảnh: 500px*500px.</p>
          </div>
        </div>
      </div>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem disabled={disabled} label='Địa chỉ hội sở chính'>
            <FormInput type='text' field='registered_office' placeholder='Nhập địa chỉ hội sở chính' />
          </FormItem>
        </div>
      </div>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem disabled={disabled} label='Diễn giải'>
            <FormTextArea type='text' field='description' placeholder='' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default BankInformation;
