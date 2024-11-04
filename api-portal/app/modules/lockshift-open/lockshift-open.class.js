const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    lock_shift_id: '{{#? LOCKSHIFTID}}',
    lock_shift_type: '{{#? LOCKSHIFTTYPE}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    shift_id: '{{#? SHIFTID}}',
    shift_name: '{{#? SHIFTNAME}}',
    shift_leader: '{{#? SHIFTLEADER}}',
    shift_recipient: '{{#? CREATEDUSER}}',
    total_cash: '{{#? TOTALCASH}}',
    total_cash_parent: '{{#? TOTALCASHPARENT}}',
    note: '{{#? NOTE}}',
    parent_id: '{{#? PARENTID}}',
    created_date: '{{#? CREATEDDATE}}',
    is_locked_shift: '{{ISLOCKEDSHIFT ? 1 : 0}}',
    shift_hourstart: '{{HOURSTART?HOURSTART:00}}',
    shift_minutestart: '{{MINUTESTART?MINUTESTART:00}}',
    shift_hourend: '{{HOUREND?HOUREND:00}}',
    shift_minutend: '{{MINUTEEND?MINUTEEND:00}}',
    shift_date: '{{#? SHIFTDATE}}',
    shift_leader_fullname: '{{#? SHIFTLEADERFULLNAME}}',
    shift_recipient_fullname: '{{#? RECIPIENTFULLNAME}}',
    lockshift_product_id: '{{#? LOCKSHIFTPRODUCTLISTID}}',
};

let transform = new Transform(template);

const list = (listLockShift = []) => {
    return transform.transform(listLockShift, [
        'lock_shift_id',
        'store_name',
        'shift_name',
        'shift_leader',
        'shift_recipient',
        'shift_leader_fullname',
        'shift_recipient_fullname',
        'total_cash',
        'total_cash_parent',
        'note',
        'created_date',
    ]);
};

const detail = (obj) => {
    return transform.transform(obj, [
        'lockshift_id',
        'parent_id',
        'store_id',
        'shift_id',
        'shift_leader',
        'total_cash',
        'order_number',
        'lockshift_type',
        'shift_hourstart',
        'shift_minutestart',
        'shift_hourend',
        'shift_minutend',
        'is_locked_shift',
        'note',
        'shift_name',
        'store_name',
        'shift_recipient',
        'created_date',
        'shift_date',
        'shift_leader_fullname',
        'shift_recipient_fullname',
    ]);
};

const templateCash = {
    denomination_id: '{{#? DENOMINATIONSID}}',
    denomination_value: '{{#? DENOMINATIONSVALUE}}',
    img_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    actual_quantity: '{{#? ACTUALQUANTITY}}',
    actual_quantity_parent: '{{#? ACTUALQUANTITYPARENT}}',
    total_money: '{{#? TOTALMONEY}}',
    note: '{{#? NOTE}}',
};

let transformCash = new Transform(templateCash);

const listCash = (listCash = []) => {
    return transformCash.transform(listCash, [
        'denomination_id',
        'denomination_value',
        'img_url',
        'actual_quantity',
        'total_money',
        'actual_quantity_parent',
        'note',
    ]);
};

const templateEquipment = {
    equipment_id: '{{#? EQUIPMENTID}}',
    equipment_name: '{{#? EQUIPMENTNAME}}',
    equipment_img: '{{#? EQUIPMENTIMG}}',
    stocks_id: '{{#? STOCKSID}}',
    stocks_name: '{{#? STOCKSNAME}}',
    unit_name: '{{#? UNITNAME}}',
    actual_inventory: '{{#? ACTUALINVENTORY}}',
    parent_inventory: '{{#? PARENTINVENTORY}}',
};

let transformEquipment = new Transform(templateEquipment);

const listEquipment = (listEq = []) => {
    return transformEquipment.transform(listEq, [
        'equipment_id',
        'equipment_name',
        'equipment_img',
        'stocks_name',
        'unit_name',
        'actual_inventory',
        'parent_inventory',
    ]);
};

const templateProduct = {
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_img: [
        {
            '{{#if PRODUCTIMAGE}}': `${config.domain_cdn}{{PRODUCTIMAGE}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    stocks_name: '{{#? STOCKSNAME}}',
    unit_name: '{{#? UNITNAME}}',
    parent_inventory: '{{#? PARENTINVENTORY}}',
    actual_inventory: '{{#? ACTUALINVENTORY}}',
    lockshift_product_id: '{{#? LOCKSHIFTPRODUCTLISTID}}',
};

let transformProduct = new Transform(templateProduct);

const listProduct = (listPr = []) => {
    return transformProduct.transform(listPr, [
        'product_id',
        'product_name',
        'product_img',
        'stocks_name',
        'unit_name',
        'parent_inventory',
        'actual_inventory',
        'lockshift_product_id',
    ]);
};

const templateCustomer = {
    member_id: '{{#? MEMBERID}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    full_name: '{{#? FULLNAME}}',
    avatar_img: '{{#? AVATARIMAGE}}',
    note: '{{#? NOTE}}',
};

let transformCustomer = new Transform(templateCustomer);

const listCustomer = (listCs = []) => {
    return transformCustomer.transform(listCs, [
        'member_id',
        'customer_code',
        'phone_number',
        'email',
        'full_name',
        'avatar_img',
        'note',
    ]);
};
module.exports = {
    list,
    detail,
    listCash,
    listEquipment,
    listProduct,
    listCustomer,
};
