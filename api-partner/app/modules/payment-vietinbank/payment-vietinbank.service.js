// const orderClass = require('./order.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const stocksOutRequestClass = require('../payment-vietinbank/payment-vietinbank.class');
const { push: publisMessage } = require('../../common/helpers/mqtt.helper');
const config = require('../../../config/config');

const checkReceiveSlip = async (queryParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    try {
        console.log(queryParams);
        // const dataTest = {
        //     "header": {
        //         "msgId": "6c3a355926d542b6914e4a6b6266183a",
        //         "msgType": "1200",
        //         "channelId": "211601",
        //         "providerId": "9060",
        //         "merchantId": null,
        //         "productId": "800000",
        //         "timestamp": "20200715105138",
        //         "recordNum": "1",
        //         "signature": "d+McmtWgBLYN1GLCmm6j0BspDduk9cvD//Vb5hUQ5Yq7V9TuC2f+YsyCGsNvDTvYqx6CP4xe3xuquU4gUG6vXD5Er1rCVNfoAMJSn+SHJJSehfLIWocXYcFSWcJCy5conpu8PRmCttudsTjGFc8mmnj1HBI2Jxl/6EcrurwjLo4LcttfSgTRXn2Jcx19Yagob4X+tStTnjz9gXidjp+FTXuODTtqBh/FzDt8xYYPscQ9yuRhW4yfl5aICb4OhJXSIaokikfYuEKF5eqFuETWAv8A94sNUaUk0FxlZxwiEI8BAkqAmR6x0T62mQ1/lpSWNkLSnhVPMDhvnatLmZECOA==",
        //         "encrypt": null
        //     },
        //     "data": {
        //         "records": [
        //             {
        //                 "transId": "592564021",
        //                 "originalId": null,
        //                 "channelId": "28",
        //                 "priority": null,
        //                 "recordNo": null,
        //                 "transTime": "20230728021517",
        //                 "transType": "C",
        //                 "serviceType": "",
        //                 "paymentType": "",
        //                 "paymentMethod": "",
        //                 "custCode": null,
        //                 "custName": null,
        //                 "custAcct": null,
        //                 "idCard": null,
        //                 "phoneNo": null,
        //                 "email": null,
        //                 "sendBankId": "",
        //                 "sendBranchId": "",
        //                 "sendAcctId": "",
        //                 "sendAcctName": "",
        //                 "sendVirtualAcctId": "",
        //                 "sendVirtualAcctName": "",
        //                 "sendAddr": "",
        //                 "sendCity": "",
        //                 "sendCountry": "",
        //                 "recvBankId": "",
        //                 "recvBranchId": "",
        //                 "recvAcctId": "111002669084",
        //                 "recvAcctName": "",
        //                 "recvVirtualAcctId": "",
        //                 "recvVirtualAcctName": "",
        //                 "recvAddr": "",
        //                 "recvCity": "",
        //                 "recvCountry": "",
        //                 "billId": null,
        //                 "billTerm": null,
        //                 "amount": "1000",
        //                 "fee": "",
        //                 "vat": null,
        //                 "balance": "118242581",
        //                 "payRefNo": "",
        //                 "payRefInfo": "",
        //                 "bankTransId": "382S2371BQYU81M2",
        //                 "remark": "CD: DH230817020x2x1 9213213213 ",
        //                 "status": {
        //                     "code": "00",
        //                     "message": "Notify thanh cong"
        //                 },
        //                 "checker": null,
        //                 "maker": null,
        //                 "currencyCode": "VND"
        //             }
        //         ]
        //     }
        // }

        let payment_status_code = queryParams?.data?.records[0]?.status?.code;
        let remark = queryParams?.data?.records[0]?.remark;
        let amount = queryParams?.data?.records[0]?.amount;
        let order_no;

        if (payment_status_code == '00' && remark) {
            remark = remark.split(' '); // tách chuỗi a theo khoảng trắng

            let value = remark.find((item) => item.includes('DH')); // Lấy nội dung mã đơn hàng
            value = value.split('x'); // tách chuỗi a theo dấu "x"

            order_no = value[0]; // Mã đơn hàng
            let payment_form_id = value[1]; // Hình thức thanh toán
            let bank_account_id = value[2]; // Tài khoản ngân hàng

            //Lấy thông tin đơn hàng từ mã đơn hàng
            const reqDataOrderByOrderNo = new sql.Request(transaction);
            const dataOrder = await reqDataOrderByOrderNo
                .input('ORDERNO', order_no)
                .execute('SL_ORDER_GetByOrderNoPayment_App');

            const order_id = dataOrder?.recordset[0]?.ORDERID;

            if (!order_id) {
                throw new Error('Không tìm thấy mã đơn hàng trong hệ thống !');
            }

            //Push thông báo
            publisMessage({
                topic: config.MQTT.VIETINBANK,
                payload: {
                    type: 'payload.vietinbank.order_id',
                    order_id: order_id,
                    order_no: order_no,
                    amount: amount,
                    payment_form_id: payment_form_id,
                    bank_account_id: bank_account_id,
                },
            });

            let business_id = dataOrder?.recordset[0]?.BUSINESSID;
            let store_id = dataOrder?.recordset[0]?.STOREID;
            let member_id = dataOrder?.recordset[0]?.MEMBERID;
            let company_id = dataOrder?.recordset[0]?.COMPANYID;
            let created_user = dataOrder?.recordset[0]?.CREATEDUSER || 'administrator';

            let descriptions = `Thu tiền hàng theo mã đơn hàng ${order_no}`;

            //Lấy loại phiếu thu từ AppConfig
            const reqDataAppConfig = new sql.Request(transaction);
            const dataAppConfig = await reqDataAppConfig
                .input('KEYCONFIG', 'SL_ORDER_RECEIVETYPE')
                .execute('SYS_APPCONFIG_GetByKeyConfig_App');
            const value_config = dataAppConfig?.recordset[0]?.VALUECONFIG;

            //Tạo phiếu thu tiền và thanh toán luôn
            const reqCreateReceive = new sql.Request(transaction);
            const data = await reqCreateReceive
                .input('COMPANYID', company_id)
                .input('BUSINESSID', business_id)
                .input('STOREID', store_id)
                .input('RECEIVETYPEID', value_config)
                .input('BANKACCOUNTID', bank_account_id)
                .input('CASHIERID', created_user)
                .input('MEMBERID', member_id)
                .input('PAYMENTFORMID', payment_form_id)
                .input('DESCRIPTIONS', descriptions)
                .input('TOTALMONEY', amount)
                .input('NOTES', descriptions)
                .input('CREATEDUSER', created_user)
                .input('ISBOOKEEPING', 1) // tự động ghi sổ khi thanh toán
                .input('ISACTIVE', 1)
                .input('ISREVIEW', 1)
                .input('PAYMENTSTATUS', 1) // trạng thái đã thanh toán
                .input('PAYMENTTYPE', 2) // bank
                .input('ORDERID', order_id) //Đơn hàng
                .execute('SL_RECEIVESLIP_CreateOrUpdateForOrder_App');
            const receiveslipId = data.recordset[0].RESULT;
            if (receiveslipId <= 0) {
                throw new Error('Lỗi tạo phiếu thu !');
            }

            // Tạo hạch toán
            const accountingData = {
                auth_name: created_user,
                receiveslip_id: receiveslipId,
                money: amount,
                descriptions: descriptions,
                order_id,
                payment_form_id,
            };
            const result = await _createAccounting(accountingData, transaction);
            if (!result) {
                throw new Error('Lỗi tạo phiếu thu !');
            }

            const requestCreateReceiveslipOrder = new sql.Request(transaction);
            const dataCreateReceiveslipOrder = await requestCreateReceiveslipOrder
                .input('RECEIVESLIPID', receiveslipId)
                .input('ORDERID', order_id)
                .input('TOTALMONEY', amount)
                .input('CREATEDUSER', created_user)
                .execute('SL_RECEIVESLIP_ORDER_CreateOrUpdate_App');

            const targetResult =
                dataCreateReceiveslipOrder?.recordsets?.find(
                    (recordset) =>
                        recordset?.[0]?.RESULT &&
                        recordset?.[0]?.ISVALIDRECEIVESLIPORDER &&
                        recordset?.[0]?.ORDERNO &&
                        recordset?.[0]?.PAYMENTSTATUS,
                )?.[0] || {};

            const {
                RESULT: receiveslipOrder,
                ISVALIDRECEIVESLIPORDER: isValid,
                ORDERNO: orderNo,
                PAYMENTSTATUS,
            } = targetResult;

            if (!isValid) {
                throw new Error(`Đơn hàng ${orderNo} đã thu đủ tiền.`);
            }
            if (receiveslipOrder <= 0) {
                throw new Error('Tạo phiếu thu với đơn hàng thất bại !');
            }

            // đã xuất kho tự động trong trigger
            // if (OPAYMENTSTATUS == 1) {
            //     // Xóa phiếu đã có trước đó theo đơn hàng
            //     const reqDeleteStocksOutRequest = new sql.Request(transaction);
            //     const resDeleteStocksOutRequest = await reqDeleteStocksOutRequest
            //         .input('ORDERID', order_id)
            //         .input('DELETEDUSER', created_user)
            //         .execute('ST_STOCKSOUTREQUEST_DeleteByOrder_App');
            //     if (!apiHelper.getResult(resDeleteStocksOutRequest.recordset)) {
            //         await transaction.rollback();
            //         return new ServiceResponse(false, 'Có lỗi xảy ra');
            //     }
            //     const reqDeleteStocksOutRequestDetail = new sql.Request(transaction);
            //     const resDeleteStocksOutRequestDetail = await reqDeleteStocksOutRequestDetail
            //         .input('ORDERID', order_id)
            //         .input('DELETEDUSER', created_user)
            //         .execute('ST_STOCKSOUTREQUESTDETAIL_DeleteByOrder_App');
            //     if (!apiHelper.getResult(resDeleteStocksOutRequestDetail.recordset)) {
            //         await transaction.rollback();
            //         return new ServiceResponse(false, 'Có lỗi xảy ra');
            //     }
            //     //Lấy danh sách kho và sản phẩm trong đơn hàng
            //     const reqGetProductByOrderID = new sql.Request(transaction);
            //     const resGetProductByOrderID = await reqGetProductByOrderID
            //         .input('ORDERID', order_id)
            //         .execute('SL_ORDERDETAIL_GetByOrderID_App');
            //     const list_stock = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[0]);
            //     const list_order_detail = stocksOutRequestClass.listStock(resGetProductByOrderID.recordsets[1]);

            //     if (list_stock?.length > 0) {
            //         const reqCreateStocksOutRequest = new sql.Request(transaction);
            //         const reqCreateStocksOutRequestDetail = new sql.Request(transaction);
            //         const reqStocksDetail = new sql.Request(transaction);

            //         for (const element of list_stock) {
            //             const resCreateStocksOutRequest = await reqCreateStocksOutRequest
            //                 .input('ORDERID', order_id)
            //                 .input('STOCKSID', element.stocks_id)
            //                 .input('CREATEDUSER', created_user)
            //                 .execute('ST_STOCKSOUTREQUEST_CreateByOrder_App');
            //             const result = apiHelper.getResult(resCreateStocksOutRequest.recordset);
            //             if (!result) {
            //                 await transaction.rollback();
            //                 return new ServiceResponse(false, 'Có lỗi xảy ra');
            //             }

            //             const resCreateStocksOutRequestDetail = await reqCreateStocksOutRequestDetail
            //                 .input('ORDERID', order_id)
            //                 .input('STOCKSOUTREQUESTID', result)
            //                 .input(
            //                     'LISTORDERDETAIL',
            //                     list_order_detail
            //                         .filter((x) => x.stocks_id === element.stocks_id)
            //                         .map((x) => x.order_detail_id)
            //                         .join(','),
            //                 )
            //                 .input('CREATEDUSER', created_user)
            //                 .execute('ST_STOCKSOUTREQUESTDETAIL_CreateByOrder_App');
            //             if (!apiHelper.getResult(resCreateStocksOutRequestDetail.recordset)) {
            //                 await transaction.rollback();
            //                 return new ServiceResponse(false, 'Có lỗi xảy ra');
            //             }

            //             //Xuất kho luôn ở chỗ này
            //             const dataStocksDetail = await reqStocksDetail
            //                 .input('STOCKSOUTREQUESTID', result)
            //                 .input('USERNAME', created_user)
            //                 .execute('ST_STOCKSOUTREQUEST_Outputted_App');
            //             if (!dataStocksDetail.recordset[0].RESULT) {
            //                 await transaction.rollback();
            //                 return new ServiceResponse(false, 'Xuất kho thất bại !');
            //             }
            //         }
            //     } else {
            //         await transaction.rollback();
            //         return new ServiceResponse(false, 'Không tìm thấy sản phẩm trong đơn hàng');
            //     }
            // }
        } else if (payment_status_code == '01') {
            throw new Error('SignatureInvalid !');
        } else if (payment_status_code == '02') {
            throw new Error('AccountNotFound !');
        } else if (payment_status_code == '03') {
            throw new Error('DebtError !');
        } else if (payment_status_code == '99') {
            throw new Error('NotDetermine  !');
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Thanh toán thành công ', order_no);
    } catch (e) {
        logger.error(e, { function: 'paymentService.checkReceiveSlip' });
        await transaction.rollback();
        return new ServiceResponse(false, e?.message, {});
    }
};

const _createAccounting = async (accountingData, transaction) => {
    try {
        // get default debt account
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
    checkReceiveSlip,
};
