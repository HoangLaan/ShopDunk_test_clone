const departmentClass = require('../department/department.class');
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
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListDepartment = async (queryParams = {}) => {
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
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'department'))
            .input('ISDELETED', apiHelper.getValueFromObject(queryParams, 'is_deleted'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.MD_DEPARTMENT_GETLIST);

        const dataRecord = data.recordset;

        return new ServiceResponse(true, '', {
            data: departmentClass.list(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, {function: 'DepartmentService.getListDepartment'});
        return new ServiceResponse(false, e.message);
    }
};

const createDepartmentOrUpdate = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        // Begin transaction
        await transaction.begin();
        const department_id = apiHelper.getValueFromObject(body, 'department_id');

        //check name
        if(!department_id){
            const dataCheckName = await pool
            .request()
            .input('DEPARTMENTID', apiHelper.getValueFromObject(body, 'department_id'))
            .input('DEPARTMENTNAME', apiHelper.getValueFromObject(body, 'department_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .execute(PROCEDURE_NAME.MD_DEPARTMENT_CHECKNAME_ADMINWEB);
        if (dataCheckName.recordset && dataCheckName.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.DEPARTMENT.EXISTS_NAME, null);
        }
        }
       

        // Save Department
        const requestDepartment = new sql.Request(transaction);
        const resultDepartment = await requestDepartment
            .input('DEPARTMENTID', apiHelper.getValueFromObject(body, 'department_id'))
            .input('DEPARTMENTNAME', apiHelper.getValueFromObject(body, 'department_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('PARENTID', apiHelper.getValueFromObject(body, 'parent_id'))
            .input('BLOCKID', apiHelper.getValueFromObject(body, 'block_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'desc'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_DEPARTMENT_CREATEORUPDATE);
        const departmentId = resultDepartment.recordset[0].RESULT;
        if (departmentId <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.DEPARTMENT.CREATE_FAILED);
        }
        if (department_id) {
            //Edit
            const priorities = apiHelper.getValueFromObject(body, 'priorities');
            if (priorities && priorities.length > 0) {
                for (let i = 0; i < priorities.length; i++) {
                    const priority = priorities[i];
                    const requestPriority = new sql.Request(transaction);
                    await requestPriority // eslint-disable-line no-await-in-loop
                        .input('DEPARTMENTID', apiHelper.getValueFromObject(priority, 'department_id'))
                        .input('PRIORITY', apiHelper.getValueFromObject(priority, 'priority'))
                        .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                        .execute(PROCEDURE_NAME.MD_DEPARTMENT_UPDATEPRIORITY);
                }
            }
        }
        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, '', departmentId);
    } catch (error) {
        logger.error(error, {function: 'DepartmentService.createDepartmentOrUpdate'});
        console.error('DepartmentService.createDepartmentOrUpdate', error);
        await transaction.rollback();
        // Return error
        return new ServiceResponse(false, e.message);
    }
};

const detailDepartment = async department_id => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('DEPARTMENTID', department_id)
            .execute(PROCEDURE_NAME.MD_DEPARTMENT_GETBYID);
        const record = data.recordsets[0];
        if (record && record.length > 0) {
            let department = departmentClass.detail(record[0]);
            const record1 = data.recordsets[1];
            department.priorities = departmentClass.priorities(record1);
            return new ServiceResponse(true, '', department);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {function: 'DepartmentService.detailDepartment'});

        return new ServiceResponse(false, e.message);
    }
};

const changeStatusDepartment = async (department_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('DEPARTMENTID', department_id)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_DEPARTMENT_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {function: 'DepartmentService.changeStatusDepartment'});
        return new ServiceResponse(false);
    }
};

const deleteDepartment = async (department_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('DEPARTMENTID', department_id)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_DEPARTMENT_DELETE);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {function: 'DepartmentService.deleteDepartment'});
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsUserByDepartmentBusinees = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'bussiness_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .execute("ST_STOCKSINREQUEST_GETOPTIONSUSERREQUEST_ADMINWEB")
        const users = departmentClass.listUser(data.recordset);
        return new ServiceResponse(true, '', users);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptionsUserRequest',
        });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_DEPARTMENT_OPTIONS);
};

const getDepartmentByCompany = async (company_id) => {
    try { 
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('COMPANYID', company_id)
            .execute('MD_DEPARTMENT_GetDepartmentByCompany_AdminWeb');
        const record = data.recordsets[0];
        if (record && record.length > 0) {
            let department = departmentClass.detail(record);
            return new ServiceResponse(true, '', department);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'DepartmentService.getDepartmentByCompany' });

        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListDepartment,
    createDepartmentOrUpdate,
    detailDepartment,
    deleteDepartment,
    changeStatusDepartment,
    getOptionsUserByDepartmentBusinees,
    getDepartmentByCompany
};
