const ServiceResponse = require('../../common/responses/service.response');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');

const createError = async (params = {}) => {
    try {
        // Save SYS_ERROR
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(params, 'business_id'))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'user_name'))
            .input('ERRORNAME', apiHelper.getValueFromObject(params, 'error_name'))
            .input('CONTENT', apiHelper.getValueFromObject(params, 'content'))
            .input('ERRORTIME', apiHelper.getValueFromObject(params, 'error_time'))
            .input('EVENT', apiHelper.getValueFromObject(params, 'event'))
            .input('MODULENAME', apiHelper.getValueFromObject(params, 'module_name'))
            .input('USERAGENT', apiHelper.getValueFromObject(params, 'user_agent'))
            .input('PARAMETERCONTENT', apiHelper.getValueFromObject(params, 'parameter_content'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'created_user'))
            .execute(PROCEDURE_NAME.SYS_ERROR_CREATE);

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        // Return error
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    createError,
};
