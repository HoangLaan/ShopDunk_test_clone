import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { getBase64 } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import BWImage from 'components/shared/BWImage/index';

const RemoveImageSpan = styled.span`
  .fi::before {
    display: flex;
  }
`;

const ProductCategoryPictures = ({ disabled, title }) => {
  const methods = useFormContext();
  const {
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;

  useEffect(() => {
    methods.register('pictures', {
      // validate: (v) => {
      //   if (!Array.isArray(v) || v.length <= 0) {
      //     return 'Ảnh là bắt buộc';
      //   }
      //   return true;
      // },
    });
  }, [methods]);

  const handleFileUpload = async (_) => {
    const files = _.target.files;
    for (let i = 0; i < files.length; i++) {
      const { size, name } = files[i];

      if (size / 1000 > 500) {
        setError('pictures', { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }

      clearErrors('pictures');
      const base64 = await getBase64(files[i]);
      setValue('pictures', [...watch('pictures'), base64]);
    }
  };

  return (
    <BWAccordion title={title} id='bw_info'>
      <div className='bw_mt_1 bw_flex bw_align_items_center'>
        {!disabled && (
          <label className='bw_choose_image_banner'>
            <input
              type='file'
              multiple={true}
              field='pictures'
              name='pictures'
              accept='image/*'
              onChange={(_) => handleFileUpload(_, 'pictures')}
              disabled={disabled}
            />
            <span className='fi fi-rr-add'></span>
          </label>
        )}

        {Boolean(watch('pictures')?.length) &&
          watch('pictures').map((item, index) => (
            <div className='bw_image_view_banner'>
              <BWImage src={item} />

              {!disabled && (
                <RemoveImageSpan
                  className='bw_remove_image'
                  onClick={() => {
                    setValue(
                      'pictures',
                      watch('pictures').filter((_, i) => i !== index),
                    );
                  }}>
                  <i className='fi fi-rr-cross-small'></i>
                </RemoveImageSpan>
              )}
            </div>
          ))}
      </div>
      {errors['pictures'] && <ErrorMessage message={errors['pictures']?.message} />}
    </BWAccordion>
  );
};

export default ProductCategoryPictures;
