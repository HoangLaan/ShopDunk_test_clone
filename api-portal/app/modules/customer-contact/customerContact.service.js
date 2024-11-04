const customerContactClass = require('./customerContact.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const mssql = require('../../models/mssql');
const _ = require('lodash');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const getList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', API_CONST.PAGINATION.LIMIT))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERCONTACT_GETLIST_ADMINWEB);
        return {
            list: customerContactClass.list(data.recordsets[0]),
            total: apiHelper.getTotalData(data.recordset),
        };
    } catch (error) {
        logger.error(error, { function: 'servicePartner.getCustomerContact' });
    }
};

// CHECK EXISTS NAME, PHONE, EMAIL
const checkExists = async (contactCustomerId, phoneNumber, email) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CONTACTCUSTOMERID', contactCustomerId)
            .input('EMAIL', email)
            .input('PHONENUMBER', phoneNumber)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERCONTACT_CHECKEXISTS_ADMINWEB);
        let checkExists = data.recordset;
        if (checkExists && checkExists.length > 0) {
            checkExists = customerContactClass.check(checkExists[0]);
            return checkExists;
        }
    } catch (e) {
        return null;
    }
};

const create = async (params) => {
    try {
        const check = await checkExists(
            null,
            apiHelper.getValueFromObject(params, 'phone_number'),
            apiHelper.getValueFromObject(params, 'email'),
        );
        if (check && check.exists_phone === 1) {
            return new ServiceResponse(false, RESPONSE_MSG.CRM_CUSTOMERCONTACT.EXISTS_PHONENUMBER, null);
        }
        if (check && check.exists_email === 1) {
            return new ServiceResponse(false, RESPONSE_MSG.CRM_CUSTOMERCONTACT.EXISTS_EMAIL, null);
        }
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('CONTACTCUSTOMERID', null)
            .input('FIRSTNAME', apiHelper.getValueFromObject(params, 'first_name', null))
            .input('LASTNAME', apiHelper.getValueFromObject(params, 'last_name', null))
            .input('EMAIL', apiHelper.getValueFromObject(params, 'email', null))
            .input('PHONENUMBER', apiHelper.getValueFromObject(params, 'phone_number', null))
            .input('GENDER', apiHelper.getValueFromObject(params, 'gender', null))
            .input('POSITION', apiHelper.getValueFromObject(params, 'position', null))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERCONTACT_CREATEORUPDATE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.CRUD.CREATE_SUCCESS, res.recordset[0].RESULT);
    } catch (error) {
        logger.error(error, { function: 'servicePartner.create' });
    }
};

module.exports = {
    getList,
    create,
};
