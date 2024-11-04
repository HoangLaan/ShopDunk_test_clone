import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { useLocation, useParams } from 'react-router-dom';
import PromotionInformation from './components/add/PromotionsInformation';
import PromotionsCondition from './components/add/PromotionsCondition';
import CouponProduct from 'pages/Coupon/components/add/CouponProduct';
import CouponCustomerType from 'pages/Coupon/components/add/CouponCustomerType';
import PromotionProductCategory from './components/add/PromotionProductCategory';
import PromotionSetting from './components/add/PromotionSetting';
import PromotionsPaymentApply from './components/add/PromotionsPaymentApply';
import PromotionPOOffersApply from './components/add/PromotionPOOffersApply';
import PromotionNote from './components/add/PromotionNote';
import { create, getDetail, stopPromotion, update } from 'services/promotions.service';
import { showToast } from 'utils/helpers';
// import CommissionReview from 'pages/Commission/components/Sections/CommissionReview';
import PromotionReview from 'pages/PromotionOffers/components/add/PromotionReview';
import { TYPE_REVIEW, VALUE_DEFAULT } from 'pages/Promotions/utils/constants';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';

const PromotionsAddPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { pathname } = useLocation();
  const [checkReview, setCheckReview] = useState(false);
  const disabled = React.useMemo(() => pathname.includes('/detail'), [pathname]);
  const methods = useForm({
    defaultValues: VALUE_DEFAULT,
  });
  const loadDetail = useCallback(() => {
    if(params?.promotion_id) {
      getDetail(params?.promotion_id)
      .then((o) => {
        methods.reset({
          ...o,
          apply_birthday_list: o?.apply_birthday_list
            ? (o?.apply_birthday_list).split(',').map((o) => parseInt(o))
            : [],
        });
        if (o?.is_review * 1 !== TYPE_REVIEW.PENDING) {
          setCheckReview(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [params]);

  useEffect(loadDetail, [loadDetail]);

  const detailForm = [
    {
      id: 'information_detail',
      title: 'Thông tin chương trình khuyến mại',
      component: PromotionInformation,
      fieldActive: ['promotion_name', 'begin_date', 'end_date'],
    },
    {
      id: 'information_detail',
      title: 'Điều kiện khuyến mại',
      component: PromotionsCondition,
    },
    {
      id: 'information_detail',
      title: 'Danh sách sản phẩm áp dụng khuyến mại',
      component: CouponProduct,
    },
    {
      id: 'information_detail',
      title: 'Ngành hàng áp dụng',
      component: PromotionProductCategory,
    },
    {
      id: 'information_payment',
      title: 'Danh sách ưu đãi khuyến mại',
      component: PromotionPOOffersApply,
    },
    {
      id: 'information_detail',
      title: 'Hạng khách hàng được hưởng khuyến mại',
      component: CouponCustomerType,
    },
    {
      id: 'information_payment',
      title: 'Danh sách hình thức thanh toán được áp dụng',
      component: PromotionsPaymentApply,
    },
    {
      id: 'form_status_review',
      title: 'Mức duyệt',
      component: PromotionReview,
      loadDetail: loadDetail,
    },
    {
      id: 'form_status',
      title: 'Thiết lập khác',
      component: PromotionSetting,
    },
    {
      id: 'form_note',
      title: 'Ghi chú',
      component: PromotionNote,
    },
    {
      id: 'form_status',
      title: 'Trạng thái',
      component: FormStatus,
      fieldActive: ['is_active'],
    },
  ];

  const onSubmit = async (payload) => {
    try {
      let label;
      payload.apply_birthday_list = (payload.apply_birthday_list ?? []).map((o) => o?.value ?? o)?.toString();
      payload.order_type_list = (payload?.order_type_list ?? [])?.map((e) => e?.id ?? e);

      if (params?.promotion_id) {
        await update(params?.promotion_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
        methods.reset({});
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const actions = [
    {
      globalAction: true,
      icon: 'fa fa-stop',
      type: methods.watch('is_stopped') ? 'danger' : 'warning',
      outline: false,
      content: methods.watch('is_stopped') ? 'Chương trình đã dừng' : 'Dừng chương trình',
      hidden:
        !params?.promotion_id ||
        methods.watch('is_review') == TYPE_REVIEW.PENDING ||
        methods.watch('is_review') == TYPE_REVIEW.REJECT,
      onClick: methods.watch('is_stopped')
        ? null
        : (_, d) =>
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn dừng chương trình khuyến mại ?'],
                () => {
                  stopPromotion(params?.promotion_id).then(() => {
                    loadDetail();
                  });
                },
                'Đồng ý',
              ),
            ),
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-check',
      type: 'success',
      submit: true,
      content: params?.promotion_id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      hidden:
        disabled ||
        methods.watch('is_review') == TYPE_REVIEW.ACCPECT ||
        methods.watch('is_review') == TYPE_REVIEW.REJECT,
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled || checkReview} detailForm={detailForm} onSubmit={onSubmit} actions={actions} />
    </FormProvider>
  );
};

export default PromotionsAddPage;
