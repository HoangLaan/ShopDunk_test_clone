import React from 'react';
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

export default function CareServicePictureInfo({ title, disabled }) {
  const methods = useFormContext();
  const {
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = methods;

  const handleChangeLargeImages = async (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const { size, name } = files[i];

      if (size / 1000 > 500) {
        setError('careServiceImages', { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }
      //small_image_url, medium_image_url, large_image_url
      const image = watch('careServiceImages');
      if (image?.length >= 10) {
        setError('careServiceImages', { type: 'custom', message: `Số lượng mỗi loại ảnh không vượt quá 10` });
        return;
      }

      clearErrors('careServiceImages');
      const base64 = await getBase64(files[i]);
      setValue('careServiceImages', [...(Array.isArray(watch('careServiceImages')) ? watch('careServiceImages') : []), base64]);
    }
  };

  //console.log('picture_url',image)

  return (
    <BWAccordion title={title} isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <label>Hình ảnh</label>
          <div className='bw_mt_1 bw_flex bw_align_items_center'>
            {!disabled && (
              <label className='bw_choose_image_banner'>
                <input
                  type='file'
                  multiple={true}
                  field='careServiceImages'
                  name='careServiceImages'
                  accept='image/*'
                  onChange={(_) => handleChangeLargeImages(_, 'careServiceImages')}
                  disabled={disabled}
                />
                <span className='fi fi-rr-add'></span>
              </label>
            )}

            {Boolean(watch('careServiceImages')?.length) &&
              watch('careServiceImages').map((item, index) => (
                <div className='bw_image_view_banner'>
                  <BWImage src={item.picture_url ? item.picture_url : item} />
                  {!disabled && (
                    <RemoveImageSpan
                      className='bw_remove_image'
                      onClick={() => {
                        setValue(
                          'careServiceImages',
                          watch('careServiceImages').filter((_, i) => i !== index),
                        );
                      }}>
                      <i className='fi fi-rr-cross-small'></i>
                    </RemoveImageSpan>
                  )}
                  
                </div>
              ))}
          </div>
          <p>Lưu ý: Ảnh đăng lên website hiển thị theo thứ tự chọn ảnh trên</p>
        </div>
       
      </div>

      {errors['careServiceImages'] && <ErrorMessage message={errors['careServiceImages']?.message} />}

    </BWAccordion>
  );
}
