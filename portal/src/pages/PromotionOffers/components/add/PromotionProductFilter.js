import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { notification } from 'antd';

import { getOptionsManufacture, getOptionsOrigin, getOptionsUnit } from 'services/product.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsTreeview, getOptionsModel } from 'services/product-category.service';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const STATUS_OPTIONS = [
  {
    value: 2,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Kích hoạt',
  },
  {
    value: 0,
    label: 'Ẩn',
  },
];

const PromotionProductFilter = ({ onChange, miniForm = false }) => {
  const methods = useForm();
  const [optionsUnit, setOptionsUnit] = useState([]);
  const [optionsOrigin, setOptionsOrigin] = useState([]);
  const [optionsManufacture, setOptionsManufacture] = useState([]);
  const [optionsModel, setOptionsModel] = useState([]);

  const fetchOptionsUnit = (search) => getOptionsUnit({ search, limit: 100 });
  const fetchOptionsOrigin = (search) => getOptionsOrigin({ search, limit: 100 });
  const fetchOptionsManufacture = (search) => getOptionsManufacture({ search, limit: 100 });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    getProductModel().then((res) => setOptionsModel(res));
    methods.setValue('model_id', null);
  }, [methods.watch('product_category_id')]);

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

  const loadData = async () => {
    try {
      const units = await fetchOptionsUnit();
      const origins = await fetchOptionsOrigin();
      const manufactures = await fetchOptionsManufacture();

      setOptionsUnit(mapDataOptions4Select(units));
      setOptionsOrigin(mapDataOptions4Select(origins));
      setOptionsManufacture(mapDataOptions4Select(manufactures));
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi lấy dữ liệu.' });
    }
  };

  const onSubmit = () => {
    onChange({
      search: methods.getValues('search'),
      product_category_id: methods.getValues('product_category_id'),
      model_id: methods.getValues('model_id.value'),
      is_active: methods.getValues('is_active') ?? 1,
      unit_id: methods.getValues('unit_id.value'),
      origin_id: methods.getValues('origin_id.value'),
      manufacture_id: methods.getValues('manufacture_id.value'),
      page: 1,
    });
  };

  const onClear = () => {
    const rsvalues = {
      search: '',
      product_category_id: null,
      model_id: null,
      is_active: 1,
      unit_id: null,
      origin_id: null,
      manufacture_id: null,
      page: 1,
    };

    methods.reset(rsvalues);
    onChange(rsvalues);
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
        onSubmit={onSubmit}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                onKeyDown={handleKeyDownSearch}
                type='text'
                placeholder='Nhập mã, tên hàng hóa'
                field='search'
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
            title: 'Model sản phẩm',
            component: (
              <FormDebouneSelect
                field='model_id'
                fetchOptions={getProductModel}
                allowClear={true}
                placeholder='Tất cả'
                list={optionsModel}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormInput value='Kích hoạt' disabled />,
            hidden: miniForm,
          },
          {
            title: 'Hãng',
            component: (
              <FormDebouneSelect
                field='manufacture_id'
                fetchOptions={fetchOptionsManufacture}
                allowClear={true}
                placeholder='Tất cả'
                list={optionsManufacture}
              />
            ),
          },
          {
            title: 'Đơn vị tính',
            component: (
              <FormDebouneSelect
                field='unit_id'
                fetchOptions={fetchOptionsUnit}
                allowClear={true}
                placeholder='Tất cả'
                list={optionsUnit}
              />
            ),
            hidden: miniForm,
          },
          {
            title: 'Xuất xứ',
            component: (
              <FormDebouneSelect
                field='origin_id'
                fetchOptions={fetchOptionsOrigin}
                allowClear={true}
                placeholder='Tất cả'
                list={optionsOrigin}
              />
            ),
            hidden: miniForm,
          },
        ]}
      />
    </FormProvider>
  );
};

export default PromotionProductFilter;
