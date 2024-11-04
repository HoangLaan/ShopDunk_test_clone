import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption, mapDataOptions4Select } from 'utils/helpers';
import { notification } from 'antd';

import { getListStocksTypeOptions, getListStoreOptionsByParam } from '../helpers/call-api';
import { getOptionsGlobal } from 'actions/global';

const StocksFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { companyData, businessData, areaData } = useSelector((state) => state.global);
  const [listStocksTypeOpts, setListStocksTypeOpts] = useState([]);
  const [storeOpts, setStoreOpts] = useState([]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  useEffect(() => {
    getDataFilter();
  }, []);

  const getDataFilter = async () => {
    try {
      let data = await getListStocksTypeOptions();
      data = data.map(({ stocks_type_id, stocks_type_name, stocks_type_code }) => ({
        value: stocks_type_id,
        label: stocks_type_name,
        stocks_type_code,
      }));
      setListStocksTypeOpts(data);
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };

  const initFilter = {
    search: null,
    is_active: 1,
    create_date_from: null,
    create_date_to: null,
    province_id: null,
    district_id: null,
    ward_id: null,
    stocks_type_id: null,
    company_id: null,
    business_id: null,
    area_id: null,
    store_id: null,
  };

  const onClear = () => {
    methods.reset(initFilter);
    onClearParams(initFilter);
  };

  //Address
  useEffect(() => {
    dispatch(getOptionsGlobal('area'));
    dispatch(getOptionsGlobal('company'));
  }, []);

  useEffect(() => {
    dispatch(
      getOptionsGlobal('business', {
        company_id: methods.watch('company_id'),
      }),
    );
  }, [methods.watch('company_id')]);

  const getDataStore = async () => {
    try {
      const params = {
        company_id: methods.watch('company_id'),
        area_id: methods.watch('area_id'),
        business_id: methods.watch('business_id'),
      };
      let dataStoreOpts = await getListStoreOptionsByParam(params);
      dataStoreOpts = dataStoreOpts.map(({ store_id, store_name, store_code, ...x }) => ({
        value: store_id,
        label: store_name,
        store_code,
        ...x,
      }));
      setStoreOpts(dataStoreOpts);
    } catch (error) {
      notification.error({ message: `Có lỗi xảy ra.` });
    }
  };

  useEffect(() => {
    getDataStore();
  }, [methods.watch('business_id'), methods.watch('area_id')]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập mã kho hoặc tên kho'} />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={mapDataOptions4Select(companyData ?? [])} />,
          },
          {
            title: 'Miền',
            component: (
              <FormSelect
                disabled={!methods.watch('company_id')}
                field='business_id'
                list={mapDataOptions4Select(businessData ?? [])}
              />
            ),
          },
          {
            title: 'Thuộc vùng',
            component: <FormSelect field='area_id' list={mapDataOptions4Select(areaData ?? [])} />,
          },
          {
            title: 'Loại kho',
            component: <FormSelect field='stocks_type_id' list={listStocksTypeOpts} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Thuộc cửa hàng',
            component: <FormSelect field='store_id' list={storeOpts} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default StocksFilter;
