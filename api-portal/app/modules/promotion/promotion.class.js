const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    promotion_id: '{{#? PROMOTIONID}}',
    promotion_name: '{{#? PROMOTIONNAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    business_id: '{{#? BUSINESSID}}',
    company_id: '{{#? COMPANYID}}',
    company_name: '{{#? COMPANYNAME}}',
    url_banner: '{{URLBANNER}}',
    url_image_promotion: '{{URLIMAGEPROMOTION}}',
    begin_date: '{{#? BEGINDATE}}',
    end_date: '{{#? ENDDATE}}',
    is_all_customer_type: '{{ISPROMOTIONCUSTOMERTYPE ? 0 : 1}}',
    create_date: '{{#? CREATEDDATE}}',
    is_review: '{{ISREVIEW}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    short_description: '{{#? SHORTDESCRIPTION}}',
    description: '{{#? DESCRIPTION}}',
    is_apply_hours: '{{#? ISAPPLYHOURS}}',
    start_hours: '{{#? STARTHOURS}}',
    end_hours: '{{#? ENDHOURS}}',
    is_apply_mon: '{{ISAPPLYMON ? 1 : 0}}',
    is_apply_tu: '{{ISAPPLYTU ? 1 : 0}}',
    is_apply_we: '{{ISAPPLYWE ? 1 : 0}}',
    is_apply_th: '{{ISAPPLYTH ? 1 : 0}}',
    is_apply_fr: '{{ISAPPLYFR ? 1 : 0}}',
    is_apply_sa: '{{ISAPPLYSA ? 1 : 0}}',
    is_apply_sun: '{{ISAPPLYSUN ? 1 : 0}}',
    is_promotion_by_price: '{{ISPROMOTIONBYPRICE ? 1 : 0}}',
    from_price: '{{#? FROMPRICE}}',
    to_price: '{{#? TOPRICE}}',
    is_promotion_by_total_money: '{{ISPROMOTIONBYTOTALMONEY ? 1 : 0}}',
    min_promotion_total_money: '{{#? MINPROMOTIONTOTALMONEY}}',
    max_promotion_total_money: '{{#? MAXPROMOTIONTOTALMONEY}}',
    is_promorion_by_total_quantity: '{{ISPROMOTIONBYTOTALQUANTITY ? 1 : 0}}',
    min_promotion_total_quantity: '{{#? MINPROMOTIONTOTALQUANTITY}}',
    max_promotion_total_quantity: '{{#? MAXPROMOTIONTOTALQUANTITY}}',
    is_apply_with_order_promotion: '{{ISAPPLYWITHORDERPROMOTION ? 1 : 0}}',
    is_combo_promotion: '{{ISCOMBOPROMOTION ? 1 : 0}}',
    is_limit_promotion_times: '{{ISLIMITPROMOTIONTIMES ? 1 : 0}}',
    max_promotion_times: '{{#? MAXPROMOTIONTIMES}}',
    is_reward_point: '{{ISREWARDPOINT ? 1 : 0}}',
    reviewed_user: '{{#? USERREVIEW}}',
    review_date: '{{#? REVIEWDATE}}',
    note_review: '{{#? NOTEREVIEW}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    result: '{{#? RESULT}}',
    table_used: '{{#? TABLEUSED}}',
    is_apply_order: '{{ISAPPLYORDER ? 1 : 0}}',
    is_apply_all_product: '{{ISAPPLYALLPRODUCT ? 1 : 0}}',
    reviewed_user_department: '{{#? DEPARTMENTID}}',
    user_review_name: '{{#? USERREVIEWNAME}}',
    is_apply_product_category: '{{ISAPPLYPRODUCTCATEGORY ? 0 : 1}}',
    is_stopped: '{{ISSTOPPED ? 1 : 0}}',
    stopped_date: '{{#? STOPPEDDATE}}',
    stopped_user: '{{#? STOPPEDUSER}}',
    stopped_reason: '{{#? STOPPEDREASON}}',
    is_apply_product_combo: '{{ISAPPLYPRODUCTCOMBO ? 1 : 0}}',
    is_apply_for_web: '{{ISAPPLYFORWEB ? 1 : 0}}',
    is_apply_sale_channel: '{{ISAPPLYSALECHANNEL ? 1 : 0}}',
    is_all_product: '{{ISAPPLYALLPRODUCT ? 1 : 0}}',
    type_apply_product: '{{#? TYPEAPPLYPRODUCT}}',
    time_start: '{{#? TIMESTART}}',
    time_end: '{{#? TIMEEND}}',
    is_apply_all_store: '{{#? ISAPPLYALLSTORE}}',
    apply_birthday_list: '{{#? APPLYBIRTHDAYLIST}}',
    is_all_product_category: '{{ISALLPRODUCTCATEGORY ? 1 : 0}}',
    url_banner_promotion: '{{URLBANNER}}',
    create_user: '{{#? CREATEDUSER}}',
    is_promorion_by_apply_birthday: '{{ISPROMORIONBYAPPLYBIRTHDAY ? 1 : 0}}',
    is_all_payment_form: '{{ISALLPAYMENTFORM ? 1 : 0}}',
    check_condition: [
        {
            '{{#if ISPROMOTIONBYPRICE}}': 1,
        },
        {
            '{{#elseif ISPROMOTIONBYTOTALMONEY}}': 1,
        },
        {
            '{{#elseif ISPROMOTIONBYTOTALQUANTITY}}': 1,
        },
        {
            '{{#elseif ISAPPLYWITHORDERPROMOTION}}': 1,
        },
        {
            '{{#else}}': null,
        },
    ],
    is_all_promotion_product: '{{ISPROMOTIONBYPRODUCT ? 1 : 0}}',
    type_apply_promotion_product: [
        {
            '{{#if ISPROMOTIONANYPRODUCT}}': 1,
        },
        {
            '{{#elseif ISPROMOTIONAPPOINTPRODUCT}}': 2,
        },
        {
            '{{#else}}': null,
        },
    ],
};

let transform = new Transform(template);

const detail = (promotion) => {
    const data = transform.transform(promotion, [
        'promotion_id',
        'promotion_name',
        'company_id',
        'company_name',
        'url_banner',
        'url_image_promotion',
        'description',
        'short_description',
        'begin_date',
        'end_date',
        'is_all_customer_type',
        'is_apply_hours',
        'start_hours',
        'end_hours',
        'is_apply_mon',
        'is_apply_tu',
        'is_apply_we',
        'is_apply_th',
        'is_apply_fr',
        'is_apply_sa',
        'is_apply_sun',
        'is_promotion_by_price',
        'from_price',
        'to_price',
        'is_promotion_by_total_money',
        'max_promotion_total_money',
        'min_promotion_total_money',
        'is_promorion_by_apply_birthday',
        'is_promorion_by_total_quantity',
        'min_promotion_total_quantity',
        'max_promotion_total_quantity',
        'is_apply_with_order_promotion',
        'is_combo_promotion',
        'is_limit_promotion_times',
        'max_promotion_times',
        'is_reward_point',
        'reviewed_user',
        'review_date',
        'note_review',
        'create_date',
        'is_active',
        'is_review',
        'is_system',
        'business_id',
        'company_id',
        'is_apply_order',
        'is_apply_all_product',
        'is_apply_product_category',
        'is_stopped',
        'stopped_date',
        'stopped_user',
        'stopped_reason',
        'url_banner_promotion',
        'check_condition',
        'is_apply_product_combo',
        'is_apply_for_web',
        'is_apply_sale_channel',
        'is_all_product',
        'type_apply_product',
        'time_start',
        'time_end',
        'is_apply_all_store',
        'is_all_product_category',
        'apply_birthday_list',
        'reviewed_user_department',
        'is_all_payment_form',
        'is_all_promotion_product',
        'type_apply_promotion_product',
    ]);
    data.url_banner = data.url_banner ? `${config.domain_cdn}${data.url_banner}` : '';
    data.url_banner_promotion = data.url_banner_promotion ? `${config.domain_cdn}${data.url_banner_promotion}` : '';
    data.url_image_promotion = data.url_image_promotion ? `${config.domain_cdn}${data.url_image_promotion}` : '';
    return data;
};

const list = (promotions = []) => {
    return transform.transform(promotions, [
        'promotion_id',
        'promotion_name',
        'company_name',
        'user_review_name',
        'is_stopped',
        'create_user',
        'business_name',
        'begin_date',
        'end_date',
        'create_date',
        'is_active',
        'is_review',
        'user_review',
        'is_apply_with_order_promotion',
    ]);
};

const detailUsed = (used = []) => {
    return transform.transform(used, ['result', 'table_used']);
};

const listApplyCombo = (list = []) => {
    return transform.transform(list, ['promotion_id', 'combo_id', 'combo_name']);
};

module.exports = {
    list,
    detail,
    detailUsed,
    listApplyCombo,
};
