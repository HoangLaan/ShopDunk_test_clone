import React from 'react';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';

//components

const Information = ({ disabled, orderId, userSchedule, isOrderFromStocksTransfer }) => {
  const methods = useFormContext({});
  const { watch, setValue, clearErrors } = methods;

  const createdDateTimestamp = watch('CREATEDDATE');

  const formattedCreatedDate = moment(createdDateTimestamp).format('DD/MM/YYYY');

  return (
    <BWAccordion title='Thông tin chung' id='bw_info_cus' isRequired={isOrderFromStocksTransfer ? false : true}>
      <div className='bw_row'>
        <FormItem label='Trạng thái duyệt' className='bw_col_6'>
          <FormInput type='text' field='APPROVALSTATUS' placeholder='' />
        </FormItem>
        <FormItem label='Người xét duyệt' className='bw_col_6'>
          <FormInput type='text' field='APPROVALUSER' />
        </FormItem>

        <FormItem label='Ghi chú duyệt' className='bw_col_6'>
          <FormInput type='text' field='REVIEWTEXT' />
        </FormItem>
        <FormItem label='Ngày xét duyệt' className='bw_col_6'>
          <FormInput type='text' value={formattedCreatedDate} field='APPROVALDATE' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default Information;
