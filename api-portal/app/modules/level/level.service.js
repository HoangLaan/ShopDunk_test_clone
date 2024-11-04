// const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
//const API_CONST = require('../../common/const/api.const');
const LevelClass = require('./level.class');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListLevel = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('HR_LEVEL_GetList_AdminWeb');
        const list = LevelClass.list(data.recordsets[0]);

        const total = apiHelper.getTotalData(data.recordsets[0]);
        return new ServiceResponse(true, '', {list, total});
    } catch (e) {
        logger.error(e, {function: 'LevelService.getListLevel'});
        return new ServiceResponse(true, '', {});
    }
};

// detail detailLevel
const detailLevel = async levelId => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('LEVELID', levelId).execute('HR_LEVEL_GetById_AdminWeb');
        let level = data.recordset;
        // If exists
        if (level && level.length > 0) {
            level = LevelClass.detail(level[0]);
            return new ServiceResponse(true, '', level);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {function: 'LevelService.detailLevel'});
        return new ServiceResponse(false, e.message);
    }
};

//Delete Level
const deleteLevel = async (levelId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('LEVELID', levelId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_LEVEL_Delete_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.CRUD.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, {function: 'LevelService.deleteLevel'});
        return new ServiceResponse(false, e.message);
    }
};

// create or update Level
const createOrUpdateLevel = async bodyParams => {
    try {
        const pool = await mssql.pool;
        //check name
        const dataCheck = await pool
            .request()
            .input('LEVELID', apiHelper.getValueFromObject(bodyParams, 'level_id'))
            .input('LEVELNAME', apiHelper.getValueFromObject(bodyParams, 'level_name'))
            .execute('HR_LEVEL_CheckName_AdminWeb');
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.LEVEL.EXISTS_NAME, null);
        }
        const data = await pool
            .request()
            .input('LEVELID', apiHelper.getValueFromObject(bodyParams, 'level_id'))
            .input('LEVELNAME', apiHelper.getValueFromObject(bodyParams, 'level_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_LEVEL_CreateOrUpdate_AdminWeb');
        const levelId = data.recordset[0].RESULT;
        return new ServiceResponse(true, 'update success', levelId);
    } catch (e) {
        logger.error(e, {function: 'LevelService.createOrUpdateLevel'});
        return new ServiceResponse(false);
    }
};

const getOptions = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('HR_LEVEL_GetOptions_AdminWeb');
        const list = LevelClass.options(data.recordsets[0]);
        return new ServiceResponse(true, '', list);
    } catch (e) {
        logger.error(e, {function: 'LevelService.getOptions'});
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListLevel,
    detailLevel,
    deleteLevel,
    createOrUpdateLevel,
    getOptions,
};
