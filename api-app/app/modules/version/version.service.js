const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const versionClass = require('./version.class');

module.exports = {
    getVersion: async queryParams => {
        const feature = apiHelper.getValueFromObject(queryParams, 'feature');
        try {
            const pool = await mssql.pool;
            const query = `
            SELECT
                ID,
                PLATFORM,
                VERSION,
                BUILDNUMBER,
                MESSAGE,
                FEATURE
            FROM SYS_VERSION_APP
            WHERE FEATURE = ${feature} `
            const data = await pool
                .request()
                .query(query)
        
        const item = versionClass.listVersion(data.recordset);

            return new ServiceResponse(true, '', item[0]);
        } catch (e) {
            logger.error(JSON.stringify(e.message), {function: 'versionService.getVersion'});
            return new ServiceResponse(false, JSON.stringify(e.message));
        }
    }
};
