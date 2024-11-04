const unitClass = require('../unit/unit.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');
/**
 * Get list MD_UNIT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListUnit = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.MD_UNIT_GETLIST_ADMINWEB);

        const units = data.recordsets[0];
        const totalItem = data.recordsets[1][0].TOTAL;
        return new ServiceResponse(true, '', {
            data: unitClass.list(units),
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'UnitService.getListUnit' });
        return new ServiceResponse(true, '', {});
    }
};

// detail Company type
const detailUnit = async (unitId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('UNITID', unitId).execute(PROCEDURE_NAME.MD_UNIT_GETBYID_ADMINWEB);

        let unit = data.recordset;

        // If exists
        if (unit && unit.length > 0) {
            unit = unitClass.detail(unit[0]);
            return new ServiceResponse(true, '', unit);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'unitService.getListUnit' });
        return new ServiceResponse(false, e.message);
    }
};

//Delete company type
const deleteUnit = async (unitId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('UNITID', unitId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_UNIT_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.UNIT.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'unitService.deleteUnit' });
        return new ServiceResponse(false, e.message);
    }
};

// change Status
const changeStatusUnit = async (unitId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('UNITID', unitId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name')) // return administrator
            .execute(PROCEDURE_NAME.MD_UNIT_UPDATESTATUS_ADMINWEB);
        return new ServiceResponse(true, 'change status success', { isSuccess: true });
    } catch (e) {
        logger.error(e, { function: 'unitService.changeStatusUnit' });
        return new ServiceResponse(false);
    }
};

// create or update Unit
const createOrUpdateUnit = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        //check name
        const dataCheck = await pool
            .request()
            .input('UNITID', apiHelper.getValueFromObject(bodyParams, 'unit_id'))
            .input('UNITNAME', apiHelper.getValueFromObject(bodyParams, 'unit_name'))
            .execute(PROCEDURE_NAME.MD_UNIT_CHECKNAME_ADMINWEB);
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.UNIT.EXISTS_NAME, null);
        }

        const data = await pool
            .request()
            .input('UNITID', apiHelper.getValueFromObject(bodyParams, 'unit_id'))
            .input('UNITNAME', apiHelper.getValueFromObject(bodyParams, 'unit_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_UNIT_CREATEORUPDATE_ADMINWEB);
        const unitId = data.recordset[0].RESULT;
        return new ServiceResponse(true, 'Update success', unitId);
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'unitService.createOrUpdateUnit' });
        return new ServiceResponse(false);
    }
};

module.exports = {
    getListUnit,
    detailUnit,
    deleteUnit,
    changeStatusUnit,
    createOrUpdateUnit,
};
