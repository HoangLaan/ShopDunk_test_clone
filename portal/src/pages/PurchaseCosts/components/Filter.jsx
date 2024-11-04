import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { reviewStatusOption, confirmStatusOption } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
//components
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
//services
import { getOptionsGlobal } from 'actions/global';
import { statusPaymentFormOption } from 'pages/PurchaseOrder/utils/constants';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const PurchaseCostsFilter = ({ onChange }) => {
  const optionsSupplier = useGetOptions(optionType.supplier)
  const methods = useForm();
  const dispatch = useDispatch();
  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  const { paymentFormData } = useSelector((state) => state.global);

  const getOptionsData = useCallback(() => {
    dispatch(getOptionsGlobal('paymentForm'));
  }, []);

  useEffect(getOptionsData, [getOptionsData]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onChange({})}
        colSize={4}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập Số chứng từ, Mã đơn mua hàng, Mã phiếu nhập kho ' />,
          },
          {
            title: 'Tên nhà cung cấp',
            component: <FormSelect field='supplier_search' list={optionsSupplier} placeholder='Nhập Nhà cung cấp' />,
          },
          {
            title: 'Trạng thái thanh toán',
            component: <FormSelect field='is_payments_status_id' list={mapDataOptions4SelectCustom(statusPaymentFormOption)} />,
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

export default PurchaseCostsFilter;
