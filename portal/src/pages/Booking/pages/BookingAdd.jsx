import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { create, createOrderNo, read, update } from 'pages/Booking/helpers/call-api';
import { useAuth } from 'context/AuthProvider';
import { formatPrice, getErrorMessage, urlToList } from 'utils/index';
import { defaultValueAdd, orderType, paymentStatus } from 'pages/Booking/helpers/constans';
import { cdnPath } from 'utils/index';
// import { exportPDF } from 'pages/Booking/helpers/call-api';
import { showConfirmModal } from 'actions/global';
import { showToast } from 'utils/helpers';
import { viewInvoice } from 'services/misa-invoice.service';
import { getCurrentUserShift, viewDemoInvoice } from 'pages/Booking/helpers/utils';
import { getUserShifts } from 'services/user-schedule.service';

import Information from 'pages/Booking/components/add/Information/Information';
import BWLoader from 'components/shared/BWLoader/index';
import Panel from 'components/shared/Panel/index';
//import { Popconfirm } from 'antd';

dayjs.extend(customParseFormat);

const BookingAdd = ({ orderId = null, isEdit = true, location }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [userSchedule, setUserSchedule] = useState([]);
  const methods = useForm({
    defaultValues: {
      ...defaultValueAdd,
      member_id: location?.state?.member_id || null,
    },
  });
  const {
    setValue,
    register,
    watch,
    handleSubmit,
    reset,
    getValues,
    trigger,
    // formState: { errors },
  } = methods;
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [showConfirmInvoice, setShowConfirmInvoice] = useState(false);

  const history = useHistory();
  const path = urlToList(useLocation().pathname)[0];
  const goToPreviousPath = () => {
    history.push(`/list-booking-care`);
  };

  const goToEditPath = () => {
    history.push(`${path}/edit/${orderId}`);
  };
  const dataUser = localStorage.getItem('dataUser');
  const booking_id = watch('booking_id');
  const is_can_stockout = watch('is_can_stockout');
  const is_can_edit = watch('is_can_edit');
  const is_cancel = watch('is_cancel');
  const transaction_id = watch('transaction_id');
  const order_type = watch('order_type');
  const phone_number = watch('phone_number');

  const isAdd = useLocation().pathname?.includes('/add');

  const getInit = useCallback(async () => {
    try {
      if (orderId) {
        // gen mã đơn hàng
        const _order_no = await createOrderNo();
        setValue('order_no', _order_no);
        //setValue('description', `Test`);
        // set ngày hiện tại cho đơn hàng tạo mới
        setValue('created_date', dayjs().format('DD/MM/YYYY'));
        // lấy nhân viên tạo đơn hàng
        setValue(
          'created_user',
          user?.isAdministrator === 1 ? user?.full_name : ` ${user?.user_name} - ${user?.full_name} `,
        );
      }
      if (dataUser) {
        const myObject = JSON.parse(dataUser);
        const _object = {
          ...myObject,
          label: myObject.customer_code + '-' + myObject.full_name,
          value: Boolean(+myObject.member_id) ? `KH${myObject.member_id}` : `TN${myObject.dataleads_id}`,
        };
        setValue('address_full', myObject?.address_full);
        setValue('ctype_color', myObject?.ctype_color);
        setValue('ctype_notecolor', myObject?.ctype_notecolor);
        setValue('customer_type_name', myObject?.customer_type_name);
        setValue('data_leads_id', myObject?.data_leads_id);
        setValue('member_id', myObject?.member_id);
        setValue('phone_number', myObject?.phone_number);
        setValue('current_point', myObject?.current_point);
        setValue('customer', { ..._object });
        localStorage.removeItem('dataUser');
      }
    } catch (error) { }
  }, [orderId, user, setValue, dataUser]);

  const handleAppointmentStatusChange = async () => {
    try {
      const isValid = await trigger();
      if (isValid) {
        // Lấy giá trị của phone_number và customer_name từ form
        const phoneNumber = getValues('customer_phone');
        const customerName = getValues('customer_name');
        // Tạo chuỗi thông báo với thông tin khách hàng
        const confirmationMessage = `Bạn có đồng ý xác nhận đặt lịch sửa chữa cho khách hàng ${customerName} - ${phoneNumber}`;
        // Gọi hàm showConfirmModal với thông báo và các tham số khác
        dispatch(
          showConfirmModal(
            [confirmationMessage],
            async () => {
              await setValue('appointment_status', 2);
              await handleSave('save');
            },
            'Xác nhận',
            'Từ chối',
            'bw_text_center',
          ),
        );
      } else {
        showToast.error('Vui lòng điền đầy đủ thông tin cần thiết.');
      }
    } catch (error) {
      showToast.error('Đã xảy ra lỗi, vui lòng thử lại sau.');
      console.error('Error while confirming appointment:', error);
    }
  };

  useEffect(() => {
    getUserShifts()
      .then((schedule) => {
        setUserSchedule(schedule);
      })
      .catch((error) => setUserSchedule(null));
  }, []);

  useEffect(() => {
    getInit();
    register('products', {
      // validate: (value) => Object.keys(value)?.length > 0,
    });
  }, [getInit, register]);

  const handleSave = async (_type, e) => {
    await setValue('button_type', _type);
    // cancel on validate fail
    if (!(await trigger())) {
      return;
    }

    console.log('Inside showConfirmModal callback22');
    handleSubmit(onSubmit)(e);
    //}
  };

  const onSubmit = async (values) => {
    //console.log('values0', values);
    let formData = { ...values };
    let newOrderId = null;
    let newPaymentStatus = 0;

    try {
      if (orderId) {
        // nếu bấm thanh toán trong đơn hàng thanh toán 1 phần -> chuyển sang trang thanh toán
        if (formData.button_type === 'save_&_payment' && formData.payment_status === 2) {
          return window._$g.rdr(`/orders/payment/${orderId}`);
        }

        const { paymentStatus: payment_status, message } = await update(orderId, formData);

        if (formData.button_type !== 'save_&_payment' || +payment_status === paymentStatus.PAID) {
          // showToast.success(
          //   getErrorMessage({
          //     message: message || 'Cập nhật thành công.',
          //   }),
          // );

          showToast.success('Cập nhật thành công.');
        }

        loadOrdersDetail();
      } else {
        // create check user schedule
        if (!user?.isAdministrator) {
          if (!userSchedule || userSchedule?.length === 0) {
            return showToast.warning('Bạn không có ca làm việc ngày hôm nay !');
          } else {
            const currentShift = getCurrentUserShift(userSchedule);
            if (!currentShift) {
              return showToast.warning('Ngoài giờ làm việc, không thể tạo đơn hàng !');
            } else if (currentShift?.store_id != formData.store_id) {
              return showToast.warning('Bạn không có ca làm việc ở cửa hàng này ngày hôm nay !');
            }
          }
        }

        const { orderId: Booking_id, paymentStatus, message } = await create(formData);

        newOrderId = Booking_id;
        newPaymentStatus = paymentStatus;

        showToast.success(
          getErrorMessage({
            message: message || 'Thêm mới thành công.',
          }),
        );
      }
      //console.log(newOrderId);

      if (!orderId && formData.button_type === 'save' && +newPaymentStatus !== paymentStatus.PAID) {
        // chuyển đến trang edit sau khi tạo mới
        //window._$g.rdr(`/orders/edit/${newOrderId || orderId}`);
        window._$g.rdr(`/list-booking-care/`);
        // reset(defaultValueAdd);
      }

      if (
        formData.button_type === 'save_&_payment' &&
        (+formData.order_type === orderType.INSTALLMENT_OFFLINE ||
          +formData.order_type === orderType.INSTALLMENT_ONLINE)
      ) {
        return window._$g.rdr(`/orders/payment/${orderId}`);
      }
    } catch (error) {
      showToast.error(
        getErrorMessage({
          message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
        }),
      );
    }
  };

  const loadOrdersDetail = useCallback(() => {
    if (orderId) {
      setLoadingPage(true);

      read(orderId)
        .then((res) => {
          reset({
            ...res,
            promotion_offers: res?.promotion_apply?.reduce((acc, curr) => {
              return acc.concat(curr?.offers);
            }, []),
          });
        })
        .catch((error) => {
          showToast.error(
            getErrorMessage({
              message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
            }),
          );
        })
        .finally(() => {
          setLoadingPage(false);
        });
    }
  }, [orderId, reset]);

  useEffect(() => {
    loadOrdersDetail();
  }, [loadOrdersDetail]);

  const panel = [
    {
      key: 'information',
      label: 'Thông tin chung',
      component: Information,
      disabled: !is_can_edit || is_cancel ? true : !isEdit,
      ordersId: orderId,
      loading: loadingPage,
      //userSchedule: userSchedule,
      onSubmit: onSubmit,
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel panes={panel} loading={true} />

        <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
          {Boolean(orderId) && (
            <button
              type='button'
              style={{ marginRight: 0 }}
              className='bw_btn bw_btn_outline bw_btn_outline_success'
              onClick={(e) => handleSave('save', e)}>
              <span className='fi fi-rr-inbox-out'></span> Chỉnh sửa
            </button>
          )}

          {watch('appointment_status') !== 2 && booking_id &&
            ![orderType.INSTALLMENT_OFFLINE, orderType.INSTALLMENT_ONLINE].includes(watch('order_type')) && (
              <button
                type='button'
                style={{ marginRight: 0 }}
                className='bw_btn bw_btn_primary'
                //onClick={(e) => handleSave('save', e)}>
                onClick={handleAppointmentStatusChange}>
                <span className='fi fi-rr-edit'></span>Xác nhận đặt lịch
              </button>
            )}

          {Boolean(!isEdit && is_can_edit) ? (
            <button
              type='button'
              style={{ marginRight: 0 }}
              className='bw_btn bw_btn_outline bw_btn_outline_success'
              onClick={goToEditPath}>
              <span className='fi fi-rr-edit'></span>Chỉnh sửa
            </button>
          ) : (
            Boolean(is_can_edit) && (
              <React.Fragment>
                {
                  <button
                    type='button'
                    style={{ marginRight: 0 }}
                    className='bw_btn bw_btn_success'
                    onClick={(e) => handleSave('save', e)}>
                    <span className='fi fi-rr-check'></span>
                    {Boolean(orderId) ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
                  </button>
                }
              </React.Fragment>
            )
          )}

          <button type='button' className='bw_btn_outline' onClick={goToPreviousPath}>
            Đóng
          </button>
        </div>

        {loadingPdf && <BWLoader isPage={false} />}
      </div>
    </FormProvider>
  );
};

export default BookingAdd;
