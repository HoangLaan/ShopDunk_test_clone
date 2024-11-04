const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const profitLossClass = require('./profit-loss.class');
const API_CONST = require('../../common/const/api.const');
let xl = require('excel4node');
const sql = require('mssql');
const _ = require('lodash');
const { formatCurrency } = require('../../common/helpers/numberFormat');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('DISCOUNTPROGRAMIDS', apiHelper.getValueFromObject(queryParams, 'discount_program_ids', null))
            .input('PRODUCTIDS', apiHelper.getValueFromObject(queryParams, 'product_ids', null))
            .execute('PROFITLOSS_GetList_AdminWeb');

        let result = data.recordset;

        // parse data
        const resultList = profitLossClass.list(result)?.map((item) => ({
            ...item,
            discount_programs: item?.discount_programs ? JSON.parse(item?.discount_programs) : [],
        }));

        return new ServiceResponse(true, '', {
            data: resultList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, { function: 'profitLossService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getHistoryList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('DISCOUNTPROGRAMIDS', apiHelper.getValueFromObject(queryParams, 'discount_program_ids', null))
            .input('PRODUCTIDS', apiHelper.getValueFromObject(queryParams, 'product_ids', null))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .execute('PO_MODELCACULATION_GetList_AdminWeb');

        let result = data.recordset;

        // parse data
        const resultList = profitLossClass.historyList(result)?.map((item) => ({
            ...item,
            discount_programs: item?.discount_programs ? JSON.parse(item?.discount_programs) : [],
        }));

        const discountPrograms = resultList?.reduce((acc, product) => {
            const programs = product.discount_programs;
            programs.forEach((program) => {
                const existedProgram = acc?.find((_) => _.discount_program_id === program.discount_program_id);
                if (!existedProgram) {
                    acc.push({
                        discount_program_id: program.discount_program_id,
                        discount_program_name: program.discount_program_name,
                    });
                }
            });

            return acc;
        }, []);

        return new ServiceResponse(true, '', {
            data: resultList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
            programs: discountPrograms,
        });
    } catch (error) {
        logger.error(error, { function: 'profitLossService.getHistoryList' });
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    const id_list = [];
    try {
        const list = apiHelper.getValueFromObject(bodyParams, 'list', '')?.filter((_) => _.profit_price) || [];

        for (let item of list) {
            const createdUser = apiHelper.getValueFromObject(bodyParams, 'auth_name');

            const request = new sql.Request(transaction);
            const data = await request
                .input('MODELCACULATIONID', apiHelper.getValueFromObject(item, 'model_caculation_id'))
                .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                .input('LISTEDPRICEFULLVAT', apiHelper.getValueFromObject(item, 'full_price'))
                .input('P1SUBTRACTVAT', apiHelper.getValueFromObject(item, 'p1_vat'))
                .input('REBATE', apiHelper.getValueFromObject(item, 'rebate_value'))
                .input('NETSUBTRACTVAT', apiHelper.getValueFromObject(item, 'net_vat_price'))
                .input('NETFULLVAT', apiHelper.getValueFromObject(item, 'net_price_full_vat'))
                .input('SUGGESTEDPRICE', apiHelper.getValueFromObject(item, 'suggested_price'))
                .input('EXPECTEDPROFITPERCENTAGE', apiHelper.getValueFromObject(item, 'profit_percent'))
                .input('EXPECTEDPROFITMONEY', apiHelper.getValueFromObject(item, 'profit_price'))
                .input('CREATEDUSER', createdUser)
                .execute('PO_MODELCACULATION_CreateOrUpdate_AdminWeb');

            const calculationId = data.recordset[0].RESULT;
            if (!calculationId) {
                throw new Error('Create Model Calculation Failed !');
            } else {
                id_list.push(calculationId);
            }

            // insert discount program values
            const programList = item.discount_programs;

            for (let program of programList) {
                const programId = apiHelper.getValueFromObject(program, 'discount_program_id');
                const request = new sql.Request(transaction);
                const data = await request
                    .input('MODELCACULATIONDISCOUNTID', apiHelper.getValueFromObject(program, 'model_caculation_id'))
                    .input('DISCOUNTPROGRAMID', programId)
                    .input('ESTIMATEDDISCOUNTVALE', apiHelper.getValueFromObject(item, `dynamic_column_${programId}`))
                    .input('CREATEDUSER', createdUser)
                    .input('MODELCACULATIONID', calculationId)
                    .execute('PO_MODELCACULATION_DISCOUNT_CreateOrUpdate_AdminWeb');
                const discountId = data.recordset[0].RESULT;
                if (!discountId) {
                    throw new Error('Create Model Calculation Failed !');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', id_list);
    } catch (e) {
        logger.error(e, { function: 'ProfitLossService.createOrUpdate' });
        await transaction.rollback();
        return new ServiceResponse(false);
    }
};

const exportExcel = async (bodyParams = {}) => {
    try {
        const data = apiHelper.getValueFromObject(bodyParams, 'list', '')?.filter((_) => _.profit_price) || [];
        const programs = apiHelper.getValueFromObject(bodyParams, 'programs');
        const workbook = await _exportListExcelFile(data, programs);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ProfitLossService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const exportHistoryExcel = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const res = await getHistoryList(queryParams);
        const { data, programs } = res.getData() || {};
        const workbook = await _exportHistoryExcelFile(data, programs);
        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ProfitLossService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportListExcelFile = async (data, programs) => {
    const workbook = new xl.Workbook();

    const BUDGET_SHEETS_NAME = 'Bảng tính lãi lỗ Model';
    const WorkSheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    const configHead = [
        {
            key: 'product_code',
            title: 'Mã sản phẩm',
            required: true,
        },
        {
            key: 'product_name',
            title: 'Tên sản phẩm',
            width: 60,
        },
        {
            key: 'full_price',
            title: 'Giá NY Full Vat (P3)',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'p1_vat',
            title: 'P1-VAT',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'rebate_value',
            title: 'Rebate 1.5% (*P1)',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
    ];

    const configDymamic =
        programs?.map((program) => {
            return {
                key: `dynamic_column_${program.value}`,
                title: program.label,
                transform: (val) => (val || val === 0 ? formatCurrency(Math.round(val), 0) : 'Không áp dụng'),
                width: 40,
            };
        }) || [];

    const configLast = [
        {
            key: 'net_vat_price',
            title: 'Net - VAT',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'net_price_full_vat',
            title: 'Giá Net Full VAT',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'suggested_price',
            title: 'Giá bán đề xuất',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'profit_percent',
            title: 'Lợi nhuận',
            transform: (val) => `${val} %`,
        },
        {
            key: 'profit_price',
            title: 'Số tiền lợi nhuận dự kiến',
            width: 40,
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
    ];

    const configs = [...configHead, ...configDymamic, ...configLast];

    const NUMBERED = true;
    _createTableData(WorkSheet, configs, data, NUMBERED);

    return workbook;
};

const _exportHistoryExcelFile = async (data, programs) => {
    const workbook = new xl.Workbook();

    const BUDGET_SHEETS_NAME = 'Lịch sử tính lãi lỗ Model';
    const WorkSheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    const configHead = [
        {
            key: 'product_code',
            title: 'Mã sản phẩm',
            required: true,
        },
        {
            key: 'product_name',
            title: 'Tên sản phẩm',
            width: 60,
        },
        {
            key: 'listed_price_full_vat',
            title: 'Giá NY Full Vat (P3)',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'p1_subtract_vat',
            title: 'P1-VAT',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'rebate',
            title: 'Rebate 1.5% (*P1)',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
    ];

    const configDymamic =
        programs?.map((program) => {
            return {
                key: 'discount_programs',
                title: program.discount_program_name,
                transform: (programs) => {
                    const targetProgram = programs?.find((_) => _.discount_program_id === program.discount_program_id);
                    return targetProgram
                        ? formatCurrency(Math.round(targetProgram?.estimated_discount_value || 0), 0)
                        : 'Không áp dụng';
                },
                width: 40,
            };
        }) || [];

    const configLast = [
        {
            key: 'net_subtract_vat',
            title: 'Net - VAT',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'net_full_vat',
            title: 'Giá Net Full VAT',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'suggested_price',
            title: 'Giá bán đề xuất',
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'expected_profit_percentage',
            title: 'Lợi nhuận',
            transform: (val) => `${val} %`,
        },
        {
            key: 'expected_profit_money',
            title: 'Số tiền lợi nhuận dự kiến',
            width: 40,
            transform: (val) => formatCurrency(Math.round(val), 0),
        },
        {
            key: 'created_user',
            title: 'Người thực hiện tính',
            width: 40,
        },
        {
            key: 'created_date',
            title: 'Thời gian tính',
        },
    ];

    const configs = [...configHead, ...configDymamic, ...configLast];

    const NUMBERED = true;
    _createTableData(WorkSheet, configs, data, NUMBERED);

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

module.exports = {
    getList,
    createOrUpdate,
    exportExcel,
    getHistoryList,
    exportHistoryExcel,
};
