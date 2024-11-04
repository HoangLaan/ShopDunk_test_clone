import React from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';

const SEOEGInfo = ({ id, title, nameInstanceBusiness, isShowStore = false }) => {
  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row bw_mt_1'>
        {/* <FormItem label='Chi nhánh' className='bw_col_4' disabled>
          <FormInput type='text' field={`${nameInstanceBusiness}.business_name`} disabled placeholder='Chi nhánh' />
        </FormItem> */}
        <FormItem label='Tên trang' className='bw_col_6'>
          <FormInput type='text' field={'METATITLE'} placeholder='Tên trang' />
        </FormItem>

        <FormItem label='Từ khóa meta' className='bw_col_6'>
          <FormInput type='text' field='SEONAME' />
        </FormItem>
        <FormItem label='Tiêu đề meta' className='bw_col_6'>
          <FormInput type='text' field={'METAKEYWORDS'} placeholder='Tiêu đề meta' />
        </FormItem>
        <FormItem label='Mô tả meta' className='bw_col_6'>
          <FormInput type='text' field={'METADESCRIPTION'} placeholder='Mô tả meta' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default SEOEGInfo;
