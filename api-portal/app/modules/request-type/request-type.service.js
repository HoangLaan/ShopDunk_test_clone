const RequestTypeClass = require('./request-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const ErrorResponse = require('../../common/responses/error.response');

const getOptions = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('RS_REQUESTTYPE_getOptions_AdminWeb');
        const result = RequestTypeClass.options(data.recordset);

        if (result) {
            return new ServiceResponse(true, '', result);
        }
        return new ServiceResponse(false, '', null);
    } catch (error) {
        logger.error(error, {
            function: 'request-type.service.getRequestTypeList',
        });

        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    getOptions,
};
