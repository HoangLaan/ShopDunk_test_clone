import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { mapDataOptions, mapDataOptions4Select } from 'utils/helpers';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getListOrders } from 'pages/Orders/helpers/call-api';

const INIT_FILTER = {
  search: '',
  order_id: null,
};

const PurchaseHistoryFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();

  const fetchOrders = useCallback((value) => {
    return getListOrders({
      search: value,
      itemsPerPage: 50,
      page: 1,
    }).then((body) => mapDataOptions(body.items, {
      labelName: 'order_no',
      valueName: 'order_id',
    }));
  }, []);

  useEffect(() => {
    methods.reset(INIT_FILTER);
  }, []);

  const onClear = () => {
    methods.reset(INIT_FILTER);
    onClearParams();
  };

  return (
    <div className='bw_customer_filter'>
      <FormProvider {...methods}>
        <FilterSearchBar
          title='Tìm kiếm'
          onSubmit={onChange}
          onClear={onClear}
          colSize={4}
          actions={[
            {
              title: 'Từ khóa',
              component: <FormInput field='search' placeholder='Nhập tên sản phẩm, mã sản phẩm' />,
            },
            {
              title: 'Mã đơn hàng',
              component: (
                <FormDebouneSelect
                  field='customer'
                  allowClear={true}
                  style={{ width: '100%' }}
                  fetchOptions={fetchOrders}
                  debounceTimeout={700}
                  placeholder="---Chọn---"
                />
              ),
            },
          ]}
        />
      </FormProvider>
    </div>
  );
};

export default PurchaseHistoryFilter;
