const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    sip_id: '{{#? SIPID}}',
    user_name: '{{#? USERNAME}}',
    user_fullname: '{{#? FULLNAME}}',
    voip_ext: '{{#? VOIPEXT}}',
    is_recall: '{{ISRECALL ? 1 : 0}}',
    brand_name: '{{#? BRANDNAME}}',
    description: '{{#? DESCRIPTION}}',
    voip_ext_name: '{{#? VOIPEXTNAME}}',
};
let transform = new Transform(template);

const listUser = (data = []) => {
    return transform.transform(data, ['sip_id', 'user_name', 'user_fullname', 'voip_ext', 'is_recall']);
};

const listVoipExt = (data = []) => {
    return transform.transform(data, ['voip_ext', 'brand_name', 'voip_ext_name']);
};

module.exports = {
    listUser,
    listVoipExt,
};
