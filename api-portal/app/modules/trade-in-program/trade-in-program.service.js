const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const _ = require('lodash');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListTradeInProgram = async (queryParams = {}) => {
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
            .input('APPLYSTATUS', apiHelper.getValueFromObject(queryParams, 'apply_status'))
            .execute('SL_TRADEINPROGRAM_GetList_AdminWeb');

        const tradeInPrograms = data.recordset;
        return new ServiceResponse(true, '', {
            data: tradeInPrograms,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(tradeInPrograms),
        });
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.getListTradeInProgram' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListTradeInProgram,
};
