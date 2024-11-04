const positionLevelClass = require('./position-level.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListPositionLevel = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const resPositionLevel = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_POSITIONLEVEL_GetList_AdminWeb');

        let data = resPositionLevel.recordset;
        return new ServiceResponse(true, '', {
            data: positionLevelClass.list(data),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data),
        });
    } catch (e) {
        logger.error(e, { function: 'positionLevelService.getListPositionLevel' });
        return new ServiceResponse(false, 'Lỗi lấy danh sách cấp nhân viên', {});
    }
};

const createOrUpdatePositionLevel = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const resCreate = await pool
            .request()
            .input('POSITIONLEVELID', apiHelper.getValueFromObject(bodyParams, 'position_level_id'))
            .input('POSITIONLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'position_level_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .execute('MD_POSITIONLEVEL_CreateOrUpdate_AdminWeb');

        const positionLevelId = resCreate.recordset[0].id;
        if (!positionLevelId) {
            return new ServiceResponse(false, 'Lỗi thêm mới cấp nhân viên');
        }
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'positionLevelService.createPositionLevel' });
        return new ServiceResponse(false, e.message);
    }
};

const createPositionLevel = async (bodyParams) => await createOrUpdatePositionLevel(bodyParams);

const updatePositionLevel = async (bodyParams) => await createOrUpdatePositionLevel(bodyParams);

const detailPositionLevel = async (positionLevelId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('POSITIONLEVELID', positionLevelId).execute('MD_POSITIONLEVEL_GetById');

        let positionLevel = data.recordset;
        if (positionLevel && positionLevel.length > 0) {
            positionLevel = positionLevelClass.detail(positionLevel[0]);
            return new ServiceResponse(true, '', positionLevel);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'positionLevelService.detailArea' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsByPositionId = async (queryParams = {}) => {
    try {
        const position_id = apiHelper.getValueFromObject(queryParams, 'position_id');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('POSITIONID', position_id)
            .execute('MD_POSITIONLEVEL_GetOptionsByPositionId_AdminWeb');
        let list = positionLevelClass.options(data.recordset);
        return new ServiceResponse(true, '', list);
    } catch (e) {
        logger.error(e, { function: 'positionLevelService.getOptionsByPositionId' });
        return new ServiceResponse(false, e.message);
    }
};

const deletePositionLevel = async (bodyParams) => {
    try {
        let ids = apiHelper.getValueFromObject(bodyParams, 'ids', []);
        const pool = await mssql.pool;
        await pool
            .request()
            .input('POSITIONLEVELIDS', (ids || []).join(','))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_POSITIONLEVEL_Delete_AdminWeb');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'positionLevelService.deletePositionLevel' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListPositionLevel,
    deletePositionLevel,
    getOptionsByPositionId,
    createPositionLevel,
    updatePositionLevel,
    detailPositionLevel,
};
