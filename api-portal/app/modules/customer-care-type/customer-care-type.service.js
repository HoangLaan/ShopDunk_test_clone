const customerCaseTypeClass = require('./customer-care-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const _ = require('lodash');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        let currentPage = apiHelper.getValueFromObject(params, 'page');
        let itemsPerPage = apiHelper.getValueFromObject(params, 'itemsPerPage', API_CONST.PAGINATION.LIMIT);
        const dataList = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', ''))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', ''))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', ''))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERCARETYPE_GETLIST_ADMINWEB);
        return new ServiceResponse(true, '', {
            list: customerCaseTypeClass.list(dataList.recordset),
            total: apiHelper.getTotalData(dataList.recordset[0]),
            page: currentPage,
            limit: itemsPerPage,
        });
    } catch (error) {
        logger.error(error, { function: 'customerCareTypeService.getList' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdate = async (id = null, params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        const reqCustomerCareType = new sql.Request(transaction);
        const dataCustomerCareType = await reqCustomerCareType
            .input('CUSTOMERCARETYPEID', id)
            .input('CUSTOMERCARETYPENAME', apiHelper.getValueFromObject(params, 'customer_care_type_name', ''))
            .input('NOTE', apiHelper.getValueFromObject(params, 'note', ''))
            .input('ISBIRTHDAY', apiHelper.getValueFromObject(params, 'is_birthday', 0))
            .input('ISWEDDINGANNIVERSARY', apiHelper.getValueFromObject(params, 'is_wedding_anniversary', 0))
            .input('ISTIMENOTBUYING', apiHelper.getValueFromObject(params, 'is_time_not_buying', 0))
            .input('ISFINALBUY', apiHelper.getValueFromObject(params, 'is_final_buy', 0))
            .input('ISFILTERDAILY', apiHelper.getValueFromObject(params, 'is_filter_daily', 0))
            .input('ISFILTERMONTHLY', apiHelper.getValueFromObject(params, 'is_filter_monthly', 0))
            .input('TIMEFINALBUY', apiHelper.getValueFromObject(params, 'time_final_buy', null))
            .input('VALUETIMENOTBUYING', apiHelper.getValueFromObject(params, 'value_time_note_buying', null))
            .input('TIMEVALUE', apiHelper.getValueFromObject(params, 'time_value', 0))
            .input('DATEVALUE', apiHelper.getValueFromObject(params, 'date_value', 0))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERCARETYPE_CREATEORUPDATE_ADMINWEB);
        let result = dataCustomerCareType.recordset[0].id;
        if (!result) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật loại chăm sóc khách hàng', null);
        }
        if (id !== null) {
            const reqReceiverDel = new sql.Request(transaction);
            const dataReceiverDel = await reqReceiverDel
                .input('CUSTOMERCARETYPEID', result)
                .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
                .execute(PROCEDURE_NAME.CRM_CUSRECEIVERS_DELETEMANY_ADMINWEB);
            let resultReceiverDel = dataReceiverDel.recordset[0].RESULT;
            if (!resultReceiverDel) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi xóa người nhận thông tin', null);
            }
        }
        const list = apiHelper.getValueFromObject(params, 'receivers', []);
        if (list.length > 0) {
            const reqReceiverInsert = new sql.Request(transaction);
            const dataReceiverInsert = await reqReceiverInsert
                .input('CUSTOMERCARETYPEID', result)
                .input('LIST', list.map((x) => x.user_id).join(','))
                .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
                .execute(PROCEDURE_NAME.CRM_CUSRECEIVERS_CREATE_ADMINWEB);
            let resultReceiverInsert = dataReceiverInsert.recordset[0].RESULT;
            if (!resultReceiverInsert) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo người nhận thông tin', null);
            }
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'customerCaretypeService.getListUser' });
        return new ServiceResponse(false, error.message);
    }
};

const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const customerCareType = await pool
            .request()
            .input('CUSTOMERCARETYPEID', id)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERCARETYPE_GETBYID_ADMINWEB);
        return new ServiceResponse(true, '', {
            ...customerCaseTypeClass.detail(customerCareType.recordset[0]),
            receivers: customerCaseTypeClass.listUser(customerCareType.recordsets[1]),
        });
    } catch (error) {
        logger.error(error, { function: 'customerCaretypeService.detail' });
        return new ServiceResponse(false, error.message);
    }
};

const remove = async (bodyParams) => {
    try {
        const pool = await mssql.pool;

        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []).join(',');
        await pool
            .request()
            .input('LISTID', list_id)
            .input('DELETEUSER', apiHelper.getValueFromObject(bodyParams, 'create_user', null))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERCARETYPE_DELETEMANY_ADMINWEB);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, error.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_CUSTOMERCARETYPE_OPTIONS);
};

const getListUser = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataList = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(params, 'department_id', null))
            .input('POSITIONID', apiHelper.getValueFromObject(params, 'position_id', null))
            .input('STATUS', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', API_CONST.PAGINATION.LIMIT))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .execute('SYS_USER_GetList_AdminWeb');
        return new ServiceResponse(true, '', {
            list: customerCaseTypeClass.listUser(dataList.recordset),
            total: apiHelper.getTotalData(dataList.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'customerCareTypeService.getListUser' });
        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
    getListUser,
};
