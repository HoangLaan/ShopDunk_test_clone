import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
//service
import { getOptionsModel } from 'services/product-category.service';
import { getOptionsStocks } from 'services/stocks.service';
import { getOptionsUser } from 'services/users.service';
import { getOptionsSupplier } from 'services/stocks-in-request.service';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { getOptionsCategory, getOptionsProduct, getOptionsUserImport } from 'services/stocks-detail.service';
//component
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

//utils
import { mapDataOptions4SelectCustom, mapDataOptions4Select } from 'utils/helpers';
import { deletedStatusOption, reviewStatusOption, stockInStatusOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { DateOptions } from '../utils/constants';
import { getListStoreByUser } from 'pages/Orders/helpers/call-api';

const StocksDetailFilter = ({ onChange }) => {
  const dispatch = useDispatch();
  const { storeData } = useSelector((state) => state.global);
  const methods = useForm({
    defaultValues: {
      is_out_of_stock: 1,
    },
  });
  // const [optionsStocks, setOptionsStocks] = useState([]);

  const [optsData, setOptsData] = useState({
    optionsCategory: [],
    optionsModel: [],
    optionsProduct: [],
  });

  const [storeOpts, setStoreOpts] = useState([]);

  const checkEmptyArray = (value) => {
    if (value && Array.isArray(value) && value.length > 0) {
      return true;
    }
    return false;
  };

  const getDataOptions = useCallback(() => {
    // getOptionsSupplier().then((data) => {
    //   setOptionsSupplier(mapDataOptions4SelectCustom(data));
    // });
    // getOptionsStocks({ type_stocks: 1 }).then((data) => {
    //   setOptionsStocks(mapDataOptions4SelectCustom(data));
    // });
    getOptionsCategory().then((dataCategory) => {
      if (checkEmptyArray(dataCategory)) {
        const optionsCategory = mapDataOptions4Select(dataCategory);
        getOptionsModel({ productCategoryId: 0 }).then((data) => {
          setOptsData({ ...optsData, optionsModel: mapDataOptions4Select(data), optionsCategory: optionsCategory });
        });
      }
    });
  }, []);
  useEffect(getDataOptions, [getDataOptions]);

  useEffect(() => {
    // if (methods.watch('category_id')) {
    getOptionsModel({ productCategoryId: methods.watch('category_id') ?? 0 }).then((data) => {
      setOptsData({ ...optsData, optionsModel: mapDataOptions4Select(data) });
    });
    // }
  }, [methods.watch('category_id')]);

  useEffect(() => {
    // if (methods.watch('category_id') && methods.watch('model_id')) {
    getOptionsProduct({
      keyword: null,
      category_id: methods.watch('category_id') ?? null,
      model_id: methods.watch('model_id') ?? null,
    }).then((data) => {
      setOptsData({ ...optsData, optionsProduct: mapDataOptions4Select(data) });
    });
    // }
  }, [methods.watch('category_id'), methods.watch('model_id')]);

  useEffect(() => {
    if (!storeData) dispatch(getOptionsGlobal('store'));
    methods.reset({
      is_out_of_stock: 1,
    });
  }, []);

  const onClear = () => {
    methods.reset({
      search: '',
      category_id: null,
      model_id: null,
      product_id: null,
      material_id: null,
      is_out_of_stock: 1,
      stocks_id: null,
      store_id: null,
      page: 1,
      store_id: null,
      inventory_status: null,
    });
    onChange({
      search: '',
      category_id: null,
      model_id: null,
      product_id: null,
      material_id: null,
      is_out_of_stock: 1,
      stocks_id: null,
      store_id: null,
      page: 1,
      inventory_status: null,
    });
  };

  // const getOptsUser = async (payload) => {
  //   return mapDataOptions4SelectCustom(await getOptionsUserImport({ user_name: payload }));
  // };
  const loadProduct = useCallback((value) => {
    // value return tu input
    return getOptionsProduct({
      keyword: value,
      category_id: methods.watch('category_id'),
      model_id: methods.watch('model_id'),
    }).then((body) =>
      body.map((data) => ({
        ...data,
        label: data?.name,
        value: data?.id,
      })),
    );
  }, []);

  const loadStock = useCallback((value) => {
    return getOptionsStocks({
      keyword: value ?? null,
      type_stocks: 1,
      store_id: methods.watch('store_id'),
    }).then((data) => mapDataOptions4SelectCustom(data));
  }, []);

  const handleChangeCategory = (value) => {
    let setValue = null;
    if (value) {
      setValue = value;
    }

    methods.setValue('category_id', setValue ?? null);
    methods.setValue('model_id', null);
    methods.setValue('product_id', null);
  };

  const fetchStoreOpts = useCallback(
    (value, isFirst = false) => {
      return getListStoreByUser({
        search: value,
        is_active: 1,
        itemsPerPage: isFirst ? 9999 : 30,
        page: 1,
      }).then((body) => {
        const _storeOpts = body.items.map((_store) => ({
          label: _store.store_name,
          value: _store.store_id,
          ..._store,
        }));

        setStoreOpts(_storeOpts);
      });
    },
    [],
  );

  useEffect(() => {
    fetchStoreOpts(null, true);
  }, [fetchStoreOpts]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        expanded={true}
        actions={[
          {
            title: 'Nhập mã IMEI',
            component: (
              <FormInput
                type='text'
                field='search'
                allowClear={true}
                placeholder='Nhập mã IMEI'
              />
            ),
          },
          {
            title: 'Ngành hàng',
            component: (
              <FormSelect
                allowClear={true}
                field='category_id'
                list={optsData.optionsCategory}
                onChange={(e) => {
                  handleChangeCategory(e);
                }}
              />
            ),
          },
          {
            title: 'Model',
            component: <FormSelect allowClear={true} field='model_id' list={optsData.optionsModel} />,
          },
          {
            title: 'Sản phẩm',
            component: (
              <FormDebouneSelect
                allowClear={true}
                fetchOptions={loadProduct}
                //defaultValue={optsData.optionsProduct}
                field='product'
                placeholder='-- Chọn --'
                onChange={(e, _) => {
                  methods.setValue('product', e?.value);
                  if (_?.is_material) {
                    methods.setValue('material_id', e?.value);
                    methods.setValue('product_id', null);
                  } else {
                    methods.setValue('product_id', e?.value);
                    methods.setValue('material_id', null);
                  }
                }}
              />
            ),
          },
          // {
          //   title: 'Ngày nhập kho',
          //   component: (
          //     <RangePicker
          //       allowClear={true}
          //       onChange={handleChangeDate}
          //       format='DD/MM/YYYY'
          //       bordered={false}
          //       placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
          //       value={dateRange ? dateRange : ''}
          //     />
          //   ),
          // },
          // {
          //   title: 'Nhà cung cấp',
          //   component: <FormSelect field='supplier_id' list={optionsSupplier} />,
          // },
          {
            title: 'Tồn kho',
            component: <FormSelect field='is_out_of_stock' allowClear={true} list={deletedStatusOption} />,
          },
          {
            title: 'Cửa hàng',
            component: (
              <FormSelect
                allowClear={true}
                field='store_id'
                list={storeOpts}
                onChange={(e, _) => {
                  methods.setValue('store_id', e ?? null);
                  methods.setValue('stocks_id', null);
                }}
              />
            ),
          },
          {
            title: 'Kho hàng',
            component: (
              <FormDebouneSelect
                allowClear={true}
                fetchOptions={loadStock}
                //defaultValue={optsData.optionsProduct}
                field='stocks_id'
                placeholder='-- Chọn --'
                onChange={(e, _) => {
                  methods.setValue('stocks_id', e?.value);
                }}
              />
            ),
            // component: <FormSelect field='stocks_id' list={optionsStocks} />,
          },
          // {
          //   title: 'Người nhập kho',
          //   component: (
          //     <FormDebouneSelect
          //       field='user_name'
          //       placeholder='--Chọn--'
          //       fetchOptions={getOptsUser}
          //       //debounceTimeout={20}
          //       style={{
          //         width: '100%',
          //       }}
          //     />
          //   ),
          // },
          {
            title: 'Kỳ báo cáo',
            component: (
              <FormSelect
                field='period'
                list={DateOptions}
                onChange={(value) => {
                  methods.setValue('period', value);
                  const selectedItem = DateOptions.find((_) => _.value === value);
                  if (selectedItem) {
                    methods.setValue('created_date_from', selectedItem.from_date);
                    methods.setValue('created_date_to', selectedItem.to_date);
                  }
                }}
              />
            ),
          },
          {
            title: 'Khoảng thời gian',
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
        ]}
      />
    </FormProvider>
  );
};

export default StocksDetailFilter;
