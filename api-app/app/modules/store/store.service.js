const storeClass = require('../store/store.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListStore = async (queryParams = {}) => {
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
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_delete'))
            .execute(PROCEDURE_NAME.MD_STORE_GETLIST);

        const stores = data.recordset;

        return new ServiceResponse(true, '', {
            data: storeClass.list(stores),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(stores),
        });
    } catch (e) {
        logger.error(e, {function: 'storeService.getListStore'});
        return new ServiceResponse(true, '', {});
    }
};

const detailStore = async storeId => {
    try {
        const pool = await mssql.pool;

        // console.log(storeId);
        const data = await pool.request().input('STOREID', storeId).execute(PROCEDURE_NAME.MD_STORE_GETBYID);

        let stores = data.recordset;
        // If exists MD_AREA
        if (stores && stores.length > 0) {
            stores = storeClass.detail(stores[0]);
            return new ServiceResponse(true, '', stores);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {function: 'storeService.detailStore'});
        return new ServiceResponse(false, e.message);
    }
};

const createAreaOrUpdate = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('STORENAME', apiHelper.getValueFromObject(bodyParams, 'store_name'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('AREAID', apiHelper.getValueFromObject(bodyParams, 'area_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('LOCATIONX', apiHelper.getValueFromObject(bodyParams, 'location_x'))
            .input('LOCATIONY', apiHelper.getValueFromObject(bodyParams, 'location_y'))
            .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
            .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_STORE_CREATEORUPDATE);
        const storeId = data.recordset[0].RESULT;
        removeCacheOptions();
        return new ServiceResponse(true, '', storeId);
    } catch (e) {
        logger.error(e, {function: 'storeService.createAreaOrUpdate'});
        return new ServiceResponse(false);
    }
};

const changeStatusStore = async (storeId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOREID', storeId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_STORE_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {function: 'storeService.changeStatusStore'});

        return new ServiceResponse(false);
    }
};

const deleteStore = async (storeId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('STOREID', storeId).execute(PROCEDURE_NAME.MD_STORE_CHECKUSED);

        let used = storeClass.detailUsed(data.recordset);
        if (used[0].result === 1) {
            // used
            return new ServiceResponse(false, 'Store used by ' + used[0].table_used, null);
        }

        await pool
            .request()
            .input('STOREID', storeId)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_STORE_DELETE);
        removeCacheOptions();
        return new ServiceResponse(true, RESPONSE_MSG.STORE.AM_COMPANY_DELETE);
    } catch (e) {
        logger.error(e, {function: 'storeService.deleteStore'});
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_STORE_OPTIONS);
};

const checkIp = async ip => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('IPADDRESS', ip).execute(PROCEDURE_NAME.MD_STORE_GETINFOBYIP_APP);
        if (data.recordset.length === 0) {
            return new ServiceResponse(false, 'Không tìm thấy cửa hàng!');
        }
        return new ServiceResponse(true, '', storeClass.infoByIp(data.recordset[0]));
    } catch (e) {
        logger.error(e, {function: 'storeService.checkIp'});
        return new ServiceResponse(false, e.message);
    }
};

const getStoreByUser = async body => {
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        // get store and username supervisor
        const getStoreAndSupervisor = await mssql.pool;
        const resGetStoreAndSupervisor = await getStoreAndSupervisor
            .request()
            .input('USERNAME', authName)
            .execute(PROCEDURE_NAME.MD_STORE_GETSTOREANDSUPPERVISION);
        let dataCompare = null;
        if (resGetStoreAndSupervisor.recordset[0]) {
            dataCompare = storeClass.detailStore(resGetStoreAndSupervisor.recordset[0]);
        }
        return new ServiceResponse(true, '', dataCompare);
    } catch (e) {
        logger.error(e, {
            function: 'customerWorkingService.getById',
        });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListStore,
    detailStore,
    createAreaOrUpdate,
    changeStatusStore,
    deleteStore,
    checkIp,
    getStoreByUser,
};
