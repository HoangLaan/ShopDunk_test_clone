const Transform = require('../../common/helpers/transform.helper');

const template = {
    price_review_level_id: '{{#? PRICEREVIEWLEVELID}}',
    price_review_level_name: '{{#? REVIEWLEVELNAME}}',
    description: '{{#? DESCRIPTION}}',
    order_index: '{{#? ORDERINDEX}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_complete_review: '{{ISCOMPELEREVIEW ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
};

let transform = new Transform(template);

const detail = user => {
    return transform.transform(user, [
        'price_review_level_id',
        'price_review_level_name',
        'description',
        'order_index',
        'is_active',
        'is_system',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'price_review_level_id',
        'price_review_level_name',
        'description',
        'is_active',
        'created_date',
        'created_user',
    ]);
};

const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    is_compele_review: '{{#? ISCOMPELEREVIEW}}',
};

const options = (manufacturer = []) => {
    let transform = new Transform(templateOptions);

    return transform.transform(manufacturer, ['id', 'name', 'is_compele_review']);
};

module.exports = {
    detail,
    list,
    options,
};
