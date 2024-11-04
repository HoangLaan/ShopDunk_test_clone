import React from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';

const BusinessInfo = ({ id, title, nameInstanceBusiness, isShowStore = false }) => {
  const methods = useFormContext({});

  const { watch, setValue, clearErrors } = methods;

  const createdDateTimestamp = watch('CREATEDDATE');

  const formattedCreatedDate = moment(createdDateTimestamp).format('DD/MM/YYYY');

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row bw_mt_1'>
        {/* <FormItem label='Chi nhánh' className='bw_col_4' disabled>
          <FormInput type='text' field={`${nameInstanceBusiness}.business_name`} disabled placeholder='Chi nhánh' />
        </FormItem> */}
        <FormItem label='Rating' className='bw_col_6'>
          <FormInput type='text' field={'RATING'} placeholder='Rating' />
        </FormItem>

        <FormItem label='Ngày đánh giá' className='bw_col_6'>
          <FormInput type='text' value={formattedCreatedDate} field='CREATEDDATE' />
        </FormItem>
        <FormItem label='Nội dung đánh giá' className='bw_col_8'>
          <FormInput type='text' field={'CONTENT'} placeholder='Nội dung đánh giá' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default BusinessInfo;
