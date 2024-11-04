const config = require('../../../config/config');
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
    store_address: '{{#? STOREADDRESS}}',

    shift_leader_fullname: '{{#? SHIFTLEADERFULLNAME}}',
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
        'store_address',
        'shift_leader_fullname'
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

const stockTemplate = {
    stocks_detail_id: '{{#? STOCKSDETAILID}}',
    stocks_id: '{{#? STOCKSID}}',
    stocks_name: '{{#? STOCKSNAME}}',
    description: '{{#? DESCRIPTION}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_id: '{{#? PRODUCTID}}',
    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    category_name: '{{#? CATEGORYNAME}}',
    unit_name: '{{#? UNITNAME}}',
    unit_id: '{{#? UNITID}}',
    total_in: '{{#? TOTALIN}}',
    total_out: '{{#? TOTALOUT}}',
    total_inventory: '{{#? TOTALINVENTORY}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    list_product_order: '{{#? LISTPRODUCTORDER}}',
    order_id: '{{#? ORDERID}}',
    order_no: '{{#? ORDERNO}}',
    quantity: '{{QUANTITY ? QUANTITY : 0}}',
    unit_id: '{{#? UNITID}}',
    unit_name: '{{#? UNITNAME}}',
    full_name: '{{#? FULLNAME}}',
    product_imei_code: '{{#? PRODUCTIMEICODE}}',
    net_weight: '{{#? NETWEIGHT}}',
    density: '{{#? DENSITY}}',
    lot_number: '{{#? LOTNUMBER}}',
    stocks_product_holding_id: '{{#? STOCKPRODUCTHOLDINGID}}',
    status_mini_inventory: '{{#? STATUSMINIINVENTORY}}',
    product_type_name: '{{#? PRODUCTTYPENAME}}',
    product_type_id: '{{#? PRODUCTTYPEID}}',
    note: '{{#? NOTE}}',
    stocks_in_request_code: '{{#? STOCKSINREQUESTCODE}}',
    stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
    base_unit_id: '{{#? BASEUNITID}}',
    cost_price: '{{#? COSTPRICE}}',
    supplier_name: '{{#? SUPPLIERNAME}}',
    status_inventory: [
        {
            '{{#if STATUSINVENTORY}}': '{{ STATUSINVENTORY }}',
        },
        {
            '{{#else}}': 0,
        },
    ],
    time_inventory: '{{TIMEINVENTORY ? TIMEINVENTORY : 0}}',
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    is_component: '{{ISCOMPONENT? 1 : 0}}',
    is_material: '{{ISMATERIAL? 1 : 0}}',

    component_code: '{{#? COMPONENTCODE}}',
    component_name: '{{#? COMPONENTNAME}}',
    cost_basic_imei_code: '{{#? COSTBASICIMEICODE}}',
    is_over_time_inventory: '{{#? ISOVERTIMEINVENTORY}}',
    stocks_detail_status: '{{#? STOCKSDETAILSTATUS}}',
    stocks_in_date: '{{#? STOCKSINDATE}}',
    product_old_type_id: '{{#? PRODUCTOLDTYPEID}}',
    product_old_type_name: '{{#? PRODUCTOLDTYPENAME}}',
    category_name_global: '{{#? CATEGORYNAMEGLOBAL}}',
    category_id_global: '{{#? CATEGORYIDGLOBAL}}',
    business_id: '{{#? BUSINESSID}}',
    business_name: '{{#? BUSINESSNAME}}',
    type_item: '{{#? ITEMTYPE}}',
    store_name: '{{#? STORENAME}}',
};

let transformV1 = new Transform(stockTemplate);

const listProductByStore = (users = []) => {
    return transformV1.transform(users, [
        // 'stocks_detail_id',
        'stocks_id',
        'stocks_name',
        'created_date',
        'created_user',
        'description',
        'product_code',
        'product_name',
        'product_id',
        'product_category_id',
        'category_name',
        'unit_name',
        'unit_id',
        'total_in',
        'total_out',
        'lot_number',
        'status_mini_inventory',
        'supplier_name',
        'total_inventory',
        'status_inventory',
        'is_component',
        'category_name_global',
        'category_id_global',
        'business_name',
        'business_id',
        'type_item',
        'store_name',
        'is_material',
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
    listProductByStore
};
