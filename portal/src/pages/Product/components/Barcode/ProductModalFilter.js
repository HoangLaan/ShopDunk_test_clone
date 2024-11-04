import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { notification } from 'antd';

import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsTreeview, getOptionsModel } from 'services/product-category.service';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import { getManufacturerOptions } from 'services/product.service';

const ProductModalFilter = ({ setData, getData, data, setProductSelected }) => {
  const methods = useForm();
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [optionsModel, setOptionsModel] = useState(null);
  const onSubmit = () => {
    setData((t) => ({ ...t, query: { 
      ...t.query,
      search: methods.watch('search'),
      manufacturer_id: methods.watch('manufacturer_id'),
      product_model_id: methods.watch('product_model_id')?.value,
      product_category_id: methods.watch('product_category_id') 
    } }))
    getData({ 
       search: methods.watch('search'),
       manufacturer_id: methods.watch('manufacturer_id'),
       product_model_id: methods.watch('product_model_id')?.value,
       product_category_id: methods.watch('product_category_id')
    })
    
  };

  const onClear = () => {
    setData((t) => ({ ...t, query: { 
      ...t.query,
      search: '',
      manufacturer_id: undefined,
      product_model_id: undefined,
      product_category_id: undefined,
      page: 1
    } }))
    getData({ 
       search: '',
       manufacturer_id: undefined,
       product_model_id: undefined,
       product_category_id: undefined,
       page: 1
    })
    methods.reset({
      ...methods.getValues(),
       search: '',
       manufacturer_id: undefined,
       product_model_id: undefined,
       product_category_id: undefined
    });
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      getData(data.query);
    }
  };

  useEffect(() => {
    let products = methods.watch('products');
    if (products && products.length) {
      setProductSelected(
        Object.assign(
          {},
          ...products.map((pro) => {
            return { [pro.product_id]: pro };
          }),
        ),
      );
    }

    getManufacturerOptions().then((res) => {
      setManufacturerOptions(mapDataOptions4SelectCustom(res));
    });
  }, []);

  const getProductModel = async (search = '') => {
    try {
      const productCategoryId = methods.getValues('product_category_id');
      let models = [];
      if (productCategoryId) {
        const res = await getOptionsModel({ search, limit: 100, productCategoryId });
        models = mapDataOptions4Select(res);
      }
      return models;
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi lấy model sản phẩm.' });
    }
  };

  const handleChangeCategory = (value) => {
    methods.setValue('product_category_id', value);
    getProductModel().then((res) => setOptionsModel(res));
    methods.setValue('product_model_id', null);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onSubmit}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                placeholder='Mã, tên sản phẩm'
                onKeyDown={handleKeyDownSearch}
                field='search'
              />
            ),
          },
          {
            title: 'Hãng',
            component: (
              <FormSelect field='manufacturer_id' allowClear={true} list={[{value: 0, label: 'Tất cả'}, ...manufacturerOptions]} />
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
              onChange={handleChangeCategory}
            />
            ),
          },
          {
            title: 'Model',
            component: (
              <FormDebouneSelect
                    field='product_model_id'
                    fetchOptions={getProductModel}
                    allowClear={true}
                    placeholder={'--Chọn--'}
                    list={optionsModel}
                  />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default ProductModalFilter;
