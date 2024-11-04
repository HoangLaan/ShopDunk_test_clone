const config = require('../../../config/config');
const Transform = require('../../common/helpers/transform.helper');

const template = {
    stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
    stocks_in_code: '{{#? STOCKSINCODE}}',
    stocks_in_date: '{{#? STOCKSINDATE}}',
    is_imported: '{{!!ISIMPORTED}}',
};
let transform = new Transform(template);
const listStockInRequest = (data = []) => {
    const templateListStockInRequest = {
        stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
        stocks_in_code: '{{#? STOCKSINCODE}}',
        stocks_in_date: '{{#? STOCKSINDATE}}',
        is_imported: '{{!!ISIMPORTED}}',
    };
    let transformListStockInRequest = new Transform(templateListStockInRequest);
    return transformListStockInRequest.transform(data, ['stocks_in_request_id', 'stocks_in_code', 'stocks_in_date', 'is_imported']);
};
const infoStockInRequest = (data = []) => {
    const templateInfoStockInRequest = {
        stocks_in_request_id: '{{#? STOCKSINREQUESTID}}',
        request_user: '{{#? REQUESTUSER}}',
        stocks_in_code: '{{#? STOCKSINCODE}}',
        imported_user: '{{#? IMPORTEDUSER}}',
        stock_name: '{{#? STOCKSNAME}}',
        created_date: '{{#? CREATEDDATE}}',
        is_imported: '{{!!ISIMPORTED}}',
       
    };
    let transformInfoStockInRequest = new Transform(templateInfoStockInRequest);
    return transformInfoStockInRequest.transform(data, 
    [
        'stocks_in_request_id', 
        'stocks_in_code',
        'request_user', 
        'imported_user', 
        'stock_name',
        'created_date',
        'is_imported'
    ]);
};

const productInfoStockInRequest = (data = []) => {
    const templateProductInfoStockInRequest = {
        product_id: '{{#? PRODUCTID}}',
        product_name: '{{#? PRODUCTNAME}}',
        product_image: config.domain_cdn + `{{ IMAGEURL ? IMAGEURL : '' }}`,
        quantity: '{{#? QUANTITY}}',
        actualy_quantity: '{{#? ACTUALYQUANTITY}}',
       
    };
    let transformProductInfoStockInRequest = new Transform(templateProductInfoStockInRequest);
    return transformProductInfoStockInRequest.transform(data, 
    [
        'product_id', 
        'product_name', 
        'product_image',
        'quantity', 
        'actualy_quantity',
    ]);
};

const listStockInProductImei = (data = []) => {
    const template = {
        stock_in_detail_id: '{{#? STOCKSINDETAILID}}',
        product_imei_code: '{{#? PRODUCTIMEICODE}}',
        created_date: '{{#? CREATEDDATE}}',
       
    };
    let transform = new Transform(template);
    return transform.transform(data, 
    [
        'stock_in_detail_id', 
        'product_imei_code', 
        'created_date',
    ]);
};


module.exports = {
    listStockInRequest,
    infoStockInRequest,
    productInfoStockInRequest,
    listStockInProductImei
};
