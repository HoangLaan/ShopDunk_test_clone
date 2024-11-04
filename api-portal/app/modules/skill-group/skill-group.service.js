const skillGroupClass = require('./skill-group.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const sql = require("mssql");
/**
 * Get list HR_SKILLGROUP
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListSkillGroup = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool.request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getFilterBoolean(queryParams, 'is_system'))
            .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_delete'))
            .execute('HR_SKILLGROUP_GetList_AdminWeb');

        const skillgroups = data.recordset;

        return new ServiceResponse(true, '', {
            'data': skillGroupClass.list(skillgroups),
            'page': currentPage,
            'limit': itemsPerPage,
            'total': apiHelper.getTotalData(skillgroups),
        });
    } catch (e) {
        logger.error(e, { 'function': 'skillGroupService.getListSkillGroup' });
        return new ServiceResponse(true, '', {});
    }
};

const detailSkillGroup = async (skillGroupId) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .input('SKILLGROUPID', skillGroupId)
            .execute('HR_SKILLGROUP_GetById_AdminWeb');
        let skillGroup = skillGroupClass.detail(res.recordset[0] || {});
        return new ServiceResponse(true, '', skillGroup)
    } catch (e) {
        logger.error(e, { 'function': 'skillGroupService.detailSkillGroup' });
        return new ServiceResponse(false, e.message);
    }
};

const createSkillGroupOrUpdate = async (bodyParams) => {
    try {
        const pool = await mssql.pool;

        //check name
        const dataCheck = await pool.request()
            .input('SKILLGROUPID', apiHelper.getValueFromObject(bodyParams, 'skillgroup_id'))
            .input('SKILLGROUPNAME', apiHelper.getValueFromObject(bodyParams, 'skillgroup_name'))
            .execute('HR_SKILLGROUP_CheckName_AdminWeb');

        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, 'Tên nhóm kỹ năng đã tồn tại !', null);
        }

        const data = await pool.request()
            .input('SKILLGROUPID', apiHelper.getValueFromObject(bodyParams, 'skillgroup_id'))
            .input('SKILLGROUPNAME', apiHelper.getValueFromObject(bodyParams, 'skillgroup_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_SKILLGROUP_CreateOrUpdate_AdminWeb');
        const skillGroupId = data.recordset[0].RESULT;
        if (!skillGroupId) {
            return new ServiceResponse(false, 'Cập nhật thất bại !')
        }

        return new ServiceResponse(true, '', skillGroupId);
    }
    catch (e) {
        logger.error(e, { 'function': 'skillGroupService.createSkillGroupOrUpdate' });
        return new ServiceResponse(false);
    }
};


const deleteSkillGroup = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
            .input('SKILLGROUPIDS', apiHelper.getValueFromObject(bodyParams, "ids"))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_SKILLGROUP_Delete_AdminWeb');
        return new ServiceResponse(true, 'ok');
    } catch (e) {
        logger.error(e, { 'function': 'skillGroupService.deleteSkillGroup' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsSkillGroup = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .execute('HR_SKILLGROUP_GetOptions_AdminWeb');
        const skillgroups = skillGroupClass.options(data.recordset);
        return new ServiceResponse(true, '', skillgroups);
    } catch (e) {
        logger.error(e, { 'function': 'skillGroupService.getOptionsSkillGroup' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListSkillGroup,
    detailSkillGroup,
    createSkillGroupOrUpdate,
    deleteSkillGroup,
    getOptionsSkillGroup
};
