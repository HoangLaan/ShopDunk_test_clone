import { getListPromotion } from 'pages/websiteDirectory/helpers/call-api';
import { paymentFormType } from 'pages/websiteDirectory/helpers/constans';

const getValueByWatch = (methods = () => {}, field, value = null, valueDefault = null) => {
  let result = valueDefault;
  if (value) {
    result = value;
  } else {
    result = methods.watch(field);
  }
  return result;
};

const checkIsNumberNotZero = (value) => {
  const checkValue = parseInt(value) ?? 0;
  if (checkValue) {
    return true;
  }
  return false;
};

const checkItemArrayInObject = (valArr, key, val, valCompare = 0, valueDefault = null) => {
  let result = valueDefault;
  if (valArr && Array.isArray(valArr) && valArr.length > valCompare) {
    result = valArr?.filter((x) => x[key] == val).length;
  }
  return result;
};

const checkIsEmptyArray = (value) => {
  const checkValue = value && Array.isArray(value) && value.length > 0;
  if (checkValue) {
    return true;
  }
  return false;
};

const checkIsEmptyArrayByField = (value, feild) => {
  const checkValue = checkIsEmptyArray(value);
  if (checkValue) {
    for (let i = 0; i < value.length; i++) {
      if (value[i][feild]) {
        return true;
      }
    }
  }
  return false;
};

const getOneFieldMaxinArray = (value = [], field, fieldGet, valueDefault = []) => {
  let result = valueDefault;
  let maxValue = 0;
  const checkArr = checkIsEmptyArray(value);
  if (checkArr) {
    for (let i = 0; i < value.length; i++) {
      let item = value[i];
      if (item[field]) {
        const itemFeild = item[field];
        const checkArr = checkIsEmptyArray(itemFeild);
        if (checkArr) {
          for (let j = 0; j < itemFeild.length; j++) {
            const itemFeildGet = itemFeild[j];
            const itemFeildGetValue = itemFeildGet[fieldGet];
            if (itemFeildGetValue) {
              const parseinValue = parseInt(itemFeildGetValue) ?? 0;
              if (parseinValue > maxValue) {
                result[0] = itemFeildGet;
                maxValue = parseinValue;
              }
            }
          }
        }
      }
    }
  }

  const checkArrResult = checkIsEmptyArray(result);
  if (checkArrResult) {
    return result;
  }
  return false;
};

const checkObjectAssign = (value) => {
  if (value) {
    const arrValue = Object.values(value || {});
    if (checkIsEmptyArray(arrValue)) {
      return true;
    }
  }

  return false;
};

const KEYDEFFEND = {
  order_type_id: {
    condition: checkIsNumberNotZero,
  },
  order_type_id: {
    condition: checkIsNumberNotZero,
  },
  business_id: {
    condition: checkIsNumberNotZero,
  },
  payment_status: {
    condition: checkIsNumberNotZero,
  },
  member_id: {
    condition: checkIsNumberNotZero,
    orConditionOr: ['dataleads_id'],
    renameField: 'customer_id',
  },
  dataleads_id: {
    condition: checkIsNumberNotZero,
    orConditionOr: ['member_id'],
    renameField: 'customer_id',
  },
  customer_type_name: null,
  store_id: {
    condition: checkIsNumberNotZero,
  },
  products: {
    condition: checkObjectAssign,
  },
  data_payment: {
    condition: checkIsEmptyArray,
  },
};

const forCheckOrOneValue = (methods = () => {}, value, field, valueField) => {
  const checkValue = checkIsEmptyArray(value);
  if (checkValue) {
    for (let i = 0; i < value.length; i++) {
      let item = value[i];
      if (field) {
        if (item == field) {
          if (valueField) {
            return true;
          }
        }
      } else {
        const valueAssign = getValueByWatch(methods, item, null);
        if (valueAssign) {
          return true;
        }
      }
    }
  }

  return false;
};

const checkArrayAndAssignToObject = (methods = () => {}, value = [], valueFuncCondition = {}, field, valueField) => {
  let objAssign = {};
  const checkValue = checkIsEmptyArray(value);
  if (checkValue) {
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (item) {
        let valueAssign = null;
        if (item == field) {
          valueAssign = getValueByWatch(methods, item, valueField);
        } else {
          valueAssign = getValueByWatch(methods, item, null);
        }
        let checkItems = valueFuncCondition[item]?.condition;
        let checkItemsOrConditionOr = valueFuncCondition[item]?.orConditionOr;
        let funcGetItems = valueFuncCondition[item]?.handleCompare;
        if (checkItems) {
          if (!checkItems(valueAssign)) {
            if (checkItemsOrConditionOr) {
              const checkItemOr = forCheckOrOneValue(methods, checkItemsOrConditionOr);
              if (!checkItemOr) {
                return false;
              }
            } else {
              return false;
            }
          }
        }

        if (funcGetItems) {
          valueAssign = funcGetItems(valueAssign);
        }
        objAssign[item] = valueAssign;
      }
    }
    return objAssign;
  }
  return false;
};

const checkAndCompareObjproduct = (value) => {
  const result = Object.keys(value)
    .map((key) => value[key])
    .filter((p) => !p?.is_promotion_gift);
  return result;
};
const getPromotionIsMax = (methods = () => {}, field, value) => {
  const promotion_apply = methods.watch('promotion_apply');
  const checkNullPromotionApply = checkIsEmptyArray(promotion_apply);

  if (!checkNullPromotionApply) {
    const CLONEKEYDEFFEND = KEYDEFFEND;
    const getKeyDef = Object.getOwnPropertyNames(CLONEKEYDEFFEND);
    const checkKeyObject = checkIsEmptyArray(getKeyDef);
    if (checkKeyObject) {
      let checkOrObjectCondition = checkArrayAndAssignToObject(methods, getKeyDef, CLONEKEYDEFFEND, field, value);

      if (checkOrObjectCondition) {
        checkOrObjectCondition.shipping_fee = 20000;
        checkOrObjectCondition.products = checkAndCompareObjproduct(checkOrObjectCondition.products);
        checkOrObjectCondition.order_status_id = checkOrObjectCondition.order_type_id;
        getListPromotion(checkOrObjectCondition).then((res) => {
          if (res) {
            let itemPromotionMax = getOneFieldMaxinArray(res, 'offers', 'discount');
            itemPromotionMax.is_picked = true;
            onChangePromotions(methods, itemPromotionMax, false);
          }
        });
      }
    }
  }
};

const onChangePromotions = (methods = () => {}, selected, isPlusPoint) => {
  const { watch, setValue, reset } = methods;
  const promotion_apply = watch('promotion_apply');
  const expoint_value = watch('expoint_value') || 0;

  let promotion_apply_ = (promotion_apply || [])?.reduce((promotionList, promotion) => {
    const offers = selected?.filter((offer) => offer.promotion_id === promotion.promotion_id);
    if (offers.length > 0) {
      for (let i = 0; i < offers.length; i++) {
        const index = promotion.offers.findIndex((item) => item.promotion_offer_id === offers[i].promotion_offer_id);
        if (index !== -1) {
          promotion.offers[index] = {
            ...promotion.offers[index],
            ...offers[i],
            is_picked: true,
          };

          promotion = {
            ...promotion,
            is_picked: true,
          };
        }
      }
    }

    return [...promotionList, promotion];
  }, []);

  setValue('promotion_apply', promotion_apply_);
  setValue(
    'promotion_offers',
    selected.map((item) => ({ ...item, is_picked: true })),
  );

  let newProducts = Object.values(watch('products') || {}).map((item) => ({ ...item, discount: 0 }));
  let gifts = [];
  const discount_value = selected?.reduce((offerDiscount, curr) => {
    if (
      curr.is_fix_price ||
      curr.is_discount_by_set_price ||
      curr.is_discount_by_set_price ||
      curr.is_percent_discount
    ) {
      // áp dụng giảm giá cho sản phẩm
      if (curr?.offer_product && curr?.offer_product?.length > 0) {
        newProducts = newProducts.map((product) => {
          const find = curr?.offer_product?.find((offer) => offer?.imei_code === product?.imei_code);
          if (find) {
            //tính tổng khuyến mại từ sản phẩm
            offerDiscount += +find?.discount || 0;

            return {
              ...product,
              discount_value: +find?.discount || 0,
            };
          }
          return product;
        });

        return offerDiscount;
      }

      return offerDiscount + parseInt(curr?.discount);
    } else if (curr.is_transport) {
      return offerDiscount + parseInt(curr?.shipping_discount);
    } else if (curr.is_fixed_gift) {
      gifts = gifts.concat(
        curr.gifts.map((item) => ({
          ...item,
          promotion_id: curr.promotion_id,
          promotion_offer_id: curr.promotion_offer_id,
        })),
      );
      return offerDiscount;
    }

    return offerDiscount;
  }, 0);

  //products
  setValue('products', newProducts?.reduce((acc, curr) => ({ ...acc, [curr?.imei_code]: curr }), {}) || {});

  // gifts
  gifts = gifts.filter((item) => item?.is_picked && item?.quantity > 0);
  let cloneGift = structuredClone(gifts);
  const products = Object.values(watch('products') || {});
  if (products && Array.isArray(products) && products.length > 1 && gifts && gifts.length) {
    for (let i = 1; i < products.length; i++) {
      cloneGift.map((val, index) => {
        if (val) {
          let countProductGift = checkItemArrayInObject(gifts, 'product_id', val?.product_id, 0);
          let lengthIme = 0;
          let imei_code_options = val?.imei_code_options;
          if (imei_code_options && Array.isArray(imei_code_options)) {
            lengthIme = imei_code_options.length;
          }
          if (countProductGift <= lengthIme) {
            gifts.push(val);
          }
        }
      });
    }
  }
  reset(watch());
  setValue('gifts', gifts);

  setValue('coupon', null);
  setValue('coupon_code', null);
  setValue('discount_coupon', 0);

  updateTotalMoney(methods, discount_value, 0, expoint_value);

  setValue('is_plus_point', isPlusPoint);

  resetDataPayment(methods);
};

const resetDataPayment = (methods = () => {}) => {
  const { watch, setValue } = methods;
  const oldDataPayment = watch('data_payment') || [];
  let flag = true;
  setValue(
    'data_payment',
    oldDataPayment.map((item) => {
      if (item.is_checked && item.payment_type === paymentFormType.CASH && flag) {
        flag = false;
        return { ...item, payment_value: watch('sub_total_apply_discount') };
      }
      return { ...item, payment_value: 0 };
    }),
  );

  setValue('return_money', 0);
};

const updateTotalMoney = (methods = () => {}, discount_value, discount_coupon, expoint_value) => {
  const { watch, setValue } = methods;

  const total_money = watch('total_money') || 0;
  const cloneDiscountValue = structuredClone(watch('discount_value'));
  const cloneDiscount = structuredClone(watch('discount_coupon'));
  let discount = 0;
  let discountValue = 0;
  if (cloneDiscount) {
    discount = parseInt(cloneDiscount) ?? 0;
  }

  if (cloneDiscountValue) {
    discountValue = parseInt(cloneDiscountValue) ?? 0;
  }

  if (discount_value) {
    discountValue = parseInt(discount_value) ?? 0;
  }

  const result = discount + discount_coupon;
  setValue('discount_value', discount_value);
  setValue('discount_coupon', result);
  //cap nhat gia tri thanh toan
  setValue('total_discount', discountValue + result + expoint_value);

  const total_a_mount = total_money - (discountValue + result + expoint_value);
  setValue('total_a_mount', total_a_mount > 0 ? total_a_mount : 0);
  setValue('sub_total_apply_discount', total_a_mount > 0 ? total_a_mount : 0);
  resetDataPayment(methods);
};

export { getPromotionIsMax };
