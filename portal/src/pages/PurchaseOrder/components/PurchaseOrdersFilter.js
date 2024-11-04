import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsCompany, getOptionsBusiness, getOptionsStore, getOptionsSupplier } from '../helpers/call-api';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

import {
  INVOICE_STATUS,
  InvoiceStatusOption,
  statusPaymentOption,
  statusPurchaseOrdersOption,
} from '../utils/constants';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import moment from 'moment';
const { RangePicker } = DatePicker;

const PurchaseOrdersFilter = ({ onChange, onClear: onClearHandler }) => {
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
      }
      setOptionsCompany(mapDataOptions4SelectCustom(data));
    });

    getOptionsBusiness().then((data) => {
      setOptionsBusiness(mapDataOptions4SelectCustom(data));
    });
  }, []);
  useEffect(getOptionsData, [getOptionsData]);

  // load business by company
  useEffect(() => {
    if (methods.watch('company_id')) {
      getOptionsBusiness({ company_id: methods.watch('company_id') }).then((data) => {
        setOptionsBusiness(mapDataOptions4SelectCustom(data));
      });
    }
  }, [methods.watch('company_id')]);

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
    });
    onClearHandler();
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
            component: <FormInput field='search' placeholder={'Nhập mã đơn mua hàng, mã đơn đặt hàng, số hóa đơn'} />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={optionsCompany} />,
          },
          {
            title: 'Chi nhánh nhận hàng',
            component: <FormSelect field='business_id' list={optionsBusiness} />,
          },
          // {
          //   title: 'Cửa hàng nhận hàng',
          //   component: (
          //     <FormSelect
          //       field='store_id'
          //       list={[
          //         { value: '0', label: 'Chọn tất cả' },
          //         ...(optionsStore ?? []).map((e) => ({ value: e.id, label: e.name })),
          //       ]}
          //       defaultValue={'0'}
          //       disabled={!methods.watch('business_id') || parseInt(methods.watch('business_id')) === 0}
          //     />
          //   ),
          // },
          {
            title: 'Nhà cung cấp',
            component: <FormSelect field='supplier_id' list={optionsSupplier} />,
          },
          {
            title: 'Ngày dự kiến hàng về',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'expected_date_from'}
                fieldEnd={'expected_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
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
