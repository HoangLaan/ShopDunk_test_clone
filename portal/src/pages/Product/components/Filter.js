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
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

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

const STOPSELLINGFROM_OPTIONS = [
  {
    value: 2,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Có',
  },
  {
    value: 0,
    label: 'Không',
  },
];

const STOCKTRACKING_OPTIONS = [
  {
    value: 2,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Có',
  },
  {
    value: 0,
    label: 'Không',
  },
];
const SHOWWEB_OPTIONS = [
  {
    value: 2,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Hiện',
  },
  {
    value: 0,
    label: 'Ẩn',
  },
];

const Filter = ({ onChange }) => {
  const methods = useForm();
  const { setValue } = methods;
  const [optionsUnit, setOptionsUnit] = useState([]);
  const [optionsOrigin, setOptionsOrigin] = useState([]);
  const [optionsManufacture, setOptionsManufacture] = useState([]);
  const [isShowModelSelect, setIsShowModelSelect] = useState(true);

  const fetchOptionsUnit = (search) => getOptionsUnit({ search, limit: 100 });
  const fetchOptionsOrigin = (search) => getOptionsOrigin({ search, limit: 100 });
  const fetchOptionsManufacture = (search) => getOptionsManufacture({ search, limit: 100 });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const product_category_id = methods.watch('product_category_id');

  useEffect(() => {
    setValue('model_id', null);
    setIsShowModelSelect(false);
    setTimeout(() => setIsShowModelSelect(true), 1);
  }, [product_category_id, setValue]);

  const getProductModel = async (search = '') => {
    try {
      let models = [];
      if (product_category_id) {
        const res = await getOptionsModel({ search, limit: 100, productCategoryId: product_category_id });
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
      is_stop_selling: methods.getValues('is_stop_selling') ?? 2,
      is_stock_tracking: methods.getValues('is_stock_tracking') ?? 2,
      is_active: methods.getValues('is_active') ?? 1,
      is_show_web: methods.getValues('is_show_web') ?? 2,
      unit_id: methods.getValues('unit_id.value'),
      origin_id: methods.getValues('origin_id.value'),
      manufacture_id: methods.getValues('manufacture_id.value'),
      created_date_from: methods.getValues('created_date_from'),
      created_date_to: methods.getValues('created_date_to'),
    });
  };

  const onClear = () => {
    const rsvalues = {
      search: '',
      product_category_id: null,
      model_id: null,
      is_active: 1,
      is_show_web: 2,
      is_stop_selling: methods.getValues('is_stop_selling') ?? 2,
      is_stock_tracking: methods.getValues('is_stock_tracking') ?? 2,
      unit_id: null,
      origin_id: null,
      manufacture_id: null,
      created_date_from: null,
      created_date_to: null,
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
                placeholder='Tên hoặc mã sản phẩm'
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
            component: isShowModelSelect && (
              <FormDebouneSelect
                field='model_id'
                fetchOptions={getProductModel}
                allowClear={true}
                placeholder='Tất cả'
                disabled={!product_category_id}
              />
            ),
          },

          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' defaultValue={1} list={STATUS_OPTIONS} />,
          },
          {
            title: 'Sản phẩm ngừng kinh doanh',
            component: (
              <FormSelect
                field='is_stop_selling'
                defaultValue={2}
                list={STOPSELLINGFROM_OPTIONS}
                style={{ marginTop: '5px' }}
              />
            ),
          },
          {
            title: 'Sản phẩm kiếm tra tồn kho',
            component: <FormSelect field='is_stock_tracking' defaultValue={2} list={STOCKTRACKING_OPTIONS} />,
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
          },
          {
            title: 'Hiển thị web',
            component: <FormSelect field='is_show_web' defaultValue={2} list={SHOWWEB_OPTIONS} />,
          },
          {
            title: 'Ngày tạo',
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

export default Filter;
