const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    order_id: '{{#? ORDERID}}',
    order_invoice_date: '{{ ORDERINVOICEDATE }}',
    order_invoice_form_no: '{{ #? ORDERINVOICEFORMNO }}',
    order_invoice_no: '{{ #? ORDERINVOICENO }}',
    order_invoice_serial: '{{ #? ORDERINVOICESERIAL }}',
    order_invoice_transaction: '{{ #? ORDERINVOICETRANSACTION }}',
    order_invoice_url: '{{ #? ORDERINVOICEURL }}',
    is_review: '{{ ISREVIEW }}',
    is_active: '{{ISACTIVE  ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    transaction_id: '{{#? TRANSACTIONID}}',
    order_no: '{{#? ORDERNO}}',
    customer_id: '{{#? CUSTOMERID}}',
    address_id: '{{#? ADDRESSID}}',
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
    stock_id: '{{#? STOCKSID * 1}}',
    stock_name: '{{#? STOCKSNAME}}',
    cogs_price: '{{#? COGSPRICE}}',
    cogs_id: '{{#? COGSID}}',
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
    met_a: '{{#? META}}',
    met_b: '{{#? METB}}',
    met_c: '{{#? METC}}',
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
    discount_manufacturer_met_b: '{{#? DISCOUNTMANUFACTURERMETB}}',
    discount_manufacturer_met_c: '{{#? DISCOUNTMANUFACTURERMETC}}',
    discount_supplier_met_b: '{{#? DISCOUNTSUPPLIERMETB}}',
    discount_supplier_met_c: '{{#? DISCOUNTSUPPLIERMETC}}',
    order_status_id: '{{#? ORDERSTATUSID}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    stocks_ward_id: '{{#? STOCKSWARDID}}',
    stocks_ward_name: '{{#? STOCKSWARDNAME}}',
    stocks_district_id: '{{#? STOCKSDISTRICTID}}',
    stocks_district_name: '{{#? STOCKSDISTRICTNAME}}',
    stocks_province_id: '{{#? STOCKSPROVINCEID}}',
    stocks_province_name: '{{#? STOCKSPROVINCENAME}}',
    installment_form_id: '{{#? INSTALLMENTFORMID}}',
    installment_type: '{{#? INSTALLMENTTYPE}}',
    installment_partner_logo: '{{#? INSTALLMENTPARTNERLOGO}}',
    installment_form_name: '{{#? INSTALLMENTFORMNAME}}',

    customer_address: '{{CUSTOMERADDRESS}}',
    max_met_a: '{{MAXMETA}}',
    max_met_b: '{{MAXMETB}}',
    max_met_c: '{{MAXMETC}}',
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
    discount_met_c: '{{DISCOUNTMETC ? DISCOUNTMETC : 0}}',
    discount_met_b: '{{DISCOUNTMETB ? DISCOUNTMETB : 0}}',
    discount_met_a: '{{DISCOUNTMETA ? DISCOUNTMETA : 0}}',
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

    is_plus_point: '{{ISPLUSPOINT ? 1 : 0}}',
    expoint_value: '{{DISCOUNTPOINT ? DISCOUNTPOINT : 0}}',
    use_point: '{{USEPOINT ? USEPOINT : 0}}',
    expoint_id: '{{#? EXPOINTID}}',
    total_money: '{{#? TOTALMONEY}}',
    total_a_mount: '{{#? TOTALAMOUNT}}',
    discount_value: '{{DISCOUNTVALUE ? DISCOUNTVALUE : 0}}',
    discount_coupon: '{{DISCOUNTCOUPON ? DISCOUNTCOUPON : 0}}',
    total_discount: '{{TOTALDISCOUNT ? TOTALDISCOUNT : 0}}',
    sub_total_apply_discount: '{{SUBTOTALAPPLYDISCOUNT ? SUBTOTALAPPLYDISCOUNT : 0}}',
    premoney: '{{#? PREMONEY}}',
    imei_codes: '{{#? PRODUCTIMEICODE}}',
    // COUPON
    coupon: {
        coupon_id: '{{#? COUPONID}}',
        coupon_condition_id: '{{#? COUPONCONDITIONID}}',
        coupon_code: '{{#? COUPONCODE}}',
        coupon_name: '{{#? COUPONNAME}}',
        total_discount: '{{DISCOUNTMONEY ? DISCOUNTMONEY : 0}}',
        code_type: '{{CODETYPE ? CODETYPE : 0}}',
        code_value: '{{CODEVALUE ? CODEVALUE : 0}}',
        percent_value: '{{PERCENTVALUE ? PERCENTVALUE : 0}}',
    },
    coupon_code: '{{#? COUPONCODE}}',
    discount_money: '{{DISCOUNTMONEY ? DISCOUNTMONEY : 0}}',
    supplier_name: '{{#? SUPPLIERNAME}}',

    payment_type: '{{#? PAYMENTTYPE}}',
    is_gift: '{{ISGIFT ? 1 : 0}}',

    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    order_source: '{{#? ORDERSOURCE}}',

    member_id: '{{#? MEMBERID}}',
    dataleads_id: '{{#? DATALEADSID}}',
    user_id: '{{#? USERID}}',

    partner_id: '{{#? PARTNERID}}',

    order_type_id: '{{#? ORDERTYPEID}}',
    order_type_name: '{{#? ORDERTYPENAME}}',
    order_type: '{{#? ORDERTYPE}}',

    is_complete: '{{ISCOMPLETE ? 1 : 0}}',

    // status of order
    is_can_edit: '{{ISCANEDIT ? ISCANEDIT : 0}}',
    is_can_del: '{{ISCANDEL ? ISCANDEL : 0}}',
    is_can_print: '{{ISCANPRINT ? ISCANPRINT : 0}}',
    store_id: '{{#? STOREID}}',
    store_name: '{{#? STORENAME}}',
    store_address: '{{#? STOREADDRESS}}',
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

    // accumulate point
    acpoint_id: '{{#? ACPOINTID*1}}',
    presenter_dataleads_id: '{{#? PRESENTERDATALEADSID*1}}',
    presenter_member_id: '{{#? PRESENTERMEMBERID*1}}',
    accumulate_point: '{{#? ACCUMULATEPOINT}}',

    // payment
    cash: '{{#? CASH}}',
    bank: '{{#? BANK}}',
    transfer: '{{#? TRANFERS}}',
    is_can_collect_money: '{{ISCANTCOLLECTMONEY ? ISCANTCOLLECTMONEY : 0}}',
    is_can_stockout: '{{ISCANSTOCKOUT ? ISCANSTOCKOUT : 0}}',
    is_out_stock: '{{ISOUTSTOCKS ? ISOUTSTOCKS : 0}}',
    is_can_edit: '{{ISCANEDIT ? ISCANEDIT : 0}}',
    out_stock_status: '{{OUTSTOCKSTATUS ? OUTSTOCKSTATUS : 0}}',

    product_type: '{{#? PRODUCTTYPE}}',
    component_id: '{{#? COMPONENTID}}',
    imei_code: '{{#? IMEICODE}}',
    //////////////////////////////////
    base_price: '{{#? BASEPRICE}}',
    value_vat: '{{#? VALUEVAT}}',
    receiving_date: '{{#? RECEIVINGDATE}}',
    ip_receive: '{{#? IPRECEIVE}}',
    browser: '{{#? BROWSER}}',
    stocks_out_request_id: '{{#? STOCKSOUTREQUESTID}}',
    stocks_out_request_ids: '{{#? STOCKSOUTREQUESTIDS}}',

    is_promotion_gift: '{{ISPROMOTIONGIFT ? 1 : 0}}',
    promotion_id: '{{#? PROMOTIONID}}',
    promotion_offer_apply_id: '{{#? PROMOTIONOFFERAPPLYID}}',

    total_point: '{{#? TOTALPOINT}}',
    current_point: '{{#? TOTALPOINT}}',
    customer_type_name: '{{#? CUSTOMERTYPENAME}}',
    customer_type_id: '{{#? CUSTOMERTYPEID}}',

    order_type_add_function: '{{#? ORDERTYPEADDFUNCTION}}',
    order_type_edit_function: '{{#? ORDERTYPEEDITFUNCTION}}',
    order_type_view_function: '{{#? ORDERTYPEVIEWFUNCTION}}',
    order_type_delete_function: '{{#? ORDERTYPEDELETEFUNCTION}}',

    order_status_add_function: '{{#? ORDERSTATUSADDFUNCTION}}',
    order_status_edit_function: '{{#? ORDERSTATUSEDITFUNCTION}}',
    order_status_view_function: '{{#? ORDERSTATUSVIEWFUNCTION}}',
    order_status_delete_function: '{{#? ORDERSTATUSDELETEFUNCTION}}',
    finance_company_confirmed: '{{FINANCECOMPANYCONFIRMED ? 1 : 0}}',

    warranty_period: '{{#? WARRANTYPERIOD}}',

    signature: [
        {
            '{{#if SIGNATURE}}': `${config.domain_cdn}{{SIGNATURE}}`,
        },
        {
            '{{#else}}': null,
        },
    ],

    pre_order_id: '{{#? PREORDERID}}',
    tax_account_id: '{{#? TAXACCOUNTID}}',
    debt_account_id: '{{#? DEBTACCOUNTID}}',
    revenue_account_id: '{{#? REVENUEACCOUNTID}}',
    stocks_out_request_id_of_internal: '{{#? STOCKSOUTREQUESTIDOFINTERNAL}}',
    other_acc_voucher_id: '{{#? OTHERACCVOUCHERID}}',
    is_agree_policy: '{{ISAGREEPOLICY ? 1 : 0}}',
    installment_payment_date: '{{#? INSTALLMENTPAYMENTDATE}}',
    installment_money: '{{INSTALLMENTMONEY ? INSTALLMENTMONEY * 1 : 0}}',
    error_des: '{{#? ERRORDES}}',
    review_user: '{{#? REVIEWUSER}}',
    voucher_request: '{{#? VOUCHERREQUEST}}',
    user_request: '{{#? USERREQUEST}}',
    error_note: '{{#? ERRORNOTE}}',
    picture_url: '{{#? PICTUREURL}}',
    total_price_base: '{{#? TOTALPRICEBASE}}'
};

const templateOption = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
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

const listDetailProduct = (user) => {
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
        'met_a',
        'met_b',
        'met_c',
        'stocks_id',
        'stocks_name',
        'product_type_id',
    ]);
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'order_id',
        'order_no',
        'installment_type',
        'installment_form_id',
        'installment_partner_logo',
        'installment_form_name',
        'member_id',
        'dataleads_id',
        'customer_code',
        'customer_name',
        'address_id',
        'phone_number',
        'total_money',
        'created_date',
        'stock_name',
        'stock_id',
        'customer_address',
        'description',
        'created_user',
        'order_status',
        'payment_status',
        'is_partner',
        'expoint_value',
        'use_point',
        'expoint_id',
        'is_plus_point',
        'total_a_mount',
        'is_create_stocksoutrequest',
        'payment_type',
        'sub_total',
        'order_source',
        'order_type_id',
        'order_status_id',
        'is_cancel',
        'is_complete',
        'store_id',
        'province_store',
        'is_invoice',
        'invoice_address',
        'invoice_company_name',
        'invoice_email',
        'invoice_full_name',
        'invoice_price',
        'invoice_tax',
        'is_delivery_type',
        'total_vat',
        'cash',
        'bank',
        'transfer',
        'is_can_collect_money',
        'is_can_stockout',
        'is_can_edit',
        /////////////
        'receiving_date',
        'transaction_id',
        'receiving_date',
        'ip_receive',
        'browser',
        'business_id',
        'business_name',
        'stocks_out_request_ids',
        'address_full',
        'sub_total_apply_discount',
        'total_paid',
        'total_point',
        'current_point',
        'customer_type_name',
        'customer_type_id',

        'acpoint_id',
        'presenter_dataleads_id',
        'presenter_member_id',
        'accumulate_point',

        'premoney',
        'store_name',
        'store_address',
        'order_type',
        'signature',

        'is_out_stock',
        'coupon_code',
        'discount_money',
        'finance_company_confirmed',
        'stocks_out_request_id_of_internal',
        'other_acc_voucher_id',
        'installment_money',
        'installment_payment_date',

        'order_invoice_date',
        'order_invoice_form_no',
        'order_invoice_no',
        'order_invoice_serial',
        'order_invoice_transaction',
        'order_invoice_url',
        'is_agree_policy',
        'out_stock_status',
    ]);
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
    ]);
};

const detailPrint = (user) => {
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

const listDetailProductPrint = (user) => {
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
        'met_a',
        'met_b',
        'met_c',
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

const listLotNumber = (product) => {
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
        'met_a',
        'met_b',
        'met_c',
        'unit_id',
        'unit_name',
        'tolerance_value',
        'discount_manufacturer_met_b',
        'discount_manufacturer_met_c',
        'discount_supplier_met_b',
        'discount_supplier_met_c',
        'product_type_id',
    ]);
};

const list = (areas = []) => {
    return transform.transform(areas, [
        'order_id',
        'order_no',
        'created_date',
        'full_name',
        'total_money',
        'transaction_id',
        'payment_status',
        'payment_status_name',
        'order_status_name',
        'order_status_id',
        'phone_number',
        'created_user',
        'user_id',
        'stocks_name',
        'member_id',
        'dataleads_id',
        'partner_id',
        'order_type_name',
        'order_source',
        'is_can_edit',
        'is_can_del',
        'is_can_print',
        'store_name',
        'order_type',

        'total_amount',
        'total_paid',
        'sub_total_apply_discount',

        'order_type_add_function',
        'order_type_edit_function',
        'order_type_view_function',
        'order_type_delete_function',

        'order_status_add_function',
        'order_status_edit_function',
        'order_status_view_function',
        'order_status_delete_function',
        'pre_order_id',
    ]);
};

const listAll = (areas = []) => {
    let transform = new Transform(templateOption);

    return transform.transform(areas, ['id', 'name', 'parent_id', 'is_member']);
};

const phoneNumber = (area) => {
    return transform.transform(area, ['driver_id', 'phone_number']);
};

const listReasonCancel = (area) => {
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

const listVehicleDriver = (area) => {
    return transform.transform(area, [
        'partner_transport_id',
        'driver_id',
        'driver_name',
        'phone_number',
        'license_plates',
    ]);
};

const priceProduct = (product) => {
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

const listCustomerDelivery = (area) => {
    return transform.transform(area, ['customer_delivery_id', 'driver_name', 'vehicle_name', 'phone_number']);
};

const totalWeight = (area) => {
    return transform.transform(area, ['total_weight', 'product_imei_code']);
};

const listUnit = (product) => {
    let transform = new Transform(template);
    return transform.transform(product, ['unit_id', 'unit_name']);
};

const listProductImeiCode = (products = []) => {
    return transform.transform(products, [
        'product_code',
        'product_name',
        'product_id',
        'quantity',
        'met_a',
        'met_b',
        'met_c',
        'product_imei_code',
        'net_weight',
        'density',
        'lot_number',
        'manufacturer_name',
        'unit_id',
        'unit_name',
        'product_imei_code_unit_id',
        'product_imei_code_unit_name',
        'discount_met_a',
        'discount_met_b',
        'discount_met_c',
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
        'met_a',
        'met_b',
        'met_c',
        'product_imei_code',
        'net_weight',
        'density',
        'lot_number',
        'manufacturer_name',
        'unit_id',
        'unit_name',
        'product_imei_code_unit_id',
        'product_imei_code_unit_name',
        'discount_met_a',
        'discount_met_b',
        'discount_met_c',
        'stocks_name',
        'product_type_id',
        'product_type_name',
        'note',
        'max_met_a',
        'max_met_b',
        'max_met_c',
        'max_quantity',
        'max_net_weight',
        'product_type_id',
    ]);
};

const product = (user) => {
    let transform = new Transform(template);
    return transform.transform(user, [
        'order_id',
        'order_detail_id',
        'unit_id',
        'product_unit_id',
        'output_type_id',
        'density',
        'total_price',
        'quantity',
        'price',
        'product_code',
        'product_name',
        'product_display_name',
        'product_id',
        'vat_value',
        'created_user',
        'area_id',
        'business_id',
        'change_price',
        'business_name',
        'area_name',
        'unit_name',
        'output_type_name',
        'note',
        'is_discount_percent',
        'discount_value',
        'total_discount',
        'is_gift',
        'product_category_id',
        'store_id',
        'store_name',
        'price_id',
        'product_type',
        'component_id',
        'imei_code',
        'value_vat',
        'base_price',
        'vat_amount',
        'is_promotion_gift',
        'promotion_id',
        'promotion_offer_apply_id',
        'warranty_period',
        'stock_id',
        'stock_name',
        'cogs_price',
        'cogs_id',
        'tax_account_id',
        'debt_account_id',
        'revenue_account_id',
        'error_des',
        'review_user',
        'voucher_request',
        'is_review',
        'user_request',
        'error_note',
        'picture_url',
        'total_price_base'
    ]);
};
const listUnitOpts = (product) => {
    const transform = new Transform({
        value: '{{#? UNITID}}',
        label: '{{#? UNITNAME}}',
    });
    return transform.transform(product, ['value', 'label']);
};

const options = (data = []) => {
    let transform = new Transform(templateOption);

    return transform.transform(data, ['id', 'name']);
};

const listProductImeiCheck = (imeis) => {
    return transform.transform(imeis, ['username', 'full_name', 'product_imei_code']);
};

const listProductImeiCheckHold = (imeis) => {
    return transform.transform(imeis, ['product_name', 'product_imei_code']);
};

const detailOrderForCreateReceiveslip = (order) => {
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

const top_out_nw = (order) => {
    const transform = new Transform({
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        total_netweight: '{{#? TOTALNETWEIGHT}}',
    });
    return transform.transform(order, ['product_name', 'product_id', 'total_netweight']);
};

const top_out_price = (order) => {
    const transform = new Transform({
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        total_price: '{{#? TOTALPRICE}}',
    });
    return transform.transform(order, ['product_name', 'product_id', 'total_price']);
};

const top_category = (order) => {
    const transform = new Transform({
        category_name: '{{#? CATEGORYNAME}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
        total_price: '{{#? TOTALPRICE}}',
        total_netweight: '{{#? TOTALNETWEIGHT}}',
    });
    return transform.transform(order, ['category_name', 'product_category_id', 'total_price', 'total_netweight']);
};

const chart = (order) => {
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

const statistic = (data) => {
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

const customerCreated = (order) => {
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

const orderPrint = (order) => {
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

const orderDetailPrint = (orderDetail) => {
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
        description: '{{#? DESCRIPTION}}',
        is_apply_order: '{{ISAPPLYORDER ? 1 : 0}}',
        is_apply_all_product: '{{ISAPPLYALLPRODUCT ? 1 : 0}}',
        is_apply_any_product: '{{ISAPLLYANYPRODUCT ? 1 : 0}}',
        is_apply_appoint_product: '{{ISAPLLYAPPOINTPRODUCT ? 1 : 0}}',
        is_all_payment_form: '{{ISALLPAYMENTFORM ? 1 : 0}}',
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
        defend_key: '{{DEFENDKEY ? 1 : 0}}',
        is_promotion_by_product: '{{#? ISPROMOTIONBYPRODUCT ? 1 : 0}}',
        is_promotion_any_product: '{{#? ISPROMOTIONANYPRODUCT ? 1 : 0}}',
        is_promotion_appoint_product: '{{#? ISPROMOTIONAPPOINTPRODUCT ? 1 : 0}}',
    },
    product_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        product_id: '{{#? PRODUCTID}}',
    },
    product_category_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
    },
    payment_form_apply: {
        promotion_id: '{{#? PROMOTIONID}}',
        payment_form_id: '{{#? PAYMENTFORMID}}',
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
        description: '{{#? DESCRIPTION}}',
        max_value_reduce: '{{MAXVALUEREDUCE ? MAXVALUEREDUCE : 0}}',
        max_total_money: '{{MAXTOTALMONEY ? MAXTOTALMONEY : 0}}',
        min_total_money: '{{MINTOTALMONEY ? MINTOTALMONEY : 0}}',
        is_payment_form: '{{ISPAYMENTFORM ? 1 : 0}}',
        company_value: '{{COMPANYVALUE ? COMPANYVALUE : 0}}',
        partner_value: '{{PARTNERVALUE ? PARTNERVALUE : 0}}',
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
        value: '{{#? PRODUCTIMEICODE}}',
        label: '{{#? PRODUCTIMEICODE}}',
    },
};
const promotions = (promotion, applied = false) => {
    const transform = new Transform(templatePromotion.promotion);
    let columns = [
        'promotion_id',
        'promotion_name',
        'short_description',
        'description',
        'is_apply_order',
        'is_apply_all_product',
        'is_apply_any_product',
        'is_apply_appoint_product',
        'is_all_payment_form',
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
        'is_promotion_by_product',
        'is_promotion_any_product',
        'is_promotion_appoint_product',
        'defend_key',
    ];
    if (applied) columns.push('is_picked');
    return transform.transform(promotion, columns);
};

const offers = (offer, applied = false) => {
    const transform = new Transform(templatePromotion.offer);
    let columns = [
        'promotion_id',
        'business_id',
        'description',
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
        'max_value_reduce',
        'max_total_money',
        'min_total_money',
        'is_payment_form',
        'company_value',
        'partner_value',
    ];
    if (applied) columns = [...columns, ...['is_picked', 'discount']];
    return transform.transform(offer, columns);
};

const productApplyPromotion = (products) => {
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
        'value',
        'label',
    ];
    if (applied) columns = [...columns, ...['is_picked', 'quantity']];
    return transform.transform(products, columns);
};

const productCategoryApplyPromotion = (products) => {
    const transform = new Transform(templatePromotion.product_category_apply);
    return transform.transform(products, ['promotion_id', 'product_category_id']);
};

const paymentFormApplyPromotion = (products) => {
    const transform = new Transform(templatePromotion.payment_form_apply);
    return transform.transform(products, Object.keys(templatePromotion.payment_form_apply));
};

// COUPON
const templateCoupon = {
    coupon: {
        coupon_id: '{{#? COUPONID}}',
        coupon_name: '{{#? COUPONNAME}}',
        coupon_condition_id: '{{#? COUPONCONDITIONID}}',
        coupon_code: '{{#? COUPONCODE}}',
        code_type: '{{#? CODETYPE}}',
        code_value: '{{#? CODEVALUE}}',
        percent_value: '{{PERCENTVALUE ? PERCENTVALUE : 0}}',
        max_value_reduce: '{{MAXVALUEREDUCE ? MAXVALUEREDUCE : 0}}',
        quantity: '{{QUANTITY ? QUANTITY : 0}}',
        used_time: '{{USEDTIME ? USEDTIME : 0}}',
        is_aplly_other_coupon: '{{#? ISAPPLYOTHERCOUPON ? 1 : 0}}',
        is_aplly_other_promotion: '{{#? ISAPPLYOTHERPROMOTION ? 1 : 0}}',
        is_limit_promotion_times: '{{#? ISLIMITCOUPONTIMES ? 1 : 0}}',
        count_promotion_times: '{{#? MAXCOUPONTIMES}}',
        mounth_promotion_times: '{{#? COUPONTIMESCYCLE}}',
        promotionid: '{{#? PROMOTIONID}}',
        source_coupon_id: '{{#? SOURCE_COUPON_ID}}',
        budget: '{{#? BUDGET ?? 0}}',
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

const coupon = (coupon) => {
    const transform = new Transform(templateCoupon.coupon);
    let columns = [
        'coupon_id',
        'coupon_name',
        'coupon_condition_id',
        'coupon_code',
        'code_type',
        'code_value',
        'percent_value',
        'max_value_reduce',
        'quantity',
        'used_time',
        'is_aplly_other_coupon',
        'is_aplly_other_promotion',
        'is_limit_promotion_times',
        'count_promotion_times',
        'source_coupon_id',
        'promotionid',
        'budget',
    ];
    return transform.transform(coupon, columns);
};

const couponProducts = (products) => {
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

const orderStatusOptions = (status) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        is_new_order: '{{ISNEWORDER ? 1 : 0}}',
        is_complete: '{{ISCOMPLETE ? 1 : 0}}',
        is_confirm: '{{ISCONFIRM ? 1 : 0}}',
        is_process: '{{ISPROCESS ? 1 : 0}}',
        is_cancel: '{{ISCANCEL ? 1 : 0}}',
        permission: '{{#? FUNCTIONALIAS}}',
        number_order: '{{NUMBERORDER ? NUMBERORDER : 0}}',
    });
    return transform.transform(status, [
        'id',
        'name',
        'is_new_order',
        'is_complete',
        'is_confirm',
        'is_process',
        'is_cancel',
        'permission',
        'number_order',
    ]);
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

const listProductInStock = (products = []) => {
    const transform = new Transform({
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        quantity: '{{#? QUANTITY}}',
        lot_number: '{{#? LOTNUMBER}}',
        supplier_name: '{{#? SUPPLIERNAME}}',
        unit_name: '{{#? UNITNAME}}',
        price: '{{PRICE ? PRICE : 0}}',
        stocks_detail_id: '{{#? STOCKSDETAILID}}',
        unit_id: '{{#? UNITID}}',
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
        category_name: '{{#? CATEGORYNAME}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
        model_name: '{{#? MODELNAME}}',
        price_id: '{{#? PRICEID}}',
        product_type: '{{#? PRODUCTTYPE}}',
        component_id: '{{#? COMPONENTID}}',
        imei_code: '{{#? IMEICODE}}',
        base_price: '{{#? BASEPRICE}}',
        value_vat: '{{#? VALUEVAT}}',
    });
    return transform.transform(products, [
        'product_code',
        'product_name',
        'product_id',
        'quantity',
        'lot_number',
        'price',
        'unit_name',
        'supplier_name',
        'stocks_detail_id',
        'unit_id',
        'product_imei_code',
        'category_name',
        'product_category_id',
        'model_name',
        'price_id',
        'imei_code',
        'product_type',
        'component_id',
        'base_price',
        'value_vat',
    ]);
};

const optionsSearchProduct = (product) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        product_name: '{{#? PRODUCTNAME}}',
    });
    return transform.transform(product, ['id', 'name', 'product_name']);
};

const optionsInit = (product) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        product_id: '{{#? PRODUCTID}}',
        component_id: '{{#? COMPONENTID}}',
        imei_code: '{{#? PRODUCTIMEICODE}}',

        base_price: '{{#? BASEPRICE}}',
        value_vat: '{{#? VATVALUE}}',
        price_id: '{{#? PRICEID}}',
        price: '{{#? PRICE}}',
    });
    return transform.transform(product, [
        'id',
        'name',
        'value',
        'label',
        'product_id',
        'component_id',
        'imei_code',

        'base_price',
        'value_vat',
        'price_id',
        'price',
    ]);
};

const salesassistant = (product) => {
    const transform = new Transform({
        salesassistant: '{{#? SALESASSISTANT}}',
    });
    return transform.transform(product, ['salesassistant']);
};

const userOption = (list) => {
    const transform = new Transform({
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        department_id: '{{#? DEPARTMENTID}}',
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
    });
    return transform.transform(list, ['user_name', 'full_name', 'department_id', 'id', 'name']);
};

const commision = (list) => {
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

const bankAccountOptions = (bankAccounts) => {
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
    return transform.transform(products, ['business_id', 'business_name', 'store_id', 'store_name', 'address']);
};

const productByImei = (product) => {
    const transform = new Transform({
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_id: '{{#? PRODUCTID}}',
        supplier_name: '{{#? SUPPLIERNAME}}',
        unit_name: '{{#? UNITNAME}}',
        price: '{{#? PRICE}}',
        unit_id: '{{#? UNITID}}',
        imei_code: '{{#? PRODUCTIMEICODE}}',
        category_name: '{{#? CATEGORYNAME}}',
        product_category_id: '{{#? PRODUCTCATEGORYID}}',
        product_output_type_id: '{{#? OUTPUTTYPEID}}',
        model_name: '{{#? MODELNAME}}',
        price_id: '{{#? PRICEID}}',
        base_price: '{{#? BASEPRICE}}',
        value_vat: '{{#? VALUEVAT}}',
        stock_id: '{{#? STOCKSID}}',
        stock_date: '{{#? STOCKDATE}}',
        is_hot: '{{ISHOT ? 1 : 0}}',
    });
    return transform.transform(product, [
        'product_code',
        'product_name',
        'product_id',
        'price',
        'unit_name',
        'supplier_name',
        'unit_id',
        'imei_code',
        'category_name',
        'product_category_id',
        'model_name',
        'price_id',
        'base_price',
        'value_vat',
        'product_output_type_id',
        'stock_id',
        'stock_date',
        'is_hot',
    ]);
};

const outputTypeOptions = (list = []) => {
    const transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
        output_type_id: '{{#? OUTPUTTYPEID}}',
        output_type_name: '{{#? OUTPUTTYPENAME}}',
        product_id: '{{#? PRODUCTID}}',
        imei_code: '{{#? PRODUCTIMEICODE}}',

        base_price: '{{#? BASEPRICE}}',
        value_vat: '{{#? VALUEVAT}}',
        price_id: '{{#? PRICEID}}',
        price: '{{#? PRICE}}',
    });
    return transform.transform(list, [
        'id',
        'name',
        'value',
        'label',
        'product_id',
        'component_id',
        'imei_code',

        'base_price',
        'value_vat',
        'price_id',
        'price',
    ]);
};

const material = (data = []) => {
    const template = {
        material_id: '{{#? MATERIALID}}',
        material_name: '{{#? MATERIALNAME}}',
        material_code: '{{#? MATERIALCODE}}',
        material_group_name: '{{#? MATERIALGROUPNAME}}',
        manufacturer_name: '{{#? MANUFACTURERNAME}}',
        material_imei_code: '{{#? MATERIALIMEICODE}}',
    };

    const transform = new Transform(template);

    return transform.transform(data, Object.keys(template));
};

const checkedDataPayment = (data = []) => {
    const template = {
        payment_form_id: '{{#? PAYMENTFORMID}}',
        payment_value: '{{#? PAYMENTVALUE}}',
    };

    const transform = new Transform(template);

    return transform.transform(data, Object.keys(template));
};

const giftImei = (data = []) => {
    const template = {
        product_id: '{{#? PRODUCTID}}',
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
        stock_id: '{{#? STOCKSID}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const orderType = (data = []) => {
    const template = {
        order_type_id: '{{#? ORDERTYPEID}}',
        order_type_name: '{{#? ORDERTYPENAME}}',
        type: '{{#? TYPE}}',
        order_index: '{{#? ORDERINDEX}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const paymentHistory = (data = []) => {
    const template = {
        receive_slip_id: '{{#? RECEIVESLIPID}}',
        payment_form_id: '{{#? PAYMENTFORMID}}',
        total_money: '{{#? TOTALMONEY}}',
        payment_form_name: '{{#? PAYMENTFORMNAME}}',
        payment_type: '{{#? PAYMENTTYPE}}',
        bank_id: '{{#? BANKID}}',
        bank_name: '{{#? BANKNAME}}',
        bank_logo: [
            {
                '{{#if BANKLOGO}}': `${config.domain_cdn}{{BANKLOGO}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        bank_account_id: '{{#? BANKACCOUNTID}}',
        bank_number: '{{#? BANKNUMBER}}',
        bank_account_name: '{{#? BANKACCOUNTNAME}}',
        bank_branch: '{{#? BANKBRANCH}}',
        created_date: '{{#? CREATEDDATE}}',
    };
    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};
const checkSendSmsOrZaloOA = (data = []) => {
    const template = {
        is_send_sms: '{{ ISSENDSMS ? 1: 0}}',
        is_send_zalo_oa: '{{ ISSENDZALOOA? 1: 0}}',
        is_send_email: '{{ ISSENDEMAIL? 1: 0}}',
        content_sms: '{{#? CONTENTSMS}}',
        brand_name: '{{#? BRANDNAME}}',
        oa_template_id: '{{#? OATEMPLATEID}}',
        mail_from: '{{#? MAILFROM}}',
        mail_subject: '{{#? MAILSUBJECT}}',
        mail_from_name: '{{#? MAILFROMNAME}}',
        mail_reply: '{{#? MAILREPLY}}',
        email_template_id: '{{#? EMAILTEMPLATEID}}',
        email_template_html: '{{#? EMAILTEMPLATEHTML}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const materialList = (data = []) => {
    const template = {
        material_id: '{{#? MATERIALID}}',
        material_name: '{{#? MATERIALNAME}}',
        material_code: '{{#? MATERIALCODE}}',
        material_group_name: '{{#? MATERIALGROUPNAME}}',
        manufacturer_name: '{{#? MANUFACTURERNAME}}',
        picture_url: [
            {
                '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        inventory_number: '{{#? INVENTORYNUMBER}}',
    };
    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};
const checkSendData = (data = {}) => {
    const template = {
        member_id: '{{#? MEMBERID}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        full_name: '{{#? FULLNAME}}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        order_no: '{{#? ORDERNO}}',
        order_code: '{{#? ORDERNO}}',
        status_name: '{{#? STATUSNAME}}',
        order_date: '{{#? ORDERDATE}}',
        total_amount: '{{#? TOTALAMOUNT}}',
        total_money: '{{#? TOTALMONEY}}',
        pre_money: '{{#? PREMONEY}}',
        old_order_status_id: '{{#? OLDORDERSTATUSID}}',
        is_change_order_status: '{{ ISCHANGEORDERSTATUS? 1: 0}}',
        product_name_list: '{{#? PRODUCTNAMELIST}}',
        pre_order_no: '{{#? PREORDERNO}}',
        store_name: '{{#? STORENAME}}',
        receiving_date: '{{#? RECEIVINGDATE }}',
        receiving_time: '{{#? RECEIVINGTIME }}',
        receive_address: '{{#? RECEIVEADDRESS }}',
        payment_type: '{{#? PAYMENTTYPE}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const customerList = (data = []) => {
    const template = {
        member_id: '{{#? MEMBERID}}',
        dataleads_id: '{{#? DATALEADSID}}',
        customer_code: '{{#? CUSTOMERCODE}}',
        full_name: '{{#? FULLNAME}}',
        gender: '{{ GENDER ? 1 : 0 }}',
        birthday: '{{BIRTHDAY}}',
        phone_number: '{{#? PHONENUMBER}}',
        customer_type_name: '{{#? CUSTOMERTYPENAME}}',
        customer_type_id: '{{#? CUSTOMERTYPEID}}',
        total_point: '{{#? TOTALPOINT}}',
        current_point: '{{#? CURRENTPOINT}}',
        address_full: '{{#? ADDRESSFULL}}',
        email: '{{#? EMAIL}}',
    };
    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
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

const productReport = (data = {}) => {
    const template = {
        product_code: '{{#? PRODUCTCODE}}',
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        unit_name: '{{#? UNITNAME}}',
        quantity: '{{#? QUANTITY}}',
        expected_date: '{{#? EXPECTEDDATE}}',
        store_name: '{{#? STORENAME}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const storeReport = (data = {}) => {
    const template = {
        product_id: '{{#? PRODUCTID}}',
        store_id: '{{#? STOREID}}',
        store_name: '{{#? STORENAME}}',
        store_code: '{{#? STORECODE}}',
        quantity: '{{#? QUANTITY}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const productChart = (data = {}) => {
    const template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        quantity: '{{#? QUANTITY}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const orderReport = (data = {}) => {
    const template = {
        order_id: '{{#? ORDERID}}',
        order_no: '{{#? ORDERNO}}',
        created_date: '{{#? CREATEDDATE}}',
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        store_id: '{{#? STOREID}}',
        unit_name: '{{#? UNITNAME}}',
        quantity: '{{#? QUANTITY}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const businessInfo = (data = {}) => {
    const template = {
        business_name: '{{#? BUSINESSNAME}}',
        business_tax_code: '{{#? BUSINESSTAXCODE}}',
        business_address_full: '{{#? BUSINESSADDRESSFULL}}',
        business_phone_number: '{{#? BUSINESSPHONENUMBER}}',
        store_name: '{{#? STORENAME}}',
        business_email: '{{#? BUSINESSEMAIL}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const getSaleInfo = (data) => {
    const template = {
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
    };

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

const imagesExplain = (data = []) => {
    const template = {
        picture_url: '{{#? PICTUREURL}}',
        order_detail_id: '{{#? ORDERDETAILID}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};


module.exports = {
    list,
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
    paymentFormApplyPromotion,
    gift,
    coupon,
    couponProducts,
    orderStatusOptions,
    optionsProductBarcode,
    listProductInStock,
    optionsSearchProduct,
    optionsInit,
    userOption,
    commision,
    bankAccountOptions,
    optionStore,
    productByImei,
    outputTypeOptions,
    material,
    checkedDataPayment,
    giftImei,
    orderType,
    paymentHistory,
    materialList,
    checkSendSmsOrZaloOA,
    checkSendData,
    customerList,
    preOrderDetail,
    productReport,
    productChart,
    storeReport,
    orderReport,
    detaiCoupon,
    businessInfo,
    getSaleInfo,
    salesassistant,
    imagesExplain
};
