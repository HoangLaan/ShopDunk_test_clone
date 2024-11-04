const memberPointClass = require('./member-point.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getPointByUser = async (customer_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CUSTOMERID', customer_id)
            .execute(PROCEDURE_NAME.PT_MEMBERPOINT_OFMEMBER_ADMINWEB);
        return new ServiceResponse(true, '', memberPointClass.detail(data.recordset[0]));
    } catch (e) {
        logger.error(e, { function: 'MemberPointService.getPointByUser' });
        return new ServiceResponse(false, e.message);
    }
};

const getListExchangePointApplyOnOrder = async (params) => {
    try {
        const product_ids = apiHelper.getValueFromObject(params, 'product_ids');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(params, 'store_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(params, 'member_id'))
            .input('PRODUCTIDS', product_ids.map((x) => x).join(','))
            .execute(PROCEDURE_NAME.PT_EXCHANGEPOINT_GETLISTAPPLYONORDER_ADMINWEB);

        // if (data.recordset && data.recordset.length > 0) {
        return new ServiceResponse(true, '', memberPointClass.listExchangePoint(data.recordset));
        // }
        // return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (error) {
        logger.error(error, { function: 'MemberPointService.getListExchangePoint' });
        return new ServiceResponse(false, error.message);
    }
};

const getListOfUser = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('ISEXCHANGE', apiHelper.getValueFromObject(queryParams, 'is_exchange'))
            .input('KEYWORD', keyword)
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .execute(PROCEDURE_NAME.PT_MEMBERPOINT_GETLISTOFUSER_ADMINWEB);
        return new ServiceResponse(true, '', {
            data: memberPointClass.list(data.recordsets[0]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
            totalPoint: memberPointClass.totalPoint(data.recordsets[1][0]),
        });
    } catch (e) {
        logger.error(e, {
            function: 'MemberPointService.getListOfUser',
        });
        return new ServiceResponse(false, e.message);
    }
};

// const removeCacheOptions = () => {
//     return cacheHelper.removeByKey(CACHE_CONST.PT_MEMBERPOINT_OPTIONS);
// };

module.exports = {
    getPointByUser,
    getListExchangePointApplyOnOrder,
    getListOfUser,
};
