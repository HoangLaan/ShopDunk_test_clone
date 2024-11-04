const UserLevelClass = require('./user-level.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListUserLevel = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const resUserLevel = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('HR_USERLEVEL_GetList_AdminWeb');

        let data = resUserLevel.recordset;
        return new ServiceResponse(true, '', {
            data: UserLevelClass.list(data),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data),
        });
    } catch (e) {
        logger.error(e, {function: 'UserLevelService.getListUserLevel'});
        return new ServiceResponse(false, 'Lỗi lấy danh sách cấp nhân viên', {});
    }
};

const deleteUserLevel = async bodyParams => {
    try {
        let ids = apiHelper.getValueFromObject(bodyParams, 'ids', []);
        const pool = await mssql.pool;
        await pool
            .request()
            .input('USERLEVELIDS', (ids || []).join(','))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_USERLEVEL_Delete_AdminWeb');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, {function: 'UserLevelService.deleteUserLevel'});
        return new ServiceResponse(false, e.message);
    }
};

const createUserLevel = async bodyParams => {
    try {
        const pool = await mssql.pool;
        let resCreate = await pool
            .request()
            .input('USERLEVELID', apiHelper.getValueFromObject(bodyParams, 'user_level_id', null))
            .input('USERLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'user_level_name', null))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', null))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .execute('HR_USERLEVEL_CreateOrUpdate_AdminWeb');

        const {RESULT = 0} = resCreate.recordset[0];
        if (!RESULT) {
            return new ServiceResponse(false, 'Lỗi thêm mới cấp nhân viên');
        }
        return new ServiceResponse(true, '', true);
    } catch (error) {
        logger.error(e, {function: 'UserLevelService.createUserLevel'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListUserLevel,
    deleteUserLevel,
    createUserLevel,
};
