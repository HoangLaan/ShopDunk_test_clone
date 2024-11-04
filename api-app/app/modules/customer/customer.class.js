const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    id: '{{#? ID}}',
    customer_id: '{{#? CUSTOMERID}}',
    full_name: '{{#? FULLNAME}}',
    source_name: '{{#? SOURCENAME}}',
    source_id: '{{#? SOURCEID}}',
    type: '{{#? TYPE}}',
    phone_number: '{{#? PHONENUMBER}}',
    address: '{{#? ADDRESS}}',
    image_url: [
        {
            '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    email: '{{#? EMAIL}}',
    province_name: '{{#? PROVINCENAME}}',
    district_name: '{{#? DISTRICTNAME}}',
    ward_name: '{{#? WARDNAME}}',
    created_date: '{{#? CREATEDDATE}}',
    // Tổ chức
    tax_code: '{{#? TAXCODE}}',
    representative_name: '{{#? REPRESENTATIVENAME}}',
    representative_phone: '{{#? REPRESENTATIVEPHONE}}',
    representative_position: '{{#? REPRESENTATIVEIDCARDPLACE}}',
    //Cá nhân
    birth_day: '{{#? BIRTHDAY}}',

    //Đơn hàng
    order_id: '{{#? ORDERID}}',
    order_no: '{{#? ORDERNO}}',
    order_status: '{{#? ORDERSTATUS}}',
    total_money: '{{TOTALMONEY ? TOTALMONEY : 0}}',
    delivery_status: '{{DELIVERYSTATUS ? DELIVERYSTATUS : 0}}',
    payment_status: '{{PAYMENTSTATUS ? PAYMENTSTATUS : 0}}',
    store_name: '{{#? STORENAME}}',
    updated_date: '{{#? UPDATEDDATE}}',
    order_type_name: '{{#? ORDERTYPENAME}}',
    is_complete: '{{#? ISCOMPLETE}}',
    //sản phẩm
    product_name: '{{#? PRODUCTNAME}}',
    price: '{{#? PRICE}}',
    quantity: '{{#? QUANTITY}}',
    //Point
    current_point: '{{CURRENTPOINT ? CURRENTPOINT : 0}}',
    quantity_purchase: '{{QUANTITYPURCHASE ? QUANTITYPURCHASE : 0}}',
};
let transform = new Transform(template);
const list = (data = []) => {
    return transform.transform(data, [
        'id',
        'customer_id',
        'full_name',
        'type',
        'phone_number',
        'address',
        'image_url',
        'current_point',
        'quantity_purchase',
        'email',
    ]);
};

const detail = data => {
    return transform.transform(data, [
        'id',
        'customer_id',
        'full_name',
        'source_name',
        'type',
        'phone_number',
        'email',
        'address',
        'image_url',
        'province_name',
        'district_name',
        'ward_name',
        'tax_code',
        'representative_name',
        'representative_phone',
        'representative_position',
        'birth_day',
        'current_point',
        'quantity_purchase',
    ]);
};

const listOrder = (data = []) => {
    return transform.transform(list, [
        'order_id',
        'order_no',
        'order_status',
        'total_money',
        'delivery_status',
        'payment_status',
        'store_name',
        'created_date',
        'updated_date',
        'order_type_name',
        'is_complete',
    ]);
};

const listProduct = (data = []) => {
    return transform.transform(data, ['product_id', 'order_id', 'product_name', 'price', 'quantity', 'image_url']);
};

const sourceOptions = (data = []) => {
    return transform.transform(data, ['source_id', 'source_name']);
};

module.exports = {
    list,
    detail,
    listOrder,
    listProduct,
    sourceOptions,
};
