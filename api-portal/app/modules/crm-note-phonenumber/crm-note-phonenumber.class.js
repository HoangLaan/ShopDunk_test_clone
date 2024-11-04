const Transform = require("../../common/helpers/transform.helper");

const list = (data = []) => {
    const _template = {
        phone_number: '{{#? PHONENUMBER}}',
        created_date: '{{#? CREATEDDATE}}',
        created_user: '{{#? CREATEDUSER}}',
        note: '{{#? NOTE}}',
    };
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
    list
}