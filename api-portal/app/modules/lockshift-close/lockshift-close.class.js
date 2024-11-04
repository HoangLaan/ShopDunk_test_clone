const Transform = require('../../common/helpers/transform.helper');

const template = {
    lockshift_id: '{{#? LOCKSHIFTID}}',
    parent_id: '{{#? PARENTID}}',
    store_id: '{{#? STOREID}}',
    shift_id: '{{#? SHIFTID}}',
    shift_leader: '{{#? SHIFTLEADER}}',
    total_cash: '{{#? TOTALCASH }}',
    order_number: '{{#? ORDERNUMBER}}',
    shift_date: '{{#? SHIFTDATE}}',
    lockshift_type: '{{LOCKSHIFTTYPE ? 1 : 0}}',
    is_locked_shift: '{{ISLOCKEDSHIFT ? 1 : 0}}',
    note: '{{#? NOTE}}',
    previous_total_money: '{{ PREVIOUSTOTALMONEY ? PREVIOUSTOTALMONEY : 0 }}',
    previous_customer_count: '{{ PREVIOUSCUSTOMERCOUNT ? PREVIOUSCUSTOMERCOUNT : 0 }}',

    shift_hourstart: '{{HOURSTART?HOURSTART:00}}',
    shift_minutestart: '{{MINUTESTART?MINUTESTART:00}}',
    shift_hourend: '{{HOUREND?HOUREND:00}}',
    shift_minutend: '{{MINUTEEND?MINUTEEND:00}}',

    shift_name: '{{#? SHIFTNAME}}',
    store_name: '{{#? STORENAME}}',

    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'lockshift_id',
        'parent_id',
        'store_id',
        'shift_id',
        'shift_leader',
        'total_cash',
        'lockshift_type',
        'shift_hourstart',
        'shift_minutestart',
        'shift_hourend',
        'shift_minutend',
        'is_locked_shift',
        'previous_total_money',
        'previous_customer_count',
        'note',
        'shift_name',
        'store_name',
        'shift_date',
        'created_user',
        'created_date',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'lockshift_id',
        'parent_id',
        'store_id',
        'shift_id',
        'shift_leader',
        'total_cash',
        'order_number',
        'lockshift_type',
        'shift_name',
        'store_name',
        'note',
        'created_user',
        'created_date',
    ]);
};

const cashList = (list = []) => {
    const template = {
        denominations_id: '{{#? DENOMINATIONSID}}',
        image_url: '{{#? IMAGEURL}}',
        denominations_value: '{{#? DENOMINATIONSVALUE}}',
        actual_quantity: '{{#? ACTUALQUANTITY}}',
        total_money: '{{#? TOTALMONEY}}',
        note: '{{#? NOTE}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, [
        'note',
        'total_money',
        'actual_quantity',
        'denominations_value',
        'denominations_id',
        'image_url',
    ]);
};

const lockshiftProductList = (list = []) => {
    const template = {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        category_name: '{{#? CATEGORYNAME}}',
        product_image: [
            {
                '{{#if PRODUCTIMAGE}}': `${process.env.DOMAIN_CDN}{{PRODUCTIMAGE}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        stocks_name: '{{#? STOCKSNAME}}',
        stocks_id: '{{#? STOCKSID}}',
        actual_inventory: '{{#? ACTUALINVENTORY}}',
        total_inventory: '{{#? TOTALINVENTORY}}',
        diffrence_value: '{{DIFFERENCEVALUE ? DIFFERENCEVALUE : 0}}',
        unit_name: '{{#? UNITNAME}}',
        note: '{{#? NOTE}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, [
        'product_id',
        'product_name',
        'product_image',
        'stocks_name',
        'total_inventory',
        'actual_inventory',
        'diffrence_value',
        'unit_name',
        'category_name',
        'note',
        'stocks_id',
    ]);
};

const productList = (products = []) => {
    const template = {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        category_name: '{{#? CATEGORYNAME}}',
        created_date: '{{#? CREATEDDATE}}',
        manufacture_name: '{{#? MANUFACTURERNAME}}',
        stocks_name: '{{#? STOCKSNAME}}',
        stocks_id: '{{#? STOCKSID}}',
        total_inventory: '{{#? TOTALINVENTORY}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
        picture_url: [
            {
                '{{#if PICTUREURL}}': `${process.env.DOMAIN_CDN}{{PICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        unit_name: '{{#? UNITNAME}}',
    };

    let transform = new Transform(template);

    return transform.transform(products, [
        'product_id',
        'category_name',
        'manufacture_name',
        'picture_url',
        'created_date',
        'is_active',
        'product_code',
        'product_name',
        'stocks_name',
        'stocks_id',
        'unit_name',
        'total_inventory',
    ]);
};

const equipmentList = (list = []) => {
    const template = {
        stocks_id: '{{#? STOCKSID}}',
        stocks_name: '{{#? STOCKSNAME}}',
        equipment_id: '{{#? EQUIPMENTID}}',
        equipment_name: '{{#? EQUIPMENTNAME}}',
        unit_name: '{{#? UNITNAME}}',
        actual_inventory: '{{#? ACTUALINVENTORY}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, [
        'stocks_id',
        'stocks_name',
        'equipment_id',
        'equipment_name',
        'unit_name',
        'actual_inventory',
    ]);
};

const customerList = (list = []) => {
    const template = {
        member_id: '{{#? MEMBERID}}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        fullname: '{{#? FULLNAME}}',
        avatar_image: '{{#? AVATARIMAGE}}',
        note: '{{#? NOTE}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, [
        'member_id',
        'phone_number',
        'fullname',
        'avatar_image',
        'note',
        'customer_coode',
        'email',
    ]);
};

module.exports = {
    detail,
    list,
    cashList,
    productList,
    equipmentList,
    customerList,
    lockshiftProductList,
};
