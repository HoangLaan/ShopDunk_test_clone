import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { useCallback } from 'react';

import { mapDataOptions4Select } from 'utils/helpers';
import {
  defaultValueFilter,
  orderAddress,
  orderAddressOpts,
  statusPaymentOpts,
  vatExportStatusOpts,
} from 'pages/Orders/helpers/constans';
import { setOrdersQuery } from 'pages/Orders/actions/actions';
import { getOptionsGlobal } from 'actions/global';
import { getOrderType } from 'pages/Orders/helpers/call-api';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const { RangePicker } = DatePicker;

const OrdersFilter = ({ setDataReportSearch, disabled }) => {
  const dispatch = useDispatch();

  const { query: params } = useSelector((state) => state.orders);
  const methods = useForm({ defaultValues: params || defaultValueFilter });
  const { setValue } = methods;

  const [dateRange, changeDateRange] = useState(null);
  const [orderTypeOpts, setOrderTypeOpts] = useState([]);
  const [isShowStoreSelect, setIsShowStoreSelect] = useState(true);

  const { businessByUserData, provinceData, districtData } = useSelector((state) => state.global);

  const is_delivery_type = methods.watch('is_delivery_type');
  const business_id = methods.watch('business_id');
  const provice_id = methods.watch('provice_id');

  useEffect(() => {
    setDataReportSearch((prev) => ({
      ...prev,
      order_type_id: methods.watch(`order_type_id`),
      is_delivery_type: methods.watch(`is_delivery_type`),
      store_id: methods.watch(`store`)?.store_id,
      order_type: orderTypeOpts?.find((type) => type.value === methods.watch(`order_type_id`)) || {},
      order_type_opts: orderTypeOpts,
    }));
  }, [methods.watch(`order_type_id`), methods.watch(`is_delivery_type`), methods.watch(`store`), orderTypeOpts]);

  // Lấy danh sách cửa hàng
  const fetchStoreOpts = (search) => {
    ///'services/store.service'
    return dispatch(
      getOptionsGlobal('storeByBusiness', {
        keyword: search,
        parent_id: business_id,
      }),
    ).then((body) => {
      return mapDataOptions4Select(body);
    });
  };

  // Lấy danh sách loại đơn hàng
  const fetchOrderType = useCallback((value) => {
    ///'services/store.service'
    return getOrderType({
      search: value,
    }).then((body) => {
      const orderTypeOpts = body.map((_res) => ({
        label: _res.order_type_name,
        value: _res.order_type_id,
        ..._res,
      }));

      const findIndexOrder = orderTypeOpts?.find((el) => el?.order_index === 1)
      if (findIndexOrder) {
        setValue('order_type_id', findIndexOrder?.value)
        params.order_type_id = findIndexOrder?.value
        defaultValueFilter.order_type_id = findIndexOrder?.value
      }

      setOrderTypeOpts([
        {
          label: 'Tất cả',
          value: 0,
        },
        ...orderTypeOpts,
      ]);

    });
  }, []);

  const getInitFilter = useCallback(() => {
    // Lấy danh sách công ty
    dispatch(getOptionsGlobal('businessByUser'));

    // Lấy danh sách tỉnh thành phố
    dispatch(getOptionsGlobal('province'));

    // Lấy danh sách trạng thái đơn hàng
    fetchOrderType();
  }, [fetchOrderType, dispatch]);

  useEffect(() => {
    getInitFilter();
  }, [getInitFilter]);

  useEffect(() => {
    methods.register('is_active');
  }, [methods]);

  const handleChangeDate = (date, dateString) => {
    if (Boolean(dateString[0] && dateString[1])) {
      changeDateRange(returnMomentDateRange(dateString[0], dateString[1]));
      methods.setValue('date_from', dateString[0]);
      methods.setValue('date_to', dateString[1]);
    } else {
      changeDateRange(null);
    }
  };

  const returnMomentDateRange = (start, finish) => {
    return [dayjs(start, 'DD/MM/YYYY'), dayjs(finish, 'DD/MM/YYYY')];
  };

  const onClear = () => {
    if (disabled) return;

    methods.reset(defaultValueFilter);
    changeDateRange(null);

    onChange(defaultValueFilter);
  };

  const onChange = (value) => {
    if (!disabled) dispatch(setOrdersQuery({ ...params, ...value }));
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput field='search' placeholder={'Nhập mã đơn hàng, khách hàng, SĐT, mã sản phẩm, người tạo đơn'} />
            ),
          },
          {
            title: 'Loại đơn hàng',
            component: <FormSelect field='order_type_id' id='order_type_id' list={orderTypeOpts} allowClear={true} />,
          },
          {
            title: 'Trạng thái thanh toán',
            component: (
              <FormSelect field='payment_status' id='payment_status' list={statusPaymentOpts} allowClear={true} />
            ),
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
            title: 'Địa điểm nhận hàng',
            component: (
              <FormSelect
                field='is_delivery_type'
                id='is_delivery_type'
                list={orderAddressOpts}
                allowClear={true}
                onChange={(value) => {
                  methods.clearErrors('is_delivery_type');
                  methods.setValue('is_delivery_type', value);

                  // nếu nhận tại nhà
                  if (value === orderAddress.HOME) {
                    methods.setValue('business_id', null);
                    methods.setValue('store', null);
                  }
                  // nhận tại cửa hàng
                  else if (value === orderAddress.STORE) {
                    methods.setValue('province_id', null);
                    methods.setValue('district_id', null);
                  }
                }}
              />
            ),
          },
          {
            title: 'Miền',
            component: (
              <FormSelect
                field='business_id'
                list={mapDataOptions4Select(businessByUserData)}
                allowClear={true}
                onChange={(value) => {
                  methods.clearErrors('business_id');
                  methods.setValue('business_id', value);

                  setIsShowStoreSelect(false);
                  setValue('store', null);

                  setTimeout(() => {
                    setIsShowStoreSelect(true);
                  }, 1);
                }}
              />
            ),
            hidden: is_delivery_type !== orderAddress.STORE,
          },
          {
            title: 'Cửa hàng',
            component: (
              <FormDebouneSelect
                field='store_id'
                id='store_id'
                allowClear={true}
                style={{ width: '100%' }}
                fetchOptions={fetchStoreOpts}
                debounceTimeout={500}
                placeholder={'-- Chọn --'}
                onChange={(value) => {
                  methods.clearErrors('store_id');
                  methods.setValue('store_id', value);
                }}
                labelInValue={false}
              />
            ),
            hidden: !isShowStoreSelect || is_delivery_type !== orderAddress.STORE,
          },
          {
            title: 'Tỉnh/Thành phố',
            component: (
              <FormSelect
                field='provice_id'
                list={mapDataOptions4Select(provinceData)}
                allowClear={true}
                onChange={(value) => {
                  methods.clearErrors('provice_id');
                  methods.setValue('provice_id', value);

                  setValue('district_id', null);
                  // Lấy danh sách tỉnh thành phố
                  dispatch(getOptionsGlobal('district', { parent_id: value }));
                }}
              />
            ),
            hidden: is_delivery_type !== orderAddress.HOME,
          },
          {
            title: 'Quận/Huyện',
            component: <FormSelect field='district_id' list={mapDataOptions4Select(districtData)} allowClear={true} />,
            hidden: is_delivery_type !== orderAddress.HOME || !provice_id,
          },
          {
            title: 'Trạng thái xuất hoá đơn',
            component: (
              <FormSelect
                field='vat_export_status'
                id='vat_export_status'
                list={vatExportStatusOpts}
                allowClear={true}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default OrdersFilter;
