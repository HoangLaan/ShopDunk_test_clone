const moment = require('moment');
const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const { attachIdToOptions } = require('./helper');
const { getOptionsCommon } = require('../global/global.service');
const API_CONST = require('../../common/const/api.const');
const ModuleHelper = require('./helper');
let xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const pdfHelper = require('../../common/helpers/pdf.helper');

const moduleClass = require('./receive-payment-slip.class');
const { RECEIVE_EXPEND_TYPE, REVEIEW_STATUS, BOOKKEEPING, RECEIVER_TYPES, PAYMENT_TYPE } = require('./constants');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');

        // handle filter by receive and expend type
        const receiveExpendType = apiHelper.getValueFromObject(queryParams, 'receive_expend_type');
        if (receiveExpendType) {
            const [id, type] = receiveExpendType.split('_');
            if (Number(type) === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE) {
                queryParams.receive_type_id = id;
            } else if (Number(type) === RECEIVE_EXPEND_TYPE.EXPEND_TYPE) {
                queryParams.expend_type_id = id;
            }
        }
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('ACCOUNTINGDATEFROM', apiHelper.getValueFromObject(queryParams, 'accounting_date_from'))
            .input('ACCOUNTINGDATETO', apiHelper.getValueFromObject(queryParams, 'accounting_date_to'))
            .input('RECEIVETYPEID', apiHelper.getValueFromObject(queryParams, 'receive_type_id'))
            .input('EXPENDTYPEID', apiHelper.getValueFromObject(queryParams, 'expend_type_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('REVIEWSTATUS', apiHelper.getValueFromObject(queryParams, 'review_status'))
            .input('ISBOOKKEEPING', apiHelper.getValueFromObject(queryParams, 'is_book_keeping'))
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(queryParams, 'payment_form_id'))
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(queryParams, 'payment_type'))
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('BANKNUMBER', apiHelper.getValueFromObject(queryParams, 'bank_acc_number'))
            .execute('SL_RECEIVEPAYMENTSLIP_GetList_AdminWeb');

        const dataList = moduleClass.list(data.recordset);

        const userReviewData = moduleClass.reviewList(data.recordsets[1]);
        dataList.forEach((item) => {
            item.review_level_user_list = userReviewData.filter(
                (userReview) => +userReview.payment_slip_id === parseInt(item.id.split('_')[0]),
            );
            item.is_reviewed = item?.review_status ? item?.review_status : checkReview(item.review_level_user_list);
        });
        return new ServiceResponse(true, '', {
            data: dataList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const checkReview = (reviewList) => {
    const pending = 2,
        accept = 1,
        reject = 0;
    // check mức duyệt cuối đã duyệt => phiếu được duyệt
    const isCompleteAndReview = reviewList.find(
        (userReview) =>
            userReview.is_complete === 1 && (userReview.is_review === accept || userReview.is_review === reject),
    );

    if (isCompleteAndReview) return isCompleteAndReview.is_review;
    // check tất cả đã duyệt phiếu => phiếu được duyệt
    const isAllReview = reviewList.every(
        (userReview) => userReview.is_review === accept || userReview.is_review === reject,
    );
    if (!isAllReview) return pending;

    const isRejected = reviewList.some((userReview) => userReview.is_review === reject);
    if (isRejected) return reject;
    return accept;
};

const updateReview = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();

        const paymentId = apiHelper.getValueFromObject(body, 'id');
        const id = paymentId.split('_')[0];
        const is_reviewed = apiHelper.getValueFromObject(body, 'type_review');
        const is_complete_review = apiHelper.getValueFromObject(body, 'is_complete_review');

        const data = await pool
            .request()
            .input('PAYMENTSLIPID', id)
            .input('ISREVIEWED', apiHelper.getValueFromObject(body, 'type_review'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
            .execute('SL_RECEIVEPAYMENTSLIP_UpdateReview_AdminWeb');
        const res = data.recordset[0].RESULT;
        //Update lại công nợ
        if (res === 1) {
            // duyệt phiếu chi ở mức duyệt cuối
            const updateDebit = await pool
                .request()
                .input('PAYMENTSLIPID', id)
                .execute('SL_DEBIT_UpdateByPaymentSlip_AdminWeb');
        }

        //cập nhật lại trạng thái của công nợ
        if (is_reviewed === 1 && is_complete_review === 1) {
            // mức duyệt cuối duyệt
            const total_paid = apiHelper.getValueFromObject(body, 'total_money'); // tiền đã trả trong phiếu chi này
            const createDebit = new sql.Request(transaction);
            const res = await createDebit
                .input('PAYMENTSLIPID', paymentId)
                .execute('SL_PURCHASEORDER_UpdatePayment_AdminWeb');
            const debitId = res.recordset[0].RESULT;
            if (debitId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi cập nhật tiền của công nợ');
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, 'Cập nhật mức duyệt thành công', {});
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.createRPOReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteList = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        const listIds = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const { receiveIds, paymentIds } = _splitIds(listIds);

        if (receiveIds && receiveIds.length > 0) {
            await pool
                .request()
                .input('LISTID', receiveIds)
                .input('NAMEID', 'RECEIVESLIPID')
                .input('TABLENAME', 'SL_RECEIVESLIP')
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('CBO_COMMON_SOFTDELETE');
        }

        if (paymentIds && paymentIds.length > 0) {
            await pool
                .request()
                .input('LISTID', paymentIds)
                .input('NAMEID', 'PAYMENTSLIPID')
                .input('TABLENAME', 'SL_PAYMENTSLIP')
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('CBO_COMMON_SOFTDELETE');
        }

        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.deleteList' });

        return new ServiceResponse(false, e.message);
    }
};

const statistics = async (queryParams) => {
    try {
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        // handle filter by receive and expend type
        const receiveExpendType = apiHelper.getValueFromObject(queryParams, 'receive_expend_type');
        if (receiveExpendType) {
            const [id, type] = receiveExpendType.split('_');
            if (Number(type) === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE) {
                queryParams.receive_type_id = id;
            } else if (Number(type) === RECEIVE_EXPEND_TYPE.EXPEND_TYPE) {
                queryParams.expend_type_id = id;
            }
        }

        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('ACCOUNTINGDATEFROM', apiHelper.getValueFromObject(queryParams, 'accounting_date_from'))
            .input('ACCOUNTINGDATETO', apiHelper.getValueFromObject(queryParams, 'accounting_date_to'))
            .input('RECEIVETYPEID', apiHelper.getValueFromObject(queryParams, 'receive_type_id'))
            .input('EXPENDTYPEID', apiHelper.getValueFromObject(queryParams, 'expend_type_id'))
            .input('PAYMENTTYPE', queryParams?.payment_type)
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .input('REVIEWSTATUS', apiHelper.getValueFromObject(queryParams, 'review_status'))
            .input('ISBOOKKEEPING', apiHelper.getValueFromObject(queryParams, 'is_book_keeping'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute('SL_RECEIVEPAYMENTSLIP_Statistics_AdminWeb');
        const statistics = responseData.recordset[0];
        if (statistics) {
            return new ServiceResponse(true, '', moduleClass.statistics(statistics));
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.statistics' });
        return new ServiceResponse(false, e.message);
    }
};

const bookkeeping = async (bodyParams) => {
    try {
        const listIds = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const { receiveIds, paymentIds } = _splitIds(listIds);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('RECEIVEIDS', receiveIds)
            .input('PAYMENTIDS', paymentIds)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_RECEIVEPAYMENTSLIP_Bookeeping_AdminWeb');

        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.bookkeeping' });

        return new ServiceResponse(false, e.message);
    }
};

const unBookkeeping = async (bodyParams) => {
    try {
        const listIds = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const { receiveIds, paymentIds } = _splitIds(listIds);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('RECEIVEIDS', receiveIds)
            .input('PAYMENTIDS', paymentIds)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_RECEIVEPAYMENTSLIP_UnBookeeping_AdminWeb');

        return new ServiceResponse(true, '');
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.unBookkeeping' });

        return new ServiceResponse(false, e.message);
    }
};

const deptAccountingAccountOpts = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool.request().execute('SL_RECEIVEPAYMENTSLIP_GetDeptAccountOptions_AdminWeb');
        const data = responseData.recordset;

        return new ServiceResponse(true, '', moduleClass.options(data));
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.statistics' });
        return new ServiceResponse(false, e.message);
    }
};

const creditAccountingAccountOpts = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool.request().execute('SL_RECEIVEPAYMENTSLIP_GetCreditAccountOptions_AdminWeb');
        const data = responseData.recordset;

        return new ServiceResponse(true, '', moduleClass.options(data));
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.statistics' });
        return new ServiceResponse(false, e.message);
    }
};

const receiveTypeOpts = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .execute('SL_RECEIVEPAYMENTSLIP_GetReceiveTypeOptions_AdminWeb');
        const data = responseData.recordset;

        return new ServiceResponse(true, '', moduleClass.options(data));
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.statistics' });
        return new ServiceResponse(false, e.message);
    }
};

const paymentTypeOpts = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .execute('SL_RECEIVEPAYMENTSLIP_GetPaymentTypeOptions_AdminWeb');
        const data = responseData.recordset;

        return new ServiceResponse(true, '', moduleClass.options(data));
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.statistics' });
        return new ServiceResponse(false, e.message);
    }
};

const businessOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .execute('SL_RECEIVEPAYMENTSLIP_GetBusinessOptions_AdminWeb');
        const data = responseData.recordset;

        return new ServiceResponse(true, '', moduleClass.options(data));
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.businessOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const storeOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .execute('SL_RECEIVEPAYMENTSLIP_GetStoreOptions_AdminWeb');
        const data = responseData.recordset;

        return new ServiceResponse(true, '', moduleClass.options(data));
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService.storeOptions' });
        return new ServiceResponse(false, e.message);
    }
};

// split id to receive and payment
const _splitIds = (listIds) => {
    let receiveIds = [];
    let paymentIds = [];

    if (listIds && listIds.length > 0) {
        listIds.forEach((mergedId) => {
            const [id, type] = mergedId.split('_');
            if (type == RECEIVE_EXPEND_TYPE.RECEIVE_TYPE) {
                receiveIds.push(id);
            } else if (type == RECEIVE_EXPEND_TYPE.EXPEND_TYPE) {
                paymentIds.push(id);
            }
        });
    }

    return { receiveIds, paymentIds };
};

const exportPDF = async (queryParams = {}) => {
    try {
        const receivePaymentId = apiHelper.getValueFromObject(queryParams, 'receive_payment_id');
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
            let accountingList = JSON.parse(response?.recordset[0]?.ACCOUNTINGS);

            if (debtList) {
                debtList = [...new Set(debtList.map((_) => _.ACCOUNTINGACCOUNTCODE))]?.join(', ');
            }
            if (creditList) {
                creditList = [...new Set(creditList.map((_) => _.ACCOUNTINGACCOUNTCODE))]?.join(', ');
            }

            dataResult = moduleClass.receiveslipPrint(response?.recordset[0]);
            dataResult.debt_accounts = debtList;
            dataResult.credit_accounts = creditList;
            dataResult.accounting_list = moduleClass.accountingList(accountingList) || [];
        } else if (Number(type) === RECEIVE_EXPEND_TYPE.EXPEND_TYPE) {
            response = await pool.request().input('PAYMENTSLIPID', id).execute('SL_PAYMENTSLIP_GetToPrint_AdminWeb');
            if (response?.recordset.length <= 0) return new ServiceResponse(false, 'Không tìm thấy dữ liệu !');
            let debtList = JSON.parse(response?.recordset[0]?.DEBTACCOUNTS);
            let creditList = JSON.parse(response?.recordset[0]?.CREDITACCOUNTS);
            let accountingList = JSON.parse(response?.recordset[0]?.ACCOUNTINGS);
            if (debtList) {
                debtList = [...new Set(debtList.map((_) => _.ACCOUNTINGACCOUNTCODE))]?.join(', ');
            }
            if (creditList) {
                creditList = [...new Set(creditList.map((_) => _.ACCOUNTINGACCOUNTCODE))]?.join(', ');
            }

            dataResult = moduleClass.paymentslipPrint(response?.recordset[0]);
            dataResult.debt_accounts = debtList;
            dataResult.credit_accounts = creditList;
            dataResult.accounting_list = moduleClass.accountingList(accountingList) || [];
        } else {
            return new ServiceResponse(false, 'Loại phiếu không hợp lệ !');
        }

        const fileName = `${Number(type) === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE ? 'Phiếu thu' : 'Phiếu chi'
            }_${moment().format('DDMMYYYY')}_${id}`;

        const print_params = {
            template: `template-${Number(type) === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE ? 'receiveslip' : 'paymentslip'}${Number(exportType) === PAYMENT_TYPE.CREDIT ? '-credit' : ''
                }.html`,
            data: dataResult,
            filename: fileName,
        };

        await pdfHelper.printPDF(print_params);
        return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentServices.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const serviceRes = await getList(queryParams);
        const { data } = serviceRes.getData();
        data.forEach((item) => {
            item.reason = item.receive_type_name || item.expend_type_name;
        });
        const workbook = await _exportListExcelFile(data, queryParams?.payment_type);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentServices.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const downloadExcel = async () => {
    try {
        const demoData = [
            {
                code: 'PT230711003',
                receive_payment_type: '2 - Loại thu tiền 1',
                staff: '10028 - Mai Công Thành',
                total_money: '100000000',
                descriptions: 'Thu tiền bán hàng tháng 7',
                company: '1 - HESMAN GROUP',
                business: '2 - Chi nhánh Đống Đa',
                store: '5 - Văn phòng Ninh Bình',
                payment_type: '1 - Tiền mặt', // 1 cash, 2 tien gui ngan hang
                receiver_type: '2 - Nhân viên', // 1 supplier, 2 staff, 3 customer, 4 other
                receiver_name: '10055 - Lê Thị Liên',
                bank_account_number: '3 - 123222 - Ngân hàng ACB - Chi nhánh Sài Gòn',
                is_bookkeeping: 0,
                accounting_date: '20/06/2023',
                payment_form: '4 - Hình thức thanh toán 1',
                note: 'ghi chú ...',
                currency_type: 'VND', // VND - USD,
                type: 1,
            },
            {
                code: 'PC230711003',
                receive_payment_type: '4 - Loại chi tiền 1',
                staff: '10028 - Mai Công Thành',
                total_money: '100000000',
                descriptions: 'Thu tiền bán hàng tháng 7',
                company: '1 - HESMAN GROUP',
                business: '2 - Chi nhánh Đống Đa',
                store: '5 - Văn phòng Ninh Bình',
                payment_type: '1 - Tiền mặt',
                receiver_type: '2 - Nhân viên',
                receiver_name: '10055 - Lê Thị Liên',
                bank_account_number: '2 - 123 - Ngân hàng ACB - Chi nhánh Sài Gòn',
                is_bookkeeping: 1,
                accounting_date: '20/06/2023',
                payment_form: '4 - Hình thức thanh toán 1',
                note: 'ghi chú ...',
                currency_type: 'USD',
                type: 2,
            },
        ];

        const workbook = await _exportTemplateExcelFile(demoData);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentServices.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportTemplateExcelFile = async (data) => {
    const { data: companyOptions } = await getOptionsCommon({ type: 'company' });
    const { data: businessOptions } = await getOptionsCommon({ type: 'business' });
    const { data: storeOptions } = await getOptionsCommon({ type: 'store' });
    const { data: receiveTypeOptions } = await getOptionsCommon({ type: 'receiveType' });
    const { data: expendTypeOptions } = await getOptionsCommon({ type: 'expendType' });
    const { data: staffOptions } = await getOptionsCommon({ type: 'user' });
    const { data: businessBankOptions } = await getOptionsCommon({ type: 'businessBank' });
    const { data: storeBankOptions } = await getOptionsCommon({ type: 'storeBank' });
    const { data: paymentFormOpptions } = await getOptionsCommon({ type: 'paymentForm' });
    const { data: supplierOpptions } = await getOptionsCommon({ type: 'supplier' });
    const { data: customerOptions } = await getOptionsCommon({ type: 'customer' });

    const workbook = new xl.Workbook();

    // constants
    const START_RECEIVER_TYPE_LIST_COLUMN = 1;
    const START_COMPANY_LIST_COLUMN = 2;
    const START_BUSINESS_LIST_COLUMN = 3;
    const START_STORE_LIST_COLUMN = 4;
    const START_RECEIVEEXPENDTYPE_LIST_COLUMN = 5;
    const START_STAFF_LIST_COLUMN = 6;
    const START_BANKACCOUNT_LIST_COLUMN = 7;
    const START_PAYMENTFORM_LIST_COLUMN = 8;
    const START_RECEIVER_LIST_COLUMN = 9;

    const SHEETS_NAME = 'Danh sách phiếu thu, chi';
    const OPTIONS_SHEETS_NAME = 'options';

    const budgetsWorksheet = workbook.addWorksheet(SHEETS_NAME);

    let config = [
        {
            key: 'type',
            title: 'Loại chứng từ',
            required: true,
            transform: (val) => (val === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE ? 'Phiếu thu' : 'Phiếu chi'),
        },
        {
            key: 'code',
            title: 'Số chứng từ',
            required: true,
        },
        {
            key: 'accounting_date',
            title: 'Ngày hạch toán',
        },
        {
            key: 'receive_payment_type',
            title: 'Loại thu/ chi',
            required: true,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [
                    _createFormula(
                        OPTIONS_SHEETS_NAME,
                        START_RECEIVEEXPENDTYPE_LIST_COLUMN,
                        [...receiveTypeOptions, ...expendTypeOptions].length,
                    ),
                ],
            },
        },
        {
            key: 'staff',
            title: 'Nhân viên thu, chi',
            required: true,
            width: 30,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_STAFF_LIST_COLUMN, staffOptions.length)],
            },
        },
        {
            key: 'total_money',
            title: 'Số tiền',
            required: true,
        },
        {
            key: 'descriptions',
            title: 'Diễn giải',
            required: true,
            width: 50,
        },
        {
            key: 'note',
            title: 'Ghi chú',
        },
        {
            key: 'receiver_type',
            title: 'Loại đối tượng thu, chi',
            required: true,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_RECEIVER_TYPE_LIST_COLUMN, RECEIVER_TYPES.length)],
            },
            width: 40,
        },
        {
            key: 'receiver_name',
            title: 'Đối tượng thu, chi',
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [
                    _createFormula(
                        OPTIONS_SHEETS_NAME,
                        START_RECEIVER_LIST_COLUMN,
                        [...supplierOpptions, ...staffOptions, ...customerOptions].length,
                    ),
                ],
            },
            required: true,
            width: 40,
        },
        {
            key: 'bank_account_number',
            title: 'Số tài khoản thu, chi',
            required: true,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [
                    _createFormula(
                        OPTIONS_SHEETS_NAME,
                        START_BANKACCOUNT_LIST_COLUMN,
                        [...storeBankOptions, ...businessBankOptions].length,
                    ),
                ],
            },
            width: 40,
        },
        {
            key: 'payment_form',
            title: 'Hình thức thanh toán',
            required: true,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [
                    _createFormula(OPTIONS_SHEETS_NAME, START_PAYMENTFORM_LIST_COLUMN, paymentFormOpptions.length),
                ],
            },
            width: 40,
        },

        {
            key: 'is_bookkeeping',
            title: 'Trạng thái ghi sổ',
            transform: (val) => (val === BOOKKEEPING.RECORDED ? 'Đã ghi sổ' : 'Chưa ghi sổ'),
        },
        {
            key: 'company',
            title: 'Công ty',
            require: true,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_COMPANY_LIST_COLUMN, companyOptions.length)],
            },
            width: 30,
        },
        {
            key: 'business',
            title: 'Miền',
            require: true,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_BUSINESS_LIST_COLUMN, businessOptions.length)],
            },
            width: 30,
        },
        {
            key: 'store',
            title: 'Cửa hàng',
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_STORE_LIST_COLUMN, storeOptions.length)],
            },
            width: 30,
        },
    ];

    const NUMBERED = true;
    _createTableData(budgetsWorksheet, config, data, NUMBERED);

    // create options sheets
    const optionConfig = [
        {
            data: attachIdToOptions(RECEIVER_TYPES),
            dataConfig: [
                {
                    key: 'name',
                    title: 'Loại đối tượng',
                    width: 40,
                },
            ],
            startColumn: START_RECEIVER_TYPE_LIST_COLUMN,
        },
        {
            data: attachIdToOptions(companyOptions),
            dataConfig: [
                {
                    key: 'name',
                    title: 'Thuộc công ty',
                    width: 40,
                },
            ],
            startColumn: START_COMPANY_LIST_COLUMN,
        },
        {
            data: attachIdToOptions(businessOptions),
            dataConfig: [
                {
                    key: 'name',
                    title: 'Thuộc miền',
                    width: 40,
                },
            ],
            startColumn: START_BUSINESS_LIST_COLUMN,
        },
        {
            data: attachIdToOptions(storeOptions),
            dataConfig: [
                {
                    key: 'name',
                    title: 'Thuộc cửa hàng',
                    width: 40,
                },
            ],
            startColumn: START_STORE_LIST_COLUMN,
        },
        {
            data: attachIdToOptions(receiveTypeOptions.concat(expendTypeOptions)),
            dataConfig: [
                {
                    key: 'name',
                    title: 'Loại thu/ chi',
                    width: 40,
                },
            ],
            startColumn: START_RECEIVEEXPENDTYPE_LIST_COLUMN,
        },
        {
            data: staffOptions,
            dataConfig: [
                {
                    key: 'name',
                    title: 'Nhân viên thu/ chi',
                    width: 40,
                },
            ],
            startColumn: START_STAFF_LIST_COLUMN,
        },
        {
            data: attachIdToOptions(storeBankOptions.concat(businessBankOptions)),
            dataConfig: [
                {
                    key: 'name',
                    title: 'Số tài khoản thu/ chi',
                    width: 40,
                },
            ],
            startColumn: START_BANKACCOUNT_LIST_COLUMN,
        },
        {
            data: attachIdToOptions(paymentFormOpptions),
            dataConfig: [
                {
                    key: 'name',
                    title: 'Hình thức thanh toán',
                    width: 40,
                },
            ],
            startColumn: START_PAYMENTFORM_LIST_COLUMN,
        },
        {
            data: [...attachIdToOptions(supplierOpptions), ...staffOptions, ...customerOptions],
            dataConfig: [
                {
                    key: 'name',
                    title: 'Đối tượng thu/ chi',
                    width: 40,
                },
            ],
            startColumn: START_RECEIVER_LIST_COLUMN,
        },
    ];

    // create options refer sheets
    await _creteOptionsSheet(workbook, OPTIONS_SHEETS_NAME, optionConfig);

    return workbook;
};

const importExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        const payment_type = apiHelper.getValueFromObject(bodyParams, 'payment_type', PAYMENT_TYPE.CASH);
        const rows = await readXlsxFile(pathUpload);
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        for (let i in rows) {
            // Bỏ qua dòng tiêu đề đầu
            if (i > 0 && rows[i]) {
                import_total += 1;

                let type = `${rows[i][1] || ''}`.trim();
                let code = `${rows[i][2] || ''}`.trim();
                let accounting_date = `${rows[i][3] || ''}`.trim();
                let receive_payment_type = `${rows[i][4] || ''}`.trim();
                let staff = `${rows[i][5] || ''}`.trim();
                let total_money = `${rows[i][6] || ''}`.trim();
                let descriptions = `${rows[i][7] || ''}`.trim();
                let note = `${rows[i][8] || ''}`.trim();
                let receiver_type = `${rows[i][9] || ''}`.trim();
                let receiver_name = `${rows[i][10] || ''}`.trim();
                let bank_account_number = `${rows[i][11] || ''}`.trim();
                let payment_form = `${rows[i][12] || ''}`.trim();
                let is_bookkeeping = `${rows[i][13] || ''}`.trim();
                let company = `${rows[i][14] || ''}`.trim();
                let business = `${rows[i][15] || ''}`.trim();
                let store = `${rows[i][16] || ''}`.trim();

                let item_import = {
                    type,
                    code,
                    accounting_date,
                    receive_payment_type,
                    staff,
                    total_money,
                    descriptions,
                    note,
                    receiver_type,
                    receiver_name,
                    bank_account_number,
                    payment_form,
                    is_bookkeeping,
                    company,
                    business,
                    store,
                };

                let { errmsg = [], item = {} } = await _checkImport(item_import);

                if (errmsg && errmsg.length > 0) {
                    import_errors.push({
                        item,
                        errmsg,
                        i,
                    });
                } else {
                    try {
                        let receivePaymentRes = await _createOrUpdateReceivePayment(
                            { ...item, auth_name },
                            payment_type,
                        );

                        if (receivePaymentRes.isFailed()) {
                            throw new Error('Thêm mới phiếu thu, chi thất bại !');
                        }

                        import_data.push(receivePaymentRes.data);
                    } catch (error) {
                        import_errors.push({
                            item,
                            errmsg: [error.message],
                            i,
                        });
                    }
                }
            }

            if (rows.length < 2) {
                return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
            }
        }

        return new ServiceResponse(true, '', {
            import_data,
            import_total,
            import_errors,
        });
    } catch (error) {
        logger.error(error, {
            function: 'ReceivePaymentSlip.importExcel',
        });
        return new ServiceResponse(false, e.message);
    }
};

const _createOrUpdateReceivePayment = async (item, paymentType) => {
    // default value
    item.payment_date = moment.utc().format('DD/MM/YYYY');

    if (item.type === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE) {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('RECEIVESLIPID', null)
            .input('RECEIVESLIPCODE', apiHelper.getValueFromObject(item, 'code'))
            .input('CASHIERID', apiHelper.getValueFromObject(item, 'cashier_id'))
            .input('TOTALMONEY', apiHelper.getValueFromObject(item, 'total_money'))
            .input('PAYMENTDATE', apiHelper.getValueFromObject(item, 'payment_date'))
            .input('RECEIVETYPEID', apiHelper.getValueFromObject(item, 'receive_type_id'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(item, 'descriptions'))
            .input('COMPANYID', apiHelper.getValueFromObject(item, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
            .input('PAYMENTTYPE', paymentType)
            .input('ISREVIEW', apiHelper.getValueFromObject(item, 'is_review', 1))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(item, 'payment_status', 1))
            .input('RECEIVERTYPE', apiHelper.getValueFromObject(item, 'receiver_type'))
            .input('RECEIVERID', apiHelper.getValueFromObject(item, 'receiver_id'))
            .input('RECEIVERNAME', apiHelper.getValueFromObject(item, 'receiver_name'))
            .input('BANKACCOUNTID', apiHelper.getValueFromObject(item, 'bank_account_id'))
            .input('ISDEPOSIT', apiHelper.getValueFromObject(item, 'is_deposit'))
            .input('ISBOOKKEEPING', apiHelper.getValueFromObject(item, 'is_bookkeeping'))
            .input('ACCOUNTINGDATE', apiHelper.getValueFromObject(item, 'accounting_date'))
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(item, 'payment_form_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(item, 'is_active', 1))
            .input('NOTES', apiHelper.getValueFromObject(item, 'note'))
            .input('CURRENCYTYPE', (VND = 1))
            .input('CREATEDUSER', apiHelper.getValueFromObject(item, 'auth_name'))
            .execute('SL_RECEIVESLIP_CreateOrUpdate_AdminWeb');

        receiveSlipId = data.recordset[0].RESULT;
        if (receiveSlipId <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.RECEIVESLIP.CREATE_FAILED);
        } else {
            return new ServiceResponse(true, '');
        }
    } else if (item.type === RECEIVE_EXPEND_TYPE.EXPEND_TYPE) {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAYMENTSLIPID', null)
            .input('PAYMENTSLIPCODE', apiHelper.getValueFromObject(item, 'code'))
            .input('PAYERID', apiHelper.getValueFromObject(item, 'payer_id'))
            .input('TOTALMONEY', apiHelper.getValueFromObject(item, 'total_money'))
            .input('PAYMENTDATE', apiHelper.getValueFromObject(item, 'payment_date'))
            .input('EXPENDTYPEID', apiHelper.getValueFromObject(item, 'expend_type_id'))
            .input('DESCRIPTIONS', apiHelper.getValueFromObject(item, 'descriptions'))
            .input('COMPANYID', apiHelper.getValueFromObject(item, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
            .input('PAYMENTTYPE', paymentType)
            .input('ISREVIEW', apiHelper.getValueFromObject(item, 'is_review', 1))
            .input('PAYMENTSTATUS', apiHelper.getValueFromObject(item, 'payment_status'))
            .input('RECEIVERTYPE', apiHelper.getValueFromObject(item, 'receiver_type'))
            .input('RECEIVERID', apiHelper.getValueFromObject(item, 'receiver_id'))
            .input('RECEIVERNAME', apiHelper.getValueFromObject(item, 'receiver_name'))
            .input('BANKACCOUNTID', apiHelper.getValueFromObject(item, 'bank_account_id'))
            .input('ISBOOKKEEPING', apiHelper.getValueFromObject(item, 'is_bookkeeping'))
            .input('ACCOUNTINGDATE', apiHelper.getValueFromObject(item, 'accounting_date'))
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(item, 'payment_form_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(item, 'is_active', 1))
            .input('NOTES', apiHelper.getValueFromObject(item, 'note'))
            .input('CURRENCYTYPE', (VND = 1))
            .input('CREATEDUSER', apiHelper.getValueFromObject(item, 'auth_name'))
            .execute('SL_PAYMENTSLIP_CreateOrUpdate_AdminWeb');

        const paymentSlipId = data.recordset[0].RESULT;
        if (paymentSlipId <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.PAYMENTSLIP.CREATE_FAILED);
        } else {
            return new ServiceResponse(true, '');
        }
    }
};

const _exportListExcelFile = async (data, payment_type = 1) => {
    const { data: companyOptions } = await getOptionsCommon({ type: 'company' });
    const { data: businessOptions } = await getOptionsCommon({ type: 'business' });
    const { data: storeOptions } = await getOptionsCommon({ type: 'store' });

    const workbook = new xl.Workbook();

    // constants
    const START_COMPANY_LIST_COLUMN = 1;
    const START_BUSINESS_LIST_COLUMN = 2;
    const START_STORE_LIST_COLUMN = 3;

    const BUDGET_SHEETS_NAME = 'Danh sách phiếu thu, chi';
    const OPTIONS_SHEETS_NAME = 'options';

    const budgetsWorksheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    let config = [
        {
            key: 'accounting_date',
            title: 'Ngày hạch toán',
            required: true,
        },
        {
            key: 'type',
            title: 'Loại chứng từ',
            required: true,
            transform: (type) => (type === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE ? 'Phiếu thu' : 'Phiếu chi'),
        },
        {
            key: 'code',
            title: 'Số chứng từ',
            required: true,
        },
        {
            key: 'descriptions',
            title: 'Diễn giải',
            required: true,
            width: 40,
        },
        {
            key: 'total_money',
            title: 'Số tiền',
            required: true,
        },
        {
            key: 'receiver_name',
            title: 'Đối tượng',
            required: true,
            width: 40,
        },
        {
            key: 'reason',
            title: 'Lý do thu/chi',
            required: true,
        },
        {
            key: 'review_status',
            title: 'Trạng thái duyệt',
            transform: (val) => REVEIEW_STATUS.find((status) => status.value === val)?.label || 'Chưa duyệt',
        },
        {
            key: 'company_name',
            title: 'Công ty',
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_COMPANY_LIST_COLUMN, companyOptions.length)],
            },
            width: 30,
        },
        {
            key: 'business_name',
            title: 'Miền',
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_BUSINESS_LIST_COLUMN, businessOptions.length)],
            },
            width: 30,
        },
        {
            key: 'store_name',
            title: 'Cửa hàng',
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_STORE_LIST_COLUMN, storeOptions.length)],
            },
            width: 30,
        },
    ];

    if (payment_type == 2) {
        config = config.concat([
            {
                key: 'bank_account_number',
                title: 'Số tài khoản',
                required: true,
            },
        ]);
    }

    const NUMBERED = true;
    _createTableData(budgetsWorksheet, config, data, NUMBERED);

    // create options sheets
    const optionConfig = [
        {
            data: companyOptions,
            dataConfig: [
                {
                    key: 'name',
                    title: 'Thuộc công ty',
                    width: 40,
                },
            ],
            startColumn: START_COMPANY_LIST_COLUMN,
        },
        {
            data: businessOptions,
            dataConfig: [
                {
                    key: 'name',
                    title: 'Thuộc miền',
                    width: 40,
                },
            ],
            startColumn: START_BUSINESS_LIST_COLUMN,
        },
        {
            data: storeOptions,
            dataConfig: [
                {
                    key: 'name',
                    title: 'Thuộc cửa hàng',
                    width: 40,
                },
            ],
            startColumn: START_STORE_LIST_COLUMN,
        },
    ];

    // create options refer sheets
    await _creteOptionsSheet(workbook, OPTIONS_SHEETS_NAME, optionConfig);

    return workbook;
};

const _createTableData = (ws, configs, data, isNumbered = false, startCol = 1, defaultWidth = 20) => {
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // add column STT
    isNumbered &&
        configs.unshift({
            title: 'STT',
            width: 10,
            isNumberedCol: true,
        });

    // Set width
    configs.forEach((config, index) => {
        ws.column(index + startCol).setWidth(config.width ?? defaultWidth);
    });

    const borderStyle = {
        border: {
            left: {
                style: 'thin',
                color: 'black',
            },
            right: {
                style: 'thin',
                color: 'black',
            },
            top: {
                style: 'thin',
                color: 'black',
            },
            bottom: {
                style: 'thin',
                color: 'black',
            },
        },
    };
    const headerStyle = {
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#d7d9db', // gray color
            fgColor: '#d7d9db', // gray color
        },
        font: { bold: true },
        alignment: { horizontal: 'center' },
    };

    // create head row
    configs.forEach((config, index) => {
        ws.cell(1, index + startCol)
            .string(config.required ? `${config.title} *`.toUpperCase() : config.title.toUpperCase())
            .style({ ...borderStyle, ...headerStyle });
    });

    // create data rows
    data.forEach((item, index) => {
        let indexRow = index + 2;
        let indexCol = startCol;

        configs.forEach((config) => {
            const itemValue = config.isNumberedCol ? index + 1 : item[config.key];
            ws.cell(indexRow, indexCol++)
                .string(
                    (
                        (typeof config.transform === 'function' ? config.transform(itemValue) : itemValue) || ''
                    ).toString(),
                )
                .style(borderStyle);
            // add validation
            if (config.validation) {
                /// find potition of cell to apply validation
                config.validation.sqref = `${ALPHABET[indexCol - 2]}2:${ALPHABET[indexCol - 2]}100`;
                ws.addDataValidation(config.validation);
            }
        });
    });
};

const _creteOptionsSheet = async (wb, sheetsName, sheetsConfigs) => {
    const optionsWorkSheest = wb.addWorksheet(sheetsName, { hidden: true });

    sheetsConfigs.forEach((config) => {
        _createTableData(optionsWorkSheest, config.dataConfig, config.data, config.numbered, config.startColumn);
    });
};

const _createFormula = (sheetsName, startCol, dataLength) => {
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return `=${sheetsName}!$${ALPHABET[startCol - 1]}$2:$${ALPHABET[startCol - 1]}$${dataLength + 1}`;
};

const _checkImport = async (dataItem = {}) => {
    let errmsg = [];
    try {
        let {
            type,
            code,
            accounting_date,
            receive_payment_type,
            staff,
            total_money,
            descriptions,
            note,
            receiver_type,
            receiver_name,
            bank_account_number,
            payment_form,
            is_bookkeeping,
            company,
            business,
            store,
        } = dataItem;

        // validate data
        ModuleHelper.validateRequired(type, () => {
            errmsg.push('Loại chứng từ là bắt buộc.');
        });
        ModuleHelper.validateRequired(code, () => {
            errmsg.push('Số chứng từ là bắt buộc.');
        });
        ModuleHelper.validateRequired(receive_payment_type, () => {
            errmsg.push('Loại thu chi là bắt buộc.');
        });
        ModuleHelper.validateRequired(staff, () => {
            errmsg.push('Nhân viên thu/ chi là bắt buộc.');
        });
        ModuleHelper.validateRequired(total_money, () => {
            errmsg.push('Số tiền là bắt buộc.');
        });
        ModuleHelper.validateRequired(descriptions, () => {
            errmsg.push('Diễn giải là bắt buộc.');
        });
        ModuleHelper.validateRequired(receiver_type, () => {
            errmsg.push('Loại đối tượng thu/ chi là bắt buộc.');
        });
        ModuleHelper.validateRequired(receiver_name, () => {
            errmsg.push('Đối tượng thu/ chi là bắt buộc.');
        });
        ModuleHelper.validateRequired(payment_form, () => {
            errmsg.push('Hình thức thanh toán là bắt buộc.');
        });
        ModuleHelper.validateRequired(company, () => {
            errmsg.push('Công ty là bắt buộc.');
        });
        ModuleHelper.validateRequired(business, () => {
            errmsg.push('Miền là bắt buộc.');
        });
        ModuleHelper.validateDate(accounting_date, () => {
            errmsg.push('Ngày hạch toán phải đúng địng dạng DD/MM/YYYY.');
        });
        ModuleHelper.validatePositiveInteger(total_money, () => {
            errmsg.push('Số tiền không hợp lệ.');
        });

        ModuleHelper.validateMaxLength(descriptions, 2000, () => {
            errmsg.push('Diễn giải không được quá 2000 ký tự.');
        });
        ModuleHelper.validateMaxLength(note, 2000, () => {
            errmsg.push('Ghi chú không được quá 2000 ký tự.');
        });

        const DEFAULT_VALUE = 0;
        dataItem.is_bookkeeping = is_bookkeeping ? is_bookkeeping : DEFAULT_VALUE;

        ModuleHelper.validateBooleanValue(
            is_bookkeeping,
            ['1', 'da-ghi-so'],
            ['0', 'chua-ghi-so'],
            (booleanVal) => {
                dataItem.is_bookkeeping = booleanVal;
            },
            () => {
                errmsg.push('Trạng thái ghi sổ vui lòng nhập Chưa ghi sổ/Đã ghi sổ hoặc 1/0.');
            },
        );

        ModuleHelper.validateBooleanValue(
            type,
            ['phieu-thu', '1'],
            ['phieu-chi', '2'],
            (booleanVal) => {
                dataItem.type = booleanVal ? 1 : 2;
            },
            () => {
                errmsg.push('Loại chứng từ vui lòng nhập Phiếu thu/Phiếu chi hoặc 1/2.');
            },
        );

        // validate duplicate
        if (dataItem.type && code) {
            const isExistedCode = await _checkExistedCode(code, Number(type));
            if (isExistedCode) {
                errmsg.push('Số chứng từ đã tồn tại.');
            }
        }

        if (company) {
            const [id, name] = company.split(' - ');
            if (id) {
                const existedRecord = await _checkExistedRecord('AM_COMPANY', id);
                if (!existedRecord) {
                    errmsg.push('Công ty không tồn tại!.');
                } else {
                    dataItem.company_id = Number(id);
                }
            } else {
                errmsg.push('Công ty không lệ!.');
            }
        }

        if (business) {
            const [id, name] = business.split(' - ');
            if (id) {
                const existedRecord = await _checkExistedRecord('AM_BUSINESS', id);
                if (!existedRecord) {
                    errmsg.push('Miền không tồn tại.');
                } else {
                    dataItem.business_id = Number(id);
                }
            } else {
                errmsg.push('Miền không hợp lệ.');
            }
        }

        if (store) {
            const [id, name] = store.split(' - ');
            if (id) {
                const existedRecord = await _checkExistedRecord('MD_STORE', id);
                if (!existedRecord) {
                    errmsg.push('Cửa hàng không tồn tại.');
                } else {
                    dataItem.store_id = Number(id);
                }
            } else {
                errmsg.push('Cửa hàng không hợp lệ.');
            }
        }

        // kiểm tra loại thu/chi
        if (dataItem.type && receive_payment_type) {
            const [id, name] = receive_payment_type.split(' - ');
            if (dataItem.type === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE) {
                const isExistedRecord = await _checkExistedRecord('MD_RECEIVETYPE', id);
                if (!isExistedRecord) {
                    errmsg.push('Loại thu không tồn tại.');
                } else {
                    dataItem.receive_type_id = id;
                }
            } else if (dataItem.type === RECEIVE_EXPEND_TYPE.EXPEND_TYPE) {
                const isExistedRecord = await _checkExistedRecord('MD_EXPENDTYPE', id);
                if (!isExistedRecord) {
                    errmsg.push('Loại chi không tồn tại.');
                } else {
                    dataItem.expend_type_id = id;
                }
            }
        }

        // kiểm tra nhân viên thu, chi
        if (staff) {
            const [username, name] = staff.split(' - ');
            const isExistedRecord = await _checkExistedRecord('SYS_USER', null, username);
            if (!isExistedRecord) {
                errmsg.push('Nhân viên không tồn tại.');
            } else {
                if (dataItem.type === RECEIVE_EXPEND_TYPE.RECEIVE_TYPE) {
                    dataItem.cashier_id = username;
                } else if (dataItem.type === RECEIVE_EXPEND_TYPE.EXPEND_TYPE) {
                    dataItem.payer_id = username;
                }
            }
        }

        // kiểm tra loại đối tượng thu/chi
        if (receiver_type) {
            const [type, name] = receiver_type.split(' - ');
            if (!type || !RECEIVER_TYPES.some((_) => _.id === Number(type))) {
                errmsg.push('Loại đối tượng thu/chi không hợp lệ.');
            } else {
                dataItem.receiver_type = Number(type);
            }
        }

        // kiểm tra đối tượng thu/chi
        if (dataItem.receiver_type && receiver_name) {
            const [id, name] = receiver_name.split(' - ');

            if (id) {
                switch (dataItem.receiver_type) {
                    case 1:
                        const existedSupplierRecord = await _checkExistedRecord('MD_SUPPLIER', id);
                        if (!existedSupplierRecord) {
                            errmsg.push('Đối tượng thu/chi không hợp lệ.');
                        }
                        break;
                    case 2:
                        const existedStaffRecord = await _checkExistedRecord('SYS_USER', null, id);
                        if (!existedStaffRecord) {
                            errmsg.push('Đối tượng thu/chi không hợp lệ.');
                        }
                        break;
                    case 3:
                        const existedCustomerRecord = await _checkExistedRecord('CRM_ACCOUNT', null, id);
                        if (!existedCustomerRecord) {
                            errmsg.push('Đối tượng thu/chi không hợp lệ.');
                        }
                        break;
                    case 4:
                        if (!name) {
                            errmsg.push('Tên đối tượng thu/chi là bắt buộc.');
                        }
                        break;
                    default:
                        errmsg.push('Đối tượng thu/chi không hợp lệ.');
                        break;
                }
                dataItem.receiver_id = Number(id);
                dataItem.receiver_name = name;
            } else {
                errmsg.push('Đối tượng thu/chi không hợp lệ.');
            }
        }

        // kiểm tra hình thức thanh toán
        if (payment_form && dataItem.company_id) {
            const [id, name] = payment_form.split(' - ');
            if (id) {
                let isExistedRecord = await _checkExistedRecord('AC_PAYMENTFORM', id, null, dataItem.company_id);
                if (isExistedRecord && dataItem.store_id) {
                    isExistedRecord = await _checkExistedRecord(
                        'AC_PAYMENTFORM',
                        id,
                        null,
                        dataItem.company_id,
                        'ISALLSTORE',
                    );
                    if (!isExistedRecord) {
                        isExistedRecord = await _checkExistedPaymentFormForStore(id, dataItem.store_id);
                    }
                } else if (isExistedRecord && dataItem.business_id) {
                    isExistedRecord = await _checkExistedRecord(
                        'AC_PAYMENTFORM',
                        id,
                        null,
                        dataItem.company_id,
                        'ISALLBUSINESS',
                    );
                    if (!isExistedRecord) {
                        isExistedRecord = await _checkExistedPaymentFormForBusiness(id, dataItem.business_id);
                    }
                }
                if (!isExistedRecord) {
                    errmsg.push('Hình thức thanh toán không tồn tại.');
                } else {
                    dataItem.payment_form_id = Number(id);
                }
            } else {
                errmsg.push('Hình thức thanh toán không hợp lệ!.');
            }
        }

        // kiểm tra tài khoản thanh toán
        if (bank_account_number && dataItem.payment_form_id) {
            const paymentForm = await _getPaymentFormById(dataItem.payment_form_id);
            // 2 la loai hinh thuc chuyen khoan
            if (paymentForm && paymentForm.PAYMENTTYPE == 2) {
                const [id, name] = bank_account_number.split(' - ');
                if (id) {
                    if (dataItem.store_id) {
                        const existedBankAccount = await _checkExistedRecord('MD_STOREBANKACCOUNT', id);
                        if (!existedBankAccount) {
                            errmsg.push('Số tài khoản thu/chi không tồn tại !');
                        }
                    } else if (dataItem.business_id) {
                        const existedBankAccount = await _checkExistedRecord('AM_BUSINESS_BANKACCOUNT', id);
                        if (!existedBankAccount) {
                            errmsg.push('Số tài khoản thu/chi không tồn tại !');
                        }
                    }
                    dataItem.bank_account_id = Number(id);
                } else {
                    errmsg.push('Tài khoản thu/chi không hợp lệ !');
                }
            }
        }
    } catch (error) {
        logger.error(error, {
            function: 'ReceivePaymentSlipService.checkImport',
        });
        errmsg.push(error.message);
    }

    return { errmsg, item: dataItem };
};

const _checkExistedCode = async (code, type = 1) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('CODE', code)
            .input('TYPE', type)
            .execute('SL_RECEIVESLIP_PAYMENTSLIP_CheckCode_AdminWeb');

        const result = responseData.recordset[0]?.RESULT;
        return result;
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService._checkExistedCode' });
        return true;
    }
};

const _checkExistedRecord = async (table, id = null, code = null, parentId = null, filter = null) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('TABLENAME', table)
            .input('ID', id)
            .input('CODE', code)
            .input('PARENTID', parentId)
            .input('FILTER', filter)
            .execute('CBO_COMMON_CheckExistedRecord');

        const result = responseData.recordset[0]?.RESULT;
        return result;
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService._checkExistedRecord' });
        return false;
    }
};

const _checkExistedPaymentFormForStore = async (paymentFormId, storeId) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('PAYMENTFORMID', paymentFormId)
            .input('STOREID', storeId)
            .execute('AC_PAYMENTFORM_STORE_CheckExisted_AdminWeb');

        const result = responseData.recordset[0]?.RESULT;
        return result;
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService._checkExistedPaymentFormForStore' });
        return false;
    }
};

const _checkExistedPaymentFormForBusiness = async (paymentFormId, businessId) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('PAYMENTFORMID', paymentFormId)
            .input('BUSINESSID', businessId)
            .execute('AC_PAYMENTFORM_BUSINESS_CheckExisted_AdminWeb');

        const result = responseData.recordset[0]?.RESULT;
        return result;
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService._checkExistedPaymentFormForBusiness' });
        return false;
    }
};

const _getPaymentFormById = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool.request().input('PAYMENTFORMID', id).execute('AC_PAYMENTFORM_GetById_AdminWeb');

        const result = responseData.recordset[0];
        return result;
    } catch (e) {
        logger.error(e, { function: 'ReceivePaymentSlipService._getPaymentFormById' });
        return null;
    }
};

module.exports = {
    getList,
    deleteList,
    statistics,
    bookkeeping,
    unBookkeeping,
    creditAccountingAccountOpts,
    deptAccountingAccountOpts,
    receiveTypeOpts,
    paymentTypeOpts,
    importExcel,
    downloadExcel,
    exportExcel,
    exportPDF,
    businessOptions,
    storeOptions,
    updateReview,
};
