const Transform = require('../../common/helpers/transform.helper');

const template = {
    //# region customer
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    company_name: '{{#? COMPANYNAME}}',
    //#endregion

    //# region request type
    request_type_id: '{{#? REQUESTTYPEID}}',
    request_type_name: '{{#? REQUESTTYPENAME}}',
    //#endregion

    //# region error
    error_id: '{{#? ERRORID}}',
    error_code: '{{#? ERRORCODE}}',
    error_name: '{{#? ERRORNAME}}',
    error_group_name: '{{#? ERRORGROUPNAME}}',
    //#endregion
    type_customer: '{{#? TYPECUSTOMER}}',
    // #region
    coupon_id: '{{#? COUPONID}}',
    coupon_name: '{{#? COUPONNAME}}',
    id: '{{#? COUPONID}}',
    name: '{{#? COUPONNAME}}',
    budget: '{{#? BUDGET}}',
    total_coupon_value: '{{#? TOTALCOUPONVALUE}}',
    is_all_customer_type: '{{ISALLCUSTOMERTYPE ? 1 : 0}}',
    is_all_error: '{{#? ISALLERROR ? 1 : 0}}',
    is_type_error: '{{#? ISTYPEERROR}}',
    start_date: '{{#? STARTDATE}}',
    end_date: '{{#? ENDDATE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    coupon_type_status_id: '{{#? COUPONTYPESTATUSID}}',
    description: '{{#? DESCRIPTION}}',
    created_date: '{{#? CREATEDDATE}}',
    created_user: '{{#? CREATEDUSER}}',
    // #endregion

    // #region value promotion
    coupon_conditionid: '{{#? COUPONCONDITIONID}}',
    code_value: '{{#? CODEVALUE}}',
    max_value_reduce: '{{#? MAXVALUEREDUCE}}',
    max_total_money: '{{#? MAXTOTALMONEY}}',
    min_total_money: '{{#? MINTOTALMONEY}}',
    coupon_code: '{{#? COUPONCODE}}',
    quantity: '{{#? QUANTITY}}',
    percent_value: '{{#? PERCENTVALUE}}',
    code_type: '{{#? CODETYPE ? 1 : 0}}',
    // #endregion
    is_partner: '{{ ISPARTNER ? 1 : 0}}',
    partner_id: '{{#? PARTNERID}}',
    is_supplier: '{{ ISSUPPLIER ? 1 : 0}}',
    supplier_id: '{{#? SUPPLIERID}}',
    is_all_product: '{{#? ISALLPRODUCT}}',
    type_apply_product: [
        {
            '{{#if ISANYPRODUCT}}': 1,
        },
        {
            '{{#elseif ISAPPOINTPRODUCT}}': 2,
        },
        {
            '{{#else}}': null,
        },
    ],
    is_aplly_other_coupon: '{{#? ISAPPLYOTHERCOUPON ? 1 : 0}}',
    is_aplly_other_promotion: '{{#? ISAPPLYOTHERPROMOTION ? 1 : 0}}',
    is_limit_promotion_times: '{{#? ISLIMITCOUPONTIMES ? 1 : 0}}',
    count_promotion_times: '{{#? MAXCOUPONTIMES}}',
    mounth_promotion_times: '{{#? COUPONTIMESCYCLE}}',
    promotionid: '{{#? PROMOTIONID}}',
    source_coupon_id: '{{#? SOURCE_COUPON_ID}}',
    min_count: '{{#? MINTOTALPRODUCT}}',
    max_count: '{{#? MAXTOTALPRODUCT}}',

    is_auto_gen: '{{#? ISAUTOGEN ? 1 : 0}}',
    code_config: '{{#? CODECONFIG}}',
    prefixes: '{{#? PREFIXES}}',
    suffixes: '{{#? SUFFIXES}}',
    total_letter: '{{#? TOTALLETTER}}',
    is_gift_code: '{{#? ISGIFTCODE ? 1 : 0}}',
    preview_code: '{{#? PREVIEWCODE}}',

    is_used: '{{#? ISUSED ? 1 : 0}}',
    used_date: '{{#? USEDDATE}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    customer_email: '{{#? CUSTOMEREMAIL}}',
    customer_phone: '{{#? CUSTOMERPHONE}}',
    order_no: '{{#? ORDERNO}}',

    is_sent: '{{#? ISSENT}}',
    business_id: '{{#? BUSINESSID}}',
};

let transform = new Transform(template);

const optionsCustomer = (data = []) => {
    return transform.transform(data, [
        'customer_type_id',
        'customer_type_name',
        'business_name',
        'business_id',
        'company_name',
        'type_customer',
    ]);
};

const optionsRequestType = (data = []) => {
    return transform.transform(data, ['request_type_id', 'request_type_name']);
};

const optionsError = (data = []) => {
    return transform.transform(data, ['error_id', 'error_code', 'error_name', 'error_group_name']);
};

const optionsPromotion = (data = []) => {
    return transform.transform(data, [
        'coupon_conditionid',
        'code_value',
        'code_type',
        'max_value_reduce',
        'max_total_money',
        'min_total_money',
        'coupon_code',
        'quantity',
        'percent_value',
        'min_count',
        'max_count',
    ]);
};

const optionsListCouponCode = (data = []) => {
    return transform.transform(data, [
        'coupon_code',
        'code_value',
        'code_type',
        'quantity',
        'code_type',
        'total_code_applied',
    ]);
};

const optionsListAutoGenCouponCode = (data = []) => {
    return transform.transform(data, [
        'coupon_code',
        'start_date',
        'end_date',
        'code_type',
        'is_used',
        'used_date',
        'customer_name',
        'customer_email',
        'customer_phone',
        'order_no',
        'total_code_applied',
        'is_sent',
    ]);
};

const optionsCoupon = (data = []) => {
    return transform.transform(data, [
        'id',
        'name'
    ])
}

const list = (data = []) => {
    return transform.transform(data, [
        'is_auto_gen',
        'coupon_id',
        'coupon_name',
        'start_date',
        'end_date',
        'created_date',
        'created_user',
        'is_active',
        'budget',
        'coupon_type_status_id',
        'code_value'
    ]);
};

const detail = (data = []) => {
    return transform.transform(data, [
        'is_auto_gen',
        'code_config',
        'prefixes',
        'suffixes',
        'total_letter',
        'is_gift_code',
        // 'is_letter_n_number',
        // 'is_letter',
        // 'is_number',
        'preview_code',
        'coupon_id',
        'coupon_name',
        'budget',
        'discount_value',
        'is_all_customer_type',
        'start_date',
        'end_date',
        'is_active',
        'note',
        'is_all_error',
        'total_coupon_value',
        'is_type_error',
        'description',
        'coupon_type_status_id',
        'is_partner',
        'partner_id',
        'supplier_id',
        'is_supplier',
        'is_all_product',
        'type_apply_product',
        'is_aplly_other_coupon',
        'is_aplly_other_promotion',
        'is_limit_promotion_times',
        'count_promotion_times',
        'source_coupon_id',
        'promotionid',
        'mounth_promotion_times',
    ]);
};

module.exports = {
    optionsCustomer,
    optionsRequestType,
    list,
    detail,
    optionsError,
    optionsPromotion,
    optionsListCouponCode,
    optionsListAutoGenCouponCode,
    optionsCoupon,
};

