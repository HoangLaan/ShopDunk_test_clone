const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
    unit_id: '{{#? UNITID}}',
    unit_name: '{{#? UNITNAME}}',
    attribute_name: '{{#? ATTRIBUTENAME}}',
    attribute_name_cn: '{{#? ATTRIBUTENAMECN}}',
    attribute_name_en: '{{#? ATTRIBUTENAMEEN}}',
    attribute_description: '{{#? ATTRIBUTEDESCRIPTION}}',
    attribute_description_en: '{{#? ATTRIBUTEDESCRIPTIONEN}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{ISDELETED ? 1 : 0}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    is_model: '{{ISMODEL ? 1 : 0}}',
    attribute_values: '{{#? ATTRIBUTEVALUES}}',

    member_id: '{{#? MEMBERID}}',
    tailor_attribute_id: '{{#? TAILORATTRIBUTEID}}',
    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    product_id: '{{#? PRODUCTID}}',
    is_material: '{{ISMATERIAL ? 1 : 0}}',
    is_form_size: '{{ISFORMSIZE ? 1 : 0}}',
    is_color: '{{ISCOLOR ? 1 :0}}',
    is_material: '{{ISMATERIAL ? 1 :0}}',
    is_other: '{{ISOTHER ? 1 :0}}',
    is_capacity: '{{ISCAPACITY ? 1 :0}}',
    is_weight: '{{ISWEIGHT ? 1 :0}}',
    attribute_type: '{{#? ATTRIBUTETYPE}}', //ISCOMPONENT
    color_hex: '{{#? COLORHEX}}',
};

const detail = (product) => {
    let transform = new Transform(template);

    return transform.transform(product, [
        'product_attribute_id',
        'unit_id',
        'unit_name',
        'attribute_name',
        'attribute_description',
        'is_active',
        'created_date',
        'is_form_size',
        'is_color',
        'is_material',
        'is_other',
        'is_capacity',
        'is_weight',
        'is_system',
    ]);
};

const list = (products = []) => {
    let transform = new Transform(template);

    return transform.transform(products, [
        'product_attribute_id',
        'unit_id',
        'unit_name',
        'attribute_name',
        'attribute_description',
        'is_active',
        'created_date',
        'is_deleted',
        'attribute_values',
        'tailor_attribute_id',
        'member_id',
        'product_category_id',
        'attribute_type',
        'is_system',
    ]);
};

const templateAttributeValues = {
    attribute_values_id: '{{#? ATTRIBUTEVALUESID}}',
    attribute_values: '{{#? ATTRIBUTEVALUES}}',
    product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
    attribute_description: '{{#? ATTRIBUTEDESCRIPTION}}',
    attribute_image: `${config.domain_cdn}{{ATTRIBUTEIMAGE}}`,
    tailor_attribute_history_detail_id: '{{#? TLATTRIBUTEHISTORYDETAILID}}',
    tailor_attribute_history_id: '{{#? TAILORATTRIBUTEHISTORYID}}',
    tailor_attribute_id: '{{#? TAILORATTRIBUTEID}}',
    attribute_values_cn: '{{#? ATTRIBUTEVALUESCN}}',
    attribute_description_cn: '{{#? ATTRIBUTEDESCRIPTIONCN}}',
    is_form_size: '{{ISFORMSIZE ? 1 : 0}}',
    is_color: '{{ISCOLOR ? 1 :0}}',
    is_accessory: '{{ISACCESSORY ? 1 :0}}',
    is_component: '{{ISCOMPONENT ? 1 :0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    color_hex: '{{#? COLORHEX}}',
};
const listAttributeValues = (attributeValues = []) => {
    let transform = new Transform(templateAttributeValues);
    return transform.transform(attributeValues, [
        'attribute_values_id',
        'attribute_values',
        'product_attribute_id',
        'attribute_description',
        'attribute_image',
        'tailor_attribute_history_id',
        'tailor_attribute_id',
        'is_form_size',
        'is_color',
        'is_component',
        'is_system',
        'color_hex'
    ]);
};

const templateOptions = {
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    is_form_size: '{{ISFORMSIZE ? 1 : 0}}',
};

const options = (manufacturer = []) => {
    let transform = new Transform(templateOptions);
    return transform.transform(manufacturer, ['id', 'name', 'is_form_size']);
};

module.exports = {
    options,
    detail,
    list,
    listAttributeValues,
};
