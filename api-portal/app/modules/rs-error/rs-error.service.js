const errorClass = require('./rs-error.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const sql = require('mssql');

const getListRsError = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const resRsError = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date', null))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date', null))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active', 1))
            .input('ERRORGROUPID', apiHelper.getValueFromObject(queryParams, 'error_group_id', 0))
            .execute('RS_ERROR_GetList_AdminWeb');

        let data = resRsError.recordset;
        return new ServiceResponse(true, '', {
            data: errorClass.list(data),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data),
        });
    } catch (error) {
        logger.error(error, { function: 'rs-error.service.getListRsError' });
        return new ServiceResponse(false, 'Lỗi lấy danh sách lỗi máy', {});
    }
};

module.exports = {
    getListRsError,
};
