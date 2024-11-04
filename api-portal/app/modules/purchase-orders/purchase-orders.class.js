const Transform = require('../../common/helpers/transform.helper');

const template = {
    //list
    purchase_order_id: '{{#? PURCHASEORDERID}}',
    purchase_order_code: '{{#? PURCHASEORDERCODE}}',
    request_purchase_code: '{{#? REQUESTPURCHASECODE}}',
    request_purchase_id: '{{#? REQUESTPURCHASEID}}',
    supplier_name: '{{#? SUPPLIERNAME}}',
    company_name: '{{#? COMPANYNAME}}',
    expected_date: '{{#? EXPECTEDDATE}}',
    business_name: '{{#? BUSINESSNAME}}',
    total_amount: '{{#? TOTALAMOUNT}}',
    total_money: '{{#? TOTALMONEY}}',
    order_status: '{{#? ISPOSTATUSID}}',
    is_payments_status_id: '{{ ISPAYMENTSSTATUSID}}',
    payment_status: '{{#? PAYMENTSTATUS ? PAYMENTSTATUS : 0 }}',
    payment_type: '{{ PAYMENTTYPE}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    store_name: '{{#? STORENAME}}',

    //detail
    company_id: '{{#? COMPANYID}}',
    supplier_id: '{{#? SUPPLIERID}}',
    supplier_code: '{{#? SUPPLIERCODE}}',
    address_full: '{{#? ADDRESSFULL}}',
    tax_code: '{{#? TAXCODE}}',
    discount_program_id: '{{#? DISCOUNTPROGRAMID}}',
    business_id: '{{#? BUSINESSID}}',
    department_id: '{{#? DEPARTMENTID}}',
    store_id: '{{#? STOREID}}',
    lot_number: '{{#? LOTNUMBER}}',
    order_note: '{{#? ORDERNOTE}}',
    stocks_id: '{{#? STOCKSID}}',
    payment_id: '{{#? PAYMENTID}}',
    payment_period: '{{#? PAYMENTPERIOD}}',
    editable: '{{EDITABLE ? 1 : 0}}',
    is_active: '{{ ISACTIVE ? 1: 0}}',

    //list product
    purchase_order_detail_id: '{{#? PURCHASEORDERREQUESTDETAILID}}',
    manufacture_name: '{{#? MANUFACTURERNAME}}',
    invoice_list: '{{#? INVOICELIST}}',
    invoice_status: '{{#? INVOICESTATUS}}',
    product_id: '{{#? PRODUCTID}}',
    product_code: '{{#? PRODUCTCODE}}',
    product_name: '{{#? PRODUCTNAME}}',
    stocks_account_id: '{{#? STOCKSACCOUNT}}',
    category_name: '{{#? CATEGORYNAME}}',
    vat_value: '{{#? VATVALUE}}',
    unit_id: '{{#? UNITID}}',
    unit_name: '{{#? UNITNAME}}',
    cost_price: '{{#? COSTPRICE}}',
    total_price: '{{#? TOTALPRICE}}',
    discount_price: '{{#? DISCOUNTPRICE}}',
    discount_total_price: '{{#? DISCOUNTTOTALPRICE}}',
    discount_percent: '{{ DISCOUNTPERCENT? DISCOUNTPERCENT: 0}}',
    quantity: '{{#? QUANTITY}}',
    expected_date: '{{#? EXPECTEDDATE}}',
    origin_quantity: '{{#? ORIGINQUANTITY}}',
    invoice_product_quantity: '{{INVOICEPRODUCTQUANTITY ? INVOICEPRODUCTQUANTITY : 0}}',
    imeis: '{{#? IMEIS}}',

    id: '{{#? ID}}',
    name: '{{#? NAME}}',

    // Count OrderStatus
    total: '{{#? TOTAL}}',

    warehoused_quantity: '{{#? WAREHOUSEDQUANTITY}}',
    divided_quantity: '{{#? DIVIDEDQUANTITY}}',
    expected_imported_stock_id: '{{#? EXPECTEDIMPORTEDSTOCKID}}',
    total_in: '{{ TOTALIN ? TOTALIN : 0}}',
    total_out: '{{ TOTALOUT ? TOTALOUT : 0}}',

    purchase_requisition_type_id: '{{#? PURCHASEREQUISITIONTYPEID}}',
    order_id: '{{ ORDERID ? String(ORDERID) : null}}',
    cogs_option: '{{#? COGSOPTION}}',
    customer_type: '{{#? CUSTOMERTYPE}}',
    member_id: '{{ MEMBERID ? String(MEMBERID) : null}}',
    customer_name: '{{#? CUSTOMERNAME}}',
    is_returned_goods: '{{ ISRETURNEDGOODS ? 1 : 0}}',
    product_type: '{{ PRODUCTTYPE }}',
};

let transform = new Transform(template);
const options = (data = []) => {
    return transform.transform(data, ['id', 'name']);
};

const list = (list = []) => {
    return transform.transform(list, [
        'purchase_order_id',
        'purchase_order_code',
        'request_purchase_code',
        'supplier_name',
        'company_name',
        'expected_date',
        'business_name',
        'store_name',
        'total_amount',
        'total_money',
        'payment_status',
        'invoice_list',
        'invoice_status',
        'order_status',
        'is_payments_status_id',
        'created_user',
        'created_date',
        'customer_name',
    ]);
};

const detail = (data) => {
    return transform.transform(data, [
        'purchase_order_id',
        'purchase_order_code',
        'request_purchase_code',
        'request_purchase_id',
        'company_id',
        'company_name',
        'created_user',
        'supplier_id',
        'supplier_code',
        'address_full',
        'tax_code',
        'payment_status',
        'discount_program_id',
        'supplier_name',
        'business_id',
        'business_name',
        'department_id',
        'created_date',
        'store_id',
        'store_name',
        'order_status',
        'is_payments_status_id',
        'payment_type',
        'lot_number',
        'expected_date',
        'order_note',
        'stocks_id',
        'payment_id',
        'expected_imported_stock_id',
        'is_active',
        'payment_period',
        'editable',
        'purchase_requisition_type_id',
        'order_id',
        'cogs_option',
        'customer_type',
        'member_id',
        'is_returned_goods',
    ]);
};
const productList = (list) => {
    return transform.transform(list, [
        'purchase_order_detail_id',
        'product_id',
        'product_code',
        'product_name',
        'category_name',
        'product_type',
        'vat_value',
        'stocks_account_id',
        'manufacture_name',
        'unit_id',
        'unit_name',
        'cost_price',
        'total_price',
        'discount_price',
        'discount_total_price',
        'discount_percent',
        'quantity',
        'expected_date',
        'is_active',
        'invoice_product_quantity',
        'warehoused_quantity',
        'divided_quantity',
        'purchase_order_id',
        'total_in',
        'total_out',
        'debt_account_id',
        'origin_quantity',
        'imeis',
    ]);
};
const customerListDeboune = (customers) => {
    const customerList = {
        member_id: '{{#? MEMBERID}}',
        user_name: '{{#? USERNAME}}',
        full_name: '{{#? FULLNAME}}',
        customer_code: '{{#? CUSTOMERCODE}}',
    };

    const transform = new Transform(customerList);

    return transform.transform(customers, ['member_id', 'user_name', 'full_name', 'customer_code']);
};

const invoiceList = (data) => {
    const template = {
        invoice_id: '{{#? INVOICEID}}',
        product_count: '{{PRODUCTCOUNT ? PRODUCTCOUNT : 0}}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

const userList = (users = []) => {
    return transform.transform(users, [
        'user_assigned',
        'fullname',
        'estimate_total_time',
        'actual_total_time',
        'performance',
    ]);
};

const countOrderStatus = (list = []) => {
    return transform.transform(list, ['order_status', 'total']);
};

const informapping = (data = []) => {
    const _template = {
        request_purchase_code: '{{#? REQUESTPURCHASECODE}}',
        id: '{{#? ID}}',
        value: '{{#? VALUE}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

const paymentSlipList = (list = []) => {
    const template = {
        payment_slip_id: '{{#? PAYMENTSLIPID}}',
        payment_type: '{{#? PAYMENTTYPE}}',
        total_money: '{{#? TOTALMONEY}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

const purchaseOrderDivisionList = (list = []) => {
    const template = {
        purchase_order_division_id: '{{#? PURCHASEORDERDIVISIONID}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

const stocksInRequestList = (list = []) => {
    const template = {
        stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
        stocks_in_code: '{{#? STOCKSINCODE}}',
        stocks_code: '{{#? STOCKSCODE}}',
        product_list: '{{#? PRODUCTLIST}}',
    };
    let transform = new Transform(template);
    return transform.transform(list, Object.keys(template));
};

const productsOfOrder = (list = []) => {
    const template = {
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_name: '{{#? PRODUCTNAME}}',
        unit_name: '{{#? UNITNAME}}',
        unit_id: '{{#? UNITID}}',
        returned_quantity: '{{ QUANTITY ? QUANTITY : 0}}',
        quantity: '{{ QUANTITY ? QUANTITY : 0}}',
        total_price: '{{ TOTALPRICE ? TOTALPRICE : 0}}',
        cost_price: '{{ COGSPRICE ? COGSPRICE : 0}}',
        vat_value: '{{ VALUEVAT ? VALUEVAT : 0}}',
        manufacture_name: '{{#? MANUFACTURERNAME}}',
        category_name: '{{#? CATEGORYNAME}}',
        imei_code: '{{#? IMEICODE}}',
    };
    return new Transform(template).transform(list, Object.keys(template));
};
module.exports = {
    userList,
    list,
    customerListDeboune,
    detail,
    productList,
    options,
    countOrderStatus,
    informapping,
    paymentSlipList,
    purchaseOrderDivisionList,
    stocksInRequestList,
    invoiceList,
    productsOfOrder,
};
