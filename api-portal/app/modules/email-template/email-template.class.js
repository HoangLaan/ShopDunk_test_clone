const Transform = require('../../common/helpers/transform.helper');

const template = {
    email_template_id: '{{#? EMAILTEMPLATEID }}',
    email_template_html: '{{#? EMAILTEMPLATEHTML }}',
    email_template_name: '{{#? EMAILTEMPLATENAME}}',
    mail_supplier: '{{#? MAILSUPPLIER}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    email_template_params: '{{#? EMAILTEMPLATEPARAMS}}',
};

let transform = new Transform(template);

const detail = (obj) => {
    return transform.transform(obj, [
        'email_template_id',
        'email_template_html',
        'email_template_name',
        'mail_supplier',
        'email_template_params',
    ]);
};

const list = (list = []) => {
    return transform.transform(list, [
        'email_template_id',
        'email_template_html',
        'email_template_name',
        'mail_supplier',
        'created_user',
        'created_date',
        'email_template_params',
    ]);
};

module.exports = {
    detail,
    list,
};
