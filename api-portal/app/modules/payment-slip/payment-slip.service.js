const paymentSlipClass = require('../payment-slip/payment-slip.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const moment = require('moment');
const pdfHelper = require('../../common/helpers/pdf.helper');

// const createOrUpdatePaymentSlip = async (bodyParams) => {
//     const pool = await mssql.pool;
//     const transaction = await new sql.Transaction(pool);
//     const id = apiHelper.getValueFromObject(bodyParams, 'payment_slip_id');
//     const orderItems = apiHelper.getValueFromObject(bodyParams, 'order_items');
//     let total_money = `${apiHelper.getValueFromObject(bodyParams, 'total_money')}`;

//     try {
//         await transaction.begin();
//         const requestPaymentslip = new sql.Request(transaction);
//         const data = await requestPaymentslip
//             .input('PAYMENTSLIPID', apiHelper.getValueFromObject(bodyParams, 'payment_slip_id'))
//             .input('PAYMENTSLIPCODE', apiHelper.getValueFromObject(bodyParams, 'payment_slip_code'))
//             .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
//             .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
//             .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
//             .input('EXPENDTYPEID', apiHelper.getValueFromObject(bodyParams, 'expend_type_id'))
//             .input('PAYMENTDATE', apiHelper.getValueFromObject(bodyParams, 'payment_date'))
//             .input('TOTALMONEY', total_money)
//             .input('NOTES', apiHelper.getValueFromObject(bodyParams, 'notes'))
//             .input('PAYERID', apiHelper.getValueFromObject(bodyParams, 'payer_id'))
//             .input('RECEIVERID', apiHelper.getValueFromObject(bodyParams, 'receiver_id'))
//             .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
//             .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
//             .input('PAYMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'payment_type'))
//             .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'payment_status'))
//             .input('BANKACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'bank_account_id'))
//             .input('RECEIVERTYPE', apiHelper.getValueFromObject(bodyParams, 'receiver_type'))
//             .execute('SL_PAYMENTSLIP_CreateOrUpdate');

//         const paymentSlipID = data.recordset[0].RESULT;
//         if (paymentSlipID <= 0) {
//             await transaction.rollback();
//             return new ServiceResponse(false, 'Thêm mới phiếu chi thất bại.');
//         }
//         // Luu cac file vào module
//         let files = apiHelper.getValueFromObject(bodyParams, 'payment_slip_files');
//         files = (files || []).filter((x) => !x.file_id && !x.file_module_id);
//         if (files && files.length > 0) {
//             const requestCreateFileModule = new sql.Request(transaction);
//             for (let i = 0; i < files.length; i++) {
//                 let item = files[i];
//                 const resultChild = await requestCreateFileModule
//                     .input('MODULENAME', 'SL_PAYMENTSLIP')
//                     .input('MODULEID', paymentSlipID)
//                     .input('FILENAME', apiHelper.getValueFromObject(item, 'file_name'))
//                     .input('FILEURL', apiHelper.getValueFromObject(item, 'file_url') || '')
//                     .input('FILEEXT', apiHelper.getValueFromObject(item, 'file_ext'))
//                     .input('FILEMIME', apiHelper.getValueFromObject(item, 'file_mime'))
//                     .input('FILESIZE', apiHelper.getValueFromObject(item, 'file_size'))
//                     .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
//                     .execute('FM_FILE_MODULE_Create_AdminWeb');

//                 const childId = resultChild.recordset[0].RESULT;
//                 if (childId <= 0) {
//                     await transaction.rollback();
//                     return new ServiceResponse(false, `Thêm mới chứng từ thất bại`);
//                 }
//             }
//         }

//         // Lưu mức duyệt nếu có
//         if (id && id != '') {
//             const requestReceiptPaymentReviewListDelete = new sql.Request(transaction);
//             const resultReceiptPaymentReviewList = await requestReceiptPaymentReviewListDelete
//                 .input('PAYMENTSLIPID', id)
//                 .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
//                 .execute('SL_RECEIPTPAYMENT_REVIEWLIST_Delete_AdminWeb');

//             if (!resultReceiptPaymentReviewList.recordset[0].RESULT) {
//                 await transaction.rollback();
//                 return new ServiceResponse(false, 'Xóa mức duyệt thất bại!');
//             }
//         }
//         let dataReviewList = apiHelper.getValueFromObject(bodyParams, 'review_level_list', []);
//         dataReviewList = (dataReviewList || []).filter((x) => !x.review_date);
//         if (dataReviewList && dataReviewList.length) {
//             let requestReviewList = new sql.Request(transaction);
//             for (let i = 0; i < dataReviewList.length; i++) {
//                 let { review_level_id, review_user, is_auto_review = 0, review_list_id } = dataReviewList[i];
//                 if (review_level_id) {
//                     let resultReviewList = await requestReviewList // eslint-disable-line no-await-in-loop
//                         .input('PAYMENTSLIPID', paymentSlipID)
//                         .input('REVIEWLEVELID', review_level_id)
//                         .input('REVIEWUSER', review_user)
//                         .input('ISAUTOREVIEW', is_auto_review)
//                         .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
//                         .input('REVIEWLISTID', review_list_id)
//                         .execute('SL_RECEIPTPAYMENT_REVIEWLIST_Create_AdminWeb');

//                     if (!resultReviewList.recordset[0].RESULT) {
//                         await transaction.rollback();
//                         return new ServiceResponse(false, 'Thêm mức duyệt thất bại!');
//                     }
//                 }
//             }
//         }

//         await transaction.commit();
//         return new ServiceResponse(true, '', paymentSlipID);
//     } catch (e) {
//         console.log(e);
//         await transaction.rollback();
//         logger.error(e, { function: 'paymentSlip.createOrUpdatePaymentSlip' });
//         return new ServiceResponse(false, RESPONSE_MSG.PAYMENTSLIP.CREATE_FAILED);
//     }
// };

const createOrUpdate = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    try {
        let paymentSlipId = apiHelper.getValueFromObject(bodyParams, 'payment_slip_id');
        let isAdd = !paymentSlipId;
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const curencyType = apiHelper.getValueFromObject(bodyParams, 'currency_type');

        const created_date = apiHelper.getValueFromObject(bodyParams, 'created_date');

        const current_date = moment(created_date, 'DD/MM/YYYY');
        const dateTime = current_date.format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss');
        const inserted_date = moment.utc(dateTime, 'YYYY-MM-DD HH:mm:ss').toDate();
        const invoice_id = apiHelper.getValueFromObject(bodyParams, 'invoice_id');
        const totalMoney = apiHelper.getValueFromObject(bodyParams, 'total_money');

        await transaction.begin();
        const requestPaymentSlip = new sql.Request(transaction);
        const data = await requestPaymentSlip
            .input('PAYMENTSLIPID', paymentSlipId)
            .input('PAYMENTSLIPCODE', apiHelper.getValueFromObject(bodyParams, 'payment_slip_code'))
            .input('PAYERID', apiHelper.getValueFromObject(bodyParams, 'payer_id'))
            .input('TOTALMONEY', totalMoney)
            .input('PAYMENTDATE', apiHelper.getValueFromObject(bodyParams, 'payment_date'))
            .input('EXPENDTYPEID', apiHelper.getValueFromObject(bodyParams, 'expend_type_id'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(bodyParams, 'descriptions'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'payment_type'))
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review', 2))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'payment_status'))
            .input('RECEIVERTYPE', apiHelper.getValueFromObject(bodyParams, 'receiver_type'))
            .input('RECEIVERID', apiHelper.getValueFromObject(bodyParams, 'receiver_id'))
            .input('RECEIVERNAME', apiHelper.getValueFromObject(bodyParams, 'receiver_name'))
            .input('BANKACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'bank_account_id'))
            .input('ISBOOKKEEPING', apiHelper.getValueFromObject(bodyParams, 'is_bookkeeping'))
            .input('ACCOUNTINGDATE', apiHelper.getValueFromObject(bodyParams, 'accounting_date'))
            .input('CREATEDDATE', inserted_date)
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(bodyParams, 'purchase_order_id'))
            .input('INVOICEID', invoice_id)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('NOTES', apiHelper.getValueFromObject(bodyParams, 'notes'))
            .input('CURRENCYTYPE', curencyType)
            .input('CREATEDUSER', authName)
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id'))
            .input('ISMULTIPLEINVOICE', apiHelper.getValueFromObject(bodyParams, 'is_multiple_invoice'))
            .execute('SL_PAYMENTSLIP_CreateOrUpdate_AdminWeb');

        paymentSlipId = data.recordset[0].RESULT;
        if (paymentSlipId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.PAYMENTSLIP.CREATE_FAILED);
        }

        // insert or update accounting list
        const accountingList = apiHelper.getValueFromObject(bodyParams, 'accounting_list');
        if (accountingList && accountingList.length > 0) {
            await _createOrUpdateAccountingList(accountingList, curencyType, paymentSlipId, authName, transaction);
        }

        // insert or update invocie purchase payment
        const invoicePaymentList = apiHelper.getValueFromObject(bodyParams, 'invoice_payment_list');

        if (invoicePaymentList && isAdd && invoice_id && invoicePaymentList.length > 0) {
            // update price
            invoicePaymentList?.forEach((payment, index) => {
                payment.remaining_price = totalMoney ?? payment.remaining_price;
            });

            await _createPaymentList(invoicePaymentList, paymentSlipId, invoice_id, authName, transaction);
        } else if (invoicePaymentList && invoicePaymentList.length > 0 && !invoice_id) {
            // Tạo nhiều hóa đơn
            await _createPaymentList(invoicePaymentList, paymentSlipId, invoice_id, authName, transaction);
        }

        // insert or update attachemnt list
        const attachmentList = apiHelper.getValueFromObject(bodyParams, 'attachment_list');
        if (attachmentList && attachmentList.length > 0) {
            await _createOrUpdateAttachmentList(attachmentList, paymentSlipId, authName, transaction);
        }

        // remove review list
        if (paymentSlipId) {
            const requestReceiptPaymentReviewListDelete = new sql.Request(transaction);
            const resultReceiptPaymentReviewList = await requestReceiptPaymentReviewListDelete
                .input('PAYMENTSLIPID', paymentSlipId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_RECEIPTPAYMENT_REVIEWLIST_Delete_AdminWeb');

            if (!resultReceiptPaymentReviewList.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa mức duyệt thất bại!');
            }
        }

        // insert review list
        let dataReviewList = apiHelper.getValueFromObject(bodyParams, 'review_list', []);
        dataReviewList = (dataReviewList || []).filter((x) => !x.review_date);
        if (dataReviewList && dataReviewList.length) {
            let requestReviewList = new sql.Request(transaction);
            for (let i = 0; i < dataReviewList.length; i++) {
                let { review_level_id, user_review, is_auto_review = 0, review_list_id } = dataReviewList[i];
                if (review_level_id) {
                    let resultReviewList = await requestReviewList
                        .input('PAYMENTSLIPID', paymentSlipId)
                        .input('REVIEWLEVELID', review_level_id)
                        .input('REVIEWUSER', user_review)
                        .input('ISAUTOREVIEW', is_auto_review)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('REVIEWLISTID', review_list_id)
                        .execute('SL_RECEIPTPAYMENT_REVIEWLIST_Create_AdminWeb');
                    if (!resultReviewList.recordset[0].RESULT) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Thêm mức duyệt thất bại!');
                    }
                }
            }
        }

        // Update công nợ
        const purchase_order_id = apiHelper.getValueFromObject(bodyParams, 'purchase_order_id');
        const purchase_cost_id = apiHelper.getValueFromObject(bodyParams, 'purchase_cost_id');
        const total_paid = apiHelper.getValueFromObject(bodyParams, 'total_money'); // tiền đã trả
        if (purchase_order_id) {
            const createDebit = new sql.Request(transaction);
            const res = await createDebit
                .input('TOTALPAID', total_paid)
                // .input('TOTALAMOUNT', total_paid)
                // .input('TOTALMONEY', total_paid)
                .input('PURCHASEORDERID', purchase_order_id)
                .input('PURCHASECOSTSID', purchase_cost_id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_DEBIT_CreateOrUpdate_AdminWeb');

            const debitId = res.recordset[0]?.RESULT;
            if (debitId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi tạo công nợ ');
            }
            // Tạo chi tiết phiếu công nợ
            const createDebitDetail = new sql.Request(transaction);
            const res1 = await createDebitDetail
                .input('DEBITID', debitId)
                .input('TOTALAMOUNT', total_paid)
                .input('TOTALMONEY', total_paid)
                .input('TOTALPAID', 0)
                .input('PAYMENTSTATUS', apiHelper.getValueFromObject(bodyParams, 'is_review')) // 1: đã thanh toán, 2: chưa thanh toán, 3: thanh toán 1 phần
                .input('PAYMENTSLIPID', paymentSlipId)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SL_DEBITDETAIL_CreateOrUpdate_AdminWeb');
            const debitDetailId = res1.recordset[0]?.RESULT;
            if (debitDetailId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi tạo chi tiết công nợ ');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', paymentSlipId);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { receiveslip: 'paymentslipService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const _createOrUpdateAccountingList = async (accountingList, accuracyType, paymentSlipId, authName, transaction) => {
    const accountingIds = accountingList
        .filter((accounting) => accounting.accounting_id)
        ?.map((accounting) => accounting.accounting_id);

    try {
        // delete unnessary accounting
        if (accountingIds.length > 0) {
            const deleteRequest = new sql.Request(transaction);
            const deleteResult = await deleteRequest
                .input('LISTID', accountingIds)
                .input('RECEIVESLIPID', null)
                .input('PAYMENTSLIPID', paymentSlipId)
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
                .input('PAYMENTSLIPID', paymentSlipId)
                .input('RECEIVESLIPID', apiHelper.getValueFromObject(accounting, 'receiveslip_id'))
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
    } catch (error) {
        logger.error(error, { function: 'paymentslipService.createOrUpdateAcocunting' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thao tác hạch toán thất bại !');
    }
};

const _createPaymentList = async (invoicePaymentList, paymentSlipId, invoiceId, authName, transaction) => {
    for (let payment of invoicePaymentList) {
        const accountingRequest = new sql.Request(transaction);
        await accountingRequest
            .input('INVOICEID', apiHelper.getValueFromObject(payment, 'invoice_id') || invoiceId)
            .input('PURCHASEORDERID', apiHelper.getValueFromObject(payment, 'purchase_order_id'))
            .input('PAYMENTSLIPID', paymentSlipId)
            .input('PAYMENTVALUE', apiHelper.getValueFromObject(payment, 'remaining_price'))
            .input('CREATEDUSER', authName)
            .input('INVOICEPAYMENTID', apiHelper.getValueFromObject(payment, 'invoice_payment_id'))
            .input('PAYMENTDEBT', apiHelper.getValueFromObject(payment, 'payment_debt'))
            .execute('SL_INVOICEPAYMENT_CreateOrUpdate_AdminWeb');
    }
};

const _createOrUpdateAttachmentList = async (attachmentList, paymentSlipId, authName, transaction) => {
    const attachmentIds = attachmentList
        .filter((attachment) => attachment.payment_slip_attachment_id)
        ?.map((attachment) => attachment.payment_slip_attachment_id);

    try {
        // delete unnessary attachments
        if (attachmentIds.length > 0) {
            const deleteRequest = new sql.Request(transaction);
            const deleteResult = await deleteRequest
                .input('LISTID', attachmentIds)
                .input('PAYMENTSLIPID', paymentSlipId)
                .input('DELETEDUSER', authName)
                .execute('SL_PAYMENT_ATTACHMENT_DeleteAllExcept_AdminWeb');
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
                    'PAYMENTSLIPATTACHMENTID',
                    apiHelper.getValueFromObject(accounting, 'payment_slip_attachment_id'),
                )
                .input('PAYMENTSLIPID', paymentSlipId)
                .input('ATTACHMENTPATH', apiHelper.getValueFromObject(accounting, 'attachment_path'))
                .input('ATTACHMENTNAME', apiHelper.getValueFromObject(accounting, 'attachment_name'))
                .input('CREATEDUSER', authName)
                .execute('SL_PAYMENT_ATTACHMENT_CreateOrUpdate_AdminWeb');

            const childId = resultChild.recordset[0].RESULT;
            if (childId <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, `Thêm mới hoặc chỉnh sửa tệp đính kèm thất bại !`);
            }
        }
    } catch (error) {
        logger.error(error, { function: 'paymentSlipService._createOrUpdateAttachmentList' });
        await transaction.rollback();
        return new ServiceResponse(false, 'Thao tác tệp đính kèm thất bại !');
    }
};

const getOptionsExpendType = async function (queryParams = {}) {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.MD_EXPENDTYPE_GET_OPTION);
        const dataRecord = data.recordset;
        return new ServiceResponse(true, '', paymentSlipClass.expendType(dataRecord));
    } catch (e) {
        logger.error(e, { function: 'paymentSlip.getOptionsExpendType' });
        return [];
    }
};

const getOptionsPayer = async function (queryParams = {}) {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.SL_PAYMENTSLIP_GET_OPTION_PAYER);
        const dataRecord = data.recordset;
        return new ServiceResponse(true, '', paymentSlipClass.getOptionsPayer(dataRecord));
    } catch (e) {
        logger.error(e, { function: 'paymentSlip.getOptionsPayer' });
        return [];
    }
};

const getCountByDate = async function (queryParams = {}) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CREATEDDATE', apiHelper.getValueFromObject(queryParams, 'create_date'))
            .execute(PROCEDURE_NAME.SL_PAYMENTSLIP_GET_COUNT_BY_DATE);
        const dataRecord = data.recordset[0];
        return new ServiceResponse(true, '', paymentSlipClass.getCountByDate(dataRecord));
    } catch (e) {
        logger.error(e, { function: 'paymentSlip.getCountByDate' });
        return [];
    }
};

const detailPaymentSlip = async (queryParams = {}) => {
    const paymenet_slip_id = apiHelper.getValueFromObject(queryParams, 'payment_slip_id');
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAYMENTSLIPID', paymenet_slip_id)
            .execute('SL_PAYMENTSLIP_GetById_AdminWeb');

        let paymentSlip = paymentSlipClass.detail(data.recordset[0] || []);

        if (paymentSlip) {
            const accountingList = paymentSlipClass.accountingList(data.recordsets[1] || []);
            const attachmentList = paymentSlipClass.attachmentList(data.recordsets[2] || []);
            const reviewList = paymentSlipClass.userReviewList(data.recordsets[3] || []);
            const invoiceList = paymentSlipClass.invoiceList(data.recordsets[4] || []);

            paymentSlip.accounting_list = accountingList;
            paymentSlip.attachment_list = attachmentList;
            paymentSlip.review_list = reviewList;
            paymentSlip.attachment_count = attachmentList.length;
            paymentSlip.invoice_payment_list = invoiceList;
            paymentSlip.invoice_ids = invoiceList?.map((_) => _.invoice_id) || [];
            paymentSlip.invoice_options = invoiceList?.map((_) => ({ value: _.invoice_id, label: _.invoice_no })) || [];

            // attach user review list
            const userReviewListRes = await getReviewLevelByExpendType({
                expend_type_id: paymentSlip?.expend_type_id,
            });

            if (userReviewListRes.isSuccess()) {
                const userReviewList = userReviewListRes.getData();
                paymentSlip.review_list?.forEach((reviewList) => {
                    const targetReview = userReviewList.find((_) => _.review_level_id === reviewList.review_level_id);
                    reviewList.users = targetReview?.users || [];
                    reviewList.is_complete_review = targetReview?.is_complete_review;
                    reviewList.is_auto_review = targetReview?.is_auto_review;
                });
            }

            return new ServiceResponse(true, '', paymentSlip);
        } else {
            return new ServiceResponse(false, 'Không tìm thấy phiếu chi.');
        }
    } catch (e) {
        logger.error(e, { function: 'paymentslipService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

// const detailPaymentSlip = async (queryParams = {}) => {
//     try {
//         const pool = await mssql.pool;
//         const data = await pool
//             .request()
//             .input('PAYMENTSLIPID', apiHelper.getValueFromObject(queryParams, 'paymentSlipId'))
//             .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
//             .execute('SL_PAYMENTSLIP_GetById_AdminWeb');

//         let paymentSlip = paymentSlipClass.detail(data.recordset[0]);
//         paymentSlip.payment_slip_files = [];

//         if (paymentSlip && paymentSlip.payment_slip_id) {
//             paymentSlip.payment_slip_files = paymentSlipClass.files(data.recordsets[1]);
//             paymentSlip.expend_type = paymentSlipClass.expendType(data.recordsets[2][0]);

//             if (data.recordsets[5] && data.recordsets[5].length > 0) {
//                 paymentSlip.orderItems = (paymentSlipClass.listOrder(data.recordsets[5], true) || []).reduce(
//                     (obj, order) => {
//                         obj[order.order_id] = order;
//                         return obj;
//                     },
//                     {},
//                 );
//             }

//             paymentSlip.review_level_list = paymentSlipClass.reviewList(data.recordsets[3]);
//             const users = paymentSlipClass.reviewUsers(data.recordsets[4]);
//             if (users && users.length) {
//                 paymentSlip.review_level_list = (paymentSlip.review_level_list || []).map((x) => {
//                     return {
//                         ...x,
//                         users: users.filter((u) => u.review_level_id == x.review_level_id),
//                     };
//                 });
//             }
//             // Kiem tra phieu dang duyet hay khong
//             if (
//                 paymentSlip.is_review == 2 &&
//                 (paymentSlip.review_level_list || []).filter((x) => !x.is_auto_review && x.review_date).length
//             ) {
//                 paymentSlip.is_review = 3; // dang duyet
//             }
//         }
//         return new ServiceResponse(true, '', paymentSlip);
//     } catch (e) {
//         logger.error(e, { function: 'paymentSlipService.detailPaymentSlip' });
//         return new ServiceResponse(false, e.message);
//     }
// };

const getPaymentSlipImage = async (paymentSlipId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAYMENTSLIPID', paymentSlipId)
            .execute(PROCEDURE_NAME.SL_PAYMENTSLIP_GET_IMAGE);
        let paymentSlip = paymentSlipClass.getPaymentSlipImage(data.recordset);
        return new ServiceResponse(true, '', paymentSlip);
    } catch (e) {
        logger.error(e, { function: 'paymentSlipService.getPaymentSlipImage' });
        return new ServiceResponse(false, e.message);
    }
};

const exportPDF = async (queryParams = {}) => {
    try {
        let paymentSlipId = queryParams.payment_slip_id;
        if (!paymentSlipId) return new ServiceResponse(false, 'Không tìm thấy phiếu chi!!!');
        let paymentslip = {};

        const pool = await mssql.pool;
        // Get info receipt
        const dataPaymentSlip = await pool
            .request()
            .input('PAYMENTSLIPID', paymentSlipId)
            .execute('SL_PAYMENTSLIP_GetToPrint_AdminWeb');
        if (!dataPaymentSlip || !dataPaymentSlip.recordset || !dataPaymentSlip.recordset.length)
            return new ServiceResponse(false, 'Không tìm thấy phiếu chi!!!');
        paymentslip = paymentSlipClass.paymentslipPrint(dataPaymentSlip.recordset[0]);
        const fileName = `Phieu_chi_${moment().format('DDMMYYYY')}_${paymentSlipId}`;
        const print_params = {
            template: `template-paymentslip.html`,
            data: paymentslip,
            filename: fileName,
        };
        await pdfHelper.printPDF(print_params);
        return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'paymentslipService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

const genPaymentSlipCode = async (query) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PREFIX', query?.type == 2 ? 'UNC' : 'PC')
            .input('TABLENAME', 'SL_PAYMENTSLIP')
            .input('RIGHTCHARACTER', 3)
            .input('ISSEPARATOR', 0)
            .execute('FN_GENERATE_CODE');

        if (data && Object.keys(data.output).length) {
            return new ServiceResponse(true, '', Object.values(data.output)[0]);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'paymentslipService.genPaymentSlipCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const deleteFile = async (params) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('FILEMODULEID', apiHelper.getValueFromObject(params, 'file_module_id'))
            .input('FILEID', apiHelper.getValueFromObject(params, 'file_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('FM_FILE_MODULE_DeleteById_AdminWeb');

        const ERRMSG = data.recordset[0].ERRMSG;
        if (ERRMSG) {
            return new ServiceResponse(false, ERRMSG);
        }
        return new ServiceResponse(true, '', 'ok');
    } catch (e) {
        logger.error(e, { function: 'paymentSlipService.deleteFile' });
        return new ServiceResponse(false, e.message);
    }
};

const approvedReviewList = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('REVIEWLISTID', apiHelper.getValueFromObject(bodyParams, 'review_list_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(bodyParams, 'review_note'))
            .input('REVIEWUSER', bodyParams.auth_name)
            .execute('SL_RECEIPTPAYMENT_REVIEWLIST_Approved_AdminWeb');

        let result = data.recordset[0].RESULT;

        switch (result) {
            case 1:
                return new ServiceResponse(true, 'Approved successed.');
            case 0:
                return new ServiceResponse(false, 'Approved failed.', { reason: 'Mức duyệt đã được duyệt.' });
            case -1:
                return new ServiceResponse(false, 'Approved failed.', { reason: 'Mức duyệt không tồn tại.' });
            default:
                return new ServiceResponse(false, 'Approved failed.', { reason: 'Unknown' });
        }
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'paymentSlipService.approvedReviewList' });
        return new ServiceResponse(false, e.message);
    }
};

const getReceiverOptions = async function (queryParams = {}) {
    try {
        const receiverType = apiHelper.getValueFromObject(queryParams, 'receiver_type');
        if (receiverType == 0 || receiverType > 5 || receiverType == 4) return new ServiceResponse(true, '', []);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TYPE', receiverType)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .execute('SL_PAYMENTSLIP_GetReceiverOptions_AdminWeb');

        const dataRecord = data.recordset;
        return new ServiceResponse(true, '', paymentSlipClass.receiverOptions(dataRecord));
    } catch (e) {
        logger.error(e, { function: 'paymentSlipService.getReceiverOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const getListOrder = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('SORTCOLUMN', apiHelper.getValueFromObject(queryParams, 'sort_column', 'created_date'))
            .input('SORTDIRECTION', apiHelper.getValueFromObject(queryParams, 'sort_direction', 'asc'))
            .input('SHIPPINGUNITID', apiHelper.getValueFromObject(queryParams, 'customer_id', null))
            .input('DELIVERYCODE', apiHelper.getValueFromObject(queryParams, 'delivery_code', null))
            .execute('SL_PAYMENT_GetListOrderShipping_AdminWeb');

        const datas = data.recordset;
        return new ServiceResponse(true, '', {
            data: paymentSlipClass.listOrder(datas),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(datas),
        });
    } catch (e) {
        logger.error(e, { function: 'paymentSlipService.getListOrder' });
        return new ServiceResponse(false, e.message);
    }
};

const getReviewLevelByExpendType = async function (queryParams = {}) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('EXPENDTYPEID', apiHelper.getValueFromObject(queryParams, 'expend_type_id'))
            .execute('SL_PAYMENTSLIP_GetReviewLevelByExpendType_AdminWeb');

        const list = paymentSlipClass.reviewLevelList(data.recordset);

        const review_list = list.reduce((obj, item) => {
            item.users = [];
            obj[item.review_level_id]
                ? obj[item.review_level_id].users.push({ name: item.user_review_name, id: item.user_review })
                : (obj[item.review_level_id] = {
                      ...item,
                      users: [
                          {
                              name: item.user_review_name,
                              id: item.user_review,
                          },
                      ],
                  });
            return obj;
        }, {});
        return new ServiceResponse(true, '', Object.values(review_list));
    } catch (e) {
        logger.error(e, { function: 'paymentSlipService.getReviewLevelByExpendType' });
        return new ServiceResponse(true, '', []);
    }
};

const downloadFile = async (file_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('FILEID', file_id).execute(PROCEDURE_NAME.SL_RECEIVESLIP_FILE_GETBYID);
        let file = paymentSlipClass.file(data.recordset[0]);
        return new ServiceResponse(true, '', file);
    } catch (e) {
        logger.error(e, { function: 'paymentSlipService.downloadFile' });
        return new ServiceResponse(false, e.message);
    }
};

const getReviewListByExpendType = async (expendTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('EXPENDTYPEID', expendTypeId)
            .execute('SL_PAYMENTSLIP_GetPaymentReviewList_AdminWeb');
        let reviewList = paymentSlipClass.userReviewList(data.recordset[0]);
        return new ServiceResponse(true, '', reviewList);
    } catch (e) {
        logger.error(e, { function: 'paymentSlipService.getReviewListByExpendType' });
        return new ServiceResponse(false, e.message);
    }
};

const getInvoiceOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .execute('SL_PAYMENTSLIP_GetInvoiceOptions_AdminWeb');
        return new ServiceResponse(
            true,
            '',
            paymentSlipClass
                .invoiceOptions(data.recordset)
                ?.map((item) => ({ ...item, remaining_price: 0, value: item.invoice_id, label: item.invoice_no })),
        );
    } catch (e) {
        logger.error(e, { function: 'paymentSlipService.getInvoiceOptions' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getOptionsExpendType,
    getOptionsPayer,
    // createOrUpdatePaymentSlip,
    createOrUpdate,
    getCountByDate,
    detailPaymentSlip,
    getPaymentSlipImage,
    exportPDF,
    genPaymentSlipCode,
    deleteFile,
    approvedReviewList,
    getReceiverOptions,
    getListOrder,
    getReviewLevelByExpendType,
    downloadFile,
    getReviewListByExpendType,
    getInvoiceOptions,
};
