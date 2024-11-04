const ServiceResponse = require('../../common/responses/service.response');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');

const createError = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        await pool.request()
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
            .execute('SYS_ERROR_Create');

        return new ServiceResponse(true);
    } catch (error) {
        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    createError,
};
