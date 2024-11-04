const logger = require('../../common/classes/logger.class');
const ServiceResponse = require("../../common/responses/service.response");
const mssql = require('../../models/mssql');
const announceTypeClass = require('./announce-type.class');
const apiHelper = require('../../common/helpers/api.helper');

const getCompanyOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .execute('SYS_ANNOUNCETYPE_GetCompanyOptions');
            console.log(data.recordset);
        return new ServiceResponse(true, '', announceTypeClass.companyOptions(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'AnnounceTypeService.getCompanyOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getDepartmentOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
        .input('COMPANYID', apiHelper.getFilterBoolean(queryParams, 'company_id'))
            .execute('SYS_ANNOUNCETYPE_GetDepartmentOptions');
            console.log(data.recordset);
        return new ServiceResponse(true, '', announceTypeClass.departmentOptions(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'AnnounceTypeService.getCompanyOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getCompanyOptions,
    getDepartmentOptions,
};