const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const fileHelper = require('../../common/helpers/file.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./reconcile-debit.class');
const moment = require('moment');

const loadData = async (queryParams) => {
    try {
        // convert date to date + time
        let selected_date = apiHelper.getValueFromObject(queryParams, 'selected_date');
        if (selected_date) {
            const currentDate = moment(selected_date, 'DD/MM/YYYY');
            const dateTime = currentDate.format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss');
            selected_date = moment.utc(dateTime, 'YYYY-MM-DD HH:mm:ss').toDate();
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('ACCOUNTID', apiHelper.getValueFromObject(queryParams, 'account_id'))
            .input('SELECTEDDATE', selected_date)
            .input('CURENCYTYPE', apiHelper.getValueFromObject(queryParams, 'currency_type'))
            .execute('SL_RECONCILEDEBIT_GetData_AdminWeb');

        const voucherList = moduleClass.voucherList(data.recordsets[0]);
        const paymentList = moduleClass.paymentList(data.recordsets[1]);

        // attach execute change money
        voucherList.forEach((voucher) => {
            voucher.execute_change_money = voucher.change_money;
        });

        paymentList.forEach((voucher) => {
            voucher.execute_change_money = 0;
        });

        return new ServiceResponse(true, '', {
            voucher_payment_list: voucherList,
            voucher_debt_list: paymentList,
        });
    } catch (e) {
        logger.error(e, { function: 'ReconcileDebitService.loadData' });
        return new ServiceResponse(true, '', []);
    }
};

const revertReconcile = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    // extract data
    const historyList = bodyParams.history_list;

    try {
        await transaction.begin();
        for (let historyItem of historyList) {
            const request = new sql.Request(transaction);
            await request
                .input('RECONCILEHISTORYDETAILID', historyItem.reconcile_history_detail_id)
                .execute('SL_RECONCILEDEBT_RevertData_AdminWeb');
        }

        await transaction.commit();
        return new ServiceResponse(true, RESPONSE_MSG.REQUEST_SUCCESS);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, {
            function: 'ReconcileDebitService.revertReconcile',
        });
        return new ServiceResponse(false, e.message);
    }
};

const executeReconcile = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    // extract data
    const voucher = bodyParams.voucher;
    const invoiceList = bodyParams.invoice_list;
    const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');
    const reconcileDate = apiHelper.getValueFromObject(bodyParams, 'reconcile_date');

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const reconcileHistoryResponse = await request
            .input('SUPPLIERID', apiHelper.getValueFromObject(bodyParams, 'supplier_id'))
            .input('CURRENCYTYPE', apiHelper.getValueFromObject(bodyParams, 'currency_type'))
            .input('RECONCILEDATE', reconcileDate)
            .input('ACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'account_id'))
            .input('CREATEDUSER', authName)
            .execute('SL_RECONCILEHISTORY_CreateOrUpdate_AdminWeb');

        const reconcile_history_id = reconcileHistoryResponse?.recordset[0]?.RESULT;
        if (reconcile_history_id) {
            const reconcileDetailIds = await _createReconcileDetail(
                voucher,
                invoiceList,
                reconcile_history_id,
                transaction,
            );

            // attach reconcile detail id into invoice list
            invoiceList.forEach((invoice, index) => {
                invoice.reconcile_detail_id = reconcileDetailIds?.[index];
            });
            const invoicePaymentIds = await _createPaymentList(
                invoiceList,
                voucher.voucher_id,
                reconcileDate,
                authName,
                transaction,
            );
            await _updateInvoiceStatus(invoicePaymentIds.join(','), voucher.voucher_id, transaction);
            // update purchase order and invoice
        } else {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lưu lịch sử thât bại !');
        }
        await transaction.commit();
        return new ServiceResponse(true, RESPONSE_MSG.REQUEST_SUCCESS, { reconcile_history_id });
    } catch (e) {
        await transaction.rollback();
        logger.error(e, {
            function: 'ReconcileDebitService.executeReconcile',
        });
        return new ServiceResponse(false, e.message);
    }
};

const _createReconcileDetail = async (voucher, invoiceList, reconcile_history_id, transaction) => {
    const reconcileDetailIds = [];
    for (let invoice of invoiceList) {
        const accountingRequest = new sql.Request(transaction);
        const createRes = await accountingRequest
            .input('VOUCHERID', apiHelper.getValueFromObject(voucher, 'voucher_id'))
            .input('VOUCHERTYPE', apiHelper.getValueFromObject(voucher, 'voucher_type'))
            .input('INVOICEID', apiHelper.getValueFromObject(invoice, 'invoice_id'))
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(invoice, 'purchase_order_id'))
            .input('VOUCHERRECONCILEMONEY', apiHelper.getValueFromObject(voucher, 'execute_change_money'))
            .input('INVOICERECONCILEMONEY', apiHelper.getValueFromObject(invoice, 'execute_change_money'))
            .input('INVOICEDEBTMONEY', apiHelper.getValueFromObject(invoice, 'remaining_money'))
            .input('RECONCILEHISTORYID', reconcile_history_id)
            .execute('SL_RECONCILEHISTORYDETAIL_CreateOrUpdate_AdminWeb');
        if (createRes.recordset?.[0]?.RESULT) {
            reconcileDetailIds.push(createRes.recordset?.[0]?.RESULT);
        }
    }
    return reconcileDetailIds;
};

const _createPaymentList = async (invoicePaymentList, paymentSlipId, reconcileDate, authName, transaction) => {
    const dataIds = [];
    for (let payment of invoicePaymentList) {
        const accountingRequest = new sql.Request(transaction);
        const createData = await accountingRequest
            .input('INVOICEID', apiHelper.getValueFromObject(payment, 'invoice_id'))
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(payment, 'purchase_order_id'))
            .input('PAYMENTSLIPID', paymentSlipId)
            .input('PAYMENTVALUE', apiHelper.getValueFromObject(payment, 'execute_change_money'))
            .input('CREATEDUSER', authName)
            .input('PAYMENTDEBT', apiHelper.getValueFromObject(payment, 'remaining_money'))
            .input('ICREATEDDATE', reconcileDate)
            .input('RECONCILEHISTORYDETAILID', apiHelper.getValueFromObject(payment, 'reconcile_detail_id'))
            .execute('SL_INVOICEPAYMENT_CreateOrUpdate_AdminWeb');
        if (createData.recordset[0]?.RESULT) {
            dataIds.push(createData.recordset[0]?.RESULT);
        }
    }
    return dataIds;
};

const _updateInvoiceStatus = async (invoicePaymentIds, paymentSlipId, transaction) => {
    const accountingRequest = new sql.Request(transaction);
    await accountingRequest
        .input('PAYMENTSLIPID', paymentSlipId)
        .input('INVOICEPAYMENTIDS', invoicePaymentIds)
        .execute('SL_RECONCILEDEBT_UpdateInvoice_AdminWeb');
};

const getListHistory = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('ACCOUNTID', apiHelper.getValueFromObject(queryParams, 'account_id'))
            .input('CURENCYTYPE', apiHelper.getValueFromObject(queryParams, 'currency_type'))
            .execute('SL_RECONCILEDEBIT_GetHistory_AdminWeb');

        const historyData = moduleClass.historyList(data.recordsets[0]);

        return new ServiceResponse(true, '', {
            history_data: historyData,
        });
    } catch (e) {
        logger.error(e, { function: 'ReconcileDebitService.getListHistory' });
        return new ServiceResponse(true, '', []);
    }
};

module.exports = {
    loadData,
    executeReconcile,
    getListHistory,
    revertReconcile,
};
