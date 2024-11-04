import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { mapDataOptions4SelectCustom } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { BUDGET_LEVEL } from '../helper/constants';
import { getBudgetPlanOptions } from 'services/compare-budget.service';

const CompareBudgetFilter = ({ onChange, onReset }) => {
  const methods = useForm();
  const dispatch = useDispatch();

  const { companyData, departmentData } = useSelector((state) => state.global);
  const [budgetPlanOptions, setBudgetPlanOptions] = useState([]);

  const onClear = () => {
    methods.reset({
      search: '',
      date_from: null,
      date_to: null,
    });

    onReset(methods.getValues());
  };

  useEffect(() => {
    dispatch(getOptionsGlobal('company'));
    dispatch(getOptionsGlobal('department'));
    getBudgetPlanOptions().then(setBudgetPlanOptions);
  }, []);

  useEffect(() => {
    dispatch(getOptionsGlobal('department', { parent_id: methods.getValues('company_id') }));
    getBudgetPlanOptions({ company_id: methods.getValues('company_id') }).then(setBudgetPlanOptions);
  }, [methods.watch('company_id')]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          onChange(v);
        }}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập mã ngân sách, tên ngân sách' maxLength={250} />,
          },
          {
            title: 'Thời gian',
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
            title: 'Cấp ngân sách',
            component: (
              <FormSelect
                field='budget_level'
                defaultValue={1}
                list={[
                  { label: 'Ngân sách cấp 1', value: BUDGET_LEVEL.LEVEL_1 },
                  { label: 'Ngân sách cấp 2', value: BUDGET_LEVEL.LEVEL_2 },
                  { label: 'Ngân sách cấp 3', value: BUDGET_LEVEL.LEVEL_3 },
                ]}
              />
            ),
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={mapDataOptions4SelectCustom(companyData)} />,
          },
          {
            title: 'Phòng ban',
            component: <FormSelect field='business_id' list={mapDataOptions4SelectCustom(departmentData)} />,
          },
          {
            title: 'Bảng ngân sách áp dụng',
            component: (
              <FormSelect
                field='budget_plan_id'
                list={mapDataOptions4SelectCustom(budgetPlanOptions)}
                onChange={(id) => {
                  methods.clearErrors('budget_plan_id');
                  methods.setValue('budget_plan_id', id);
                  const { date_from, date_to } = budgetPlanOptions.find((_) => _.id === id) || {};
                  methods.setValue('date_from', date_from);
                  methods.setValue('date_to', date_to);
                }}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default CompareBudgetFilter;
