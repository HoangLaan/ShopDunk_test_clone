import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { getBase64 } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import BWImage from 'components/shared/BWImage/index';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const CustomDiv = styled.div`
  .bw_choose_image {
    width: 100%;
    border-radius: 0;
    border: none;
    background: none;
  }

  img {
    max-width: 100%;
    border-radius: 0;
    object-fit: contain;
  }
`;

const DenominationInformation = ({ disabled, title }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState('image_url', methods.formState);

  React.useEffect(() => {
    methods.register('image_url', {
      required: 'Ảnh là bắt buộc',
    });
  }, [methods]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <CustomDiv className='bw_load_image bw_mb_2 bw_text_center'>
              <label className='bw_choose_image'>
                <input
                  accept='image/*'
                  type='file'
                  onChange={async (_) => {
                    const file = await getBase64(_.target.files[0]);

                    if (file) {
                      methods.setValue('image_url', file);
                    }
                  }}
                />
                <BWImage src={methods.watch('image_url')} />
              </label>
              {error && <ErrorMessage message={error?.message} />}
              <p>Kích thước ảnh: 500px*500px.</p>
            </CustomDiv>
          </div>

          <div className='bw_col_8'>
            <FormItem className='bw_col_12' label='Giá trị mệnh giá' isRequired disabled={disabled}>
              <FormInput
                type='number'
                field='denomination_value'
                placeholder='Nhập giá trị mệnh giá'
                validation={{
                  required: 'Giá trị mệnh giá là bắt buộc',
                }}
              />
            </FormItem>

            <FormItem className='bw_col_12' label='Mô tả'>
              <FormTextArea field='description' rows={3} placeholder='Mô tả' disabled={disabled} />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};
export default DenominationInformation;
