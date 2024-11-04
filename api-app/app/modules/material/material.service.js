// @ts-nocheck
const materialClass = require('./material.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getList = async (queryParams = {}) => {
    const pool = await mssql.pool;
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = queryParams['search'];
        const res = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .execute(PROCEDURE_NAME.MTR_MATERIAL_GETLIST_APP);
        return new ServiceResponse(true, '', {
            data: materialClass.list(res.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(res.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'materialService.getList'});
        return new ServiceResponse(true, '', []);
    }
};


/**
 * Get list by product
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListByProduct = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('PRODUCTID', apiHelper.getValueFromObject(queryParams,'product_id')).execute(PROCEDURE_NAME.MTR_MATERIAL_GETLISTBYPRODUCTID_APP);
        return new ServiceResponse(true, '', materialClass.list(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'materialService.getListByProduct'});
        return new ServiceResponse(false, e, []);
    }
};

module.exports = {
    getListByProduct,
    getList
};
