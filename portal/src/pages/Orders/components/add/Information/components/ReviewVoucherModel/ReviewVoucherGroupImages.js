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

export default function ReviewVoucherGroupImages({ title, disabled }) {
  const methods = useFormContext();
  const {
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    methods.register('images',
      {
        validate: (v) => {
          if (!Array.isArray(v) || v.length <= 0) {
            return 'Ảnh là bắt buộc';
          }

          return true;
        },
      }
    );
  }, [methods]);

  const handleChangeImages = async (e) => {
    const files = e.target.files;
    const KB_MAX_SIZE = 4;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/heic', 'image/svg+xml', 'image/svg'];  // Các loại MIME type được cho phép

    for (let i = 0; i < files.length; i++) {
      const { size, name, type } = files[i];

      if (size / (1000 * 1024) > KB_MAX_SIZE) {
        setError('images', { type: 'custom', message: `Dung lượng ảnh vượt quá ${KB_MAX_SIZE}mb ()${name}` });
        return;
      }

      // Kiểm tra loại file 
      if (!ALLOWED_TYPES.includes(type)) {
        setError('images', { type: 'custom', message: `Loại file không hợp lệ (${name}). Chỉ chấp nhận các file ảnh (jpeg, png, gif, heic, svg, jpg)` });
        return;
      }

      clearErrors('images');
      const base64 = await getBase64(files[i]);
      setValue('images', [...(Array.isArray(watch('images')) ? watch('images') : []), base64]);
    }
  }; 

  return (
    <>
      <div className='bw_mt_1 bw_flex bw_align_items_center'>
        {!disabled && (
          <label className='bw_choose_image_banner' style={{ display: 'flex' }}>
            <input
              type='file'
              multiple={true}
              field='images'
              name='images'
              accept='image/*'
              onChange={(_) => handleChangeImages(_, 'images')}
            // disabled={disabled}
            />
            <span className='fi fi-rr-add'></span>
          </label>
        )}

        {Boolean(watch('images')?.length) &&
          watch('images').map((item, index) => (
            <div className='bw_image_view_banner'>
              <BWImage src={item.picture_url ? item.picture_url : item} />

              {!disabled && (
                <RemoveImageSpan
                  className='bw_remove_image'
                  onClick={() => {
                    setValue(
                      'images',
                      watch('images')?.filter((_, i) => i !== index),
                    );
                  }}>
                  <i className='fi fi-rr-cross-small'></i>
                </RemoveImageSpan>
              )}
            </div>
          ))}
      </div>
      {errors['images'] && <ErrorMessage message={errors['images']?.message} />}
    </>
  );
}
