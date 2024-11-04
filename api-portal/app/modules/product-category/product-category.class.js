const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    product_category_id: '{{#? PRODUCTCATEGORYID}}',
    category_name: '{{#? CATEGORYNAME}}',
    parent_id: '{{#? PARENTID}}',
    parent_name: '{{#? PARENTNAME}}',
    vat_id: '{{#? VATID}}',
    category_type: '{{#? CATEGORYTYPE}}',
    company_id: '{{#? COMPANYID + ""}}',
    company_name: '{{#? COMPANYNAME}}',
    description: '{{#? DESCRIPTIONS}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    created_date_view: '{{#? CREATEDDATEVIEW}}',
    // CREATEDDATEVIEW
    is_active: '{{ISACTIVE ? 1 : 0}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    is_show_web: '{{ISSHOWWEB ? 1 : 0}}',
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    created_user_avatar: [
        {
            '{{#if CREATEDUSERAVATAR}}': `${config.domain_cdn}{{CREATEDUSERAVATAR}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
};

let transform = new Transform(template);

const list = (data = []) => {
    return transform.transform(data, [
        'product_category_id',
        'category_name',
        'parent_name',
        'company_name',
        'created_user',
        'is_active',
        'created_date',
        'created_user_avatar',
        'picture_url',
        'is_show_web',
        'created_date_view'
    ]);
};

const options = (data = []) => {
    let transform = new Transform({
        value: '{{#? ID}}',
        title: '{{#? NAME}}',
        id: '{{#? ID}}',
        pId: '{{PARENTID ? PARENTID : 0}}',
        isLeaf: '{{ISLEAF ? 1 : 0}}',
    });
    return transform.transform(data, ['value', 'title', 'id', 'pId', 'isLeaf']);
};

const listAttributes = (data = []) => {
    let transform = new Transform({
        attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_name: '{{#? ATTRIBUTENAME}}',
        description: '{{#? ATTRIBUTEDESCRIPTION}}',
        unit_name: '{{#? UNITNAME}}',
        attribute_type: '{{#? ATTRIBUTETYPE}}',
    });
    return transform.transform(data, ['attribute_id', 'attribute_name', 'description', 'unit_name', 'attribute_type']);
};

const listMaterial = (data = []) => {
    let transform = new Transform({
        product_material_id: '{{#? PRODUCTCATMATERIALID}}',
        material_id: '{{#? parseInt(MATERIALID)}}',
        material_group_name: '{{#? MATERIALGROUPNAME}}',
        unit_name: '{{#? UNITNAME}}',
        number: '{{#? NUMBER}}',
        note: '{{#? NOTE}}',
    });
    return transform.transform(data, [
        'product_material_id',
        'material_id',
        'material_group_name',
        'unit_name',
        'number',
        'note',
    ]);
};

const detail = (data) => {
    const transform = new Transform({
        ...template,
        view_function_id: '{{#? parseInt(VIEWFUNCTIONID)}}',
        edit_function_id: '{{#? parseInt(EDITFUNCTIONID)}}',
        delete_function_id: '{{#? parseInt(DELETEFUNCTIONID)}}',
        add_function_id: '{{#? parseInt(ADDFUNCTIONID)}}',
    });
    return transform.transform(data, [
        'product_category_id',
        'category_name',
        'company_id',
        'company_name',
        'description',
        'parent_id',
        'parent_name',
        'vat_id',
        'category_type',
        'add_function_id',
        'view_function_id',
        'edit_function_id',
        'delete_function_id',
        'is_active',
        'is_show_web',
        'is_system',
    ]);
};

const pictureUrls = (list = []) => {
    const transform = new Transform(template);
    return transform.transform(list, ['picture_url']);
};

const optionsAttribute = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label']);
};

const optionsModel = (data = []) => {
    let transform = new Transform({
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
    });
    return transform.transform(data, ['id', 'name', 'value', 'label']);
};

const material = (data = []) => {
    let transform = new Transform({
        material_id: '{{#? MATERIALID}}',
        material_name: '{{#? MATERIALNAME}}',
        material_group_name: '{{#? MATERIALGROUPNAME}}',
        unit_name: '{{#? UNITNAME}}',
    });
    return transform.transform(data, ['material_id', 'material_name', 'material_group_name', 'unit_name']);
};

module.exports = {
    list,
    options,
    listAttributes,
    listMaterial,
    detail,
    pictureUrls,
    optionsAttribute,
    optionsModel,
    material,
};
