const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
    const _template = {};
    return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {};
