const sourceClass = require('./source.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', API_CONST.PAGINATION.LIMIT))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', ''))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', ''))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'created_user', ''))
            .execute(PROCEDURE_NAME.MD_SOURCE_GETLIST_ADMINWEB);
        return new ServiceResponse(true, '', {
            list: sourceClass.list(res.recordset),
            total: apiHelper.getTotalData(res.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'sourceService.getList' });
        return new ServiceResponse(false, error);
    }
};

const createOrUpdate = async (id = null, params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('SOURCEID', apiHelper.getValueFromObject(params, 'source_id', id))
            .input('SOURCENAME', apiHelper.getValueFromObject(params, 'source_name', null))
            .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', null))
            .input('SOURCETYPE', apiHelper.getValueFromObject(params, 'source_type', 0))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ACTIVE))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.NOT_SYSTEM))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
            .execute(PROCEDURE_NAME.MD_SOURCE_CREATEORUPDATE_ADMINWEB);
        let result = apiHelper.getResult(res.recordset);
        if (!result) {
            return new ServiceResponse(false, '');
        }
        removeCacheOptions();
        return new ServiceResponse(true, '');
    } catch (error) {
        logger.error(error, { function: 'sourceService.createOrUpdate' });
        return new ServiceResponse(false, error);
    }
};

const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().input('SOURCEID', id).execute(PROCEDURE_NAME.MD_SOURCE_GETBYID_ADMINWEB);
        return new ServiceResponse(true, '', sourceClass.detail(res.recordset[0]));
    } catch (error) {
        logger.error(error, 'sourceService.detail');
        return new ServiceResponse(false, error);
    }
};

const remove = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'SOURCEID')
            .input('TABLENAME', 'MD_SOURCE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_SOURCE_OPTIONS);
};

module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
};
