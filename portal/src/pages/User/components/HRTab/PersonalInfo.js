import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
//utils
import { maritalStatus } from 'pages/User/helpers/index';
import { getBase64 } from 'utils/helpers';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { useAuth } from 'context/AuthProvider';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import useVerifyAccess from 'hooks/useVerifyAccess';

export default function PersonalInfo({ title, disabled = true }) {
  const methods = useFormContext();
  const { watch, setError, setValue, register, clearErrors } = methods;
  const { id } = useParams();
  const { user } = useAuth();
  const { verifyPermission } = useVerifyAccess();
  useEffect(() => {
    register('user_sample_images');
  }, [register]);
  const handleFileUpload = async (_, field) => {
    clearErrors(field);
    const avatar = _.target.files[0];
    if (avatar) {
      const { size } = avatar;
      if (size / 1000 > 500) {
        setError(field, { type: 'custom', message: 'Dung lượng ảnh vượt quá 500kb.' });
        return;
      }
      const getFile = await getBase64(avatar);
      setValue(field, getFile);
    }
  };

  const checkPermission = () => {
    if (user.user_id == id) {
      return true;
    }
    if (verifyPermission('SYS_USER_SAMPLEIMAGES_VIEW')) {
      return true;
    }
    if (user.isAdministrator == 1) {
      return true;
    }
    return false;
  }

  return (
    <BWAccordion title={title} id='personal_info'>
      <div className='bw_row'>
        <FormItem className='bw_col_6' label='Tình trạng hôn nhân' disabled={disabled}>
          <FormSelect field='marital_status' list={maritalStatus} />
        </FormItem>

        <FormItem className='bw_col_6' label='Số lượng con' disabled={disabled}>
          <FormInput type='number' field='number_of_children' placeholder='0' />
        </FormItem>

        <FormItem className='bw_col_6' label='Liên hệ khẩn cấp' disabled={disabled}>
          <FormInput type='text' field='emergency_contact' />
        </FormItem>

        <FormItem className='bw_col_6' label='Số điện thoại khẩn' disabled={disabled}>
          <FormInput type='text' field='emergency_phone' />
        </FormItem>

        <FormItem className='bw_col_6' label='Mã số thuế' disabled={disabled}>
          <FormInput type='text' field='tax_code' />
        </FormItem>

        <FormItem className='bw_col_12' label='Giới thiệu sơ lược' disabled={disabled}>
          <FormTextArea field='about_me' />
        </FormItem>

        {checkPermission() && (<div className='bw_col_12'>
          <p className='bw_titleS'>Ảnh mẫu nhân sự</p>
          <label className='bw_choose_file'>
            <input
              type='file'
              name='user_sample_images'
              accept='image/*'
              onChange={(_) => handleFileUpload(_, 'user_sample_images')}
              disabled={disabled}
            />
            {watch('user_sample_images')?.length ? (
              <img
                style={{ width: '100%', height: 200, borderRadius: 0, objectFit: 'contain' }}
                src={watch('user_sample_images') ?? ''}
                alt=''></img>
            ) : (
              <span className='fi fi-rr-picture' />
            )}
          </label>
          {methods.formState.errors['user_sample_images'] && (
            <ErrorMessage message={methods.formState.errors['user_sample_images']?.message} />
          )}
        </div>)}
      </div>
    </BWAccordion>
  );
}
