const sql = require('mssql');
const mssql = require('../../models/mssql');

const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const moduleClass = require('./accounting.class');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .execute('AC_ACCOUNTING_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            sum: data.recordsets[1][0]?.SUMMONEY,
        });
    } catch (e) {
        logger.error(e, { function: 'AccountingService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool.request().input('ACCOUNTINGID', id).execute('AC_ACCOUNTING_GetById_AdminWeb');

        let accountingDetail = responseData.recordset[0] || {};

        return new ServiceResponse(true, '', moduleClass.detail(accountingDetail));
    } catch (e) {
        logger.error(e, { function: 'AccountingService.getDetail' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getList,
    getDetail,
};
