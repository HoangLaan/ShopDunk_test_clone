import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getBase64 } from 'utils/helpers';

export default function Images({ isEdit = true }) {
  const methods = useFormContext();
  const { watch } = methods;

  const handleChangeImages = async (e) => {
    let images = methods.getValues('images') ?? [];
    const files = e.target.files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const base64 = await getBase64(files[i]);
        images.push({
          store_image_id: Math.random(),
          picture_url: base64,
        });
      }
      methods.setValue('images', images);
    }
  };

  const handleRemoveImage = (idx) => {
    const images = methods.getValues('images');
    methods.setValue(
      'images',
      images.filter((_, i) => i != idx),
    );
  };

  return (
    <div className='bw_mt_1 bw_flex bw_align_items_center'>
      {isEdit && (
        <label className='bw_choose_image_banner'>
          <input type='file' multiple accept='image/*' onChange={handleChangeImages} />
          <span className='fi fi-rr-add'></span>
        </label>
      )}
      {watch('images')
        ? watch('images').map((img, i) => (
            <div className='bw_image_view_banner' key={i}>
              <img src={img?.picture_url} />
              {isEdit && (
                <span className='bw_remove_image' onClick={() => handleRemoveImage(i)}>
                  <i className='fi fi-rr-cross-small'></i>
                </span>
              )}
            </div>
          ))
        : null}
    </div>
  );
}
