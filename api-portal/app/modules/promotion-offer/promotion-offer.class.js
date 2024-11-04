const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    promotion_offer_id: '{{#? PROMOTIONOFFERID}}',
    promotion_offer_name: '{{#? PROMOTIONOFFERNAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    business_id: '{{#? BUSINESSID}}',

    company_name: '{{#? COMPANYNAME}}',
    company_id: '{{#? COMPANYID }}',

    create_date: '{{#? CREATEDDATE}}',
    order_index: '{{#? ORDERINDEX}}',
    condition_content: '{{#? CONDITIONCONTENT}}',
    description: '{{#? DESCRIPTION}}',
    is_percent_discount: '{{ISPERCENTDISCOUNT ? 1 : 0}}',
    is_discount_by_set_price: '{{ISDISCOUNTBYSETPRICE ? 1 : 0}}',
    is_fixed_gift: '{{ISFIXEDGIFT ? 1 : 0}}',
    is_fix_price: '{{ISFIXPRICE ? 1 : 0}}',
    is_transport: '{{ISTRANSPORT ? 1 : 0}}',
    discount_value: '{{#? DISCOUNTVALUE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    product_gifts_id: '{{#? PRODUCTGIFTSID}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    model_id: '{{#? MODELID}}',
    model_name: '{{#? MODELNAME}}',
    manufacturer_id: '{{#? MANUFACTURERID}}',
    manufacturer_name: '{{#? MANUFACTURERNAME}}',
    product_id: '{{#? PRODUCTID}}',
    offer_type: '{{#? OFFER_TYPE}}',
    offer: '{{#? OFFER}}',
    result: '{{#? RESULT}}',
    table_used: '{{#? TABLEUSED}}',

    shipping_promotion: '{{#? SHIPPINGPROMOTION}}',
    discount_shipping_fee: '{{#? DISCOUNTSHIPPINGFEE}}',
    percent_shipping_fee: '{{#? PERCENTSHIPPINGFEE}}',
    discount_max: '{{#? DISCOUNTMAX}}',

    max_value_reduce: '{{#? MAXVALUEREDUCE}}',
    max_total_money: '{{#? MAXTOTALMONEY}}',
    min_total_money: '{{#? MINTOTALMONEY}}',

    is_payment_form: '{{ISPAYMENTFORM ? 1 : 0}}',
    company_value: '{{#? COMPANYVALUE}}',
    partner_value: '{{#? PARTNERVALUE}}',
    type_value: '{{#? TYPEVALUE}}',

    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
};

let transform = new Transform(template);

const detail = (value) => {
    return transform.transform(value, [
        'promotion_offer_id',
        'promotion_offer_name',
        'company_name',
        'company_id',
        'order_index',
        'condition_content',
        'create_date',
        'description',
        'is_percent_discount',
        'is_discount_by_set_price',
        'is_fixed_gift',
        'is_fix_price',
        'discount_value',
        'is_active',
        'is_system',
        'offer',
        'is_transport',
        'shipping_promotion',
        'discount_shipping_fee',
        'discount_max',
        'percent_shipping_fee',
        'max_value_reduce',
        'max_total_money',
        'min_total_money',
        'is_payment_form',
        'company_value',
        'partner_value',
        'type_value'
    ]);
};

const list = (values = []) => {
    return transform.transform(values, [
        'promotion_offer_id',
        'promotion_offer_name',
        'business_name',
        'business_id',
        'offer',
        'create_date',
        'offer_type',
        'is_active',
        'is_system',
    ]);
};

const listGift = (values = []) => {
    return transform.transform(values, [
        'product_gifts_id',
        'product_code',
        'product_id',
        'product_name',
        'model_id',
        'model_name',
        'manufacturer_id',
        'manufacturer_name',
        'picture_url',
    ]);
};

const detailUsed = (used = []) => {
    return transform.transform(used, ['result', 'table_used']);
};

module.exports = {
    list,
    detail,
    detailUsed,
    listGift,
};
