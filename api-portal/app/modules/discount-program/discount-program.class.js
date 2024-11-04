const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    data_leads_id: '{{#? DATALEADSID}}',
};

const getOptions = (data = []) => {
    const template = {
        value: '{{#? ID*1}}',
        label: '{{#? NAME}}',
        apply_from: '{{#? APPLYFROM}}',
        apply_to: '{{#? APPLYTO}}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

const getProducts = (data = []) => {
    const template = {
        value: '{{#? PRODUCTID * 1 }}',
        label: '{{#? PRODUCTNAME }}',
    };

    return new Transform(template).transform(data, Object.keys(template));
};

module.exports = {
    getOptions,
    getProducts,
};
