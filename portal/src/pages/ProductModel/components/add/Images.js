import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { getBase64 } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import BWImage from 'components/shared/BWImage/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const RemoveImageSpan = styled.span`
  .fi::before {
    display: flex;
  }
`;

export default function Images({ title, disabled }) {
  const methods = useFormContext();
  const {
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = methods;

  // useEffect(() => {
  //   methods.register('images', {
  //     validate: (v) => {
  //       if (!Array.isArray(v) || v.length <= 0) {
  //         return 'Ảnh là bắt buộc';
  //       }
  //       return true;
  //     },
  //   });
  // }, [methods]);

  const handleChangeImages = async (e) => {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const { size, name } = files[i];

      if (size / 1000 > 500) {
        setError('images', { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }

      clearErrors('images');
      const base64 = await getBase64(files[i]);
      setValue('images', [...(Array.isArray(watch('images')) ? watch('images') : []), { picture_url: base64 }]);
    }
    e.target.value = null;
  };

  return (
    <BWAccordion title={title} isRequired={false}>
      <div className='bw_mt_1 bw_flex bw_align_items_center'>
        {!disabled && (
          <label className='bw_choose_image_banner'>
            <input
              type='file'
              multiple={true}
              field='images'
              name='images'
              accept='image/*'
              onChange={(_) => handleChangeImages(_, 'images')}
              disabled={disabled}
            />
            <span className='fi fi-rr-add'></span>
          </label>
        )}

        {Boolean(watch('images')?.length) &&
          watch('images')?.map((item, index) => (
            <div className='bw_image_view_banner' key={index}>
              <BWImage src={item.picture_url ? item.picture_url : item} />

              {!disabled && (
                <RemoveImageSpan
                  className='bw_remove_image'
                  onClick={() => {
                    setValue(
                      'images',
                      watch('images').filter((_, i) => i !== index),
                    );
                  }}>
                  <i className='fi fi-rr-cross-small'></i>
                </RemoveImageSpan>
              )}
            </div>
          ))}
      </div>
      {errors['images'] && <ErrorMessage message={errors['images']?.message} />}
    </BWAccordion>
  );
}
