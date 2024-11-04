const WEEK_ENUM = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 3,
  WEDNESDAY: 4,
  THURSDAY: 5,
  FRIDAY: 6,
  SATURDAY: 7
}

const MONTH_ENUM = {
  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12
}

const TYPE_REVIEW = {
  PENDING: 0,
  ACCPECT: 1,
  REJECT: 2
}

const PROMOTION_TYPE = {
  total: {
    key: 'total',
    label: 'Tất cả ',
    value: 4,
    classActive: 'bw_btn',
    classNone: 'bw_btn_outline'
  },
  total_use: {
    key: 'total_use',
    label: 'Đang áp dụng ',
    value: 2,
    classActive: 'bw_btn_primary',
    classNone: 'bw_btn_outline bw_btn_outline_primary'
  },
  total_not_use: {
    key: 'total_not_use',
    label: 'Chưa áp dụng ',
    value: 1,
    classActive: 'bw_btn_warning',
    classNone: 'bw_btn_outline bw_btn_outline_warning'
  },
  total_stop: {
    key: 'total_stop',
    label: 'Dừng áp dụng ',
    value: 3,
    classActive: 'bw_btn_danger',
    classNone: 'bw_btn_outline bw_btn_outline_danger'
  }
}

const ToastStyle = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
}

const ARRAY_DEFEND_CONDITION_PROMOTION = [
  'is_promotion_by_price',
  'is_promotion_by_total_money',
  'is_promorion_by_total_quantity',
  'is_promorion_by_apply_birthday',
]

const ARRAY_DEFEND_CONDITION_PROMOTION_BY_KEY = {
  is_promotion_by_price: {
    fieldOne: 'from_price',
    fieldTwo: 'to_price',
  },
  is_promotion_by_total_money: {
    fieldOne: 'min_promotion_total_money',
    fieldTwo: 'max_promotion_total_money',
  },
  is_promorion_by_total_quantity: {
    fieldOne: 'min_promotion_total_quantity',
    fieldTwo: 'max_promotion_total_quantity',
  },
  is_promorion_by_apply_birthday: {
    fieldOne: 'apply_birthday_list',
  },
}

const ARRAY_DEFEND_OFFER_PROMOTION = [
  'is_apply_order',
  'promotion_offer_apply_list',
]

const VALUE_DEFAULT = {
  is_active: 1,
  is_apply_order: 1,
  is_all_product: 1,
  is_all_customer_type: 1,
  is_apply_product_category: 1,
  is_apply_all_store: 1,
  is_apply_mon: 1,
  is_apply_tu: 1,
  is_apply_we: 1,
  is_apply_th: 1,
  is_apply_fr: 1,
  is_apply_sa: 1,
  is_apply_sun: 1,
}

const allBusiness = {
  label: 'Tất cả',
  name: "Tất cả",
  value: "9999",
  id: "9999",
  parent_id: "1",
  is_active: "1",
}

export {
  WEEK_ENUM,
  MONTH_ENUM,
  TYPE_REVIEW,
  PROMOTION_TYPE,
  ToastStyle,
  ARRAY_DEFEND_CONDITION_PROMOTION,
  ARRAY_DEFEND_CONDITION_PROMOTION_BY_KEY,
  ARRAY_DEFEND_OFFER_PROMOTION,
  VALUE_DEFAULT,
  allBusiness,
}
