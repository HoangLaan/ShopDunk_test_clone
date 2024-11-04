const moduleClass = require('./denomination.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
// const PROCEDURE_NAME = require('../../common/const/procedureName.const');
// const sql = require('mssql');
// const RESPONSE_MSG = require('../../common/const/responseMsg.const');
// const cacheHelper = require('../../common/helpers/cache.helper');
// const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListDenomination = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        // const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            // .input('KEYWORD', keyword)
            // .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_DENOMINATIONS_GetList_App');

        const dataRecord = data.recordset;

        return new ServiceResponse(true, '', {
            data: moduleClass.list(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, {function: 'DenominationService.getListDenomination'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListDenomination,
};
