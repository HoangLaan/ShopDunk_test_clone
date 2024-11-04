const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
    stocks_in_date: '{{#? STOCKSINDATE}}',
    stocks_in_code: '{{#? STOCKSINCODE}}',
    is_imported: '{{ISIMPORTED ? 1 : 0}}',
    department_request_id: '{{#? DEPARTMENTREQUESTID}}',
    business_request_id: '{{#? BUSINESSREQUESTID}}',
    request_user: '{{#? REQUESTUSER}}',
    supplier_id: '{{#? SUPPLIERID * 1}}',
    manufacture_id: '{{#? MANUFACTUREID}}',
    manufacture_name: '{{#? MANUFACTURENAME}}',
    stocks_id: '{{#? STOCKSID * 1}}',
    receiver_name: '{{#? RECEIVERNAME}}',
    lot_number: '{{#? LOTNUMBER}}',
    description: '{{#? DESCRIPTION}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    stocks_in_request_type: '{{#? STOCKSINREQUESTTYPE}}',
    is_transfer: '{{ISTRANSFER ? 1 : 0}}',
    is_purchase: '{{ISPURCHASE ? 1 : 0}}',
    is_inventory_control: '{{ISINVENTORYCONTROL ? 1 : 0}}',
    is_exchange_goods: '{{ ISEXCHANGEGOODS ? 1 : 0}}',
    is_warranty: '{{ ISWARRANTY ? 1 : 0}}',
    is_disassemble_component: '{{ ISDISASSEMBLEELECTRONICSCOMPONENT ? 1 : 0}}',
    is_internal: '{{ISINTERNAL ? 1 : 0}}',
    stocks_in_type_id: '{{#? STOCKSINTYPEID * 1}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    address: '{{#? ADDRESSFULL}}',
    driver_id: '{{#? DRIVERID}}',
    phone_number: '{{#? PHONENUMBER}}',
    stocks_in_type_name: '{{#? STOCKSINTYPENAME}}',
    stocks_name: '{{#? STOCKSNAME}}',
    stocks_in_request_status: '{{#? STOCKSINREQUESTSTATUS}}',
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    net_weight: '{{#? NETWEIGHT}}',
    net_weight_unit_id: '{{#? NETWEIGHTUNITID}}',
    cost_price: '{{#? COSTPRICE}}',
    total_price: '{{#? TOTALPRICE}}',
    unit_id: '{{#? UNITID}}',
    quantity: '{{#? QUANTITY}}',
    met_a: '{{#? META}}',
    met_b: '{{#? METB}}',
    met_c: '{{#? METC}}',
    total_product_cost: '{{#? TOTALPRODUCTCOST}}',
    cost_per_quantity: '{{#? COSTPERQUANTITY}}',
    cost_id: '{{#? COSTID}}',
    is_input_values: '{{ ISINPUTVALUES ? 1 : 0}}',
    is_percent: '{{ ISPERCENT ? 1 : 0}}',
    percent_value: '{{#? PERCENTVALUE}}',
    total_amount: '{{#? TOTALAMOUNT}}',
    from_stocks_id: '{{#? FROMSTOCKSID}}',
    sender_name: '{{#? SENDERNAME}}',
    stocks_in_cost_id: '{{#? STOCKSINCOSTID}}',
    cost_value: '{{#? COSTVALUE}}',
    cost_name: '{{#? COSTNAME}}',
    label: '{{#? LABEL}}',
    value: '{{#? VALUE}}',
    density: '{{#? DENSITY}}',
    total_cost: '{{#? TOTALCOST}}',
    cost_allocation_type: '{{#? COSTALLOCATIONTYPE}}',
    product_code: '{{#? PRODUCTCODE}}',
    print_date: '{{#? PRINTDATE}}',
    address_stocks: '{{#? ADDRESSSTOCKS}}',
    stocks_phone: '{{#? STOCKSPHONE}}',
    driver_phone: '{{#? DRIVERPHONE}}',
    license_plates: '{{#? LICENSEPLATES}}',
    from_stocks_name: '{{#? FROMSTOCKSNAME}}',
    from_address_stocks: '{{#? FROMADDRESSSTOCKS}}',
    debt_account_id: '{{#? DEBTACCOUNTID}}',
    credit_account_id: '{{#? CREDITACCOUNTID}}',
    from_stocks_phone: '{{#? FROMSTOCKSPHONE}}',
    unit_name: '{{#? UNITNAME}}',
    product_subunit_id: '{{#? PRODUCTSUBUNITID}}',
    subunit_id: '{{#? SUBUNITID}}',
    unit_subname: '{{#? UNITSUBNAME}}',
    density_value: '{{#? DENSITYVALUE}}',
    total_number: '{{#? TOTALNUMBER}}',
    product_imei_code: '{{#? PRODUCTIMEICODE}}',
    tolerance_value: '{{TOLERANCEVALUE}}',
    total_quantity: '{{#? TOTALQUANTITY}}',
    status_imported: '{{#? STATUSIMPORTED}}',
    created_user_id: '{{#? CREATEDUSER}}',
    created_user_fullname: '{{#? FULLNAME}}',
    is_unit: '{{ ISUNIT ? 1 : 0}}',
    total_price_cost: '{{TOTALPRICECOST}}',
    total_cost_value: '{{TOTALCOSTVALUE}}',
    price_avg: '{{PRICEAVG}}',
    price_cost_avg: '{{PRICECOSTAVG}}',
    price_imei_code: '{{PRICEIMEICODE}}',
    is_discount: '{{ISDISCOUNT  ? 1 : 0}}',
    is_value_by_time: '{{ISVALUEBYTIME  ? 1 : 0}}',
    time_type: '{{#? TIMETYPE}}',
    discount_value: '{{#? DISCOUNTVALUE}}',
    total_cost_basic_imei: '{{#? TOTALCOSTBASICIMEI}}',
    cost_basic_imei_code: '{{#? COSTBASICIMEICODE}}',
    is_outputed: '{{ISOUTPUTTED ? 1 : 0}}',
    is_unit_price: '{{ISUNITPRICE  ? 1 : 0}}',
    cost_product_imei_code_id: '{{#? COSTPRODUCTIMEICODEID}}',
    is_apply: '{{ISAPPLY  ? 1 : 0}}',
    product_type_id: '{{#? PRODUCTTYPEID}}',
    note: '{{#? NOTE}}',
    stocks_in_detail_id: '{{#? STOCKSINDETAILID}}',
    default_density: '{{#? DEFAULTDENSITY}}',
    is_discount_bc: '{{ISDISCOUNTBC  ? 1 : 0}}',
    manufacture_apply_discountbc: '{{#? MANUFACTUREAPPLYDISCOUNTBC}}',
    name_manufacture: '{{#? NAMEMANUFACTURE}}',
    name_manufacture_slug: '{{#? NAMEMANUFACTURESLUG}}',
    mn_discount_met_a: '{{META ? META : 0}}',
    mn_discount_met_b: '{{METB ? METB : 0}}',
    mn_discount_met_c: '{{METC ? METC : 0}}',
    is_apply_density: '{{ISAPPLYDENSITY  ? 1 : 0}}',
    manufacturer_apply_density: '{{#? MANUFACTURERAPPLYDENSITY}}',
    is_apply_unit_price: '{{ISAPPLYUNITPRICE  ? 1 : 0}}',
    base_unit_id: '{{#? BASEUNITID}}',
    base_unit_name: '{{#? BASEUNITNAME}}',
    cost_price: '{{#? COSTPRICE}}',
    row_index: '{{#? ROWINDEX}}',
    is_reviewed: '{{ISREVIEWED? ISREVIEWED: 0}}',
    stocks_take_request_code: '{{#? STOCKSTAKEREQUESTCODE}}',
    purchase_order_code: '{{#? PURCHASEORDERCODE}}',
    stocks_transfer_code: '{{#? STOCKSTRANSFERCODE}}',
    order_no: '{{#? ORDERNO}}',
    request_code: '{{#? REQUESTCODE}}',
    divide_component_code: '{{#? DIVIDECOMPONENTCODE}}',
    status_reviewed: '{{STATUSREVIEWED? STATUSREVIEWED: 0}}',
    member_id: '{{#? MEMBERID}}',
    member_name: '{{#? MEMBERNAME}}',
    is_component: '{{ISCOMPONENT? 1 : 0}}',
    is_material: '{{ISMATERIAL ? 1 : 0}}',
    store_id: '{{#? STOREID}}',
    is_auto_review: '{{ ISAUTOREVIEW ? 1 : 0}}',
    product_picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    cost_allocation_id: '{{#? COSTALLOCATIONID}}',
    total_cost_price: '{{#? VALUEBASEDCA}}',
    total_cost_st_request_price: '{{#? VOLUMECA}}',
    expected_date: '{{#? EXPECTEDDATE}}',
    purchase_order_detail_id: '{{#? PURCHASEORDERDETAILID}}',
    is_auto_gen_imei: '{{ISAUTOGENIMEI ? 1 : 0}}',
    stocks_type_id: '{{#? STOCKTYPEID}}',
    purchase_order_id: '{{#? PURCHASEORDERID}}',
    tax_account_id: '{{#? TAXACCOUNTID}}',
    vat_value: '{{ VATVALUE ? VATVALUE : 0}}',
    accounting_id: '{{#? ACCOUNTINGID}}',
    customer_type: '{{#? CUSTOMERTYPE}}',
    is_odd_customer: '{{ISODDCUSTOMER ? 1 : 0}}',
    supplier_name: '{{#? SUPPLIERNAME}}',
};

const templateDiscount = {
    discount_met_a: '{{DISCOUNTMETA}}',
    discount_met_b: '{{DISCOUNTMETB}}',
    discount_met_c: '{{DISCOUNTMETC}}',
};
let transform = new Transform(template);
let transformDiscount = new Transform(templateDiscount);

const list = (users = []) => {
    return transform.transform(users, [
        'stocks_in_request_id',
        'stocks_in_request_name',
        'created_date',
        'created_user',
        'is_deleted',
        'stocks_in_request_type',
        'stocks_in_type_name',
        'stocks_name',
        'stocks_in_code',
        'stocks_in_request_status',
        'stocks_in_type_id',
        'is_reviewed',
        'request_code',
        'status_reviewed',
        'is_imported',
        'supplier_name',
        'stocks_in_date',
        'purchase_order_id'
    ]);
};

const getStocksManager = (area) => {
    return transform.transform(area, ['id', 'name', 'address']);
};

const listAll = (area) => {
    return transform.transform(area, ['id', 'name']);
};

const listUnitFull = (area) => {
    return transform.transform(area, ['id', 'name', 'is_unit']);
};

const detail = (user) => {
    return transform.transform(user, [
        'stocks_in_request_id',
        'stocks_in_date',
        'stocks_in_code',
        'created_user_id',
        //'created_user_fullname',
        'created_user',
        'is_imported',
        'status_imported',
        'purchase_order_code',
        'department_request_id',
        'business_request_id',
        'request_user',
        'supplier_id',
        //'manufacture_id',
        //'manufacture_name',
        'stocks_id',
        'receiver_name',
        'lot_number',
        'description',
        'stocks_in_type_id',
        'stocks_in_type_name',
        'order_no',
        'total_amount',
        'from_stocks_id',
        'sender_name',
        //'cost_allocation_type',
        'created_date',
        'print_date',
        'stocks_name',
        'address',
        'phone_number',
        'address_stocks',
        'stocks_phone',
        'license_plates',
        'from_stocks_name',
        'from_address_stocks',
        'from_stocks_phone',
        'stocks_transfer_code',
        'is_unit_price',
        'is_deleted',
        'cost_per_quantity',
        'is_apply_unit_price',
        'request_code',
        'is_reviewed',
        'member_id',
        'member_name',
        'status_reviewed',
        'store_id',
        'is_auto_review',
        'stocks_type_id',
        'purchase_order_id',
        'customer_type',
        'is_odd_customer',
    ]);
};

const listProductDetail = (user) => {
    return transform.transform(user, [
        'stocks_in_request_id',
        'stocks_in_detail_id',
        'product_id',
        'product_name',
        'product_code',
        'cost_price',
        'total_price',
        'unit_id',
        'debt_account_id',
        'credit_account_id',
        'quantity',
        'total_product_cost',
        'cost_per_quantity',
        'unit_name',
        'total_number',
        'product_imei_code',
        'lot_number',
        'total_amount',
        'total_price_cost',
        'total_cost_value',
        'price_imei_code',
        'cost_basic_imei_code',
        'total_cost_basic_imei',
        'product_type_id',
        'note',
        'is_component',
        'stocks_in_date',
        'stocks_in_code',
        'product_picture_url',
        'is_material',
        'cost_allocation_id',
        'total_cost_price',
        'total_cost_st_request_price',
        'expected_date',
        'purchase_order_detail_id',
        'is_auto_gen_imei',
        'tax_account_id',
        'vat_value',
        'accounting_id',
    ]);
};

const genDataStocksInType = (area) => {
    return transform.transform(area, [
        'stocks_in_type_id',
        'is_transfer',
        'is_purchase',
        'is_exchange_goods',
        'is_inventory_control',
        'is_warranty',
        'is_disassemble_component',
        'is_internal',
    ]);
};

const genCostValue = (area) => {
    return transform.transform(area, [
        'cost_id',
        'cost_name',
        'description',
        'is_input_values',
        'is_percent',
        'percent_value',
        'is_discount',
        'is_value_by_time',
        'time_type',
    ]);
};

const phoneNumber = (area) => {
    return transform.transform(area, ['driver_id', 'phone_number']);
};

const genStocksInCode = (area) => {
    return transform.transform(area, ['stocks_in_code']);
};

const genProductName = (area) => {
    return transform.transform(area, [
        'product_id',
        'product_name',
        'product_code',
        'tolerance_value',
        'manufacture_id',
        'is_apply_density',
    ]);
};

const costTypetList = (area) => {
    return transform.transform(area, [
        'stocks_in_cost_id',
        'value',
        'label',
        'cost_value',
        'stocks_in_request_id',
        'total_cost',
        'discount_value',
        'is_discount',
        'is_percent',
        'is_apply',
    ]);
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

const genLotNumber = (area) => {
    return transform.transform(area, ['lot_number']);
};

const getDiscount = (area) => {
    return transformDiscount.transform(area, ['discount_met_a', 'discount_met_b', 'discount_met_c']);
};

const statusOutput = (area) => {
    return transform.transform(area, ['is_outputed']);
};

const dataUnitPrice = (area) => {
    return transform.transform(area, [
        'stocks_in_cost_id',
        'value',
        'label',
        'cost_value',
        'stocks_in_request_id',
        'stocks_in_detail_id',
        'discount_value',
        'is_discount',
        'is_percent',
        'cost_product_imei_code_id',
        'is_apply',
        'product_imei_code',
    ]);
};

const densityValue = (area) => {
    return transform.transform(area, [
        'subunit_id',
        'product_id',
        'product_sub_unit_id',
        'density_value',
        'unit_subname',
        'unit_id',
        'unit_name',
    ]);
};

const productExcel = (products) => {
    return transform.transform(products, [
        'product_id',
        'product_name',
        'product_code',
        'unit_id',
        'unit_name',
        'base_unit_id',
        'base_unit_name',
        'vat_value',
    ]);
};

const productUnitExcel = (unit = []) => {
    let transform = new Transform({
        id: '{{#? UNITID}}',
        name: '{{#? UNITNAME}}',
        slug: '{{#? UNITNAMESLUG}}',
    });
    return transform.transform(unit, ['id', 'name', 'slug']);
};

const productTypeExcel = (type = []) => {
    let transform = new Transform({
        id: '{{#? PRODUCTTYPEID}}',
        name: '{{#? PRODUCTTYPENAME}}',
    });
    return transform.transform(type, ['id', 'name']);
};

// NEW STOCKSINREQUEST
const productOptions = (unit = []) => {
    let transform = new Transform({
        id: '{{#? PRODUCTID}}',
        name: '{{#? NAME}}',
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        unit_id: '{{#? UNITID}}',
        unit_name: '{{#? UNITNAME}}',
        is_material: '{{ISMATERIAL ? 1 : 0}}',
        debt_account_id: '{{#? ACCOUNTINGACCOUNTID}}',
        category_name: '{{CATEGORYNAME === "0" ? "" : CATEGORYNAME}}',
        manufacture_name: '{{#? MANUFACTURERNAME}}',
        vat_value: '{{VAT ? VAT : 0}}',
    });
    return transform.transform(unit, [
        'id',
        'name',
        'product_code',
        'product_name',
        'unit_name',
        'unit_id',
        'is_material',
        'category_name',
        'manufacture_name',
        'debt_account_id',
        'vat_value',
    ]);
};

const productUnit = (unit) => {
    let transform = new Transform({
        id: '{{#? UNITID}}',
        name: '{{#? UNITNAME}}',
        unit_id: '{{#? UNITID}}',
        unit_name: '{{#? UNITNAME}}',
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
    });
    return transform.transform(unit, [
        'id',
        'name',
        'unit_id',
        'unit_name',
        'product_id',
        'product_code',
        'product_name',
    ]);
};

const productUnitDensity = (unit) => {
    let transform = new Transform({
        sub_unit_id: '{{#? SUBUNITID}}',
        sub_unit_name: '{{#? SUBUNITNAME}}',
        main_unit_id: '{{#? MAINUNITID}}',
        main_unit_name: '{{#? MAINUNITNAME}}',
        density_value: '{{ DENSITYVALUE ? DENSITYVALUE : 0}}',
        id: '{{#? PRODUCTSUBUNITID}}',
        _k: '{{#? PRODUCTSUBUNITID}}',
    });
    return transform.transform(unit, [
        'sub_unit_id',
        'sub_unit_name',
        'main_unit_id',
        'main_unit_name',
        'density_value',
        'id',
        '_k',
    ]);
};

const stocksInTypeOptions = (stitype = []) => {
    let transform = new Transform({
        id: '{{#? STOCKSINTYPEID}}',
        name: '{{#? STOCKSINTYPENAME}}',
        is_transfer: '{{ ISTRANSFER ? 1 : 0}}',
        is_exchange_goods: '{{ ISEXCHANGEGOODS ? 1 : 0}}',
        is_purchase: '{{ ISPURCHASE ? 1 : 0}}',
        is_inventory_control: '{{ ISINVENTORYCONTROL ? 1 : 0}}',
        is_warranty: '{{ ISWARRANTY ? 1 : 0}}',
        is_disassemble_component: '{{ ISDISASSEMBLEELECTRONICSCOMPONENT ? 1 : 0}}',
        stocks_in_type: '{{#? STOCKSINTYPE}}',
        is_internal: '{{ISINTERNAL ? 1 : 0}}',
        is_different: '{{ ISDIFFERENT ? 1 : 0}}',
        is_auto_review: '{{ ISAUTOREVIEW ? 1 : 0}}',
        is_returned_goods: '{{ ISRETURNEDGOODS ? 1 : 0}}',
    });
    return transform.transform(stitype, [
        'id',
        'name',
        'is_exchange_goods',
        'is_purchase',
        'is_inventory_control',
        'is_warranty',
        'is_disassemble_component',
        'stocks_in_type',
        'is_transfer',
        'is_internal',
        'is_different',
        'is_auto_review',
        'is_returned_goods',
    ]);
};

const listCostApply = (cost = []) => {
    let transform = new Transform({
        _k: '{{#? COSTID}}',
        id: '{{#? COSTID}}',
        cost_id: '{{#? COSTID}}',
        cost_name: '{{#? COSTNAME}}',
        cost_value: '{{#? COSTVALUE}}',
        checked: '{{ CHECKED ? 1 : 0}}',
        is_input_value: '{{ ISINPUTVALUES ? 1 : 0}}',
        is_percent: '{{ ISPERCENT ? 1 : 0}}',
        is_discount: '{{ ISDISCOUNT ? 1 : 0}}',
        is_value_by_time: '{{ ISVALUEBYTIME ? 1 : 0}}',
        time_type: '{{#? TIMETYPE}}',
        stocks_in_request_detail_id: '{{#? STOCKSINREQUESTDETAILID}}',
        cost_type_id: '{{#? STOCKSINREQUESTDETAILID}}',
    });
    return transform.transform(cost, [
        '_k',
        'id',
        'is_input_value',
        'is_percent',
        'is_discount',
        'is_value_by_time',
        'time_type',
        'stocks_in_request_detail_id',
        'cost_id',
        'cost_name',
        'cost_value',
        'checked',
    ]);
};

const listDensity = (density = []) => {
    let transform = new Transform({
        _k: '{{#? ID}}',
        sub_unit_id: '{{#? SUBUNITID}}',
        sub_unit_name: '{{#? SUBUNITNAME}}',
        main_unit_id: '{{#? MAINUNITID}}',
        main_unit_name: '{{#? MAINUNITNAME}}',
        density_value: '{{#? DENSITYVALUE}}',
        stocks_in_request_detail_id: '{{#? STOCKSINREQUESTDETAILID}}',
        checked: '{{ CHECKED ? 1 : 0}}',
    });
    return transform.transform(density, [
        '_k',
        'sub_unit_id',
        'sub_unit_name',
        'main_unit_id',
        'main_unit_name',
        'stocks_in_request_detail_id',
        'density_value',
        'checked',
    ]);
};

const listCostType = (costtype = []) => {
    let transform = new Transform({
        cost_id: '{{#? COSTID}}',
        cost_name: '{{#? COSTNAME}}',
        value: '{{#? COSTID}}',
        label: '{{#? COSTNAME}}',
        id: '{{#? COSTID}}',
        name: '{{#? COSTNAME}}',
        cost_value: '{{#? COSTVALUE}}',
        is_input_value: '{{ ISINPUTVALUES ? 1 : 0}}',
        is_percent: '{{ ISPERCENT ? 1 : 0}}',
        is_discount: '{{ ISDISCOUNT ? 1 : 0}}',
        is_value_by_time: '{{ ISVALUEBYTIME ? 1 : 0}}',
        time_type: '{{#? TIMETYPE}}',
        description: '{{#? DESCRIPTION}}',
    });
    return transform.transform(costtype, [
        'id',
        'name',
        'label',
        'value',
        'is_input_value',
        'is_percent',
        'is_discount',
        'is_value_by_time',
        'time_type',
        'cost_id',
        'cost_name',
        'cost_value',
        'description',
    ]);
};

const listProductApplyCost = (products = []) => {
    let transform = new Transform({
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        output_unit_id: '{{#? OUTPUTUNITID}}',
        output_unit_name: '{{#? OUTPUTUNITNAME}}',
        total_product_quantity: '{{#? TOTALPRODUCTQUANTITY}}',
        cost_per_quantity: '{{#? COSTPERQUANTITY}}',
        base_unit_id: '{{#? BASEUNITID}}',
        base_unit_name: '{{#? BASEUNITNAME}}',
    });
    return transform.transform(products, [
        'product_id',
        'product_name',
        'output_unit_id',
        'output_unit_name',
        'total_product_quantity',
        'cost_per_quantity',
        'base_unit_id',
        'base_unit_name',
    ]);
};

const company = (info) => {
    let transform = new Transform({
        company_name: '{{#? COMPANYNAME}}',
        tax: '{{#? TAX}}',
        phone_number: '{{#? PHONENUMBER}}',
        email: '{{#? EMAIL}}',
        address_full: '{{#? ADDRESSFULL}}',
        province_name: '{{#? PROVINCENAME}}',
    });
    return transform.transform(info, ['company_name', 'tax', 'phone_number', 'email', 'province_name', 'address_full']);
};

const detailPrint = (stocksInRequest) => {
    let transform = new Transform({
        stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
        stocks_in_date: '{{#? STOCKSINDATE}}',
        stocks_in_code: '{{#? STOCKSINCODE}}',
        supplier_name: '{{#? SUPPLIERNAME}}',
        supplier_phone_number: '{{#? SUPPLIERPHONENUMBER}}',
        supplier_address: '{{#? SUPPLIERADDRESS}}',
        description: '{{#? DESCRIPTION}}',
        stocks_name: '{{#? STOCKSNAME}}',
        stocks_address: '{{#? STOCKSADDRESS}}',
        stocks_phone: '{{#? STOCKSPHONE}}',
        print_date: '{{#? PRINTDATE}}',
        license_plates: '{{#? LICENSEPLATES}}',
        is_tranfer: '{{ ISTRANSFER ? 1 : 0}}',
        is_purchase: '{{ ISPURCHASE ? 1 : 0}}',
        is_inventory_control: '{{ ISINVENTORYCONTROL ? 1 : 0}}',
        is_exchange_goods: '{{ ISEXCHANGEGOODS ? 1 : 0}}',
        is_warranty: '{{ ISWARRANTY ? 1 : 0}}',
        is_disassemble_component: '{{ ISDISASSEMBLEELECTRONICSCOMPONENT ? 1 : 0}}',
        is_internal: '{{ISINTERNAL ? 1 : 0}}',
        total_quantity: '{{#? TOTALQUANTITY}}',
        total_price: '{{#? TOTALPRICE}}',
        total_cost_basic_imei: '{{#? TOTALCOSTBASICIMEI}}',
        stocks_id: '{{#? STOCKSID}}',
        cost_per_quantity: '{{#? COSTPERQUANTITY}}',
        total_price_cost: '{{TOTALPRICECOST}}',
        stocks_take_request_code: '{{#? STOCKSTAKEREQUESTCODE}}',
    });
    return transform.transform(stocksInRequest, [
        'stocks_in_request_id',
        'stocks_in_date',
        'stocks_in_code',
        'supplier_name',
        'supplier_phone_number',
        'total_cost_basic_imei',
        'supplier_address',
        'description',
        'stocks_name',
        'stocks_address',
        'stocks_phone',
        'print_date',
        'total_quantity',
        'total_price',
        'license_plates',
        'is_tranfer',
        'is_purchase',
        'is_inventory_control',
        'is_exchange_goods',
        'is_warranty',
        'is_disassemble_component',
        'is_internal',
        'stocks_id',
        'stocks_take_request_code',
    ]);
};

const productListPrint = (products) => {
    return transform.transform(products, [
        'product_id',
        'product_name',
        'product_code',
        'unit_name',
        'quantity',
        'lot_number',
        'product_imei_code',
        'cost_price',
        'total_price',
        'cost_basic_imei_code',
        'total_cost_basic_imei',
        'row_index',
        'cost_per_quantity',
        'total_price_cost',
    ]);
};

const listUser = (user = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        phone_number: '{{#? PHONENUMBER}}',
    });
    return transform.transform(user, ['id', 'name', 'user_name', 'full_name', 'phone_number']);
};

const listReviewLevel = (user = []) => {
    let transform = new Transform({
        stocks_in_type_rl_id: '{{#? STOCKSINTYPEREVIEWLEVELID}}',
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        stocks_review_level_name: '{{#? STOCKSREVIEWLEVELNAME}}',
        is_auto_reviewed: '{{ISAUTOREVIEWED? 1: 0}}',
        is_completed_reviewed: '{{ISCOMPLETEDREVIEWED? 1 : 0}}',
        stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
    });
    return transform.transform(user, [
        'stocks_in_request_id',
        'stocks_in_type_rl_id',
        'stocks_review_level_id',
        'stocks_review_level_name',
        'is_auto_reviewed',
        'is_completed_reviewed',
    ]);
};
const listReviewUser = (user = []) => {
    let transform = new Transform({
        stocks_in_type_rl_id: '{{#? STOCKSINTYPEREVIEWLEVELID}}',
        id: '{{#? USERNAME}}',
        name: '{{#? FULLNAME}}',
        user_name: '{{#? USERNAME}}',
    });
    return transform.transform(user, ['stocks_in_type_rl_id', 'id', 'name', 'user_name']);
};
const reviewLevel = (user = []) => {
    let transform = new Transform({
        stocks_review_level_name: '{{#? STOCKSREVIEWLEVELNAME}}',
        stocks_review_level_id: '{{#? STOCKSREVIEWLEVELID}}',
        stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
        is_reviewed: '{{ ISREVIEWED? ISREVIEWED * 1 : 0}}',
        is_auto_reviewed: '{{ISAUTOREVIEWED? 1: 0}}',
        review_note: '{{#? REVIEWNOTE}}',
        review_date: '{{#? UPDATEDDATE}}',
        review_user: '{{#? REVIEWUSER * 1}}',
        is_completed_reviewed: '{{ISCOMPLETEDREVIEWED? 1 : 0}}',
        full_name: '{{#? FULLNAME}}',
        avatar_url: [
            {
                '{{#if DEFAULTPICTUREURL}}': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
            },
            {
                '{{#else}}': null,
            },
        ],
    });
    return transform.transform(user, [
        'stocks_review_level_id',
        'stocks_in_request_id',
        'is_reviewed',
        'review_note',
        'review_date',
        'review_user',
        'is_completed_reviewed',
        'full_name',
        'avatar_url',
        'stocks_review_level_name',
        'is_auto_reviewed',
    ]);
};

const listPurchaseCode = (purchase_code = []) => {
    let transform = new Transform({
        id_purchase_order: '{{#? ID}}',
        name: '{{#? PURCHASEORDERCODE}}',
        order_status_id: '{{#? ISPOSTATUSID}}',
        stocks_in_code: '{{#? STOCKSINCODE}}',
        stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
    });
    return transform.transform(purchase_code, [
        'id_purchase_order',
        'name',
        'stocks_in_code',
        'stocks_in_request_id',
        'order_status_id',
    ]);
};

const storeOptions = (purchase_code = []) => {
    let transform = new Transform({
        store_id: '{{#? STOREID}}',
        store_name: '{{#? STORENAME}}',
    });
    return transform.transform(purchase_code, ['store_id', 'store_name']);
};

const imeiList = (list = []) => {
    let transform = new Transform({
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
    });
    return transform.transform(list, ['product_imei_code']);
};

const listPurchaseCodeImport = (purchase_code = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        purchase_order_order_id: '{{#? ID}}',
        name: '{{#? PURCHASEORDERCODE}}',
    });
    return transform.transform(purchase_code, ['id', 'name']);
};

const paymentSlipList = (list = []) => {
    const template = {
        payment_slip_id: '{{#? PAYMENTSLIPID}}',
        payment_type: '{{#? PAYMENTTYPE}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

module.exports = {
    detail,
    list,
    genDataStocksInType,
    getStocksManager,
    listAll,
    phoneNumber,
    genStocksInCode,
    genProductName,
    listProductDetail,
    genCostValue,
    costTypetList,
    listProductDensityUnit,
    listUnitFull,
    genLotNumber,
    getDiscount,
    statusOutput,
    dataUnitPrice,
    densityValue,
    productExcel,
    productUnitExcel,
    productTypeExcel,
    //NEW STOCKSINREQUEST
    productOptions,
    productUnit,
    productUnitDensity,
    stocksInTypeOptions,
    listCostApply,
    listDensity,
    listProductApplyCost,
    listCostType,
    company,
    detailPrint,
    productListPrint,
    listUser,
    listReviewLevel,
    listReviewUser,
    reviewLevel,
    listPurchaseCode,
    storeOptions,
    imeiList,
    listPurchaseCodeImport,
    paymentSlipList,
};
