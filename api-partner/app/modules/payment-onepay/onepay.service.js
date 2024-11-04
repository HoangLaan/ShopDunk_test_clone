const moment = require('moment');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');
const axios = require('axios');
const { createRequestSignature, getSecureHash } = require('./helper');
const { ONEPAY_INSTALLMENT, RESPONSE_MESSAGE } = require('./constant');

const getListInstallmentBank = async (queryParams = {}) => {
    try {
        const bankList = await _getInstallmentBank(queryParams?.amount);
        return new ServiceResponse(true, 'success', bankList);
    } catch (e) {
        logger.error(e, { function: 'OnepayService.getListInstallmentBank' });
        return new ServiceResponse(false, e?.message);
    }
};

const updateInstallmentPayment = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const {
            vpc_OrderInfo, // Mã đơn hàng gửi sang cổng
            vpc_Amount, // Số tiền gửi sang cổng (đã nhân 100)
            vpc_TxnResponseCode, // Mã giao dịch được sinh ra bởi cổng thanh toán để chỉ trạng thái giao dịch. 0 là thành công --> #0 là thất bại
            vpc_TransactionNo, // Là một chuỗi duy nhất được sinh ra từ cổng thanh toán cho mỗi giao dịch.
            vpc_Message, // Mô tả lỗi giao dịch khi thanh toán
            vpc_Card, // Loại thẻ đã thanh toán
            vpc_CardHolderName, // Tên chủ thẻ
            vpc_ItaBank, // Ngân hàng thanh toán
            vpc_ItaFeeAmount, // Phí trả góp
            vpc_ItaTime, // Kỳ hạn trả góp
            vpc_OrderAmount, // Số tiền gốc khi chưa có phí trả góp
        } = queryParams;

        // nếu không có mã giao dịch thì dừng lại
        if (!vpc_TransactionNo) {
            return new ServiceResponse(true, 'transaction null', 'responsecode=0&desc=confirm-success');
        }

        // kiểm tra nếu mã đơn hàng không tồn tại thì dừng lại
        const isExistsOrder = await _checkExistsOrderNo(vpc_OrderInfo);
        if (!isExistsOrder) {
            return new ServiceResponse(true, 'order no not found', 'responsecode=0desc=confirm-success');
        }

        const secureHash = queryParams.vpc_SecureHash;
        delete queryParams.vpc_SecureHash;

        const mySecureHash = getSecureHash(queryParams);

        let dataIntegrity = secureHash === mySecureHash ? 1 : 0;

        // create transaction record
        await pool
            .request()
            .input('PAYMENTTYPE', (ONEPAY = 1))
            .input('TRANSACTIONSTATUS', Number(vpc_TxnResponseCode) === 0 ? (SUCCESS = 1) : (FAILED = 2))
            .input('TRANSACTIONNO', vpc_TransactionNo)
            .input('TRANSFERAMOUNT', vpc_Amount / 100)
            .input('NOTE', vpc_Message)
            .input('ORDERNO', vpc_OrderInfo)
            .input('RESPONSECODE', vpc_TxnResponseCode)
            .input('CARDTYPE', vpc_Card)
            .input('CARDHOLDERNAME', vpc_CardHolderName)
            .input('BANK', vpc_ItaBank)
            .input('INSTALLMENTFEE', vpc_ItaFeeAmount)
            .input('INSTALLMENTPERIOD', vpc_ItaTime)
            .input('ORDERAMOUNT', vpc_OrderAmount / 100)
            .input('DATAINTEGRITY', dataIntegrity)
            .input('RESPONSEMESSAGE', RESPONSE_MESSAGE[vpc_TxnResponseCode] || 'Lỗi không xác định')
            .input('ONEPAYSECUREHASH', secureHash)
            .input('MYSECUREHASH', mySecureHash)
            .execute('SL_TRANSACTION_CreateOrUpdate_AdminWeb');

        // update order if transaction is success
        if (Number(vpc_TxnResponseCode) === 0 && dataIntegrity) {
            // cập nhật đơn hàng -> xuất kho
            await pool
                .request()
                .input('ORDERNO', vpc_OrderInfo)
                .input('TRANSFERAMOUNT', vpc_Amount / 100)
                .execute('SL_ORDER_UpdateOrderByInstallmentTransaction_AdminWeb');

            // tạo phiếu thu
            await _createReceiveSlip(vpc_OrderInfo, vpc_Amount / 100);
        }

        return new ServiceResponse(true, 'success', `responsecode=${dataIntegrity}&desc=confirm-success`);
    } catch (e) {
        console.log('🚀 ~ file: onepay.service.js:89 ~ updateInstallmentPayment ~ e:', e);
        logger.error(e, { function: 'OnepayService.updateInstallmentPayment' });
        return new ServiceResponse(true, 'failse', `responsecode=0&desc=confirm-success`);
    }
};

const _getInstallmentBank = async (amount) => {
    const url = `https://mtf.onepay.vn/msp/api/v1/merchants/${ONEPAY_INSTALLMENT.MERCHANT_ID}/installments?amount=${amount}`;

    const signature = createRequestSignature({
        method: 'GET',
        uri: ONEPAY_INSTALLMENT.URI.replace('|merchant_id|', ONEPAY_INSTALLMENT.MERCHANT_ID) + `?amount=${amount}`,
        httpHeaders: {
            Host: ONEPAY_INSTALLMENT.HOST,
            Accept: 'application/json',
        },
        signedHeaderNames: ['(request-target)', '(created)', 'host', 'accept'],
        keyId: ONEPAY_INSTALLMENT.MERCHANT_ID,
        hexaHmacKey: ONEPAY_INSTALLMENT.MERCHANT_KEY,
    });

    const headers = {
        Accept: 'application/json',
        Signature: signature,
    };

    const axiosRes = await axios.get(url, {
        headers,
    });

    return axiosRes?.data;
};

const _checkExistsOrderNo = async (orderNo) => {
    const query = `SELECT TOP 1 1 AS RESULT FROM SL_ORDER WHERE ORDERNO = '${orderNo ?? ''}' `;
    const pool = await mssql.pool;
    const dataRes = await pool.request().query(query);
    const dataResult = dataRes?.recordset[0] || {};

    return !!dataResult?.RESULT;
};

const _createReceiveSlip = async (vpc_OrderInfo, totalMoney) => {
    const pool = await mssql.pool;

    const otherDataRes = await pool
        .request()
        .input('ORDERNO', vpc_OrderInfo)
        .execute('SL_ORDER_GetOrderDataForInstallment_AdminWeb');

    const orderId = otherDataRes.recordset[0]?.ORDERID;
    const authName = otherDataRes.recordset[0]?.AUTHNAME;
    const descriptions = otherDataRes.recordset[0]?.DESCRIPTION;
    const installmentPartnerId = otherDataRes.recordset[0]?.INSTALLMENTPARTNERID;
    const paymentFormId = otherDataRes.recordset[0]?.PAYMENTFORMID;

    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        //Lấy loại phiếu thu từ AppConfig
        const dataAppConfig = await new sql.Request(transaction)
            .input('KEYCONFIG', 'SL_ORDER_RECEIVETYPE')
            .execute('SYS_APPCONFIG_GetByKeyConfig_App');

        const value_config = dataAppConfig.recordset[0].VALUECONFIG;

        if (!value_config) {
            await transaction.rollback();
            return console.error('Lỗi lấy loại thu của phiếu thu trong đơn hàng !');
        }

        const requestReceiveslip = new sql.Request(transaction);
        const requestCreateReceiveslipOrder = new sql.Request(transaction);

        //tạo phiếu thu
        const receiveslipData = await requestReceiveslip
            .input('RECEIVETYPEID', value_config)
            .input('CASHIERID', authName)
            .input('INSTALLMENTPARTNERID', installmentPartnerId)
            .input('PAYMENTFORMID', paymentFormId)
            .input('DESCRIPTIONS', descriptions)
            .input('TOTALMONEY', totalMoney)
            .input('NOTES', descriptions)
            .input('CREATEDUSER', authName)
            .input('ISACTIVE', 1)
            .input('ISREVIEW', 0)
            .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán
            .input('PAYMENTTYPE', 2) // 2 is bank
            .input('ORDERID', orderId) //Đơn hàng
            .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_AdminWeb');
        const receiveslipId = receiveslipData.recordset[0].RESULT;

        if (receiveslipId <= 0) {
            await transaction.rollback();
            return console.error('Lỗi tạo phiếu thu trong đơn hàng trả góp thanh toán onepay !');
        }

        // Tạo hạch toán
        const accountingData = {
            auth_name: authName,
            receiveslip_id: receiveslipId,
            money: totalMoney,
            descriptions: descriptions,
            order_id: orderId,
            payment_form_id: paymentFormId,
        };

        const result = await _createAccounting(accountingData, transaction);

        if (!result) {
            await transaction.rollback();
            return console.error('Lỗi tạo hạch toán trong đơn hàng trả góp thanh toán onepay !');
        }

        //cập nhật trạng thái đơn hàng
        const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
            .input('RECEIVESLIPID', receiveslipId)
            .input('ORDERID', orderId)
            .input('TOTALMONEY', totalMoney)
            .input('CREATEDUSER', authName)
            .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_AdminWeb');

        const targetResult =
            dataCreateReceiveslipOrder?.recordsets?.find(
                (recordset) =>
                    recordset?.[0]?.RESULT &&
                    recordset?.[0]?.ISVALIDRECEIVESLIPORDER &&
                    recordset?.[0]?.ORDERNO &&
                    recordset?.[0]?.PAYMENTSTATUS,
            )?.[0] || {};

        const { RESULT: receiveslipOrder, ISVALIDRECEIVESLIPORDER: isValid, ORDERNO: orderNo } = targetResult;

        if (!isValid) {
            await transaction.rollback();
            return console.error(`Đơn hàng ${orderNo} đã thu đủ tiền.`);
        }
        if (receiveslipOrder <= 0) {
            await transaction.rollback();
            return console.error('Tạo phiếu thu với đơn hàng thất bại');
        }

        const updateOrderStatus = new sql.Request(transaction);
        await updateOrderStatus
            .input('ORDERID', orderId)
            .input('CREATEDUSER', authName)
            .execute('SL_ORDER_UpdatePreOrderStatus_AdminWeb');

        await transaction.commit();
        return console.log('Thanh toán đơn hàng thành công!');
    } catch (e) {
        logger.error(e, { function: 'orderService.cashPayment' });
        await transaction.rollback();
        return console.error('Thanh toán đơn hàng thất bại!');
    }
};

const _createAccounting = async (accountingData, transaction) => {
    try {
        const getAccountRq = new sql.Request(transaction);

        const accountRes = await getAccountRq
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(accountingData, 'payment_form_id'))
            .input('AMOUNT', apiHelper.getValueFromObject(accountingData, 'money'))
            .input('ORDERID', apiHelper.getValueFromObject(accountingData, 'order_id'))
            .execute('AC_ACCOUNTING_GetAccountForOrder_Global');

        const { DEBTACCOUNT: debt_account_id, CREDITACCOUNT: credit_account_id } = accountRes?.recordset[0];

        const accountingRequest = new sql.Request(transaction);
        const resultChild = await accountingRequest
            .input('RECEIVESLIPID', apiHelper.getValueFromObject(accountingData, 'receiveslip_id'))
            .input('DEBTACCOUNT', debt_account_id ?? null)
            .input('CREDITACCOUNT', credit_account_id ?? null)
            .input('EXPLAIN', apiHelper.getValueFromObject(accountingData, 'descriptions'))
            .input('MONEY', apiHelper.getValueFromObject(accountingData, 'money'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(accountingData, 'auth_name'))
            .execute('AC_ACCOUNTING_CreateOrUpdate_AdminWeb');

        const childId = resultChild.recordset[0].RESULT;

        return childId > 0;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getListInstallmentBank,
    updateInstallmentPayment,
};
