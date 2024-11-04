const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
  const _template = {
    member_id: '{{#? MEMBERID }}',
    data_leads_id: '{{#? DATALEADSID }}',
    customer_code: '{{#? CUSTOMERCODE }}',
    preorder_id: '{{#? PREORDERID }}',
    customer_name: '{{#? CUSTOMERNAME }}',
    created_date: '{{ CREATEDDATE }}',
    order_no: '{{#? ORDERNO }}',
    order_date: '{{#? ORDERDATE }}',
    pre_order_no: '{{#? PREORDERNO }}',
    pre_created_date_text: '{{#? PRECREATEDDATETEXT }}',
    transfer_amount: '{{#? TRANSFERAMOUNT }}',
    payment_type: '{{#? PAYMENTTYPE }}',
    receive_store_address: '{{#? RECEIVESTOREADDRESS }}',
    receive_address: '{{#? RECEIVEADDRESS }}',
    address_detail: '{{#? ADDRESSDETAIL }}',
    pre_address_detail: '{{#? PREADDRESSDETAIL }}',
    pre_receive_store_name: '{{#? PRERECEIVESTORENAME }}',
    store_name: '{{#? STORENAME }}',
    store_code: '{{#? STORECODE }}',
    product_name_list: '{{#? PRODUCTNAMELIST }}',
    product_name: '{{#? PRODUCTNAME }}',
    phone_number: '{{#? PHONENUMBER }}',
    email: '{{#? EMAIL }}',
    workflow_name: '{{#? WORKFLOWNAME }}',
    last_payment_time: '{{#? LASTPATMENTTIME }}',
    is_active: '{{ ISACTIVE ? 1: 0 }}',
    is_call: '{{ ISCALL ? 1: 0 }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};


module.exports = {
  list,
};
