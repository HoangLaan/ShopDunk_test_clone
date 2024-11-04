const skillLevelClass = require('../skill-level/skill-level.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');

const getListSkillLevel = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('HR_SKILLLEVEL_GetList_AdminWeb');
        const stores = data.recordset;

        return new ServiceResponse(true, '', {
            data: skillLevelClass.list(stores),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(stores),
        });
    } catch (e) {
        logger.error(e, { function: 'skillLevelService.getListSkillLevel' });
        return new ServiceResponse(true, '', {});
    }
};

const detailSkillLevel = async (levelid) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('LEVELID', levelid).execute('HR_SKILLLEVEL_GetById_AdminWeb');
        let level = data.recordset;
        if (level && level.length > 0) {
            level = skillLevelClass.detail(level[0]);
            return new ServiceResponse(true, '', level);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'skillLevelService.detailSkillLevel' });
        return new ServiceResponse(false, e.message);
    }
};
const createLevelOrUpdate = async (bodyParams) => {
    try {
        const pool = await mssql.pool;

        //check name
        const dataCheck = await pool
            .request()
            .input('LEVELID', apiHelper.getValueFromObject(bodyParams, 'level_id'))
            .input('LEVELNAME', apiHelper.getValueFromObject(bodyParams, 'level_name')?.trim())
            .execute('HR_SKILLLEVEL_CheckName_AdminWeb');
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, 'Tên trình độ kỹ năng đã tồn tại !', null);
        }

        const data = await pool
            .request()
            .input('LEVELID', apiHelper.getValueFromObject(bodyParams, 'level_id'))
            .input('LEVELNAME', apiHelper.getValueFromObject(bodyParams, 'level_name')?.trim())
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_SKILLLEVEL_CreateOrUpdate_AdminWeb');
        const level_id = data.recordset[0].RESULT;
        if (!level_id) {
            return new ServiceResponse(false, 'Cập nhật thất bại !');
        }
        return new ServiceResponse(true, '', {
            level_id,
            status: 'success',
            message: 'Lưu thành công!',
        });
    } catch (e) {
        logger.error(e, { function: 'skillLevelService.createLevelOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteSkillLevel = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('LEVELIDS', apiHelper.getValueFromObject(bodyParams, 'ids'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_SKILLLEVEL_Delete_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.SKILLLEVEL.DELETE_SUCCESS, true);
    } catch (e) {
        logger.error(e, { function: 'skillLevelService.deleteSkillLevel' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsSkillLevel = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('HR_SKILLLEVEL_GetOptions_AdminWeb');
        const skillLevels = skillLevelClass.options(data.recordset);
        return new ServiceResponse(true, '', skillLevels);
    } catch (e) {
        logger.error(e, { function: 'skillLevelService.getOptionsSkillLevel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListSkillLevel,
    detailSkillLevel,
    deleteSkillLevel,
    createLevelOrUpdate,
    getOptionsSkillLevel,
};
