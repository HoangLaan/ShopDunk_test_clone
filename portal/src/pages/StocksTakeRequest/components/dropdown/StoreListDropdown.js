import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getListStocksWithStore } from 'services/stocks-take-request.service';
import { mapDataOptions4Select, showToast } from 'utils/helpers';

import FormSelect from 'components/shared/BWFormControl/FormSelect';

const StoreListDropdown = ({ store_id, field, disabled, onChange }) => {
  const methods = useFormContext();
  const [stocksList, setStocksList] = useState([]);
  const getListStocks = useCallback(() => {
    getListStocksWithStore(store_id)
      .then((data) => setStocksList(mapDataOptions4Select(data, 'stocks_id', 'stocks_name')))
      .catch((error) => showToast.error(error?.messsage));
  }, [store_id]);
  useEffect(getListStocks, [getListStocks]);

  return (
    <FormSelect
      disabled={disabled}
      field={field}
      mode='multiple'
      list={stocksList}
      onChange={(value) => {
        methods.clearErrors(field);
        methods.setValue(
          field,
          value.map((item) => {
            return {
              id: item,
              value: item,
            };
          }),
        );
        onChange();
      }}
      validation={{
        required: 'Kho kiểm kê là bắt buộc',
      }}
    />
  );
};

export default StoreListDropdown;
