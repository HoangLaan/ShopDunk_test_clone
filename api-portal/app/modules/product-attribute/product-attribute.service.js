const productAttributeClass = require('../product-attribute/product-attribute.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const { saveBase64, isBase64 } = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListProductAttribute = async (queryParams = {}) => {
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
            .input('ATTRIBUTETYPE', apiHelper.getValueFromObject(queryParams, 'attribute_type'))
            .input('UNITID', apiHelper.getValueFromObject(queryParams, 'unit_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTE_GETLIST_ADMINWEB);

        const dataRecord = data.recordset;
        return new ServiceResponse(true, '', {
            data: productAttributeClass.list(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'ProductAttributeService.getListProductAttribute' });
        return new ServiceResponse(false, e.message);
    }
};

const createProductAttributeOrUpdate = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        // Begin transaction
        await transaction.begin();
        //Check attributeName

        const checkAttributeName = await pool
            .request()
            .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(body, 'product_attribute_id'))
            .input('ATTRIBUTENAME', apiHelper.getValueFromObject(body, 'attribute_name'))
            .input('ISCOMPONENT', apiHelper.getValueFromObject(body, 'is_component'))
            .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTE_CHECKNAME_ADMINWEB);
        if (checkAttributeName.recordset[0].RESULT == 2) {
            return new ServiceResponse(false, RESPONSE_MSG.PRODUCTATTRIBUTE.EXISTS_NAME_MATERIAL, null);
        } else if (checkAttributeName.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.PRODUCTATTRIBUTE.EXISTS_NAME, null);
        }

        // Save Product
        const requestProductAttribute = new sql.Request(transaction);
        const resultProductAttribute = await requestProductAttribute
            .input('PRODUCTATTRIBUTEID', apiHelper.getValueFromObject(body, 'product_attribute_id'))
            .input('UNITID', apiHelper.getValueFromObject(body, 'unit_id'))
            .input('ATTRIBUTENAME', apiHelper.getValueFromObject(body, 'attribute_name'))
            .input('ATTRIBUTEDESCRIPTION', apiHelper.getValueFromObject(body, 'attribute_description'))
            .input('ISFORMSIZE', apiHelper.getFilterBoolean(body, 'is_form_size'))
            .input('ISCOLOR', apiHelper.getFilterBoolean(body, 'is_color'))
            .input('ISOTHER', apiHelper.getFilterBoolean(body, 'is_other'))
            .input('ISMATERIAL', apiHelper.getFilterBoolean(body, 'is_material'))
            .input('ISCAPACITY', apiHelper.getFilterBoolean(body, 'is_capacity'))
            .input('ISWEIGHT', apiHelper.getFilterBoolean(body, 'is_weight'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('PRO_PRODUCTATTRIBUTE_CreateOrUpdate');
        const product_attribute_id = resultProductAttribute.recordset[0].RESULT;
        if (product_attribute_id <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.PRODUCTATTRIBUTE.CREATE_FAILED);
        }
        //Delete child table
        let attribute_values_ids = '';
        if (body.attribute_value_list && body.attribute_value_list.length > 0) {
            for (let i = 0; i < body.attribute_value_list.length; i++) {
                const item = body.attribute_value_list[i];
                const attribute_values_id = apiHelper.getValueFromObject(item, 'attribute_values_id');
                if (attribute_values_id) {
                    attribute_values_ids += attribute_values_ids ? '|' + attribute_values_id : attribute_values_id;
                }
            }
        }
        const requestValuesDel = new sql.Request(transaction);
        const resulttValuesDel = await requestValuesDel // eslint-disable-line no-await-in-loop
            .input('PRODUCTATTRIBUTEID', product_attribute_id)
            .input('ATTRIBUTEVALUESIDS', attribute_values_ids)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.PRO_ATTRIBUTEVALUES_DELETEBYPRODUCTATTRIBUTEID);
        if (resulttValuesDel.recordset[0].RESULT <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.PRODUCTATTRIBUTE.CREATE_FAILED);
        }

        if (body.attribute_value_list && body.attribute_value_list.length > 0) {
            for (let i = 0; i < body.attribute_value_list.length; i++) {
                const item = body.attribute_value_list[i];
                const requestChild = new sql.Request(transaction);
                const resultChild = await requestChild // eslint-disable-line no-await-in-loop
                    .input('PRODUCTATTRIBUTEID', product_attribute_id)
                    .input('ATTRIBUTEVALUESID', apiHelper.getValueFromObject(item, 'attribute_values_id'))
                    .input('ATTRIBUTEVALUES', apiHelper.getValueFromObject(item, 'attribute_values'))
                    .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .input('COLORHEX', apiHelper.getValueFromObject(item, 'color_hex'))
                    .execute(PROCEDURE_NAME.PRO_ATTRIBUTEVALUES_CREATEORUPDATE);
                const child_id = resultChild.recordset[0].RESULT;
                if (child_id <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PRODUCTATTRIBUTE.CREATE_FAILED);
                }
            }
        }
        transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, '', product_attribute_id);
    } catch (error) {
        logger.error(error, {
            function: 'ProductAttributeService.createProductAttributeOrUpdate',
        });
        console.error('ProductAttributeService.createProductAttributeOrUpdate', error);
        // Return error
        return new ServiceResponse(false, error.message);
    }
};

const detailProductAttribute = async (product_attribute_id) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('PRODUCTATTRIBUTEID', product_attribute_id)
            .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTE_GETBYID);

        if (data.recordsets && data.recordsets.length > 0) {
            if (data.recordsets[0].length > 0) {
                const attribute_value_list = data.recordsets[1];

                let record = productAttributeClass.detail(data.recordsets[0][0]);
                if (attribute_value_list && attribute_value_list.length > 0)
                    record.attribute_value_list = productAttributeClass.listAttributeValues(attribute_value_list);
                else {
                    record.attribute_value_list = [];
                }
                return new ServiceResponse(true, '', record);
            }
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'ProductAttributeService.detailProductAttribute',
        });

        return new ServiceResponse(false, e.message);
    }
};

const changeStatusProductAttribute = async (product_attribute_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PRODUCTATTRIBUTEID', product_attribute_id)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTE_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'ProductAttributeService.changeStatusProductAttribute',
        });
        return new ServiceResponse(false);
    }
};

const deleteProductAttribute = async (product_attribute_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PRODUCTATTRIBUTEID', product_attribute_id)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTE_DELETE);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'ProductAttributeService.deleteProductAttribute',
        });
        return new ServiceResponse(false, e.message);
    }
};
const getOptionsAll = async (queryParams = {}) => {
    try {
        // Get parameter
        const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
        const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
        // Get data from cache
        const data = await cache.wrap(CACHE_CONST.PRO_PRODUCTATTRIBUTE_OPTIONS, () => {
            return getOptions();
        });
        // Filter values: empty, null, undefined
        const idsFilter = ids.filter((item) => {
            return item;
        });
        const dataFilter = _.filter(data, (item) => {
            let isFilter = true;
            if (Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
                isFilter = false;
            }
            if (idsFilter.length && !idsFilter.includes(item.ID.toString())) {
                isFilter = false;
            }
            if (parentId && Number(parentId) !== item.PARENTID) {
                isFilter = false;
            }
            if (isFilter) {
                return item;
            }
            return null;
        });

        return new ServiceResponse(true, '', productAttributeClass.options(dataFilter));
    } catch (e) {
        logger.error(e, { function: 'ProductAttributeService.getOptionsAll' });

        return new ServiceResponse(true, '', []);
    }
};
const getOptions = async function (queryParams = {}) {
    try {
        const pool = await mssql.pool;
        const { recordset } = await pool
            .request()
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
            .execute(PROCEDURE_NAME.PRO_PRODUCTATTRIBUTE_OPTIONS);
        return new ServiceResponse(true, '', productAttributeClass.options(recordset));
    } catch (e) {
        logger.error(e, { function: 'ProductAttributeService.getOptions' });
        return new ServiceResponse(false, '', null);
    }
};
const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.PRO_PRODUCTATTRIBUTE_OPTIONS);
};
module.exports = {
    getListProductAttribute,
    createProductAttributeOrUpdate,
    detailProductAttribute,
    deleteProductAttribute,
    changeStatusProductAttribute,
    getOptionsAll,
    getOptions,
};
