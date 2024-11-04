const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const fileHelper = require('../../common/helpers/file.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./receive-pay.class');
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
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .execute('SL_RECEIVEPAY_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            meta: moduleClass.sumRecord(data.recordsets[1])?.[0] || {},
        });
    } catch (e) {
        logger.error(e, { function: 'ReceivePayService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const getDetail = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const start_date = apiHelper.getValueFromObject(queryParams, 'start_date');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', start_date)
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('CUSTOMERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            // .input('CUSTOMERTYPE', apiHelper.getValueFromObject(queryParams, 'customer_type'))
            .execute('SL_RECEIVEPAY_GetDetail_AdminWeb');

        const dataList = moduleClass.detail(data.recordset);

        // Tính tổng tiền trang trước
        if (currentPage > 1) {
            const { debt_begin_money, credit_begin_money, debt_arise_money, credit_arise_money } =
                data.recordsets[2]?.[0];
            dataList.unshift({
                is_total: true,
                debt_arise_money,
                credit_arise_money,
                debt_begin_money,
                credit_begin_money,
                explain: 'Số tiền trang trước chuyển sang',
            });
        }

        const dataFirst = await _calTotalFirst({ ...queryParams, end_date: start_date });
        dataList.unshift({
            is_total: true,
            ...dataFirst,
            explain: 'Số dư đầu kỳ',
        });

        for (const index in dataList) {
            if (parseInt(index) === 0) {
                dataList[index].debt_money = dataList[index].debt_arise_money - dataList[index].credit_arise_money;
                dataList[index].credit_money = dataList[index].credit_arise_money - dataList[index].debt_arise_money;
            } else {
                dataList[index].debt_money =
                    dataList[index - 1].debt_money +
                    dataList[index].debt_arise_money -
                    dataList[index].credit_arise_money;
                dataList[index].credit_money =
                    dataList[index - 1].credit_money +
                    dataList[index].credit_arise_money -
                    dataList[index].debt_arise_money;
            }
        }

        return new ServiceResponse(true, '', {
            data: dataList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            meta: moduleClass.sumRecord(data.recordsets[1])?.[0] || {},
        });
    } catch (e) {
        logger.error(e, { function: 'ReceivePayService.getList' });
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
        logger.error(e, { function: 'ReceivePayService.deleteList' });
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
            function: 'ReceivePayService.genCode',
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
            function: 'ReceivePayService.getObjectOptions',
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
            function: 'ReceivePayService.getObjectOptions',
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
            // debt_arise_money: meta?.total_debt_arise || 0,
            // credit_arise_money: meta?.total_credit_arise || 0,
            style: {
                font: { bold: true },
            },
            isTotal: true,
        });

        const workbook = await _exportExcelFile(data);
        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ReceivePayService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFile = async (data) => {
    const workbook = new xl.Workbook();

    const BUDGET_SHEETS_NAME = 'Danh sách công nợ phải trả (UI Kế toán)';
    const WorkSheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    const columns = [
        {
            key: 'customer_code',
            title: 'Mã đối tượng',
        },
        {
            key: 'customer_name',
            title: 'Tên đối tượng',
            width: 50,
        },
        {
            key: 'other_acc_voucher_code',
            title: 'TK Công nợ',
            transform: (val, item) => (item.isTotal ? '' : '331'),
        },
        {
            key: 'debt_begin_money',
            title: 'Số dư Nợ đầu kỳ	',
            transform: (val) => formatCurrency(Math.round(val), 0, ',', ','),
        },
        {
            key: 'credit_begin_money',
            title: 'Số dư Có đầu kỳ',
            transform: (val) => formatCurrency(Math.round(val), 0, ',', ','),
        },
        {
            key: 'debt_arise_money',
            title: 'Phát sinh Nợ',
            transform: (val) => formatCurrency(Math.round(val), 0, ',', ','),
        },
        {
            key: 'credit_arise_money',
            title: 'Phát sinh Có',
            transform: (val) => formatCurrency(Math.round(val), 0, ',', ','),
        },
        {
            key: 'created_user',
            title: 'Dư Nợ',
            transform: (_, item) => {
                const debtMoney = item?.debt_begin_money + item?.debt_arise_money;
                const creditMoney = item?.credit_begin_money + item?.credit_arise_money;
                return formatCurrency(Math.round(debtMoney - creditMoney || 0), 0, ',', ',');
            },
        },
        {
            key: 'created_user',
            title: 'Dư Có',
            transform: (_, item) => {
                const debtMoney = item?.debt_begin_money + item?.debt_arise_money;
                const creditMoney = item?.credit_begin_money + item?.credit_arise_money;
                return formatCurrency(Math.round(creditMoney - debtMoney || 0), 0, ',', ',');
            },
        },
    ];

    const NUMBERED = true;
    createTableData(WorkSheet, columns, data, NUMBERED);
    return workbook;
};

const exportExcelDetail = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        queryParams.page = 1;
        const res = await getDetail(queryParams);
        const { data, meta } = res.getData() || {};

        // append sum record
        // data.push({
        //     customer_name: 'Tổng cộng',
        //     debt_arise_money: meta?.total_debt_arise || 0,
        //     credit_arise_money: meta?.total_credit_arise || 0,
        //     style: {
        //         font: { bold: true },
        //     },
        // });

        const workbook = await _exportExcelFileDetail(data);
        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ReceivePayService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFileDetail = async (data) => {
    const workbook = new xl.Workbook();

    const BUDGET_SHEETS_NAME = 'DS chi tiet cong no phai tra';
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
            title: 'Mã đối tượng',
        },
        {
            key: 'customer_name',
            title: 'Tên đối tượng',
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
            transform: (val) => formatCurrency(Math.round(val), 0, ',', ','),
        },
        {
            key: 'credit_begin_money',
            title: 'Số dư Có đầu kỳ',
            transform: (val) => formatCurrency(Math.round(val), 0, ',', ','),
        },
        {
            key: 'debt_arise_money',
            title: 'Phát sinh Nợ',
            transform: (val) => formatCurrency(Math.round(val), 0, ',', ','),
        },
        {
            key: 'credit_arise_money',
            title: 'Phát sinh Có',
            transform: (val) => formatCurrency(Math.round(val), 0, ',', ','),
        },
        {
            key: 'created_user',
            title: 'Dư Nợ',
            transform: (_, item, index) => {
                return formatCurrency(item.debt_money < 0 ? 0 : item.debt_money, 0, ',', ',');
            },
        },
        {
            key: 'created_user',
            title: 'Dư Có',
            transform: (_, item, index) => {
                return formatCurrency(item.credit_money < 0 ? 0 : item.credit_money, 0, ',', ',');
            },
        },
    ];

    const NUMBERED = true;
    createTableData(WorkSheet, columns, data, NUMBERED);
    return workbook;
};

const _calTotalFirst = async (queryParams = {}) => {
    try {
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');

        const pool = await mssql.pool;
        const dataRecord = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('CUSTOMERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            // .input('CUSTOMERTYPE', apiHelper.getValueFromObject(queryParams, 'customer_type'))
            .execute('SL_RECEIVEPAY_CalTotalFirst_AdminWeb');

        const { debt_arise_money = 0, credit_arise_money = 0 } = dataRecord.recordset[0];
        const debt_begin_money = debt_arise_money - credit_arise_money;
        const credit_begin_money = credit_arise_money - debt_arise_money;
        return {
            debt_arise_money,
            credit_arise_money,
            debt_begin_money: debt_begin_money < 0 ? 0 : debt_begin_money,
            credit_begin_money: credit_begin_money < 0 ? 0 : credit_begin_money,
        };
    } catch (e) {
        logger.error(e, { function: 'ReceivePayService._calTotalFirst' });
        return {};
    }
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
