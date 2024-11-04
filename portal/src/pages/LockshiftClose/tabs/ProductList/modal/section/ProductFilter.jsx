import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { getOptionsTreeview } from 'services/product-category.service';
import { getOptionsGlobal } from 'actions/global';

import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const LockshiftFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_active: 1 } });
  const dispatch = useDispatch();

  const { storeData, stocksData, manufacturerData, productModelData } = useSelector((state) => state.global);

  const onClear = () => {
    methods.reset({
      store_id: null,
      shift_id: null,
      search: null,
    });

    onChange({
      store_id: null,
      shift_id: null,
      search: null,
    });
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      onSubmit();
    }
  };

  const onSubmit = () => {
    onChange({
      search: methods.getValues('search'),
    });
  };

  useEffect(() => {
    dispatch(getOptionsGlobal('store'));
    dispatch(getOptionsGlobal('stocks'));
    dispatch(getOptionsGlobal('manufacturer'));
    dispatch(getOptionsGlobal('productCategory'));
    dispatch(getOptionsGlobal('productModel'));
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        colSize={4}
        expanded
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                field='search'
                placeholder={'Mã hoặc tên hàng hóa, vật tư'}
                onKeyDown={handleKeyDownSearch}
                type='text'
              />
            ),
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect field='store_id' id='store_id' list={mapDataOptions4SelectCustom(storeData)} />,
          },
          {
            title: 'Kho',
            component: <FormSelect field='stocks_id' id='stocks_id' list={mapDataOptions4SelectCustom(stocksData)} />,
          },
          {
            title: 'Hãng',
            component: (
              <FormSelect
                field='manufacture_id'
                id='manufacture_id'
                list={mapDataOptions4SelectCustom(manufacturerData)}
              />
            ),
          },
          {
            title: 'Ngành hàng',
            component: (
              <FormTreeSelect
                field='product_category_id'
                allowClear={true}
                treeDataSimpleMode
                fetchOptions={getOptionsTreeview}
                placeholder='Tất cả'
              />
            ),
          },
          {
            title: 'Model hàng hóa - vật tư',
            component: (
              <FormSelect
                field='product_model_id'
                id='product_model_id'
                list={mapDataOptions4SelectCustom(productModelData)}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default LockshiftFilter;
