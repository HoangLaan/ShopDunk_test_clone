import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { getOptionsManufacture } from 'services/product.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
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

const Filter = ({ onChange }) => {
  const dispatch = useDispatch();
  const methods = useForm();
  const [optionsManufacture, setOptionsManufacture] = useState([]);
  const { materialGroupData } = useSelector((state) => state.global);

  const fetchOptionsManufacture = (search) => getOptionsManufacture({ search, limit: 100 });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const manufactures = await fetchOptionsManufacture();
      setOptionsManufacture(mapDataOptions4Select(manufactures));

      dispatch(getOptionsGlobal('materialGroup'));
    } catch (error) {
      notification.error({ message: error.message || 'Lỗi lấy dữ liệu.' });
    }
  };

  const onSubmit = () => {
    onChange({
      search: methods.getValues('search'),
      is_active: methods.getValues('is_active') ?? 1,
      manufacturer_id: methods.getValues('manufacturer_id.value'),
      material_group_id: methods.getValues('material_group_id'),
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
      unit_id: null,
      origin_id: null,
      manufacturer_id: null,
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
                placeholder='Tên hoặc mã túi bao bì'
                field='search'
              />
            ),
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
          {
            title: 'Hãng',
            component: (
              <FormDebouneSelect
                field='manufacturer_id'
                fetchOptions={fetchOptionsManufacture}
                allowClear={true}
                placeholder='Tất cả'
                list={optionsManufacture}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' defaultValue={1} list={STATUS_OPTIONS} />,
          },
          {
            title: 'Nhóm túi bao bì',
            component: (
              <FormSelect field={'material_group_id'} list={mapDataOptions4Select(materialGroupData)} allowClear />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default Filter;
