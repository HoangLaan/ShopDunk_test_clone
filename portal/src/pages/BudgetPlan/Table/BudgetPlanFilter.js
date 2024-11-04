/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { getListDepartment } from '../helper/call-api';
import { useAuth } from 'context/AuthProvider';

const BudgetPlanFilter = ({ onChange, companyOpts, budgetPlanOpts }) => {
    const methods = useForm();
    const { user } = useAuth()

    const [departmentOpts, setDepartmentOpts] = useState([])
    const [year, setYear] = useState(null);

    useEffect(() => {
        methods.reset({
            is_active: 1,
            company_id: user.isAdministrator === 1 ? null : user.company_id,
            year: (new Date()).getFullYear(),
            budget_plan_id: budgetPlanOpts[0]?.value,
        });
    }, [methods, budgetPlanOpts]);

    const getListDepartmentOpts = async (value) => {
        try {
            let departmentOpts = await getListDepartment({ company_id: value })
            setDepartmentOpts(mapDataOptions4SelectCustom(departmentOpts))
        } catch (error) {
            showToast.error(error.message);
        }
    }
    useEffect(() => {
        if (methods.watch('company_id')) {
            getListDepartmentOpts(methods.watch('company_id'))
        }
    }, [methods.watch('company_id')])

    const onClear = () => {
        methods.reset({
            key_word: '',
            is_active: 1,
            year: (new Date()).getFullYear(),
            company_id: user.isAdministrator === 1 ? null : user.company_id,
            budget_plan_id: budgetPlanOpts[0]?.value,
            department_id: null,

        });
        setYear(null)
        onChange({
            key_word: '',
            is_active: 1,
            year: (new Date()).getFullYear(),
            company_id: user.isAdministrator === 1 ? null : user.company_id,
            budget_plan_id: budgetPlanOpts[0]?.value,
            department_id: null,

        });
    };

    const handleChangeDate = (date, dateString) => {
        console.log(date);
        setYear(date)
        methods.setValue('year', dateString)
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
                        component: <FormInput field='key_word'
                            placeholder='Nhập mã ngân sách , tên ngân sách'
                        />,
                    },
                    {
                        title: 'Công ty',
                        component:
                            <FormSelect
                                field='company_id'
                                list={companyOpts}
                            />,
                    },
                    {
                        title: 'Phòng ban',
                        component: <FormSelect
                            field='department_id'
                            list={departmentOpts}
                        />,
                    },
                    {
                        title: 'Kế hoạch ngân sách',
                        component: <FormSelect
                            field='budget_plan_id'
                            list={budgetPlanOpts}
                        />,
                    },
                    {
                        title: 'Năm',
                        component: (
                            <DatePicker
                                allowClear={true}
                                onChange={handleChangeDate}
                                bordered={false}
                                picker="year"
                                style={{
                                    width: '100%',
                                }}
                                value={year || null}
                                placeholder={'--Chọn--'}
                            />
                        ),
                    },
                ]}
            />
        </FormProvider>
    )
}

export default BudgetPlanFilter