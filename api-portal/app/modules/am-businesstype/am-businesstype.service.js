const amBusinessTypeClass = require('../am-businesstype/am-businesstype.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

/**
 * Get list AM_BUSINESSTYPE
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListAMBusinessType = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_GETLIST);

        const BusinessTypes = data.recordset;

        return new ServiceResponse(true, '', {
            data: amBusinessTypeClass.list(BusinessTypes),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(BusinessTypes),
        });
    } catch (e) {
        logger.error(e, { function: 'BusinessTypeService.getListBusinessType' });

        return new ServiceResponse(true, '', {});
    }
};

/**
 * Create AM_BUSINESSTYPE
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createAMBusinessType = async (body = {}) => {
    return await createAMBusinessTypeOrUpdate(body);
};

const updateAMBusinessType = async (body = {}, business_type_id) => {
    body.business_type_id = business_type_id;
    return await createAMBusinessTypeOrUpdate(body);
};

const createAMBusinessTypeOrUpdate = async (body = {}) => {
    const pool = await mssql.pool;
    try {
        const datacheck = await pool
            .request()
            .input('BUSINESSTYPEID', apiHelper.getValueFromObject(body, 'business_type_id'))
            .input('BUSINESSTYPENAME', apiHelper.getValueFromObject(body, 'business_type_name'))
            .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_CHECKNAME);
        if (datacheck.recordset[0].RESULT <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.AMBUSINESSTYPE.CHECK_NAME_FAILED);
        }
        // Save AM_BUSINESSTYPE
        const data = await pool
            .request()
            .input('BUSINESSTYPEID', apiHelper.getValueFromObject(body, 'business_type_id'))
            .input('BUSINESSTYPENAME', apiHelper.getValueFromObject(body, 'business_type_name'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(body, 'descriptions'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_CREATEORUPDATE);

        removeCacheOptions();

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { BusinessType: 'BusinessTypeService.createAMBusinessTypeOrUpdate' });
        console.error('BusinessTypeService.createAMBusinessTypeOrUpdate', error);
        return new ServiceResponse(false, e.message);
    }
};

const detailAMBusinessType = async (businessTypeId) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('BUSINESSTYPEID', businessTypeId)
            .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_GETBYID);

        const BusinessType = data.recordset[0];

        if (BusinessType) {
            return new ServiceResponse(true, '', amBusinessTypeClass.detail(BusinessType));
        }

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'BusinessTypeService.detailBusinessType' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteAMBusinessType = async (businessTypeId, authId) => {
    const pool = await mssql.pool;
    try {
        // Delete user group
        await pool
            .request()
            .input('BUSINESSTYPEID', businessTypeId)
            .input('UPDATEDUSER', authId)
            .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_DELETE);

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'BusinessTypeService.deleteBusinessType' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const changeStatusAMBusinessType = async (businessTypeId, authId, isActive) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('BUSINESSTYPEID', businessTypeId)
            .input('ISACTIVE', isActive)
            .input('UPDATEDUSER', authId)
            .execute(PROCEDURE_NAME.AM_BUSINESSTYPE_UPDATESTATUS);

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'BusinessTypeService.changeStatusBusinessType' });

        return new ServiceResponse(false);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.AM_BUSINESSTYPE_OPTIONS);
};

module.exports = {
    getListAMBusinessType,
    createAMBusinessType,
    detailAMBusinessType,
    updateAMBusinessType,
    deleteAMBusinessType,
    changeStatusAMBusinessType,
};
