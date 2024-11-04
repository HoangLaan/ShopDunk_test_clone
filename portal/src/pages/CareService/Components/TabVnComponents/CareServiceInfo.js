import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
//until
import { mapDataOptions4Select } from 'utils/helpers';
import moment from 'moment';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { generateCareCode } from '../../helpers/call-api'
import { LANGUAGE_OPTIONS } from 'utils/constants';
import { TypetimepairOpts, TypepairOpts } from 'pages/CareService/helpers/constans';
import { getListOptions } from '../../helpers/call-api';
import { getListPeriod } from '../../helpers/call-api';

export default function CareServiceInfor({ disabled }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [optionsGroupService, setOptionsGroupService] = useState(null);
  const [optionsPeriod, setoptionsPeriod] = useState(null);


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



  const initGroupService = useCallback(() => {
    if (!watch('care_service_code')) {
      generateCareCode()
        .then((data) => {
          methods.reset({
            care_service_code: data
          });
        })
    }
  }, []);

  const getDataOptions = async () => {
    const keyword = watch('group_service_code');
    let listParent = await getListOptions(keyword);
    setOptionsGroupService(mapDataOptions4Select(listParent));
  };
  useEffect(() => {
    getDataOptions();
  }, []);

  const getDataPeriod = async () => {
    const keyword = watch('warranty_perio_id');
    let listPeriod = await getListPeriod(keyword);
    setoptionsPeriod(mapDataOptions4Select(listPeriod));
  };
  useEffect(() => {
    getDataPeriod();
  }, []);

  useEffect(initGroupService, [initGroupService]);

  return (
    <BWAccordion title='Thông tin dịch vụ' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Mã dịch vụ' className='bw_col_6' isRequired disabled>
          <FormInput
            type='text'
            field='care_service_code'
            placeholder='Nhập mã dịch vụ'
            maxlength='250'

            disabled
          />
        </FormItem>
        <FormItem label='Ngôn ngữ' className='bw_col_6' isRequired={true} disabled>
          <FormSelect
            field='language_id'
            disabled
            list={LANGUAGE_OPTIONS}
            value={1}
          />
        </FormItem>
        <FormItem label='Tên dịch vụ' className='bw_col_6' isRequired disabled={disabled}>
          <FormInput
            type='text'
            field='care_service_name'
            placeholder='Nhập tên dịch vụ'
            maxlength='250'
            validation={{
              required: 'Tên dịch vụ không được bỏ trống!',
            }}
            disabled={disabled}
          />
        </FormItem>
        <FormItem label='Thứ tự hiển thị' className='bw_col_6' isRequired>
          <FormInput
            type='number'
            field='order_index'
            placeholder='Thứ tự hiển thị'
            validation={{
              required: 'Vui lòng nhập kiểu số',
              pattern: {
                value: /^\d+$/,
                message: 'Vui lòng nhập kiểu số'
              }
            }}
            disabled={disabled}
          />
        </FormItem>

        <FormItem label='Nhóm dịch vụ' className='bw_col_6' isRequired={true}>
          <FormSelect
            field='group_service_code'
            value={(optionsGroupService || []).find(item => item.code === methods.watch('group_service_code'))}
            list={optionsGroupService}
            // validation={{
            //   required: 'Nhóm dịch vụ cha là bắt buộc',
            // }}
            disabled={disabled}
          />

        </FormItem>

        <div className='bw_row bw_col_6'>
          <FormItem label='Thời gian từ' className='bw_col_4' isRequired>
            <FormInput
              type='number'
              field='type_time_repair_from'
            />
          </FormItem>

          <FormItem label='Thời gian tới' className='bw_col_4' isRequired>
            <FormInput
              type='number'
              field='type_time_repair_to'
            />
          </FormItem>
          <FormItem label='Kiểu giời gian' className='bw_col_4' isRequired>
            <FormSelect field='type_time_repair' list={TypetimepairOpts.filter((_) => _.value !== 0)} />
          </FormItem>

        </div>


        <FormItem label='Lỗi thiết bị' className='bw_col_6'>
          <FormSelect field='issues_device' list={TypepairOpts.filter((_) => _.value !== 0)} />
        </FormItem>


        <FormItem label='Bảo hành' className='bw_col_6'>
          <FormSelect
            field='warranty_perio_id'
            value={(optionsPeriod || []).find(item => item.id === methods.watch('warranty_perio_id'))}
            list={optionsPeriod}
            // validation={{
            //   required: 'Nhóm dịch vụ cha là bắt buộc',
            // }}
            disabled={disabled}
          />
        </FormItem>

        <FormItem label='Link' className='bw_col_6'>
          <FormInput
            field='Link'
            placeholder='Link'

            disabled={disabled}
          />
        </FormItem>

      </div>
    </BWAccordion>
  );
}
