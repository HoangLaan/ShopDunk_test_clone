import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import dayjs from 'dayjs';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

function Filter({ onChange, onClearParams }) {
  const methods = useForm();

  const userOptions = useGetOptions(optionType.user)
  const wflowOptions = useGetOptions(optionType.taskWorkFlow);
  const interestContentOptions = useGetOptions(optionType.interestContent);

  const [dateRange, setDateRange] = useState(null);
  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      setDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('date_from', dateString[0]);
      methods.setValue('date_to', dateString[1]);
    } else {
      setDateRange(null);
    }
  };
  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')];
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          onChange({
            search: '',
            staff_user: null,
            supervisor_user: null,
          })
          onClearParams()
        }}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên khách hàng' />,
          },
          {
            title: 'Người xử lý',
            component: <FormSelect field='staff_user' list={userOptions} />,
          },
          {
            title: 'Người giám sát',
            component: <FormSelect field='supervisor_user' list={userOptions} />,
          },
          {
            title: 'Nội dung quan tâm',
            component: <FormSelect field='interest_content' list={interestContentOptions} />,
          },
          {
            title: 'Ngày quan tâm',
            component: (
              <FormRangePicker
                allowClear={true}
                onChange={handleChangeDate}
                format='DD/MM/YYYY'
                bordered={false}
                placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
                value={dateRange ? dateRange : ''}
              />
            ),
          },
          {
            title: 'Trạng thái CSKH',
            component: <FormSelect field='wflow_id' id='bw_company' list={wflowOptions} allowClear />,
          },
        ]}
      />
    </FormProvider>
  );
}

export default Filter;
