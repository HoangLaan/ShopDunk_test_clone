import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PromotionOffersType from './components/add/PromotionOffersType';
import FormSection from 'components/shared/FormSection/index';
import PromotionOffersInformation from './components/add/PromotionOffersInformation';
import { OFFER_TYPE } from './utils/constants';
import { create, getDetail, update } from 'services/promotion-offers.service';
import { offerTypes } from './utils/helpers';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { useParams, useLocation } from 'react-router-dom';
import { showToast } from 'utils/helpers';
// import PromotionReview from './components/add/PromotionReview';

const PromotionOffersAddPage = () => {
  const { promotion_offers_id } = useParams();
  const { pathname } = useLocation();
  const disabled = React.useMemo(() => pathname.includes('/detail'), [pathname]);
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      offer_type: OFFER_TYPE.PERCENT,
    },
  });
  const detailForm = [
    {
      id: 'information_detail',
      title: 'Thông tin ưu đãi khuyến mại',
      component: PromotionOffersInformation,
    },
    {
      id: 'information_detail',
      title: 'Ưu đãi khuyến mại',
      component: PromotionOffersType,
    },
    {
      id: 'form_status',
      title: 'Trạng thái',
      component: FormStatus,
    },
  ];

  const onSubmit = async (payload) => {
    try {
      const typeOffer = offerTypes.find((o) => o.value === payload.offer_type)?.field;
      payload[typeOffer] = 1;
      payload.business_list = payload.business_list.map((o) => o?.id ?? o);
      let label;
      if (promotion_offers_id) {
        await update(promotion_offers_id, payload);
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

  const loadData = useCallback(() => {
    if (promotion_offers_id)
      getDetail(promotion_offers_id).then((o) => {
        let offer_type;
        if (o?.is_discount_by_set_price) {
          offer_type = OFFER_TYPE.DIRECT;
          delete o?.is_discount_by_set_price;
        } else if (o?.is_fix_price) {
          offer_type = OFFER_TYPE.HARD;
          delete o?.is_fix_price;
        } else if (o?.is_fixed_gift) {
          offer_type = OFFER_TYPE.GIFT;
          delete o?.is_fixed_gift;
        } else if (o?.is_percent_discount) {
          offer_type = OFFER_TYPE.PERCENT;
          delete o?.is_percent_discount;
        } else if (o?.is_transport) {
          offer_type = OFFER_TYPE.TRANSPORT;
        } else if (o?.is_payment_form) {
          offer_type = OFFER_TYPE.ISPAYMENTFORM;
        }
        methods.reset({
          ...o,
          offer_type,
        });
      });
  }, [promotion_offers_id]);
  useEffect(loadData, [loadData]);

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default PromotionOffersAddPage;
