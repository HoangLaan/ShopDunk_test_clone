const Transform = require('../../common/helpers/transform.helper');

const baseTemplate = {
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_code: '{{#? PRODUCTCODE}}',
    vat_value: '{{#? VATVALUE}}',
    rebate_percent: '{{#? REBATEPERCENT}}',
    category_percent: '{{#? CATEGORYPERCENT}}',
    discount_programs: '{{#? DISCOUNTPROGRAMS}}',
    category_name: '{{#? CATEGORYNAME}}',
    manufacturer_name: '{{#? MANUFACTURERNAME}}',
    model_name: '{{#? MODELNAME}}',
    model_id: '{{#? MODELID}}',
    unit_name: '{{#? UNITNAME}}',
    unit_id: '{{#? UNITID}}',
};

const list = (data = []) => {
    const _template = baseTemplate;
    return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
    const _template = baseTemplate;
    return new Transform(_template).transform(data, Object.keys(_template));
};

const historyList = (data = []) => {
    const template = {
        model_calculation_id: '{{#? MODELCACULATIONID}}',
        code: '{{#? CODE}}',
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_code: '{{#? PRODUCTCODE}}',
        product_model_id: '{{#? PRODUCTMODELID}}',
        listed_price_full_vat: '{{#? LISTEDPRICEFULLVAT}}',
        p1_subtract_vat: '{{#? P1SUBTRACTVAT}}',
        rebate: '{{#? REBATE}}',
        net_subtract_vat: '{{#? NETSUBTRACTVAT}}',
        net_full_vat: '{{#? NETFULLVAT}}',
        suggested_price: '{{#? SUGGESTEDPRICE}}',
        expected_profit_percentage: '{{#? EXPECTEDPROFITPERCENTAGE}}',
        expected_profit_money: '{{#? EXPECTEDPROFITMONEY}}',
        discount_programs: '{{#? DISCOUNTPROGRAMS}}',
        created_user: '{{#? CREATEDUSER}}',
        created_date: '{{#? CREATEDDATE}}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    list,
    getById,
    historyList,
};
