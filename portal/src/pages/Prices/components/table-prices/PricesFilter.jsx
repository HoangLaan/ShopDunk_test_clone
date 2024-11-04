import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePicker } from 'antd';

import { mapDataOptions4Select, reviewStatusOption, showToast, statusTypesOption } from 'utils/helpers';
import { getOutputTypeOpts } from 'services/output-type.service';
import { getOptionsArea } from 'services/area.service';
import { getStoreOpts } from 'pages/Prices/helpers/call-api';
import { getOptionsCompany } from 'services/company.service';
import { getOptionsTreeview, getOptionsModel } from 'services/product-category.service';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const { RangePicker } = DatePicker;

const PricesListFilter = ({ onChange, onRefresh, defaultValueFilter, paramsStatus }) => {
  const methods = useForm({ defaultValues: { product_type_id: 0, is_active: 1, is_review: 4, status_apply_id: 2 } });
  const { setValue } = methods;
  const [dateRange, changeDateRange] = useState(null);
  const [outputTypeOpts, setOutputTypeOpts] = useState([]);
  const [areaOpts, setAreaOpts] = useState([]);
  const [companyOpts, setCompanyOpts] = useState([]);
  const [isShowModelSelect, setIsShowModelSelect] = useState(true);

  const [statusApplyOpts] = useState([
    { value: 4, label: 'Tất cả' },
    { value: 2, label: 'Đang áp dụng' },
    { value: 1, label: 'Hết hạn' },
    { value: 3, label: 'Chưa áp dụng' },
  ]);

  const checkArray = (value, valueDefault = false) => {
    if (value && Array.isArray(value)) {
      return true;
    }
    return false;
  };

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

      // setStoreOpts(_storeOpts);

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
      const _companyOpts = await getOptionsCompany();

      if (checkArray(_companyOpts)) {
        if (_companyOpts.length === 1) {
          methods.setValue('company_id', _companyOpts[0]?.id);
        }
      }

      setCompanyOpts(mapDataOptions4Select(_companyOpts));
    } catch (error) {}
  }, []);

  useEffect(() => {
    methods.setValue('status_apply_id', paramsStatus)
  }, [paramsStatus]);

  useEffect(() => {
    getInitOpts();
  }, [getInitOpts]);

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('date_from', dateString[0]);
      methods.setValue('date_to', dateString[1]);
    } else {
      changeDateRange(null);
    }
  };

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
      showToast.error(error.message || 'Lỗi lấy model sản phẩm.');
    }
  };

  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')];
  };

  const onClear = () => {
    methods.reset({ ...defaultValueFilter });
    onRefresh();
    changeDateRange(null);
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
            component: <FormInput field='search' id={'search'} placeholder={'Nhập tên sản phẩm, mã sản phẩm, imei sản phẩm'} />,
          },
          {
            title: 'Hình thức xuất bán',
            component: <FormSelect field='output_type_id' id='output_type_id' list={outputTypeOpts} />,
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
                onChange={(e, options) => {
                  methods.clearErrors('model_id');
                  methods.setValue('model_id', options?.id || null);
                }}
              />
            ),
          },
          {
            title: 'Công ty áp dụng',
            component: <FormSelect field='company_id' id={'company_id'} list={companyOpts} />,
          },
          {
            title: 'Khu vực',
            component: <FormSelect field='area_id' id='area_id' list={areaOpts} />,
          },

          {
            title: 'Trạng thái duyệt',
            component: <FormSelect field='is_review' id='is_review' list={reviewStatusOption} />,
          },
          {
            title: 'Trạng thái áp dụng',
            component: <FormSelect field='status_apply_id' id='status_apply_id' list={statusApplyOpts} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <RangePicker
                allowClear={true}
                onChange={handleChangeDate}
                format='DD/MM/YYYY'
                bordered={false}
                style={{ width: '100%' }}
                placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
                value={dateRange ? dateRange : ''}
              />
            ),
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={1} list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default PricesListFilter;
