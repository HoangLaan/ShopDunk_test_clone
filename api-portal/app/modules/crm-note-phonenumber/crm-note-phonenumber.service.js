const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const crmNotePhonenumber = require('./crm-note-phonenumber.class');

const createNotePhoneNumber = async (bodyParams) => {
    try {
        const pool = await mssql.pool;

        await pool
            .request()
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CRM_NOTEPHONENUMBER_Create_AdminWeb');

        return new ServiceResponse(true, '', {
            status: 'success',
            message: 'Lưu thành công!',
        });
    } catch (e) {
        logger.error(e, { function: 'crmNotePhoneNumber.createNotePhoneNumber' });
        return new ServiceResponse(false, e.message);
    }
};

const getListNotePhone = async (params) => {
    try {
        const page = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', page)
            .input('PHONENUMBER', apiHelper.getValueFromObject(params, 'phone_number'))
            .execute('CRM_NOTEPHONENUMBER_GetList');

        return new ServiceResponse(true, '', {
            list: crmNotePhonenumber.list(res.recordset),
            total: apiHelper.getTotalData(res.recordset),
            page: page,
            itemsPerPage: itemsPerPage,
        });
    } catch (e) {
        logger.error(e, { function: 'crmNotePhoneNumber.getListPhoneNumber' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    createNotePhoneNumber,
    getListNotePhone
}