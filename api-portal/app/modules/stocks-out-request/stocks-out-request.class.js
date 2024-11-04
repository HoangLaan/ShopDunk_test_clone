const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    max_id: '{{#? MAXID}}',
    stocks_out_request_id: '{{#? STOCKSOUTREQUESTID}}',
    stocks_out_request_code: '{{#? STOCKSOUTREQUESTCODE}}',
    stocks_out_request_date: '{{#? STOCKSOUTREQUESTDATE}}',
    from_stocks_name: '{{#? FROMSTOCKSNAME}}',
    from_stocks_address: '{{#? FROMSTOCKSADDRESS}}',
    to_stocks_address: '{{#? TOSTOCKSADDRESS}}',
    to_stocks_name: '{{#? TOSTOCKSNAME}}',
    hidden_price: '{{#? HIDDENPRICE}}',
    stocks_id: '{{#? STOCKSID}}',
    from_stocks_id: '{{#? FROMSTOCKSID}}',
    stocks_name: '{{#? STOCKSNAME}}',
    stocks_out_type_id: '{{#? STOCKSOUTTYPEID}}',
    stocks_out_type_name: '{{#? STOCKSOUTTYPENAME}}',
    stocks_status_id: '{{#? STOCKSSTATUSID}}',
    stocks_status_name: '{{#? STOCKSSTATUSNAME}}',
    fullname: '{{#? FULLNAME}}',
    phone_number: '{{#? PHONENUMBER}}',
    receiver_full_address: '{{#? RECEIVERFULLADDRESS}}',
    partner_transport_id: '{{#? PARTNERTRANSPORTID}}',
    vehicles_id: '{{#? VEHICLESID}}',
    vehicles_name: '{{#? VEHICLESNAME}}',
    driver_id: '{{#? DRIVERID}}',
    driver_name: '{{#? DRIVERNAME}}',
    driver_phone_number: '{{#? DRIVER_PHONE_NUMBER}}',
    receiver: '{{#? RECEIVER}}',
    created_date: '{{#? CREATEDDATE}}',
    created_user: '{{#? CREATEDUSER}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    business_name: '{{#? BUSINESSNAME}}',
    request_user: '{{#? REQUESTUSER}}',
    department_request_id: '{{#? DEPARTMENTREQUESTID}}',
    business_request_id: '{{#? BUSINESSREQUESTID}}',
    order_id: '{{#? ORDERID}}',

    total_amount: '{{#? TOTALAMOUNT}}',

    stocks_out_request_detail_id: '{{#? STOCKSOUTREQUESTDETAILID}}',
    product_id: '{{#? PRODUCTID}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    unit_name: '{{#? UNITNAME}}',
    output_type_id: '{{#? OUTPUTTYPEID}}',
    price: '{{#? PRICE}}',
    quantity: '{{#? QUANTITY}}',
    total_price: '{{#? TOTALPRICE}}',
    unit_id: '{{#? UNITID}}',
    net_weight_unit_id: '{{#? NETWEIGHTUNITID}}',
    net_weight: '{{#? NETWEIGHT}}',
    met_a: '{{#? META}}',
    met_b: '{{#? METB}}',
    met_c: '{{#? METC}}',
    density: '{{#? DENSITY}}',
    stocks_address: '{{#? STOCKS_ADDRESS}}',
    stocks_phone_number: '{{#? STOCKS_PHONE_NUMBER}}',
    to_stocks_phone_number: '{{#? TO_STOCKS_PHONE_NUMBER}}',

    is_outputted: '{{ISOUTPUTTED}}',
    is_sell: '{{#? ISSELL ? 1 : 0}}',
    is_transfer: '{{#? ISTRANSFER ? 1 : 0}}',
    is_inventory_control: '{{#? ISINVENTORYCONTROL ? 1 : 0}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    member_id: '{{#? MEMBERID}}',
    full_name: '{{#? FULLNAME}}',
    address_full: '{{#? ADDRESSFULL}}',
    customer_id: '{{#? CUSTOMERID}}',
    is_partner: '{{ISPARTNER}}',
    tolerance_value: '{{#? TOLERANCEVALUE}}',
    product_imei_code: '{{#? PRODUCTIMEICODE}}',
    lot_number: '{{#? LOTNUMBER}}',
    total_net_weight: '{{#? TOTALNETWEIGHT}}',
    total_quantity: '{{#? TOTALQUANTITY}}',
    total_met_a: '{{#? TOTALMETA}}',
    total_met_b: '{{#? TOTALMETB}}',
    total_met_c: '{{#? TOTALMETC}}',
    partner_transport_name: '{{#? PARTNERTRANSPORTNAME}}',
    license_plates: '{{#? LICENSEPLATES}}',
    driver_phone: '{{#? DRIVERPHONE}}',
    print_date: '{{#? PRINTDATE}}',
    transaction_id: '{{#? TRANSACTIONID}}',

    to_address_stocks: '{{#? TOADDRESSSTOCKS}}',
    to_stocks_phone: '{{#? TOSTOCKSPHONE}}',
    stocks_phone: '{{#? STOCKSPHONE}}',
    address_stocks: '{{#? ADDRESSSTOCKS}}',
    customer_full_name: '{{#? CUSTOMERFULLNAME}}',
    customer_phone_number: '{{#? CUSTOMERPHONENUMBER}}',
    company_name: '{{#? COMPANYNAME}}',
    customer_address: '{{#? CUSTOMERADDRESS}}',
    to_stocks_id: '{{#? TOSTOCKSID}}',
    deliver: '{{#? DELIVER}}',
    created_user_id: '{{#? CREATEDUSERID}}',
    created_user_fullname: '{{#? CREATEDUSERFULLNAME}}',
    avg_density: '{{#? AVGDENSITY}}',
    plates: '{{#? PLATES}}',
    lengths: '{{#? LENGTHS}}',
    total_lengths: '{{#? TOTALLENGTHS}}',
    total_plates: '{{#? TOTALPLATES}}',
    description: '{{#? DESCRIPTION}}',
    order_no: '{{#? ORDERNO}}',
    stocks_transfer_code: '{{#? STOCKSTRANSFERCODE}}',
    stocks_take_request_code: '{{#? STOCKSTAKEREQUESTCODE}}',
    customer_delivery_id: '{{#? CUSTOMERDELIVERYID}}',
    customer_delivery_vehicles_name: '{{#? CUSTOMERDELIVERYVEHICLESNAME}}',
    customer_delivery_driver_name: '{{#? CUSTOMERDELIVERYDRIVERNAME}}',
    customer_delivery_phone_number: '{{#? CUSTOMERDELIVERYPHONENUMBER}}',
    import_user_name: '{{#? IMPORTUSERNAME}}',
    import_user: '{{#? IMPORTUSER}}',
    note: '{{#? NOTE}}',
    product_type_id: '{{#? PRODUCTTYPEID}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    is_cancel_order: '{{ISCANCELORDER ? 1 : 0}}',
    max_met_a: '{{MAXMETA ? MAXMETA : 0}}',
    max_met_b: '{{MAXMETB ? MAXMETB : 0}}',
    max_met_c: '{{MAXMETC ? MAXMETC : 0}}',
    max_net_weight: '{{MAXNETWEIGHT ? MAXNETWEIGHT : 0}}',
    max_quantity: '{{MAXQUANTITY ? MAXQUANTITY : 0}}',
    export_user: '{{#? EXPORTUSER}}',
    export_user_full_name: '{{#? EXPORTUSERFULLNAME}}',
    order_detail_id: '{{#? ORDERDETAILID}}',

    from_store_id: '{{#? FROMSTOREID}}',
    from_store_name: '{{#? FROMSTORENAME}}',
    to_store_id: '{{#? TOSTOREID}}',
    to_store_name: '{{#? TOSTORENAME}}',

    is_promotion_gift: '{{ISPROMOTIONGIFT ? 1 : 0}}',
    is_edit_after_review: '{{ISEDITAFTERREVIEW ? 1 : 0}}',
    combo_id: '{{#? COMBOID}}',
    is_combo: '{{ISCOMBO ? 1 : 0}}',
    ref_product_gift_id: '{{#? REFPRODUCTGIFTID}}',
    combo_name: '{{#? COMBONAME}}',
    combo_code: '{{#? COMBOCODE}}',
    quantity_combo: '{{#? QUANTITYCOMBO}}', // ISINSTOCKS
    is_in_stocks: '{{ISINSTOCKS ? 1 : 0}}',
    lot_number: '{{#? LOTNUMBER}}',
    request_code: '{{#? REQUESTCODE}}',
    create_date: '{{#? CREATEDATEVIEW}}',

    component_id: '{{#? COMPONENTID}}',
    component_name: '{{#? COMPONENTNAME}}',
    component_code: '{{#? COMPONENTCODE}}',
    component_imei_code: '{{#? COMPONENTIMEICODE}}',

    debt_account_id: '{{#? DEBTACCOUNTID}}',
    credit_account_id: '{{#? CREDITACCOUNTID}}',

    manufacturer_id: '{{#? MANUFACTURERID}}',
    supplier_id: '{{#? SUPPLIERID}}',

    request_user_fullname: '{{#? REQUESTUSERFULLNAME}}',

    material_id: '{{#? MATERIALID}}',
    material_name: '{{#? MATERIALNAME}}',
    material_code: '{{#? MATERIALCODE}}',
    material_imei_code: '{{#? MATERIALIMEICODE}}',

    contract_number: '{{#? CONTRACTNUMBER}}',
    transport_partner: '{{#? TRANSPORTPARTNER}}',
    transport_user: '{{#? TRANSPORTUSER}}',
    transport_vehicle: '{{#? TRANSPORTVEHICLE}}',
    transfer_type: '{{TRANSFERTYPE ? TRANSFERTYPE : 0 }}',
    type_stock_out: '{{#? STOCKSOUTTYPE}}',
    is_auto_review: '{{ ISAUTOREVIEW ? 1 : 0}}',

    purchase_user: '{{#? PURCHASEUSER}}',
    user_receiver: '{{#? USERRECEIVER}}',
    address_receiver: '{{#? ADDRESSRECEIVER}}',
    is_returned_stocks: '{{ ISRETURNEDSTOCKS ? 1 : 0}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'from_stocks_name',
        'from_stocks_address',
        'to_stocks_name',
        'to_stocks_address',
        'stocks_out_request_id',
        'stocks_out_request_code',
        'hidden_price',
        'stocks_out_request_date',
        'transaction_id',
        'stocks_out_type_id',
        'stocks_out_type_name',
        'transfer_type',
        'department_request_id',
        'receiver',
        'business_request_id',
        'stocks_id',
        'request_user',
        'import_user_name',
        'import_user',
        'request_user_fullname',
        'phone_number',
        'receiver_full_address',
        'created_user',
        'is_outputted',
        'total_amount',
        'stocks_name',
        'stocks_address',
        'stocks_phone_number',
        'to_stocks_phone_number',
        'customer_id',
        'to_address_stocks',
        'to_stocks_phone',
        'address_stocks',
        'stocks_phone',
        'customer_full_name',
        'customer_phone_number',
        'customer_address',
        'to_stocks_id',
        'created_user_id',
        'created_user_fullname',
        'description',
        'stocks_transfer_code',
        'stocks_take_request_code',
        'export_user',
        'export_user_full_name',
        'is_sell',
        'is_transfer',
        'member_id',
        'customer_full_name',
        'manufacturer_id',
        'from_stocks_id',
        'from_store_id',
        'from_store_name',
        'to_store_id',
        'to_store_name',
        'note',
        'request_code',
        'is_edit_after_review',
        'stocks_address',
        'com',
        'contract_number',
        'transport_partner',
        'transport_user',
        'transport_vehicle',
        'type_stock_out',
        'is_auto_review',
        'purchase_user',
        'user_receiver',
        'address_receiver',
        'is_returned_stocks',
        'supplier_id',
        'order_id'
    ]);
};

const printData = (data) => {
    const template = {
        stocks_out_request_code: '{{#? STOCKSOUTREQUESTCODE}}',
        stocks_out_request_date: '{{#? STOCKSOUTREQUESTDATE}}',
        request_code: '{{#? REQUESTCODE}}',
        customer_full_name: '{{#? CUSTOMERFULLNAME}}',
        custoemr_phone_number: '{{#? CUSTOMERPHONENUMBER }}',
        customer_address: '{{#? CUSTOMERADDRESS }}',
        from_store_name: '{{#? FROMSTORENAME }}',
        contract_number: '{{#? CONTRACTNUMBER }}',
        transport_partner: '{{#? TRANSPORTPARTNER }}',
        transport_user: '{{#? TRANSPORTUSER }}',
        transport_vehicle: '{{#? TRANSPORTVEHICLE }}',
        from_stocks_id: '{{#? FROMSTOCKSID }}',
        stocks_address: '{{#? STOCKSADDRESS }}',
        stocks_name: '{{#? STOCKSNAME }}',
        to_stocks_name: '{{#? TOSTOCKSNAME }}',
        to_stocks_address: '{{#? TOSTOCKSADDRESS }}',
        export_date: '{{#? EXPORTDATE }}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

const maxId = (user) => {
    return transform.transform(user, ['max_id']);
};

const list = (users = []) => {
    return transform.transform(users, [
        'stocks_out_request_id',
        'stocks_out_request_code',
        'request_code',
        'stocks_id',
        'stocks_name',
        'stocks_out_type_id',
        'stocks_out_type_name',
        'stocks_status_id',
        'stocks_status_name',
        'created_date',
        'created_user',
        'is_outputted',
        'is_sell',
        'is_transfer',
        'is_inventory_control',
        'order_no',
        'customer_name',
        'is_cancel_order',
        'transfer_type',
    ]);
};

const listStocksOutType = (users = []) => {
    return transform.transform(users, ['stocks_out_type_id', 'stocks_out_type_name']);
};

const listDetail = (users = []) => {
    return transform.transform(users, [
        'stocks_out_request_detail_id',
        'stocks_out_request_id',
        'product_id',
        'output_type_id',
        'quantity',
        'price',
        'total_price',
        'unit_id',
        'net_weight_unit_id',
        'net_weight',
        'density',
        'product_code',
        'product_name',
        'unit_name',
    ]);
};

const listAll = (users = []) => {
    return transform.transform(users, ['id', 'name', 'is_transfer', 'is_sell', 'is_inventory_control']);
};

const genDataStocksOutType = (area) => {
    return transform.transform(area, ['stocks_out_type_id', 'is_transfer', 'is_sell', 'is_inventory_control']);
};

const getStocksManager = (area) => {
    return transform.transform(area, ['id', 'name', 'address']);
};

const getListCustomer = (area) => {
    return transform.transform(area, ['customer_id', 'is_partner', 'full_name', 'address_full', 'phone_number']);
};

const phoneNumber = (area) => {
    return transform.transform(area, ['driver_id', 'phone_number']);
};
const genStocksOutRequestCode = (area) => {
    return transform.transform(area, ['stocks_out_request_code']);
};

const genProductName = (area) => {
    return transform.transform(area, ['product_id', 'product_name', 'product_code', 'tolerance_value']);
};
const listProductDensityUnit = (area) => {
    return transform.transform(area, [
        'product_id',
        'product_subunit_id',
        'subunit_id',
        'unit_name',
        'unit_id',
        'density_value',
        'unit_subname',
        'description',
    ]);
};

const listProductDetail = (user) => {
    return transform.transform(user, [
        'stocks_in_request_id',
        'stocks_in_detail_id',
        'product_id',
        'product_name',
        'product_code',
        'product_imei_code',

        'debt_account_id',
        'credit_account_id',

        'material_id',
        'material_name',
        'material_code',
        'material_imei_code',

        'price',
        'total_price',
        'unit_id',
        'quantity',
        'unit_name',
        'total_number',
        'lot_number',

        'note',
        'create_date',

        'stocks_name'
    ]);
};

const listProductDetailPrint = (user) => {
    return transform.transform(user, [
        'stocks_in_request_id',
        'stocks_in_detail_id',
        'product_id',
        'product_name',
        'product_code',
        'net_weight',
        'net_weight_unit_id',
        'price',
        'total_price',
        'unit_id',
        'quantity',
        'density',
        'total_product_cost',
        'cost_per_quantity',
        'net_weight_unit_name',
        'unit_name',
        'total_number',
        'product_imei_code',
        'lot_number',
        'sum_net_weight',
        'sum_quantity',
        'sum_met_a',
        'sum_met_b',
        'sum_met_c',
        'total_net_weight',
        'total_quantity',
        'total_met_a',
        'total_met_b',
        'total_met_c',
        'avg_density',
        'tolerance_value',
        'total_price',
        'output_type_id',
        'plates',
        'lengths',
        'total_lengths',
        'total_plates',
        'note',
        'stocks_name',
    ]);
};

const detailList = (user) => {
    return transform.transform(user, [
        'stocks_in_request_id',
        'stocks_in_date',
        'stocks_in_code',
        'is_imported',
        'status_imported',
        'purchase_order_code',
        'department_request_id',
        'business_request_id',
        'request_user',
        'supplier_id',
        'manufacture_id',
        'manufacture_name',
        'stocks_id',
        'receiver_name',
        'lot_number',
        'description',
        'partner_transport_id',
        'partner_transport_name',
        'vehicles_name',
        'driver_name',
        'stocks_in_type_id',
        'stocks_in_type_name',
        'order_no',
        'total_amount',
        'from_stocks_id',
        'sender_name',
        'cost_allocation_type',
        'created_date',
        'print_date',
        'stocks_name',
        'address',
        'phone_number',
        'address_stocks',
        'stocks_phone',
        'driver_phone',
        'license_plates',
        'from_stocks_name',
        'from_address_stocks',
        'from_stocks_phone',
    ]);
};

const getPriceCost = (product) => {
    let transform = new Transform(template);
    return transform.transform(product, ['product_id', 'unit_id', 'output_type_id', 'price']);
};

const listProductImei = (user) => {
    return transform.transform(user, [
        'stocks_in_request_id',
        'product_id',
        'product_name',
        'product_code',
        'unit_id',
        'quantity',

        'material_id',
        'material_name',
        'material_code',
        'material_imei_code',

        'total_product_cost',
        'cost_per_quantity',
        'net_weight_unit_name',
        'unit_name',
        'total_number',
        'product_imei_code',
        'lot_number',
        'created_date',
        // "sum_net_weight",
    ]);
};

const templateOption = {
    id: '{{#? STOCKSID}}',
    name: '{{#? STOCKSNAME}}',
    is_component: '{{ISCOMPONENT ? 1 : 0}}',
};
const option = (stocks = []) => {
    let transform = new Transform(templateOption);
    return transform.transform(stocks, ['id', 'name', 'is_component']);
};

const productOptions = (options = []) => {
    const templateOption = {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',

        material_id: '{{#? MATERIALID}}',
        material_name: '{{#? MATERIALNAME}}',
        material_code: '{{#? MATERIALCODE}}',
        debt_account_id: '{{#? ACCOUNTINGACCOUNTID}}',

        unit_name: '{{#? UNITNAME}}',

        total_product: '{{#? TOTAL}}',
        is_combo: '{{ISCOMBO ? 1 : 0}}',
    };
    let transform = new Transform(templateOption);
    return transform.transform(options, [
        'product_id',
        'product_name',
        'product_code',
        'material_id',
        'material_name',
        'material_code',
        'total_product',
        'unit_name',
        'debt_account_id',
    ]);
};

const unitOptions = (options = []) => {
    const templateOption = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        product_id: '{{#? PRODUCTID}}',
    };
    let transform = new Transform(templateOption);
    return transform.transform(options, ['id', 'name', 'product_id']);
};

const stocksOutRequestPrint = (order) => {
    const transform = new Transform({
        customer_name: '{{#? CUSTOMERFULLNAME}}',
        customer_address: '{{#? CUSTOMERADDRESS}}',
        print_date: '{{#? PRINTDATE}}',
        note: '{{#? DESCRIPTION}}',
        stocks_out_request_no: '{{#? STOCKSOUTREQUESTCODE}}',
        stocks_name: '{{#? STOCKSNAME}}',
        stocks_address: '{{#? ADDRESSSTOCKS}}',
        total_price_text: '{{#? TOTALPRICETEXT}}',
        total_price: '{{#? TOTALPRICE}}',
        company_name: '{{#? COMPANYNAME}}',
        business_address_full: '{{#? BUSINESSADDRESSFULL}}',
    });
    return transform.transform(order, [
        'customer_name',
        'customer_address',
        'print_date',
        'note',
        'stocks_out_request_no',
        'stocks_name',
        'stocks_address',
        'total_price',
        'total_price_text',
        'company_name',
        'business_address_full',
    ]);
};

const stocksOutRequestDetailPrint = (order) => {
    const transform = new Transform({
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        unit_name: '{{#? UNITNAME}}',
        quantity: '{{#? QUANTITY}}',
        request_quantity: '{{#? REQUESTQUANTITY}}',
        price: '{{#? PRICE}}',
        total_price: '{{#? TOTALPRICE}}',
        row_index: '{{#? ROWINDEX}}',
        product_id: '{{#? PRODUCTID}}',
    });
    return transform.transform(order, [
        'product_name',
        'product_code',
        'unit_name',
        'quantity',
        'request_quantity',
        'price',
        'total_price',
        'row_index',
        'product_id',
    ]);
};

const detailCustomer = (data) => {
    return data && Object.keys(data).length > 0
        ? transform.transform(data, ['customer_id', 'is_partner', 'full_name', 'address_full', 'phone_number'])
        : null;
};

const getListReviewLevelByStocksOutypeId = (order) => {
    const transform = new Transform({
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        stocks_review_level_name: '{{#? STOCKSREVIEWLEVELNAME}}',
        is_auto_reviewed: '{{#? ISAUTOREVIEWED}}',
        is_completed_reviewed: '{{#? ISCOMPLETEDREVIEWED}}',
    });
    return transform.transform(order, [
        'stocks_review_level_id',
        'stocks_review_level_name',
        'is_auto_reviewed',
        'is_completed_reviewed',
    ]);
};

const getListUserReviewLevelByStocksOutypeId = (order) => {
    const transform = new Transform({
        full_name: '{{#? FULLNAME}}',
        user_name: '{{#? USERNAME}}',
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        stocks_out_review_list_id: '{{#? STOCKSOUTREVIEWLISTID}}',
        is_reviewed: '{{#? ISREVIEWED}}',
        note: '{{#? NOTE}}',
        description: '{{#? DESCRIPTION}}',
    });
    return transform.transform(order, [
        'full_name',
        'user_name',
        'stocks_review_level_id',
        'stocks_out_review_list_id',
        'is_reviewed',
        'note',
        'description',
    ]);
};

const stocksOutTypeList = (order) => {
    const transform = new Transform({
        stocks_out_type_id: '{{#? STOCKSOUTTYPEID}}',
        stocks_out_type_name: '{{#? STOCKSOUTTYPENAME}}',
        is_auto_review: '{{#? ISAUTOREVIEW}}',
        is_transfer: '{{#? ISTRANSFER}}',
        is_sell: '{{#? ISSELL}}',
        is_inventory_control: '{{#? ISINVENTORYCONTROL}}',
        is_warranty: '{{#? ISWARRANTY}}',
        is_internal: '{{#? ISINTERNAL}}',
        is_exchange_goods: '{{#? ISEXCHANGEGOODS}}',
        is_destroy: '{{#? ISDESTROY}}',
        is_return_supplier: '{{#? ISRETURNSUPPLIER}}',
        is_dissassemble_electronics_component: '{{#? ISDISASSEMBLEELECTRONICSCOMPONENT}}',
        type: '{{#? STOCKSOUTTYPE}}',
        is_company: '{{#? ISCOMPANY}}',
    });
    return transform.transform(order, [
        'stocks_out_type_id',
        'stocks_out_type_name',
        'is_auto_review',
        'is_transfer',
        'is_sell',
        'is_inventory_control',
        'is_warranty',
        'is_internal',
        'is_exchange_goods',
        'is_destroy',
        'is_return_supplier',
        'is_dissassemble_electronics_component',
        'is_company',
        'type',
    ]);
};

const customerListDeboune = (order) => {
    const transform = new Transform({
        member_id: '{{#? MEMBERID}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        address_full: '{{#? ADDRESSFULL}}',
        phone_number: '{{#? PHONENUMBER}}',
    });
    return transform.transform(order, ['member_id', 'user_name', 'full_name', 'address_full', 'phone_number']);
};

const listReviewGetList = (data) => {
    const transform = new Transform({
        stocks_out_request_id: '{{#? STOCKSOUTREQUESTID}}',
        stocks_out_review_list_id: '{{#? STOCKSOUTREVIEWLISTID}}',
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        avatar_url: [
            {
                '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
        is_reviewed: '{{#? ISREVIEWED}}',
    });
    return transform.transform(data, [
        'stocks_out_request_id',
        'stocks_out_review_list_id',
        'user_name',
        'full_name',
        'avatar_url',
        'is_reviewed',
        'stocks_review_level_id',
    ]);
};

const createUserList = (order) => {
    const transform = new Transform({
        user_name: '{{#? CREATEDUSER}}',
        full_name: '{{#? FULLNAME}}',
    });
    return transform.transform(order, ['user_name', 'full_name']);
};

const optionsOrdersDetail = (order) => {
    return transform.transform(order, [
        'order_id',
        'order_detail_id',
        'product_id',
        'product_code',
        'product_name',
        'unit_id',
        'unit_name',
        'quantity',
    ]);
};

const optionsOrders = (order) => {
    const transform = new Transform({
        business_id: '{{#? BUSINESSID}}',
        from_stocks_id: '{{#? STOCKSID}}',
        member_id: '{{#? MEMBERID}}',
        from_store_id: '{{#? STOREID}}',
        from_store_name: '{{#? STORENAME}}',
        customer_full_name: '{{#? FULLNAME}}',
        customer_address: '{{#? ADDRESSFULL}}',
        customer_phone_number: '{{#? PHONENUMBER}}',
    });
    return transform.transform(order, [
        'business_id',
        'from_store_id',
        'from_store_name',
        'from_stocks_id',
        'member_id',
        'customer_full_name',
        'customer_address',
        'customer_phone_number',
    ]);
};

const listStock = (data) => transform.transform(data, ['order_detail_id', 'stocks_id']);

const varibleImage = {
    image_url: [
        {
            '{{#if IMAGEURL}}': `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
};

const transformImage = (image = []) => {
    const transform = new Transform(varibleImage);
    const keyObjectSt = Object.getOwnPropertyNames(varibleImage) ?? [];
    return transform.transform(image, keyObjectSt);
};

module.exports = {
    detail,
    maxId,
    list,
    listStocksOutType,
    listDetail,
    listAll,
    genDataStocksOutType,
    getStocksManager,
    getListCustomer,
    phoneNumber,
    genStocksOutRequestCode,
    genProductName,
    listProductDensityUnit,
    listProductDetail,
    detailList,
    getPriceCost,
    listProductDetailPrint,
    option,
    productOptions,
    unitOptions,
    stocksOutRequestDetailPrint,
    stocksOutRequestPrint,
    detailCustomer,
    listProductImei,
    getListReviewLevelByStocksOutypeId,
    getListUserReviewLevelByStocksOutypeId,
    stocksOutTypeList,
    customerListDeboune,
    listReviewGetList,
    createUserList,
    optionsOrdersDetail,
    optionsOrders,
    listStock,
    printData,
    transformImage,
};
