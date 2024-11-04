import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { PAYMENTFORM_TYPE_OPTIONS } from '../utils/constants';

const PaymentFormFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { companyData } = useSelector((state) => state.global);

  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
  }, [companyData, dispatch]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
      payment_type: 0,
    });
  }, []);

  const onClear = () => {
    methods.reset({
      keyword: '',
      is_active: 1,
      payment_type: 0,
      company_id: null,
      created_date_from: null,
      created_date_to: null,
    });
    onChange({
      keyword: '',
      is_active: 1,
      payment_type: 0,
      company_id: null,
      created_date_from: null,
      created_date_to: null,
    });
  };

  const onSubmit = () => {
    const q = {
      keyword: methods.watch('keyword'),
      is_active: methods.watch('is_active') ?? 1,
      company_id: methods.watch('company_id'),
      payment_type: methods.watch('payment_type'),
      created_date_from: methods.watch('created_date_from'),
      created_date_to: methods.watch('created_date_to'),
    };
    onChange(q);
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.charCode === 13) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput
                        onKeyPress={handleKeyDownSearch}
                        placeholder={'Nhập tên hình thức thanh toán'}
                        field='keyword' />,
          },
          {
            title: 'Loại',
            isRequired: false,
            component: <FormSelect field='payment_type' list={PAYMENTFORM_TYPE_OPTIONS} />,
          },
          {
            title: 'Công ty',
            isRequired: false,
            component: <FormSelect field='company_id' list={mapDataOptions4SelectCustom(companyData, 'id', 'name')} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'created_date_from'}
                fieldEnd={'created_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
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
  );
};

export default PaymentFormFilter;
