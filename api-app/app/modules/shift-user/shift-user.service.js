const shiftUserClass = require('./shift-user.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getShiftUserList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('SHIFTDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('SHIFTDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .execute('HR_USER_SCHEDULE_GetListByUserName_App');
        const dataRecord = data.recordset;

        return new ServiceResponse(true, 'Lấy danh sách ca thành công', {
            data: shiftUserClass.list(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, {function: 'shiftUserService.getShiftUserList'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getShiftUserList,
};
