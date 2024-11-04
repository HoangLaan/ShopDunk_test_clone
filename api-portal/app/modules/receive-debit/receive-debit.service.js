const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const fileHelper = require('../../common/helpers/file.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./receive-debit.class');
const { VOUCHER_TYPE } = require('./constant');
const API_CONST = require('../../common/const/api.const');
const { createTableData } = require('../../common/helpers/excel.helper');
const { formatCurrency } = require('../../common/helpers/numberFormat');
let xl = require('excel4node');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('CUSTOMERID', apiHelper.getValueFromObject(queryParams, 'customer_id'))
            .execute('SL_RECEIVEDEBIT_GetList_AdminWeb');
        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            meta: moduleClass.sumRecord(data.recordsets[1])?.[0] || {},
        });
    } catch (e) {
        logger.error(e, { function: 'ReceiveDebitService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const getDetail = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('CUSTOMERID', apiHelper.getValueFromObject(queryParams, 'customer_id'))
            .input('CUSTOMERTYPE', apiHelper.getValueFromObject(queryParams, 'customer_type'))
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(queryParams, 'payment_form_id'))
            .execute('SL_RECEIVEDEBIT_GetDetail_AdminWeb');

        const metaData = moduleClass.sumRecord(data.recordsets[1])?.[0] || {};

        const creditBegin = data.recordsets[2]?.[0]?.CREDITBEGIN || 0;
        const debtBegin = data.recordsets[3]?.[0]?.DEBTBEGIN || 0;

        metaData.credit_begin = creditBegin;
        metaData.debt_begin = debtBegin;

        let receiveDebitList = moduleClass.detail(data.recordset);
        // detach tax

        receiveDebitList = receiveDebitList.reduce((debitList, debitItem) => {
            if (debitItem.tax_acc_code) {
                const revenueItem = {
                    ...debitItem,
                    tax_acc_code: null,
                    debt_arise_money: debitItem.revenue_money,
                    remaining: debitItem.remaining + debitItem.debt_arise_money - debitItem.revenue_money,
                };
                const taxItem = {
                    ...debitItem,
                    tax_acc_code: null,
                    sub_acc_code: debitItem.tax_acc_code,
                    debt_arise_money: debitItem.tax_money,
                };

                debitList = debitList.concat([revenueItem, taxItem]);
            } else {
                debitList.push(debitItem);
            }
            return debitList;
        }, []);

        return new ServiceResponse(true, '', {
            data: receiveDebitList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            meta: metaData,
        });
    } catch (e) {
        logger.error(e, { function: 'ReceiveDebitService.getList' });
        return new ServiceResponse(true, '', []);
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
        logger.error(e, { function: 'ReceiveDebitService.deleteList' });
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
            function: 'ReceiveDebitService.genCode',
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
            function: 'ReceiveDebitService.getObjectOptions',
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
            function: 'ReceiveDebitService.getObjectOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const res = await getList(queryParams);
        const { data, meta } = res.getData() || {};

        // append sum record
        data.push({
            customer_name: 'Tổng cộng',
            debt_begin_money: meta?.total_debt_begin || 0,
            credit_begin_money: meta?.credit_begin_money || 0,
            debt_arise_money: meta?.total_debt_arise || 0,
            credit_arise_money: meta?.total_credit_arise || 0,
            debt_money: meta?.total_debt || 0,
            credit_money: meta?.total_credit || 0,
            style: {
                font: { bold: true },
            },
        });

        const workbook = await _exportExcelFile(data);
        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ReceiveDebitService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFile = async (data) => {
    const workbook = new xl.Workbook();

    const BUDGET_SHEETS_NAME = 'DS cong no phai thu';
    const WorkSheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    const columns = [
        {
            key: 'customer_code',
            title: 'Mã khách hàng',
        },
        {
            key: 'customer_name',
            title: 'Tên khách hàng',
            width: 50,
        },
        {
            key: 'other_acc_voucher_code',
            title: 'TK Công nợ',
            transform: () => '131',
        },
        {
            key: 'debt_begin_money',
            title: 'Số dư Nợ đầu kỳ	',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'credit_begin_money',
            title: 'Số dư Có đầu kỳ',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'debt_arise_money',
            title: 'Phát sinh Nợ',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'credit_arise_money',
            title: 'Phát sinh Có',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'debt_money',
            title: 'Dư Nợ',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'credit_money',
            title: 'Dư Có',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
    ];

    const NUMBERED = true;
    createTableData(WorkSheet, columns, data, NUMBERED);
    return workbook;
};

const exportExcelDetail = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const res = await getDetail(queryParams);
        let { data, meta } = res.getData() || {};

        // append sum record
        data.push({
            customer_name: 'Tổng cộng',
            debt_arise_money: meta?.total_debt_arise || 0,
            credit_arise_money: meta?.total_credit_arise || 0,
        });

        data = data.map((record) => ({
            ...record,
            remaining: record.remaining + meta?.credit_begin - meta?.debt_begin,
        }));

        data.unshift({
            explain: 'Số dư đầu kỳ',
            debt_begin_money: meta.debt_begin,
            credit_begin_money: meta.credit_begin,
            remaining: meta.credit_begin - meta.debt_begin,
        });

        const workbook = await _exportExcelFileDetail(data);
        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ReceiveDebitService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFileDetail = async (data) => {
    const workbook = new xl.Workbook();

    const BUDGET_SHEETS_NAME = 'DS chi tiet cong no phai thu';
    const WorkSheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    const columns = [
        {
            key: 'accounting_date',
            title: 'Ngày hạch toán',
        },
        {
            key: 'voucher_date',
            title: 'Ngày chứng từ',
        },
        {
            key: 'voucher_code',
            title: 'Số chứng từ',
        },
        {
            key: 'customer_code',
            title: 'Mã khách hàng',
        },
        {
            key: 'customer_name',
            title: 'Tên khách hàng',
            width: 50,
        },
        {
            key: 'explain',
            title: 'Diễn giải',
            width: 60,
        },
        {
            key: 'main_acc_code',
            title: 'TK Công nợ',
        },
        {
            key: 'sub_acc_code',
            title: 'TK Đối ứng',
        },
        {
            key: 'bank_account',
            title: 'Tài khoản ngân hàng',
        },
        {
            key: 'debt_begin_money',
            title: 'Số dư Nợ đầu kỳ	',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'credit_begin_money',
            title: 'Số dư Có đầu kỳ',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'debt_arise_money',
            title: 'Phát sinh Nợ',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'credit_arise_money',
            title: 'Phát sinh Có',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'remaining',
            title: 'Dư Nợ',
            transform: (_, item) => {
                return item.remaining < 0 ? formatCurrency(Math.round(item.remaining * -1 || 0), 0) : '0';
            },
        },
        {
            key: 'remaining',
            title: 'Dư Có',
            transform: (_, item) => {
                return item.remaining > 0 ? formatCurrency(Math.round(item.remaining || 0), 0) : '0';
            },
        },
    ];

    const NUMBERED = true;
    createTableData(WorkSheet, columns, data, NUMBERED);
    return workbook;
};

module.exports = {
    getList,
    getDetail,
    deleteList,
    genCode,
    getObjectOptions,
    getVoucherTypeOptions,
    exportExcel,
    exportExcelDetail,
};
