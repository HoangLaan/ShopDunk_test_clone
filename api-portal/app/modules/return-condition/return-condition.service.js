const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const ReturnConditionClass = require('./return-condition.class');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const { log } = require('winston');

const getListReturnCondition = async (params = {}) => {
    console.log(params);
    try {
        const pool = await mssql.pool;
        const conditions = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'search', null))
            .input('RETURNCONDITIONNAME', apiHelper.getValueFromObject(params, 'returnCondition_name', null))
            .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'created_user', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISOPTION', apiHelper.getValueFromObject(params, 'is_option', null))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .execute(PROCEDURE_NAME.PRO_RETURNCONDITION_GETLIST_ADMINWEB);
        return {
            list: ReturnConditionClass.list(conditions.recordsets[0]),
            total: conditions.recordsets[0][0]['TOTALITEMS'],
        };
    } catch (error) {
        console.error('ReturnConditionService.getList', error);
        return [];
    }
};

const createOrUpdateHandler = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const idUpdate = apiHelper.getValueFromObject(bodyParams, 'returnCondition_id', null);
        const exchange = await pool
            .request()
            .input('RETURNCONDITIONID', apiHelper.getValueFromObject(bodyParams, 'returnCondition_id', null))
            .input('RETURNCONDITIONNAME', apiHelper.getValueFromObject(bodyParams, 'returnCondition_name', null))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', null))
            .input('ISRETURN', apiHelper.getValueFromObject(bodyParams, 'is_return', null))
            .input('ISEXCHANGE', apiHelper.getValueFromObject(bodyParams, 'is_exchange', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISACTIVE.ALL))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'updated_user', null))
            .input('ISLOSTBOX', apiHelper.getValueFromObject(bodyParams, 'is_lostBox', null))
            .input('VALUELOSTBOX', apiHelper.getValueFromObject(bodyParams, 'value_lostBox', null))
            .input('ISLOSTACCESSORIES', apiHelper.getValueFromObject(bodyParams, 'is_lostAccessories', null))
            .input('VALUELOSTACCESSORIES', apiHelper.getValueFromObject(bodyParams, 'value_lostAccessories', null))
            .input(
                'CREATEDUSER',
                idUpdate
                    ? apiHelper.getValueFromObject(bodyParams, 'updated_user', '')
                    : apiHelper.getValueFromObject(bodyParams, 'created_user', ''),
            )
            .execute(PROCEDURE_NAME.PRO_RETURNCONDITION_CREATEDORUPDATED_ADMINWEB);
        const exchangeId = exchange.recordset[0].RESULT;

        if (!exchangeId || exchangeId <= 0) {
            throw new Error('Create or update failed!');
        }
        return new ServiceResponse(true, 'Create or update successfully', exchangeId);
    } catch (error) {
        logger.error(error, { function: 'ExchangeService.createOrUpdateHandler' });
        return new ServiceResponse(false, error.message);
    }
};

const getById = async (returnConditionId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('RETURNCONDITIONID', returnConditionId)
            .execute(PROCEDURE_NAME.PRO_RETURNCONDITION_GETBYID_ADMINWEB);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy loại công việc');
        }
        const result = ReturnConditionClass.detail(data.recordsets[0][0]);

        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, { function: 'ExchangeService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const deleteExchange = async (returnConditionId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        console.log(apiHelper.getValueFromObject(bodyParams, 'returnConditionId', null));
        await pool
            .request()
            .input('RETURNCONDITIONID', returnConditionId)
            .execute(PROCEDURE_NAME.PRO_RETURNCONDITION_DELETE_ADMINWEB);
        return new ServiceResponse(true, 'delete exchange successfully!');
    } catch (e) {
        logger.error(e, { function: 'ExchangeService.deleteExchange' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListReturnCondition,
    createOrUpdateHandler,
    getById,
    deleteExchange,
};
