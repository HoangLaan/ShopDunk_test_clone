import FormSection from 'components/shared/FormSection/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CouponInformation from 'pages/Coupon/components/add/CouponInformation';
import CouponPromotional from 'pages/Coupon/components/add/CouponPromotional';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import CouponCustomerType from 'pages/Coupon/components/add/CouponCustomerType';
import CouponSetting from 'pages/Coupon/components/add/CouponSetting';

import { useForm, FormProvider } from 'react-hook-form';
import { KEY_FORM_COUPON, TYPO_TITLE_FORM } from 'pages/Coupon/utils/constants';
import { createCouponService, getDetaiCouponService, updateCouponService } from 'services/coupon.service';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import CouponProduct from '../components/add/CouponProduct';
import CouponConfig from '../components/add/CouponConfig';
import CouponValue from '../components/add/CouponValue';

const CouponAddPage = ({ noActions }) => {
  const methods = useForm();
  const { watch, formState } = methods;
  const { pathname } = useLocation();
  const { coupon_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [isReady, setIsReady] = useState(false);

  const detailForm = [
    {
      id: KEY_FORM_COUPON.INFORMATION,
      title: TYPO_TITLE_FORM.INFORMATION,
      component: CouponInformation,
      fieldActive: ['coupon_name'],
      isReady: isReady,
      id: coupon_id,
    },
    {
      id: KEY_FORM_COUPON.COUPON_CONFIG,
      title: TYPO_TITLE_FORM.COUPON_CONFIG,
      component: CouponConfig,
      hidden: !watch('is_auto_gen'),
      fieldActive: ['total_letter'],
    },
    {
      id: KEY_FORM_COUPON.COUPON_VALUE,
      title: TYPO_TITLE_FORM.COUPON_AUTOGEN_VALUE,
      component: CouponValue,
      hidden: !watch('is_auto_gen'),
    },
    {
      id: KEY_FORM_COUPON.COUPON_VALUE,
      title: TYPO_TITLE_FORM.COUPON_VALUE,
      component: CouponPromotional,
      hidden: watch('is_auto_gen') || watch('is_auto_gen') === undefined,
      fieldActive: ['is_gift_code'],
      isReady: isReady,
      id: coupon_id,
    },
    {
      id: KEY_FORM_COUPON.COUPON_PRODUCT,
      title: TYPO_TITLE_FORM.COUPON_PRODUCT,
      component: CouponProduct,
    },
    {
      id: KEY_FORM_COUPON.CUSTOMER_TYPE_APPLY,
      title: TYPO_TITLE_FORM.CUSTOMER_TYPE_APPLY,
      component: CouponCustomerType,
    },
    {
      id: KEY_FORM_COUPON.COUPON_SETTING,
      title: TYPO_TITLE_FORM.COUPON_SETTING,
      component: CouponSetting,
      fieldActive: [
        watch('is_aplly_other_coupon')
          ? 'is_aplly_other_coupon'
          : watch('is_aplly_other_promotion')
            ? 'is_aplly_other_promotion'
            : 'is_limit_promotion_times',
      ],
    },
    {
      id: KEY_FORM_COUPON.COUPON_STATUS,
      title: TYPO_TITLE_FORM.COUPON_STATUS,
      hiddenSystem: true,
      component: FormStatus,
    },
  ];
  const onSubmit = async (payload) => {
    try {
      payload.error_list = (payload?.error_list ?? [])?.map((e) => e?.error_id);
      payload.request_type_list = (payload?.request_type_list ?? [])?.map((e) => e?.value ?? e?.id);
      payload.customer_type_list = (payload?.customer_type_list ?? [])?.map((e) => e?.customer_type_id);
      payload.order_type_list = (payload?.order_type_list ?? [])?.map((e) => e?.id ?? e);
      let label;
      if (coupon_id) {
        await updateCouponService({ coupon_id: coupon_id, ...payload });
        label = 'Chỉnh sửa';
      } else {
        await createCouponService(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: true,
        theme: 'colored',
      });
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: true,
        theme: 'colored',
      });
    }
  };

  const loadCouponDetail = useCallback(() => {
    if (coupon_id) {
      getDetaiCouponService(coupon_id).then((value) => {
        methods.reset({
          ...value,
          request_type_list: value?.request_type_list?.map((e) => {
            return {
              value: e?.request_type_id,
              label: e?.request_type_name,
            };
          }),
        });
      });
      setIsReady(true);
    } else {
      methods.reset({
        is_active: 1,
        is_all_customer_type: 1,
        is_all_product: 1,
        is_letter_n_number: 1,
        is_auto_gen: 0,
        is_handmade: 1,
        promotional_list: [
          {
            coupon_code: undefined,
            code_value: undefined,
            code_type: 1,
            quantity: undefined,
            min_total_money: undefined,
            max_total_money: undefined,
            min_count: undefined,
            max_count: undefined,
            max_value_reduce: undefined,
            percent_value: undefined,
          },
        ],
      });
    }
  }, [coupon_id]);

  useEffect(loadCouponDetail, [loadCouponDetail]);

  
  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection noActions={noActions} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
      </FormProvider>
    </React.Fragment>
  );
};

export default CouponAddPage;
