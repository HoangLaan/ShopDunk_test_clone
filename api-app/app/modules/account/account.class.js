const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    member_id: '{{#? MEMBERID}}',
    username: '{{#? USERNAME}}',
    password: '{{#? PASSWORD}}',
    full_name: '{{#? FULLNAME}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    gender: '{{GENDER ? 1 : 0}}',
    birthday: '{{#? BIRTHDAY}}',
    image_avatar: [
        {
            '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    request_code: '{{#? REQUESTCODE}}',
    reset_password_id: '{{#? RESETPASSWORDID}}',
    id_card: "{{IDCARD ? IDCARD : ''}}",
    id_card_date: '{{#? IDCARDDATE}}',
    id_card_place: "{{IDCARDPLACE ? IDCARDPLACE : ''}}",
    address: '{{#? ADDRESS}}',
    address_full: '{{#? ADDRESSFULL}}',
    province_id: '{{#? PROVINCEID}}',
    district_id: '{{#? DISTRICTID}}',
    country_id: '{{#? COUNTRYID}}',
    ward_id: '{{#? WARDID}}',
    province_name: '{{#? PROVINCENAME}}',
    district_name: '{{#? DISTRICTNAME}}',
    ward_name: '{{#? WARDNAME}}',
};

let transform = new Transform(template);

const accountLogin = user => {
    return user && Object.keys(user).length > 0
        ? transform.transform(user, ['member_id', 'username', 'password'])
        : null;
};

const accountToken = user => {
    return user && Object.keys(user).length > 0 ? transform.transform(user, ['member_id', 'username']) : null;
};

const accountProfile = user => {
    return transform.transform(user, [
        'username',
        'full_name',
        'email',
        'phone_number',
        'image_avatar',
        'customer_code',
        'gender',
        'id_card',
        'id_card_place',
        'id_card_date',
        'address',
        'province_id',
        'district_id',
        'ward_id',
        'birthday',
        'province_name',
        'district_name',
        'ward_name',
        'member_id',
    ]);
};

const accountForgotPassword = user => {
    return user && Object.keys(user).length > 0
        ? transform.transform(user, ['member_id', 'username', 'email', 'full_name'])
        : null;
};

const accountResetPassword = user => {
    return user && Object.keys(user).length > 0
        ? transform.transform(user, ['member_id', 'request_code', 'email', 'reset_password_id'])
        : null;
};

const profile = user => {
    return transform.transform(user, [
        'username',
        'full_name',
        'email',
        'phone_number',
        'image_avatar',
        'customer_code',
        'gender',
        'id_card',
        'id_card_place',
        'id_card_date',
        'address',
        'province_id',
        'district_id',
        'ward_id',
        'birthday',
        'province_name',
        'district_name',
        'ward_name',
        'member_id',
    ]);
};

const purchaseHistoryList = list => {
    const template = {
        order_id: '{{#? ORDERID}}',
        order_no: '{{#? ORDERNO}}',
        order_status: '{{#? ORDERSTATUS}}',
        total_money: '{{#? TOTALMONEY}}',
        delivery_status: '{{#? DELIVERYSTATUS}}',
        payment_status: '{{#? PAYMENTSTATUS}}',
        store_name: '{{#? STORENAME}}',
        created_date: '{{#? CREATEDDATE}}',
        updated_date: '{{#? UPDATEDDATE}}',
        order_type_name: '{{#? ORDERTYPENAME}}',
        is_confirm: '{{ISCONFIRM ? 1 : 0}}',
        is_complete: '{{ISCOMPLETE ? 1 : 0}}',
        is_process: '{{ISPROCESS ? 1 : 0}}',
        is_cancel: '{{ISCANCEL ? 1 : 0}}',
        is_new_order: '{{ISNEWORDER ? 1 : 0}}',
        is_delivery: '{{ISDELIVERY ? 1 : 0}}',
        is_delivery_complete: '{{ISDELIVERCOMPLETE ? 1 : 0}}',
    };

    let transform = new Transform(template);

    return transform.transform(list, Object.keys(template));
};

const purchaseHistoryProductList = list => {
    const template = {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        price: '{{#? PRICE}}',
        order_id: '{{#? ORDERID}}',
        quantity: '{{#? QUANTITY}}',
        image_avatar: [
            {
                '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
            },
            {
                '{{#else}}': undefined,
            },
        ],
    };

    let transform = new Transform(template);

    return transform.transform(list, Object.keys(template));
};

const purchaseHistoryStatistics = obj => {
    const transform = new Transform({
        total_money: '{{TOTALMONEY ? TOTALMONEY : 0}}',
        total_orders: '{{TOTALORDERS ? TOTALORDERS : 0}}',
        total_products: '{{TOTALPRODUCTS ? TOTALPRODUCTS : 0}}',
    });

    return transform.transform(obj, ['total_money', 'total_orders', 'total_products']);
};

module.exports = {
    accountLogin,
    accountToken,
    accountProfile,
    accountForgotPassword,
    accountResetPassword,
    profile,
    purchaseHistoryList,
    purchaseHistoryProductList,
    purchaseHistoryStatistics,
};
