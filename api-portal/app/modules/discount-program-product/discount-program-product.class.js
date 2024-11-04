const Transform = require('../../common/helpers/transform.helper');

const template = {
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_code: '{{#? PRODUCTCODE}}',
    category_name: '{{#? CATEGORYNAME}}',
    model_name: '{{#? MODELNAME}}',
    discount_program_id: '{{#? DISCOUNTPROGRAMID}}',
    discount_program_name: '{{#? DISCOUNTPROGRAMNAME}}',
    from_date: '{{#? FROMDATE}}',
    to_date: '{{#? TODATE}}',
    month: '{{#? MONTH}}',
    year: '{{#? YEAR}}',
    discount_money: '{{#? DISCOUNTMONEY}}',
    quantity: '{{#? QUANTITY}}',
    next_month: '{{#? NEXTMONTH}}',
    next_year: '{{#? NEXTYEAR}}',
};

const transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, Object.keys(template));
};

const productDetail = (data = []) => {
    const template = {
        product_id: '{{#? PRODUCTID}}',
        product_code: '{{#? PRODUCTCODE}}',
        order_no: '{{#? ORDERNO}}',
        created_date: '{{#? CREATEDDATE}}',
        customer_name: '{{#? CUSTOMERNAME}}',
        phone_number: '{{#? PHONENUMBER}}',
        imie_code: '{{#? IMEICODE}}',
        store_name: '{{#? STORENAME}}',
        order_type_name: '{{#? ORDERTYPENAME}}',
        status_name: '{{#? STATUSNAME}}',
        business_name: '{{#? BUSINESSNAME}}',
        product_name: '{{#? PRODUCTNAME}}',
        discount_program_id: '{{#? DISCOUNTPROGRAMID}}',
        discount_program_name: '{{#? DISCOUNTPROGRAMNAME}}',
        month: '{{#? MONTH}}',
        year: '{{#? YEAR}}',
        discount_money: '{{#? DISCOUNTMONEY}}',
    };
    return new Transform(template).transform(data, Object.keys(template));
};

const productOptions = (list = []) => {
    const template = {
        value: '{{#? ID * 1}}',
        label: '{{#? NAME}}',
    };
    return new Transform(template).transform(list, Object.keys(template));
};

module.exports = {
    list,
    productOptions,
    productDetail,
};
