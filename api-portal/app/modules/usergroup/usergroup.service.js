const UserGroupClass = require('../usergroup/usergroup.class');
const UserGroupFunctionClass = require('../usergroup/user-group-function.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

/**
 * Get list SYS_USERGROUP
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListUserGroup = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const orderBy = 1;
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('ORDERBYDES', orderBy)
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getFilterBoolean(queryParams, 'is_system'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .execute('SYS_USERGROUP_GetList_AdminWeb');

        const userGroups = data.recordset;
        return new ServiceResponse(true, '', {
            data: UserGroupClass.list(userGroups),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(userGroups),
        });
    } catch (e) {
        logger.error(e, {function: 'userGroupService.getListUserGroup'});

        return new ServiceResponse(true, '', {});
    }
};

/**
 * Create SYS_USERGROUP
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createUserGroup = async (bodyParams = {}) => {
    return await createUserOrUpdate(bodyParams);
};

const updateUserGroup = async (bodyParams = {}) => {
    return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const datacheck = await pool
        .request()
        .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
        .input('USERGROUPNAME', apiHelper.getValueFromObject(bodyParams, 'user_group_name'))
        .execute('SYS_USERGROUP_CheckName_AdminWeb');
    if (datacheck.recordset[0].RESULT <= 0) {
        return new ServiceResponse(false, RESPONSE_MSG.USER_GROUP.CHECK_NAME_FAILED);
    }
    const transaction = await new sql.Transaction(pool);

    try {
        // Begin transaction
        await transaction.begin();

        // Save SYS_USERGROUP
        const requestUserGroup = new sql.Request(transaction);
        const resultUserGroup = await requestUserGroup
            .input('USERGROUPID', apiHelper.getValueFromObject(bodyParams, 'user_group_id'))
            .input('USERGROUPNAME', apiHelper.getValueFromObject(bodyParams, 'user_group_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SYS_USERGROUP_CreateOrUpdate_AdminWeb');
        // Get USERGROUPID
        const userGroupId = resultUserGroup.recordset[0].RESULT;

        // Commit transaction
        await transaction.commit();

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true, '', userGroupId);
    } catch (e) {
        logger.error(e, {function: 'userGroupService.createUserOrUpdate'});

        // Rollback transaction
        await transaction.rollback();

        // return new ServiceResponse(false, e.message); // Return error without error information
        return new ServiceResponse(false, e); // Return error with error information
    }
};

const detailUserGroup = async userGroupId => {
    try {
        const pool = await mssql.pool;

        const data = await pool.request().input('USERGROUPID', userGroupId).execute('SYS_USERGROUP_GetById_AdminWeb');

        let userGroupFunctions = data.recordsets[0];
        let userGroup = data.recordsets[1];

        // If exists SYS_USERGROUP
        if (userGroup && userGroup.length) {
            userGroup = UserGroupClass.detail(userGroup[0]);
            userGroupFunctions = UserGroupFunctionClass.list(userGroupFunctions);

            userGroup['user_group_functions'] = userGroupFunctions;
            return new ServiceResponse(true, '', userGroup);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {function: 'userGroupService.detailUserGroup'});

        return new ServiceResponse(false, e.message);
    }
};

const deleteUserGroup = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        // Begin transaction
        await transaction.begin();

        // IDS
        const userGroupIds = apiHelper.getValueFromObject(bodyParams, 'ids').toString();
        // Delete user group function
        const requestUserGroupFunction = new sql.Request(transaction);
        const resultUserGroupFunction = await requestUserGroupFunction
            .input('USERGROUPIDS', userGroupIds)
            .execute('SYS_USERGROUP_FUNCTION_DeleteMany_AdminWeb');
        // If store can not delete data
        if (resultUserGroupFunction.recordset[0].RESULT === 0) {
            throw new Error(RESPONSE_MSG.USER_GROUP.DELETE_SYS_USERGROUP_FUNCTION_FAILED);
        }

        // Delete user group
        const requestUserGroup = new sql.Request(transaction);
        await requestUserGroup
            .input('USERGROUPIDS', userGroupIds)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SYS_USERGROUP_DeleteMany_AdminWeb');

        // Commit transaction
        await transaction.commit();

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {function: 'userGroupService.deleteUserGroup'});

        // Rollback transaction
        await transaction.rollback();

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.SYS_USERGROUP_OPTIONS);
};

const getOptions = async () => {
    try {
        const pool = await mssql.pool;

        const data = await pool.request().execute('SYS_USERGROUP_GetOptions_AdminWeb');

        return new ServiceResponse(true, 'ok', UserGroupClass.options(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'UserGroupService.getOptions'});

        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getOptions,
    getListUserGroup,
    createUserGroup,
    detailUserGroup,
    updateUserGroup,
    deleteUserGroup,
};
