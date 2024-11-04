const database = require('../../models');
const equipmentGroupClass = require('./equipmentGroup.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getList = async (params = {}) => {
    const currentPage = apiHelper.getCurrentPage(params);
    const itemsPerPage = apiHelper.getItemsPerPage(params);
    const keyword = apiHelper.getSearch(params);

    try {
        const pool = await mssql.pool;
        const equipmentGroup = await pool
            .request()
            .input('PAGEINDEX', currentPage)
            .input('PAGESIZE', itemsPerPage)
            .input('KEYWORD', keyword)
            .input('PARENTID', apiHelper.getValueFromObject(params, 'parent_id', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .execute(PROCEDURE_NAME.MD_EQUIPMENTGROUP_GETLIST_ADMINWEB);

        return {
            list: equipmentGroupClass.list(equipmentGroup.recordsets[0]),
            total: equipmentGroup.recordsets[0][0]['TOTALITEMS'],
        };
    } catch (error) {
        console.error('equipmentGroupService.getList', error);
        return [];
    }
};

const createOrUpdateHandler = async (params = {}) => {
    let equipmentGroupId = apiHelper.getValueFromObject(params, 'equipment_group_id', null);
    const equipmentGroupCode = apiHelper.getValueFromObject(params, 'equipment_group_code').trim();

    // check existed code
    const isExistedCode = await _checkExistedCode(equipmentGroupId, equipmentGroupCode);
    if (isExistedCode) {
        return new ServiceResponse(false, 'Mã nhóm thiết bị đã tồn tại !');
    }

    try {
        const pool = await mssql.pool;
        const equipmentGroup = await pool
            .request()
            .input('EQUIPMENTGROUPID', equipmentGroupId)
            .input('EQUIPMENTGROUPCODE', equipmentGroupCode)
            .input('EQUIPMENTGROUPNAME', apiHelper.getValueFromObject(params, 'equipment_group_name', null))
            .input('PARENTID', apiHelper.getValueFromObject(params, 'parent_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', ''))
            .execute(PROCEDURE_NAME.MD_EQUIPMENTGROUP_CREATEORUPDATE_ADMINWEB);
        removeCacheOptions();

        equipmentGroupId = equipmentGroup.recordset[0].id;
        if (!equipmentGroupId || equipmentGroupId <= 0) {
            return new ServiceResponse(false, 'Tạo hoặc cập nhật nhóm thiết bị thất bại', null);
        }

        return new ServiceResponse(true, 'thêm mới hoặc cập nhật thành công !', equipmentGroupId);
    } catch (error) {
        logger.error(error, { function: 'equipmentGroupService.createOrUpdateHandler' });
        return new ServiceResponse(false, error.message);
    }
};

const _checkExistedCode = async (equipmentGroupId = null, equipmentGroupCode) => {
    try {
        const pool = await mssql.pool;
        const resultRes = await pool
            .request()
            .input('EQUIPMENTGROUPID', equipmentGroupId)
            .input('EQUIPMENTGROUPCODE', equipmentGroupCode)
            .execute(PROCEDURE_NAME.MD_EQUIPMENTGROUP_CHECKCODE_ADMINWEB);

        return resultRes.recordset[0]?.RESULT;
    } catch (error) {
        logger.error(error, { function: 'equipmentGroupService._checkExistedCode' });
        return true;
    }
};

const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const equipmentGroup = await pool
            .request()
            .input('EQUIPMENTGROUPID', +id)
            .execute(PROCEDURE_NAME.MD_EQUIPMENTGROUP_GETBYID_ADMINWEB);
        return {
            ...equipmentGroupClass.detail(equipmentGroup.recordset[0]),
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const updateParentId = async (equipmentGroupIds) => {
    try {
        for (equipmentGroupId of equipmentGroupIds) {
            const pool = await mssql.pool;
            const data = await pool
                .request()
                .input('EQUIPMENTGROUPID', equipmentGroupId)
                .execute('MD_EQUIPMENTGROUP_UpdateParentId_AdminWeb');
        }
        removeCacheOptions();
    } catch (error) {
        console.error('equipmentGroupService.updateParentId', error);
    }
};

const remove = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await updateParentId(list_id);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'EQUIPMENTGROUPID')
            .input('TABLENAME', 'MD_EQUIPMENTGROUP')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_EQUIPMENTGROUP_OPTIONS);
};

const getGroupOptions = async () => {
    try {
        const pool = await mssql.pool;
        const groupOptions = await pool.request().execute('MD_EQUIPMENTGROUP_GetOptions_AdminWeb');
        return {
            ...equipmentGroupClass.options(groupOptions.recordsets[0]),
        };
    } catch (error) {
        console.error('equipmentGroupService.getGroupOptions', error);
        return [];
    }
};

module.exports = {
    getList,
    createOrUpdateHandler,
    detail,
    remove,
    getGroupOptions,
};
