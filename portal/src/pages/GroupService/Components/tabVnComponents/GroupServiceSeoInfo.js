import React from 'react';
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
              field='seo_name'
              placeholder='Tên trang'
              // validation={{
              //   required: 'Tên trang là bắt buộc',
              // }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Tiêu đề meta'>
            <FormInput
              type='text'
              field='meta_title'
              placeholder='Tiêu đề meta'
              // validation={{
              //   required: 'Tiêu đề meta là bắt buộc',
              // }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Từ khóa meta'>
            <FormInput
              type='text'
              field='meta_key_words'
              placeholder='Từ khóa meta'
              // validation={{
              //   required: 'Từ khóa meta là bắt buộc',
              // }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mô tả meta'>
            <FormTextArea
              type='text'
              field='meta_description'
              placeholder='Mô tả meta'
              // validation={{
              //   required: 'Mô tả meta là bắt buộc',
              // }}
              disabled={disabled}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}
