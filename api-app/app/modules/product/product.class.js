'use strict';
const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const getInformationProduct = values => {
    const template = {
        model_id: '{{#? MODELID}}',
        model_name: '{{#? MODELNAME}}',
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_display_name: '{{#? PRODUCTDISLAYNAME}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_inventory: '{{#? PRODUCTINVENTORY}}',
    };
    let transform = new Transform(template);
    return transform.transform(values, Object.keys(template));
};

const getListProduct = values => {
    const template = {
        model_id: '{{#? MODELID}}',
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_display_name: '{{#? PRODUCTDISLAYNAME}}',
        image_url: [
            {
                '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        model_name: '{{#? MODELNAME}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
        current_price: '{{#? CURRENTPRICE}}',
        current_base_price: '{{#? CURRENTBASEPRICE}}',
        original_price: '{{#? ORIGINALPRICE}}',
        original_base_price: '{{#? ORIGINALBASEPRICE}}',
        vat_value: '{{VATVALUE ? VATVALUE : 0}}',
        quantity: '{{QUANTITY ? QUANTITY : 0}}',
        stock_id: '{{#? STOCKSID}}',
        stock_name: '{{#? STOCKSNAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(values, Object.keys(template));
};

const listAttribute = (list = []) => {
    const template = {
        model_id: '{{#? MODELID}}',
        product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_name: '{{#? ATTRIBUTENAME}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

const listProductAttribute = (list = []) => {
    const template = {
        product_id: '{{#? PRODUCTID}}',
        product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_value_id: '{{#? ATTRIBUTEVALUESID}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

const listAttributeValue = (list = []) => {
    const template = {
        product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_value_id: '{{#? ATTRIBUTEVALUESID}}',
        attribute_value: '{{#? ATTRIBUTEVALUES}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

// PROMOTION
const templatePromotion = {
    promotion: {
        promotion_id: '{{#? PROMOTIONID}}',
        promotion_name: '{{#? PROMOTIONNAME}}',
        short_description: '{{#? SHORTDESCRIPTION}}',
        is_apply_order: '{{ISAPPLYORDER ? 1 : 0}}',
        is_apply_all_product: '{{ISAPPLYALLPRODUCT ? 1 : 0}}',
        is_apply_any_product: '{{ISAPLLYANYPRODUCT ? 1 : 0}}',
        is_apply_appoint_product: '{{ISAPLLYAPPOINTPRODUCT ? 1 : 0}}',
        is_promotion_by_price: '{{ISPROMOTIONBYPRICE ? 1 : 0}}',
        from_price: '{{FROMPRICE ? FROMPRICE : 0}}',
        to_price: '{{TOPRICE ? TOPRICE : 0}}',
        is_promotion_by_total_money: '{{ISPROMOTIONBYTOTALMONEY ? 1 : 0}}',
        min_promotion_total_money: '{{MINPROMOTIONTOTALMONEY ? MINPROMOTIONTOTALMONEY : 0}}',
        max_promotion_total_money: '{{MAXPROMOTIONTOTALMONEY ? MAXPROMOTIONTOTALMONEY : 0}}',
        is_promotion_by_total_quantity: '{{ISPROMOTIONBYTOTALQUANTITY ? 1 : 0}}',
        min_promotion_total_quantity: '{{MINPROMOTIONTOTALQUANTITY ? MINPROMOTIONTOTALQUANTITY : 0}}',
        max_promotion_total_quantity: '{{MAXPROMOTIONTOTALQUANTITY ? MAXPROMOTIONTOTALQUANTITY : 0}}',
        is_apply_with_other_promotion: '{{ISAPPLYWITHORDERPROMOTION ? 1 : 0}}',
        is_limit_promotion_times: '{{ISLIMITPROMOTIONTIMES ? 1 : 0}}',
        max_promotion_time: '{{MAXPROMOTIONTIMES ? MAXPROMOTIONTIMES : 0}}',
        is_reward_point: '{{ISREWARDPOINT ? 1 : 0}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        is_all_product_category: '{{ISALLPRODUCTCATEGORY ? 1 : 0}}',
    },
    product_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        product_id: '{{#? PRODUCTID}}',
    },
    product_category_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
    },
    offer: {
        promotion_id: '{{#? PROMOTIONID}}',
        business_id: '{{#? BUSINESSID}}',
        promotion_offer_id: '{{#? PROMOTIONOFFERID}}',
        promotion_offer_name: '{{#? PROMOTIONOFFERNAME}}',
        is_fix_price: '{{ISFIXPRICE ? 1 : 0}}',
        is_percent_discount: '{{ISPERCENTDISCOUNT ? 1 : 0}}',
        is_fixed_gift: '{{ISFIXEDGIFT ? 1 : 0}}',
        is_discount_by_set_price: '{{ISDISCOUNTBYSETPRICE ? 1 : 0}}',
        discount_value: '{{DISCOUNTVALUE ? DISCOUNTVALUE : 0}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        discount: '{{DISCOUNT ? DISCOUNT : 0}}',
        is_transport: '{{ISTRANSPORT ? 1 : 0}}',
        shipping_promotion: '{{SHIPPINGPROMOTION ? SHIPPINGPROMOTION : 0}}',
        discount_shipping_fee: '{{DISCOUNTSHIPPINGFEE ? DISCOUNTSHIPPINGFEE : 0}}',
        percent_shipping_fee: '{{PERCENTSHIPPINGFEE ? PERCENTSHIPPINGFEE : 0}}',
        discount_max: '{{DISCOUNTMAX ? DISCOUNTMAX : 0}}',
    },
    gift: {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        promotion_offer_id: '{{#? PROMOTIONOFFERID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_gift_id: '{{#? PRODUCTGIFTSID}}',
        unit_name: '{{#? UNITNAME}}',
        product_unit_id: '{{#? UNITID}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        quantity: '{{QUANTITY ? QUANTITY : 0}}',
    },
};
const promotions = (promotion, applied = false) => {
    const transform = new Transform(templatePromotion.promotion);
    let columns = [
        'promotion_id',
        'promotion_name',
        'short_description',
        'is_apply_order',
        'is_apply_all_product',
        'is_apply_any_product',
        'is_apply_appoint_product',
        'is_promotion_by_price',
        'from_price',
        'to_price',
        'is_promotion_by_total_money',
        'min_promotion_total_money',
        'max_promotion_total_money',
        'is_promotion_by_total_quantity',
        'min_promotion_total_quantity',
        'max_promotion_total_quantity',
        'is_apply_with_other_promotion',
        'is_limit_promotion_times',
        'max_promotion_time',
        'is_reward_point',
        'is_all_product_category',
    ];
    if (applied) columns.push('is_picked');
    return transform.transform(promotion, columns);
};

const offers = (offer, applied = false) => {
    const transform = new Transform(templatePromotion.offer);
    let columns = [
        'promotion_id',
        'business_id',
        'promotion_offer_name',
        'promotion_offer_id',
        'is_fix_price',
        'is_percent_discount',
        'is_fixed_gift',
        'is_discount_by_set_price',
        'discount_value',
        'is_transport',
        'shipping_promotion',
        'discount_shipping_fee',
        'percent_shipping_fee',
        'discount_max',
    ];
    if (applied) columns = [...columns, ...['is_picked', 'discount']];
    return transform.transform(offer, columns);
};

const productApplyPromotion = products => {
    const transform = new Transform(templatePromotion.product_apply);
    return transform.transform(products, ['promotion_id', 'product_id']);
};

const gift = (products, applied = false) => {
    const transform = new Transform(templatePromotion.gift);
    let columns = [
        'product_name',
        'product_id',
        'promotion_offer_id',
        'product_gift_id',
        'unit_name',
        'product_code',
        'product_unit_id',
    ];
    if (applied) columns = [...columns, ...['is_picked', 'quantity']];
    return transform.transform(products, columns);
};

const productCategoryApplyPromotion = products => {
    const transform = new Transform(templatePromotion.product_category_apply);
    return transform.transform(products, ['promotion_id', 'product_category_id']);
}

const detail = (values) => {
  const template = {
      product_id: '{{#? PRODUCTID}}',
      product_display_name: '{{#? PRODUCTDISPLAYNAME}}',
      product_category_id: '{{#? PRODUCTCATEGORYID}}',
      manufacture_id: '{{#? MANUFACTURERID}}',
      product_imei_code: '{{#? PRODUCTIMEICODE}}',
      model_id: '{{#? MODELID}}',
      origin_id: '{{#? ORIGINID}}',
      image_url:
      [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
      ],
      base_price: '{{#? BASEPRICE}}',
      price: '{{#? PRICE}}',
  };
  let transform = new Transform(template);
  return transform.transform(values, Object.keys(template));
};

const getAttribute = (values ={}) => {
  const template = {
      product_id: '{{#? ATTRIBUTENAME}}',
      product_display_name: '{{#? ATTRIBUTEVALUES}}',
      product_category_id: '{{#? UNITNAME}}',
  };
  let transform = new Transform(template);
  return transform.transform(values, Object.keys(template));
};

module.exports = {
    getInformationProduct,
    getListProduct,
    listAttribute,
    listAttributeValue,
    listProductAttribute,
    promotions,
    offers,
    productApplyPromotion,
    gift,
    productCategoryApplyPromotion,
    detail,
    getAttribute
};
