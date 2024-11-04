const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const provinceClass = require('./province.class');

module.exports = {
    getByStore: async queryParams => {
        try {
            const pool = await mssql.pool;
            const data = await pool
                .request()
                .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
                .input('GETBYSTORE', apiHelper.getValueFromObject(queryParams, 'get_by_store', 1))
                .execute('MD_PROVINCE_GetList');
    
            return new ServiceResponse(true, 'Lấy danh sách tỉnh thành công', provinceClass.listByStore(data.recordset));
        } catch (e) {
            logger.error(e, {function: 'provinceService.getByStore'});
            return new ServiceResponse(false, e.message);
        }
    }
};
