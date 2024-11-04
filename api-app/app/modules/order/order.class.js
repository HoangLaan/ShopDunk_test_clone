const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    order_id: '{{#? ORDERID}}',
    is_review: '{{ ISREVIEW }}',
    is_active: '{{ISACTIVE  ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    order_no: '{{#? ORDERNO}}',
    customer_id: '{{#? CUSTOMERID}}',
    address_id: '{{#? ADDRESSID}}',
    total_money: '{{#? TOTALMONEY}}',
    is_partner: '{{ISPARTNER  ? 1 : 0}}',
    total_net_weight: '{{#? TOTALNETWEIGHT}}',
    unit_id: '{{#? UNITID}}',
    unit_name: '{{#? UNITNAME}}',
    province_id: '{{#? PROVINCEID}}',
    province_name: '{{#? PROVINCENAME}}',
    district_id: '{{#? DISTRICTID}}',
    district_name: '{{#? DISTRICTNAME}}',
    ward_id: '{{#? WARDID}}',
    ward_name: '{{#? WARDNAME}}',
    country_id: '{{#? COUNTRYID}}',
    country_name: '{{#? COUNTRYNAME}}',
    address: '{{#? ADDRESS}}',
    full_name: '{{#? FULLNAME}}',
    address_full: '{{#? ADDRESSFULL}}',
    email: '{{#? EMAIl}}',
    stock_id: '{{#? STOCKSID * 1}}',
    stock_name: '{{#? STOCKSNAME}}',
    customer_stocks_id: '{{#? CUSTOMERSTOCKSID}}',
    customer_stocks_name: '{{#? CUSTOMERSTOCKSNAME}}',
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_display_name: '{{#? PRODUCTDISPLAYNAME}}',
    product_code: '{{#? PRODUCTCODE}}',
    stocks_id: '{{#? STOCKSID}}',
    net_weight: '{{#? NETWEIGHT}}',
    quantity: '{{#? QUANTITY}}',
    density: '{{#? DENSITY}}',
    lot_number: '{{#? LOTNUMBER}}',
    product_imei_code: '{{#? PRODUCTIMEICODE}}',
    total_inventory: '{{#? TOTALINVENTORY}}',
    company_id: '{{#? COMPANYID}}',
    phone_number: '{{#? PHONENUMBER}}',
    total_discount: '{{#? TOTALDISCOUNT}}',
    sub_total: '{{#? SUBTOTAL}}',
    total_vat: '{{TOTALVAT ? TOTALVAT : 0}}',
    is_review_status: '{{#? ISREVIEWSTATUS}}',
    payment_time: '{{PAYMENTTIME ? PAYMENTTIME : 0}}',
    delivery_time: '{{DELIVERYTIME ? DELIVERYTIME : 0}}',
    is_cancel: '{{ISCANCEL  ? 1 : 0}}',
    stocks_address: '{{#? STOCKSADDRESS}}',
    is_stocks: '{{ISSTOCKS  ? 1 : 0}}',
    order_detail_id: '{{#? ORDERDETAILID}}',
    total_price: '{{#? TOTALPRICE}}',
    total_amount: '{{#? TOTALAMOUNT}}',
    vat_amount: '{{#? VATAMOUNT}}',
    note: '{{#? NOTE}}',
    output_type_id: '{{#? OUTPUTTYPEID}}',
    net_weight_unit_id: '{{#? NETWEIGHTUNITID}}',
    length: '{{#? LENGTH}}',
    plates: '{{#? PLATES}}',
    delivery_cost: '{{#? DELIVERYCOST}}',
    commission: '{{#? COMMISSION}}',
    processing_cost: '{{#? PROCESSINGCOST}}',
    others_cost: '{{#? OTHERSCOST}}',
    product_output_type_id: '{{#? PRODUCTOUTPUTTYPEID}}',
    price: '{{#? PRICE}}',
    print_date: '{{#? PRINTDATE}}',
    total_paid: '{{#? TOTALPAID}}',
    total_remain: '{{#? TOTALREMAIN}}',
    tolerance_value: '{{#? TOLERANCEVALUE}}',
    total_remain_text: '{{#? TOTALREMAINTEXT}}',
    status_review: '{{#? STATUSREVIEW}}',
    partner_transport_id: '{{#? PARTNERTRANSPORTID}}',
    partner_transport_name: '{{#? PARTNERTRANSPORTNAME}}',
    vehicles_id: '{{#? VEHICLESID}}',
    license_plates: '{{#? LICENSEPLATES}}',
    driver_id: '{{#? DRIVERID}}',
    driver_name: '{{#? DRIVERNAME}}',
    customer_delivery_id: '{{#? CUSTOMERDELIVERYID}}',
    driver_name: '{{#? DRIVERNAME}}',
    vehicle_name: '{{#? VEHICLESNAME}}',
    stocks_type: '{{#? STOCKSTYPE}}',
    sum_total_quantity: '{{#? SUMTOTALQUANTITY}}',
    driver_phone: '{{#? ADDRESSPHONE}}',
    total_weight: '{{#? TOTALWEIGHT}}',
    order_status_id: '{{#? ORDERSTATUSID}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    stocks_ward_id: '{{#? STOCKSWARDID}}',
    stocks_ward_name: '{{#? STOCKSWARDNAME}}',
    stocks_district_id: '{{#? STOCKSDISTRICTID}}',
    stocks_district_name: '{{#? STOCKSDISTRICTNAME}}',
    stocks_province_id: '{{#? STOCKSPROVINCEID}}',
    stocks_province_name: '{{#? STOCKSPROVINCENAME}}',

    customer_address: '{{CUSTOMERADDRESS}}',
    area_id: '{{#? AREAID}}',
    business_id: '{{#? BUSINESSID}}',
    max_net_weight: '{{#? MAXNETWEIGHT}}',
    max_quantity: '{{#? MAXQUANTITY}}',
    company_name: '{{#? COMPANYNAME}}',
    is_valid_order: '{{#? ISVALIDORDER}}',
    vat_value: '{{VATVALUE ? VATVALUE : 0}}',
    change_price: '{{CHANGEPRICE ? CHANGEPRICE : 0}}',
    area_name: '{{#? AREANAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    unit_name: '{{#? UNITNAME}}',
    output_type_name: '{{#? OUTPUTTYPENAME}}',
    product_imei_code_unit_id: '{{#? PRODUCTIMEICODEUNITID}}',
    product_imei_code_unit_name: '{{#? PRODUCTIMEICODEUNITNAME}}',
    description: '{{#? DESCRIPTION}}',
    username: '{{#? USERNAME}}',
    is_outputted: '{{ISOUTPUTTED ? ISOUTPUTTED : 0}}',
    product_type_id: '{{#? PRODUCTTYPEID}}',
    product_type_name: '{{#? PRODUCTTYPENAME}}',
    manufacturer_name: '{{#? MANUFACTURERNAME}}',
    is_discount_abc: '{{ISDISCOUNTABC ? ISDISCOUNTABC : 0}}',
    price_unit_name: '{{#? UNITNAME}}',
    is_stocks_product_holding: '{{ISSTOCKSPRODUCTHOLDING ? ISSTOCKSPRODUCTHOLDING : 0}}',
    price_imei_code: '{{PRICEIMEICODE ? PRICEIMEICODE : 0}}',
    full_address: '{{#? FULLADDRESS}}',
    order_closing: '{{ORDERCLOSING ? ORDERCLOSING : 0}}',
    total_holding: '{{TOTALHOLDING ? TOTALHOLDING : 0}}',
    total_inventory: '{{TOTALINVENTORY ? TOTALINVENTORY : 0}}',
    is_create_stocksoutrequest: '{{ISCREATESTOCKSOUTREQUEST ? 1 : 0}}',
    status_order: '{{#? STATUSORDER}}',
    status_payment: '{{#? STATUSPAYMENT}}',
    status_delivery: '{{#? STATUSDELIVERY}}',
    is_order_construction: '{{ISORDERCONSTRUCTION ? 1 : 0}}',
    out_quantity: '{{OUTQUANTITY ? OUTQUANTITY : 0}}',
    out_netweight: '{{OUTNETWEIGHT ? OUTNETWEIGHT : 0}}',
    order_status_name: '{{#? ORDERSTATUSNAME}}',
    payment_status_name: '{{#? PAYMENTSTATUSNAME}}',
    order_status: '{{ORDERSTATUS ? ORDERSTATUS : 0}}',
    payment_status: '{{PAYMENTSTATUS ? PAYMENTSTATUS : 0}}',
    is_discount_percent: '{{ISDISCOUNTPERCENT ? 1 : 0}}',
    discount_value: '{{DISCOUNTVALUE ? DISCOUNTVALUE : 0}}',
    total_discount: '{{TOTALDISCOUNT ? TOTALDISCOUNT : 0}}',
    supplier_name: '{{#? SUPPLIERNAME}}',

    payment_type: '{{#? PAYMENTTYPE}}',
    is_gift: '{{ISGIFT ? 1 : 0}}',

    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    order_source: '{{#? ORDERSOURCE}}',

    member_id: '{{#? MEMBERID}}',
    user_id: '{{#? USERID}}',

    partner_id: '{{#? PARTNERID}}',

    order_type_id: '{{#? ORDERTYPEID}}',
    order_type_name: '{{#? ORDERTYPENAME}}',
    order_type: '{{#? ORDERTYPE}}',

    is_complete: '{{ISCOMPLETE ? 1 : 0}}',
    coupon_code: '{{#? COUPONCODE}}',
    coupon_id: '{{#? COUPONID}}',
    max_value_reduce: '{{MAXVALUEREDUCE ? MAXVALUEREDUCE : 0}}',

    // status of order
    is_can_edit: '{{ISCANEDIT ? ISCANEDIT : 0}}',
    is_can_del: '{{ISCANDEL ? ISCANDEL : 0}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    province_store: '{{#? PROVINCESTORE}}',

    // innovoice
    is_invoice: '{{ISINVOICE ? ISINVOICE : 0}}',
    invoice_address: '{{#? INVOICEADDRESS}}',
    invoice_company_name: '{{#? INVOICECOMPANYNAME}}',
    invoice_email: '{{#? INVOICEEMAIL}}',
    invoice_full_name: '{{#? INVOICEFULLNAME}}',
    invoice_price: '{{#? INVOICEPRICE}}',
    invoice_tax: '{{#? INVOICETAX}}',
    is_delivery_type: '{{#? ISDELIVERYTYPE *1}}',
    price_id: '{{#? PRICEID}}',

    // acumulate point
    accumulate_point: '{{ACCUMULATEPOINT ?  ACCUMULATEPOINT : 0}}',

    // payment
    cash: '{{#? CASH}}',
    bank: '{{#? BANK}}',
    transfer: '{{#? TRANFERS}}',
    is_can_collect_money: '{{ISCANTCOLLECTMONEY ? ISCANTCOLLECTMONEY : 0}}',
    is_can_stockout: '{{ISCANSTOCKOUT ? ISCANSTOCKOUT : 0}}',
    is_out_stock: '{{ISOUTSTOCKS ? ISOUTSTOCKS : 0}}',
    is_can_edit: '{{ISCANEDIT ? ISCANEDIT : 0}}',

    product_type: '{{#? PRODUCTTYPE}}',
    imei_code: '{{#? IMEICODE}}',
    //////////////////////////////////
    base_price: '{{#? BASEPRICE}}',
    value_vat: '{{#? VALUEVAT}}',
    receiving_date: '{{#? RECEIVINGDATE}}',
    ip_receive: '{{#? IPRECEIVE}}',
    browser: '{{#? BROWSER}}',
    stocks_out_request_id: '{{#? STOCKSOUTREQUESTID}}',
    ////////////////////////////////////////////////
    attribute_values: '{{#? ATTRIBUTEVALUES}}',
    attribute_values_id: '{{#? ATTRIBUTEVALUESID}}',

    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    signature: [
        {
            '{{#if SIGNATURE}}': `${config.domain_cdn}{{SIGNATURE}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    member_type: '{{#? MEMBERTYPE}}',
    customer_type_id: '{{#? CUSTOMERTYPEID}}',
    sub_point: '{{#? SUBPOINT}}',

    is_advise_bonus_point: '{{ISADVISEBONUSPOINT ? ISADVISEBONUSPOINT : 0}}',
    is_advise_new_member: '{{ISADVISENEWMEMBER ? ISADVISENEWMEMBER : 0}}',

    receive_slip_id: '{{#? RECEIVESLIPID}}',
    receive_slip_code: '{{#? RECEIVESLIPCODE}}',
    bank_account_id: '{{#? BANKACCOUNTID}}',
    payment_form_id: '{{#? PAYMENTFORMID}}',
    bank_logo: '{{#? BANKLOGO}}',
    bank_name: '{{#? BANKNAME}}',

    material_id: '{{#? MATERIALID}}',
    material_code: '{{#? MATERIALCODE}}',
    material_name: '{{#? MATERIALNAME}}',
    material_imei_code: '{{#? MATERIALIMEICODE}}',

    number: '{{ NUMBER ? NUMBER : 0 }}',
    pos: '{{#? POS}}',
    period: '{{#? PERIOD}}',
    email_company: '{{#? EMAILCOMPANY}}',
    tax_id: '{{#? TAXID}}',

    is_advise_promotion: '{{ISADVISEPROMOTION ? ISADVISEPROMOTION : 0}}',
    is_advise_accessory: '{{ISADVISEACCESSORY ? ISADVISEACCESSORY : 0}}',
    is_advise_use_point: '{{ISADVISEUSERPOINT ? ISADVISEUSERPOINT : 0}}',

    pre_money: '{{#? PREMONEY}}',
};

let transform = new Transform(template);

const list = (orders = []) => {
    const transform = new Transform({
        order_id: '{{#? ORDERID}}',
        order_no: '{{#? ORDERNO}}',
        customer_name: '{{#? MEMBERNAME}}',
        customer_avatar: [
            {
                '{{#if MEMBERAVATAR}}': `${config.domain_cdn}{{MEMBERAVATAR}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        total_money: '{{TOTALMONEY ? TOTALMONEY : 0}}',
        order_date: '{{#? ORDERDATE}}',
        created_date: '{{#? CREATEDDATE}}',
        created_user: '{{#? CREATEDUSER}}',
        receiving_date: '{{#? RECEIVINGDATE}}',

        order_status_name: '{{#? ORDERSTATUSNAME}}',
        is_cancel: '{{ISCANCEL ? 1 : 0}}',
        is_can_print: '{{ISCANPRINT ? 1 : 0}}',
    });

    return transform.transform(orders, [
        'order_id',
        'order_no',
        'customer_name',
        'customer_avatar',
        'customer_address',
        'total_money',
        'order_date',
        'created_date',
        'created_user',
        'receiving_date',

        'order_status_name',
        'is_cancel',
        'is_can_print',
    ]);
};

const products = products => {
    const transform = new Transform({
        order_id: '{{#? ORDERID}}',
        order_detail_id: '{{#? ORDERDETAILID}}',
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_image: [
            {
                '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        price: '{{PRICE ? PRICE : 0}}',
        total_discount: '{{TOTALDISCOUNT ? TOTALDISCOUNT : 0}}',
        quantity: '{{QUANTITY ? QUANTITY : 0}}',
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
        sub_total_apply_discount: '{{#? SUBTOTALAPPLYDISCOUNT}}',
        // is_discount: '{{ISDISCOUNT ? ISDISCOUNT : 0}}',
    });
    return transform.transform(products, [
        'order_id',
        'order_detail_id',
        'product_id',
        'product_code',
        'product_name',
        'product_image',
        'price',
        'total_discount',
        'quantity',
        'product_imei_code',
        'sub_total_apply_discount',
    ]);
};

const templateOption = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    total: '{{#? TOTAL}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    parent_id: '{{#? PARENTID}}',
};

const templateSummary = {
    business: {
        business_id: '{{#? BUSINESSID}}',
        business_name: '{{#? BUSINESSNAME}}',
        company_name: '{{#? COMPANYNAME}}',
        total: '{{TOTAL ? TOTAL : 0}}',
        total_day: '{{TOTALDAY ? TOTALDAY : 0}}',
        total_week: '{{TOTALWEEK ? TOTALWEEK : 0}}',
        total_month: '{{TOTALMONTH ? TOTALMONTH : 0}}',
    },
    order: {
        total_sale: '{{TOTALSALE ? TOTALSALE : 0}}',
        total_tailor: '{{TOTALTAILOR ? TOTALTAILOR : 0}}',
    },
};

const listDetailProduct = user => {
    return transform.transform(user, [
        'order_detail_id',
        'order_id',
        'product_id',
        'product_imei_code',
        'product_name',
        'total_price',
        'total_amount',
        'vat_amount',
        'note',
        'product_output_type_id',
        'net_weight_unit_id',
        'length',
        'plates',
        'delivery_cost',
        'commission',
        'processing_cost',
        'others_cost',
        'tolerance_value',
        'price',
        'unit_id',
        'unit_name',
        'quantity',
        'net_weight',
        'density',
        'stocks_id',
        'stocks_name',
        'product_type_id',
    ]);
};

const detail = user => {
    return transform.transform(user, [
        'order_id',
        'order_no',
        'member_id',
        'customer_code',
        'accumulate_point',
        'customer_name',
        'phone_number',
        'email',
        'total_money',
        'created_date',
        'description',
        'created_user',
        'payment_status',
        'is_partner',
        'is_discount_percent',
        'discount_value',
        'total_discount',
        'payment_type',
        'sub_total',
        'order_source',
        'order_type_id',
        'order_status_id',
        'is_cancel',
        'is_complete',
        'coupon_code',
        'coupon_id',
        'store_id',
        'province_store',
        'is_delivery_type',
        'total_vat',
        'cash',
        'bank',
        'transfer',
        'is_can_collect_money',
        'is_can_stockout',
        'is_can_edit',
        'receiving_date',
        'business_id',
        'business_name',
        'address_full',
        'total_paid',
        'order_status_name',
        'member_type',
        'sub_point',
        'is_advise_bonus_point',
        'is_advise_new_member',
        'pos',

        'store_name',
        'company_name',
        'email_company',
        'tax_id',
        'is_invoice',
        'invoice_address',
        'invoice_company_name',
        'invoice_email',
        'invoice_full_name',
        'invoice_tax',

        'is_advise_promotion',
        'is_advise_accessory',
        'is_advise_use_point',

        'signature',
        'is_out_stock',
        'order_type',
        'pre_money',
    ]);
};

const detailPrint = user => {
    return transform.transform(user, [
        'order_id',
        'order_no',
        'customer_id',
        'full_name',
        'total_money',
        'total_discount',
        'sub_total',
        'created_date',
        'company_name',
        'address_full',
        'phone_number',
        'payment_time',
        'delivery_time',
        'print_date',
        'total_paid',
        'total_remain',
        'total_remain_text',
        'stocks_type',
        'stocks_address',
        'description',
        'full_address',
        'is_stocks',
        'sub_total',
        'total_discount',
    ]);
};

const listDetailProductPrint = user => {
    return transform.transform(user, [
        'order_detail_id',
        'order_id',
        'product_id',
        'product_imei_code',
        'product_name',
        'total_price',
        'total_amount',
        'vat_amount',
        'note',
        'output_type_id',
        'net_weight_unit_id',
        'length',
        'plates',
        'density',
        'stocks_id',
        'stocks_name',
        'quantity',
        'net_weight',
        'note',
        'tolerance_value',
        'price',
        'unit_name',
    ]);
};
const listStocks = (users = []) => {
    return transform.transform(users, [
        'stocks_id',
        'stocks_name',
        'phone_number',
        'address',
        'address_full',
        'ward_id',
        'ward_name',
        'district_id',
        'district_name',
        'province_id',
        'province_name',
        'is_stocks',
    ]);
};

const listCustomerStocks = (users = []) => {
    return transform.transform(users, [
        'customer_stocks_id',
        'customer_stocks_name',
        'phone_number',
        'address',
        'address_full',
    ]);
};

const listCustomer = (users = []) => {
    return transform.transform(users, [
        'customer_id',
        'is_partner',
        'full_name',
        'phone_number',
        'company_id',
        'company_name',
        'address',
        'address_full',
        'ward_id',
        'ward_name',
        'district_id',
        'district_name',
        'province_id',
        'province_name',
        'customer_code',
    ]);
};

const listProduct = (products = []) => {
    let transform = new Transform(template);
    return transform.transform(products, [
        'product_id',
        'product_name',
        'product_code',
        'sum_total_inventory',
        'unit_id',
        'unit_name',
        'product_category_id',
    ]);
};

const detailProduct = (products = []) => {
    let transform = new Transform(template);
    return transform.transform(products, ['product_id', 'product_name', 'list_lot_number']);
};

const listLotNumber = product => {
    let transform = new Transform(template);
    return transform.transform(product, [
        'product_id',
        'lot_number',
        'product_imei_code',
        'total_inventory',
        'stocks_id',
        'stocks_name',
        'net_weight',
        'quantity',
        'density',
        'unit_id',
        'unit_name',
        'tolerance_value',
        'product_type_id',
    ]);
};

const listAll = (areas = []) => {
    let transform = new Transform(templateOption);

    return transform.transform(areas, ['id', 'name', 'parent_id', 'is_member']);
};

const phoneNumber = area => {
    return transform.transform(area, ['driver_id', 'phone_number']);
};

const listReasonCancel = area => {
    return transform.transform(area, [
        'order_reason_cancel_id',
        'reason_cancel_name',
        'reason_cancel_id',
        'is_other_reason',
        'other_reason',
    ]);
};

const summaryBusiness = (orders = []) => {
    let transform = new Transform(templateSummary.business);

    return transform.transform(orders, [
        'business_id',
        'business_name',
        'company_name',
        'total',
        'total_day',
        'total_week',
        'total_month',
    ]);
};

const summaryOrder = (orders = []) => {
    let transform = new Transform(templateSummary.order);

    return transform.transform(orders, ['total_sale', 'total_tailor']);
};

const listVehicleDriver = area => {
    return transform.transform(area, [
        'partner_transport_id',
        'driver_id',
        'driver_name',
        'phone_number',
        'license_plates',
    ]);
};

const priceProduct = product => {
    let transform = new Transform(template);
    return transform.transform(product, [
        'product_id',
        'unit_id',
        'output_type_id',
        'price',
        'vat_value',
        'price_unit_name',
    ]);
};

const listCustomerDelivery = area => {
    return transform.transform(area, ['customer_delivery_id', 'driver_name', 'vehicle_name', 'phone_number']);
};

const totalWeight = area => {
    return transform.transform(area, ['total_weight', 'product_imei_code']);
};

const listUnit = product => {
    let transform = new Transform(template);
    return transform.transform(product, ['unit_id', 'unit_name']);
};

const listProductImeiCode = (products = []) => {
    return transform.transform(products, [
        'product_code',
        'product_name',
        'product_id',
        'quantity',
        'product_imei_code',
        'net_weight',
        'density',
        'lot_number',
        'manufacturer_name',
        'unit_id',
        'unit_name',
        'product_imei_code_unit_id',
        'product_imei_code_unit_name',
        'stocks_name',
        'product_type_id',
        'product_type_name',
        'note',
        'price_imei_code',
        'total_holding',
        'total_inventory',
        'stocks_id',
        'business_name',
    ]);
};

const detailProductImeiCode = (products = []) => {
    return transform.transform(products, [
        'product_code',
        'product_name',
        'product_id',
        'quantity',
        'product_imei_code',
        'net_weight',
        'density',
        'lot_number',
        'manufacturer_name',
        'unit_id',
        'unit_name',
        'product_imei_code_unit_id',
        'product_imei_code_unit_name',
        'stocks_name',
        'product_type_id',
        'product_type_name',
        'note',
        'max_quantity',
        'max_net_weight',
        'product_type_id',
    ]);
};

const product = user => {
    let transform = new Transform(template);
    return transform.transform(user, [
        'order_id',
        'order_detail_id',
        'unit_id',
        'product_unit_id',
        'output_type_id',
        'quantity',
        'price',
        'product_code',
        'product_name',
        'product_display_name',
        'product_id',
        'created_user',
        'area_id',
        'business_id',
        'unit_name',
        'output_type_name',
        'is_discount_percent',
        'discount_value',
        'total_discount',
        'is_gift',
        'price_id',
        'value_vat',
        'base_price',
        'product_imei_code',
        ' attribute_values',
        'attribute_values_id',
        'picture_url',

        'material_id',
        'material_code',
        'material_imei_code',
        'material_name',
        'period',
    ]);
};
const listUnitOpts = product => {
    const transform = new Transform({
        value: '{{#? UNITID}}',
        label: '{{#? UNITNAME}}',
    });
    return transform.transform(product, ['value', 'label']);
};

const options = (data = []) => {
    let transform = new Transform(templateOption);

    return transform.transform(data, ['id', 'name', 'total']);
};

const listProductImeiCheck = imeis => {
    return transform.transform(imeis, ['username', 'full_name', 'product_imei_code']);
};

const listProductImeiCheckHold = imeis => {
    return transform.transform(imeis, ['product_name', 'product_imei_code']);
};

const detailOrderForCreateReceiveslip = order => {
    const transform = new Transform({
        order_id: '{{#? ORDERID}}',
        order_no: '{{#? ORDERNO}}',
        customer_name: '{{#? CUSTOMERNAME}}',
        total_amount: '{{#? TOTALAMOUNT}}',
        debt_collection: '{{#? DEBTCOLLECTION}}',
        total_money: '{{#? TOTALMONEY}}',
        total_paid: '{{#? TOTALPAID}}',
        receiver_id: '{{#? CUSTOMERCODE}}',
        receiver_type: '{{#? RECEIVERTYPE}}',
    });
    return transform.transform(order, [
        'order_id',
        'order_no',
        'customer_name',
        'total_amount',
        'debt_collection',
        'total_money',
        'total_paid',
        'receiver_id',
        'receiver_type',
    ]);
};

const top10 = (orders = []) => {
    return transform.transform(orders, [
        'order_id',
        'order_no',
        'created_date',
        'customer_id',
        'full_name',
        'total_money',
        'is_partner',
        'status_order',
        'created_user',
        'status_payment',
    ]);
};

const top_out_nw = order => {
    const transform = new Transform({
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        total_netweight: '{{#? TOTALNETWEIGHT}}',
    });
    return transform.transform(order, ['product_name', 'product_id', 'total_netweight']);
};

const top_out_price = order => {
    const transform = new Transform({
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        total_price: '{{#? TOTALPRICE}}',
    });
    return transform.transform(order, ['product_name', 'product_id', 'total_price']);
};

const top_category = order => {
    const transform = new Transform({
        category_name: '{{#? CATEGORYNAME}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
        total_price: '{{#? TOTALPRICE}}',
        total_netweight: '{{#? TOTALNETWEIGHT}}',
    });
    return transform.transform(order, ['category_name', 'product_category_id', 'total_price', 'total_netweight']);
};

const chart = order => {
    const transform = new Transform({
        category_name: '{{#? CATEGORYNAME}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
        total_price: '{{#? TOTALPRICE}}',
        total_netweight: '{{#? TOTALNETWEIGHT}}',
        month: '{{#? M}}',
    });
    return transform.transform(order, [
        'category_name',
        'product_category_id',
        'total_price',
        'total_netweight',
        'month',
    ]);
};

const statistic = data => {
    const transform = new Transform({
        netweight_month: '{{#? NWMONTH}}',
        netweight_percent: '{{#? NWPERCENT}}',
        price_month: '{{#? PRICEMONTH}}',
        price_percent: '{{#? PRICEPERCENT}}',
        order_percent: '{{#? ORDERPERCENT}}',
        order_month: '{{#? ORDERMONTH}}',
        customer_month: '{{#? CUSTOMERMONTH}}',
        customer_percent: '{{#? CUSTOMERPERCENT}}',
    });
    return transform.transform(data, [
        'netweight_month',
        'netweight_percent',
        'price_month',
        'price_percent',
        'order_percent',
        'order_month',
        'customer_month',
        'customer_percent',
    ]);
};

const customerCreated = order => {
    const transform = new Transform({
        customer_code: '{{#? CUSTOMERCODE}}',
        customer_id: '{{#? CUSTOMERID}}',
        full_name: '{{#? FULLNAME}}',
        customer_phone_number: '{{#? PHONENUMBER}}',
        customer_address: '{{#? ADDRESS}}',
        province_name: '{{#? PROVINCENAME}}',
        district_name: '{{#? DISTRICTNAME}}',
        ward_name: '{{#? WARDNAME}}',
    });
    return transform.transform(order, [
        'full_name',
        'customer_code',
        'customer_id',
        'customer_phone_number',
        'customer_address',
        'ward_name',
        'district_name',
        'province_name',
    ]);
};

const orderPrint = order => {
    const transform = new Transform({
        order_no: '{{#? ORDERNO}}',
        customer_name: '{{#? CUSTOMERNAME}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        customer_address: '{{#? CUSTOMERADDRESS}}',
        customer_phone: '{{#? CUSTOMERPHONE}}',
        total_price: '{{#? TOTALPRICE}}',
        print_date: '{{#? PRINTDATE}}',
        created_user: '{{#? CREATEDUSER}}',
        stocks_name: '{{#? STOCKSNAME}}',
        sub_total: '{{#? SUBTOTAL}}',
        total_discount: '{{#? TOTALDISCOUNT}}',
        company_name: '{{#? COMPANYNAME}}',
        company_address: '{{#? COMPANYADDRESS}}',
        company_phone_number: '{{#? COMPANYPHONENUMBER}}',
        company_email: '{{#? COMPANYEMAIL}}',
        company_website: '{{#? COMPANYWEBSITE}}',
        note: '{{#? NOTE}}',
    });
    return transform.transform(order, [
        'order_no',
        'customer_name',
        'customer_code',
        'customer_address',
        'customer_phone',
        'total_price',
        'print_date',
        'created_user',
        'stocks_name',
        'total_discount',
        'sub_total',
        'company_address',
        'company_email',
        'company_phone_number',
        'company_name',
        'company_website',
        'note',
    ]);
};

const orderDetailPrint = orderDetail => {
    const transform = new Transform({
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        price: '{{#? PRICE}}',
        total_price: '{{#? TOTALPRICE}}',
        unit_name: '{{#? UNITNAME}}',
        quantity: '{{#? QUANTITY}}',
        row_index: '{{#? ROWINDEX}}',
    });
    return transform.transform(orderDetail, [
        'product_name',
        'product_code',
        'price',
        'total_price',
        'unit_name',
        'quantity',
        'row_index',
    ]);
};

const listProductImeiInStock = (products = []) => {
    return transform.transform(products, [
        'product_code',
        'product_name',
        'product_id',
        'quantity',
        'product_imei_code',
        'lot_number',
        'supplier_name',
        'unit_name',
        'note',
        'total_inventory',
    ]);
};

const productImeiInStock = (products = []) => {
    return transform.transform(products, [
        'product_code',
        'product_name',
        'product_id',
        'quantity',
        'product_imei_code',
        'lot_number',
        'supplier_name',
        'unit_name',
        'note',
        'total_inventory',
    ]);
};

// PROMOTION
const templatePromotion = {
    promotion: {
        promotion_id: '{{#? PROMOTIONID}}',
        promotion_name: '{{#? PROMOTIONNAME}}',
        short_description: '{{#? SHORTDESCRIPTION}}',
        is_apply_order: '{{ISAPPLYORDER ? 1 : 0}}',
        is_apply_all_product: '{{ISAPPLYALLPRODUCT ? 1 : 0}}',
        is_apply_any_product: '{{ISAPLLYANYPRODUCT ? 1 : 0}}',
        is_apply_appoint_product: '{{ISAPLLYAPPOINTPRODUCT ? 1 : 0}}',
        is_promotion_by_price: '{{ISPROMOTIONBYPRICE ? 1 : 0}}',
        from_price: '{{FROMPRICE ? FROMPRICE : 0}}',
        to_price: '{{TOPRICE ? TOPRICE : 0}}',
        is_promotion_by_total_money: '{{ISPROMOTIONBYTOTALMONEY ? 1 : 0}}',
        min_promotion_total_money: '{{MINPROMOTIONTOTALMONEY ? MINPROMOTIONTOTALMONEY : 0}}',
        max_promotion_total_money: '{{MAXPROMOTIONTOTALMONEY ? MAXPROMOTIONTOTALMONEY : 0}}',
        is_promotion_by_total_quantity: '{{ISPROMOTIONBYTOTALQUANTITY ? 1 : 0}}',
        min_promotion_total_quantity: '{{MINPROMOTIONTOTALQUANTITY ? MINPROMOTIONTOTALQUANTITY : 0}}',
        max_promotion_total_quantity: '{{MAXPROMOTIONTOTALQUANTITY ? MAXPROMOTIONTOTALQUANTITY : 0}}',
        is_apply_with_other_promotion: '{{ISAPPLYWITHORDERPROMOTION ? 1 : 0}}',
        is_limit_promotion_times: '{{ISLIMITPROMOTIONTIMES ? 1 : 0}}',
        max_promotion_time: '{{MAXPROMOTIONTIMES ? MAXPROMOTIONTIMES : 0}}',
        is_reward_point: '{{ISREWARDPOINT ? 1 : 0}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        is_apply_product_category: '{{ISAPPLYPRODUCTCATEGORY ? 1 : 0}}',
        is_all_payment_form: '{{ISALLPAYMENTFORM ? 1 : 0}}',
    },
    product_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        product_id: '{{#? PRODUCTID}}',
    },
    product_category_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
    },
    offer: {
        promotion_id: '{{#? PROMOTIONID}}',
        business_id: '{{#? BUSINESSID}}',
        promotion_offer_id: '{{#? PROMOTIONOFFERID}}',
        promotion_offer_name: '{{#? PROMOTIONOFFERNAME}}',
        is_fix_price: '{{ISFIXPRICE ? 1 : 0}}',
        is_percent_discount: '{{ISPERCENTDISCOUNT ? 1 : 0}}',
        is_fixed_gift: '{{ISFIXEDGIFT ? 1 : 0}}',
        is_discount_by_set_price: '{{ISDISCOUNTBYSETPRICE ? 1 : 0}}',
        discount_value: '{{DISCOUNTVALUE ? DISCOUNTVALUE : 0}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        discount: '{{DISCOUNT ? DISCOUNT : 0}}',
        is_transport: '{{ISTRANSPORT ? 1 : 0}}',
        shipping_promotion: '{{SHIPPINGPROMOTION ? SHIPPINGPROMOTION : 0}}',
        discount_shipping_fee: '{{DISCOUNTSHIPPINGFEE ? DISCOUNTSHIPPINGFEE : 0}}',
        percent_shipping_fee: '{{PERCENTSHIPPINGFEE ? PERCENTSHIPPINGFEE : 0}}',
        discount_max: '{{DISCOUNTMAX ? DISCOUNTMAX : 0}}',
    },
    gift: {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        promotion_offer_id: '{{#? PROMOTIONOFFERID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_gift_id: '{{#? PRODUCTGIFTSID}}',
        unit_name: '{{#? UNITNAME}}',
        product_unit_id: '{{#? UNITID}}',
        is_picked: '{{ISPICKED ? 1 : 0}}',
        quantity: '{{QUANTITY ? QUANTITY : 0}}',
        product_imei_code: '{{#? PRODUCTIMEICODE }}',
    },
    payment_form: {
        promotion_id: '{{#? PROMOTIONID}}',
        payment_form_id: '{{#? PAYMENTFORMID}}',
    },
};

const promotions = (promotion, applied = false) => {
    const transform = new Transform(templatePromotion.promotion);
    let columns = [
        'promotion_id',
        'promotion_name',
        'short_description',
        'is_apply_order',
        'is_apply_all_product',
        'is_apply_any_product',
        'is_apply_appoint_product',
        'is_promotion_by_price',
        'from_price',
        'to_price',
        'is_promotion_by_total_money',
        'min_promotion_total_money',
        'max_promotion_total_money',
        'is_promotion_by_total_quantity',
        'min_promotion_total_quantity',
        'max_promotion_total_quantity',
        'is_apply_with_other_promotion',
        'is_limit_promotion_times',
        'max_promotion_time',
        'is_reward_point',
        'is_apply_product_category',
        'is_all_payment_form',
    ];
    if (applied) columns.push('is_picked');
    return transform.transform(promotion, columns);
};

const offers = (offer, applied = false) => {
    const transform = new Transform(templatePromotion.offer);
    let columns = [
        'promotion_id',
        'business_id',
        'promotion_offer_name',
        'promotion_offer_id',
        'is_fix_price',
        'is_percent_discount',
        'is_fixed_gift',
        'is_discount_by_set_price',
        'discount_value',
        'is_transport',
        'shipping_promotion',
        'discount_shipping_fee',
        'percent_shipping_fee',
        'discount_max',
    ];
    if (applied) columns = [...columns, ...['is_picked', 'discount']];
    return transform.transform(offer, columns);
};

const productApplyPromotion = products => {
    const transform = new Transform(templatePromotion.product_apply);
    return transform.transform(products, ['promotion_id', 'product_id']);
};

const gift = (products, applied = false) => {
    const transform = new Transform(templatePromotion.gift);
    let columns = [
        'product_name',
        'product_id',
        'promotion_offer_id',
        'product_gift_id',
        'unit_name',
        'product_code',
        'product_unit_id',
        'product_imei_code',
    ];
    if (applied) columns = [...columns, ...['is_picked', 'quantity']];
    return transform.transform(products, columns);
};

//productCategoryApplyPromotion
const productCategoryApplyPromotion = products => {
    const transform = new Transform(templatePromotion.product_category_apply);
    return transform.transform(products, ['promotion_id', 'product_category_id']);
};

const paymentFormApply = products => {
    const transform = new Transform(templatePromotion.payment_form);
    return transform.transform(products, ['promotion_id', 'payment_form_id']);
};

const optionsProductBarcode = (products = []) => {
    const transform = new Transform({
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        quantity: '{{#? QUANTITY}}',
        lot_number: '{{#? LOTNUMBER}}',
        unit_id: '{{#? UNITID}}',
        unit_name: '{{#? UNITNAME}}',
        price: '{{PRICE ? PRICE : 0}}',
        stocks_detail_id: '{{#? STOCKSDETAILID}}',
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
    });
    return transform.transform(products, [
        'product_code',
        'product_name',
        'product_id',
        'quantity',
        'lot_number',
        'price',
        'stocks_detail_id',
        'unit_name',
        'unit_id',
        'product_imei_code',
    ]);
};

const listProductByStore = (products = []) => {
    const transform = new Transform({
        model_id: '{{#? MODELID}}',
        product_id: '{{#? parseInt(PRODUCTID)}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        image_url: [
            {
                '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        quantity: '{{QUANTITY ? QUANTITY : 0}}',
        current_price: '{{CURRENTPRICE ? CURRENTPRICE : 0}}',
        current_base_price: '{{CURRENTBASEPRICE ? CURRENTBASEPRICE : 0}}',
        original_price: '{{ORIGINALPRICE ? ORIGINALPRICE : 0}}',
        original_base_price: '{{ORIGINALBASEPRICE ? ORIGINALBASEPRICE : 0}}',
    });
    return transform.transform(products, [
        'model_id',
        'product_id',
        'product_name',
        'product_code',
        'image_url',
        'quantity',
        'current_price',
        'current_base_price',
        'original_price',
        'original_base_price',
    ]);
};

const listAttributeValue = (list = []) => {
    const transform = new Transform({
        model_id: '{{#? MODELID}}',
        product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_name: '{{#? ATTRIBUTENAME}}',
        attribute_value_id: '{{#? ATTRIBUTEVALUESID}}',
        attribute_value: '{{#? ATTRIBUTEVALUES}}',
        is_checked: '{{ISCHECKED ? 1 : 0}}',
    });
    return transform.transform(list, [
        'model_id',
        'product_attribute_id',
        'attribute_name',
        'attribute_value_id',
        'attribute_value',
        'is_checked',
    ]);
};

const optionsSearchProduct = product => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        product_name: '{{#? PRODUCTNAME}}',
    });
    return transform.transform(product, ['id', 'name', 'product_name']);
};

const userOption = list => {
    const transform = new Transform({
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    });
    return transform.transform(list, ['user_name', 'full_name', 'department_id', 'id', 'name']);
};

const commision = list => {
    const transform = new Transform({
        user_commission: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        commission_value: '{{#? COMMISSIONVALUE}}',
        commission_type: '{{#? COMMISSIONTYPE * 1 }}',
    });
    return transform.transform(list, [
        'user_commission',
        'commission_value',
        'department_id',
        'id',
        'name',
        'full_name',
        'commission_type',
    ]);
};

const bankAccountOptions = bankAccounts => {
    let transform = new Transform({
        id: '{{#? BANKACCOUNTID}}',
        name: '{{#? BANKNUMBER}}',
        logo: [
            {
                '{{#if BANKLOGO}}': `${config.domain_cdn}{{BANKLOGO}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    });
    return transform.transform(bankAccounts, ['id', 'name', 'logo']);
};

const optionStore = (products = []) => {
    return transform.transform(products, ['business_id', 'business_name', 'store_id', 'store_name']);
};

const customerList = (customers = []) => {
    const transform = new Transform({
        member_id: '{{#? MEMBERID}}',
        partner_id: '{{#? PARTNERID}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        full_name: '{{#? FULLNAME}}',
        phone_number: '{{#? PHONENUMBER}}',
        avatar: [
            {
                '{{#if IMAGEAVATAR}}': `${config.domain_cdn}{{IMAGEAVATAR}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        is_partner: '{{ISPARTNER ? 1 : 0}}',
        current_point: '{{CURRENTPOINT ? CURRENTPOINT : 0}}',
    });

    return transform.transform(customers, [
        'member_id',
        'partner_id',
        'customer_code',
        'full_name',
        'phone_number',
        'avatar',
        'is_partner',
        'current_point',
    ]);
};

const optionsOrderType = data => {
    const transform = new Transform({
        order_type_id: '{{#? ORDERTYPEID}}',
        order_type_name: '{{#? ORDERTYPENAME}}',

        is_online: '{{ISONLINE ? 1 : 0}}',
        is_offline: '{{ORDERTYPENAME ? 1 : 0}}',
        is_exchange: '{{ISEXCHANGE ? 1 : 0}}',
        is_return: '{{ISRETURN ? 1 : 0}}',

        type: '{{#? TYPE}}',
    });
    return transform.transform(data, [
        'order_type_id',
        'order_type_name',
        'is_online',
        'is_offline',
        'is_exchange',
        'is_return',
    ]);
};

const optionsOutPutType = data => {
    const transform = new Transform({
        order_type_id: '{{#? ORDERTYPEID}}',
        output_type_id: '{{#? OUTPUTTYPEID}}',
        output_type_name: '{{#? OUTPUTTYPENAME}}',
    });
    return transform.transform(data, ['order_type_id', 'output_type_id', 'output_type_name']);
};

const optionsProductImei = data => {
    return transform.transform(data, [
        'product_imei_code',
        'product_id',
        'product_code',
        'product_name',
        'picture_url',
        'unit_id',
        'price',
        'price_id',
        'base_price',
        'attribute_values',
        'attribute_values_id',
        'product_category_id',
        'material_id',
        'material_code',
        'material_name',
        'material_imei_code',
    ]);
};

const optionsMaterial = data => {
    return transform.transform(data, [
        'picture_url',
        'unit_id',
        'material_id',
        'material_code',
        'material_name',
        'number',
        'unit_name',
    ]);
};

const optionsShift = data => {
    return transform.transform(data, ['store_id', 'store_name', 'business_id', 'company_id']);
};

// COUPON
const templateCoupon = {
    coupon: {
        coupon_condition_id: '{{#? COUPONCONDITIONID}}',
        coupon_id: '{{#? COUPONID}}',
        coupon_code: '{{#? COUPONCODE}}',
        code_type: '{{#? CODETYPE}}',
        coupon_name: '{{#? COUPONNAME}}',
        max_value_reduce: '{{MAXVALUEREDUCE ? MAXVALUEREDUCE : 0}}',
        max_total_money: '{{MAXTOTALMONEY ? MAXTOTALMONEY : 0}}',
        min_total_money: '{{MINTOTALMONEY ? MINTOTALMONEY : 0}}',
        code_value: '{{#? CODEVALUE}}',

        is_all_customer_type: '{{ISALLCUSTOMERTYPE ? 1 : 0}}',
        is_appoint_product: '{{ISAPPOINTPRODUCT ? 1 : 0}}',
        is_all_product: '{{ISALLPRODUCT ? 1 : 0}}',
        is_any_product: '{{ISANYPRODUCT ? 1 : 0}}',
    },
    products: {
        coupon_product_id: '{{#? COUPONPRODUCTID}}',
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_display_name: '{{#? PRODUCTDISPLAYNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        image_url: [
            {
                '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    },
};

const coupon = coupon => {
    const transform = new Transform(templateCoupon.coupon);
    let columns = [
        'coupon_condition_id',
        'coupon_id',
        'coupon_code',
        'code_type',
        'coupon_name',
        'max_value_reduce',
        'max_total_money',
        'min_total_money',
        'code_value',

        'is_all_customer_type',
        'is_appoint_product',
        'is_all_product',
        'is_any_product',
    ];
    return transform.transform(coupon, columns);
};

const couponProducts = products => {
    const transform = new Transform(templateCoupon.products);
    let columns = [
        'coupon_product_id',
        'product_id',
        'product_name',
        'product_display_name',
        'product_code',
        'image_url',
    ];
    return transform.transform(products, columns);
};

// EXCHANGEPOINT
const templateExchangePoint = {
    expoint_id: '{{#? EXPOINTID}}',
    expoint_name: '{{#? EXPOINTNAME}}',
    value: '{{#? VALUE}}',
    max_expoint: '{{#? MAXEXPOINT}}',
    point: '{{#? POINT}}',
};

const exChangePoint = data => {
    const transform = new Transform(templateExchangePoint);
    let columns = ['expoint_id', 'expoint_name', 'value', 'max_expoint', 'point'];
    return transform.transform(data, columns);
};

const productApply = (list = []) => {
    return transform.transform(list, ['product_id', 'coupon_id']);
};
const customerTypeApply = (list = []) => {
    return transform.transform(list, ['customer_type_id', 'coupon_id']);
};

const orderReceiveSlip = (data = []) => {
    return transform.transform(data, [
        'receive_slip_id',
        'receive_slip_code',
        'payment_type',
        'bank_account_id',
        'payment_form_id',
        'total_money',
        'bank_logo',
        'bank_name',
        'payment_status',
        'order_id',
    ]);
};

const preOrderDetail = (data = {}) => {
    const template = {
        order_id: '{{#? ORDERID}}',
        product_name: '{{#? PRODUCTNAME}}',
        created_date: '{{#? CREATEDDATE}}',
        customer_name: '{{#? CUSTOMERNAME}}',
        customer_address: '{{#? CUSTOMERADDRESS}}',
        phone_number: '{{#? PHONENUMBER}}',
        store_address: '{{#? STOREADDRESS}}',
        created_user: '{{#? CREATEDUSER}}',
        lot_number: '{{#? LOTNUMBER}}',
        payment_type: '{{#? PAYMENTTYPE}}',
        storage: '{{#? STORAGE}}',
        color: '{{#? COLOR}}',
        expected_date: '{{#? EXPECTEDDATE}}',
        coupon_code: '{{#? COUPONCODE}}',
        total_money: '{{#? TOTALMONEY}}',
        pre_money: '{{#? PREMONEY}}',
        total_amount: '{{#? TOTALAMOUNT}}',
        signature: [
            {
                '{{#if SIGNATURE}}': `${config.domain_cdn}{{SIGNATURE}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const detaiCoupon = (user = []) => {
    const template = {
        coupon_id: '{{#? COUPONID}}',
        coupon_condition_id: '{{#? COUPONCONDITIONID}}',
        coupon_code: '{{#? COUPONCODE}}',
        coupon_name: '{{#? COUPONNAME}}',
        total_discount: '{{DISCOUNTMONEY ? DISCOUNTMONEY : 0}}',
        code_type: '{{CODETYPE ? CODETYPE : 0}}',
        code_value: '{{CODEVALUE ? CODEVALUE : 0}}',
        percent_value: '{{PERCENTVALUE ? PERCENTVALUE : 0}}',
        type: '{{#? TYPE}}',
    };
    const transform = new Transform(template);

    return transform.transform(user, [
        'is_discount_percent',
        'discount_value',
        'discount_coupon',
        'coupon_code',
        'coupon_id',
        'total_discount',
        'code_value',
        'coupon_name',
        'code_type',
        'type',
    ]);
};

module.exports = {
    list,
    products,
    detail,
    listStocks,
    listCustomerStocks,
    listCustomer,
    listProduct,
    detailProduct,
    listLotNumber,
    phoneNumber,
    listDetailProduct,
    listAll,
    listVehicleDriver,
    listReasonCancel,
    priceProduct,
    listCustomerDelivery,
    summaryBusiness,
    summaryOrder,
    detailPrint,
    listDetailProductPrint,
    totalWeight,
    listUnit,
    listProductImeiCode,
    detailProductImeiCode,
    product,
    listUnitOpts,
    options,
    listProductImeiCheck,
    listProductImeiCheckHold,
    detailOrderForCreateReceiveslip,
    top10,
    top_out_nw,
    top_out_price,
    top_category,
    chart,
    statistic,
    customerCreated,
    orderPrint,
    orderDetailPrint,
    listProductImeiInStock,
    productImeiInStock,
    promotions,
    offers,
    productApplyPromotion,
    productCategoryApplyPromotion,
    gift,
    optionsProductBarcode,
    listProductByStore,
    listAttributeValue,
    optionsSearchProduct,
    userOption,
    commision,
    bankAccountOptions,
    optionStore,
    customerList,

    optionsOrderType,
    optionsProductImei,
    optionsShift,
    optionsOutPutType,
    coupon,
    couponProducts,
    exChangePoint,
    productApply,
    customerTypeApply,
    paymentFormApply,
    orderReceiveSlip,
    optionsMaterial,
    preOrderDetail,
    detaiCoupon,
};
