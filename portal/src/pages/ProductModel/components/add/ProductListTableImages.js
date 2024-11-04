import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { getBase64 } from 'utils/helpers';

import BWImage from 'components/shared/BWImage/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const RemoveImageSpan = styled.span`
  .fi::before {
    display: flex;
  }
`;

const ImagesWrapper = styled.div`
  .bw_choose_image_banner {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .bw_choose_image_banner span {
    font-size: 16px;
  }

  .bw_image_view_banner {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .bw_image_view_banner span {
    width: 16px;
    height: 16px;
  }
`;

export default function ProductListTableImages({ field, disabled }) {
  const methods = useFormContext();
  const { watch, setError, clearErrors, setValue, getFieldState, formState } = methods;
  const { error } = getFieldState(field, formState);

  useEffect(() => {
    methods.register(field, {
      validate: (v) => {
        if (disabled) return true;

        if (!Array.isArray(v) || v.length <= 0) {
          return 'Ảnh là bắt buộc';
        }

        return true;
      },
    });
  }, [methods, field, disabled]);

  const handleChangeImages = async (e) => {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const { size, name } = files[i];

      if (size / 1000 > 500) {
        setError(field, { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }

      clearErrors(field);
      const base64 = await getBase64(files[i]);
      setValue(field, [...(Array.isArray(watch(field)) ? watch(field) : []), base64]);
    }
    e.target.value = null;
  };

  return (
    <ImagesWrapper>
      <div className='bw_mt_1 bw_flex bw_align_items_center'>
        {!disabled && (
          <label className='bw_choose_image_banner'>
            <input
              type='file'
              multiple={true}
              field={field}
              name={field}
              accept='image/*'
              onChange={handleChangeImages}
              disabled={disabled}
            />
            <span className='fi fi-rr-add'></span>
          </label>
        )}

        {Boolean(watch(field)?.length) &&
          watch(field)?.map((item, index) => (
            <div className='bw_image_view_banner' key={index}>
              <BWImage src={item.picture_url ? item.picture_url : item} />

              {!disabled && (
                <RemoveImageSpan
                  className='bw_remove_image'
                  onClick={() => {
                    setValue(
                      field,
                      watch(field).filter((_, i) => i !== index),
                    );
                  }}>
                  <i className='fi fi-rr-cross-small'></i>
                </RemoveImageSpan>
              )}
            </div>
          ))}
      </div>
      {error && <ErrorMessage message={error?.message} />}
    </ImagesWrapper>
  );
}
