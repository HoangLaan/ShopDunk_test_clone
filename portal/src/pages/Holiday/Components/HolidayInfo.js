import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
//until
import { mapDataOptions4Select } from 'utils/helpers';
import moment from 'moment';

//service
// import { getOptionsSolutionGroup, getOptionsStocksOutType } from 'services/solution.service';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

export default function HolidayInfor({ disabled }) {
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

  const isEmptyOrSpaces = (str) => {
    return str === null || str.match(/^\s+/) !== null;
    //check empty data or check (multiple) space data when input
  };

  return (
    <BWAccordion title='Thông tin ngày lễ tết' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Tên ngày lễ tết' className='bw_col_6' isRequired disabled={disabled}>
          <FormInput
            type='text'
            field='holiday_name'
            placeholder='Nhập tên ngày lễ tết'
            maxlength='250'
            validation={{
              required: 'Tên Ngày lễ tết không được bỏ trống!',
              validate: () => {
                const values = watch('holiday_name');
                if (isEmptyOrSpaces(values)) {
                  return 'Vui lòng nhập tên ngày lễ hợp lệ';
                }
                if (values && values.length > 250) {
                  return 'Chỉ giới hạn tên 250 kí tự';
                }
              },
            }}
            disabled={disabled}
          />
        </FormItem>
        <FormItem label='Thời gian áp dụng' className='bw_col_6' isRequired disabled={disabled}>
          <FormDateRange
            allowClear={true}
            fieldStart={'date_from'}
            fieldEnd={'date_to'}
            placeholder={['Từ ngày', 'Đến ngày']}
            validation={{
              required: 'Ngày bắt đầu và kết thúc là bắt buộc',
            }}
            format={'DD/MM/YYYY'}
          />
        </FormItem>
        <FormItem label='Số ngày' className='bw_col_6' isRequired disabled={true}>
          <FormInput type='text' field='total_day' placeholder='Tổng số ngày' disabled={true} />
        </FormItem>
        <div className='bw_col_6 bw_mt_1'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field='is_apply_work_day' disabled={disabled} />
            <span />
            Tính ngày công
          </label>
        </div>
      </div>
    </BWAccordion>
  );
}
