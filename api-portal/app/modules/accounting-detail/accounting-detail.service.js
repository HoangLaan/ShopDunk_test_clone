const sql = require('mssql');
const mssql = require('../../models/mssql');

const moment = require('moment');
const API_CONST = require('../../common/const/api.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const xl = require('excel4node');
const pdfHelper = require('../../common/helpers/pdf.helper');
const moduleClass = require('./accounting-detail.class');
const { formatCurrency } = require('../../common/helpers/numberFormat');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const isMerge = apiHelper.getValueFromObject(queryParams, 'is_merge');
        const isViewPreviousAccounting = apiHelper.getValueFromObject(queryParams, 'view_previous_accounting');
        const created_date_from = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const created_date_to = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('TYPEACCOUNT', apiHelper.getValueFromObject(queryParams, 'type_account'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('CREATEDDATEFROM', created_date_from)
            .input('CREATEDDATETO', created_date_to)
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(queryParams, 'payment_form_id'))
            .execute(
                parseInt(isMerge) === 1
                    ? 'AC_ACCOUNTING_DETAIL_GetListMerge_AdminWeb'
                    : 'AC_ACCOUNTING_DETAIL_GetList_AdminWeb',
            );

        const listAccounting = moduleClass.list(data.recordset);

        if (currentPage > 1) {
            const totalPrevious = await calTotalPreviousPage(queryParams);
            listAccounting.unshift({
                is_sum_record: true,
                arise_debit: totalPrevious,
                arise_credit: totalPrevious,
                explain: 'Tổng số tiền trang trước',
            });
        }

        if (parseInt(isViewPreviousAccounting)) {
            const { credit_money, debit_money } = await getSumRecord({
                created_date_to: created_date_from,
            });
            listAccounting.unshift({
                is_sum_record: true,
                arise_debit: debit_money,
                arise_credit: credit_money,
                explain: 'Lũy kế kỳ trước chuyển sang',
            });
        }

        return new ServiceResponse(true, '', {
            data: listAccounting,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'AccountingDetailService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const calTotalPreviousPage = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('TYPEACCOUNT', apiHelper.getValueFromObject(queryParams, 'type_account'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .execute('AC_ACCOUNTING_DETAIL_GetTotalPrevious_AdminWeb');

        return responseData.recordset[0]?.TOTALCREDIT ?? 0;
    } catch (e) {
        logger.error(e, { function: 'AccountingDetailService.calTotalPreviousPage' });
        return new ServiceResponse(false, e.message);
    }
};

const getSumRecord = async (queryParams = {}) => {
    try {
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .execute('AC_ACCOUNTING_DETAIL_GetSumRecord_AdminWeb');
        const sumRecord = data.recordset[0];

        return {
            debit_money: sumRecord?.DEBITMONEY,
            credit_money: sumRecord?.CREDITMONEY,
        };
    } catch (e) {
        logger.error(e, { function: 'AccountingDetailService.getSumRecord' });
        return null;
    }
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('ACCOUNTINGDETAILID', id)
            .execute('AC_ACCOUNTING_DETAIL_GetById_AdminWeb');

        let accountingDetail = responseData.recordset[0] || {};

        return new ServiceResponse(true, '', moduleClass.detail(accountingDetail));
    } catch (e) {
        logger.error(e, { function: 'AccountingDetailService.getDetail' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const serviceRes = await getList(queryParams);
        const { data } = serviceRes.getData();
        // add sum record
        data.push({
            accounting_date: 'Tổng cộng',
            arise_debit: data.reduce((acc, cur) => (acc += parseFloat(cur.arise_debit ?? 0)), 0),
            arise_credit: data.reduce((acc, cur) => (acc += parseFloat(cur.arise_credit ?? 0)), 0),
        });
        const workbook = await _exportExcelFile(data, queryParams);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'AccountingDetailService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFile = async (data, queryParams = {}) => {
    const workbook = new xl.Workbook();

    const workSheet = workbook.addWorksheet('Bảng hạch toán');

    const config = [
        {
            key: 'accounting_date',
            title: 'Ngày hạch toán',
        },
        {
            key: '',
            title: 'Chứng từ',
            children: [
                {
                    key: 'code',
                    title: 'Số hiệu',
                },
                {
                    key: 'origin_date',
                    title: 'Ngày, tháng',
                },
            ],
        },
        {
            key: 'explain',
            title: 'Diễn giải',
            width: 50,
            increase: 1, // Công thêm vì cột `Chứng từ` đã lấy mất vị trí
        },
        {
            key: 'account_number',
            title: 'TK',
            increase: 1,
        },
        {
            key: 'reciprocalacc',
            title: 'TK đối ứng',
            increase: 1,
        },
        {
            key: '',
            title: 'Số phát sinh',
            children: [
                {
                    key: 'arise_debit',
                    title: 'Nợ',
                    isNumber: true,
                    increase: 1,
                },
                {
                    key: 'arise_credit',
                    title: 'Có',
                    isNumber: true,
                    increase: 1,
                },
            ],
            increase: 1,
        },
    ];

    _createTableData(workSheet, config, data, false, 1, 20, queryParams);

    return workbook;
};

const _createTemplateHeaderExcel = (ws, { from_date = '...', to_date = '...' } = {}) => {
    const headerStyle = {

        // fill: {
        //     type: 'pattern',
        //     patternType: 'solid',
        //     bgColor: '#d7d9db', // gray color
        //     fgColor: '#d7d9db', // gray color
        // },
        font: { bold: true },
    };
    ws.cell(1, 1)
        .string('Đơn vị: Công ty Cổ phần Hesman Việt Nam')
        .style({
            ...headerStyle,
        });
    ws.cell(2, 1)
        .string('Địa chỉ: 76 Thái Hà, Phường Trung Liệt, Quận Đống Đa, Thành phố Hà Nội')
        .style({
            ...headerStyle,
        });

    ws.column(4).setWidth(50);

    ws.cell(1, 5, 1, 10, true)
        .string('Mẫu sổ S03a-DN')
        .style({
            ...headerStyle,
            alignment: { horizontal: 'center' },
        });
    ws.cell(2, 5, 2, 10, true)
        .string('(Ban hành theo Thông tư số 200/2014/TT-BTC')
        .style({
            ...headerStyle,
            alignment: { horizontal: 'center' },
            font: { italic: true },
        });
    ws.cell(3, 5, 3, 10, true)
        .string('Ngày 22/12/2014 của Bộ Tài chính)')
        .style({
            ...headerStyle,
            alignment: { horizontal: 'center' },
            font: { italic: true },
        });

    ws.cell(4, 1, 4, 10, true)
        .string('SỔ NHẬT KÝ CHUNG')
        .style({
            ...headerStyle,
            alignment: { horizontal: 'center' },
        });
    ws.cell(5, 1, 5, 10, true)
        .string(`Từ ngày ${from_date} đến ngày ${to_date}`)
        .style({
            ...headerStyle,
            alignment: { horizontal: 'center' },
        });
    ws.cell(6, 8)
        .string('Đơn vị tính:VND')
        .style({
            ...headerStyle,
            font: { italic: true },
        });
};

const _createTableData = (ws, configs, data, isNumbered = false, startCol = 1, defaultWidth = 20, queryParams = {}) => {
    const rowStart = 6;
    _createTemplateHeaderExcel(ws, { from_date: queryParams.created_date_from, to_date: queryParams.created_date_to });
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

    // ws.cell(row, column, merge theo chiều dọc, merge ô theo chiều ngang tính từ column, có merge ô ko)
    // create head row
    configs.forEach((config, index) => {
        if (config.children?.length > 0) {
            const increase = config.increase ?? 0;
            // create parent header
            ws.cell(
                1 + rowStart,
                index + startCol + increase,
                1 + rowStart,
                config.children.length + index + startCol + increase - 1,
                true,
            )
                .string(config.required ? `${config.title} *`.toUpperCase() : config.title.toUpperCase())
                .style({
                    ...borderStyle,
                    ...headerStyle,
                });

            // create child header
            let indexChild = 0;
            for (const configChild of config.children) {
                const increase = config.increase ?? 0;
                ws.cell(2 + rowStart, index + startCol + indexChild + increase)
                    .string(
                        configChild.required ? `${configChild.title} *`.toUpperCase() : configChild.title.toUpperCase(),
                    )
                    .style({
                        ...borderStyle,
                        ...headerStyle,
                    });
                indexChild++;
            }
        } else {
            const increase = config.increase ?? 0;
            ws.cell(1 + rowStart, index + startCol + increase, 2 + rowStart, 0, true)
                .string(config.required ? `${config.title} *`.toUpperCase() : config.title.toUpperCase())
                .style({
                    ...borderStyle,
                    ...headerStyle,
                });
        }
    });

    if (data?.length > 1) {
        data.shift()
    }
    // create data rows
    data.forEach((item, indexParent) => {
        let indexRow = indexParent + 3;
        configs.forEach((config, index) => {
            let itemValue = config.isNumberedCol ? index + 1 : item[config.key];
            if (config.children?.length > 0) {
                let indexChild = 0;
                for (const configChild of config.children) {
                    const itemValueChild = item[configChild.key];
                    const increase = config.increase ?? 0;
                    ws.cell(indexRow + rowStart, index + startCol + indexChild + increase)
                    [configChild.isNumber ? 'number' : 'string'](
                        typeof configChild.transform === 'function'
                            ? configChild.transform(itemValueChild)
                            : itemValueChild,
                    )
                        .style(borderStyle);
                    indexChild++;
                }
            } else {
                const increase = config.increase ?? 0;
                ws.cell(indexRow + rowStart, index + startCol + increase)
                [config.isNumber ? 'number' : 'string'](
                    typeof config.transform === 'function' ? config.transform(itemValue) : itemValue,
                )
                    .style(borderStyle);
            }
            // add validation
            // if (config.validation) {
            //     /// find potition of cell to apply validation
            //     config.validation.sqref = `${ALPHABET[indexCol - 2]}2:${ALPHABET[indexCol - 2]}100`;
            //     ws.addDataValidation(config.validation);
            // }
        });
    });
};

const exportPDF = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const serviceRes = await getList(queryParams);
        let { data } = serviceRes.getData();

        const fileName = `so_nhat_ky_chung_${moment().format('DDMMYYYY')}`;

        const print_params = {
            template: `template-accounting.html`,
            data: {
                data: [
                    ...data,
                    {
                        accounting_date: 'Tổng cộng',
                        arise_debit: data.reduce((acc, cur) => (acc += parseFloat(cur.arise_debit ?? 0)), 0),
                        arise_credit: data.reduce((acc, cur) => (acc += parseFloat(cur.arise_credit ?? 0)), 0),
                        sum: true,
                    },
                ].map((item) => ({
                    ...item,
                    arise_debit: formatCurrency(item.arise_debit, 0, ',', ','),
                    arise_credit: formatCurrency(item.arise_credit, 0, ',', ','),
                })),
                printDate: moment().format('DD/MM/YYYY'),
                date_range:
                    queryParams.created_date_from && queryParams.created_date_to
                        ? `Từ ngày ${queryParams.created_date_from} đến ngày ${queryParams.created_date_to}`
                        : '',
                from_date: queryParams.created_date_from,
                printDate: queryParams.created_date_to,
            },
            filename: fileName,
        };

        await pdfHelper.printPDF(print_params);
        return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'AccountingDetailService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

module.exports = {
    getList,
    getDetail,
    exportExcel,
    exportPDF,
    getSumRecord,
};
