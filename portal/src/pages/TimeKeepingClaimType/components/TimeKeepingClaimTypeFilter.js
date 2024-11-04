import React from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';
import { FormProvider, useForm } from 'react-hook-form';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const TimeKeepingClaimTypeFilter = ({ onChange }) => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const {watch} = methods;

  const companyOptions = useGetOptions(optionType.company);
  const blockOptions = useGetOptions(optionType.block, {params: {parent_id: watch('company_id')}});
  const departmentOptions = useGetOptions(optionType.department);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            is_active: 1,
            search: undefined,
            company_id: undefined,
            block_id: undefined,
            department_id: undefined,
            page: 1
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder='Nhập tên loại giải trình' field='search' />,
          },
          {
            title: 'Công ty áp dụng',
            component: <FormSelect list={companyOptions}  field='company_id' />,
          },
          {
            title: 'Khối áp dụng',
            component: <FormSelect list={blockOptions}  field='block_id' />,
          },
          {
            title: 'Phòng ban',
            component: <FormSelect list={departmentOptions} field='department_id' />,
          },
          // {
          //   title: 'Thời gian tạo',
          //   component: (
          //     <FormDateRange
          //       allowClear={true}
          //       fieldStart={'create_date_from'}
          //       fieldEnd={'create_date_to'}
          //       placeholder={['Từ ngày', 'Đến ngày']}
          //       format={'DD/MM/YYYY'}
          //     />
          //   ),
          // },
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

export default TimeKeepingClaimTypeFilter;
