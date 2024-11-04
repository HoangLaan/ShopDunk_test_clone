import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
const { RangePicker } = DatePicker;

const BudgetPlanListFilter = ({ onChange, companyOpts }) => {
    const methods = useForm();

    const statusTypesOption = useMemo(() => [
        { label: "Tất cả", value: 3 },
        { label: "Đồng ý", value: 1 },
        { label: "Từ chối", value: 2 },
        { label: "Chưa duyệt", value: 0 },
    ], [])

    const [dateRange, changeDateRange] = useState(null);
    useEffect(() => {
        methods.reset({
            is_review: 3,
            is_active: 1,
        });
    }, [methods]);

    const onClear = () => {
        methods.reset({
            key_word: '',
            is_active: 1,
            create_date_from: null,
            create_date_to: null,
            company_id: null,
            is_review: 3,
        });
        changeDateRange(null);
        onChange({
            key_word: '',
            is_active: 1,
            create_date_from: null,
            create_date_to: null,
            company_id: null,
            is_review: 3,
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
    return (
        <FormProvider {...methods}>
            <FilterSearchBar
                title='Tìm kiếm'
                onSubmit={onChange}
                onClear={() => onClear({})}
                actions={[
                    {
                        title: 'Từ khóa',
                        component: <FormInput
                            field='key_word'
                            placeholder='Nhập tên kế hoạch'
                        />,
                    },
                    {
                        title: 'Công ty',
                        component: <FormSelect field='company_id'
                            list={companyOpts}
                        />,
                    },
                    {
                        title: 'Trạng thái duyệt',
                        component: <FormSelect field='is_review'
                            list={statusTypesOption}
                        />,
                    },
                    {
                        title: 'Ngày tạo',
                        component: (
                            <RangePicker
                                allowClear={true}
                                onChange={handleChangeDate}
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
    )
}

export default BudgetPlanListFilter