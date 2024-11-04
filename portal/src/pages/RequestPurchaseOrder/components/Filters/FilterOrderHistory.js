import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { MEDIUM_LIST_PARAMS } from 'utils/constants';
import { getStoreOptions } from 'services/request-purchase-order.service';
import { mapDataOptions4Select } from 'utils/helpers';

const FilterOrderHistory = ({ onChange, onClearParams, purchaseRequisitionIds }) => {
  const methods = useForm();
  const businessOptions = useGetOptions(optionType.business);

  const [storeOptions, setStoreOptions] = useState([]);

  useEffect(() => {
    getStoreOptions({ purchase_requisition_ids: purchaseRequisitionIds }).then((res) => {
      setStoreOptions(mapDataOptions4Select(res));
    });
  }, [purchaseRequisitionIds]);

  const onClear = () => {
    const initFilter = {
      search: '',
    };
    methods.reset(initFilter);
    onClearParams();
  };

  const onSubmit = () => {
    const q = {
      ...MEDIUM_LIST_PARAMS,
      search: methods.watch('search'),
      store_id: methods.watch('store_id'),
      business_id: methods.watch('business_id'),
    };
    onChange(q);
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        colSize={4}
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput onKeyDown={handleKeyDownSearch} field='search' placeholder='Nhập mã đơn hàng, imei' />
            ),
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect field='store_id' list={storeOptions} />,
          },
          {
            title: 'Chi nhánh',
            component: <FormSelect field='business_id' list={businessOptions} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterOrderHistory;
