// @ts-nocheck
const paymentFormClass = require('./payment.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const { _createAccounting } = require('../order/order.service');
let fetch = require('node-fetch');

const listenVNPayIPN = async bodyParams => {
    try {
        fetch('https://hooks.slack.com/services/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', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { data: JSON.stringify(bodyParams) },
        })
            .then(response => {
                return response.json();
            })
            .catch(err => {
                console.log(err);
            });
    } catch (e) {
        logger.error(e, { function: 'paymentFormService.getListByStore' });
        return new ServiceResponse(false, e, []);
    }
};

const listenOnePayIPN = async bodyParams => {
    try {
        fetch('https://hooks.slack.com/services/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', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { data: JSON.stringify(bodyParams) },
        })
            .then(response => {
                return response.json();
            })
            .catch(err => {
                console.log(err);
            });
    } catch (e) {
        logger.error(e, { function: 'paymentFormService.getListByStore' });
        return new ServiceResponse(false, e, []);
    }
};

const saveTransactionVCBPOS = async params => {
    const pool = await mssql.pool;
    const dataCreatePos = await pool
        .request()
        .input('ORDERID', apiHelper.getValueFromObject(params, 'order_id'))
        .input('AMOUNT', apiHelper.getValueFromObject(params, 'AMOUNT'))
        .input('APPV_CODE', apiHelper.getValueFromObject(params, 'APPV_CODE'))
        .input('CARD_TYPE', apiHelper.getValueFromObject(params, 'CARD_TYPE'))
        .input('DATE', apiHelper.getValueFromObject(params, 'DATE'))
        .input('INVOICE', apiHelper.getValueFromObject(params, 'INVOICE'))
        .input('MERCHANT_CODE', apiHelper.getValueFromObject(params, 'MERCHANT_CODE'))
        .input('NAME', apiHelper.getValueFromObject(params, 'NAME'))
        .input('PAN', apiHelper.getValueFromObject(params, 'PAN'))
        .input('PROC_CODE', apiHelper.getValueFromObject(params, 'PROC_CODE'))
        .input('REF_NO', apiHelper.getValueFromObject(params, 'REF_NO'))
        .input('RESPONSE_CODE', apiHelper.getValueFromObject(params, 'RESPONSE_CODE'))
        .input('SEND', apiHelper.getValueFromObject(params, 'SEND'))
        .input('TERMINAL_ID', apiHelper.getValueFromObject(params, 'TERMINAL_ID'))
        .input('TIME', apiHelper.getValueFromObject(params, 'TIME'))
        .input('APP', apiHelper.getValueFromObject(params, 'APP'))
        .input('TXN_TYPE', apiHelper.getValueFromObject(params, 'TXN_TYPE'))
        .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
        .execute('PM_POSMACHINE_Create_App');
    const posmachineId = dataCreatePos.recordset[0].RESULT;
    if (posmachineId <= 0) {
        await transaction.rollback();
        return new ServiceResponse(false, 'Lỗi lưu thông tin máy POS !');
    }
    return new ServiceResponse(true, 'Thanh toán thành công ', null);
};

const paymentOrder = async bodyParams => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    try {
        const order_id = apiHelper.getValueFromObject(bodyParams, 'order_id');
        const data_payment = apiHelper.getValueFromObject(bodyParams, 'data_payment', []);

        if (data_payment && data_payment.length > 0) {
            //Lấy loại phiếu thu từ AppConfig
            const dataAppConfig = await new sql.Request(transaction)
                .input('KEYCONFIG', 'SL_ORDER_RECEIVETYPE')
                .execute('SYS_APPCONFIG_GetByKeyConfig_App');
            const value_config = dataAppConfig.recordset[0].VALUECONFIG;
            if (!value_config) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi lấy loại thu của phiếu thu trong đơn hàng !');
            }

            const description = apiHelper.getValueFromObject(bodyParams, 'description', '');
            const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', '');
            const requestReceiveslip = new sql.Request(transaction);
            const requestCreateReceiveslipOrder = new sql.Request(transaction);

            for (let i = 0; i < data_payment.length; i++) {
                const itemPayment = data_payment[i];
                const totalMoney = apiHelper.getValueFromObject(itemPayment, 'payment_value', 0);

                const data = await requestReceiveslip
                    .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
                    .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                    .input('RECEIVETYPEID', value_config)
                    .input('BANKACCOUNTID', apiHelper.getValueFromObject(itemPayment, 'bank_id'))
                    .input('CASHIERID', auth_name)
                    .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
                    .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                    .input('DESCRIPTIONS', description)
                    .input('TOTALMONEY', totalMoney)
                    .input('NOTES', description)
                    .input('CREATEDUSER', auth_name)
                    .input('ISACTIVE', 1)
                    .input('ISREVIEW', 1)
                    .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán
                    .input('PAYMENTTYPE', itemPayment.payment_type === 1 ? 1 : 2) // 1 phiếu thu tiền mặt 2 phiếu thu ngân hàng
                    .input('ORDERID', order_id) //Đơn hàng

                    .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_App');
                const receiveslipId = data.recordset[0].RESULT;

                if (receiveslipId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi khi tạo phiếu thu');
                }

                // Tạo hạch toán
                const accountingData = {
                    auth_name,
                    receiveslip_id: receiveslipId,
                    money: totalMoney,
                    descriptions: description,
                    order_id,
                    payment_form_id: apiHelper.getValueFromObject(itemPayment, 'payment_form_id'),
                };

                const result = await _createAccounting(accountingData, transaction);
                if (!result) {
                    throw new Error('Lỗi khi tạo hoạch toán');
                }

                const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
                    .input('RECEIVESLIPID', receiveslipId)
                    .input('ORDERID', order_id)
                    .input('TOTALMONEY', apiHelper.getValueFromObject(itemPayment, 'payment_value'))
                    .input('CREATEDUSER', auth_name)
                    .input('PAYMENTFORMID', apiHelper.getValueFromObject(itemPayment, 'payment_form_id'))
                    .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_App');

                const targetResult =
                    dataCreateReceiveslipOrder?.recordsets?.find(
                        recordset =>
                            recordset?.[0]?.RESULT &&
                            recordset?.[0]?.ISVALIDRECEIVESLIPORDER &&
                            recordset?.[0]?.ORDERNO &&
                            recordset?.[0]?.PAYMENTSTATUS,
                    )?.[0] || {};

                const {
                    RESULT: receiveslipOrder,
                    ISVALIDRECEIVESLIPORDER: isValid,
                    ORDERNO: orderNo,
                    OPAYMENTSTATUS,
                } = targetResult;

                if (!isValid) {
                    await transaction.rollback();
                    return new ServiceResponse(false, `Đơn hàng ${orderNo} đã thu đủ tiền.`);
                }
                if (receiveslipOrder <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo phiếu thu với đơn hàng thất bại');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Thanh toán thành công ', { order_id });
    } catch (e) {
        logger.error(e, { function: 'orderService.paymentOrder' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thanh toán thất bại !');
    }
};

const saveTransactionVNPayPOS = async params => {
    try {
        const pool = await mssql.pool;

        await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(params, 'order_id'))
            .input('AMOUNT', apiHelper.getValueFromObject(params, 'amount'))
            .input('TRANSACTIONCODE', apiHelper.getValueFromObject(params, 'transaction_code'))
            .execute('POS_TRANSACTION_VNPAY_SAVE_TRANSACTION_APP');
        return new ServiceResponse(true, 'Lưu transaction thành công', null);
    } catch (error) {
        return new ServiceResponse(false, 'Lỗi lưu transaction', error);
    }
};

module.exports = {
    listenVNPayIPN,
    listenOnePayIPN,
    paymentOrder,
    saveTransactionVCBPOS,
    saveTransactionVNPayPOS,
};
