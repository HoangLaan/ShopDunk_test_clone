import React, { useState, useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useAuth } from 'context/AuthProvider';
import { getOptionsForUser } from 'services/company.service';
import { getOptionsBusiness } from 'services/business.service';
import { mapDataOptions4Select } from 'utils/helpers';

const STATUS_OPTIONS = [
    {
        value: 2,
        label: 'Tất cả',
    },
    {
        value: 1,
        label: 'Kích hoạt',
    },
    {
        value: 0,
        label: 'Ẩn',
    },
];

const Filter = ({ onChange }) => {
    const { user } = useAuth();
    const methods = useForm({
      defaultValues: { is_active: 1 },
    });
    const { watch } = methods;
    const [optionsCompany, setOptionsCompany] = useState(null);
    const [optionsBusiness, setOptionsBusiness] = useState(null);

    useEffect(() => {
        methods.register('company_id');
        methods.register('is_active');
    }, [methods.register]);

    const getData = async () => {
        let _company = await getOptionsForUser(user.user_name);
        setOptionsCompany(mapDataOptions4Select(_company));
    };

    useEffect(() => {
        getData();
    }, []);

    const onSubmit = () => {
        const q = {
            search: methods.watch('search'),
            is_active: methods.watch('is_active'),
            company_id: methods.watch('company_id'),
            business_id: methods.watch('business_id'),
        };
        onChange(q);
    };

    const onClear = () => {
        methods.reset({
            search: '',
            is_active: 1,
            company_id: null,
            business_id: null,
        });
        onChange({
            search: '',
            is_active: 1,
            company_id: null,
            business_id: null,
        });
    };

    const handleChangeCompany = async (company_id) => {
        let _business = await getOptionsBusiness({
            company_id: watch('company_id'),
        });
        setOptionsBusiness(mapDataOptions4Select(_business));
        methods.setValue('company_id', company_id);
    };

    const handleKeyDownSearch = event => {
        if ((1 * event.keyCode) === 13) {
            event.preventDefault()
            onSubmit()
        }
    }

    return (
        <FormProvider {...methods}>
            <FilterSearchBar
                title='Tìm kiếm'
                onSubmit={onChange}
                onClear={onClear}
                actions={[
                    {
                        title: 'Từ khóa',
                        component: <FormInput handleKeyDown={handleKeyDownSearch} type='text' placeholder='Nhập tên nhóm' field='search' />,
                    },
                    {
                        title: 'Công ty',
                        component: <FormSelect field='company_id' placeholder="-- Chọn --" list={optionsCompany} onChange={handleChangeCompany} />
                    },
                    {
                        title: 'Miền',
                        component: <FormSelect field='business_id' placeholder="-- Chọn --" list={optionsBusiness} />
                    },
                    {
                        title: 'Trạng thái',
                        component: <FormSelect field='is_active' list={STATUS_OPTIONS} />
                    },
                ]}
            />
        </FormProvider>
    );
};

export default Filter;
