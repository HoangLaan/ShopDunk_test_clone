const Transform = require('../../common/helpers/transform.helper');

const template = {
    stocks_out_request_id: '{{#? STOCKSOUTREQUESTID}}',
    stocks_out_request_code: '{{#? STOCKSOUTREQUESTCODE}}',
    stocks_out_request_date: '{{#? STOCKSOUTREQUESTDATE}}',
    stocks_out_type_id: '{{#? STOCKSOUTTYPEID}}',
    department_request_id: '{{#? DEPARTMENTREQUESTID}}',
    receiver: '{{#? RECEIVER}}',
    business_request_id: '{{#? BUSINESSREQUESTID}}',
    request_user: '{{#? REQUESTUSER}}',
    request_user_fullname: '{{#? REQUESTUSERFULLNAME}}',
    phone_number: '{{#? PHONENUMBER}}',
    receiver_full_address: '{{#? RECEIVERFULLADDRESS}}',
    created_user: '{{#? CREATEDUSER}}',
    is_outputted: '{{#? ISOUTPUTTED}}',
    total_amount: '{{#? TOTALAMOUNT}}',
    stocks_name: '{{#? STOCKSNAME}}',
    stocks_address: '{{#? STOCKSADDRESS}}',
    stocks_phone_number: '{{#? STOCKSPHONENUMBER}}',
    to_stocks_name: '{{#? TOSTOCKSNAME}}',
    to_stocks_address: '{{#? TOSTOCKSADDRESS}}',
    to_stocks_phone_number: '{{#? TOSTOCKSPHONENUMBER}}',
    customer_id: '{{#? CUSTOMERID}}',
    to_stocks_id: '{{#? TOSTOCKSID}}',
    created_user_id: '{{#? CREATEDUSERID}}',
    created_user_fullname: '{{#? CREATEDUSERFULLNAME}}',
    description: '{{#? DESCRIPTION}}',
    stocks_transfer_code: '{{#? STOCKSTRANSFERCODE}}',
    stocks_take_request_code: '{{#? STOCKSTAKEREQUESTCODE}}',
    export_user: '{{#? EXPORTUSER}}',
    export_user_full_name: '{{#? EXPORTUSERFULLNAME}}',
    is_sell: '{{#? ISSELL}}',
    is_transfer: '{{#? ISTRANSFER}}',
    to_address_stocks: '{{#? TOADDRESSSTOCKS}}',
    to_stocks_phone: '{{#? TOSTOCKSPHONE}}',
    address_stocks: '{{#? ADDRESSSTOCKS}}',
    stocks_phone: '{{#? STOCKSPHONE}}',
    customer_full_name: '{{#? CUSTOMERFULLNAME}}',
    customer_phone_number: '{{#? CUSTOMERPHONENUMBER}}',
    customer_address: '{{#? CUSTOMERADDRESS}}',
    store_address: '{{#? STOREADDRESS}}',
    order_detail_id: '{{#? ORDERDETAILID}}',
    stocks_id: '{{#? STOCKSID}}',

};

let transform = new Transform(template);

const detail = data => {
    return transform.transform(data, [
        'stocks_out_request_id',
        'stocks_out_request_code',
        'stocks_out_request_date',
        'stocks_out_type_id',
        'department_request_id',
        'receiver',
        'business_request_id',
        'stocks_id',
        'request_user',
        'request_user_fullname',
        'phone_number',
        'receiver_full_address',
        'created_user',
        'is_outputted',
        'total_amount',
        'stocks_name',
        'stocks_address',
        'stocks_phone_number',
        'to_stocks_name',
        'to_stocks_address',
        'to_stocks_phone_number',
        'customer_id',
        'to_stocks_name',
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
        'store_address'
    ]);
};

const listStock = data => transform.transform(data, ['order_detail_id', 'stocks_id'])

module.exports = {
    detail,
    listStock
};