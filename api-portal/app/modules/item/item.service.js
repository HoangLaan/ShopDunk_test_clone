const lodash = require('lodash');
const mssql = require('../../models/mssql');
let xl = require('excel4node');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const API_CONST = require('../../common/const/api.const');
const optionService = require('../../common/services/options.service');
const readXlsxFile = require('read-excel-file/node');

const moduleClass = require('./item.class');
const { changeToSlug } = require('../../common/helpers/string.helper');
const { getOptionsCommon } = require('../global/global.service');

const getListItem = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .input('ISBUDGETCREATION', apiHelper.getValueFromObject(queryParams, 'is_budget_creation'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.FI_ITEM_GETLIST_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'ItemService.getListItem' });
        return new ServiceResponse(true, '', []);
    }
};

const getListIncludeChild = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('ISBUDGETCREATION', apiHelper.getValueFromObject(queryParams, 'is_budget_creation'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.FI_ITEM_GETLISTINCLUDECHILD_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'ItemService.getListItem' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdateItem = async (bodyParams) => {
    try {
        const pool = await mssql.pool;

        const item_id = apiHelper.getValueFromObject(bodyParams, 'item_id');
        const item_code = apiHelper.getValueFromObject(bodyParams, 'item_code');

        const isExistedItem = await checkExistItemCode(item_code, item_id);

        if (isExistedItem) {
            return new ServiceResponse(false, 'Mã khoản mục đã tồn tại', null);
        }

        const resCreateOrUpdateItem = await pool
            .request()
            .input('ITEMID', item_id)
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ITEMNAME', apiHelper.getValueFromObject(bodyParams, 'item_name'))
            .input('ITEMCODE', item_code)
            .input('BUDGETID', apiHelper.getValueFromObject(bodyParams, 'budget_id'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))

            .input('ISBUDGETCREATION', apiHelper.getValueFromObject(bodyParams, 'is_budget_creation'))
            .input('ISBUDGETADJUSTMENT', apiHelper.getValueFromObject(bodyParams, 'is_budget_adjustment'))

            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))

            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .execute(PROCEDURE_NAME.FI_ITEM_CREATEORUPDATE_ADMINWEB);

        const itemId = resCreateOrUpdateItem.recordset[0].RESULT;

        if (!itemId || itemId <= 0) {
            return new ServiceResponse(false, 'Tạo khoản mục thất bại', null);
        }

        return new ServiceResponse(true, '', itemId);
    } catch (error) {
        logger.error(error, { Task: 'ItemService.createOrUpdateItem' });

        return new ServiceResponse(false, error.message);
    }
};

const checkExistItemCode = async (itemCode, itemId = null) => {
    const pool = await mssql.pool;

    const res = await pool
        .request()
        .input('ITEMCODE', itemCode)
        .input('ITEMID', itemId)
        .execute(PROCEDURE_NAME.FI_ITEM_CHECKITEMCODE_ADMINWEB);

    let { check_code = 0 } = res.recordset[0] || {};

    return check_code;
};

const getDetailItem = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool.request().input('ITEMID', id).execute(PROCEDURE_NAME.FI_ITEM_GETBYID_ADMINWEB);

        let item = responseData.recordset[0];

        if (item) {
            item = moduleClass.detail(item);

            return new ServiceResponse(true, '', item);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'ItemService.getDetailItem' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteListItem = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'ITEMID')
            .input('TABLENAME', 'FI_ITEM')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CBO_COMMON_SOFTDELETE);

        return new ServiceResponse(true, '', data);
    } catch (e) {
        logger.error(e, { function: 'ItemService.deleteListItem' });

        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARENTID', apiHelper.getValueFromObject(params, 'parent_id'))
            .execute(PROCEDURE_NAME.FI_ITEM_GETPARENTOPTIONS_ADMINWEB);

        return new ServiceResponse(true, '', moduleClass.parentOptions(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'ItemServices.getOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const serviceRes = await getListIncludeChild(queryParams);
        const { data: itemsData } = serviceRes.getData();
        const workbook = await _exportExcelFile(itemsData);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ItemServices.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const downloadExcel = async () => {
    try {
        const demoData = [
            {
                item_id: 1,
                item_code: 'testcode',
                item_name: 'Tên khoản mục mẫu',
                company_id: 1,
                company_name: 'Công ty Blackwind',
                is_budget_creation: 1,
                is_budget_adjustment: 1,
                is_active: 1,
                budget_id: 2,
                parent_id: 1,
                parent_item_name: 'Khoản mục cha',
            },
        ];

        const workbook = await _exportExcelFile(demoData);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'ItemServices.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const importExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        const rows = await readXlsxFile(pathUpload);
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        for (let i in rows) {
            // Bỏ qua dòng tiêu đề đầu
            if (i > 0 && rows[i]) {
                import_total += 1;

                let stt = rows[i][0] || '';
                let item_code = `${rows[i][1] || ''}`.trim();
                let item_name = `${rows[i][2] || ''}`.trim();
                let company_name = `${rows[i][3] || ''}`.trim();
                let parent_item_name = `${rows[i][4] || ''}`.trim();
                let budget_code = `${rows[i][5] || ''}`.trim();
                let is_budget_creation = `${rows[i][6] || ''}`.trim();
                let is_budget_adjustment = `${rows[i][7] || ''}`.trim();
                let description = `${rows[i][8] || ''}`.trim();
                let note = `${rows[i][9] || ''}`.trim();
                let is_active = `${rows[i][12]}`.trim();

                let item_import = {
                    stt,
                    item_code,
                    item_name,
                    company_name,
                    parent_item_name,
                    budget_code,
                    is_budget_creation,
                    is_budget_adjustment,
                    description,
                    note,
                    is_active,
                };

                let { errmsg = [], item = {} } = await _checkItemImport(item_import);

                if (errmsg && errmsg.length > 0) {
                    import_errors.push({
                        item,
                        errmsg,
                        i,
                    });
                } else {
                    try {
                        let productId = await _insertItem({ ...item, auth_name });
                        import_data.push(productId);
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
            function: 'ItemService.importExcel',
        });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFile = async (itemsData) => {
    const { data: companyOptions } = await optionService('AM_COMPANY');
    const { data: parentOptions } = await getOptions();
    const { data: budgetOptions } = await getOptionsCommon({ type: 'budget' });

    const workbook = new xl.Workbook();

    // constants
    const START_COMPANY_LIST_COLUMN = 1;
    const START_PARENT_ITEM_LIST_COLUMN = 3;
    const START_BUDGET_LIST_COLUMN = 5;

    const ITEM_SHEETS_NAME = 'Danh sách khoản mục';
    const OPTIONS_SHEETS_NAME = 'options';

    const itemsWorksheet = workbook.addWorksheet(ITEM_SHEETS_NAME);

    const config = [
        {
            key: 'item_code',
            title: 'Mã khoản mục',
            required: true,
        },
        {
            key: 'item_name',
            title: 'Tên khoản mục',
            required: true,
            width: 30,
        },
        {
            key: 'company_name',
            title: 'Tên công ty',
            required: true,
            width: 60,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_COMPANY_LIST_COLUMN, companyOptions.length)],
            },
        },
        {
            key: 'parent_item_code',
            title: 'Khoản mục cha',
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_PARENT_ITEM_LIST_COLUMN, parentOptions.length)],
            },
        },
        {
            key: 'budget_code',
            title: 'Mã ngân sách',
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_BUDGET_LIST_COLUMN, budgetOptions.length)],
            },
        },
        {
            key: 'is_budget_creation',
            title: 'Lập ngân sách',
            transform: (val) => (val ? 'Có' : 'Không'),
        },
        {
            key: 'is_budget_adjustment',
            title: 'ĐC ngân sách',
            transform: (val) => (val ? 'Có' : 'Không'),
        },
        {
            key: 'description',
            title: 'Mô tả',
        },
        {
            key: 'note',
            title: 'Ghi chú',
        },
        {
            key: 'created_user',
            title: 'Người tạo',
        },
        {
            key: 'created_date',
            title: 'Ngày tạo',
        },
        {
            key: 'is_active',
            title: 'Kích hoạt',
            required: true,
            width: 16,
            transform: (val) => (val ? 'Có' : 'Không'),
        },
    ];

    const NUMBERED = true;
    _createTableData(itemsWorksheet, config, itemsData, NUMBERED);

    // create options sheets
    const optionConfig = [
        {
            data: companyOptions,
            dataConfig: [
                {
                    key: 'name',
                    title: 'Công ty',
                    width: 60,
                },
            ],
            startColumn: START_COMPANY_LIST_COLUMN,
        },
        {
            data: parentOptions,
            dataConfig: [
                {
                    key: 'code',
                    title: 'Khoản mục cha',
                    width: 40,
                },
            ],
            startColumn: START_PARENT_ITEM_LIST_COLUMN,
        },
        {
            data: budgetOptions,
            dataConfig: [
                {
                    key: 'code',
                    title: 'Mã ngân sách ',
                    width: 40,
                },
            ],
            startColumn: START_BUDGET_LIST_COLUMN,
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

const _insertItem = async (itemData = {}) => {
    try {
        const pool = await mssql.pool;

        const resCreateOrUpdateItem = await pool
            .request()
            .input('ITEMID', apiHelper.getValueFromObject(itemData, 'item_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(itemData, 'company_id'))
            .input('ITEMNAME', apiHelper.getValueFromObject(itemData, 'item_name'))
            .input('ITEMCODE', apiHelper.getValueFromObject(itemData, 'item_code'))
            .input('BUDGETID', apiHelper.getValueFromObject(itemData, 'budget_id'))
            .input('PARENTID', apiHelper.getValueFromObject(itemData, 'parent_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(itemData, 'description'))
            .input('NOTE', apiHelper.getValueFromObject(itemData, 'note'))

            .input('ISBUDGETCREATION', apiHelper.getValueFromObject(itemData, 'is_budget_creation'))
            .input('ISBUDGETADJUSTMENT', apiHelper.getValueFromObject(itemData, 'is_budget_adjustment'))

            .input('CREATEDUSER', apiHelper.getValueFromObject(itemData, 'auth_name'))

            .input('ISACTIVE', apiHelper.getValueFromObject(itemData, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(itemData, 'is_system'))
            .execute(PROCEDURE_NAME.FI_ITEM_CREATEORUPDATE_ADMINWEB);

        const itemId = resCreateOrUpdateItem.recordset[0].RESULT;

        if (!itemId || itemId <= 0) {
            throw new Error('Thêm mới khoản mục thất bại ');
        }

        return new ServiceResponse(true, '', itemId);
        return new ServiceResponse(true, '', 1);
    } catch (error) {
        throw new Error(error);
    }
};

const _checkItemImport = async (item = {}) => {
    let errmsg = [];
    const arrVal = ['co', 'khong', '1', '0'];
    try {
        const pool = await mssql.pool;

        let {
            item_code,
            item_name,
            company_name,
            parent_item_name,
            budget_code,
            is_budget_creation,
            is_budget_adjustment,
            description,
            note,
            is_active,
        } = item;

        // validate required

        if (!item_code) {
            errmsg.push('Mã khoản mục là bắt buộc.');
        } else {
            const speicalCharRegex = /^[a-zA-Z0-9\s]*$/;
            if (!speicalCharRegex.test(item_code)) {
                errmsg.push('Mã khoản mục không được chứa các ký tự đặt biệt.');
            }
            if (item_code.length > 10) {
                errmsg.push('Mã khoản mục không được quá 10 ký tự.');
            }
        }

        if (!item_name) {
            errmsg.push('Tên khoản mục là bắt buộc.');
        }
        if (!company_name) {
            errmsg.push('Công ty áp dụng là bắt buộc.');
        }

        if (!is_active) {
            item.is_active = 1;
        } else {
            if (!arrVal.includes(changeToSlug(is_active))) {
                errmsg.push('Kích hoạt vui lòng nhập có/không hoặc 1/0.');
            }
        }

        if (!is_budget_creation) {
            item.is_budget_creation = 1;
        } else {
            if (!arrVal.includes(changeToSlug(is_budget_creation))) {
                errmsg.push('Lập ngân sách vui lòng nhập có/không hoặc 1/0.');
            }
        }

        if (!is_budget_adjustment) {
            item.is_budget_adjustment = 1;
        } else {
            if (!arrVal.includes(changeToSlug(is_budget_adjustment))) {
                errmsg.push('Điều chỉnh ngân sách vui lòng nhập có/không hoặc 1/0.');
            }
        }

        if (is_active) {
            if (isNaN(is_active)) {
                item.is_active = changeToSlug(is_active) == 'co' ? 1 : 0;
            } else {
                item.is_active = is_active == 1 ? 1 : 0;
            }
        }

        if (is_budget_creation) {
            if (isNaN(is_budget_creation)) {
                item.is_budget_creation = changeToSlug(is_budget_creation) == 'co' ? 1 : 0;
            } else {
                item.is_budget_creation = is_budget_creation == 1 ? 1 : 0;
            }
        }

        if (is_budget_adjustment) {
            if (isNaN(is_budget_adjustment)) {
                item.is_budget_adjustment = changeToSlug(is_budget_adjustment) == 'co' ? 1 : 0;
            } else {
                item.is_budget_adjustment = is_budget_adjustment == 1 ? 1 : 0;
            }
        }

        // validate duplicate
        if (item_code) {
            const check_code = await checkExistItemCode(item_code);
            if (check_code) {
                errmsg.push('Mã khoản mục đã tồn tại.');
            }
        }

        if (parent_item_name) {
            const { data: parentItems } = await getOptions();

            let targetParentItem = parentItems.find((p) => p.name === parent_item_name);
            if (!targetParentItem) {
                errmsg.push('Mã khoản mục cha không tồn tại.');
            } else {
                item.parent_id = targetParentItem.id;
            }
        }

        if (company_name) {
            const { data: companyList } = await optionService('AM_COMPANY');

            let targetCompany = companyList.find((company) => company.name === company_name);
            if (!targetCompany) {
                errmsg.push('Công ty không tồn tại.');
            } else {
                item.company_id = targetCompany.id;
            }
        }

        if (budget_code) {
            const { data: budgetList } = await getOptionsCommon({ type: 'budget' });
            let targetBudget = budgetList.find((budget) => budget.code === budget_code);
            if (!targetBudget) {
                errmsg.push('Mã ngân sách không tồn tại.');
            } else {
                item.budget_id = targetBudget.id;
            }
        }
    } catch (error) {
        logger.error(error, {
            function: 'product.service.checkProductImport',
        });
        errmsg.push(error.message);
    }

    return { errmsg, item };
};

module.exports = {
    getListItem,
    createOrUpdateItem,
    getDetailItem,
    deleteListItem,
    getOptions,
    checkExistItemCode,
    exportExcel,
    downloadExcel,
    importExcel,
};
