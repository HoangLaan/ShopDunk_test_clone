const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
    const _template = {
        email_subscriber_id: '{{#? EMAILSUBSCRIBERID }}',
        data_leads_id: '{{#? CUSTOMERID }}',
        customer_id: '{{#? CUSTOMERID }}',
        customer_code: '{{#? CUSTOMERCODE }}',
        data_leads_code: '{{#? CUSTOMERCODE }}',
        coupon_code: '{{#? COUPONCODE }}',
        customer_name: '{{#? CUSTOMERNAME }}',
        email: '{{#? EMAIL }}',
        phone_number: '{{#? PHONENUMBER }}',
        gender: '{{#? GENDER }}',
        career: '{{#? CAREER }}',
        created_date: '{{#? CREATEDDATE }}',
        interest_date: '{{#? INTERESTDATE }}',
        is_used_coupon: '{{#? ISUSEDCOUPON ? 1 : 0 }}',
        used_coupon_date: '{{#? USEDCOUPONDATE }}',
        product_display_name: '{{#? PRODUCTDISPLAYNAME }}',
        is_active: 1,
        created_user: '{{#? CREATEDUSER }}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
};
