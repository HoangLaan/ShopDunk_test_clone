const lodash = require('lodash');
const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const API_CONST = require('../../common/const/api.const');

const moduleClass = require('./accounting-period.class');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.AC_ACCOUNTINGPERIOD_GETLIST_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountingPeriod.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdate = async (bodyParams) => {
    let accountingPeriodId = apiHelper.getValueFromObject(bodyParams, 'accounting_period_id');

    try {
        const pool = await mssql.pool;
        const resCreateOrUpdateBudget = await pool
            .request()
            .input('ACCOUNTINGPERIODID', accountingPeriodId)
            .input('ACCOUNTINGPERIODNAME', apiHelper.getValueFromObject(bodyParams, 'accounting_period_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('APPLYFROMDATE', apiHelper.getValueFromObject(bodyParams, 'apply_from_date'))
            .input('APPLYTODATE', apiHelper.getValueFromObject(bodyParams, 'apply_to_date'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .execute(PROCEDURE_NAME.AC_ACCOUNTINGPERIOD_CREATEORUPDATE_ADMINWEB);

        accountingPeriodId = resCreateOrUpdateBudget.recordset[0].RESULT;

        return new ServiceResponse(true, '', accountingPeriodId);
    } catch (e) {
        logger.error(e, { function: 'AccountingPeriod.CreateOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('ACCOUNTINGPERIODID', id)
            .execute(PROCEDURE_NAME.AC_ACCOUNTINGPERIOD_GETBYID_ADMINWEB);

        let accountingPeriod = responseData.recordset[0];

        if (accountingPeriod) {
            return new ServiceResponse(true, '', moduleClass.detail(accountingPeriod));
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (e) {
        logger.error(e, { function: 'AccountingPeriod.getDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteList = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'ACCOUNTINGPERIODID')
            .input('TABLENAME', 'AC_ACCOUNTINGPERIOD')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        return new ServiceResponse(true, '', data);
    } catch (e) {
        logger.error(e, { function: 'AccountingPeriodService.deleteList' });

        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getList,
    createOrUpdate,
    getDetail,
    deleteList,
};
