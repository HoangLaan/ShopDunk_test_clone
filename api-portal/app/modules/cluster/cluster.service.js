const database = require('../../models');
const clusterClass = require('./cluster.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');

const getList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('BUSINESSID', apiHelper.getValueFromObject(params, 'business_id', null))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', API_CONST.PAGINATION.LIMIT))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', ''))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', ''))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'created_user', ''))
            .execute(PROCEDURE_NAME.MD_CLUSTER_GETLIST_ADMINWEB);
        return {
            list: clusterClass.list(res.recordsets[0]),
            total: res.recordset[0]['TOTALITEMS'],
        };
    } catch (error) {
        console.error('clusterService.getList', error);
        return [];
    }
};

const getListStore = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('AREAID', apiHelper.getValueFromObject(params, 'area_id', null))
            .input('PROVINCEID', apiHelper.getValueFromObject(params, 'province_id', null))
            .input('DISTRICTID', apiHelper.getValueFromObject(params, 'district_id', null))
            .input('WARDID', apiHelper.getValueFromObject(params, 'ward_id', null))
            .input('BUSINESSID', apiHelper.getValueFromObject(params, 'business_id', null))
            .input('BUSINESSIDS', apiHelper.getValueFromObject(params, 'business_ids', ''))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISDELETED', apiHelper.getValueFromObject(params, 'is_deleted', API_CONST.ISDELETED.NOT_DELETED))
            .execute(PROCEDURE_NAME.MD_STORE_GETALL_ADMINWEB);
        return {
            list: clusterClass.listStore(res.recordsets[0]),
            total: res.recordset[0]['TOTALITEMS'],
        };
    } catch (error) {
        console.error('clusterService.getListStore', error);
        return [];
    }
};

const create = async (params = {}) => {
    try {
        await createOrUpdateHandler(null, params);
        return true;
    } catch (error) {
        console.error('clusterService.create', error);
        return false;
    }
};

const update = async (id, params = {}) => {
    try {
        await createOrUpdateHandler(id, params);
        return true;
    } catch (error) {
        console.error('clusterService.update', error);
        return false;
    }
};

const createOrUpdateHandler = async (id = null, params = {}) => {
    const pool = await mssql.pool;
    const res = await pool
        .request()
        .input('CLUSTERID', apiHelper.getValueFromObject(params, 'cluster_id', id))
        .input('CLUSTERNAME', apiHelper.getValueFromObject(params, 'cluster_name', null))
        .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', null))
        .input('CLUSTERCODE', apiHelper.getValueFromObject(params, 'cluster_code', null))
        .input('BUSINESSID', apiHelper.getValueFromObject(params, 'business_id', null))
        .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ACTIVE))
        .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.NOT_SYSTEM))
        .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'created_user', null))
        .input('STOREIDS', params.stores.join(','))
        .execute(PROCEDURE_NAME.MD_CLUSTER_CREATEORUPDATE_ADMINWEB);
    removeCacheOptions();
    return res;
};

const detail = async id => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().input('CLUSTERID', id).execute(PROCEDURE_NAME.MD_CLUSTER_GETBYID_ADMINWEB);
        return {
            ...clusterClass.detail(res.recordset[0]),
            store_list: clusterClass.listStore(res.recordsets[1]),
        };
    } catch (e) {
        logger.error(e, {function: 'clusterService.getDetail'});
        return new ServiceResponse(false, e.message);
    }
};

const remove = async bodyParams => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []).join(',');
        const data = await pool
            .request()
            .input('CLUSTERIDS', list_id)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_CLUSTER_DELETEMANY_ADMINWEB);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {function: 'clusterService.deleteManufacturer'});
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_CLUSTER_OPTIONS);
};

module.exports = {
    getList,
    create,
    detail,
    update,
    remove,
    getListStore,
};
