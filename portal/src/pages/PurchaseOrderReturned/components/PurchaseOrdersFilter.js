import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import {
  getOptionsCompany,
  getOptionsBusiness,
  getOptionsStore,
  getOptionsSupplier,
  getCustomerOptions,
} from '../helpers/call-api';
import {
  INVOICE_STATUS,
  InvoiceStatusOption,
  customerTypeOptions,
  statusPaymentOption,
  statusPurchaseOrdersOption,
} from '../utils/constants';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import moment from 'moment';
import { Spin } from 'antd';
const { RangePicker } = DatePicker;

const PurchaseOrdersFilter = ({ onChange }) => {
  const methods = useForm();
  const [dateRange, changeDateRange] = useState(null);
  const [optionsCompany, setOptionsCompany] = useState();
  const [optionsBusiness, setOptionsBusiness] = useState();
  const [optionsStore, setOptionsStore] = useState();
  const optionsSupplier = useGetOptions(optionType.supplier);
  const business_id = methods.watch('business_id');

  const getOptionsData = useCallback(() => {
    getOptionsCompany().then((data) => {
      if (data && data.length === 1) {
        methods.setValue('company_id', data[0].id);
        methods.setValue('company_name', data[0].name);
      }
      setOptionsCompany(mapDataOptions4SelectCustom(data));
    });

    getOptionsBusiness().then((data) => {
      setOptionsBusiness(mapDataOptions4SelectCustom(data));
    });
  }, []);
  useEffect(getOptionsData, [getOptionsData]);

  const getOptionsStore_ = useCallback(() => {
    if (business_id) {
      getOptionsStore({ business_id })
        .then(setOptionsStore)
        .catch((_) => {})
        .finally(() => {
          methods.setValue('store_id', '0');
        });
    } else {
      setOptionsStore([]);
    }
  }, [business_id]);
  useEffect(getOptionsStore_, [getOptionsStore_]);
  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      expected_date_from: null,
      expected_date_to: null,
      order_status: 0,
      payment_status: 3,
      supplier_id: null,
      invoice_status: INVOICE_STATUS.ALL,
      // business_id: null,
    });
    changeDateRange(null);
    onChange({
      search: '',
      is_active: 1,
      expected_date_from: null,
      expected_date_to: null,
      order_status: 0,
      payment_status: 3,
      supplier_id: null,
      // business_id: null,
      invoice_status: INVOICE_STATUS.ALL,
    });
  };

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('expected_date_from', dateString[0]);
      methods.setValue('expected_date_to', dateString[1]);
    } else {
      changeDateRange(null);
    }
  };
  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')];
  };

  const customer_type = methods.watch('customer_type');
  const [customerOptions, setCustomerOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchCustomerOptions = useCallback(() => {
    setIsLoading(true);
    getCustomerOptions({ customer_type })
      .then(setCustomerOptions)
      .finally(() => setIsLoading(false));
  }, [customer_type]);

  useEffect(fetchCustomerOptions, [fetchCustomerOptions]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập mã đơn mua hàng'} />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_name' list={optionsCompany} />,
          },
          {
            title: 'Chi nhánh nhận hàng',
            component: <FormSelect field='business_id' list={optionsBusiness} />,
          },
          {
            title: 'Cửa hàng nhận hàng',
            component: (
              <FormSelect
                field='store_id'
                list={[
                  { value: '0', label: 'Chọn tất cả' },
                  ...(optionsStore ?? []).map((e) => ({ value: e.id, label: e.name })),
                ]}
                defaultValue={'0'}
                disabled={!methods.watch('business_id') || parseInt(methods.watch('business_id')) === 0}
              />
            ),
          },
          {
            title: 'Loại khách hàng',
            component: <FormSelect field='customer_type' list={customerTypeOptions} />,
          },
          {
            title: 'Khách hàng',
            component: isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Spin />
              </div>
            ) : (
              <FormSelect disabled={!methods.watch('customer_type')} field='member_id' list={customerOptions} />
            ),
          },
          // {
          //   title: 'Ngày dự kiến hàng về',
          //   component: (
          //     <RangePicker
          //       allowClear={true}
          //       onChange={handleChangeDate}
          //       format='DD/MM/YYYY'
          //       bordered={false}
          //       placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
          //       value={dateRange ? dateRange : ''}
          //       disabledDate={(current) => {
          //         const customDate = moment().format('YYYY-MM-DD');
          //         return current && current < moment(customDate, 'YYYY-MM-DD');
          //       }}
          //     />
          //   ),
          // },
          {
            title: 'Trạng thái đơn hàng',
            component: <FormSelect field='order_status' defaultValue={0} list={statusPurchaseOrdersOption} />,
          },
          {
            title: 'Trạng thái thanh toán',
            component: <FormSelect field='payment_status' defaultValue={3} list={statusPaymentOption} />,
          },
          {
            title: 'Trạng thái hóa đơn',
            component: (
              <FormSelect field='invoice_status' defaultValue={INVOICE_STATUS.ALL} list={InvoiceStatusOption} />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default PurchaseOrdersFilter;
