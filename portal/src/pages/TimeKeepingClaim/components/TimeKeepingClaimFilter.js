import React from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';
import { FormProvider, useForm } from 'react-hook-form';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import dayjs from 'dayjs';

const TimeKeepingClaimFilter = ({ onChange }) => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      date_from: dayjs().startOf('month').format('DD/MM/YYYY'),
      date_to: dayjs().format('DD/MM/YYYY')
    },
  });

  const {watch} = methods;

  const storeOptions = useGetOptions(optionType.store);
  const blockOptions = useGetOptions(optionType.block, {params: {parent_id: watch('company_id')}});
  const departmentOptions = useGetOptions(optionType.department);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          onChange({
            is_active: 1,
            search: undefined,
            store_id: undefined,
            block_id: undefined,
            department_id: undefined,
            page: 1,
          })
        }}

        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder='Nhập tên giải trình, mã nhân viên, tên nhân viên' field='search' />,
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect list={storeOptions}  field='store_id' />,
          },
          {
            title: 'Ngày công giải trình',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'date_from'}
                fieldEnd={'date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Khối áp dụng',
            component: <FormSelect list={blockOptions}  field='block_id' />,
          },
          {
            title: 'Phòng ban',
            component: <FormSelect list={departmentOptions} field='department_id' />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' id='bw_company' list={statusTypesOption} />,
          },
        ]}
        colSize={4}
      />
    </FormProvider>
  );
};

export default TimeKeepingClaimFilter;
