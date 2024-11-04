const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const moduleClass = require('./cash-flow.class');
const API_CONST = require('../../common/const/api.const');
const xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const excelHelper = require('../../common/helpers/excel.helper');
const { getOptionsCommon } = require('../global/global.service');

const cashFlowType = { THU: 1, CHI: 2 };

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getCashFlowList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .input('CASHFLOWTYPE', apiHelper.getValueFromObject(queryParams, 'cash_flow_type'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('FI_CASHFLOW_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordsets[1], apiHelper.getValueFromObject(queryParams, 'is_export')),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'CashFlowService.getCashFlowList' });

        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateCashFlow = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    try {
        // Save
        const resCreateOrUpdateCashFlow = await pool
            .request()
            .input('CASHFLOWID', apiHelper.getValueFromObject(bodyParams, 'cash_flow_id'))

            .input('CASHFLOWNAME', apiHelper.getValueFromObject(bodyParams, 'cash_flow_name'))
            .input('CASHFLOWCODE', apiHelper.getValueFromObject(bodyParams, 'cash_flow_code'))
            .input('CASHFLOWTYPE', apiHelper.getValueFromObject(bodyParams, 'cash_flow_type'))

            .input('IMPLICITACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'implicit_account_id'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))

            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))

            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('FI_CASHFLOW_CreateOrUpdate_AdminWeb');

        const cashFlowId = resCreateOrUpdateCashFlow.recordset[0].RESULT;

        if (!cashFlowId || cashFlowId <= 0) {
            return new ServiceResponse(false, 'Tạo dòng tiền thất bại', null);
        }

        removeCacheOptions();

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { CashFlow: 'CashFlowService.createOrUpdateCashFlow' });

        return new ServiceResponse(false, error.message);
    }
};

const cashFlowDetail = async (cashFlowId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool.request().input('CASHFLOWID', cashFlowId).execute('FI_CASHFLOW_GetById_AdminWeb');

        let cashFlow = resData.recordset[0];

        if (cashFlow) {
            cashFlow = moduleClass.detail(cashFlow);

            return new ServiceResponse(true, '', cashFlow);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'CashFlowService.cashFlowDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteCashFlow = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'CASHFLOWID')
            .input('TABLENAME', 'FI_CASHFLOW')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'CashFlowService.deleteCashFlow' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const exportExcelCashFlow = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        queryParams.parent_id = null;
        queryParams.is_export = true;

        let resService = await getCashFlowList(queryParams);
        let { data } = resService.getData();

        let sheet = excelHelper.addWorksheet(
            new xl.Workbook(),
            'DANH SÁCH DÒNG TIỀN',
            'Danh sách dòng tiền',
            [
                {
                    width: 7,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 15,
                    title: 'Mã dòng tiền',
                    field: 'cash_flow_code',
                },
                {
                    width: 30,
                    title: 'Tên dòng tiền',
                    field: 'cash_flow_name',
                },
                {
                    width: 50,
                    title: 'Công ty áp dụng',
                    field: 'company_name',
                },
                {
                    width: 30,
                    title: 'Tài khoản kế toán ngầm định',
                    field: 'implicit_account_name',
                },
                {
                    width: 30,
                    title: 'Thuộc dòng tiền',
                    field: 'parent_name',
                },
                {
                    width: 30,
                    title: 'Loại dòng tiền',
                    formatter: (item, index) =>
                        item.cash_flow_type === cashFlowType.THU
                            ? 'Loại thu'
                            : item.cash_flow_type === cashFlowType.CHI
                            ? 'Loại chi'
                            : null,
                },
                {
                    width: 50,
                    title: 'Diễn giải',
                    field: 'description',
                },
                {
                    width: 50,
                    title: 'Ghi chú',
                    field: 'note',
                },
                {
                    width: 25,
                    title: 'Người tạo',
                    field: 'created_user',
                },
                {
                    width: 12,
                    title: 'Ngày tạo',
                    field: 'created_date',
                },
                {
                    width: 10,
                    title: 'Trạng thái',
                    formatter: (item, index) => (item.is_active ? 'Kích hoạt' : 'Ẩn'),
                },
            ],
            data,
        );

        return new ServiceResponse(true, '', sheet);
    } catch (error) {
        logger.error(error, { function: 'CashFlowService.exportExcel' });
        return new ServiceResponse(false, error);
    }
};

const downloadTemplateCashFlow = async () => {
    try {
        // Company
        const companyOptionsRes = await getOptionsCommon({ type: 'company' });
        if (companyOptionsRes.isFailed()) {
            throw companyOptionsRes;
        }
        const companyOptions = companyOptionsRes.getData();

        // Default account
        const defaultAccountOptionsRes = await getOptionsCommon({ type: 'defaultAccount' });
        if (defaultAccountOptionsRes.isFailed()) {
            throw defaultAccountOptionsRes;
        }
        const defaultAccountOptions = defaultAccountOptionsRes.getData();

        // Cash flow
        const cashFlowOptionsRes = await getOptionsCommon({ type: 'cashFlow' });
        if (cashFlowOptionsRes.isFailed()) {
            throw cashFlowOptionsRes;
        }
        const cashFlowOptions = cashFlowOptionsRes.getData();

        let sheet = excelHelper.addWorksheet(
            new xl.Workbook(),
            'DANH SÁCH DÒNG TIỀN',
            'Danh sách dòng tiền',
            [
                {
                    width: 7,
                    title: 'STT',
                    formatter: (_, index) => index + 1,
                },
                {
                    width: 17,
                    title: 'Mã dòng tiền*',
                    field: 'cash_flow_code',
                },
                {
                    width: 30,
                    title: 'Tên dòng tiền*',
                    field: 'cash_flow_name',
                },
                {
                    width: 50,
                    title: 'Công ty áp dụng*',
                    field: 'company_id',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách công ty'!$C$2:$C$${1 + companyOptions?.length}`],
                    },
                },
                {
                    width: 30,
                    title: 'Tài khoản kế toán ngầm định',
                    field: 'implicit_account_id',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách tài khoản kế toán'!$C$2:$C$${1 + defaultAccountOptions?.length}`],
                    },
                },
                {
                    width: 30,
                    title: 'Thuộc dòng tiền',
                    field: 'parent_id',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: [`='Danh sách dòng tiền cha'!$C$2:$C$${1 + cashFlowOptions?.length}`],
                    },
                },
                {
                    width: 30,
                    title: 'Loại dòng tiền',
                    field: 'cash_flow_type',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: ['1-Loại thu, 2-Loại chi'],
                    },
                },
                {
                    width: 50,
                    title: 'Diễn giải',
                    field: 'description',
                },
                {
                    width: 50,
                    title: 'Ghi chú',
                    field: 'note',
                },
                {
                    width: 13,
                    title: 'Trạng thái',
                    field: 'is_active',
                    validate: {
                        type: 'list',
                        allowBlank: true,
                        prompt: 'Chọn giá trị',
                        error: 'Giá trị không hợp lệ',
                        showDropDown: true,
                        formulas: ['1-Kích hoạt, 0-Ẩn'],
                    },
                },
            ],
            [
                {
                    cash_flow_code: 'Nhập mã dòng tiền',
                    cash_flow_name: 'Nhập tên dòng tiền',
                    company_id: 'Chọn công ty áp dụng',
                    implicit_account_id: 'Chọn tài khoản kế toán ngầm định',
                    parent_id: 'Chọn dòng tiền cha',
                    cash_flow_type: '1-Loại thu',
                    description: 'Nhập diễn giải',
                    note: 'Nhập ghi chú',
                    is_active: '1-Kích hoạt',
                },
            ],
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            null,
            'Danh sách công ty',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 30,
                    title: 'Tên công ty',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.name}`,
                },
            ],
            companyOptions,
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            null,
            'Danh sách tài khoản kế toán',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 30,
                    title: 'Danh sách tài khoản kế toán',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.name}`,
                },
            ],
            defaultAccountOptions,
        );

        sheet = excelHelper.addWorksheet(
            sheet,
            null,
            'Danh sách dòng tiền cha',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 30,
                    title: 'Tên dòng tiền',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Option values',
                    formatter: (row, index) => `${row.id}-${row.name}`,
                },
            ],
            cashFlowOptions,
        );

        return new ServiceResponse(true, '', sheet);
    } catch (error) {
        logger.error(error, { function: 'CashFlowService.downloadTemplateCashFlow' });
        return new ServiceResponse(false, error);
    }
};

const checkCashFlowImport = (cashFlow, pool = null) => {
    let errmsg = [];
    let {
        cash_flow_code = null,
        cash_flow_name = null,
        company_id,
        implicit_account_id,
        parent_id,
        cash_flow_type,
        description,
        note,
        is_active = null,
    } = cashFlow || {};

    company_id = company_id ? parseInt(company_id.split('-')[0]) : null;
    implicit_account_id = implicit_account_id ? parseInt(implicit_account_id.split('-')[0]) : null;
    parent_id = parent_id ? parseInt(parent_id.split('-')[0]) : null;
    cash_flow_type = cash_flow_type ? parseInt(cash_flow_type.split('-')[0]) : 1;
    is_active = is_active ? parseInt(is_active.split('-')[0]) === 1 : true;

    if (!cash_flow_code) errmsg.push('Mã dòng tiền là bắt buộc');
    if (!cash_flow_name) errmsg.push('Tên dòng tiền là bắt buộc');
    if (!company_id || company_id <= 0) errmsg.push('Công ty là bắt buộc');

    let item = {
        ...cashFlow,
        cash_flow_code,
        cash_flow_name,
        company_id: company_id || null,
        implicit_account_id: implicit_account_id || null,
        parent_id: parent_id || null,
        cash_flow_type,
        description,
        note,
        is_active,
    };

    return { errmsg, item };
};

const importExcelCashFlow = async (body, file, auth) => {
    try {
        const auth_name = apiHelper.getValueFromObject(auth, 'user_name');
        const rows = await readXlsxFile(file.buffer);
        const columns = {
            stt: 'STT',
            cash_flow_code: 'Mã dòng tiền*',
            cash_flow_name: 'Tên dòng tiền*',
            company_id: 'Công ty áp dụng*',
            implicit_account_id: 'Tài khoản kế toán ngầm định',
            parent_id: 'Thuộc dòng tiền',
            cash_flow_type: 'Loại dòng tiền',
            description: 'Diễn giải',
            note: 'Ghi chú',
            is_active: 'Trạng thái',
        };
        let data = excelHelper.getValueExcel(rows, columns);
        let pool = await mssql.pool;
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        for (let i = 0; i < data.length; i++) {
            import_total += 1;
            let cashFlow = data[i];
            let { errmsg, item } = checkCashFlowImport(cashFlow, pool);

            if (errmsg && errmsg.length > 0) {
                import_errors.push({
                    cashFlow,
                    errmsg,
                    i,
                });
            } else {
                try {
                    let res = await createOrUpdateCashFlow({ ...item, auth_name });
                    if (res.isFailed()) {
                        import_errors.push({
                            cashFlow,
                            errmsg: [res.getMessage()],
                            i,
                        });
                    }
                    import_data.push(res.getData());
                } catch (error) {
                    import_errors.push({
                        cashFlow,
                        errmsg: [error.message],
                        i,
                    });
                }
            }
        }

        return new ServiceResponse(true, '', { import_data, import_total, import_errors });
    } catch (e) {
        logger.error(e, { function: 'AccountingAccountService.importExcel' });
        return new ServiceResponse(false, error);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.FI_CASHFLOW_OPTIONS);
};

module.exports = {
    getCashFlowList,
    createOrUpdateCashFlow,
    cashFlowDetail,
    deleteCashFlow,
    exportExcelCashFlow,
    downloadTemplateCashFlow,
    importExcelCashFlow,
};
