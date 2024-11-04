const Transform = require('../../common/helpers/transform.helper');

const sendNotifyTask = (data = []) => {
  const _template = {
    order_notify_id: '{{#? ORDERNOTIFYID }}',
    order_id: '{{#? ORDERID }}',
    order_status_id: '{{#? ORDERSTATUSID }}',
    order_type_id: '{{#? ORDERTYPEID }}',
    is_send: '{{#? ISSEND }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const checkSendNotify = (data = []) => {
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
    total_paid: '{{#? TOTALPAID}}',
    total_transfer_amount: '{{#? TOTALTRANSFERAMOUNT}}',
    pre_transfer_amount: '{{#? PRETRANSFERAMOUNT}}',
    old_order_status_id: '{{#? OLDORDERSTATUSID}}',
    is_change_order_status: '{{ ISCHANGEORDERSTATUS? 1: 0}}',
    is_send_notify: '{{ ISSENDNOTIFY? 1: 0}}',
    product_name_list: '{{#? PRODUCTNAMELIST}}',
    product_id: '{{#? PRODUCTID}}',
    product_name: '{{#? PRODUCTNAME}}',
    store_name: '{{#? STORENAME}}',
    receiving_date: '{{#? RECEIVINGDATE }}',
    receiving_time: '{{#? RECEIVINGTIME }}',
    receive_address: '{{#? RECEIVEADDRESS }}',
    address_detail: '{{#? ADDRESSDETAIL }}',
    short_receive_address: '{{#? SHORTRECEIVEADDRESS }}',
    short_address_detail: '{{#? SHORTADDRESSDETAIL }}',
    payment_type: '{{#? PAYMENTTYPE}}',
    payment_form_names: '{{#? PAYMENTFORMNAMES}}',
    pre_order_no: '{{#? PREORDERNO}}',
    pre_order_id: '{{#? PREORDERID}}',
  };

  const transform = new Transform(template);
  return transform.transform(data, Object.keys(template));
};

const notify = (data = []) => {
  const template = {
    notify_type_id: '{{#? NOTIFYTYPEID}}',
    notify_title: '{{#? TEMPLATETITLE }}',
    notify_content: '{{#? TEMPLATECONTENT }}',
  };

  const transform = new Transform(template);
  return transform.transform(data, Object.keys(template));
};

module.exports = {
  sendNotifyTask,
  checkSendNotify,
  checkSendData,
  notify
};
