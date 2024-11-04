const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const wardClass = require('./ward.class');

module.exports = {
    getByStore: async queryParams => {
        try {
            const pool = await mssql.pool;
            const data = await pool
                .request()
                .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
                .input('GETBYSTORE', apiHelper.getValueFromObject(queryParams, 'get_by_store', 1))
                .execute('MD_WARD_GetList');
    
            return new ServiceResponse(true, 'Lấy danh sách phường thành công', wardClass.listByStore(data.recordset));
        } catch (e) {
            logger.error(e, {function: 'wardService.getByStore'});
            return new ServiceResponse(false, e.message);
        }
    }
};
