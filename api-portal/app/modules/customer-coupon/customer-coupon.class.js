const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
    const _template = {
        coupon_auto_code_id: '{{#? COUPONAUTOCODEID}}',
        account_id: '{{#? MEMBERID}}',
        member_code: '{{#? MEMBERCODE}}',
        member_name: '{{#? MEMBERNAME}}',
        coupon_code: '{{#? COUPONCODE}}',
        is_used: '{{ ISUSED? 1: 0}}',
        order_id: '{{#? ORDERID}}',
        used_date: '{{#? USEDDATE}}',
        customer_id: '{{#? CUSTOMERID}}',
        customer_name: '{{#? CUSTOMERNAME}}',
        customer_email: '{{#? CUSTOMEREMAIL}}',
        customer_phone: '{{#? CUSTOMERPHONE}}',
        object_type: '{{#? OBJECTTYPE }}',
        is_customer_leads: '{{ OBJECTTYPE === 3 ? 1: 0}}',
        member_id: '{{#? OBJECTTYPE === 1? null: CUSTOMERID}}',
        partner_id: '{{#? OBJECTTYPE === 2? CUSTOMERID: null}}',
        data_leads_id: '{{#? OBJECTTYPE === 3? CUSTOMERID: null}}',
        full_name: '{{#? FULLNAME}}',
        gender: '{{#? GENDER}}',
        gender_text: '{{ GENDER? "Nam": "Nữ" }}',
        birthday: '{{#? BIRTHDAY}}',
        email: '{{#? CUSTOMEREMAIL}}',
        phone_number: '{{#? CUSTOMERPHONE}}',
        // phone_number: '{{#? PHONENUMBER}}',
        // email: '{{#? EMAIL}}',
        address: '{{#? ADDRESS}}',
        address_full: '{{#? ADDRESSFULL}}',
        source_id: '{{#? SOURCEID}}',
        source_name: '{{#? SOURCENAME}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        customer_type_id: '{{#? CUSTOMERTYPEID}}',
        customer_type_name: '{{#? CUSTOMERTYPENAME}}',
        order_count: '{{#? ORDERCOUNT}}',
        days_since_last_order: '{{#? DAYSSINCELASTORDER}}',
        last_order_date: '{{#? LASTORDERDATE}}',
        product_order_count: '{{#? PRODUCTORDERCOUNT}}',
        count_task: '{{#? COUNTTASK}}',
        no_care_days: '{{#? NOCAREDAYS}}',
        is_in_process: '{{#? ISINPROCESS}}',
        is_active: '{{ ISACTIVE ? 1: 0 }}',
        is_sent_sms: '{{ ISSENTSMS ? 1: 0 }}',
        is_sent_email: '{{ ISSENTEMAIL ? 1: 0 }}',
        store_name: '{{#? STORENAME}}',
        store_address: '{{#? STOREADDRESS}}'
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
    const _template = {
        coupon_auto_code_id: '{{#? COUPONAUTOCODEID}}',
        coupon_id: '{{#? COUPONID}}',
        coupon_code: '{{#? COUPONCODE}}',
        is_used: '{{ ISUSED? 1: 0}}',
        start_date: '{{#? STARTDATE}}',
        end_date: '{{#? ENDDATE}}',
        order_id: '{{#? ORDERID}}',
        order_no: '{{#? ORDERNO}}',
        used_date: '{{#? USEDDATE}}',
        customer_id: '{{#? CUSTOMERID}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        full_name: '{{#? FULLNAME}}',
        gender: '{{#? GENDER? "Nam": "Nữ" }}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        address_full: '{{#? ADDRESSFULL}}',
        search_type: '{{#? SEARCHTYPE}}',
        object_type: '{{#? OBJECTTYPE}}',
        is_active: '{{ ISACTIVE ? 1: 0 }}',
        birthday: '{{#? BIRTHDAY}}',
        is_customer_leads: '{{ ISCUSTOMERLEADS? 1: 0 }}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list,
    getById,
};
