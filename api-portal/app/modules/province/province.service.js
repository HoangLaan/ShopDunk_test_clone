const logger = require('../../common/classes/logger.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');

const ServiceResponse = require('../../common/responses/service.response');
const {options} = require('./province.class');

module.exports = {
    getOptions: async (queryParams = {}) => {
        try {
            const pool = await mssql.pool;
            const data = await pool
                .request()
                .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
                .execute('MD_PROVINCE_GetList');
            const dataRecord = options(data.recordset);
            return new ServiceResponse(true, '', dataRecord);
        } catch (e) {
            logger.error(e, {function: 'province.getOptions'});
            return [];
        }
    },
};
