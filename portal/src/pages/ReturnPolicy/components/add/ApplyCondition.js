import React, { useCallback, useEffect, useMemo } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { useFormContext } from 'react-hook-form';

const ApplyCondition = ({ disabled, title, isReturn }) => {
  const { watch, setValue } = useFormContext();
  const { monthStart, yearStart, monthEnd, yearEnd, maxDay } = useMemo(() => {
    const [dayStart, monthStart, yearStart] = watch('start_date')?.split('/') ?? [];
    const [dayEnd, monthEnd, yearEnd] = watch('end_date')?.split('/') ?? [];
    return {
      monthStart: parseInt(monthStart),
      yearStart: parseInt(yearStart),
      monthEnd: parseInt(monthEnd),
      yearEnd: parseInt(yearEnd),
      maxDay: monthStart === monthEnd ? parseInt(dayEnd) - parseInt(dayStart) + 1 : 30,
    };
  }, [watch('start_date'), watch('end_date')]);
  const isApplyDiscountMonth = monthStart && monthEnd ? true : false;
  const isApplyFirstMonth = watch('is_apply_first_month') === 1;
  const isApplyFromMonth = watch('is_apply_from_month') === 1;
  const fromMonth = watch('from_month');
  const toMonth = watch('to_month');

  const calculateDaysBetweenTwoMonths = useCallback(() => {
    const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
    return daysInMonth(fromMonth, yearStart) + daysInMonth(toMonth, yearEnd);
  }, []);

  useEffect(() => {
    if (isApplyFromMonth) {
      setValue('number_return_day', calculateDaysBetweenTwoMonths());
    }
  }, [fromMonth, toMonth]);

  const numberReturnDay = watch('number_return_day');
  useEffect(() => {
    if (numberReturnDay) {
      setValue('is_apply_first_month', 1);
    }
  }, [numberReturnDay]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <label style={{ marginBottom: '1em' }} className='bw_checkbox'>
            <FormInput disabled={disabled} type='checkbox' field='is_apply_discount_product' />
            <span />
            Áp dụng với sản phẩm giảm giá
          </label>
          <label style={{ marginBottom: '1em' }} className='bw_checkbox'>
            <FormInput disabled={disabled} type='checkbox' field='is_apply_discount_order' />
            <span />
            Áp dụng với đơn hàng giảm giá
          </label>
          {isReturn === 1 && (
            <label style={{ marginBottom: '1em' }} className='bw_checkbox'>
              <FormInput disabled={disabled} type='checkbox' field='is_exchange_lower_price_product' />
              <span />
              Được đổi sản phẩm có giá thấp hơn
            </label>
          )}
          <label style={{ marginBottom: '1em' }} className='bw_checkbox'>
            <FormInput disabled={disabled} type='checkbox' field='is_other_condition' />
            <span />
            Khách hàng chi trả các chi phí khác: chi phí đóng gói, vận chuyển, chênh lệch đơn giá, ...
          </label>
        </div>
        {isApplyDiscountMonth && (
          <>
            <div className='bw_col_12'>
              {!isApplyFromMonth && (
                <div className='bw_row'>
                  <div className='bw_col_8'>
                    <label style={{ marginBottom: '1em' }} className='bw_checkbox'>
                      <FormInput disabled={disabled} type='checkbox' field='is_apply_first_month' />
                      <span />
                      Áp dụng từ tháng đầu tiên kể từ ngày mua sản phẩm
                    </label>
                  </div>
                  <div className='bw_col_4'>
                    {isApplyFirstMonth && (
                      <FormItem label={'Trong vòng (ngày)'} disabled={disabled}>
                        <FormNumber min={1} max={maxDay} type='number' field='number_return_day' />
                      </FormItem>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className='bw_col_12'>
              {!isApplyFirstMonth && monthStart !== monthEnd && (
                <div className='bw_row'>
                  <div className='bw_col_8'>
                    <label style={{ marginBottom: '1em' }} className='bw_checkbox'>
                      <FormInput disabled={disabled} type='checkbox' field='is_apply_from_month' />
                      <span />
                      Áp dụng từ tháng {fromMonth ?? '...'} đến tháng {toMonth ?? '...'} kể từ ngày mua sản phẩm
                    </label>
                  </div>
                  <div className='bw_col_4'>
                    {isApplyFromMonth && (
                      <div className='bw_row'>
                        <div className='bw_col_6'>
                          <FormItem label={'Từ tháng'} disabled={disabled}>
                            <FormNumber min={monthStart} type='number' field='from_month' />
                          </FormItem>
                        </div>
                        <div className='bw_col_6'>
                          <FormItem label={'Đến tháng'} disabled={disabled}>
                            <FormNumber type='number' field='to_month' />
                          </FormItem>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </BWAccordion>
  );
};
export default ApplyCondition;
