'use-strict';
const borrowClass = require('./borrow.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const {convertDataToBorrowTypeList} = require('./helpers/functions');

/**
 * Get list stocks can borrow
 *
 * @param queryParams
 * PageSize
 * PageIndex
 * ProductId
 * @returns ServiceResponse
 */
const getListStocks = async (queryParams = {}) => {
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
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute('ST_STOCKSDETAIL_GetListBorrow_App');

        const dataRecord = data.recordset;

        return new ServiceResponse(true, '', {
            data: borrowClass.getStocksBorrow(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, {function: 'borrowService.getListStocks'});
        return new ServiceResponse(false, e.message);
    }
};

const getListBorrowType = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SL_BORROWTYPE_GETLIST_APP');

        const res = borrowClass.getBorrowType(data.recordset);

        return new ServiceResponse(true, '', convertDataToBorrowTypeList(res));
    } catch (e) {
        logger.error(e, {function: 'borrowService.getListStocks'});
        return new ServiceResponse(false, e.message);
    }
};

/**
 * Get list stocks can borrow
 *
 * @param queryParams
 * PageSize
 * PageIndex
 * ProductId
 * @returns ServiceResponse
 */
const createBorrow = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BORROWSTOCKSID', apiHelper.getValueFromObject(body, 'borrow_stocks_id'))
            .input('EXPORTSTOCKSID', apiHelper.getValueFromObject(body, 'export_stocks_id'))
            .input('BORROWDATERECEIVE', apiHelper.getValueFromObject(body, 'borrow_date_receive'))
            .input('BORROWDATERETURN', apiHelper.getValueFromObject(body, 'borrow_date_return'))
            .input('BORROWUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('BORROWTYPEID', apiHelper.getValueFromObject(body, 'borrow_type_id'))
            .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('QUANTITY', apiHelper.getValueFromObject(body, 'quantity'))
            .input('PRODUCTID', apiHelper.getValueFromObject(body, 'product_id'))
            .input('BORROWREQUESTNAME', apiHelper.getValueFromObject(body, 'borrow_request_name'))
            .execute('SL_BORROWREQUEST_CreateOrUpdate_App');

        const borrow_request_id = data.recordset[0]['RESULT'];
        const userReviewList = apiHelper.getValueFromObject(body, 'user_review_list');
        userReviewList.map(async item => {
            await pool
                .request()
                .input('BORROWREQUESTID', borrow_request_id)
                .input('BORROWREVIEWLEVELID', item.borrow_review_level_id)
                .input('REVIEWUSER', item.user_name)
                .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute('SL_BORROWREVIEWLIST_CREATE_OR_UPDATE_APP');
        });
        return new ServiceResponse(true, '', null);
    } catch (e) {
        logger.error(e, {function: 'borrowService.createBorrow'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListStocks,
    getListBorrowType,
    createBorrow,
};
