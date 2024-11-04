import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
//utils
import { getBase64 } from 'utils/helpers';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
export default function IdentityCard({ title, disabled = true }) {
  const methods = useFormContext();
  const { watch, setError, setValue, register, clearErrors } = methods;

  useEffect(() => {
    register('identity_front_image');
    register('identity_back_image');
  }, [register]);

  const handleFileUpload = async (_, field) => {
    clearErrors(field);
    const avatar = _.target.files[0];
    const { size } = avatar;
    if (size / 1000 > 500) {
      setError(field, { type: 'custom', message: 'Dung lượng ảnh vượt quá 500kb.' });
      return;
    }
    const getFile = await getBase64(avatar);
    setValue(field, getFile);
  };

  return (
    <BWAccordion title={title} id='bw_cccd'>
      <div className='bw_row'>
        <FormItem className='bw_col_4' label='CMND/CCCD/HC' disabled={disabled}>
          <FormInput
            type='text'
            field='identity_number'
            placeholder='07009xxxxxx'
            // validation={{
            //   required: 'Số CMND/CCCD/ HC là bắt buộc',
            //   maxLength: {
            //     value: 15,
            //     message: 'Số CMND/CCCD/ HC tối đa 15 ký tự.',
            //   },
            // }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Ngày cấp' disabled={disabled}>
          <FormDatePicker
            field={'identity_date'}
            format={'DD/MM/YYYY'}
            // validation={{
            //   required: 'Ngày cấp là bắt buộc',
            // }}
            placeholder={'dd/mm/yyyy'}
            style={{
              width: '100%',
            }}
            bordered={false}
            allowClear
          />
        </FormItem>
        <FormItem className='bw_col_12' label='Nơi cấp' disabled={disabled}>
          <FormInput
            type='text'
            field='identity_place'
            placeholder='Nơi cấp'
            // validation={{
            //   required: 'Nơi cấp là bắt buộc',
            // }}
          />
        </FormItem>
        <div className='bw_col_6'>
          <p className='bw_titleS'>Ảnh mặt trước</p>
          <label className='bw_choose_file'>
            <input
              type='file'
              name='identity_front_image'
              accept='image/*'
              onChange={(_) => handleFileUpload(_, 'identity_front_image')}
              disabled={disabled}
            />
            {watch('identity_front_image')?.length ? (
              <img
                style={{ width: '100%', height: 200, borderRadius: 0, objectFit: 'contain' }}
                src={watch('identity_front_image') ?? ''}
                alt=''></img>
            ) : (
              <span className='fi fi-rr-picture' />
            )}
          </label>
          {methods.formState.errors['identity_front_image'] && (
            <ErrorMessage message={methods.formState.errors['identity_front_image']?.message} />
          )}
        </div>
        <div className='bw_col_6'>
          <p className='bw_titleS'>Ảnh mặt sau</p>
          <label className='bw_choose_file'>
            <input
              type='file'
              name='identity_back_image'
              accept='image/*'
              onChange={(_) => handleFileUpload(_, 'identity_back_image')}
              disabled={disabled}
            />
            {watch('identity_back_image')?.length ? (
              <img
                style={{ width: '100%', height: 200, borderRadius: 0, objectFit: 'contain' }}
                src={watch('identity_back_image') ?? ''}
                alt=''></img>
            ) : (
              <span className='fi fi-rr-picture' />
            )}
          </label>
          {methods.formState.errors['identity_back_image'] && (
            <ErrorMessage message={methods.formState.errors['identity_back_image']?.message} />
          )}
        </div>
      </div>
    </BWAccordion>
  );
}
