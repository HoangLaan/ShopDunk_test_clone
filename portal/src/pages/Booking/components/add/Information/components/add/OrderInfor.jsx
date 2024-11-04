import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';

import { INSTALLMENT_TYPE, statusPaymentOpts } from 'pages/Booking/helpers/constans';
import { AppointmentStatusOpts } from 'pages/Booking/helpers/constans';
import { CareServiceOpts } from 'pages/Booking/helpers/constans';
import { getGroupService } from 'pages/Booking/helpers/call-api';
import { getListOrderStatus } from 'services/order-status.service';
import { resetProductList } from 'pages/Orders/helpers/utils';
import { showToast } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';

import { orderAddressOpts, paymentFormType } from 'pages/Orders/helpers/constans';
import { getListStoreByUser } from 'pages/Booking/helpers/call-api';
import { getListByStore } from 'services/payment-form.service';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormTimePicker from 'components/shared/BWFormControl/FormTime';
//components
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
//import { MIN_DAYS } from '/components/detail/helpers/const';
dayjs.extend(customParseFormat);

const Information = ({ disabled, orderId, userSchedule, isOrderFromStocksTransfer }) => {
  const methods = useFormContext({});
  const { watch, setValue, clearErrors } = methods;
  const [orderTypeOpts, setOrderTypeOpts] = useState([]);
  const [orderStatusOpts, setOrderStatusOpts] = useState([]);
  const [isFirstGetStatus, setIsFirstGetStatus] = useState(true);
  const isValidate = null

  const [storeOpts, setStoreOpts] = useState([]);
  const store_id = watch('store_id');
  const booking_id = watch('booking_id');
  const order_id = watch('order_id');
  const imei = watch('imei');
  const care_service_name = watch('care_service_name');
  const createdDateTimestamp = watch('created_date');
  const formattedCreatedDate = moment(createdDateTimestamp).format('DD/MM/YYYY');

  const order_type_id = watch('order_type_id');
  const { user } = useAuth();

  const isAdd = !Boolean(booking_id) && !disabled;
  const isEdit = Boolean(booking_id) && !disabled;
  const isView = Boolean(booking_id) && disabled;

  // Lấy danh sách loại đơn hàng
  const fetchOrderType = async (value) => {
    ///'services/store.service'
    return getGroupService({
      search: value,
      action: isAdd ? 'add' : isEdit ? 'edit' : isView ? 'view' : '',
    }).then((body) => {
      const _orderTypeOpts = body.map((_res) => ({
        label: _res.care_service_name,
        value: _res.care_service_code,
        ..._res,
      }));
      setOrderTypeOpts(_orderTypeOpts);
    });
  };

  useEffect(() => {
    const currentStoreId = watch('store_id');
    if (currentStoreId == 1) {
      setValue('store_id', 173);
    }
  }, [setValue, watch]);

  useEffect(() => {
    if (orderTypeOpts.length > 0 && order_type_id) {
      if (user?.isAdministrator === 1) return;
      if (!orderTypeOpts.find((item) => item.order_type_id === order_type_id)) {
        showToast.error('Bạn không có quyền loại đơn hàng của hóa đơn này');
        window._$g.rdr(`/orders`);
      }
    }
  }, [orderTypeOpts, order_type_id, user?.isAdministrator]);

  useEffect(() => {
    if (userSchedule && userSchedule.length > 0) {
      const offlineOrderType = orderTypeOpts?.find((order) => order.type === 1);

      if (offlineOrderType && !orderId && !watch('order_type_id')) {
        setValue('order_type_id', offlineOrderType?.value);
        setValue('order_type', offlineOrderType?.type);
      }
    }
    if (!booking_id) {
      setValue('created_date', dayjs().format('DD/MM/YYYY'));
    }
  }, [orderTypeOpts, userSchedule, orderId, setValue, watch('order_type_id')]);

  // Lấy danh sách trạng thái đơn hàng
  const fetchOrderStatus = useCallback(
    (value, isChangeOrderType = false) => {
      const order_type_id = watch('order_type_id');

      return getListOrderStatus({
        search: value,
        is_active: 1,
        order_type_id: order_type_id,
      }).then((body) => {
        const _orderStatusOpts = body.items.map((_res) => ({
          label: _res.order_status_name,
          value: _res.order_status_id,
          ..._res,
        }));

        if (order_type_id) {
          // Mặc định lấy trạng thái đơn là mới nhất
          const statusNews = _orderStatusOpts.filter((_st) => _st?.is_new_order);

          if (isChangeOrderType && statusNews?.length > 0) {
            if (statusNews.length === 1) {
              setValue('order_status_id', statusNews[0]?.value);
              clearErrors('order_status_id');
            } else if (watch('installment_type') === INSTALLMENT_TYPE.COMPANY) {
              const waitConfirmStatus = statusNews.find((status) => status.label.toLowerCase()?.includes('duyệt'));

              if (waitConfirmStatus) {
                setValue('order_status_id', waitConfirmStatus?.value);
                clearErrors('order_status_id');
              }
            } else {
              const firstNewStatus = statusNews.find((status) => status.label.toLowerCase()?.includes('hàng mới'));
              if (firstNewStatus) {
                setValue('order_status_id', firstNewStatus?.value);
                clearErrors('order_status_id');
              } else {
                setValue('order_status_id', statusNews[0]?.value);
                clearErrors('order_status_id');
              }
            }
          }
        }
        //set danh sách trạng thái đơn hàng
        setOrderStatusOpts(_orderStatusOpts);
      });
    },
    [watch, setValue, clearErrors, watch('installment_type')],
  );

  const getInit = useCallback(async () => {
    try {
      // lấy danh sách options loại đơn hàng
      await fetchOrderType();
    } catch (error) { }
  }, []);

  //news
  const handleChangeStore = useCallback(
    (store_id) => {
      setValue('store_id', store_id);

      // Lấy store trong mảng
      let findStore = storeOpts.find((_store) => _store.value === store_id);

      // lưu giá trị business tìm dc
      setValue('business_id', findStore?.business_id);
      setValue('business_name', findStore?.business_name);
      setValue('store_address', findStore?.address);
      setValue('store_name', findStore?.store_name);

      resetProductList(watch, setValue);

      clearErrors('store_id');

      if (
        store_id &&
        !user?.isAdministrator &&
        (!userSchedule || userSchedule?.every((schedule) => schedule.store_id != store_id))
      ) {
        showToast.warning('Bạn không có ca làm việc ở cửa hàng này ngày hôm nay !');
      }
    },
    [storeOpts, setValue, watch, clearErrors, user?.isAdministrator, userSchedule],
  );

  useEffect(() => {
    if (store_id && !order_id) {
      getListByStore(store_id).then((res) => {
        let flag = false;
        setValue(
          'data_payment',
          res // tạm thời ẩn hình thức thanh toán bên thứ 3
            // .filter((item) => item.payment_type === paymentFormType.BANK || item.payment_type === paymentFormType.CASH)
            .map((item) => {
              const is_checked = !flag && item.payment_type === paymentFormType.CASH;
              if (item.payment_type === paymentFormType.CASH) {
                flag = true;
              }

              return {
                ...item,
                payment_value: 0,
                is_checked,
              };
            }),
        );
      });
    }
  }, [store_id, order_id, setValue]);

  // Lấy danh sách cửa hàng chuyển
  const fetchStoreOpts = useCallback(
    (value, isFirst = false) => {
      return getListStoreByUser({
        search: value,
        // is_active: 1,
        itemsPerPage: isFirst ? 9999 : 30,
        page: 1,
        // brand_id: 18,
      }).then((body) => {
        const _storeOpts = body.items.map((_store) => ({
          label: _store.store_name,
          value: _store.store_id,
          ..._store,
        }));

        setStoreOpts(_storeOpts);

        if (isFirst && _storeOpts.length === 1) {
          setValue('store_id', _storeOpts[0]?.store_id);
          setValue('business_id', _storeOpts[0]?.business_id);
          setValue('business_name', _storeOpts[0]?.business_name);
          setValue('store_address', _storeOpts[0]?.address);
          setValue('store_name', _storeOpts[0]?.store_name);
        }
      });
    },
    [setValue],
  );

  useEffect(() => {
    fetchStoreOpts(null, true);
  }, [fetchStoreOpts]);
  //news

  useEffect(() => {
    getInit();
  }, [getInit]);

  useEffect(() => {
    if (order_type_id && isFirstGetStatus) {
      fetchOrderStatus(null, orderId ? false : true);
      setIsFirstGetStatus(false);
    }
  }, [order_type_id, isFirstGetStatus, fetchOrderStatus, orderId]);

  // load default installment status
  useEffect(() => {
    if (!orderId && watch('installment_type')) {
      fetchOrderStatus(null, orderId ? false : true);
    }
  }, [orderId, watch('installment_type'), fetchOrderStatus]);

  return (
    <BWAccordion title='Thông tin đặt lịch' id='bw_info_cus' isRequired={isOrderFromStocksTransfer ? false : true}>
      <div className='bw_row'>
        <FormItem label='Mã đặt lịch' className='bw_col_6' disabled>
          <FormInput type='text' field='booking_no' disabled placeholder='Mã đặt lịch' />
          {/* <FormInput type='text' field='booking_id' setValue={`AS${booking_id.toString().padStart(6, '0')}`} disabled  /> */}
        </FormItem>
        <FormItem label='Trung tâm' className='bw_col_6' isRequired>
          <FormDebouneSelect
            field='store_id'
            id='store_id'
            options={storeOpts}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchStoreOpts}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            validation={{
              required: 'Cửa hàng xuất hàng là bắt buộc',
            }}
            onChange={(e) => {
              handleChangeStore(e?.value);
            }}
          />
        </FormItem>

        <FormItem label='Dịch vụ *' className='bw_col_6'>
          <FormDebouneSelect
            field='care_service_code'
            id='care_service_id'
            options={orderTypeOpts}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchOrderType}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            validation={{
              required: 'Loại đơn hàng là bắt buộc',
            }}
            onChange={(_, opt) => {
              setValue('care_service_code', opt?.value);
              setValue('care_service_name', opt?.type);
              fetchOrderStatus(null, true);
            }}
          />
        </FormItem>

        {/* <FormItem label='Dịch vụ' className='bw_col_6' disabled={false}>
          <FormSelect field='care_service_name' list={CareServiceOpts.filter((_) => _.value !== 0)} />
        </FormItem> */}

        <FormItem label='Trạng thái' className='bw_col_6' disabled={false}>
          <FormSelect field='appointment_status' list={AppointmentStatusOpts.filter((_) => _.value !== 0)} />
        </FormItem>

        <div className='bw_col_6'>
          {/* <FormItem label='Thời gian từ' isRequired={true} >
            <FormRangePicker
              showTime
              style={{ width: '100%' }}
              fieldStart='expected_start_time_form'
              fieldEnd='expected_start_time_to'
              validation={{
                required: 'Khoảng thời gian là bắt buộc',
              }}
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'hh:mm A DD/MM/YYYY'}
              allowClear={true}
              disabledDate={(current) => {
                const customDate = moment().format('YYYY-MM-DD');
                return current && current < moment(customDate, 'YYYY-MM-DD');
              }}
            />
          </FormItem> */}

          <FormItem label='Ngày dự kiến' className='bw_col_12'>
            <FormDatePicker
              style={{
                width: '100%',
                padding: '2px 0px',
              }}
              placeholder='DD/MM/YYYY'
              format='DD/MM/YYYY'
              bordered={false}
              field='expected_date'
              disabledDate={(current) => {
                return moment().add(-1, 'days') >= current || moment().add(1, 'month') <= current;
              }}
            />
          </FormItem>

          <div className='bw_row'>
            <FormItem className='bw_col_6' label='Thời gian từ'>
              <FormTimePicker
                field='expected_start_time_form'
                type='time'
                format='HH:mm'
                bordered={false}
                style={{ width: '100%' }}
                validation={
                  isValidate ?? {
                    validate: {
                      positiveNumber: (value, { date }) => {
                        if (!value) return true;
                        const [hoursSelect, minutesSelect] = value.split(':');
                        const hoursNow = new Date().getHours();
                        const minutesNow = new Date().getMinutes();
                        if (date !== formattedCreatedDate || +hoursSelect > hoursNow) return true;
                        if (+hoursSelect === hoursNow && +minutesSelect >= minutesNow) {
                          return true;
                        }

                        return `Thời gian từ phải >= ${hoursNow}:${minutesNow} ${hoursNow >= 12 ? 'PM' : 'AM'}`;
                      },
                    },
                  }
                }
              />
            </FormItem>
            <FormItem className='bw_col_6' label='Thời gian đến'>
              <FormTimePicker type='time' format='HH:mm' bordered={false} style={{ width: '100%' }} field='expected_start_time_to' />
            </FormItem>
          </div>
        </div>


        <FormItem label='Imei/ Serial' className='bw_col_6'>
          <FormInput type='text' field='imei' />
        </FormItem>

      </div>

    </BWAccordion>
  );
};

export default Information;
