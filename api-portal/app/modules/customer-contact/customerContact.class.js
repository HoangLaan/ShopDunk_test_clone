const Transform = require('../../common/helpers/transform.helper');

const template = {
    partner_contact_id: '{{#? PARTNERCONTACTID}}',
    contact_customer_id: '{{#? CONTACTCUSTOMERID}}',
    first_name: '{{#? FIRSTNAME}}',
    last_name: '{{#? LASTNAME}}',
    position: '{{#? POSITION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    create_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    delete_user: '{{#? DELETEDUSER}}',
    //exists
    exists_phone: '{{#? EXISTSPHONE}}',
    exists_email: '{{#? EXISTSEMAIL}}',
};

const defaultFields = [
    'partner_contact_id',
    'contact_customer_id',
    'first_name',
    'last_name',
    'position',
    'is_active',
    'create_date',
];

let transform = new Transform(template);

const detail = (data) => {
    return transform.transform(data, defaultFields);
};

const list = (data = []) => {
    return transform.transform(data, defaultFields);
};

const check = (checkExist) => {
    return transform.transform(checkExist, ['exists_phone', 'exists_email']);
};

module.exports = {
    detail,
    list,
    check,
};
