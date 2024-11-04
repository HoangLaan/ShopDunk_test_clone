const moduleClass = require('./lock-shift-report.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
// const PROCEDURE_NAME = require('../../common/const/procedureName.const');
// const sql = require('mssql');
// const cacheHelper = require('../../common/helpers/cache.helper');
// const CACHE_CONST = require('../../common/const/cache.const');
// const cache = require('../../common/classes/cache.class');
// const API_CONST = require('../../common/const/api.const');
// const _ = require('lodash');
// const fileHelper = require('../../common/helpers/file.helper');
// const config = require('../../../config/config');
// const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getLockShiftReportList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
            .input('SHIFTLEADER', apiHelper.getValueFromObject(queryParams, 'shift_leader'))
            .execute('MD_LOCKSHIFT_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(resData.recordsets[1]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'LockShiftReportService.getLockShiftReportList' });

        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getLockShiftReportList,
};
