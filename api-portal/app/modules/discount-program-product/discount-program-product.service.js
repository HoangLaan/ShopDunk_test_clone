const ModuleClass = require('./discount-program-product.class');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
let xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const { changeToSlug } = require('../../common/helpers/string.helper');
const optionService = require('../../common/services/options.service');
const _ = require('lodash');
const sql = require('mssql');
const { formatCurrency } = require('../../common/helpers/numberFormat');

const getList = async (params = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('DISCOUNTPROGRAMID', apiHelper.getValueFromObject(params, 'discount_program_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(params, 'product_id'))
            .input('MODELID', apiHelper.getValueFromObject(params, 'model_id'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(params, 'product_category_id'))
            .input('APPLYDATEFROM', apiHelper.getValueFromObject(params, 'apply_date_from', null))
            .input('APPLYDATETO', apiHelper.getValueFromObject(params, 'apply_date_to', null))
            .execute('PO_DISCOUNTPROGRAMPRODUCT_GetList_AdminWeb');

        return {
            list: ModuleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            sum: data.recordsets?.[1]?.[0]?.SUM,
        };
    } catch (error) {
        logger.error(error, { function: 'discountProgramProductService.getList' });
        return [];
    }
};

const getDetailProduct = async (params = {}) => {
    try {
        console.log(apiHelper.getValueFromObject(params, 'month'));
        console.log(apiHelper.getValueFromObject(params, 'year'));
        console.log(apiHelper.getValueFromObject(params, 'discount_program_id'));
        console.log(apiHelper.getValueFromObject(params, 'product_id'));

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('YEAR', apiHelper.getValueFromObject(params, 'year'))
            .input('MONTH', apiHelper.getValueFromObject(params, 'month'))
            .input('DISCOUNTPROGRAMID', apiHelper.getValueFromObject(params, 'discount_program_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(params, 'product_id'))
            .execute('PO_DISCOUNTPROGRAMPRODUCT_GetDetailList_AdminWeb');

        return new ServiceResponse(true, '', ModuleClass.productDetail(data.recordset));
    } catch (error) {
        logger.error(error, { function: 'discountProgramProductService.getDetailProduct' });
        return [];
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        const res = await getList(queryParams);
        let { list: data, sum } = res || {};

        data?.forEach((product) => {
            product.apply_range = `${product.from_date} - ${product.to_date}`;
        });

        data = data.reduce((acc, product, index) => {
            // insert start group when loop over first item
            if (index === 0) {
                acc.push({
                    record_type: 'START',
                    style: {
                        fill: {
                            type: 'pattern',
                            patternType: 'solid',
                            bgColor: 'orange', // gray color
                            fgColor: 'orange', // gray color
                        },
                    },
                    time: product.month + '/' + product.year,
                    month: product.month,
                    year: product.year,
                    index: `Tháng ${product.month + '/' + product.year}`,
                });
            }

            const lastItem = acc[acc.length - 1];
            if (lastItem.month === product.month && lastItem.year === product.year) {
                acc.push({
                    ...product,
                    index: index + 1,
                });
            } else {
                // end of previous group
                acc.push({
                    record_type: 'SUM',
                    time: lastItem.month + '/' + lastItem.year,
                    month: lastItem.month,
                    year: lastItem.year,
                    index: `Tổng tháng ${lastItem.month + '/' + lastItem.year}`,
                    discount_money: acc?.reduce(
                        (total, item) =>
                            item?.month === lastItem.month && item?.year === lastItem.year
                                ? total + (item.discount_money || 0)
                                : total,
                        0,
                    ),
                });
                // start of current group
                acc.push({
                    record_type: 'START',
                    style: {
                        fill: {
                            type: 'pattern',
                            patternType: 'solid',
                            bgColor: 'orange', // gray color
                            fgColor: 'orange', // gray color
                        },
                    },
                    time: product.month + '/' + product.year,
                    month: product.month,
                    year: product.year,
                    index: `Tháng ${product.month + '/' + product.year}`,
                });
                acc.push({
                    ...product,
                    index: index + 1,
                });
            }

            // insert end group when loop over last item
            if (index === data.length - 1) {
                acc.push({
                    record_type: 'SUM',
                    time: product.month + '/' + product.year,
                    month: product.month,
                    year: product.year,
                    index: `Tổng tháng ${product.month + '/' + product.year}`,
                    discount_money: acc?.reduce(
                        (total, item) =>
                            item?.month === product.month && item?.year === product.year
                                ? total + (item.discount_money || 0)
                                : total,
                        0,
                    ),
                });
            }

            return acc;
        }, []);

        data.push({
            index: 'Tổng cộng',
            discount_money: sum,
        });

        const workbook = await _exportExcelFile(data);
        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'discountProgramProductService.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const getManufacturerOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('MD_MANUFACTURER', params);
        return new ServiceResponse(true, 'Lấy danh sách sản phẩm thành công', serviceRes.getData());
    } catch (error) {
        logger.error(error, { function: 'discountProgramProductService.getManufacturerOptions' });
        return [];
    }
};

const getProductOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const productRecord = await pool
            .request()
            .input('MODELID', apiHelper.getValueFromObject(params, 'model_id'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(params, 'product_category_id'))
            .execute('MD_PRODUCT_GetOptions_AdminWeb');

        const productList = ModuleClass.productOptions(productRecord.recordset);

        return new ServiceResponse(true, 'Lấy danh sách sản phẩm thành công', productList);
    } catch (error) {
        logger.error(error, { function: 'discountProgramProductService.getProductOptions' });
        return [];
    }
};

const _exportExcelFile = async (data) => {
    const workbook = new xl.Workbook();

    const BUDGET_SHEETS_NAME = 'Bảng theo dõi thưởng chiết khấu';
    const WorkSheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    const columns = [
        {
            key: 'index',
            title: 'STT',
        },
        {
            key: 'product_code',
            title: 'Mã sản phẩm',
            required: true,
        },
        {
            key: 'product_name',
            title: 'Tên sản phẩm',
            width: 70,
        },
        {
            key: 'category_name',
            title: 'Ngành hàng',
            width: 50,
        },
        {
            key: 'model_name',
            title: 'Model',
        },
        {
            key: 'apply_range',
            title: 'Thời gian áp dụng',
            width: 50,
        },
        {
            key: 'discount_program_name',
            title: 'Thuộc chương trình chiết khấu',
            width: 50,
        },
        {
            key: 'quantity',
            title: 'Số lượng',
        },
        {
            key: 'discount_money',
            title: 'Số tiền thưởng dự tính',
            width: 40,
            transform: (val) => (val ? formatCurrency(Math.round(val), 0) : ''),
        },
    ];

    const NUMBERED = false;
    _createTableData(WorkSheet, columns, data, NUMBERED);

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
                .style({ ...borderStyle, ...(item.style || {}) });
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
    getManufacturerOptions,
    getProductOptions,
    getDetailProduct,
};
