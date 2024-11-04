const Transform = require('../../common/helpers/transform.helper');

const template = {
    short_link_id: '{{#? SHORTLINKID}}',
    short_link_redirect: '{{#? URLDIRECT}}',
    short_code: '{{#? SHORDECODE}}',
    short_link_name: '{{#? SHORTLINKNAME}}',
    short_link_type: '{{#? SHORTLINKTYPE}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',

    //member infor
    short_link_detail_id: '{{#? SHORTLINKDETAILID}}',
    member_id: '{{#? MEMBERID}}',
    department_id: '{{#? DEPARTMENTID}}',
    gender: '{{#? GENDER}}',
    birthday: '{{#? BIRTHDAY}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    customer_code: '{{#? CUSTOMERCODE}}',
    full_name: '{{#? FULLNAME}}',
    data_leads_id: '{{#? DATALEADSID}}',
};

let transform = new Transform(template);

const list = (data = []) => {
    const defaultFields = [
        'short_link_id',
        'short_link_redirect',
        'short_code',
        'short_link_name',
        'short_link_type',
        'is_active',
    ];
    return transform.transform(data, defaultFields);
};

const detail = (data = []) => {
  const defaultFields = [
      'short_link_id',
      'short_link_redirect',
      'short_code',
      'short_link_name',
      'short_link_type',
      'is_active',
  ];
  return transform.transform(data, defaultFields);
};

const member = (data = []) => {
  const defaultFields = [
      'short_link_detail_id',
      'member_id',
      'department_id',
      'data_leads_id',
      'short_link_id',
      'customer_code',
      'gender',
      'birthday',
      'phone_number',
      'email',
      'full_name',
      'data_leads_id'
  ];
  return transform.transform(data, defaultFields);
};

module.exports = {
  list,
  detail,
  member
};
