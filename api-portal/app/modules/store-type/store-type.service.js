const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./store-type.class');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getStoreTypeList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('ISACTIVE', apiHelper.getFilterBoo)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_STORETYPE_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordsets[1]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'StoreTypeService.getStoreTypeList' });

        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateStoreType = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        // Save
        const createOrUpdateStoreType = new sql.Request(transaction);
        const resCreateOrUpdateStoreType = await createOrUpdateStoreType
            .input('STORETYPEID', apiHelper.getValueFromObject(bodyParams, 'store_type_id'))
            .input('STORETYPENAME', apiHelper.getValueFromObject(bodyParams, 'store_type_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))

            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system')) //
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_STORETYPE_CreateOrUpdate_AdminWeb');

        const storeTypeId = resCreateOrUpdateStoreType.recordset[0].RESULT;

        if (!storeTypeId || storeTypeId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo loại cửa hàng thất bại', null);
        }

        const storeTypeStocksTypeDel = new sql.Request(transaction);
        await storeTypeStocksTypeDel
            .input('STORETYPEID', storeTypeId)
            .execute('MD_STORETYPE_STOCKSTYPE_DeleteByStoreTypeId_AdminWeb');

        const stocksTypeIds = apiHelper.getValueFromObject(bodyParams, 'stocks_type_ids', []);
        if (stocksTypeIds && stocksTypeIds.length) {
            const CreateStoreTypeStocksType = new sql.Request(transaction);
            const res = await CreateStoreTypeStocksType.input('STOCKSTYPEIDS', stocksTypeIds)
                .input('STORETYPEID', storeTypeId)
                .execute('MD_STORETYPE_STOCKSTYPE_Create_AdminWeb');
        }

        removeCacheOptions();

        await transaction.commit();
        return new ServiceResponse(true);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { StoreType: 'StoreTypeService.createOrUpdateStoreType' });

        return new ServiceResponse(false, error.message);
    }
};

const storeTypeDetail = async (storeTypeId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool.request().input('STORETYPEID', storeTypeId).execute('MD_STORETYPE_GetById_AdminWeb');

        let storeType = resData.recordset[0];

        if (storeType) {
            storeType = moduleClass.detail(storeType);
            storeType.stocks_type_ids = moduleClass.valueList(resData.recordsets[1]);

            return new ServiceResponse(true, '', storeType);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'StoreTypeService.storeTypeDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteStoreType = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'STORETYPEID')
            .input('TABLENAME', 'MD_STORETYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'StoreTypeService.deleteStoreType' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.AM_STORETYPE_OPTIONS);
};

module.exports = {
    getStoreTypeList,
    createOrUpdateStoreType,
    storeTypeDetail,
    deleteStoreType,
};
