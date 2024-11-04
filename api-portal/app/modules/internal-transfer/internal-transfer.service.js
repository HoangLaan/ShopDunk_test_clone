const internalTransferClass = require('./internal-transfer.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const sql = require('mssql');
const _ = require('lodash');
const ErrorResponse = require('../../common/responses/error.response');
const optionsService = require('../../common/services/options.service');
const receiveSlipService = require('../receive-slip/receive-slip.service');
const paymentSlipService = require('../payment-slip/payment-slip.service');

const getListInternalTransfer = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('INTERNALTRANSFERTYPEID', apiHelper.getValueFromObject(queryParams, 'internal_transfer_type_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(queryParams, 'payment_type'))
            .input('REVIEWSTATUS', apiHelper.getValueFromObject(queryParams, 'review_status'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(queryParams, 'created_user'))
            .input('STATUSRECEIVEMONEY', apiHelper.getValueFromObject(queryParams, 'status_receive_money'))
            .execute('SL_INTERNALTRANSFER_GetList_AdminWeb');

        const dataRecord = data.recordset;

        const dataList = internalTransferClass.list(dataRecord)?.map((item) => {
            if (!item.review_levels) return item;
            return {
                ...item,
                review_levels: item.review_levels.split('|').map((rl) => {
                    const [user_review, is_review] = rl.split('#');
                    return { user_review, is_review };
                }),
            };
        });

        return new ServiceResponse(true, 'Lấy danh sách chuyển tiền nội bộ thành công', {
            data: dataList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'areaService.getListInternalTransfer' });
        return new ServiceResponse(true, '', {});
    }
};

const detailInternalTransfer = async (body = {}) => {
    try {
        // Cập nhật trạng thái của phiếu (INTERNALTRANSFERSTATUS)
        const dataUpdate = await updateStatus(body);
        if (dataUpdate.isFailed()) return new ServiceResponse(false, dataUpdate.getMessage());

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(body, 'internal_transfer_id'))
            .execute(`SL_INTERNALTRANSFER_GetById_AdminWeb`);

        const [internalTransferRecord, accountingRecord, reviewLevelRecord, attachmentsRecord] = data.recordsets;
        if (internalTransferRecord.length === 0)
            return new ServiceResponse(false, 'Không thấy phiếu chuyển tiền nội bộ', {});

        const dataPayload = {
            ...internalTransferClass.detail(internalTransferRecord[0]),
            accounting_list: internalTransferClass.accountingList(accountingRecord),
        };
        const review_status_valid = [2, 4, 5];
        // Đã duyệt toàn bộ phiếu mới tạo phiếu thu / chi
        if (review_status_valid.includes(dataPayload.review_status)) {
            const receivePaymentSlipRes = await createReceivePaymentSlip(dataPayload);
            if (receivePaymentSlipRes.isFailed()) return new ServiceResponse(false, receivePaymentSlipRes.getMessage());

            // Lấy danh sách chứng từ
            const receivePaymentSlipListRes = await getReceivePaymentSlipList(body);
            if (receivePaymentSlipListRes.isFailed())
                return new ServiceResponse(false, receivePaymentSlipListRes.getMessage());
            dataPayload.receive_payment_slip_list = receivePaymentSlipListRes.getData();
        }

        return new ServiceResponse(true, '', {
            ...dataPayload,
            review_level_list: internalTransferClass.reviewLevel(reviewLevelRecord),
            attachment_list: internalTransferClass.attachmentList(attachmentsRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'internalTransferService.detailInternalTransfer' });
        return new ServiceResponse(false, e.message);
    }
};

const getPaymentSlip = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(body, 'internal_transfer_id'))
            .execute(`SL_INTERNALTRANSFER_GetPaymentSlip_AdminWeb`);
        const dataRecord = data.recordset;
        const is_exists_payment = dataRecord?.length > 0;
        return is_exists_payment
            ? { is_review: dataRecord[0].is_review, is_book_keeping: dataRecord[0].is_book_keeping }
            : false;
    } catch (e) {
        logger.error(e, {
            function: 'internalTransferService.getPaymentSlip',
        });
        return true;
    }
};

const getReceiveSlip = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(body, 'internal_transfer_id'))
            .execute(`SL_INTERNALTRANSFER_GetReceiveSlip_AdminWeb`);
        const is_exists_receive = data.recordset?.length > 0;
        return is_exists_receive ? true : false;
    } catch (e) {
        logger.error(e, {
            function: 'internalTransferService.getReceiveSlip',
        });
        return true;
    }
};

const getAccountingAccount = async (accounting_code) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ACCOUNTINGACCOUNTCODE', accounting_code)
            .execute(`SL_INTERNALTRANSFER_GetAccountingAccount_AdminWeb`);
        return data.recordset?.[0].id;
    } catch (e) {
        logger.error(e, {
            function: 'internalTransferService.getAccountingAccount',
        });
    }
};

const getPaymentForm = async (payment_form_name) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAYMENTFORMNAME', payment_form_name)
            .execute(`SL_INTERNALTRANSFER_GetPaymentForm_AdminWeb`);
        return data.recordset?.[0].id;
    } catch (e) {
        logger.error(e, {
            function: 'internalTransferService.getPaymentForm',
        });
    }
};

const getExpendType = async (expend_type_code) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('EXPENDTYPECODE', expend_type_code)
            .execute(`SL_INTERNALTRANSFER_GetExpendType_AdminWeb`);
        return data.recordset?.[0].id;
    } catch (e) {
        logger.error(e, {
            function: 'internalTransferService.getExpendType',
        });
    }
};

const createReceivePaymentSlip = async (payload = {}) => {
    try {
        payload = {
            ...payload,
            bookeeping_status: 2,
            is_active: 1,
            payment_status: 1,
            receiver_type: 4, // Mặc định là khác
        };
        const {
            payment_type,
            bank_account_receive_id,
            bank_account_transfer_id,
            store_receive_id,
            store_receive_name,
            store_transfer_id,
            store_transfer_name,
            accounting_list = [],
            created_user,
            company_receive_id,
            business_receive_id,
            company_transfer_id,
            business_transfer_id,
            internal_transfer_name,
            is_same_business,
            review_status_business,
        } = payload;
        const isTransferPayment = payment_type === 2;
        const user_name_created = created_user.split('-')?.[0]?.trim();
        const ACCOUNTING_ACCOUNT_INSTANCE = {
            1121: await getAccountingAccount('1121'),
            1111: await getAccountingAccount('1111'),
            1361: await getAccountingAccount('1361'),
            3361: await getAccountingAccount('3361'),
        };
        const TRANSFER = 'Chuyển khoản',
            CASH = 'Tiền mặt';
        const PAYMENT_FORM_INSTANCE = {
            // Loại thanh toán : payment_form_id
            [TRANSFER]: await getPaymentForm(TRANSFER),
            [CASH]: await getPaymentForm(CASH),
        };
        // Tạo phiếu chi
        const paymentSlip = await getPaymentSlip(payload);
        if (!paymentSlip) {
            const paymentCodeRes = await paymentSlipService.genPaymentSlipCode({ type: payment_type });
            const expend_type_id = await getExpendType('CTNB');
            const dataReviewLevel = await paymentSlipService.getReviewLevelByExpendType({ expend_type_id });

            let paymentPayload = {
                ...payload,
                store_id: store_transfer_id,
                total_money: accounting_list.reduce((acc, cur) => (acc += cur.money), 0),
                business_id: business_transfer_id,
                payer_id: user_name_created,
                payer_name: created_user,
                company_id: company_transfer_id,
                descriptions: `Phiếu chi ${internal_transfer_name}`,
                accounting_list: accounting_list.map((item) => ({
                    explain: item.explain,
                    money: item.money,
                    debt_account:
                        ACCOUNTING_ACCOUNT_INSTANCE[is_same_business ? (isTransferPayment ? 1121 : 1111) : 3361],
                    credit_account: ACCOUNTING_ACCOUNT_INSTANCE[isTransferPayment ? 1121 : 1111],
                })),
                receiver_name: store_transfer_name,
                bank_account_id: isTransferPayment ? bank_account_transfer_id : null,
                payment_form_id: isTransferPayment ? PAYMENT_FORM_INSTANCE[TRANSFER] : PAYMENT_FORM_INSTANCE[CASH],
                expend_type_id,
                auth_name: user_name_created,
                review_list: dataReviewLevel.isSuccess() ? dataReviewLevel.getData() : [],
                is_bookkeeping: 1, // Tự động ghi sổ khi tạo phiếu chi
            };
            const paymentSlipRes = await paymentSlipService.createOrUpdate({
                ...paymentPayload,
                payment_slip_code: paymentCodeRes.isSuccess() ? paymentCodeRes.getData() : '',
            });
            if (paymentSlipRes.isFailed()) return new ServiceResponse(false, paymentSlipRes.getMessage());
            return new ServiceResponse(true, 'Tạo phiếu chi thành công');
        }

        // Phiếu thu chỉ được tạo khi phiếu chi đã duyệt và đã ghi sổ
        const receiveSlip = await getReceiveSlip(payload);
        if (parseInt(paymentSlip?.is_review) === 1 && parseInt(paymentSlip?.is_book_keeping) === 1 && !receiveSlip) {
            const receiveCodeRes = await receiveSlipService.genReceiveSlipCode({ type: payment_type });
            let receivePayload = {
                ...payload,
                store_id: store_receive_id,
                receive_slip_code: receiveCodeRes.isSuccess() ? receiveCodeRes.getData()?.receive_slip_code : '',
                total_money: accounting_list.reduce((acc, cur) => (acc += cur.money), 0),
                business_id: business_receive_id,
                cashier_id: user_name_created,
                cashier_name: created_user,
                company_id: company_receive_id,
                descriptions: `Phiếu thu ${internal_transfer_name}`,
                accounting_list: accounting_list.map((item) => ({
                    explain: item.explain,
                    money: item.money,
                    debt_account: ACCOUNTING_ACCOUNT_INSTANCE[isTransferPayment ? 1121 : 1111],
                    credit_account: is_same_business
                        ? ACCOUNTING_ACCOUNT_INSTANCE[isTransferPayment ? 1121 : 1111]
                        : ACCOUNTING_ACCOUNT_INSTANCE[1361],
                })),
                receiver_name: store_receive_name,
                bank_account_id: isTransferPayment ? bank_account_receive_id : null,
                payment_form_id: isTransferPayment ? PAYMENT_FORM_INSTANCE[TRANSFER] : PAYMENT_FORM_INSTANCE[CASH],
                receive_type_id: 1, // Loại thu, Mặc định là phải thu nội bộ
                auth_name: user_name_created,
            };

            const receiveSlipRes = await receiveSlipService.createOrUpdate(receivePayload);
            if (receiveSlipRes.isFailed()) return new ServiceResponse(false, receiveSlipRes.getMessage());
        }

        return new ServiceResponse(true, 'Tạo phiếu thu thành công');
    } catch (e) {
        logger.error(e, { function: 'internalTransferService.detailInternalTransfer' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateInternalTransfer = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const internal_transfer_id = apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id');
        const requestMain = new sql.Request(transaction);
        const data = await requestMain
            .input('INTERNALTRANSFERID', internal_transfer_id)
            .input('INTERNALTRANSFERCODE', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_code'))
            .input('INTERNALTRANSFERNAME', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_name'))
            .input('INTERNALTRANSFERTYPEID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_type_id'))
            .input('STORETRANSFERID', apiHelper.getValueFromObject(bodyParams, 'store_transfer_id'))
            .input('STORERECEIVEID', apiHelper.getValueFromObject(bodyParams, 'store_receive_id'))
            .input('BANKACCOUNTTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'bank_account_transfer_id'))
            .input('BANKACCOUNTRECEIVEID', apiHelper.getValueFromObject(bodyParams, 'bank_account_receive_id'))
            .input('CURRENCYTYPE', apiHelper.getValueFromObject(bodyParams, 'currency_type'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'payment_type'))
            .input('ACCOUNTINGDATE', apiHelper.getValueFromObject(bodyParams, 'accounting_date'))
            .input('INTERNALTRANSFERSTATUS', apiHelper.getValueFromObject(bodyParams, 'review_status'))
            .input('CREATEDDATE', apiHelper.getValueFromObject(bodyParams, 'created_date'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            // .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(`SL_INTERNALTRANSFER_CreateOrUpdate_AdminWeb`);
        const internalTransferTypeId = data.recordset[0].id;

        bodyParams.internal_transfer_id = internalTransferTypeId;
        // Nếu là update thì xóa các table map
        if (internal_transfer_id) {
            const requestAccountingDel = new sql.Request(transaction);
            const resAccountingDel = await deleteAccounting(bodyParams, requestAccountingDel);
            if (resAccountingDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resAccountingDel.getMessage());
            }

            const requestReviewLevelDel = new sql.Request(transaction);
            const resReviewLevelDel = await deleteReviewLevel(bodyParams, requestReviewLevelDel);
            if (resReviewLevelDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resReviewLevelDel.getMessage());
            }

            const requestAttachmentDel = new sql.Request(transaction);
            const resAttachmentDel = await deleteAttachment(bodyParams, requestAttachmentDel);
            if (resAttachmentDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resAttachmentDel.getMessage());
            }
        }

        const requestAccounting = new sql.Request(transaction);
        const accounting_list = apiHelper.getValueFromObject(bodyParams, 'accounting_list');
        for (const { accounting_id, debt_account_id, credit_account_id, explain, money } of accounting_list) {
            bodyParams.accounting_id = accounting_id;
            bodyParams.debt_account_id = debt_account_id;
            bodyParams.credit_account_id = credit_account_id;
            bodyParams.explain = explain;
            bodyParams.money = String(money); // convert sang string để gửi được với số tiền lớn
            const resAccounting = await createOrUpdateAccounting(bodyParams, requestAccounting);
            if (resAccounting.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resAccounting.getMessage());
            }
        }

        const requestReviewLevel = new sql.Request(transaction);
        const review_levels = apiHelper.getValueFromObject(bodyParams, 'review_level_list');
        for (const { department_id, position_id, user_name_review: user_review } of review_levels) {
            bodyParams.department_id = department_id;
            bodyParams.position_id = position_id;
            bodyParams.user_review = user_review;
            const resReviewLevel = await createOrUpdateReviewLevel(bodyParams, requestReviewLevel);
            if (resReviewLevel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resReviewLevel.getMessage());
            }
        }

        // Attachment
        const requestAttachment = new sql.Request(transaction);
        const attachmentList = apiHelper.getValueFromObject(bodyParams, 'attachment_list');
        for (const { attachment_path: file_path, attachment_name: file_name } of attachmentList) {
            bodyParams.file_path = file_path;
            bodyParams.file_name = file_name;
            const resAttachment = await createOrUpdateAttachment(bodyParams, requestAttachment);
            if (resAttachment.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resAttachment.getMessage());
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, '');
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'internalTransferService.createOrUpdateInternalTransfer' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteAccounting = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_INTERNALTRANSFER_DeleteAccount_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.deleteAccounting' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateAccounting = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('ACCOUNTINGID', apiHelper.getValueFromObject(bodyParams, 'accounting_id'))
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id'))
            .input('DEBTACCOUNT', apiHelper.getValueFromObject(bodyParams, 'debt_account_id'))
            .input('CREDITACCOUNT', apiHelper.getValueFromObject(bodyParams, 'credit_account_id'))
            .input('EXPLAIN', apiHelper.getValueFromObject(bodyParams, 'explain'))
            .input('MONEY', apiHelper.getValueFromObject(bodyParams, 'money'))
            .input('CURRENCYTYPE', apiHelper.getValueFromObject(bodyParams, 'currency_type'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('AC_ACCOUNTING_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].RESULT;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.createOrUpdateAccounting' });

        return new ServiceResponse(false, error.message);
    }
};

const deleteReviewLevel = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_INTERNALTRANSFER_REVIEWLIST_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.deleteReviewLevel' });
        return new ServiceResponse(false, error.message);
    }
};
const createOrUpdateReviewLevel = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id'))
            .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('USERREVIEW', apiHelper.getValueFromObject(bodyParams, 'user_review'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_INTERNALTRANSFER_REVIEWLIST_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.createOrUpdateTKCTReviewLevel' });

        return new ServiceResponse(false, error.message);
    }
};

const deleteInternalTransfer = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', apiHelper.getValueFromObject(bodyParams, 'list_id'))
            .input('NAMEID', 'INTERNALTRANSFERID')
            .input('TABLENAME', 'SL_INTERNALTRANSFER')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'internalTransferService.deleteInternalTransfer' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_AREA_OPTIONS);
};

const genCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(`SL_INTERNALTRANSFER_GenCode_AdminWeb`);
        console.log();

        return new ServiceResponse(true, 'Gen code thành công', data.recordset[0].CODE ?? '');
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.genCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getStoreOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('SL_INTERNALTRANSFER_GetStoreOptions_AdminWeb');

        return new ServiceResponse(
            true,
            'Lấy danh sách cửa hàng thành công',
            internalTransferClass.storeOptions(dataRecord.recordset),
        );
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.getStoreOptions' });
        return new ErrorResponse(false, error.message);
    }
};

const getBankAccountOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(params, 'store_id'))
            .execute('SL_INTERNALTRANSFER_GetBankAccountOptions_AdminWeb');

        return new ServiceResponse(
            true,
            'Lấy danh sách tài khoản ngân hàng thành công',
            internalTransferClass.bankAccountOptions(dataRecord.recordset),
        );
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.getBankAccountOptions' });
        return new ErrorResponse(false, error.message);
    }
};

const getInternalTransferTypeOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('ISSAMEBUSSINESS', apiHelper.getValueFromObject(params, 'is_same_business'))
            .execute('SL_INTERNALTRANSFERTYPE_GetInternalTransferTypeOptions_AdminWeb');

        return new ServiceResponse(
            true,
            'Lấy danh sách hình thức chuyển thành công',
            internalTransferClass.internalTransferTypeOptions(dataRecord.recordset),
        );
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.getInternalTransferTypeOptions' });
        return new ErrorResponse(false, error.message);
    }
};

const getInternalTransferTypeReviewLevelList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('INTERNALTRANSFERTYPEID', apiHelper.getValueFromObject(params, 'internal_transfer_type_id'))
            .execute('SL_INTERNALTRANSFERTYPE_GetReviewLevel_AdminWeb');

        return new ServiceResponse(
            true,
            'Lấy danh sách duyệt hình thức chuyển thành công',
            internalTransferClass.internalTransferTypeReviewLevel(dataRecord.recordset),
        );
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.getInternalTransferTypeReviewLevelList' });
        return new ErrorResponse(false, error.message);
    }
};

const updateReviewLevel = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('REVIEWLEVELID', apiHelper.getValueFromObject(params, 'review_level_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(params, 'is_review'))
            .input('USERREVIEW', apiHelper.getValueFromObject(params, 'user_review'))
            .input('NOTE', apiHelper.getValueFromObject(params, 'note'))
            .execute('SL_INTERNALTRANSFER_UpdateReviewLevel_AdminWeb');

        return new ServiceResponse(true, 'Cập nhật duyệt thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.updateReviewLevel' });
        return new ErrorResponse(false, error.message);
    }
};

const updateStatus = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(params, 'internal_transfer_id'))
            .execute('SL_INTERNALTRANSFER_UpdateStatus_AdminWeb');

        return new ServiceResponse(true, 'Cập nhật trạng thái duyệt thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.updateStatus' });
        return new ErrorResponse(false, error.message);
    }
};

const countReviewStatus = async () => {
    try {
        const pool = await mssql.pool;
        const countRes = await pool.request().execute('SL_INTERNALTRANSFER_CountReviewStatus_AdminWeb');

        return new ServiceResponse(
            true,
            'Lấy tổng số lượng thành công',
            internalTransferClass.countReviewStatus(countRes.recordset),
        );
    } catch (e) {
        logger.error(e, { function: 'internalTransferService.countReviewStatus' });
        return new ServiceResponse(false, e.message);
    }
};

const getReceivePaymentSlipList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(params, 'internal_transfer_id'))
            .execute('SL_INTERNALTRANSFER_GetReceivePaymentSlipList_AdminWeb');

        return new ServiceResponse(
            true,
            'Lấy danh sách chứng từ thành công',
            internalTransferClass.receivePaymentSlipList(dataRecord.recordset),
        );
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.getBankAccountOptions' });
        return new ErrorResponse(false, error.message);
    }
};

const deleteAttachment = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_INTERNALTRANSFER_FILE_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.deleteAttachment' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateAttachment = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('INTERNALTRANSFERID', apiHelper.getValueFromObject(bodyParams, 'internal_transfer_id'))
            .input('FILENAME', apiHelper.getValueFromObject(bodyParams, 'file_name'))
            .input('FILEPATH', apiHelper.getValueFromObject(bodyParams, 'file_path'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_INTERNALTRANSFER_FILE_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferService.createOrUpdateAttachment' });

        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    getListInternalTransfer,
    genCode,
    getStoreOptions,
    getBankAccountOptions,
    getInternalTransferTypeOptions,
    getInternalTransferTypeReviewLevelList,
    createOrUpdateInternalTransfer,
    detailInternalTransfer,
    deleteInternalTransfer,
    updateReviewLevel,
    countReviewStatus,
};
