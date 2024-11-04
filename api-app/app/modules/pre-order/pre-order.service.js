const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const requestIp = require('request-ip');
const {receiveslipPrint} = require('./pre-order.class');
const moment = require('moment');
const pdfHelper = require('../../common/helpers/pdf.helper');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const folderName = 'signature';
// create phieu thu
const createReceislipOrder = async req => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();

    try {
        const bodyParams = req.body;
        const clientIp = requestIp.getClientIp(req);
        let clientIpReplace;
        if (clientIp.includes('::ffff:')) {
            clientIpReplace = clientIp.replace('::ffff:', '');
        } else {
            clientIpReplace = clientIp;
        }

        const pre_order_id = apiHelper.getValueFromObject(bodyParams, 'pre_order_id');
        //const data_payment = (apiHelper.getValueFromObject(bodyParams, 'data_payment', [])).filter(item => item.payment_type == 1)
        const created_user = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const payment_type = apiHelper.getValueFromObject(bodyParams, 'payment_type'); // tien mat thi 6
        const total_money = apiHelper.getValueFromObject(bodyParams, 'total_money', 0);
        // const notes = apiHelper.getValueFromObject(bodyParams, 'notes');
        // const current_type = apiHelper.getValueFromObject(bodyParams, 'current_type'); // 1 tien viet - 2 usd
        // const payment_status = apiHelper.getValueFromObject(bodyParams, 'payment_status'); // tran gthai thanh toan 0 that bai 1 thanh cong

        const requestReceiveslip = new sql.Request(transaction);
        const data = await requestReceiveslip
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
            // .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'descriptions', ''))
            .input('TRANSFERAMOUNT', total_money)
            // .input('NOTES', notes)
            .input('CREATEDUSER', created_user)
            // .input('ISACTIVE', 1)
            // .input('ISREVIEW', 1)
            .input('PAYMENTTYPE', payment_type) // THANH TOASN TIEN MAT
            .input('PREORDERID', pre_order_id)
            // .input('CURRENCYTYPE', current_type)
            // .input('PAYMENTSTATUS', payment_status)
            .input('IPADDRESS', clientIp)
            .execute('SL_PREORDERTRANSACTION_Create_App');
        await transaction.commit();

        return new ServiceResponse(true, 'Tạo phiếu thu thành thành công ', {
            receive_slip_id: data.recordsets[2]?.[0]?.RECEIVESLIPID,
        });
    } catch (e) {
        logger.error(e, {function: 'preOrderService.createReceislipOrder'});
        await transaction.rollback();
        return new ServiceResponse(false, 'Đặt cọc thất bại !');
    }
};

const exportPDF = async (queryParams = {}) => {
    try {
        const RECEIVE_EXPEND_TYPE = {
            RECEIVE_TYPE: 1,
            EXPEND_TYPE: 2,
        };
        const PAYMENT_TYPE = {
            CASH: 1,
            CREDIT: 2,
        };
        const receivePaymentId = `${apiHelper.getValueFromObject(queryParams, 'id')}_1`;
        const exportType = apiHelper.getValueFromObject(queryParams, 'type');
        if (!receivePaymentId) return new ServiceResponse(false, 'Không tìm thấy dữ liệu !');
        const [id, type] = receivePaymentId.split('_');
        let dataResult;
        const pool = await mssql.pool;
        if (Number(type) === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE) {
            const response = await pool
                .request()
                .input('RECEIVESLIPID', id)
                .execute('SL_RECEIVESLIP_GetToPrint_AdminWeb');
            if (response?.recordset.length <= 0) return new ServiceResponse(false, 'Không tìm thấy dữ liệu !');
            let debtList = JSON.parse(response?.recordset[0]?.DEBTACCOUNTS);
            let creditList = JSON.parse(response?.recordset[0]?.CREDITACCOUNTS);
            //let accountingList = JSON.parse(response?.recordset[0]?.ACCOUNTINGS);

            if (debtList) {
                debtList = [...new Set(debtList.map(_ => _.ACCOUNTINGACCOUNTCODE))]?.join(', ');
            }
            if (creditList) {
                creditList = [...new Set(creditList.map(_ => _.ACCOUNTINGACCOUNTCODE))]?.join(', ');
            }

            dataResult = receiveslipPrint(response?.recordset[0]);
            dataResult.debt_accounts = debtList;
            dataResult.credit_accounts = creditList;
            //dataResult.accounting_list = moduleClass.accountingList(accountingList) || [];
        } else if (Number(type) === RECEIVE_EXPEND_TYPE.EXPEND_TYPE) {
            response = await pool.request().input('PAYMENTSLIPID', id).execute('SL_PAYMENTSLIP_GetToPrint_AdminWeb');
            if (response?.recordset.length <= 0) return new ServiceResponse(false, 'Không tìm thấy dữ liệu !');
            let debtList = JSON.parse(response?.recordset[0]?.DEBTACCOUNTS);
            let creditList = JSON.parse(response?.recordset[0]?.CREDITACCOUNTS);
            let accountingList = JSON.parse(response?.recordset[0]?.ACCOUNTINGS);
            if (debtList) {
                debtList = [...new Set(debtList.map(_ => _.ACCOUNTINGACCOUNTCODE))]?.join(', ');
            }
            if (creditList) {
                creditList = [...new Set(creditList.map(_ => _.ACCOUNTINGACCOUNTCODE))]?.join(', ');
            }

            dataResult = moduleClass.paymentslipPrint(response?.recordset[0]);
            dataResult.debt_accounts = debtList;
            dataResult.credit_accounts = creditList;
            dataResult.accounting_list = moduleClass.accountingList(accountingList) || [];
        } else {
            return new ServiceResponse(false, 'Loại phiếu không hợp lệ !');
        }

        const fileName = `${
            Number(type) === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE ? 'Phiếu thu' : 'Phiếu chi'
        }_${moment().format('DDMMYYYY')}_${id}`;

        const print_params = {
            template: `template-${Number(type) === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE ? 'receiveslip' : 'paymentslip'}${
                Number(exportType) === PAYMENT_TYPE.CREDIT ? '-credit' : ''
            }.html`,
            data: dataResult,
            filename: fileName,
        };

        await pdfHelper.printPDF(print_params);
        return new ServiceResponse(true, '', {path: `${config.domain_cdn}pdf-app/${fileName}.pdf`});
    } catch (e) {
        logger.error(e, {function: 'preOrderService.exportPDF'});
        return new ServiceResponse(false, e.message || e);
    }
};

const getOrderIdByPreorderId = async (bodyParams = {}) => {
    try {
        console.log(">>> check", bodyParams);
        
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PREORDERID', apiHelper.getValueFromObject(bodyParams, 'preorder_id'))
            .execute('SL_PREORDER_GetOrderIdByPreoderId_App');

        return new ServiceResponse(true, 'Lấy đơn hàng thành công', {
            order_id: data.recordset[0]?.ORDERID,
        });
    } catch (e) {
        logger.error(e, {function: 'preOrderService.getOrderIdByPreorderId'});
        return new ServiceResponse(false, 'Đặt cọc thất bại !');
    }
};


//Tạo chữ ký cho đơn hàng
const updateSignature = async bodyParams => {
    try {
        let signature = apiHelper.getValueFromObject(bodyParams, 'signature');
        if (signature) {
            const path_signature = await fileHelper.saveFile(signature, folderName);
            if (path_signature) {
                signature = path_signature;
            } else {
                signature = null;
            }
        }

        const pool = await mssql.pool;

       
        const data = await pool
            .request()
            .input('PREORDERID', apiHelper.getValueFromObject(bodyParams, 'preorder_id'))
            .input('SIGNATURE', signature)

            .execute('SL_PREORDER_UpdateSignature_App');
        if (!data.recordset[0].RESULT) {
            return new ServiceResponse(false, 'Tạo chữ ký thất bại !');
        }
        return new ServiceResponse(true, 'Tạo chữ ký thành công', null);
    } catch (e) {
        logger.error(e, {function: 'orderService.updateSignature'});
        return new ServiceResponse(false, e.message);
    }
};

const checkProductBoughtByPhoneNumber = async params => {
    try {

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(params, 'product_id'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(params, 'phone_number'))

            .execute('SL_PREORDER_CHECK_PRODUCT_BOUGHT_BY_PHONE_NUMBER');
        if (data.recordset.length > 0) {
            return new ServiceResponse(false, 'Sản phẩm đã được đặt bởi số điện thoại này');
        }
        return new ServiceResponse(true, '', null);
    } catch (e) {
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    createReceislipOrder,
    exportPDF,
    getOrderIdByPreorderId,
    updateSignature,
    checkProductBoughtByPhoneNumber
};
