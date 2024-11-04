import React from 'react';
//until
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';


export default function GroupServiceSeoInfo({ disabled }) {

  return (
    <BWAccordion title='Thông tin SEO'>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên trang'>
            <FormInput
              type='text'
              field='seo_name_en'
              placeholder='Tên trang'
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Tiêu đề meta'>
            <FormInput
              type='text'
              field='meta_title_en'
              placeholder='Tiêu đề meta'
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Từ khóa meta'>
            <FormInput
              type='text'
              field='meta_key_words_en'
              placeholder='Từ khóa meta'
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mô tả meta'>
            <FormTextArea
              type='text'
              field='meta_description_en'
              placeholder='Mô tả meta'
              disabled={disabled}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}
