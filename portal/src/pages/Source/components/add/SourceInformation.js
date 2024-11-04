import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { SOURCE_TYPES } from 'utils/constants';

const SourceInformation = ({ disabled, title }) => {
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Tên nguồn khách hàng'>
              <FormInput
                type='text'
                field='source_name'
                placeholder='Nhập tên nguồn khách hàng'
                validation={{
                  required: 'Tên nguồn khách hàng là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Mô tả'>
              <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Định nghĩa nguồn khách hàng' isRequired>
              <FormRadioGroup
                field='source_type'
                custom
                list={SOURCE_TYPES}
                validation={{ required: 'Định nghĩa nguồn khách hàng chọn là bắt buộc' }}></FormRadioGroup>
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default SourceInformation;
