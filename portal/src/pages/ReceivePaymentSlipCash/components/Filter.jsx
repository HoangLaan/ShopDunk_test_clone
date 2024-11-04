import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { reviewStatusOption, confirmStatusOption, typeOption, REVIEW_STATUS, CONFIRM_STATUS } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
//components
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
//services
import { getOptionsGlobal } from 'actions/global';
import { DEFAULT_PARAMS } from '../pages/ListPage';

const ReceiveSlipFilter = ({ onChange, storeOpts }) => {
  const methods = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    methods.reset(DEFAULT_PARAMS);
  }, []);

  useEffect(() => {
    if (storeOpts && storeOpts?.length > 0) {
      methods.setValue('store_id', storeOpts[0]?.value);
    }
  }, [methods, storeOpts]);

  const {
    receiveTypeData = [],
    expendTypeData = [],
    paymentFormData,
    companyData,
    businessData,
    storeData,
  } = useSelector((state) => state.global);

  const getOptionsData = useCallback(() => {
    dispatch(getOptionsGlobal('receiveType'));
    dispatch(getOptionsGlobal('expendType'));
    dispatch(getOptionsGlobal('company'));
    dispatch(getOptionsGlobal('business'));
    dispatch(getOptionsGlobal('paymentForm'));
    dispatch(getOptionsGlobal('store'));
  }, []);

  useEffect(getOptionsData, [getOptionsData]);

  const receivePaymentSlipOptions = useMemo(() => {
    const RECEIVE_TYPE = 1;
    const EXPEND_TYPE = 2;

    // merge two options and mark them
    const converedReceiveTypeData = receiveTypeData.map((item) => ({
      ...item,
      value: `${item.id}_${RECEIVE_TYPE}`,
      label: item.name,
    }));
    const converedExpendTypeData = expendTypeData.map((item) => ({
      ...item,
      value: `${item.id}_${EXPEND_TYPE}`,
      label: item.name,
    }));

    return converedReceiveTypeData.concat(converedExpendTypeData);
  }, [receiveTypeData, expendTypeData]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          onChange(DEFAULT_PARAMS);
          methods.reset(DEFAULT_PARAMS);
        }}
        col={4}
        filterSearch={1.5}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập số chứng từ, tên đối tượng, cửa hàng' />,
          },
          {
            title: 'Tên công ty',
            component: (
              <FormSelect
                onChange={(value) => {
                  const field = 'company_id';
                  methods.clearErrors(field);
                  methods.setValue(field, value);
                  dispatch(getOptionsGlobal('business', { parent_id: value || null }));
                }}
                field='company_id'
                list={mapDataOptions4SelectCustom(companyData)}
              />
            ),
          },
          {
            title: 'Miền',
            component: (
              <FormSelect
                onChange={(value) => {
                  const field = 'business_id';
                  methods.clearErrors(field);
                  methods.setValue(field, value);
                  dispatch(getOptionsGlobal('store', { parent_id: value || null }));
                }}
                field='business_id'
                list={mapDataOptions4SelectCustom(businessData)}
              />
            ),
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect field='store_id' list={storeOpts} />,
          },
          {
            title: 'Loại thu/chi',
            component: (
              <FormSelect
                field='receive_expend_type'
                onChange={(value) => {
                  methods.setValue('receive_expend_type', value);
                  if (value) {
                    const type = value.split('_')[1];
                    methods.setValue('type', Number(type));
                  }
                }}
                list={receivePaymentSlipOptions}
              />
            ),
          },
          {
            title: 'Loại chứng từ',
            component: <FormSelect field='type' list={typeOption} />,
          },
          {
            title: 'Trạng thái duyệt',
            component: <FormSelect field='review_status' list={reviewStatusOption} />,
          },
          {
            title: 'Trạng thái ghi sổ',
            component: <FormSelect field='is_book_keeping' list={confirmStatusOption} />,
          },
          {
            title: 'Ngày hạch toán',
            component: (
              <FormDateRange
                fieldStart={'accounting_date_from'}
                fieldEnd={'accounting_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default ReceiveSlipFilter;
