import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { cancelOrder, create, createOrderNo, read, update } from 'pages/ReviewList/helpers/call-api';
import { useAuth } from 'context/AuthProvider';
import { getErrorMessage, urlToList } from 'utils/index';
import { defaultValueAdd, orderType, paymentStatus } from 'pages/ReviewList/helpers/constans';
import { Modal, Button } from 'antd';
import { updateChangeStatus } from 'pages/ReviewList/helpers/call-api';

import { showConfirmModal } from 'actions/global';
import { showToast } from 'utils/helpers';

import Information from 'pages/ReviewList/components/add/Information/Information';
import BWLoader from 'components/shared/BWLoader/index';
import Panel from 'components/shared/Panel/index';
//import { Popconfirm } from 'antd';

dayjs.extend(customParseFormat);

const ReviewAdd = ({ ReviewId = null, isEdit = true, location }) => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const { user } = useAuth();
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: {},
  });
  const {
    setValue,
    register,
    watch,
    handleSubmit,
    reset,
    trigger,
    // formState: { errors },
  } = methods;
  const [loadingPage, setLoadingPage] = useState(false);

  const history = useHistory();
  const goToPreviousPath = () => {
    history.push(`/review-list`);
  };

  const handleConfirmAppointment = () => {
    try {
      updateChangeStatus(ReviewId, {
        is_approved: 1,
      });
      showToast.success('Đồng ý duyệt thành công !');
    } catch {
      showToast.error('Đồng ý duyệt thất bại !');
    } finally {
      setIsConfirmModalVisible(false);
      loadOrdersDetail();
    }
  };

  const handleCancel = () => {
    try {
      updateChangeStatus(ReviewId, {
        is_approved: 0,
      });
      showToast.success('Từ chối duyệt thành công !');
    } catch (e) {
      showToast.error('Từ chối duyệt thất bại!');
    } finally {
      setIsConfirmModalVisible(false);
      loadOrdersDetail();
    }
  };
  const is_can_edit = watch('is_can_edit');
  const is_cancel = watch('is_cancel');

  const onSubmit = async (values) => {
    let formData = { ...values };

    let newPaymentStatus = 0;

    try {
      if (ReviewId) {
        // nếu bấm thanh toán trong đơn hàng thanh toán 1 phần -> chuyển sang trang thanh toán
        if (formData.button_type === 'save_&_payment' && formData.payment_status === 2) {
          return window._$g.rdr(`/orders/payment/${ReviewId}`);
        }

        const { paymentStatus: payment_status, message } = await update(ReviewId, formData);

        if (formData.button_type !== 'save_&_payment' || +payment_status === paymentStatus.PAID) {
          showToast.success(
            getErrorMessage({
              message: message || 'Cập nhật thành công.',
            }),
          );
        }

        loadOrdersDetail();
      } else {
        const { paymentStatus, message } = await create(formData);

        newPaymentStatus = paymentStatus;

        showToast.success(
          getErrorMessage({
            message: message || 'Thêm mới thành công.',
          }),
        );
      }

      if (!ReviewId && formData.button_type === 'save' && +newPaymentStatus !== paymentStatus.PAID) {
        window._$g.rdr(`/list-booking-care/`);
      }

      if (
        formData.button_type === 'save_&_payment' &&
        (+formData.order_type === orderType.INSTALLMENT_OFFLINE ||
          +formData.order_type === orderType.INSTALLMENT_ONLINE)
      ) {
        return window._$g.rdr(`/orders/payment/${ReviewId}`);
      }
    } catch (error) {
      showToast.error(
        getErrorMessage({
          message: error?.message || 'Đã xảy ra lỗi vui lòng kiểm tra lại.',
        }),
      );
    }
  };

  const [APPROVALSTATUSID, setAPPROVALSTATUSID] = useState(0);

  const loadOrdersDetail = useCallback(() => {
    if (ReviewId) {
      setLoadingPage(true);

      read(ReviewId)
        .then((res) => {
          setAPPROVALSTATUSID(res.APPROVALSTATUSID);
          console.log('res', res);
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
  }, [ReviewId, reset]);

  useEffect(() => {
    loadOrdersDetail();
  }, [loadOrdersDetail]);

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(ReviewId);

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
      ReviewId: ReviewId,
      loading: loadingPage,
      // userSchedule: userSchedule,
      onSubmit: onSubmit,
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel panes={panel} loading={true} />

        <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
          {ReviewId && !is_cancel && is_can_edit ? (
            <button
              style={{ marginRight: 0 }}
              type='button'
              className='bw_btn bw_btn_warning'
              onClick={() =>
                dispatch(
                  showConfirmModal(
                    ['Bạn có thật sự muốn huỷ đơn?', 'Đơn hàng sẽ bị huỷ và anh hưởng tới dữ liệu liên quan.'],
                    async () => {
                      handleCancelOrder();
                    },
                  ),
                )
              }>
              <span className='fi fi-rr-edit'></span>Huỷ đơn
            </button>
          ) : null}

          {watch('appointment_status') === 1 &&
            ![orderType.INSTALLMENT_OFFLINE, orderType.INSTALLMENT_ONLINE].includes(watch('order_type')) && (
              <button type='button' style={{ marginRight: 0 }} className='bw_btn bw_btn_primary'>
                Tạo công việc chăm sóc
              </button>
            )}

          {APPROVALSTATUSID !== 2 && (
            <button
              type='button'
              style={{ marginRight: 0 }}
              className='bw_btn bw_btn_outline bw_btn_outline_success'
              onClick={() => setIsConfirmModalVisible(true)}>
              <span className='fi fi-rr-check'></span>Duyệt đánh giá
            </button>
          )}

          <button type='button' className='bw_btn_outline' onClick={goToPreviousPath}>
            Đóng
          </button>
        </div>
      </div>
      <Modal
        title='
        Duyệt đánh giá'
        class='ttt-popup'
        visible={isConfirmModalVisible} // Replace this line
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Từ chối
          </Button>,
          <Button key='confirm' type='primary' onClick={handleConfirmAppointment}>
            Xác nhận
          </Button>,
        ]}>
        Bạn có đồng ý duyệt đánh giá này không?
      </Modal>
    </FormProvider>
  );
};

export default ReviewAdd;
