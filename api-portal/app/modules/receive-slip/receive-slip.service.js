const receiveslipClass = require('./receive-slip.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moment = require('moment');
const pdfHelper = require('../../common/helpers/pdf.helper');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('RECEIVETYPEID', apiHelper.getValueFromObject(queryParams, 'receive_type_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            // .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('PAYMENTSTATUS', apiHelper.getFilterBoolean(queryParams, 'payment_status'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(queryParams, 'payment_type'))
            .execute('SL_RECEIVESLIP_GetList');

        let datas = data.recordset;
        return new ServiceResponse(true, '', {
            data: receiveslipClass.list(datas),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(datas),
            statistic:
                data.recordsets[1] && data.recordsets[1].length
                    ? receiveslipClass.statistic(data.recordsets[1][0])
                    : {
                          total_money: 0,
                          total_money_in_month: 0,
                          total_order: 0,
                          total_money_transfer: 0,
                          total_money_cash: 0,
                      },
        });
    } catch (e) {
        logger.error(e, { function: 'receiveslipService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (queryParams = {}) => {
    const receiveSlipId = apiHelper.getValueFromObject(queryParams, 'receive_slip_id');
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('RECEIVESLIPID', receiveSlipId)
            .execute('SL_RECEIVESLIP_GetById_AdminWeb');

        let receiveslip = receiveslipClass.detail(data.recordset[0] || []);

        if (receiveslip) {
            const accountingList = receiveslipClass.accountingList(data.recordsets[1] || []);
            const attachmentList = receiveslipClass.attachmentList(data.recordsets[2] || []);
            receiveslip.accounting_list = accountingList;
            receiveslip.attachment_list = attachmentList;
            receiveslip.attachment_count = attachmentList.length;
            return new ServiceResponse(true, '', receiveslip);
        } else {
            return new ServiceResponse(false, 'Không tìm thấy phiếu thu.');
        }
    } catch (e) {
        logger.error(e, { function: 'receiveslipService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    try {
        let receiveSlipId = apiHelper.getValueFromObject(bodyParams, 'receive_slip_id');
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const currencyType = apiHelper.getValueFromObject(bodyParams, 'currency_type');

        const created_date = apiHelper.getValueFromObject(bodyParams, 'created_date');

        const current_date = moment(created_date, 'DD/MM/YYYY');
        const dateTime = current_date.format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss');
        const inserted_date = moment.utc(dateTime, 'YYYY-MM-DD HH:mm:ss').toDate();

        await transaction.begin();

        const requestReceiveslip = new sql.Request(transaction);
        const data = await requestReceiveslip
            .input('RECEIVESLIPID', receiveSlipId)
            .input('RECEIVESLIPCODE', apiHelper.getValueFromObject(bodyParams, 'receive_slip_code'))
            .input('CASHIERID', apiHelper.getValueFromObject(bodyParams, 'cashier_id'))
            .input('TOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'total_money'))
            .input('PAYMENTDATE', apiHelper.getValueFromObject(bodyParams, 'payment_date'))
            .input('RECEIVETYPEID', apiHelper.getValueFromObject(bodyParams, 'receive_type_id'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'descriptions'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'payment_type'))
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review', 1))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'payment_status'))
            .input('RECEIVERTYPE', apiHelper.getValueFromObject(bodyParams, 'receiver_type'))
            .input('RECEIVERID', apiHelper.getValueFromObject(bodyParams, 'receiver_id'))
            .input('RECEIVERNAME', apiHelper.getValueFromObject(bodyParams, 'receiver_name'))
            .input('BANKACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'bank_account_id'))
            .input('ISDEPOSIT', apiHelper.getValueFromObject(bodyParams, 'is_deposit'))
            .input('ISBOOKKEEPING', apiHelper.getValueFromObject(bodyParams, 'is_bookkeeping'))
            .input('ACCOUNTINGDATE', apiHelper.getValueFromObject(bodyParams, 'accounting_date'))
            .input('CREATEDDATE', inserted_date)
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('NOTES', apiHelper.getValueFromObject(bodyParams, 'notes'))
            .input('CURRENCYTYPE', currencyType)
            .input('CREATEDUSER', authName)
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id'))
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .execute('SL_RECEIVESLIP_CreateOrUpdate_AdminWeb');

        receiveSlipId = data.recordset[0].RESULT;
        if (receiveSlipId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.RECEIVESLIP.CREATE_FAILED);
        }

        // insert or update accounting list
        const accountingList = apiHelper.getValueFromObject(bodyParams, 'accounting_list');
        if (accountingList && accountingList.length > 0) {
            await _createOrUpdateAccountingList(accountingList, currencyType, receiveSlipId, authName, transaction);
        }

        // insert or update attachemnt list
        const attachmentList = apiHelper.getValueFromObject(bodyParams, 'attachment_list');
        if (attachmentList && attachmentList.length > 0) {
            await _createOrUpdateAttachmentList(attachmentList, receiveSlipId, authName, transaction);
        }

        await transaction.commit();
        return new ServiceResponse(true, '', receiveSlipId);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { receiveslip: 'receiveslipService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const createListReceiveSlip = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    const dataList = apiHelper.getValueFromObject(bodyParams, 'data_list', []);
    const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');

    const ids = [];

    try {
        await transaction.begin();

        for (let receiveslip of dataList) {
            const id = await _createReceiveSlip(receiveslip, transaction, authName);

            if (!id) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Tạo phiếu thu thất bại !');
            } else {
                ids.push(id);
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, '', ids);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'receiveslipService.createListReceiveSlip' });
        return new ServiceResponse(false, 'Tạo phiếu thu thất bại !');
    }
};

const _createReceiveSlip = async (bodyParams, transaction, auth) => {
    // VND
    const currencyType = 1;

    const request = new sql.Request(transaction);

    const dataRes = await request
        .input('RECEIVESLIPID', null)
        .input('RECEIVESLIPCODE', apiHelper.getValueFromObject(bodyParams, 'receive_slip_code'))
        .input('CASHIERID', apiHelper.getValueFromObject(bodyParams, 'cashier_id'))
        .input('TOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'total_money'))
        .input('PAYMENTDATE', apiHelper.getValueFromObject(bodyParams, 'payment_date'))
        .input('RECEIVETYPEID', apiHelper.getValueFromObject(bodyParams, 'receive_type_id'))
        .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'descriptions'))
        .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
        .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
        .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
        .input('PAYMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'payment_type'))
        .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review', 1))
        .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'payment_status'))
        .input('RECEIVERTYPE', apiHelper.getValueFromObject(bodyParams, 'receiver_type'))
        .input('RECEIVERID', apiHelper.getValueFromObject(bodyParams, 'receiver_id'))
        .input('RECEIVERNAME', apiHelper.getValueFromObject(bodyParams, 'receiver_name'))
        .input('BANKACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'bank_account_id'))
        .input('ISDEPOSIT', apiHelper.getValueFromObject(bodyParams, 'is_deposit'))
        .input('ISBOOKKEEPING', apiHelper.getValueFromObject(bodyParams, 'is_bookkeeping'))
        .input('ACCOUNTINGDATE', apiHelper.getValueFromObject(bodyParams, 'accounting_date'))
        .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
        .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
        .input('NOTES', apiHelper.getValueFromObject(bodyParams, 'notes'))
        .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
        .input('CURRENCYTYPE', currencyType)
        .input('CREATEDUSER', auth)
        .execute('SL_RECEIVESLIP_CreateOrUpdate_AdminWeb');

    const receiveSlipId = dataRes.recordset[0].RESULT;

    if (receiveSlipId <= 0) {
        return null;
    }

    // insert or update accounting list
    const accountingList = apiHelper.getValueFromObject(bodyParams, 'accounting_list');
    if (accountingList && accountingList.length > 0) {
        const result = await _createOrUpdateAccountingList(
            accountingList,
            currencyType,
            receiveSlipId,
            auth,
            transaction,
        );
        if (result.isFailed()) {
            return null;
        }
    }

    // insert or update attachemnt list
    const attachmentList = apiHelper.getValueFromObject(bodyParams, 'attachment_list');
    if (attachmentList && attachmentList.length > 0) {
        const result = await _createOrUpdateAttachmentList(attachmentList, receiveSlipId, auth, transaction);
        if (result.isFailed()) {
            return null;
        }
    }

    return receiveSlipId;
};

const _createOrUpdateAccountingList = async (accountingList, accuracyType, receiveSlipId, authName, transaction) => {
    const accountingIds = accountingList
        .filter((accounting) => accounting.accounting_id)
        ?.map((accounting) => accounting.accounting_id);

    try {
        // delete unnessary accounting
        if (accountingIds.length > 0) {
            const deleteRequest = new sql.Request(transaction);
            const deleteResult = await deleteRequest
                .input('LISTID', accountingIds)
                .input('RECEIVESLIPID', receiveSlipId)
                .input('PAYMENTSLIPID', null)
                .input('DELETEDUSER', authName)
                .execute('AC_ACCOUNTING_DeleteAllExcept_AdminWeb');
            if (!deleteResult.recordset[0]?.RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, `Xóa hạch toán thất bại !`);
            }
        }

        // insert or update accounting list
        for (let accounting of accountingList) {
            const accountingRequest = new sql.Request(transaction);
            const resultChild = await accountingRequest
                .input('ACCOUNTINGID', apiHelper.getValueFromObject(accounting, 'accounting_id'))
                .input('DEBTACCOUNT', apiHelper.getValueFromObject(accounting, 'debt_account'))
                .input('CREDITACCOUNT', apiHelper.getValueFromObject(accounting, 'credit_account'))
                .input('EXPLAIN', apiHelper.getValueFromObject(accounting, 'explain'))
                .input('RECEIVESLIPID', receiveSlipId)
                .input('PAYMENTSLIPID', apiHelper.getValueFromObject(accounting, 'payment_slip_id'))
                .input('MONEY', apiHelper.getValueFromObject(accounting, 'money'))
                .input('CURRENCYTYPE', accuracyType)
                .input('CREATEDUSER', authName)
                .execute('AC_ACCOUNTING_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, `Thêm mới hoặc chỉnh sửa hạch toán thất bại !`);
            }
        }

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { function: 'receiveslipService.createOrUpdateAcocunting' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thao tác hạch toán thất bại !');
    }
};

const _createOrUpdateAttachmentList = async (attachmentList, receiveSlipId, authName, transaction) => {
    const attachmentIds = attachmentList
        .filter((attachment) => attachment.receive_slip_attachment_id)
        ?.map((attachment) => attachment.receive_slip_attachment_id);

    try {
        // delete unnessary attachments
        if (attachmentIds.length > 0) {
            const deleteRequest = new sql.Request(transaction);
            const deleteResult = await deleteRequest
                .input('LISTID', attachmentIds)
                .input('RECEIVESLIPID', receiveSlipId)
                .input('DELETEDUSER', authName)
                .execute('SL_RECEIVESLIP_ATTACHMENT_DeleteAllExcept_AdminWeb');
            if (!deleteResult.recordset[0]?.RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, `Xóa tẹp đính kèm thất bại !`);
            }
        }

        // insert attachments
        for (let accounting of attachmentList) {
            const accountingRequest = new sql.Request(transaction);
            const resultChild = await accountingRequest
                .input(
                    'RECEIVESLIPATTACHMENTID',
                    apiHelper.getValueFromObject(accounting, 'receive_slip_attachment_id'),
                )
                .input('RECEIVESLIPID', receiveSlipId)
                .input('ATTACHMENTPATH', apiHelper.getValueFromObject(accounting, 'attachment_path'))
                .input('ATTACHMENTNAME', apiHelper.getValueFromObject(accounting, 'attachment_name'))
                .input('CREATEDUSER', authName)
                .execute('SL_RECEIVESLIP_ATTACHMENT_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, `Thêm mới hoặc chỉnh sửa tệp đính kèm thất bại !`);
            }
        }

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { function: 'receiveslipService._createOrUpdateAttachmentList' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thao tác tệp đính kèm thất bại !');
    }
};

const getCashierByCompanyId = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .execute('SL_RECEIVESLIP_GetCashierByCompanyId_AdminWeb');
        return new ServiceResponse(true, '', receiveslipClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'receiveslipService.getCashierByCompanyId' });
        return new ServiceResponse(false, '', []);
    }
};

const genReceiveSlipCode = async (query) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CODETYPE', query?.type)
            .execute(PROCEDURE_NAME.SL_RECEIVESLIP_GEN_CODE_ADMINWEB);
        let ReceiveSlipCode = data.recordset;
        if (ReceiveSlipCode && ReceiveSlipCode.length > 0) {
            ReceiveSlipCode = receiveslipClass.genReceiveSlipCode(ReceiveSlipCode[0]);
            return new ServiceResponse(true, '', ReceiveSlipCode);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'receiveslipService.genReceiveSlipCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const exportPDF = async (queryParams = {}) => {
    try {
        const receiveSlipId = apiHelper.getValueFromObject(queryParams, 'receive_slip_id');
        if (!receiveSlipId) return new ServiceResponse(false, 'Không tìm thấy phiếu thu!!!');

        // Lấy thông tin phiếu
        let receiveslip = {};
        const pool = await mssql.pool;
        const dataReceipt = await pool
            .request()
            .input('RECEIVESLIPID', receiveSlipId)
            .execute('SL_RECEIVESLIP_GetToPrint_AdminWeb');
        if (!dataReceipt || !dataReceipt.recordset || !dataReceipt.recordset.length)
            return new ServiceResponse(false, 'Không tìm thấy phiếu thu!!!');
        receiveslip = receiveslipClass.receiveslipPrint(dataReceipt.recordset[0]);

        const fileName = `Phieu_thu_${moment().format('DDMMYYYY')}_${receiveSlipId}`;
        const print_params = {
            template: `template-receiveslip.html`,
            data: receiveslip,
            filename: fileName,
        };
        await pdfHelper.printPDF(print_params);
        return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'receiveslipService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

const confirmReceiveMoney = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(params, 'internal_transfer_id'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('SL_INTERNALTRANSFER_ConfirmReceiveMoney_AdminWeb');

        return new ServiceResponse(true, 'Xác nhận nhận tiền thành công');
    } catch (error) {
        logger.error(error, { function: 'paymentSlipService.confirmReceiveMoney' });
        return new ErrorResponse(false, error.message);
    }
};

module.exports = {
    getList,
    detail,
    createOrUpdate,
    getCashierByCompanyId,
    genReceiveSlipCode,
    exportPDF,
    createListReceiveSlip,
    confirmReceiveMoney,
};
