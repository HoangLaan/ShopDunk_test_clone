import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsTreeview } from 'services/product-category.service';
import { getList } from 'services/product-model.service';
import { getOptionsManufacturer } from 'services/manufacturer.service';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const PricesListFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { product_type_id: 3, is_active: 1, is_review: 4, status_apply_id: 1 } });

  const [manuFacturerOpts, setManuFacturerOpts] = useState([]);
  const [productModelOpts, setProductModelOpts] = useState([]);

  const getInitOpts = useCallback(async () => {
    try {
      // Lấy danh sách nhà sản xuất
      const _manuFacturerOpts = await getOptionsManufacturer();
      setManuFacturerOpts(mapDataOptions4Select(_manuFacturerOpts));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getInitOpts();
  }, [getInitOpts]);

  const product_category_id = methods.watch('product_category_id');

  // Lấy danh sách model theo ngành hàng
  const fetchProductModelOpts = useCallback(
    (value) => {
      return getList({
        search: value,
        is_active: 1,
        product_category_id: product_category_id,
        itemsPerPage: 50,
      }).then((body) => {
        const _modelOpts = body.items.map((_store) => ({
          label: _store.model_name,
          value: _store.model_id,
          ..._store,
        }));

        setProductModelOpts(_modelOpts);

        return _modelOpts;
      });
    },
    [product_category_id],
  );

  useEffect(() => {
    fetchProductModelOpts('');
  }, [fetchProductModelOpts]);

  const onClear = () => {
    methods.reset({
      search: '',
      product_category_id: '',
      is_active: 1,
      manufacturer_id: '',
      model_id: '',
    });
    onChange({
      search: '',
      product_category_id: null,
      is_active: 1,
      manufacturer_id: null,
      model_id: null,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm sản phẩm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                field='search'
                id={'search'}
                placeholder={'Nhập tên sản phẩm, mã sản phẩm, imei sản phẩm'}
              />
            ),
          },
          {
            title: 'Thuộc ngành hàng',
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
            title: 'Model',
            component: (
              <FormDebouneSelect
                field='model_id'
                id='model_id'
                allowClear={true}
                style={{ width: '100%' }}
                fetchOptions={fetchProductModelOpts}
                placeholder={'-- Chọn --'}
                options={productModelOpts}
              />
            ),
          },
          {
            title: 'Hãng',
            component: <FormSelect field='manufacturer_id' id='manufacturer_id' list={manuFacturerOpts} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default PricesListFilter;
