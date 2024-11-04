const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    material_id: '{{#? MATERIALID}}',
    material_name: '{{#? MATERIALNAME}}',
    material_code: '{{#? MATERIALCODE}}',
    alt_name: '{{#? ALTNAME}}',
    material_show_name: '{{#? MATERIALSHOWNAME}}',
    material_show_name_en: '{{#? MATERIALSHOWNAMEEN}}',
    material_group_id: '{{#? MATERIALGROUPID}}',

    origin_id: '{{#? ORIGINID}}',
    origin_name: '{{#? ORIGINNAME}}',
    supplier_id: '{{#? SUPPLIERID}}',
    supplier_name: '{{#? SUPPLIERNAME}}',
    unit_id: '{{#? UNITID}}',
    unit_name: '{{#? UNITNAME}}',
    manufacturer_id: '{{#? MANUFACTURERID}}',
    manufacturer_name: '{{#? MANUFACTURERNAME}}',
    description: '{{#? DESCRIPTION}}',
    is_active: '{{ISACTIVE ? 1 : 0}}',
    created_user: '{{#? CREATEDUSER}}',
    created_date: '{{#? CREATEDDATE}}',
    updated_user: '{{#? UPDATEDUSER}}',
    updated_date: '{{#? UPDATEDDATE}}',
    is_deleted: '{{#? ISDELETED}}',
    deleted_user: '{{#? DELETEDUSER}}',
    deleted_date: '{{#? DELETEDDATE}}',
    id: '{{#? ID}}',
    name: '{{#? NAME}}',
    material_attribute_values_id: '{{#? MATERIALATTRIBUTEVALUESID}}',
    product_attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
    attribute_values: '{{#? ATTRIBUTEVALUES}}',
    attribute_values_id: '{{#? ATTRIBUTEVALUESID}}',
    mtr_inventory_id: '{{#? MTRINVENTORYID}}',
    is_system: '{{ISSYSTEM ? 1 : 0}}',
    material_group_name: '{{#? MATERIALGROUPNAME}}',
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    number: '{{#? NUMBER}}',
    quantity: '{{#? QUANTITY}}',
    product_id: '{{#? PRODUCTID}}',
};

const templatePicture = {
    material_picture_id: '{{#? MATERIALPICTUREID}}',
    picture_url: [
        {
            '{{#if PICTUREURL}}': `${config.domain_cdn}{{PICTUREURL}}`,
        },
        {
            '{{#else}}': null,
        },
    ],
    picture_alias: '{{#? PICTUREALIAS}}',
    is_default: '{{ISDEFAULT ? 1 : 0}}',
    material_id: '{{#? MATERIALID}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'material_id',
        'material_code',
        'material_name',
        'origin_id',
        'origin_name',
        'unit_id',
        'unit_name',
        'manufacturer_id',
        'manufacturer_name',
        'material_group_id',
        'description',
        'is_active',
        'is_system',
    ]);
};

const list = (users = []) => {
    return transform.transform(users, [
        'material_id',
        'material_name',
        'material_code',
        'material_group_name',
        'manufacturer_name',
        'picture_url',
        'is_active',
        'created_date',
        'created_user',
        'number',
    ]);
};

const listAll = (area) => {
    return transform.transform(area, ['id', 'name']);
};

const listPicture = (pictures = []) => {
    let transform = new Transform(templatePicture);
    return transform.transform(pictures, [
        'material_id',
        'picture_url',
        'picture_alias',
        'is_default',
        'material_picture_id',
    ]);
};

const listDefaultAccounts = (data = []) => {
    const templateDefaultAccounts = {
        material_default_account_id: '{{#? MATERIALDEFAULTACCOUNTID}}',
        material_id: '{{#? MATERIALID}}',
        accounting_account_id: '{{#? ACCOUNTINGACCOUNTID}}',
        type: '{{#? TYPE}}',
    };

    let transform = new Transform(templateDefaultAccounts);

    return transform.transform(data, ['material_default_account_id', 'material_id', 'accounting_account_id', 'type']);
};

const listMetaAttr = (data = []) => {
    const transform = new Transform({
        attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        attribute_name: '{{#? ATTRIBUTENAME}}',
        unit_name: '{{#? UNITNAME}}',
        value: {
            value: '{{#? ATTRIBUTEVALUESID*1}}',
            label: '{{#? ATTRIBUTEVALUES}}',
        },
    });

    return transform.transform(data, ['attribute_id', 'attribute_name', 'unit_name', 'value']);
};

const mateSubUnit = (mate) => {
    return transform.transform(mate, [
        'material_sub_unit_id',
        'sub_unit_id',
        'sub_unit_name',
        'material_id',
        'density_value',
        'main_unit_id',
        'main_unit_name',
    ]);
};

const mateInventory = (data = []) => {
    const transform = new Transform({
        pro_inventory_id: '{{#? PROINVENTORYID}}',
        date_from: '{{#? DATEFROM}}',
        date_to: '{{#? DATETO}}',
        quantity_in_stock_min: '{{QUANTITYINSTOCKMIN ? QUANTITYINSTOCKMIN : 0}}',
        quantity_in_stock_max: '{{QUANTITYINSTOCKMAX ? QUANTITYINSTOCKMAX : 0}}',
        unit_id: '{{#? parseInt(UNITID)}}',
        is_force_out: '{{ISFORCEOUT ? 1 : 0}}',
        max_storage_time: '{{MAXSTORAGETIME ? MAXSTORAGETIME : 0}}',
        store_id: '{{#? parseInt(STOREID)}}',
        stock_type_id: '{{#? parseInt(STOCKTYPEID)}}',
        pro_inventory_type: '{{#? PROINVENTORYTYPE}}',
    });

    return transform.transform(data, [
        'pro_inventory_id',
        'date_from',
        'date_to',
        'quantity_in_stock_min',
        'quantity_in_stock_max',
        'unit_id',
        'is_force_out',
        'max_storage_time',
        'store_id',
        'stock_type_id',
        'pro_inventory_type',
    ]);
};

const options = (data) => {
    return transform.transform(data, ['id', 'name']);
};

const optionsStock = (data) => {
    return transform.transform(data, ['stocks_id', 'stocks_name', 'stocks_code']);
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

const listAttributeValues = (data = []) => {
    let transform = new Transform({
        attribute_id: '{{#? PRODUCTATTRIBUTEID}}',
        id: '{{#? ID}}',
        name: '{{#? NAME}}',
        value: '{{#? ID}}',
        label: '{{#? NAME}}',
    });
    return transform.transform(data, ['attribute_id', 'id', 'name', 'value', 'label']);
};

const listByProductID = (data) =>
    transform.transform(data, [
        'product_id',
        'material_id',
        'material_name',
        'material_code',
        'material_group_name',
        'manufacturer_name',
        'picture_url',
        'quantity',
    ]);

module.exports = {
    detail,
    list,
    listAll,
    listPicture,
    listMetaAttr,
    mateSubUnit,
    mateInventory,
    options,
    optionsStock,
    listAttributes,
    listAttributeValues,
    listByProductID,
    listDefaultAccounts,
};
