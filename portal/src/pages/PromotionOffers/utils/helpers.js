import { OFFER_TYPE, TYPEVALUE } from './constants';

const offerTypes = [
  {
    value: OFFER_TYPE.PERCENT,
    label: 'Khuyến mại theo phần trăm',
    field: 'is_percent_discount',
    addonAfter: '%',
  },
  {
    value: OFFER_TYPE.DIRECT,
    label: 'Giảm giá trực tiếp',
    field: 'is_discount_by_set_price',
    addonAfter: 'VNĐ',
  },
  {
    value: OFFER_TYPE.HARD,
    label: 'Bán đồng giá',
    field: 'is_fix_price',
    addonAfter: 'VNĐ',
  },
  {
    value: OFFER_TYPE.GIFT,
    label: 'Quà tặng',
    field: 'is_fixed_gift',
  },
  {
    value: OFFER_TYPE.TRANSPORT,
    label: 'Khuyến mại vận chuyển',
    field: 'is_transport',
  },
  {
    value: OFFER_TYPE.ISPAYMENTFORM,
    label: 'Hình thức thanh toán',
    field: 'is_payment_form',
  },
];

const typePromotionOffers = [
  {
    label: 'đ',
    value: TYPEVALUE.MONEY,
  },
  {
    label: '%',
    value: TYPEVALUE.PERCENT,
  },
];

export { offerTypes, typePromotionOffers };
