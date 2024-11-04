// @ts-nocheck
const paymentFormClass = require('./payment-form.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListByStore = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute(PROCEDURE_NAME.AC_PAYMENTFORM_GETLISTBYSTOREID_APP);
        let list = paymentFormClass.list(data.recordsets[0])
        const list_bank = paymentFormClass.listBank(data.recordsets[1])
        const list_pay_partner = paymentFormClass.listPayPartner(data.recordsets[2])
        list = (list || []).map(x => ({
            ...x,
            list_bank: x.payment_type === 2 ? list_bank : [],
            list_pay_partner: x.payment_type === 3 ? list_pay_partner : [],
        }))
        return new ServiceResponse(true, '', list);
    } catch (e) {
        logger.error(e, { function: 'paymentFormService.getListByStore' });
        return new ServiceResponse(false, e, []);
    }
};

const getConfigPaymentForm = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .execute('SYS_APPCONFIG_PAYMENT_FORM_GET_APP');
        let list = paymentFormClass.paymentForm(data.recordsets[0])
        return new ServiceResponse(true, '', list);
    } catch (e) {
        logger.error(e, { function: 'paymentFormService.getListByStore' });
        return new ServiceResponse(false, e, []);
    }
};

module.exports = {
    getListByStore,
    getConfigPaymentForm
};
