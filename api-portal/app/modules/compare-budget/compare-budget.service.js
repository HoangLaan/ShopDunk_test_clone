const mssql = require('../../models/mssql');

const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const moduleClass = require('./compare-budget.class');
let xl = require('excel4node');
const { CurrencyUnitPrice, formatCurrency, CurrencyTotalPrice } = require('../../common/helpers/numberFormat');

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
            .input('DATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('DATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('BUDGETPLANID', apiHelper.getValueFromObject(queryParams, 'budget_plan_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUDGETLEVEL', apiHelper.getValueFromObject(queryParams, 'budget_level', 1))
            .execute('FI_BUDGET_GetCompareList_Adminweb');

        const sumRecord = await getSumTotal(queryParams);

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            sum: moduleClass.sumtotal(sumRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'CompareBudget.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const getSumTotal = async (queryParams = {}) => {
    try {
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('DATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('DATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('BUDGETPLANID', apiHelper.getValueFromObject(queryParams, 'budget_plan_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUDGETLEVEL', apiHelper.getValueFromObject(queryParams, 'budget_level', 1))
            .execute('FI_BUDGET_SumCompareBudget_Adminweb');

        return data.recordset[0];
    } catch (e) {
        logger.error(e, { function: 'CompareBudget.getSumTotal' });
        return {};
    }
};

const getBudgetPlanOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .execute('FI_BUDGET_GetBudgetPlanOptions_Adminweb');

        return new ServiceResponse(true, '', moduleClass.budgetPlanOptions(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'CompareBudget.getBudgetPlanOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        const serviceRes = await getList(queryParams);
        const { data, sum } = serviceRes.getData();
        // add sum record
        data.push({ ...sum, budget_name: `Tổng ngân sách cấp ${sum.budget_level}` });
        const workbook = await _exportExcelFile(data);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'CompareBudget.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFile = async (data) => {
    const workbook = new xl.Workbook();

    const workSheet = workbook.addWorksheet('Bảng so sánh ngân sách');

    const config = [
        {
            key: 'budget_code',
            title: 'Mã ngân sách',
        },
        {
            key: 'budget_name',
            title: 'Tên ngân sách',
            width: 30,
        },
        {
            key: 'total_budget_plan',
            title: 'Ngân sách ban đầu',
            width: 30,
        },
        {
            key: 'total_budget_to',
            title: 'Ngân sách chuyển đến',
            width: 30,
        },
        {
            key: 'total_budget_from',
            title: 'Ngân sách chuyển đi',
            width: 30,
        },
        {
            key: 'total_budget_used',
            title: 'Ngân sách đã sử dụng',
            width: 30,
        },
        {
            key: 'remaining_budget',
            title: 'Ngân sách còn lại',
            width: 30,
        },
    ];

    // calculate remaining budget
    data = data.map((budget) => ({
        ...budget,
        total_budget_plan: CurrencyUnitPrice(budget.total_budget_plan),
        total_budget_to: CurrencyUnitPrice(budget.total_budget_to),
        total_budget_from: CurrencyUnitPrice(budget.total_budget_from),
        total_budget_used: CurrencyUnitPrice(budget.total_budget_used),
        remaining_budget: CurrencyUnitPrice(
            budget.total_budget_plan + budget.total_budget_to - budget.total_budget_from - budget.total_budget_used,
        ),
    }));

    _createTableData(workSheet, config, data, true);

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
                .string((typeof config.transform === 'function' ? config.transform(itemValue) : itemValue)?.toString())
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

module.exports = {
    getList,
    exportExcel,
    getBudgetPlanOptions,
};
