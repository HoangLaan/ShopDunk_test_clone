const areaClass = require('../area/area.class');
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
const getListArea = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_delete'))
            .execute(PROCEDURE_NAME.MD_AREA_GETLIST);

        const areas = data.recordset;

        return new ServiceResponse(true, '', {
            data: areaClass.list(areas),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(areas),
        });
    } catch (e) {
        logger.error(e, { function: 'areaService.getListArea' });
        return new ServiceResponse(true, '', {});
    }
};

const detailArea = async (areaId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('AREAID', areaId).execute(PROCEDURE_NAME.MD_AREA_GETBYID);

        let area = data.recordset;
        // If exists MD_AREA
        if (area && area.length > 0) {
            area = areaClass.detail(area[0]);
            return new ServiceResponse(true, '', area);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'areaService.detailArea' });
        return new ServiceResponse(false, e.message);
    }
};

const createAreaOrUpdate = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('AREAID', apiHelper.getValueFromObject(bodyParams, 'area_id'))
            .input('AREANAME', apiHelper.getValueFromObject(bodyParams, 'area_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_AREA_CREATEORUPDATE);
        const areaId = data.recordset[0].RESULT;
        removeCacheOptions();
        return new ServiceResponse(true, '', areaId);
    } catch (e) {
        logger.error(e, { function: 'areaService.createAreaOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const changeStatusArea = async (areaId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('AREAID', areaId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_AREA_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'areaService.changeStatusArea' });

        return new ServiceResponse(false);
    }
};

const deleteArea = async (areaId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('AREAID', areaId).execute(PROCEDURE_NAME.MD_AREA_CHECKUSED);

        let used = areaClass.detailUsed(data.recordset);
        if (used[0].result === 1) {
            // used
            return new ServiceResponse(false, 'Area used by ' + used[0].table_used, null);
        }

        await pool
            .request()
            .input('AREAID', areaId)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_AREA_DELETE);
        removeCacheOptions();
        return new ServiceResponse(true, RESPONSE_MSG.AREA.AM_COMPANY_DELETE);
    } catch (e) {
        logger.error(e, { function: 'areaService.deleteArea' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteListArea = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'AREAID')
            .input('TABLENAME', 'MD_AREA')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'areaService.deleteListArea' });
        return new ServiceResponse(false, 'Lỗi xoá nhóm khu vực');
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_AREA_OPTIONS);
};

module.exports = {
    getListArea,
    detailArea,
    createAreaOrUpdate,
    changeStatusArea,
    deleteArea,
    deleteListArea,
};
