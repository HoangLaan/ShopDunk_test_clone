import React, { useCallback, useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { statusTypesOption } from 'utils/helpers';
const { RangePicker } = DatePicker;

const OffworkManagementFilter = ({ onChange }) => {
const methods = useForm();
  const companyOpts =  useGetOptions(optionType.company);
  const blockOpts = useGetOptions(optionType.block);
  const departmentOpts = useGetOptions(optionType.department);
  const storeOpts = useGetOptions(optionType.store);
  const onClear = () => {
    methods.reset({});
    onChange({});
  };
  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder={'Tên nhân viên'} />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' id='type' list={companyOpts} />,
          },
           {
            title: 'Khối',
            component: <FormSelect field='block_id' id='type' list={blockOpts} />,
          },
          {
            title: 'Phòng ban',
            component: <FormSelect field='department_id' id='type' list={departmentOpts} />,
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect field='store_id' id='type' list={storeOpts} />,
          },

          {
            title: 'Trạng thái',
            component: <FormSelect field='status' id='status' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default OffworkManagementFilter;
