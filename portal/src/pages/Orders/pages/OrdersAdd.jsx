import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  cancelOrder,
  cashPayment,
  create,
  createOrderNo,
  exportPreOrder,
  read,
  update,
  updateInstallmentOrder,
} from 'pages/Orders/helpers/call-api';
import { getList } from 'services/customer-of-task.service';
import { changeWorkFlow } from 'services/customer-of-task.service';
import { useAuth } from 'context/AuthProvider';
import { formatPrice, getErrorMessage, urlToList } from 'utils/index';
import {
  INSTALLMENT_TYPE,
  defaultValueAdd,
  orderType,
  paymentFormType,
  paymentStatus,
} from 'pages/Orders/helpers/constans';
import { cdnPath } from 'utils/index';
import { exportPDF } from 'pages/Orders/helpers/call-api';
import { showConfirmModal } from 'actions/global';
import { showToast } from 'utils/helpers';
import { viewInvoice } from 'services/misa-invoice.service';
import { exportInvoice, viewDemoInvoice } from 'pages/Orders/helpers/utils';
import { createStocksOutRequestByOrderId } from 'services/stocks-out-request.service';

import Information from 'pages/Orders/components/add/Information/Information';
import ConfirmExportModal from '../components/add/Invoice/ConfirmExportModal';
import AddressDelivery from 'pages/Orders/components/add/Address/AddressDelivery';
import BWLoader from 'components/shared/BWLoader/index';
import Panel from 'components/shared/Panel/index';
import Invoice from 'pages/Orders/components/add/Invoice';
import { Popconfirm } from 'antd';

dayjs.extend(customParseFormat);

const OrdersAdd = ({ orderId = null, isEdit = true, location }) => {
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
    formState: { isDirty },
  } = methods;
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [showConfirmInvoice, setShowConfirmInvoice] = useState(false); 

  const currentUrl = window.location.href;
  const urlParams = new URLSearchParams(currentUrl);
  const task_detail_id = urlParams.get('task_detail_id');
  const customer_id = urlParams.get('customer_id');

  const history = useHistory();
  const path = urlToList(useLocation().pathname)[0];
  const goToPreviousPath = () => {
    history.push(`${path}`);
  };

  const goToEditPath = () => {
    history.push(`${path}/edit/${orderId}`);
  };

  const getDataDefault = localStorage.getItem('dataDefaultOrder');
  const dataConvert = JSON.parse(getDataDefault)

  const dataUser = localStorage.getItem('dataUser');
  const order_id = watch('order_id');
  const payment_status = watch('payment_status');
  const data_payment = watch('data_payment') || [];
  const is_can_stockout = watch('is_can_stockout');
  const is_can_edit = watch('is_can_edit');
  const is_cancel = watch('is_cancel');
  const transaction_id = watch('transaction_id');
  const order_type = watch('order_type');
  const is_out_stock = watch('is_out_stock');
  const is_agree_policy = watch('is_agree_policy');
  const stocks_out_request_ids = watch('stocks_out_request_ids') || [];
  const member_id = watch('member_id');
  const order_type_index = methods.watch('order_type_index')

  const isAdd = useLocation().pathname?.includes('/add');
  const isCanHoldProduct = Object.values(watch('products') || {}).reduce((acc, curr) => {
    if (curr.is_hot) acc = false;
    return acc;
  }, true);

  const hasPayment = data_payment.some(item => item.payment_value !== 0)

  // useDetectHookFormChange(methods)

  useEffect(() => {
    if (dataConvert) {
      Object.keys(dataConvert).forEach(key => {
        if (key !== 'created_date' && key !== 'receiving_date') {
          setValue(key, dataConvert[key]);
        }
      });
    }
  }, [setValue]);

  useEffect(() => {
    if (!isAdd) {
      return; // Không làm gì nếu không phải trang add
    }

    return () => {
      localStorage.setItem('dataDefaultOrder', JSON.stringify(watch()));
    };
  }, [isAdd]);

  const getInit = useCallback(async () => {
    try {
      if (!orderId) {
        // gen mã đơn hàng
        const _order_no = await createOrderNo();
        setValue('order_no', _order_no);
        setValue('description', `Thu tiền hàng theo mã đơn hàng {MDH}`);
        // set ngày hiện tại cho đơn hàng tạo mới
        setValue('created_date', dayjs().format('DD/MM/YYYY'));
        // lấy nhân viên tạo đơn hàng
        setValue(
          'created_user',
          user?.isAdministrator === 1 ? user?.full_name : ` ${user?.user_name} - ${user?.full_name} `,
        );
        // setValue('invoice_full_name', 'khách lẻ không lấy hoá đơn');
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

  useEffect(() => {
    getInit();
    register('products', { required: 'Sản phẩm là bắt buộc.' });
  }, [getInit, register]);

  const handleSave = async (_type, e) => {
    setValue('button_type', _type);

    // validate installment order
    if ([orderType.INSTALLMENT_OFFLINE, orderType.INSTALLMENT_ONLINE].includes(methods.watch('order_type'))) {
      if (!watch('installment_form_selected')) {
        return showToast.error('Vui lòng chọn phương thức trả góp !');
      }
    }

    // tính tổng tiền mặt đã nhập
    const currentPaymentMethods = data_payment.filter(
      (_) => [paymentFormType.CASH, paymentFormType.PARTNER].includes(+_.payment_type) && _.payment_value > 0,
    );
    const payments_total = currentPaymentMethods.reduce((acc, curr) => acc + (curr.payment_value || 0), 0);

    // nếu là tạo mới đơn hàng và có tiền mặt thì cần xác nhận lại
    if (_type === 'save_&_payment' && payments_total > 0 && watch('payment_status') !== 2) {
      // 2 là thanh toán 1 phần
      dispatch(
        showConfirmModal(
          [
            'Xác nhận thu tiền !',
            <div>
              <ul>
                {currentPaymentMethods.map((payment) => (
                  <li key={payment.payment_form_id}>
                    Bạn đã thu đủ số tiền{' '}
                    <span style={{ color: 'red' }}>{formatPrice(payment.payment_value, true, ',')}</span> với hình thức{' '}
                    {payment.payment_form_name}?
                  </li>
                ))}
              </ul>
            </div>,
          ],

          () => {
            handleSubmit(onSubmit)(e);
          },
          'Xác nhận',
        ),
      );
    } else {
      handleSubmit(onSubmit)(e);
    }
  };

  const onSubmit = async (values) => {
    let formData = { ...values };

    if (task_detail_id && customer_id) {
      const listTaskDetailId = [task_detail_id]
      formData.task_detail_id = JSON.stringify(listTaskDetailId)
    }

    if (
      +formData.order_type !== orderType.PREORDER &&
      +formData.order_type !== orderType.INSTALLMENT_OFFLINE &&
      +formData.order_type !== orderType.INSTALLMENT_ONLINE
    ) {
      const data_payment = (formData.data_payment || []).findIndex((item) => Boolean(item.is_checked));
      if (data_payment === -1) {
        showToast.error(
          getErrorMessage({
            message: 'Hãy chọn hình thức thanh toán!',
          }),
        );
        return;
      }
    }

    // check product list
    if (Object.values(formData.products || {}).length === 0) {
      showToast.error(
        getErrorMessage({
          message: 'Bạn cần chọn ít nhất 1 sản phẩm.',
        }),
      );
      return;
    }

    let newOrderId = null;
    let newPaymentStatus = 0;

    try {
      if (orderId) {
        // nếu bấm thanh toán trong đơn hàng thanh toán 1 phần -> chuyển sang trang thanh toán
        if (formData.button_type === 'save_&_payment' && formData.payment_status === 2) {
          return window._$g.rdr(`/orders/payment/${orderId}`);
        }
        console.log('=============> vao update oder formData', formData);

        const { paymentStatus: payment_status, message } = await update(orderId, formData);

        if (orderId && formData.button_type === 'save_&_payment') {
          const res = await read(orderId)
          console.log('[[ Get order Detail de check ]]', 'out_stock_status === ', res?.out_stock_status, 'payment_status ===', res?.payment_status);
          if (+res?.out_stock_status === 1 && +res?.payment_status === 1) {
            const getCustomerOfTask = await getList({ search: res?.dataleads_id ? res?.dataleads_id : res?.customer_code })
            if (getCustomerOfTask?.items?.length > 0) {
              const listTaskDetailId = getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.map(item => parseInt(item.task_detail_id));

              if (listTaskDetailId?.length > 0) {
                res.task_detail_id = JSON.stringify(listTaskDetailId)
              }

              await update(order_id, res)

              if (listTaskDetailId?.length > 1) {
                console.log('vao TH2 ---> 55');
                getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.forEach(item => {
                  if ((!item.order_no && !item.order_date) || task_detail_id) {
                    changeWorkFlow({
                      task_detail_id: item.task_detail_id,
                      task_workflow_old_id: item.task_work_flow_id,
                      task_workflow_id: 55,
                    });
                  }
                });
              } else if (listTaskDetailId?.length === 1) {
                console.log('vao TH1 ---> 54');
                getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.forEach(item => {
                  if ((!item.order_no && !item.order_date) || task_detail_id) {
                    changeWorkFlow({
                      task_detail_id: item.task_detail_id,
                      task_workflow_old_id: item.task_work_flow_id,
                      task_workflow_id: 55,
                    });
                  }
                });
              }
            }
          }
        }

        if (formData.button_type !== 'save_&_payment' || +payment_status === paymentStatus.PAID) {
          showToast.success(
            getErrorMessage({
              message: message || 'Cập nhật thành công.',
            }),
          );
        }

        loadOrdersDetail();
      } else {
        // create check user schedule
        // if (!user?.isAdministrator) {
        //   if (!userSchedule || userSchedule?.length === 0) {
        //     return showToast.warning('Bạn không có ca làm việc ngày hôm nay !');
        //   } else {
        //     const currentShift = getCurrentUserShift(userSchedule);
        //     if (!currentShift) {
        //       return showToast.warning('Ngoài giờ làm việc, không thể tạo đơn hàng !');
        //     } else if (currentShift?.store_id != formData.store_id) {
        //       return showToast.warning('Bạn không có ca làm việc ở cửa hàng này ngày hôm nay !');
        //     }
        //   }
        // }
        console.log('==========> vao create oder formData', formData);
        const { orderId: order_id, paymentStatus, message } = await create(formData);

        newOrderId = order_id;
        newPaymentStatus = paymentStatus;

        if (newOrderId) {
          setTimeout(() => {
            localStorage.removeItem('dataDefaultOrder')
          }, 2000);

          const res = await read(newOrderId)
          console.log('[[ Get order Detail de check ]]', 'out_stock_status === ', res?.out_stock_status, 'payment_status ===', res?.payment_status);
          if (+res?.out_stock_status === 1 && +res?.payment_status === 1) {
            const getCustomerOfTask = await getList({ search: res?.dataleads_id ? res?.dataleads_id : res?.customer_code })
            if (getCustomerOfTask?.items?.length > 0) {
              const listTaskDetailId = getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.map(item => parseInt(item.task_detail_id));

              if (listTaskDetailId?.length > 0) {
                res.task_detail_id = JSON.stringify(listTaskDetailId)
              }

              await update(order_id, res)

              if (listTaskDetailId?.length > 1) {
                console.log('vao TH2 ---> 55');
                getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.forEach(item => {
                  if ((!item.order_no && !item.order_date) || task_detail_id) {
                    changeWorkFlow({
                      task_detail_id: item.task_detail_id,
                      task_workflow_old_id: item.task_work_flow_id,
                      task_workflow_id: 55,
                    });
                  }
                });
              } else if (listTaskDetailId?.length === 1) {
                console.log('vao TH1 ---> 54');
                getCustomerOfTask?.items?.filter(item => item.type_purchase !== 1 && item.type_purchase !== 0)?.forEach(item => {
                  if ((!item.order_no && !item.order_date) || task_detail_id) {
                    changeWorkFlow({
                      task_detail_id: item.task_detail_id,
                      task_workflow_old_id: item.task_work_flow_id,
                      task_workflow_id: 55,
                    });
                  }
                });
              }
            }
          }
        }

        showToast.success(
          getErrorMessage({
            message: message || 'Thêm mới thành công.',
          }),
        );
      }

      const isNeedPayment = (data_payment || []).find((_data) => _data.is_checked) ? true : false;

      if (newOrderId && order_type_index === 4 ) {
        // chuyển đến trang edit sau khi tạo mới với đơn trả góp tại quầy
        return window._$g.rdr(`/orders/edit/${newOrderId || orderId}?tab_active=information`);
      }

      // nếu button không phải là save và có trạng thái thu tiền
      if ((formData.button_type === 'save_&_payment' && isNeedPayment) || watch('payment_status') === 2) {
        // nếu là trạng thái thanh toán 1 phần thì chuyển sang trang thanh toán
        //Chuyển  qua trang thanh toán
        window._$g.rdr(`/orders/payment/${newOrderId || orderId}`);
        // window._$g.rdr(`/receive-slip/add?order_id=${watch('order_id')}&type=order`);
      }

      if (!orderId && formData.button_type === 'save_&_payment' && +newPaymentStatus !== paymentStatus.PAID) {
        window._$g.rdr(`/orders/payment/${newOrderId}`);
      }

      // disable ngày 16/09/2023
      // if (button_type === 'save_&_stockout' && (!watch('is_can_collect_money') || !isNeedPayment)) {
      //   //Chuyển qua trang xuất kho
      //   window._$g.rdr(`/stocks-out-request/add?order_id=${watch('order_id')}&order_no=${watch('order_no')}`);
      // }

      if (!orderId && formData.button_type === 'save' && +newPaymentStatus !== paymentStatus.PAID) {
        // chuyển đến trang edit sau khi tạo mới
        window._$g.rdr(`/orders/edit/${newOrderId || orderId}/`);
        // reset(defaultValueAdd);
        // // sau khi reset dữ liệu gọi lại hàm khởi tạo ban đầu
        // // gen mã đơn hàng và lấy ngày tạo đơn
        // getInit();
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

  const handleExportInvoice = async (e) => {
    const orderDetail = getValues();
    await exportInvoice(orderDetail, null, (transactionId) => {
      methods.setValue('transaction_id', transactionId);
    });
  };

  const handleViewDraftInvoice = async (e) => {
    const orderDetail = getValues();
    await viewDemoInvoice(orderDetail, null);
  };

  const handleViewInvoice = async (e) => {
    try {
      const trasactionId = methods.getValues('transaction_id');
      if (trasactionId) {
        const viewLink = await viewInvoice(trasactionId);
        if (viewLink) {
          window.open(viewLink, '_blank');
        }
      }
    } catch (error) {
      showToast.error('Xem hóa đơn xảy ra lỗi !');
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

  const handleExportPDF = () => {
    setLoadingPdf(true);
    exportPDF(orderId)
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  const handleExportPreOrder = () => {
    setLoadingPdf(true);

    exportPreOrder(orderId)
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  const handleStockOutOrder = useCallback(
    (not_check_payment) => {
      if (order_id) {
        setLoadingPage(true);

        createStocksOutRequestByOrderId({ order_id, not_check_payment: not_check_payment })
          .then((res) => {
            showToast.success('Đơn hàng đã xuất kho thành công.');
            loadOrdersDetail();
          })
          .catch((error) => {
            showToast.error(
              getErrorMessage({
                message: error?.message || 'Đã xảy ra lỗi khi xuất kho.',
              }),
            );
          })
          .finally(() => {
            setLoadingPage(false);
          });
      }
    },
    [order_id, loadOrdersDetail],
  );

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(orderId);

      showToast.success(
        getErrorMessage({
          message: 'Đơn hàng đã được huỷ.',
        }),
      );

      loadOrdersDetail();
    } catch (error) {
      showToast.error(
        getErrorMessage({
          message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
        }),
      );
    }
  };

  const panel = [
    {
      key: 'information',
      label: 'Thông tin chung',
      component: Information,
      disabled: !is_can_edit || is_cancel ? true : !isEdit,
      ordersId: orderId,
      loading: loadingPage,
      userSchedule: userSchedule,
      onSubmit: onSubmit,
    },
    {
      key: 'information_address',
      label: 'Thông tin địa chỉ nhận hàng',
      component: AddressDelivery,
      disabled: !is_can_edit || is_cancel ? true : !isEdit,
      hidden: !member_id,
      ordersId: orderId,
    },
    {
      key: 'invoice',
      label: 'Hoá đơn',
      component: Invoice,
      disabled: !is_can_edit || is_cancel ? true : !isEdit,
      ordersId: orderId,
      permission: 'SL_INVOICE_VIEW'
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel panes={panel} loading={true} />

        <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
          {orderId && !is_cancel && is_can_edit ? (
            <button
              style={{ marginRight: 0 }}
              type='button'
              className='bw_btn bw_btn_warning'
              onClick={() =>
                dispatch(
                  showConfirmModal(
                    ['Bạn có thật sự muốn huỷ đơn?', 'Đơn hàng sẽ bị huỷ và ảnh hưởng tới dữ liệu liên quan.'],
                    async () => {
                      handleCancelOrder();
                    },
                    ["Tôi muốn hủy"],
                  ),
                )
              }>
              <span className='fi fi-rr-edit'></span>Huỷ đơn
            </button>
          ) : null}

          {/* {+order_type !== orderType.PREORDER && ( */}
          {/* <> */}
          {/* tạm thời ẩn */}
          {/* {Boolean(orderId && payment_status === paymentStatus.PAID && !is_can_stockout) && (
            <button
              style={{ marginRight: '0px' }}
              type='button'
              className='bw_btn bw_btn_outline bw_btn_outline_warning'
              onClick={() => {
                handleExportPDF();
              }}>
              <span className='fi fi-rr-print'></span> In đơn hàng bán
            </button>
          )} */}
          {/* </> */}
          {/* )} */}

          {/* Điều kiện cũ !isEdit && is_can_edit */}
          {Boolean(orderId && !isEdit && !is_can_edit) && (
            <button
              type='button'
              style={{ marginRight: 0 }}
              className='bw_btn bw_btn_outline bw_btn_outline_success'
              onClick={() => {
                handleExportPDF();
              }}>
              <span className='fi fi-rr-print'></span>In đơn hàng
            </button>
          )}

          {watch('payment_status') === 2 &&
            ![orderType.INSTALLMENT_OFFLINE, orderType.INSTALLMENT_ONLINE].includes(watch('order_type')) && (
              <button
                type='button'
                style={{ marginRight: 0 }}
                className='bw_btn bw_btn_primary'
                onClick={(e) => handleSave('save', e)}>
                <span className='fi fi-rr-edit'></span>Chỉnh sửa HTTT
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
                {/* không thể thêm mới đơn hàng có sản phẩm hot (không thể giữ hàng) (cần thanh toán khi tạo đơn) */}
                {!(isAdd && !isCanHoldProduct) && !hasPayment && (
                  <button
                    type='button'
                    style={{ marginRight: 0 }}
                    className='bw_btn bw_btn_success'
                    onClick={(e) => handleSave('save', e)}>
                    <span className='fi fi-rr-check'></span>
                    {Boolean(orderId) ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
                  </button>
                )}

                {!Boolean(orderId) && hasPayment && (
                  // && ![orderType.INSTALLMENT_OFFLINE, orderType.INSTALLMENT_ONLINE].includes(order_type)
                  <button
                    type='button'
                    style={{ marginRight: 0 }}
                    className='bw_btn bw_btn_primary'
                    onClick={(e) => handleSave('save_&_payment', e)}>
                    <span className='fi fi-rr-check'></span>
                    Thanh toán
                  </button>
                )}
              </React.Fragment>
            )
          )}

          {Boolean(
            payment_status !== paymentStatus.PAID &&
            orderId &&
            !is_cancel &&
            watch('installment_type') === INSTALLMENT_TYPE.COMPANY &&
            !watch('finance_company_confirmed'),
          ) && (
              <Popconfirm
                placement='topLeft'
                title={'Xác nhận chuyển trạng thái đang trả góp'}
                description={
                  'Xác nhận công ty tài chính đã duyệt cho đơn hàng này thanh toán số tiền còn lại với hình thức trả góp !'
                }
                okText='Xác nhận'
                cancelText='Hủy'
                onConfirm={async () => {
                  try {
                    await updateInstallmentOrder({
                      order_id: orderId,
                      order_data: methods.getValues(),
                    });
                    showToast.success('Cập nhật trạng thái trả góp thành công !');

                    // handleStockOutOrder(true);
                    loadOrdersDetail();
                  } catch (error) {
                    showToast.error(error?.message || 'Cập nhật trạng thái trả góp xảy ra lỗi ');
                  }
                }}>
                <button type='button' style={{ marginRight: 0 }} className='bw_btn bw_btn_outline bw_btn_outline_success'>
                  <span className='fi fi-rr-edit'></span>Cập nhật đang trả góp
                </button>
              </Popconfirm>
            )}

          {Boolean(
            payment_status !== paymentStatus.PAID && orderId && !is_cancel,
            // &&
            // !(
            //   (+order_type === orderType.INSTALLMENT_OFFLINE || +order_type === orderType.INSTALLMENT_ONLINE)
            //   && !is_agree_policy
            // ),
          ) && (
              <button
                type='button'
                style={{ marginRight: 0 }}
                className='bw_btn bw_btn_primary '
                onClick={(e) => handleSave('save_&_payment', e)}>
                <span className='fi fi-rr-money'></span> Thanh toán
              </button>
            )}

          {/* {+order_type !== orderType.PREORDER && ( */}
          {/* <> */}
          {Boolean(orderId && !transaction_id && !is_can_stockout) && (
            <button
              type='button'
              style={{ marginRight: 0 }}
              className='bw_btn bw_btn_primary'
              onClick={() => {
                setShowConfirmInvoice(true);
              }}>
              <span className='fi fi-rr-inbox-out'></span> Xuất hóa đơn
            </button>
          )}

          {Boolean(orderId && transaction_id && !is_can_stockout) && (
            <button
              type='button'
              style={{ marginRight: 0 }}
              className='bw_btn bw_btn_primary'
              onClick={(e) => handleViewInvoice(e)}>
              <span className='fi fi fi-rr-eye'></span> Xem hóa đơn
            </button>
          )}

          {Boolean(
            is_can_stockout &&
            orderId &&
            !is_cancel &&
            +order_type === orderType.PREORDER &&
            payment_status === paymentStatus.PAID,
          ) && (
              <button
                type='button'
                className='bw_btn_outline bw_btn_outline_warning'
                onClick={(e) => handleStockOutOrder()}>
                <span className='fi fi-rr-inbox-out'></span> Xuất kho
              </button>
            )}

          {/* Stockout for new order -> thanh toán sau 03/01/2024 */}
          {Boolean(
            is_can_stockout &&
            orderId &&
            !is_cancel &&
            +order_type !== orderType.PREORDER &&
            [paymentStatus.NOT_PAID, paymentStatus.PARTIALLY_PAID].includes(payment_status) &&
            +order_type !== orderType.INSTALLMENT_OFFLINE &&
            +order_type !== orderType.INSTALLMENT_ONLINE,
          ) && (
              <button
                type='button'
                className='bw_btn_outline bw_btn_outline_warning'
                onClick={(e) => handleStockOutOrder(true)}>
                <span className='fi fi-rr-inbox-out'></span> Xuất kho
              </button>
            )}

          {Boolean(!is_cancel && is_out_stock) && (
            <button
              type='button'
              style={{ marginRight: 0 }}
              className='bw_btn bw_btn_outline bw_btn_outline_warning'
              onClick={() => {
                if (parseInt(order_type) === orderType.INTERNAL) {
                  return window.open(
                    `/stocks-out-request/detail/${watch('stocks_out_request_id_of_internal')}`,
                    '_blank',
                    'rel=noopener noreferrer',
                  );
                }
                if (+order_type !== orderType.PREORDER) {
                  for (let i = 0; i < stocks_out_request_ids.length; i++) {
                    window.open(
                      `/stocks-out-request/detail/${stocks_out_request_ids[i]}`,
                      '_blank',
                      'rel=noopener noreferrer',
                    );
                  }
                } else {
                  history.push('/stocks-out-request', {
                    order_id: orderId,
                    stocks_out_request_ids: stocks_out_request_ids,
                  });
                }
              }}>
              <span className='fi fi-rr-inbox-out'></span> Xem phiếu xuất kho
            </button>
          )}

          {Boolean(!is_cancel && watch('other_acc_voucher_id')) && (
            <button
              type='button'
              style={{ marginRight: 0 }}
              className='bw_btn bw_btn_outline bw_btn_outline_success'
              onClick={() => {
                window.open(
                  `/other-voucher/detail/${watch('other_acc_voucher_id')}?tab_active=accountings`,
                  '_blank',
                  'rel=noopener noreferrer',
                );
              }}>
              <span className='fi fi-rr-eye'></span> Xem hạch toán chứng từ khác
            </button>
          )}
          {/* </> */}
          {/* )} */}

          {Boolean(orderId && order_type === orderType.PREORDER) && (
            <button
              type='button'
              className='bw_btn_outline bw_btn_outline_warning'
              onClick={() => {
                handleExportPreOrder();
              }}>
              <span className='fi fi-rr-print'></span> In PreOrder
            </button>
          )}

          <button type='button' className='bw_btn_outline' onClick={goToPreviousPath}>
            Đóng
          </button>
        </div>

        {loadingPdf && <BWLoader isPage={false} />}

        {showConfirmInvoice ? (
          <ConfirmExportModal
            onClose={() => {
              setShowConfirmInvoice(false);
            }}
            exportInvoice={handleExportInvoice}
            viewInvoice={handleViewDraftInvoice}
          />
        ) : null}
      </div>
    </FormProvider>
  );
};

export default OrdersAdd;
