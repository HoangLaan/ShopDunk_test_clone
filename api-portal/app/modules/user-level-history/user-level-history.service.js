const UlHistoryClass = require('./user-level-history.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListULHistory = async (queryParams = {}) => {
    const pool = await mssql.pool;
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    try {
       

        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'userId'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'position_id'))
            .input('POSITIONID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .execute('SYS_USERLEVEL_HISTORY_GetList_AdminWeb');

        const stores = data.recordset;

        return new ServiceResponse(true, '', {
            data: UlHistoryClass.list(stores),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(stores),
        });
    } catch (e) {
        logger.error(e, { function: 'UlHistoryService.getListULHistory' });
        return new ServiceResponse(true, '', {
            data: [],
            page: currentPage,
            limit: itemsPerPage,
            total: 0,
        });
    }
};

const detailULHistory = async (ulhistoryId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERLEVELHISTORYID', ulhistoryId)
            .execute('SYS_USERLEVEL_HISTORY_GetById_AdminWeb');
        let detail = UlHistoryClass.detail(data.recordsets[0][0]);
        return new ServiceResponse(true, '', detail);
    } catch (e) {
        logger.error(e, { function: 'UlHistoryService.detailULHistory' });
        return new ServiceResponse(false, e.message);
    }
};

const createULHistoryOrUpdate = async (bodyParams) => {
    try {
        const id = apiHelper.getValueFromObject(bodyParams, 'user_level_history_id');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERLEVELHISTORYID', id)
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'username'))
            .input('DEPARTMENTOLDID', apiHelper.getValueFromObject(bodyParams, 'department_old_id'))
            .input('DEPARTMENTNEWID', apiHelper.getValueFromObject(bodyParams, 'department_new_id'))
            .input('POSITIONOLDID', apiHelper.getValueFromObject(bodyParams, 'position_old_id'))
            .input('POSITIONNEWID', apiHelper.getValueFromObject(bodyParams, 'position_new_id'))
            .input('POSITIONLEVELOLDID', apiHelper.getValueFromObject(bodyParams, 'position_level_old_id'))
            .input('POSITIONLEVELNEWID', apiHelper.getValueFromObject(bodyParams, 'position_level_new_id'))
            .input('REASON', apiHelper.getValueFromObject(bodyParams, 'reason'))
            .input('APPLYDATE', apiHelper.getValueFromObject(bodyParams, 'apply_date'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SYS_USERLEVEL_HISTORY_CreateOrUpdate_AdminWeb');
        const ulhistoryId = data.recordset[0].RESULT;
        return new ServiceResponse(true, '', ulhistoryId);
    } catch (e) {
        logger.error(e, { function: 'UlHistoryService.createOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteULHistory = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('USERLEVELHISTORYIDS', apiHelper.getValueFromObject(bodyParams, 'ids').toString())
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SYS_USERLEVEL_HISTORY_DeleteMany_AdminWeb');

        return new ServiceResponse(true, '', 'ok');
    } catch (e) {
        logger.error(e, { function: 'UlHistoryService.deleteULHistory' });
        return new ServiceResponse(false, e.message);
    }
};

const getUserOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('USERSTATUS', apiHelper.getValueFromObject(queryParams, 'user_status'))
            .execute('SYS_USERLEVEL_HISTORY_GetUserOptions_AdminWeb');

        return new ServiceResponse(true, '', UlHistoryClass.userOptions(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'UlHistoryService.getUserOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const detailUser = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'username'))
            .execute('SYS_USERLEVEL_HISTORY_GetUser_AdminWeb');

        return new ServiceResponse(true, '', UlHistoryClass.detailUser(data.recordset[0]));
    } catch (e) {
        logger.error(e, { function: 'UlHistoryService.detailUser' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListULHistory,
    detailULHistory,
    createULHistoryOrUpdate,
    deleteULHistory,
    getUserOptions,
    detailUser,
};
