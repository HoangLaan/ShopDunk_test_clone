import { COUPON_TYPES, TYPE_PROMOTION_VALUE } from './constants';

const typePromotionValues = [
  {
    label: 'đ',
    value: TYPE_PROMOTION_VALUE.MONEY,
  },
  {
    label: '%',
    value: TYPE_PROMOTION_VALUE.PERCENT,
  },
];

const cloneTypePromotionValues = structuredClone(typePromotionValues);

const typePromotionValuesObjArray = cloneTypePromotionValues.reduce((a, v) => ({...a, [v] : v}), {});

const couponTypes = [
  {
    label: 'Chưa áp dụng',
    class: '',
    value: COUPON_TYPES.PENDING,
  },
  {
    label: 'Đang áp dụng',
    class: 'bw_label_success',
    value: COUPON_TYPES.APPLYING,
  },
  {
    label: 'Hết hạn',
    class: 'bw_label_danger',
    value: COUPON_TYPES.EXPIRED,
  },
];


const ARRAY_DEFEND_CONDITION_COUPON_SETTING = {
  'is_aplly_other_coupon': [
      'list_coupon_apply',
  ],
  'is_aplly_other_promotion': [
      'list_order_promotion_apply'
  ],
  'is_limit_promotion_times': [
      'count_promotion_times',
      'mounth_promotion_times',
  ],
}


export { typePromotionValues, couponTypes, typePromotionValuesObjArray, ARRAY_DEFEND_CONDITION_COUPON_SETTING };
