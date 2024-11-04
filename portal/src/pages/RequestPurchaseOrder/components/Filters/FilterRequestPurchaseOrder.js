import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { getOptions } from 'pages/RequestPurchaseOrder/helpers/utils';
import { STATUS_TYPES } from 'utils/constants';
import { STATUS_ORDER, STATUS_ORDER_OPTIONS, STATUS_REVIEW, STATUS_REVIEW_OPTIONS } from 'pages/RequestPurchaseOrder/helpers/constants';

const FilterRequestPurchaseOrder = ({ onChange, onClear }) => {
  const methods = useForm();
  const [optionsSupplier, setOptionsSupplier] = useState([]);

  useEffect(() => {
    const getDataOptions = async () => {
      const _supplier = await getOptions('supplier')
      setOptionsSupplier(mapDataOptions4Select(_supplier));
    };
    getDataOptions();
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          onClear()
          const initFilter = {
            search: '',
            is_active: STATUS_TYPES.ACTIVE,
            is_reviewed: STATUS_REVIEW.ALL,
            is_ordered: STATUS_ORDER.ALL
          };
          methods.reset(initFilter);
        }}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập mã đơn đặt hàng, người đặt hàng, tên sản phẩm' />,
          },
          {
            title: 'Trạng thái duyệt',
            component: <FormSelect field='is_reviewed' defaultValue={STATUS_REVIEW.ALL} list={STATUS_REVIEW_OPTIONS} />,
          },
          {
            title: 'Trạng thái đặt hàng',
            component: <FormSelect field='is_ordered' defaultValue={STATUS_ORDER.ALL} list={STATUS_ORDER_OPTIONS} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                style={{ width: '100%' }}
                fieldStart={'from_date'}
                fieldEnd={'to_date'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Nhà cung cấp',
            component: <FormSelect field='supplier_id' list={optionsSupplier} />,
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterRequestPurchaseOrder;
