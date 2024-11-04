import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { getBase64 } from 'utils/helpers';

export default function Icon({ isEdit = true }) {
  const methods = useFormContext();
  const {
    watch,
    setError,
    setValue,
    register,
    formState: { errors },
  } = methods;

  const handleChangeIcon = async (e) => {
    const icon = e.target.files[0];

    const { size } = icon;
    if (size / 1000 > 500) {
      setError('icon', { type: 'custom', message: 'Dung lượng ảnh vượt quá 500kb.' });
      return;
    }

    const base68 = await getBase64(icon);
    setValue('icon', base68);
  };

  useEffect(() => {
    register('icon');
  }, [register]);

  return (
    <div className='bw_load_image bw_mb_2 bw_text_center'>
      <label className='bw_choose_image'>
        <input accept='image/*' type='file' onChange={handleChangeIcon} disabled={!isEdit} />
        {methods.watch('icon') ? (
          <img alt='icon' style={{ width: '100%' }} src={watch('icon') ?? ''}></img>
        ) : (
          <span className='fi fi-rr-picture' />
        )}
      </label>
      <p>Kích thước ảnh: 500px*500px.</p>
      <p>Dung lượng tối đa: 500kb.</p>
      {errors['icon'] && <ErrorMessage message={errors['icon']?.message} />}
    </div>
  );
}
