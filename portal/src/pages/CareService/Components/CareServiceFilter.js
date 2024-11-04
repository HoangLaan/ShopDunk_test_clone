import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { getListOptions } from 'services/group-care-service.service'
import { statusTypesOption, showWebTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from './FormDateRangeCustom';
import { mapDataOptions4Select } from 'utils/helpers';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const CareServiceFilter = ({ onChange }) => {
  const methods = useForm();
  const { watch, setValue, clearErrors } = methods;
  const [optionsGroupService, setOptionsGroupService] = useState(null);
  const [dateRange, changeDateRange] = useState(null);
  useEffect(() => {
    methods.reset({
    });
  }, [methods]);


  // const onClear = () => {

  //   methods.reset({
  //     search: '',
  //     keyword: '',
  //     is_active: 1,
  //     is_show_web: 1,
  //     group_service_code: null,
  //     date_from: null,
  //     date_to: null,
  //     created_date_from: null,
  //     created_date_to: null
  //   })
  //   // changeDateRange(null)
  //   onChange({
  //     search: '',
  //     keyword: '',
  //     is_active: 1,
  //     is_show_web: 1,
  //     group_service_code: null,
  //     date_from: null,
  //     date_to: null,
  //     created_date_to: null,
  //     created_date_from: null
  //   })
  // }

  const onClear = () => {
    methods.reset({
      search: '',
      keyword: '',
      is_active: 1,
      is_show_web: 2,
      group_service_code: null,
      create_date_from: null,
      create_date_to: null,
    });
    changeDateRange(null);
    onChange({
      search: '',
      keyword: '',
      is_active: 1,
      is_show_web: 2,
      group_service_code: null,
      create_date_from: null,
      create_date_to: null,
    });
  };

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('create_date_from', dateString[0]);
      methods.setValue('create_date_to', dateString[1]);
    } else {
      changeDateRange(null);
    }
  };
  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')];
  };

  const getDataOptions = async () => {
    const keyword = watch('group_service_code');
    let listParent = await getListOptions(keyword);
    setOptionsGroupService(mapDataOptions4Select(listParent));
  };

  useEffect(() => {
    getDataOptions();
  }, []);


  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}

        onClear={() => onClear()}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Mã dịch vụ, tên dịch vụ'} />,
          },
          {
            title: 'Nhóm dịch vụ',
            component: <FormSelect field='group_service_code' list={optionsGroupService} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Hiển thị web',
            component: <FormSelect field='is_show_web' list={showWebTypesOption} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <RangePicker
                allowClear={true}
                onChange={handleChangeDate}
                style={{ width: '100%' }}
                format='DD/MM/YYYY'
                bordered={false}
                placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
                value={dateRange ? dateRange : ''}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default CareServiceFilter