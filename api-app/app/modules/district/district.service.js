const ServiceResponse = require('../../common/responses/service.response');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const districtClass = require('./district.class');

module.exports = {
    getByStore: async queryParams => {
        try {
            const pool = await mssql.pool;
            const data = await pool
                .request()
                .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
                .input('GETBYSTORE', apiHelper.getValueFromObject(queryParams, 'get_by_store', 1))
                .execute('MD_DISTRICT_GetList');
    
            return new ServiceResponse(true, 'Lấy danh sách quận thành công', districtClass.listByStore(data.recordset));
        } catch (e) {
            logger.error(e, {function: 'districtService.getByStore'});
            return new ServiceResponse(false, e.message);
        }
    }
};
