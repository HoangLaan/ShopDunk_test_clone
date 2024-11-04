import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';

const { RangePicker } = DatePicker;

const initFilter = {
  search: '',
  is_active: 1,
  create_date_from: null,
  create_date_to: null,
};

const SkillGroupFilter = ({ onChange,onClearParams }) => {
    const methods = useForm();
    const [dateRange, changeDateRange] = useState(null);

    useEffect(() => {
        methods.reset({
            is_active: 1,
        });
    }, [methods]);

    const onClear = () => {
        methods.reset(initFilter);
        changeDateRange(null);
        onClearParams(initFilter);
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
                colSize={4}
                actions={[
                    {
                        title: 'Từ khóa',
                        component: <FormInput field='search'
                            placeholder='Tên nhóm kỹ năng'
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
                    {
                        title: 'Trạng thái',
                        component: <FormSelect field='is_active' list={statusTypesOption} />,
                    },
                ]}
            />
        </FormProvider>
    )
}

export default SkillGroupFilter