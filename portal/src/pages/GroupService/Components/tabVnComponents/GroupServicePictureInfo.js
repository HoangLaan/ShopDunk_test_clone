import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { getBase64 } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import BWImage from 'components/shared/BWImage/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
const currentDomain = window.location.origin;
//const currentDomain = "https://shopdunk-test.blackwind.vn";

const RemoveImageSpan = styled.span`
  .fi::before {
    display: flex;
  }
`;

export default function GroupServicePictureInfo({ title, disabled }) {
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
        setError('large_images', { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }
      //small_image_url, medium_image_url, large_image_url
      const image = watch('large_images');
      if (image?.length >= 1) {
        setError('large_images', { type: 'custom', message: `Số lượng mỗi loại ảnh không vượt quá 1` });
        return;
      }

      clearErrors('large_images');
      const base64 = await getBase64(files[i]);
      setValue('large_images', [...(Array.isArray(watch('large_images')) ? watch('large_images') : []), base64]);
      console.log('large_images', watch('large_images'));
    }
    

  };

  const handleChangeMediumImages = async (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const { size, name } = files[i];

      if (size / 1000 > 500) {
        setError('medium_images', { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }
      //small_image_url, medium_image_url, large_image_url
      const image = watch('medium_images');
      if (image?.length >= 1) {
        setError('medium_images', { type: 'custom', message: `Số lượng mỗi loại ảnh không vượt quá 1` });
        return;
      }

      clearErrors('medium_images');
      const base64 = await getBase64(files[i]);
      setValue('medium_images', [...(Array.isArray(watch('medium_images')) ? watch('medium_images') : []), base64]);
    }
  };

  const handleChangeSmallImages = async (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const { size, name } = files[i];

      if (size / 1000 > 500) {
        setError('small_images', { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }
      //small_image_url, medium_image_url, large_image_url
      const image = watch('small_images');
      if (image?.length >= 1) {
        setError('small_images', { type: 'custom', message: `Số lượng mỗi loại ảnh không vượt quá 1` });
        return;
      }

      clearErrors('small_images');
      const base64 = await getBase64(files[i]);
      setValue('small_images', [...(Array.isArray(watch('small_images')) ? watch('small_images') : []), base64]);
    }
  };

  return (
    <BWAccordion title={title} isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_3'>
          <label>Ảnh cỡ lớn</label>
          <div className='bw_mt_1 bw_flex bw_align_items_center'>
            {!disabled && (
              <label className='bw_choose_image_banner'>
                <input
                  type='file'
                  multiple={true}
                  field='large_images'
                  name='large_images'
                  accept='image/*'
                  onChange={(_) => handleChangeLargeImages(_, 'large_images')}
                  disabled={disabled}
                />
                <span className='fi fi-rr-add'></span>
              </label>
            )}

            {Boolean(watch('large_images')?.length) &&
              watch('large_images').map((item, index) => (
                <div className='bw_image_view_banner'>
                  <BWImage src={item.large_images ? `${item.large_images}` : `${item}`} />
                  {!disabled && (
                    <RemoveImageSpan
                      className='bw_remove_image'
                      onClick={() => {
                        setValue(
                          'large_images',
                          watch('large_images').filter((_, i) => i !== index),
                        );
                      }}>
                      <i className='fi fi-rr-cross-small'></i>
                    </RemoveImageSpan>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className='bw_col_3'>
          <label>Ảnh cỡ vừa</label>
          <div className='bw_mt_1 bw_flex bw_align_items_center'>
            {!disabled && (
              <label className='bw_choose_image_banner'>
                <input
                  type='file'
                  multiple={true}
                  field='medium_images'
                  name='medium_images'
                  accept='image/*'
                  onChange={(_) => handleChangeMediumImages(_, 'medium_images')}
                  disabled={disabled}
                />
                <span className='fi fi-rr-add'></span>
              </label>
            )}

            {Boolean(watch('medium_images')?.length) &&
              watch('medium_images').map((item, index) => (
                <div className='bw_image_view_banner'>
                  <BWImage src={item.medium_images ? `${item.medium_images}` : `${item}`} />
                  {!disabled && (
                    <RemoveImageSpan
                      className='bw_remove_image'
                      onClick={() => {
                        setValue(
                          'medium_images',
                          watch('medium_images').filter((_, i) => i !== index),
                        );
                      }}>
                      <i className='fi fi-rr-cross-small'></i>
                    </RemoveImageSpan>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className='bw_col_3'>
          <label>Ảnh cỡ nhỏ</label>
          <div className='bw_mt_1 bw_flex bw_align_items_center'>
            {!disabled && (
              <label className='bw_choose_image_banner'>
                <input
                  type='file'
                  multiple={true}
                  field='small_images'
                  name='small_images'
                  accept='image/*'
                  onChange={(_) => handleChangeSmallImages(_, 'small_images')}
                  disabled={disabled}
                />
                <span className='fi fi-rr-add'></span>
              </label>
            )}

            {Boolean(watch('small_images')?.length) &&
              watch('small_images').map((item, index) => (
                <div className='bw_image_view_banner'>
                  {/* <BWImage src={item.small_images ? item.small_images : item} /> */}
                  <BWImage src={item.small_images ? `${item.small_images}` : `${item}`} />
                  {!disabled && (
                    <RemoveImageSpan
                      className='bw_remove_image'
                      onClick={() => {
                        setValue(
                          'small_images',
                          watch('small_images').filter((_, i) => i !== index),
                        );
                      }}>
                      <i className='fi fi-rr-cross-small'></i>
                    </RemoveImageSpan>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {errors['small_images'] && <ErrorMessage message={errors['small_images']?.message} />}
      {errors['medium_images'] && <ErrorMessage message={errors['medium_images']?.message} />}
      {errors['large_images'] && <ErrorMessage message={errors['large_images']?.message} />}

    </BWAccordion>
  );
}
