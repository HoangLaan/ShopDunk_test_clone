import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { mapDataOptions4Select } from 'utils/helpers';
import { getOutputTypeOpts } from 'services/output-type.service';
import { getOptionsArea } from 'services/area.service';
import { getStoreOpts } from 'pages/Prices/helpers/call-api';
// import { getOptionsCompany } from 'services/company.service';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const PricesDetailFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { product_type_id: 1, is_active: 1, is_review: 4, status_apply_id: 1 } });
  // const [dateRange, changeDateRange] = useState(null);
  const [outputTypeOpts, setOutputTypeOpts] = useState([]);
  const [areaOpts, setAreaOpts] = useState([]);
  const [storeOpts, setStoreOpts] = useState([]);
  // const [companyOpts, setCompanyOpts] = useState([]);

  const fetchStoreImportOpts = (value) => {
    return getStoreOpts({
      search: value,
      is_active: 1,
    }).then((body) => {
      const _storeOpts = body.items.map((_store) => ({
        label: _store.store_name,
        value: _store.store_id,
        ..._store,
      }));

      setStoreOpts(_storeOpts);

      return _storeOpts;
    });
  };

  const getInitOpts = useCallback(async () => {
    try {
      // lấy danh sách hình thức xuất bán
      const _outputTypeOpts = await getOutputTypeOpts();
      setOutputTypeOpts(mapDataOptions4Select(_outputTypeOpts));
      // Load danh khu vực
      const _areaOpts = await getOptionsArea();
      setAreaOpts(mapDataOptions4Select(_areaOpts));
      // Lấy danh sách miền áp dụng
      fetchStoreImportOpts('');

      // Lấy danh sách công ty
      // const _companyOpts = await getOptionsCompany();

      // setCompanyOpts(mapDataOptions4Select(_companyOpts));
    } catch (error) {}
  }, []);

  useEffect(() => {
    getInitOpts();
  }, [getInitOpts]);

  const onClear = () => {
    methods.reset({
      search: '',
      output_type_id: null,
      is_review: 4,
      date_from: null,
      date_to: null,
      product_type_id: 1,
      status_apply_id: 1,
      is_active: 1,
    });
    onChange({
      search: '',
      output_type_id: null,
      is_review: 4,
      date_from: null,
      date_to: null,
      product_type_id: 1,
      status_apply_id: 1,
      is_active: 1,
    });
    // changeDateRange(null);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm sản phẩm/linh kiện'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                field='search'
                id={'search'}
                placeholder={'Nhập tên sản phẩm/linh kiện, mã sản phẩm/linh kiện'}
              />
            ),
          },
          {
            title: 'Hình thức xuất bán',
            component: <FormSelect field='output_type_id' id='output_type_id' list={outputTypeOpts} />,
          },
          {
            title: 'Khu vực',
            component: <FormSelect field='area_id' id='area_id' list={areaOpts} />,
          },
          {
            title: 'Miền',
            component: (
              <FormDebouneSelect
                field='store_id'
                id='store_id'
                list={storeOpts}
                allowClear={true}
                style={{ width: '100%' }}
                fetchOptions={fetchStoreImportOpts}
                placeholder={'-- Chọn --'}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default PricesDetailFilter;
