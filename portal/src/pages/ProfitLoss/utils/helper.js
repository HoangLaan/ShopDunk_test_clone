import { DISCOUNT_TYPE, VALUE_TYPE } from './constants';

export const calculateDiscount = (program, product) => {
  const productPrice = product.product_price || 0;

  if (program.is_apply_with_trade_program) {
    if (program.supplier_deductible_type === VALUE_TYPE.VND) {
      return program.supplier_deductible || 0;
    } else if (program.supplier_deductible_type === VALUE_TYPE.PERCENT && productPrice) {
      return (productPrice * (program.supplier_deductible || 0)) / 100;
    }
  } else if (program.is_apply_direct_discount && program.supplier_promotion_code === DISCOUNT_TYPE.SUPPLIER) {
    return program.supplier_discount_value || 0;
  } else if (program.is_apply_direct_discount && program.supplier_promotion_code === DISCOUNT_TYPE.SHOPDUNK) {
    if (program.shopdunk_discount_type === VALUE_TYPE.VND) {
      return program.shopdunk_discount_value || 0;
    } else if (program.shopdunk_discount_type === VALUE_TYPE.PERCENT && productPrice) {
      return (productPrice * (program.shopdunk_discount_value || 0)) / 100;
    }
  } else if (program.is_apply_quantity_discount) {
    if (program.discount_type === VALUE_TYPE.VND) {
      return program.discount_value || 0;
    } else if (program.discount_type === VALUE_TYPE.PERCENT && productPrice) {
      return (productPrice * (program.discount_value || 0)) / 100;
    }
  }
  return 0;
};
