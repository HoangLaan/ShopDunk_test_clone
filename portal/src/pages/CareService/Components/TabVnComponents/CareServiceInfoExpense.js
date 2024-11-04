import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
//until
import moment from 'moment';
import styled from 'styled-components';
//service
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { formatPrice } from 'utils/index';
const FormNumberFormat = styled(FormNumber)``;


export default function CareServiceInfor({ disabled }) {
  const methods = useFormContext();
  const { watch, setValue, clearErrors } = methods;
  useEffect(() => {
    changeSelectDate();
  }, [watch('date_from'), watch('date_to')]);

  const changeSelectDate = () => {
    let startDate = watch('date_from');
    let endDate = watch('date_to');
    let date_from = moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let date_to = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let count = TotalDay(date_from, date_to) || 0;
    setValue('total_day', count);
  };

  const TotalDay = (startDate, endDate) => {
    let start = moment(startDate, 'YYYY-MM-DD');
    let end = moment(endDate, 'YYYY-MM-DD');
    if (start.isSame(end)) {
      return 1;
    }
    return moment.duration(end.diff(start)).asDays() + 1;
  };

  // useEffect(() => {
  //   const totalMoney = methods.watch(`cost_promotion`) + methods.watch(`cost_engineer`);
  //   methods.setValue('total_money', totalMoney);
  // }, [watch, setValue, methods]);

  return (
    <BWAccordion title='Thông tin chi phí' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Phí dịch vụ' className='bw_col_6' isRequired disabled={disabled}>
          <FormNumberFormat
            type='text'
            field='cost_service'
            placeholder=''
            maxlength='250'
            min={0}
            //style={{ textAlign: 'left' }}
            formatter={(value) => formatPrice(Math.round(value), false, ',')}
            validation={{
              required: 'Phí dịch vụ không được bỏ trống!',
              // validate: () => {
              //   const values = watch('cost_service');
              //   if (isEmptyOrSpaces(values)) {
              //     return 'Vui lòng nhập Phí dịch vụ';
              //   }
              // },
            }}
            disabled={disabled}
          />
        </FormItem>


        <FormItem label='Phí sau khuyến mãi' className='bw_col_6' isRequired disabled={disabled}>
          <FormNumberFormat
            type='text'
            field='cost_promotion'
            placeholder=''
            maxlength='250'
            min={0}
            formatter={(value) => formatPrice(Math.round(value), false, ',')}
            disabled={disabled}
          />
        </FormItem>

        <FormItem label='Phí kỹ thuật viên' className='bw_col_6'>
          <FormNumberFormat
            type='text'
            field='cost_engineer'
            placeholder=''
            // validation={{
            //   required: 'Phí kỹ thuật viên là bắt buộc',
            // }}
            disabled={disabled}
          />
        </FormItem>

        <FormItem label='Tổng phí sản phẩm' className='bw_col_6' disabled>
          <FormNumberFormat
            type='text'
            // field='total_cost_product'
            field='total_money'
            placeholder=''
            // validation={{
            //   required: 'Tổng phí sản phẩm là bắt buộc',
            // }}
            disabled={disabled}
            min={0}
            formatter={(value) => formatPrice(Math.round(value), false, ',')}
          />
        </FormItem>


      </div>
    </BWAccordion>
  );
}
