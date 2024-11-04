const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const hrSalaryClass = require('./hr-salary.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getListHrSalary = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams).trim();
        const pool = await mssql.pool;
        const resErrorGroup = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to', null))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active', 1))
            .execute('HR_SALARY_GetList_WebAdmin');

        let data = resErrorGroup.recordset;
        return new ServiceResponse(true, '', {
            data: hrSalaryClass.list(data),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data),
        });
    } catch (e) {
        logger.error(e, { function: 'hr-salary.service.getListHrSalary' });
        return new ServiceResponse(false, 'Lỗi lấy danh sách lương', {});
    }
};

const delHrSalary = async bodyParams => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'SALARYID')
            .input('TABLENAME', 'HR_SALARY')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'hr-salary.service.delHrSalary' });
        return new ServiceResponse(false, 'Lỗi xoá mức lương');
    }
};

const createOrUpdateHrSalary = async bodyParams => {
    try {
        const pool = await mssql.pool;

        //if have edit
        const hr_salary_id = apiHelper.getValueFromObject(bodyParams, 'hr_salary_id', null);
        await pool
            .request()
            .input('SALARYID', hr_salary_id)
            .input('SALARYNAME', apiHelper.getValueFromObject(bodyParams, 'hr_salary_name', null))
            .input('SALARYFROM', apiHelper.getValueFromObject(bodyParams, 'hr_salary_from', null))
            .input('SALARYTO', apiHelper.getValueFromObject(bodyParams, 'hr_salary_to', null))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', null))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .execute('HR_SALARY_CreateOrUpdate_AdminWeb');

        return new ServiceResponse(true, '', true);
    } catch (error) {
        logger.error(error, { function: 'hr-salary.service.createOrUpdateHrSalary' });
        return new ServiceResponse(false, error.message);
    }
};

const getHrSalaryById = async id => {
    try {
        const pool = await mssql.pool;
        const resDetail = await pool.request().input('SALARYID', id).execute('HR_SALARY_GetById');

        if (resDetail.recordset && resDetail.recordset.length > 0) {
            const record = hrSalaryClass.detail(resDetail.recordset[0]);
            return new ServiceResponse(true, '', record);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (error) {
        logger.error(e, { function: 'hr-salary.service.getHrSalaryById' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListHrSalary,
    delHrSalary,
    createOrUpdateHrSalary,
    getHrSalaryById,
};
