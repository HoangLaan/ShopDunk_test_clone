const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const fileHelper = require('../../common/helpers/file.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./other-voucher.class');
const { VOUCHER_TYPE } = require('./constant');
const API_CONST = require('../../common/const/api.const');
const { createTableData } = require('../../common/helpers/excel.helper');
const { formatCurrency } = require('../../common/helpers/numberFormat');
let xl = require('excel4node');
const pdfHelper = require('../../common/helpers/pdf.helper');
const moment = require('moment');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const voucherType = apiHelper.getValueFromObject(queryParams, 'voucher_type');
        let receive_type_id = null;
        let expend_type_id = null;

        if (voucherType && voucherType != '0') {
            const [id, type] = voucherType.split('_');
            if (Number(type) === VOUCHER_TYPE.RECEIVE) {
                receive_type_id = id;
            } else if (Number(type) === VOUCHER_TYPE.EXPEND) {
                expend_type_id = id;
            }
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('ISBOOKKEEPING', apiHelper.getValueFromObject(queryParams, 'is_bookkeeping'))
            .input('RECEIVETYPEID', receive_type_id)
            .input('EXPENDTYPEID', expend_type_id)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .execute('AC_OTHERACCVOUCHER_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'OtherAccVoucherService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const _getType = (voucher_type) => {
    let expend_type_id = null;
    let receive_type_id = null;

    if (voucher_type) {
        const [id, type] = voucher_type.split('_');
        if (Number(type) === VOUCHER_TYPE.EXPEND) {
            expend_type_id = id;
        } else if (Number(type) === VOUCHER_TYPE.RECEIVE) {
            receive_type_id = id;
        }
    }

    return {
        expend_type_id,
        receive_type_id,
    };
};

const createOrUpdate = async (bodyParams) => {
    let otherAccVoucherId = apiHelper.getValueFromObject(bodyParams, 'other_acc_voucher_id');
    const auth_name = bodyParams?.auth_name;

    // handle change
    const voucher_type = apiHelper.getValueFromObject(bodyParams, 'voucher_type');
    const { expend_type_id, receive_type_id } = _getType(voucher_type);

    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const resCreateOrUpdateOther = await request
            .input('OTHERACCVOUCHERID', otherAccVoucherId)
            .input('EXPENDTYPEID', expend_type_id)
            .input('RECEIVETYPEID', receive_type_id)
            .input('TOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'total_money'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('INVOICEDATE', apiHelper.getValueFromObject(bodyParams, 'invoice_date'))
            .input('ISBOOKKEEPING', apiHelper.getValueFromObject(bodyParams, 'is_bookkeeping', 0))
            .input('OTHERACCVOUCHERCODE', apiHelper.getValueFromObject(bodyParams, 'other_acc_voucher_code'))
            .input('PAYMENTEXPIREDDATE', apiHelper.getValueFromObject(bodyParams, 'payment_expired_date'))
            .input('ISMERGEINVOICE', apiHelper.getValueFromObject(bodyParams, 'is_merge_invoice', 0))
            .input('NOTDECLARETAX', apiHelper.getValueFromObject(bodyParams, 'not_declare_tax', 0))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id', 0))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id', 0))
            .input('CREATEDUSER', auth_name)
            .input('CREATEDDATE', apiHelper.getValueFromObject(bodyParams, 'created_date'))
            .execute('AC_OTHERACCVOUCHER_CreateOrUpdate_AdminWeb');

        otherAccVoucherId = resCreateOrUpdateOther.recordset[0].RESULT;

        if (!otherAccVoucherId) {
            throw new Error('Create other voucher failed !');
        }

        const accountingList = apiHelper.getValueFromObject(bodyParams, 'accounting_list', []);
        const createAccountingResult = await _createOrUPdateAccountings(
            otherAccVoucherId,
            auth_name,
            accountingList,
            transaction,
        );
        if (!createAccountingResult) {
            throw new Error('Create accoungint list failed !');
        }

        const invoiceList = apiHelper.getValueFromObject(bodyParams, 'invoice_list', []);
        const createInvoiceResult = await _createOrUPdateInvoices(
            otherAccVoucherId,
            auth_name,
            invoiceList,
            transaction,
        );
        if (!createInvoiceResult) {
            throw new Error('Create invoice list failed !');
        }

        const attachmentList = apiHelper.getValueFromObject(bodyParams, 'attachment_list', []);
        const createAttachmentsResult = await _createOrUpdateAttachments(
            otherAccVoucherId,
            auth_name,
            attachmentList,
            transaction,
        );
        if (!createAttachmentsResult) {
            throw new Error('Create attachment list failed !');
        }

        await transaction.commit();
        return new ServiceResponse(true, '', otherAccVoucherId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'OtherAccVoucherService.CreateOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const _createOrUpdateAttachments = async (otherAccVoucherId, authName, data, transaction) => {
    const currentIds = data
        .filter((item) => item.other_acc_voucher_attachment_id)
        ?.map((item) => item.other_acc_voucher_attachment_id);

    // delete
    const request = new sql.Request(transaction);
    const deleteResult = await request
        .input('LISTID', currentIds)
        .input('OTHERACCVOUCHERID', otherAccVoucherId)
        .execute('AC_OTHERACCVOUCHER_ATTACHMENT_DeleteAllExcept_AdminWeb');
    if (!deleteResult.recordset[0]?.RESULT) {
        return false;
    }
    // insert
    for (const item of data) {
        const request = new sql.Request(transaction);
        const resultChild = await request
            .input('OTHERACCVOUCHERATTACHMENTID', apiHelper.getValueFromObject(item, 'other_acc_voucher_attachment_id'))
            .input('OTHERACCVOUCHERID', otherAccVoucherId)
            .input('ATTACHMENTNAME', apiHelper.getValueFromObject(item, 'attachment_name'))
            .input('ATTACHMENTPATH', apiHelper.getValueFromObject(item, 'attachment_path'))
            .input('ATTACHMENTEXTENSION', apiHelper.getValueFromObject(item, 'file_ext'))
            .input('CREATEDUSER', authName)
            .execute('AC_OTHERACCVOUCHER_ATTACHMENT_CreateOrUpdate_AdminWeb');

        const childId = resultChild.recordset[0].RESULT;
        if (childId <= 0) {
            return false;
        }
    }

    return true;
};

const _createOrUPdateInvoices = async (otherAccVoucherId, authName, data, transaction) => {
    const currentIds = data
        .filter((item) => item.other_acc_voucher_invoice_id)
        ?.map((item) => item.other_acc_voucher_invoice_id);

    // delete
    const request = new sql.Request(transaction);
    const deleteResult = await request
        .input('LISTID', currentIds)
        .input('OTHERACCVOUCHERID', otherAccVoucherId)
        .execute('AC_OTHERACCVOUCHER_INVOICE_DeleteAllExcept_AdminWeb');
    if (!deleteResult.recordset[0]?.RESULT) {
        return false;
    }
    // insert
    for (const item of data) {
        const request = new sql.Request(transaction);
        const resultChild = await request
            .input('OTHERACCVOUCHERINVOICEID', apiHelper.getValueFromObject(item, 'other_acc_voucher_invoice_id'))
            .input('OTHERACCVOUCHERID', otherAccVoucherId)
            .input('OTHERACCVOUCHERDETAILID', apiHelper.getValueFromObject(item, 'other_acc_voucher_detail_id'))
            .input('VATVALUE', apiHelper.getValueFromObject(item, 'vat_value'))
            .input('VATMONEY', apiHelper.getValueFromObject(item, 'vat_money'))
            .input('INVOICENO', apiHelper.getValueFromObject(item, 'invoice_no'))
            .input('INVOICEFORMNO', apiHelper.getValueFromObject(item, 'invoice_form_no'))
            .input('INVOICESERIAL', apiHelper.getValueFromObject(item, 'invoice_serial'))
            .input('INVOICEDATE', apiHelper.getValueFromObject(item, 'invoice_date'))
            .input('TAXTYPE', apiHelper.getValueFromObject(item, 'tax_type'))
            .input('TAXACCID', apiHelper.getValueFromObject(item, 'tax_acc_id'))
            .input('INVOICECHECKING', apiHelper.getValueFromObject(item, 'invoice_checking', 0))
            .input('OBJECTTYPE', apiHelper.getValueFromObject(item, 'object_type'))
            .input('EXPLAIN', apiHelper.getValueFromObject(item, 'explain'))
            .input('ORIGINMONEY', apiHelper.getValueFromObject(item, 'origin_money'))
            .input('OBJECTID', apiHelper.getValueFromObject(item, 'object_id'))
            .input('OBJECTNAME', apiHelper.getValueFromObject(item, 'object_name'))
            .input('CREATEDUSER', authName)
            .execute('AC_OTHERACCVOUCHER_INVOICE_CreateOrUpdate_AdminWeb');

        const childId = resultChild.recordset[0].RESULT;
        if (childId <= 0) {
            return false;
        }
    }

    return true;
};

const _createOrUPdateAccountings = async (otherAccVoucherId, authName, data, transaction) => {
    const currentIds = data
        .filter((item) => item.other_acc_voucher_detail_id)
        ?.map((item) => item.other_acc_voucher_detail_id);

    // delete
    const request = new sql.Request(transaction);
    const deleteResult = await request
        .input('LISTID', currentIds)
        .input('OTHERACCVOUCHERID', otherAccVoucherId)
        .execute('AC_OTHERACCVOUCHER_DETAIL_DeleteAllExcept_AdminWeb');
    if (!deleteResult.recordset[0]?.RESULT) {
        return false;
    }
    // insert
    for (const item of data) {
        const voucher_type = apiHelper.getValueFromObject(item, 'voucher_type');
        const { expend_type_id, receive_type_id } = _getType(voucher_type);

        const request = new sql.Request(transaction);
        const resultChild = await request
            .input('OTHERACCVOUCHERDETAILID', apiHelper.getValueFromObject(item, 'other_acc_voucher_detail_id'))
            .input('OTHERACCVOUCHERID', otherAccVoucherId)
            .input('NOTE', apiHelper.getValueFromObject(item, 'note'))
            .input('DEBTACCID', apiHelper.getValueFromObject(item, 'debt_acc_id'))
            .input('CREDITACCID', apiHelper.getValueFromObject(item, 'credit_acc_id'))
            .input('MONEY', apiHelper.getValueFromObject(item, 'money'))
            .input('EXPENDTYPEID', expend_type_id)
            .input('RECEIVETYPEID', receive_type_id)
            .input('DEBTOBJECTTYPE', apiHelper.getValueFromObject(item, 'debt_object_type'))
            .input('DEBTOBJECTID', apiHelper.getValueFromObject(item, 'debt_object_id'))
            .input('DEBTOBJECTNAME', apiHelper.getValueFromObject(item, 'debt_object_name'))
            .input('CREDITOBJECTTYPE', apiHelper.getValueFromObject(item, 'credit_object_type'))
            .input('CREDITOBJECTID', apiHelper.getValueFromObject(item, 'credit_object_id'))
            .input('CREDITOBJECTNAME', apiHelper.getValueFromObject(item, 'credit_object_name'))
            .input('CREATEDUSER', authName)
            .execute('AC_OTHERACCVOUCHER_DETAIL_CreateOrUpdate_AdminWeb');

        const childId = resultChild.recordset[0].RESULT;
        if (childId <= 0) {
            return false;
        }
    }

    return true;
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('OTHERACCVOUCHERID', id)
            .execute('AC_OTHERACCVOUCHER_GetById_AdminWeb');

        let detail = responseData.recordset[0];
        let accountingList = responseData.recordsets[1] || [];
        let invoiceList = responseData.recordsets[2] || [];
        let attachmentList = responseData.recordsets[3] || [];

        if (detail) {
            detail = moduleClass.detail(detail);
            _parseType(detail);
            detail.accounting_list = moduleClass.accountingList(accountingList);
            detail.accounting_list.forEach((item) => _parseType(item));

            detail.invoice_list = moduleClass.invoiceList(invoiceList);
            detail.attachment_list = moduleClass.attachmentList(attachmentList);

            return new ServiceResponse(true, '', detail);
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (e) {
        logger.error(e, { function: 'OtherAccVoucherService.getDetail' });

        return new ServiceResponse(false, e.message);
    }
};

// parse from id and type into merged value
const _parseType = (item) => {
    if (item.expend_type_id) {
        item.voucher_type = `${item.expend_type_id}_${VOUCHER_TYPE.EXPEND}`;
    } else if (item.receive_type_id) {
        item.voucher_type = `${item.receive_type_id}_${VOUCHER_TYPE.RECEIVE}`;
    }
};

const deleteList = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await transaction.begin();

        if (list_id && list_id.length > 0) {
            for (let id of list_id) {
                const request = new sql.Request(transaction);
                const dataRes = await request
                    .input('OTHERACCVOUCHERID', id)
                    .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('AC_OTHERACCVOUCHER_DeleteById_AdminWeb');

                if (!dataRes?.recordset[0]?.RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'failed');
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'OtherAccVoucherService.deleteList' });
        return new ServiceResponse(false, e.message);
    }
};

const genCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('AC_OTHERACCVOUCHER_GenCode_AdminWeb');
        const code = data.recordset[0]?.CODE;
        if (code) {
            return new ServiceResponse(true, '', { code: code?.trim() });
        }
        return new ServiceResponse(false, RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, {
            function: 'OtherAccVoucherService.genCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getObjectOptions = async (queryParams) => {
    try {
        const queryType = apiHelper.getValueFromObject(queryParams, 'query_type');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('QUERYTYPE', queryType)
            .execute('AC_OTHERVOUCHER_GetObjectOptions_AdminWeb');

        return new ServiceResponse(true, 'success', data?.recordset || []);
    } catch (e) {
        logger.error(e, {
            function: 'OtherAccVoucherService.getObjectOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getStoreOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', queryParams.auth_id)
            .input('ISVIEWALL', queryParams.auth_name === 'administrator' ? 1 : 0)
            .execute('AC_OTHERVOUCHER_GetStoreOption_AdminWeb');

        return new ServiceResponse(true, 'success', data?.recordset || []);
    } catch (e) {
        logger.error(e, {
            function: 'OtherAccVoucherService.getStoreOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getVoucherTypeOptions = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('AC_OTHERVOUCHER_GetVoucherTypeOptions_AdminWeb');

        return new ServiceResponse(true, 'success', data?.recordset || []);
    } catch (e) {
        logger.error(e, {
            function: 'OtherAccVoucherService.getObjectOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const res = await getList(queryParams);
        const { data } = res.getData() || {};
        const workbook = await _exportExcelFile(data);
        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'OtherAccVoucherService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFile = async (data) => {
    const workbook = new xl.Workbook();

    const BUDGET_SHEETS_NAME = 'DS chung tu nghiep vu khac';
    const WorkSheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    const columns = [
        {
            key: 'created_date',
            title: 'Ngày hạch toán',
        },
        {
            key: 'invoice_date',
            title: 'Ngày chứng từ',
        },
        {
            key: 'other_acc_voucher_code',
            title: 'Số chứng từ',
        },
        {
            key: 'description',
            title: 'Diễn giải',
            width: 60,
        },
        {
            key: 'total_money',
            title: 'Số tiền',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'voucher_type_name',
            title: 'Loại chứng từ',
            width: 40,
        },
        {
            key: 'created_user',
            title: 'Người tạo',
            width: 40,
        },
        {
            key: 'is_bookkeeping',
            title: 'Trạng thái ghi sổ',
            transform: (val) => (val ? 'Đã ghi sổ' : 'Chưa ghi sổ'),
        },
    ];

    const NUMBERED = true;
    createTableData(WorkSheet, columns, data, NUMBERED);

    return workbook;
};

const exportPDF = async (queryParams = {}) => {
    try {
        const otherVoucherId = apiHelper.getValueFromObject(queryParams, 'other_voucher_id');

        if (!otherVoucherId) return new ServiceResponse(false, 'Không tìm thấy dữ liệu !');

        const response = await getDetail(otherVoucherId);
        if (response?.isFailed()) return new ServiceResponse(false, 'Không tìm thấy dữ liệu !');
        const detailData = response.getData();

        // convert money to text
        const moneyToText = await _convertNumberToText(detailData.total_money);
        detailData.text_money = moneyToText;

        // format price
        detailData.total_money = formatCurrency(detailData.total_money, 0);
        detailData.accounting_list?.forEach((accounting) => {
            accounting.money = formatCurrency(accounting.money, 0);
        });

        const firstAccounting = detailData.accounting_list?.[0];
        const object = await _getObjectDetail(
            firstAccounting.debt_object_type ?? firstAccounting.credit_object_type,
            firstAccounting.debt_object_id ?? firstAccounting.credit_object_id,
        );

        detailData.object_name = object?.NAME?.trim();
        detailData.object_address = object?.ADDRESS?.trim();

        const fileName = `chung_tu_nghiep_vu_khac_${moment().format('DDMMYYYY')}_${otherVoucherId}`;

        const print_params = {
            template: `other-voucher.html`,
            data: detailData,
            filename: fileName,
        };

        await pdfHelper.printPDF(print_params);
        return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'OtherAccVoucherService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

const _convertNumberToText = async (money) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('MONEY', money).execute('CBO_COMMON_MoneyToText');

        return data.recordset[0]?.RESULT || '';
    } catch (e) {
        logger.error(e, {
            function: 'OtherAccVoucherService._convertNumberToText',
        });
        return '';
    }
};

const _getObjectDetail = async (objectType, objectId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OBJECTTYPE', objectType)
            .input('OBJECTID', objectId)
            .execute('AC_OTHERVOUCHER_GetDetailObject_AdminWeb');

        return data.recordset[0] || {};
    } catch (e) {
        logger.error(e, {
            function: 'OtherAccVoucherService._getObjectDetail',
        });
        return {};
    }
};

module.exports = {
    getList,
    createOrUpdate,
    getDetail,
    deleteList,
    genCode,
    getObjectOptions,
    getVoucherTypeOptions,
    exportExcel,
    exportPDF,
    getStoreOptions,
};
