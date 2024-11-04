const moduleClass = require('./product-inventory-lookup.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const {STORE_LOOKUP} = require('./constant');

const getListProduct = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .input('KEYWORD', keyword)
            .execute(STORE_LOOKUP.LOOKUP_GETLIST);

        const products = data.recordset;

        return new ServiceResponse(true, '', {
            data: moduleClass.list(products),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[1]),
        });
    } catch (e) {
        logger.error(e, {function: 'productInventoryLookupService.getListProduct'});

        return new ServiceResponse(false, e.message);
    }
};

const getProduct = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id', null))
            .input('CODE', apiHelper.getValueFromObject(queryParams, 'code', null))
            .execute(STORE_LOOKUP.LOOKUP_GETPRODUCT);

        let product = moduleClass.product(data.recordset[0]);
        product.store_list = moduleClass.storeList(data.recordsets[1]);

        return new ServiceResponse(true, '', product);
    } catch (e) {
        logger.error(e, {function: 'productInventoryLookupService.getProduct'});

        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListProduct,
    getProduct,
};
