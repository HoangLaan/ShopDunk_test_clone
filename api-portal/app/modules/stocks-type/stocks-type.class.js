const Transform = require('../../common/helpers/transform.helper');

const template = {
    stocks_type_id: '{{#? STOCKSTYPEID}}',
    stocks_type_name: '{{#? STOCKSTYPENAME}}',
    stocks_type_code: '{{#? STOCKSTYPECODE}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{#? ISACTIVE}}',
    is_supplier: '{{ISSUPPLIER  ? 1 : 0}}',
    is_company: '{{ISCOMPANY  ? 1 : 0}}',
    is_agency: '{{ISAGENCY  ? 1 : 0}}',
    is_system: '{{ISSYSTEM  ? 1 : 0}}',
    is_manufacturer: '{{ISMANUFACTURER  ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_not_for_sale: '{{ISNOTFORSALE ? 1 : 0}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    is_material: '{{ISMATERIAL  ? 1 : 0}}',
    is_store: '{{ISSTORE  ? 1 : 0}}',
    is_warranty: '{{ISWARRANTY  ? 1 : 0}}',
    is_broken: '{{ISBROKEN  ? 1 : 0}}',
    is_accessory: '{{ISACCESSORY  ? 1 : 0}}',
    is_component: '{{ISCOMPONENT ? 1 : 0}}',
    type: '{{#? TYPE}}',
    is_export_to: '{{ISEXPORTTO ? 1 : 0}}',
};

let transform = new Transform(template);

const list = (users = []) => {
    return transform.transform(users, [
        'stocks_type_id',
        'stocks_type_name',
        'stocks_type_code',
        'is_active',
        'created_date',
        'created_user',
        'is_deleted',
    ]);
};

const detail = (user) => {
    return transform.transform(user, [
        'stocks_type_id',
        'stocks_type_code',
        'stocks_type_name',
        'is_active',
        'created_date',
        'created_user',
        'is_active',
        'is_system',
        'is_supplier',
        'is_company',
        'is_agency',
        'is_manufacturer',
        'description',
        'is_store',
        'is_not_for_sale',
        'is_material',
        'is_warranty',
        'is_broken',
        'is_component',
        'is_accessory',
        'type',
        'is_export_to',
    ]);
};

module.exports = {
    detail,
    list,
};
