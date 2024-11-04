const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const listNotify = (mails = []) => {
    const template = {
        id: '{{#? ID}}',
        children_id: '{{#? CHILDRENID}}',
        subject: '{{#? SUBJECT}}',
        date: '{{#? DATE}}',
        is_read: '{{ISREAD ? 1 : 0}}',
        fullname: '{{#? FULLNAME}}',
    };
    const transform = new Transform(template);
    return transform.transform(mails, Object.keys(template));
};

const optionsGlobal = (data = []) => {
    const template = {
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        is_active: '{{ISACTIVE ? 1 : 0}}',
        parent_id: '{{#? PARENTID}}',
        code: '{{#? CODE }}'
    };

    const templateKeys = ['ID', 'NAME', 'ISACTIVE', 'PARENTID', 'CODE'];
    const dataKeys = Object.keys(data[0]? data[0]: {});
    for (let i = 0; i < dataKeys.length; i++) {
      if (!templateKeys.includes(dataKeys[i])) {
        template[dataKeys[i].toLowerCase()] = `{{#? ${dataKeys[i].toUpperCase()}}}`;
      }
    }

    const transform = new Transform(template);
    return transform.transform(data, Object.keys(template));
};

module.exports = {
    listNotify,
    optionsGlobal,
};
