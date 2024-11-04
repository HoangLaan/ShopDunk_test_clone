const Transform = require('../../common/helpers/transform.helper');

const template = {
    ward_id: '{{#? WARDID}}',
    ward_name: '{{#? WARDNAME}}',
    district_id: '{{#? DISTRICTID}}',
    province_id: '{{#? PROVINCEID}}',
    keywords: '{{#? KEYWORDS}}',
    priority: '{{#? PRIORITY}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
};

module.exports = {};
