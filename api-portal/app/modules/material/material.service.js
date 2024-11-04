const materialClass = require('../material/material.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
var xl = require('excel4node');
const { getOptionsCommon } = require('../global/global.service');
const API_CONST = require('../../common/const/api.const');
const excelHelper = require('../../common/helpers/excel.helper');
const readXlsxFile = require('read-excel-file/node');
const stringHelper = require('../../common/helpers/string.helper');

/**
 * Get list MTR_MATERIAL
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListMaterial = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ORIGINID', apiHelper.getValueFromObject(queryParams, 'origin_id'))
            .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
            .input('MATERIALGROUPID', apiHelper.getValueFromObject(queryParams, 'material_group_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.MTR_MATERIAL_GETLIST_ADMINWEB);

        const materials = data.recordsets[0];
        return new ServiceResponse(true, '', {
            data: materialClass.list(materials),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'MaterialService.getListMaterial' });
        return new ServiceResponse(true, '', {});
    }
};

const INVENTORY_TYPE = {
    BASE: 1,
    MIN: 2,
};

const gcd = (a, b) => {
    return b ? gcd(b, a % b) : a;
};
var decimalToFraction = function (_decimal) {
    if (_decimal == 1) {
        return {
            top: 1,
            bottom: 1,
            display: 1 + ':' + 1,
        };
    } else {
        var top = _decimal.toString().replace(/\d+[.]/, '');
        var bottom = Math.pow(10, top.length);
        if (_decimal > 1) {
            top = +top + Math.floor(_decimal) * bottom;
        }
        var x = gcd(top, bottom);
        return {
            top: top / x,
            bottom: bottom / x,
        };
    }
};

// detail Company type
const detailMaterial = async (materialId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MATERIALID', materialId)
            .execute(PROCEDURE_NAME.MTR_MATERIAL_GETBYID_ADMINWEB);
        let material = data.recordset;

        // list picture
        const dataPicList = await pool
            .request()
            .input('MATERIALID', materialId)
            .execute(PROCEDURE_NAME.MTR_MATERIALIMAGES_GETBYID_ADMINWEB);
        let picturesList = dataPicList.recordset;

        // list attribute
        const dataMateAttrList = await pool
            .request()
            .input('MATERIALID', materialId)
            .execute(PROCEDURE_NAME.MTR_MATERIALATTRIBUTEVALUES_GETBYMATERIALID_ADMINWEB);
        let mateAttrList = dataMateAttrList.recordset;

        // list default accounts
        const dataDefaultAccounts = await pool
            .request()
            .input('MATERIALID', materialId)
            .execute(PROCEDURE_NAME.MTR_MATERIALDEFAULTACCOUNTS_GETBYMATERIALID_ADMINWEB);
        let defaultAccountList = dataDefaultAccounts.recordset;

        // list stocks inventory
        const dataMateInventory = await pool
            .request()
            .input('MATERIALID', materialId)
            .execute(PROCEDURE_NAME.MTR_MATERIALINVENTORY_GETBYMATERIALID_ADMINWEB);
        let mateInventory = dataMateInventory.recordset;

        // If exists
        if (material && material.length > 0) {
            material = materialClass.detail(material[0]);
            material.origin_id = { value: material.origin_id, label: material.origin_name };
            material.unit_id = { value: material.unit_id, label: material.unit_name };
            material.manufacturer_id = { value: material.manufacturer_id, label: material.manufacturer_name };
            material.default_account_list = materialClass.listDefaultAccounts(defaultAccountList);

            material.images = materialClass.listPicture(picturesList);

            material.attributes = (materialClass.listMetaAttr(mateAttrList) || []).reduce((attributesGr, attribute) => {
                const idx = attributesGr.findIndex((x) => x.attribute_id == attribute.attribute_id);
                if (idx >= 0) {
                    // Update attributes
                    attributesGr[idx].values.push(attribute.value);
                } else attributesGr.push({ ...attribute, values: [attribute.value] });
                return attributesGr;
            }, []);

            // Get attributes values options on row
            for (let i = 0; i < material.attributes.length; i++) {
                const data = await pool
                    .request()
                    .input('PRODUCTATTRIBUTEID', material.attributes[i].attribute_id)
                    .execute('MD_PRODUCT_GetListAttributeValues_AdminWeb');
                material.attributes[i].attribute_values = materialClass.listAttributeValues(data.recordset);
            }

            // Get stock inventory (base and min)
            const inventories = materialClass.mateInventory(mateInventory);
            material.base_inventory_list = (inventories || []).filter(
                (x) => x.pro_inventory_type === INVENTORY_TYPE.BASE,
            );

            material.min_inventory_list = (inventories || []).filter(
                (x) => x.pro_inventory_type === INVENTORY_TYPE.MIN,
            );
            material.min_inventory_list = await Promise.all(
                material.min_inventory_list.map(async (item) => {
                    const stockTypeOptionsRes = await getOptionsCommon({
                        type: 'stockTypeByStore',
                        parent_id: item.store_id,
                    });
                    if (stockTypeOptionsRes.isFailed()) {
                        throw stockTypeOptionsRes;
                    }
                    const stockTypeOptions = stockTypeOptionsRes.getData();

                    return { ...item, stock_type_options: stockTypeOptions };
                }),
            );

            return new ServiceResponse(true, '', material);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'materialService.getListMaterial' });
        return new ServiceResponse(false, e.message);
    }
};

//Delete company type
const deleteMaterial = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', [apiHelper.getValueFromObject(bodyParams, 'ids')])
            .input('NAMEID', 'MATERIALID')
            .input('TABLENAME', 'MTR_MATERIAL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, RESPONSE_MSG.MATERIAL.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'materialService.deleteMaterial' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateMaterial = async (bodyParams) => {
    const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');

    let images = apiHelper.getValueFromObject(bodyParams, 'images');
    if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            let picture_url;
            if (!images[i].picture_url) {
                if (fileHelper.isBase64(images[i])) {
                    picture_url = await fileHelper.saveBase64(null, images[i]);
                }
            }
            picture_url = picture_url || images[i]?.picture_url?.replace(config.domain_cdn, '');

            if (picture_url) images[i] = { picture_url };
            // else return new ServiceResponse(false, RESPONSE_MSG.FILEATTACTMENT.UPLOAD_FAILED);
        }
    }

    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        // CHECKCODE
        // const dataCheckName = await pool
        //     .request()
        //     .input('MATERIALID', apiHelper.getValueFromObject(bodyParams, 'material_id'))
        //     .input('MATERIALCODE', apiHelper.getValueFromObject(bodyParams, 'material_code'))
        //     .execute(PROCEDURE_NAME.MTR_MATERIAL_CHECKCODE_ADMINWEB);
        // if (dataCheckName.recordset && dataCheckName.recordset[0].RESULT == 1) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, RESPONSE_MSG.MATERIAL.EXISTS_CODE, null);
        // }

        // insert mtr_material
        const data = new sql.Request(transaction);
        const dataResult = await data
            .input('MATERIALID', apiHelper.getValueFromObject(bodyParams, 'material_id'))
            .input('MATERIALCODE', apiHelper.getValueFromObject(bodyParams, 'material_code'))
            .input('MATERIALNAME', apiHelper.getValueFromObject(bodyParams, 'material_name'))
            .input('MATERIALGROUPID', apiHelper.getValueFromObject(bodyParams, 'material_group_id'))
            .input('MANUFACTURERID', apiHelper.getValueFromObject(bodyParams, 'manufacturer_id'))
            .input('ORIGINID', apiHelper.getValueFromObject(bodyParams, 'origin_id'))
            .input('UNITID', apiHelper.getValueFromObject(bodyParams, 'unit_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MTR_MATERIAL_CREATEORUPDATE_ADMINWEB);
        const materialId = dataResult.recordset[0]?.RESULT;
        if (materialId <= 0) {
            await transaction.rollback();
            console.log('>>> message', e.message);

            return new ServiceResponse(false, e.message);
        }

        // delete picture
        const requestPictureDel = new sql.Request(transaction);
        const resultPictureDel = await requestPictureDel
            .input('MATERIALID', materialId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MTR_MATERIALIMAGES_DELETE_ADMINWEB);
        if (resultPictureDel.recordset.RESULT <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.MATERIAL.CREATE_FAILED);
        }

        // insert picture
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const item = images[i];

                const requestSavePicture = new sql.Request(transaction);
                const resultSavePicture = await requestSavePicture // eslint-disable-line no-await-in-loop
                    .input('MATERIALID', materialId)
                    .input('MATERIALPICTUREID', apiHelper.getValueFromObject(item, 'material_picture_id'))
                    .input('PICTUREURL', apiHelper.getValueFromObject(item, 'picture_url'))
                    .input('ISDEFAULT', apiHelper.getValueFromObject(item, 'is_default'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute(PROCEDURE_NAME.MTR_MATERIALIMAGES_CREATE_ADMINWEB);
                const materialPicId = resultSavePicture.recordset[0].RESULT;
                if (materialPicId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, RESPONSE_MSG.MATERIAL.CREATE_FAILED);
                }
            }
        }

        // delete MTR_MATERIALATTRIBUTEVALUES thuộc tính
        const requestDeleteMateAttrValues = new sql.Request(transaction);
        const dataDeleteMateAttrValues = await requestDeleteMateAttrValues
            .input('MATERIALID', materialId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MTR_MATERIALATTRIBUTEVALUES_DELETE_ADMINWEB);
        const resultDeleteMateAttrValues = dataDeleteMateAttrValues.recordset[0].RESULT;
        if (resultDeleteMateAttrValues <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.MATERIAL.UPDATE_FAILED);
        }

        // insert MTR_MATERIALATTRIBUTEVALUES
        const attributes = apiHelper.getValueFromObject(bodyParams, 'attributes');
        if (attributes && attributes.length) {
            for (let i = 0; i < attributes.length; i++) {
                const attribute = attributes[i];
                if (!attribute.values || !attribute.values.length) attribute.values = [{}];
                for (let j = 0; j < attribute.values.length; j++) {
                    const values = attribute.values[j];
                    const requestCreateAttribute = new sql.Request(transaction);
                    const resultCreateAttribute = await requestCreateAttribute
                        .input('MATERIALID', materialId)
                        .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(attributes[i], 'attribute_id'))
                        .input('ATTRIBUTEVALUESID', apiHelper.getValueFromObject(values, 'value'))
                        .input('ATTRIBUTEVALUES', apiHelper.getValueFromObject(values, 'label'))
                        .input(
                            'MATERIALATTRIBUTEVALUESID',
                            apiHelper.getValueFromObject(attributes[i], 'material_attribute_values_id'),
                        )
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('MTR_MATERIALATTRIBUTEVALUES_Create_AdminWeb');

                    const result = resultCreateAttribute.recordset[0].RESULT;
                    if (result <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Thêm thuộc tính túi bao bì không thành công.');
                    }
                }
            }
        }

        // insert or update default account list
        const defaultAccounts = apiHelper.getValueFromObject(bodyParams, 'default_account_list', []);
        if (defaultAccounts && defaultAccounts.length > 0) {
            const result = await _createOrUpdateDefaultAccounts(defaultAccounts, materialId, authName, transaction);
            if (!result) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Thêm tài khoản ngầm định thất bại !');
            }
        }

        // delete MTR_MATERIALINVENTORY
        const requestDeleteMateInventory = new sql.Request(transaction);
        const dataDeleteMateInventory = await requestDeleteMateInventory
            .input('MATERIALID', materialId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MTR_MATERIALINVENTORY_DELETE_ADMINWEB);
        const resultDeleteMateInventory = dataDeleteMateInventory.recordset[0].RESULT;
        if (resultDeleteMateInventory <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.MATERIAL.UPDATE_FAILED);
        }

        // insert MTR_MATERIALINVENTORY
        const base_inventory_list = apiHelper.getValueFromObject(bodyParams, 'base_inventory_list');
        if (base_inventory_list && base_inventory_list.length) {
            for (let i = 0; i < base_inventory_list.length; i++) {
                const requestCreateBaseInventory = new sql.Request(transaction);
                const resultCreateBaseInventory = await requestCreateBaseInventory
                    .input('MATERIALID', materialId)
                    .input('MTRINVENTORYID', apiHelper.getValueFromObject(base_inventory_list[i], 'mtr_inventory_id'))
                    .input('UNITID', apiHelper.getValueFromObject(base_inventory_list[i], 'unit_id'))
                    .input('DATEFROM', apiHelper.getValueFromObject(base_inventory_list[i], 'date_from'))
                    .input('DATETO', apiHelper.getValueFromObject(base_inventory_list[i], 'date_to'))
                    .input(
                        'QUANTITYINSTOCKMAX',
                        apiHelper.getValueFromObject(base_inventory_list[i], 'quantity_in_stock_max'),
                    )
                    .input(
                        'QUANTITYINSTOCKMIN',
                        apiHelper.getValueFromObject(base_inventory_list[i], 'quantity_in_stock_min'),
                    )
                    .input('MAXSTORAGETIME', apiHelper.getValueFromObject(base_inventory_list[i], 'max_storage_time'))
                    .input('ISFORCEOUT', apiHelper.getValueFromObject(base_inventory_list[i], 'is_force_out'))
                    .input('PROINVENTORYTYPE', INVENTORY_TYPE.BASE)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('MTR_MATERIALINVENTORY_Create_AdminWeb');

                const result = resultCreateBaseInventory.recordset[0].RESULT;
                if (result <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm hạn mức tồn kho cơ bản không thành công.');
                }
            }
        }

        const min_inventory_list = apiHelper.getValueFromObject(bodyParams, 'min_inventory_list');
        if (min_inventory_list && min_inventory_list.length) {
            for (let i = 0; i < min_inventory_list.length; i++) {
                const requestCreateMinInventory = new sql.Request(transaction);
                const resultCreateMinInventory = await requestCreateMinInventory
                    .input('MATERIALID', materialId)
                    .input('MTRINVENTORYID', apiHelper.getValueFromObject(min_inventory_list[i], 'mtr_inventory_id'))
                    .input('UNITID', apiHelper.getValueFromObject(min_inventory_list[i], 'unit_id'))
                    .input('STOREID', apiHelper.getValueFromObject(min_inventory_list[i], 'store_id'))
                    .input('STOCKTYPEID', apiHelper.getValueFromObject(min_inventory_list[i], 'stock_type_id'))
                    .input('DATEFROM', apiHelper.getValueFromObject(min_inventory_list[i], 'date_from'))
                    .input('DATETO', apiHelper.getValueFromObject(min_inventory_list[i], 'date_to'))
                    .input(
                        'QUANTITYINSTOCKMAX',
                        apiHelper.getValueFromObject(min_inventory_list[i], 'quantity_in_stock_max'),
                    )
                    .input(
                        'QUANTITYINSTOCKMIN',
                        apiHelper.getValueFromObject(min_inventory_list[i], 'quantity_in_stock_min'),
                    )
                    .input('MAXSTORAGETIME', apiHelper.getValueFromObject(min_inventory_list[i], 'max_storage_time'))
                    .input('ISFORCEOUT', apiHelper.getValueFromObject(min_inventory_list[i], 'is_force_out'))
                    .input('PROINVENTORYTYPE', INVENTORY_TYPE.MIN)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('MTR_MATERIALINVENTORY_Create_AdminWeb');

                const result = resultCreateMinInventory.recordset[0].RESULT;
                if (result <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm hạn mức tồn tối thiểu không thành công.');
                }
            }
        }

        if (!materialId) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.MATERIAL.UPDATE_FAILED);
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, 'update success', materialId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'materialService.createOrUpdateMaterial' });
        return new ServiceResponse(false, e.message ?? RESPONSE_MSG.MATERIAL.UPDATE_FAILED);
    }
};

const _createOrUpdateDefaultAccounts = async (accountingList, materialId, authName, transaction) => {
    const defautlAccountIds = accountingList
        .filter((accounting) => accounting.material_default_account_id)
        ?.map((accounting) => accounting.material_default_account_id);

    try {
        // delete unnessary default accounts
        if (defautlAccountIds.length > 0) {
            const deleteRequest = new sql.Request(transaction);
            const deleteResult = await deleteRequest
                .input('LISTID', defautlAccountIds)
                .input('MATERIALID', materialId)
                .input('DELETEDUSER', authName)
                .execute('MTR_MATERIAL_DEFAULTACCOUNT_DeleteAllExcept_AdminWeb');
            if (!deleteResult.recordset[0]?.RESULT) {
                return false;
            }
        }

        // insert or update default account list
        for (let accountingAccount of accountingList) {
            const accountingRequest = new sql.Request(transaction);
            const resultChild = await accountingRequest
                .input(
                    'MATERIALDEFAULTACCOUNTID',
                    apiHelper.getValueFromObject(accountingAccount, 'material_default_account_id'),
                )
                .input('MATERIALID', materialId)
                .input('ACCOUNTINGACCOUNTID', apiHelper.getValueFromObject(accountingAccount, 'accounting_account_id'))
                .input('TYPE', apiHelper.getValueFromObject(accountingAccount, 'type'))
                .input('CREATEDUSER', authName)
                .execute('MTR_MATERIAL_DEFAULTACCOUNT_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                return false;
            }
        }

        return true;
    } catch (error) {
        logger.error(error, { function: 'materialService._createOrUpdateDefaultAccounts' });
        return false;
    }
};

const getOptionsProAttrMaterial = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MATERIALCATEGORYID', apiHelper.getValueFromObject(queryParams, 'material_category_id'))
            .execute(PROCEDURE_NAME.MTR_MATERIAL_GETPROMATERIALATTRIBUTELIST_ADMINWEB);
        let ProAttrMaterialList = data.recordset;
        return new ServiceResponse(true, '', {
            data: materialClass.listAll(ProAttrMaterialList),
        });
    } catch (e) {
        logger.error(e, { function: 'materialService.getOptionsProAttrMaterial' });
        return new ServiceResponse(false, e.message);
    }
};

const getProAttrMateValue = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(queryParams, 'product_attribute_id'))
            .execute(PROCEDURE_NAME.MTR_MATERIAL_GETPROMATERIALATTRVALUE_ADMINWEB);

        const res = {
            unit: materialClass.listAll(data.recordsets[1]),
            pro_attr_value: materialClass.listAll(data.recordsets[0]),
        };
        return new ServiceResponse(true, '', res);
    } catch (e) {
        logger.error(e, { function: 'materialService.getProAttrMateValue' });
        return new ServiceResponse(true, '', {
            unit: [],
            pro_attr_value: [],
        });
    }
};

const getListAttributes = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const modelId = apiHelper.getValueFromObject(queryParams, 'model_id');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .execute('MTR_MATERIAL_GetListAttribute_AdminWeb');

        let attributes = materialClass.listAttributes(data.recordset);
        const attributeValues = materialClass.listAttributeValues(data.recordsets[1]);
        attributes = attributes.map((attr, i) => {
            return {
                ...attr,
                attribute_values: (attributeValues || []).filter((x) => x.attribute_id == attr.attribute_id),
            };
        });

        return new ServiceResponse(true, '', {
            data: attributes,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'ProductService.getListAttributes' });
        return new ServiceResponse(true, '', {});
    }
};

const createAttribute = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        // Begin transaction
        await transaction.begin();

        const attributeName = apiHelper.getValueFromObject(body, 'attribute_name');

        const checkAttributeName = await pool
            .request()
            .input('ATTRIBUTENAME', attributeName)
            .execute('MD_PRODUCT_CheckAttributeName_AdminWeb');

        if (checkAttributeName.recordset[0].RESULT) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tên thuộc tính sản phẩm đã tồn tại.');
        }

        // Save Attribute
        const requestProductAttribute = new sql.Request(transaction);
        const resultProductAttribute = await requestProductAttribute
            .input('UNITID', apiHelper.getValueFromObject(body, 'unit_id'))
            .input('ATTRIBUTENAME', attributeName)
            .input('ATTRIBUTEDESCRIPTION', apiHelper.getValueFromObject(body, 'attribute_description'))
            .input('ISCOLOR', apiHelper.getValueFromObject(body, 'is_color'))
            .input('ISFORMSIZE', apiHelper.getValueFromObject(body, 'is_form_size'))
            .input('ISOTHER', apiHelper.getValueFromObject(body, 'is_other'))
            .input('ISACTIVE', 1)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('MTR_MATERIAL_CreateAttribute_AdminWeb');
        const product_attribute_id = resultProductAttribute.recordset[0].RESULT;
        if (product_attribute_id <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm thuộc tính sản phẩm không thành công');
        }

        const attribute_values = apiHelper.getValueFromObject(body, 'attribute_values', []);

        if (attribute_values.length > 0) {
            for (let i = 0; i < attribute_values.length; i++) {
                let item = attribute_values[i];
                let attribute_image = item.attribute_image;
                if (attribute_image) {
                    try {
                        item.attribute_image = await fileHelper.saveImage(attribute_image);
                    } catch (error) {
                        logger.error(error, { function: 'MaterialService.SaveAttributeImage' });
                    }
                }
                const requestChild = new sql.Request(transaction);
                const resultChild = await requestChild // eslint-disable-line no-await-in-loop
                    .input('PRODUCTATTRIBUTEID', product_attribute_id)
                    .input('ATTRIBUTEVALUES', apiHelper.getValueFromObject(item, 'attribute_value'))
                    .input('ATTRIBUTEDESCRIPTION', apiHelper.getValueFromObject(item, 'attribute_description'))
                    .input('ATTRIBUTEIMAGE', attribute_image)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .input('COLORHEX', apiHelper.getValueFromObject(item, 'color_hex'))
                    .execute('MTR_MATERIAL_CreateAttributeValue_AdminWeb');
                const child_id = resultChild.recordset[0].RESULT;
                if (child_id <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm giá trị thuộc tính không thành công');
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, '', {
            id: product_attribute_id,
            value: product_attribute_id,
            label: attributeName,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'MaterialService.createAttribute',
        });
        return new ServiceResponse(false, error.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MTR_MATERIAL_OPTIONS);
};

const exportExcel = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        queryParams.is_active = 2;
        const serviceRes = await getListMaterial(queryParams);
        const { data } = serviceRes.getData();

        let sheet = excelHelper.addWorksheet(
            new xl.Workbook(),
            'DANH SÁCH TÚI BAO BÌ',
            'Danh sách túi bao bì',
            [
                {
                    width: 7,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 20,
                    title: 'Mã túi bao bì',
                    field: 'material_code',
                },
                {
                    width: 30,
                    title: 'Tên túi bao bì',
                    field: 'material_name',
                },
                {
                    width: 23,
                    title: 'Nhóm túi bao bì',
                    field: 'material_group_name',
                },
                {
                    width: 20,
                    title: 'Hãng',
                    field: 'manufacturer_name',
                },
                {
                    width: 20,
                    title: 'Ngày tạo',
                    field: 'created_date',
                },
                {
                    width: 20,
                    title: 'Trạng thái',
                    field: 'is_active',
                    formatter: (item, index) => (item.is_active ? 'Kích hoạt' : 'Ẩn'),
                },
            ],
            data,
        );

        return new ServiceResponse(true, '', sheet);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            function: 'MaterialService.exportExcel',
        });
        return new ServiceResponse(false, error.message);
    }
};

const downloadTemplate = async () => {
    try {
        // Material Group
        const materialGroupOptionsRes = await getOptionsCommon({ type: 'materialGroup' });
        if (materialGroupOptionsRes.isFailed()) {
            throw materialGroupOptionsRes;
        }
        const materialGroupOptions = materialGroupOptionsRes.getData();

        // Manufacturer
        const manufacturerOptionsRes = await getOptionsCommon({ type: 'manufacturer' });
        if (manufacturerOptionsRes.isFailed()) {
            throw manufacturerOptionsRes;
        }
        const manufacturerOptions = manufacturerOptionsRes.getData();

        // Origin
        const originOptionsRes = await getOptionsCommon({ type: 'origin' });
        if (originOptionsRes.isFailed()) {
            throw originOptionsRes;
        }
        const originOptions = originOptionsRes.getData();

        // Unit
        const unitOptionsRes = await getOptionsCommon({ type: 'unit' });
        if (unitOptionsRes.isFailed()) {
            throw unitOptionsRes;
        }
        const unitOptions = unitOptionsRes.getData();

        let sheet = excelHelper.addWorksheet(
            new xl.Workbook(),
            'DANH SÁCH TÚI BAO BÌ',
            'Danh sách túi bao bì',
            [
                {
                    width: 7,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 20,
                    title: 'Mã túi bao bì*',
                    field: 'material_code',
                },
                {
                    width: 30,
                    title: 'Tên túi bao bì*',
                    field: 'material_name',
                },
                {
                    width: 23,
                    title: 'Nhóm túi bao bì*',
                    field: 'material_group_id',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách nhóm túi bao bì'!$C$3:$C$${2 + materialGroupOptions?.length}`],
                    },
                },
                {
                    width: 20,
                    title: 'Hãng',
                    field: 'manufacturer_id',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách hãng'!$C$3:$C$${2 + manufacturerOptions?.length}`],
                    },
                },
                {
                    width: 20,
                    title: 'Xuất sứ',
                    field: 'origin_id',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách xuất sứ'!$C$3:$C$${2 + originOptions?.length}`],
                    },
                },
                {
                    width: 20,
                    title: 'Đơn vị tính',
                    field: 'unit_id',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách đơn vị'!$C$3:$C$${2 + unitOptions?.length}`],
                    },
                },
                {
                    width: 30,
                    title: 'Mô tả',
                    field: 'description',
                },
                {
                    width: 13,
                    title: 'Trạng thái',
                    field: 'is_active',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: ['1-Kích hoạt, 0-Ẩn'],
                    },
                },
            ],
            [
                {
                    material_code: 'Bắt buộc nhập',
                    material_name: 'Bắt buộc nhập',
                    material_group_id: 'Bắt buộc nhập',
                    manufacturer_id: 'Hãng',
                    origin_id: 'Xuất sứ',
                    unit_id: 'Đơn vị tính',
                    is_active: '1-Kích hoạt',
                },
            ],
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            'DANH SÁCH NHÓM TÚI BAO BÌ',
            'Danh sách nhóm túi bao bì',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 75,
                    title: 'Tên nhóm túi bao bì',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.name}`,
                },
            ],
            materialGroupOptions,
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            'DANH SÁCH HÃNG',
            'Danh sách hãng',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 75,
                    title: 'Tên hãng',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.name}`,
                },
            ],
            manufacturerOptions,
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            'DANH SÁCH XUẤT SỨ',
            'Danh sách xuất sứ',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 75,
                    title: 'Tên xuất sứ',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.name}`,
                },
            ],
            originOptions,
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            'DANH SÁCH ĐƠN VỊ',
            'Danh sách đơn vị',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 75,
                    title: 'Tên xuất đơn vị',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.name}`,
                },
            ],
            unitOptions,
        );

        return new ServiceResponse(true, '', sheet);
    } catch (error) {
        logger.error(error, { function: 'Service.downloadTemplateBudgetPlan' });
        return new ServiceResponse(false, error);
    }
};

const getIdImport = (value) => {
    if (!value) return null;
    const id = +value.split('-')[0];
    return stringHelper.checkValidId(id) ? id : null;
} ;

const clearInput = (value = '') => value.trim();

const checkImport = (material, pool = null) => {
    let errmsg = [];
    let {
        material_code,
        material_name,
        material_group_id,
        manufacturer_id,
        origin_id,
        unit_id,
        description,
        is_active,
    } = material || {};

    material_group_id = getIdImport(material_group_id);
    manufacturer_id = getIdImport(manufacturer_id);
    origin_id = getIdImport(origin_id);
    unit_id = getIdImport(unit_id);
    is_active = is_active ? parseInt(is_active.split('-')[0]) === 1 : true;

    if (!material_code) errmsg.push('Mã túi bao bì là bắt buộc');
    if (!material_name) errmsg.push('Tên túi bao bì là bắt buộc');
    if (!material_group_id) errmsg.push('Nhóm túi bao bì là bắt buộc');

    let item = {
        material_code: clearInput(material_code),
        material_name: clearInput(material_name),
        material_group_id,
        manufacturer_id,
        origin_id,
        unit_id,
        description,
        is_active,
    };

    return { errmsg, item };
};

const importExcel = async (body, file, auth) => {
    try {
        const auth_name = apiHelper.getValueFromObject(auth, 'user_name');
        const rows = await readXlsxFile(file.buffer);
        const columns = {
            stt: 'STT',
            material_code: 'Mã túi bao bì*',
            material_name: 'Tên túi bao bì*',
            material_group_id: 'Nhóm túi bao bì*',
            manufacturer_id: 'Hãng',
            origin_id: 'Xuất sứ',
            unit_id: 'Đơn vị tính',
            description: 'Mô tả',
            is_active: 'Trạng thái',
        };
        let data = excelHelper.getValueExcel(rows, columns);
        // Loại bỏ dòng title
        if (data.length > 0) data.shift();

        let pool = await mssql.pool;
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        for (let i = 0; i < data.length; i++) {
            import_total += 1;
            let material = data[i];
            let { errmsg, item } = checkImport(material, pool);

            if (errmsg && errmsg.length > 0) {
                import_errors.push({
                    material,
                    errmsg,
                    i,
                });
            } else {
                try {
                    let res = await createOrUpdateMaterial({ ...item, auth_name });
                    if (res.isFailed()) {
                        import_errors.push({
                            material,
                            errmsg: [res.getMessage()],
                            i,
                        });
                    }
                    import_data.push(res.getData());
                } catch (error) {
                    import_errors.push({
                        material,
                        errmsg: [error.message],
                        i,
                    });
                }
            }
        }

        return new ServiceResponse(true, '', { import_data, import_total, import_errors });
    } catch (e) {
        logger.error(e, { function: 'MaterialService.importExcel' });
        return new ServiceResponse(false, error);
    }
};

/**
 * Get list by product
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListByProduct = async (params) => {
    try {
        let products = apiHelper.getValueFromObject(params, 'products', []);
        products = products.reduce((acc, curr) => {
            const findIndex = acc.findIndex((p) => p.product_id == curr.product_id);
            if (findIndex === -1) {
                acc = [...acc, curr];
                console.log(acc);
            } else {
                acc[findIndex].quantity += curr.quantity;
            }
            return acc;
        }, []);
        const product_ids = products.map((item) => item.product_id);
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('PRODUCTIDS', product_ids)
            .execute('MTR_MATERIAL_GetListByProduct_AdminWeb');

        const materials = materialClass.listByProductID(data.recordset);

        for (let i = 0; i < materials.length; i++) {
            const quantity = products.find((product) => +product.product_id === +materials[i].product_id).quantity;
            materials[i].quantity *= quantity;
        }

        return new ServiceResponse(true, '', materials);
    } catch (e) {
        logger.error(e, { function: 'MaterialService.getListByProduct' });
        return new ServiceResponse(false, e, []);
    }
};

const gencode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MTR_MATERIAL_GenShiftCode_AdminWeb');
        const code = data.recordset[0];
        if (code) {
            return new ServiceResponse(true, '', code.material_code.trim());
        }
        return new ServiceResponse(false, '', null);
    } catch (error) {
        logger.error(error, {
            function: 'MaterialService.gencode',
        });

        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    getListMaterial,
    detailMaterial,
    deleteMaterial,
    createOrUpdateMaterial,
    getOptionsProAttrMaterial,
    getProAttrMateValue,
    getListAttributes,
    createAttribute,
    exportExcel,
    downloadTemplate,
    importExcel,
    getListByProduct,
    gencode,
};
