const sql = require('mssql');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const invoiceManagementClass = require('./invoice-management.class');

const getList = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to', null))
            .execute('SL_ORDERINVOICE_GetList_AdminWeb');

        const resultCount = data.recordset;
        const result = data.recordsets[1];

        return new ServiceResponse(true, '', {
            data: invoiceManagementClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resultCount),
        });
    } catch (error) {
        logger.error(error, { function: 'invoiceManagementService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getList,
};