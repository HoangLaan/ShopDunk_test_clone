const apiHelper = require('../../common/helpers/api.helper');
const stocksClass = require('./stocks.class');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListStockInRequest = async params => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const keyword = apiHelper.getSearch(params);
        const pool = await mssql.pool;
        const res = await pool
        .request()
        .input('USERNAME',  apiHelper.getValueFromObject(params, 'user_name'))
        .input('KEYWORD',  keyword)
        .input('DATEFROM', apiHelper.getValueFromObject(params, 'date_from'))
        .input('DATETO', apiHelper.getValueFromObject(params, 'date_to'))
        .input('ISIMPORTED', apiHelper.getValueFromObject(params, 'is_imported'))
        .input('PAGESIZE', itemsPerPage)
        .input('PAGEINDEX', currentPage)
        .execute('ST_STOCKSINREQUEST_GET_LIST_APP');

        const data =stocksClass.listStockInRequest(res.recordsets[0])
        const total = res.recordsets[0][0]['TOTALITEMS']
        return new ServiceResponse(true, '',{data, total, page: currentPage, limit: itemsPerPage})
    } catch (error) {
        logger.error(error, {function: 'stocksService.getListStockInRequest'});
        return new ServiceResponse(false, 'Không lấy được dữ liệu', error);
    }
}

const getDetailStockInRequest = async params => {
    try {
        const pool = await mssql.pool;
        const res = await pool
        .request()
        .input('STOCKINREQUESTID',  apiHelper.getValueFromObject(params, 'stock_in_request_id'))
        .execute('ST_STOCKSINREQUEST_GET_DETAIL_APP');
        const infoStockInRequest =stocksClass.infoStockInRequest(res.recordset[0])
        const productInfoStockInRequest = stocksClass.productInfoStockInRequest(res.recordsets[1])
        const listManageUser = res.recordsets[2].map(item => item['STOCKSMANAGERUSER'] )
        return new ServiceResponse(true, '',{
            ...infoStockInRequest,
            products: productInfoStockInRequest,
            list_manage_user:listManageUser,
        })
    } catch (error) {
        logger.error(error, {function: 'stocksService.getListStockInRequest'});
        return new ServiceResponse(false, 'Không lấy được dữ liệu', error);
    }
}

const getListStockInProductImei = async params => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const keyword = apiHelper.getSearch(params);
        const pool = await mssql.pool;
        const res = await pool
        .request()
        .input('STOCKSINREQUESTID',  apiHelper.getValueFromObject(params, 'stock_in_request_id'))
        .input('PRODUCTID',  apiHelper.getValueFromObject(params, 'product_id'))
        .input('KEYWORD',  keyword)
        .input('PAGESIZE', itemsPerPage)
        .input('PAGEINDEX', currentPage)
        .execute('ST_STOCKSINREQUEST_GET_LIST_IMEI_APP');

        const data =stocksClass.listStockInProductImei(res.recordsets[0])
        const total = res.recordsets[0][0]['TOTALITEMS']
        return new ServiceResponse(true, '',{data, total, page: currentPage, limit: itemsPerPage})
    } catch (error) {
        logger.error(error, {function: 'stocksService.getListStockInProductImei'});
        return new ServiceResponse(false, 'Không lấy được dữ liệu', error);
    }
}

const addStockInProductImei = async params => {
    try {
        const pool = await mssql.pool;
        const res = await pool
        .request()
        .input('STOCKSINREQUESTID',  apiHelper.getValueFromObject(params, 'stock_in_request_id'))
        .input('PRODUCTID',  apiHelper.getValueFromObject(params, 'product_id'))
        .input('PRODUCTIMEICODE',  apiHelper.getValueFromObject(params, 'product_imei_code'))
        .input('USERNAME',  apiHelper.getValueFromObject(params, 'user_name'))
        .execute('ST_STOCKSINREQUEST_ADD_PRODUCT_IMEI_APP');

        return new ServiceResponse(true, 'Thêm mới thành công')
    } catch (error) {
        logger.error(error, {function: 'stocksService.addStockInProductImei'});
        return new ServiceResponse(false, error.message, error);
    }
}

const importStock = async params => {
    try {
        const pool = await mssql.pool;
        const res = await pool
        .request()
        .input('STOCKSINREQUESTID',  apiHelper.getValueFromObject(params, 'stock_in_request_id'))
        .input('USERNAME',  apiHelper.getValueFromObject(params, 'user_name'))
        .execute('ST_STOCKSINREQUEST_IMPORT_STOCKDETAIL_APP');

        return new ServiceResponse(true, 'Nhập kho thành công')
    } catch (error) {
        logger.error(error, {function: 'stocksService.importStock'});
        return new ServiceResponse(false, error.message, error);
    }
}

module.exports = {
    getListStockInRequest,
    getDetailStockInRequest,
    getListStockInProductImei,
    addStockInProductImei,
    importStock
};
