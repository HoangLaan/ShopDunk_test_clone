const sql = require('mssql');
const mssql = require('../../models/mssql');
let xl = require('excel4node');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const API_CONST = require('../../common/const/api.const');
const readXlsxFile = require('read-excel-file/node');
const { validateRequired, validateSpecialChar, validateMaxLength, validateBooleanValue } = require('./helper');

const moduleClass = require('./budget.class');
const { getOptionsCommon } = require('../global/global.service');

const getListBudget = async (queryParams = {}) => {
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
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.FI_BUDGET_GETLIST_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'BudgetService.getListBudget' });
        return new ServiceResponse(true, '', []);
    }
};

const _getListExport = async (queryParams = {}) => {
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
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.FI_BUDGET_GETLISTINCLUDECHILD_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'BudgetService.getListBudget' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdateBudget = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    let currentBudgetId = apiHelper.getValueFromObject(bodyParams, 'budget_id');

    try {
        // check code
        const dataCheck = await pool
            .request()
            .input('BUDGETCODE', apiHelper.getValueFromObject(bodyParams, 'budget_code'))
            .input('BUDGETID', currentBudgetId)
            .execute(PROCEDURE_NAME.FI_BUDGET_CHECKBUDGETCODE_ADMINWEB);

        if (dataCheck.recordset && dataCheck.recordset[0]?.check_code === 1) {
            return new ServiceResponse(false, 'Mã ngân sách đã tồn tại', null);
        }

        await transaction.begin();

        const resCreateOrUpdateBudget = await pool
            .request()
            .input('BUDGETID', currentBudgetId)
            .input('BUDGETTYPEID', apiHelper.getValueFromObject(bodyParams, 'budget_type_id'))
            .input('SHORTNAME', apiHelper.getValueFromObject(bodyParams, 'short_name'))
            .input('BUDGETNAME', apiHelper.getValueFromObject(bodyParams, 'budget_name'))
            .input('BUDGETCODE', apiHelper.getValueFromObject(bodyParams, 'budget_code'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('ISDYNAMICBUDGET', apiHelper.getValueFromObject(bodyParams, 'is_dynamic_budget'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .execute(PROCEDURE_NAME.FI_BUDGET_CREATEORUPDATE_ADMINWEB);

        const budgetId = resCreateOrUpdateBudget.recordset[0].RESULT;

        if (!budgetId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo ngân sách thất bại', null);
        }

        // update budget id when insert success
        currentBudgetId = budgetId;

        const budgetRules = apiHelper.getValueFromObject(bodyParams, 'budgetRules');

        // delete budget rules
        const budgetRuleIds = budgetRules
            ?.filter((budgetRule) => budgetRule.budget_rule_id)
            ?.map((budgetRule) => budgetRule.budget_rule_id);
        if (budgetRuleIds?.length > 0) {
            const deleteRes = await pool
                .request()
                .input('LISTID', budgetRuleIds)
                .input('BUDGETID', budgetId)
                .execute(PROCEDURE_NAME.FI_BUDGET_BUDGETRULE_DELETE_ALL_EXCEPT_ADMINWEB);

            const deleteResult = deleteRes.recordset[0]?.RESULT;
            if (!deleteResult) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa nguyên tắc thất bại', null);
            }
        }

        // insert or update budget rules
        if (budgetRules?.length > 0) {
            const alterBudgetRulePromises = budgetRules.map(async (budgetRule) => {
                const resCreateOrUpdateBudgetRule = await pool
                    .request()
                    .input('BUDGETRULEID', apiHelper.getValueFromObject(budgetRule, 'budget_rule_id'))
                    .input('RULEID', apiHelper.getValueFromObject(budgetRule, 'rule_id'))
                    .input('BUDGETID', currentBudgetId)
                    .input('BUDGETVALUETYPE', apiHelper.getValueFromObject(budgetRule, 'budget_value_type'))
                    .input('MEASURE', apiHelper.getValueFromObject(budgetRule, 'measure'))
                    .input('BUDGETVALUE', apiHelper.getValueFromObject(budgetRule, 'budget_value'))
                    .input('CRITERIA', apiHelper.getValueFromObject(budgetRule, 'criteria'))
                    .input('DATEFROM', apiHelper.getValueFromObject(budgetRule, 'date_from'))
                    .input('DATETO', apiHelper.getValueFromObject(budgetRule, 'date_to'))
                    .execute(PROCEDURE_NAME.FI_BUDGET_BUDGETRULE_CREATEORUPDATE_ADMINWEB);

                const budgetRuleId = resCreateOrUpdateBudgetRule.recordset[0].RESULT;
                return budgetRuleId;
            });

            const budgetRuleIds = await Promise.all(alterBudgetRulePromises);

            if (budgetRuleIds.some((budgetRuleId) => !budgetRuleId)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Chỉnh sửa nguyên tắc tắc thất bại', null);
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', currentBudgetId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'BudgetService.createOrUpdateBudget' });
        return new ServiceResponse(false, e.message);
    }
};

const checkExistBudgetCode = async (budgetCode) => {
    const pool = await mssql.pool;

    const res = await pool
        .request()
        .input('BUDGETCODE', budgetCode)
        .input('BUDGETID', null)
        .execute(PROCEDURE_NAME.FI_BUDGET_CHECKBUDGETCODE_ADMINWEB);

    let { check_code = 0 } = res.recordset[0] || {};

    return check_code;
};

const getDetailBudget = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('BUDGETID', id)
            .execute(PROCEDURE_NAME.FI_BUDGET_GETBYID_ADMINWEB);

        let budget = responseData.recordset[0];
        const budgetRules = responseData.recordsets[1];

        if (budget) {
            budget = moduleClass.detail(budget);
            budget.budgetRules = moduleClass.budgetRuleList(budgetRules);
            return new ServiceResponse(true, '', budget);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'BudgetService.getDetailBudget' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteListBudget = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'BUDGETID')
            .input('TABLENAME', 'FI_BUDGET')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CBO_COMMON_SOFTDELETE);

        return new ServiceResponse(true, '', data);
    } catch (e) {
        logger.error(e, { function: 'BudgetService.deleteListBudget' });

        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUDGETID', apiHelper.getValueFromObject(params, 'budget_id'))
            .input('PARENTID', apiHelper.getValueFromObject(params, 'parent_id'))
            .execute(PROCEDURE_NAME.FI_BUDGET_GETPARENTOPTIONS_ADMINWEB);
        return new ServiceResponse(true, '', moduleClass.parentOptions(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'BudgetServices.getOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    try {
        queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        const serviceRes = await _getListExport({ ...queryParams, parent_id: 0 });
        const { data: budgetsData } = serviceRes.getData();
        const workbook = await _exportExcelFile(budgetsData);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'BudgetServices.exportExcel' });
        return new ServiceResponse(false, e.message);
    }
};

const downloadExcel = async () => {
    try {
        const demoData = [
            {
                budget_type_id: 53,
                budget_type_code: 'CAPEX',
                parent_id: null,
                short_name: 'CP Logistics',
                budget_name: 'CP Logistics, CP vận chuyển',
                is_dynamic_budget: 1,
                budget_code: '62001',
                description: 'mẫu mô tả',
                note: 'mẫu ghi chú',
                created_user: '10005 - Dương Ngọc Hà',
                created_date: '15/06/2023',
                is_active: 1,
            },
        ];

        const workbook = await _exportExcelFile(demoData);

        return new ServiceResponse(true, '', workbook);
    } catch (e) {
        logger.error(e, { function: 'BudgetServices.exportExcel' });
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

                let budget_type_code = `${rows[i][1] || ''}`.trim();
                let parent_name = `${rows[i][2] || ''}`.trim();
                let budget_code = `${rows[i][3] || ''}`.trim();
                let short_name = `${rows[i][4] || ''}`.trim();
                let budget_name = `${rows[i][5] || ''}`.trim();
                let is_dynamic_budget = `${rows[i][6] || ''}`.trim();
                let description = `${rows[i][7] || ''}`.trim();
                let note = `${rows[i][8] || ''}`.trim();

                let is_active = `${rows[i][11]}`.trim();

                let item_import = {
                    budget_type_code,
                    parent_name,
                    budget_code,
                    short_name,
                    budget_name,
                    is_dynamic_budget,
                    description,
                    note,
                    is_active,
                };

                let { errmsg = [], item = {} } = await _checkBudgetImport(item_import);

                if (errmsg && errmsg.length > 0) {
                    import_errors.push({
                        item,
                        errmsg,
                        i,
                    });
                } else {
                    try {
                        let budgetRes = await createOrUpdateBudget({ ...item, auth_name });

                        if (budgetRes.isFailed()) {
                            throw new Error('Thêm mới ngân sách thất bại !');
                        }

                        import_data.push(budgetRes.data);
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
            function: 'BudgetService.importExcel',
        });
        return new ServiceResponse(false, e.message);
    }
};

const _exportExcelFile = async (data) => {
    const { data: budgetTypeOptions } = await getOptionsCommon({ type: 'budgetType' });
    const { data: parentOptions } = await getOptions();

    const workbook = new xl.Workbook();

    // constants
    const START_BUDGET_TYPE_LIST_COLUMN = 1;
    const START_PARENT_BUDGET_LIST_COLUMN = 3;

    const BUDGET_SHEETS_NAME = 'Danh sách ngân sách';
    const OPTIONS_SHEETS_NAME = 'options';

    const budgetsWorksheet = workbook.addWorksheet(BUDGET_SHEETS_NAME);

    const config = [
        {
            key: 'budget_type_code',
            title: 'Loại ngân sách',
            required: true,
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [
                    _createFormula(OPTIONS_SHEETS_NAME, START_BUDGET_TYPE_LIST_COLUMN, budgetTypeOptions.length),
                ],
            },
        },
        {
            key: 'parent_name',
            title: 'Thuộc ngân sách',
            validation: {
                type: 'list',
                allowBlank: 1,
                formulas: [_createFormula(OPTIONS_SHEETS_NAME, START_PARENT_BUDGET_LIST_COLUMN, parentOptions.length)],
            },
            width: 30,
        },
        {
            key: 'budget_code',
            title: 'Mã ngân sách',
            required: true,
            width: 30,
        },
        {
            key: 'short_name',
            title: 'Tên ngân sách viết tắt',
            required: true,
            width: 40,
        },
        {
            key: 'budget_name',
            title: 'Tên ngân sách đầy đủ',
            required: true,
            width: 40,
        },
        {
            key: 'is_dynamic_budget',
            title: 'Ngân sách động',
            width: 16,
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
            width: 30,
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
    _createTableData(budgetsWorksheet, config, data, NUMBERED);

    // create options sheets
    const optionConfig = [
        {
            data: budgetTypeOptions.map((budgetType) => ({
                ...budgetType,
                code: budgetType.name?.split('-')[0].trim(),
            })),
            dataConfig: [
                {
                    key: 'code',
                    title: 'Loại ngân sách',
                    width: 40,
                },
            ],
            startColumn: START_BUDGET_TYPE_LIST_COLUMN,
        },
        {
            data: parentOptions,
            dataConfig: [
                {
                    key: 'name',
                    title: 'Thuộc ngân sách',
                    width: 60,
                },
            ],
            startColumn: START_PARENT_BUDGET_LIST_COLUMN,
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

const _checkBudgetImport = async (budget = {}) => {
    let errmsg = [];
    try {
        let {
            budget_type_code,
            parent_name,
            budget_code,
            short_name,
            budget_name,
            is_dynamic_budget,
            description,
            note,
            is_active,
        } = budget;

        // validate data
        validateRequired(budget_type_code, () => {
            errmsg.push('Loại ngân sách là bắt buộc.');
        });
        validateRequired(budget_code, () => {
            errmsg.push('Mã ngân sách là bắt buộc.');
        });
        validateSpecialChar(budget_code, () => {
            errmsg.push('Mã ngân sách không được chứa các ký tự đặt biệt.');
        });
        validateMaxLength(budget_code, 20, () => {
            errmsg.push('Mã ngân sách không được quá 20 ký tự.');
        });
        validateRequired(short_name, () => {
            errmsg.push('Tên ngân sách viết tắt là bắt buộc.');
        });
        validateRequired(budget_name, () => {
            errmsg.push('Tên ngân sách đầy đủ là bắt buộc.');
        });

        validateMaxLength(description, 1000, () => {
            errmsg.push('Mô tả ngân sách không được quá 1000 ký tự.');
        });
        validateMaxLength(note, 1000, () => {
            errmsg.push('Ghi chú ngân sách không được quá 1000 ký tự.');
        });

        const ENABLE_VALUE = 1;
        budget.is_active = is_active ? is_active : ENABLE_VALUE;
        budget.is_dynamic_budget = is_dynamic_budget ? is_dynamic_budget : ENABLE_VALUE;

        validateBooleanValue(
            is_active,
            (booleanVal) => {
                budget.is_active = booleanVal;
            },
            () => {
                errmsg.push('Kích hoạt vui lòng nhập có/không hoặc 1/0.');
            },
        );
        validateBooleanValue(
            is_dynamic_budget,
            (booleanVal) => {
                budget.is_dynamic_budget = booleanVal;
            },
            () => {
                errmsg.push('Ngân sách động vui lòng nhập có/không hoặc 1/0.');
            },
        );

        // validate duplicate
        if (budget_code) {
            const check_code = await checkExistBudgetCode(budget_code);
            if (check_code) {
                errmsg.push('Mã ngân sách đã tồn tại.');
            }
        }

        if (parent_name) {
            const { data: parentOptions } = await getOptions();

            let targetParentItem = parentOptions.find((parentItem) => parentItem.name === parent_name);

            if (!targetParentItem) {
                errmsg.push('Mã ngân sách cha không tồn tại.');
            } else {
                budget.parent_id = targetParentItem.id;
            }
        }

        if (budget_type_code) {
            const { data: budgetTypeOptions } = await getOptionsCommon({ type: 'budgetType' });

            // get attach code data from name
            const budgetTypes = budgetTypeOptions.map((budgetType) => ({
                ...budgetType,
                code: budgetType.name?.split('-')[0].trim(),
            }));
            let targetBudget = budgetTypes.find((budget) => budget.code === budget_type_code);
            if (!targetBudget) {
                errmsg.push('Mã loại ngân sách không tồn tại.');
            } else {
                budget.budget_type_id = targetBudget.id;
            }
        }
    } catch (error) {
        logger.error(error, {
            function: 'budgetService.checkBudgetImport',
        });
        errmsg.push(error.message);
    }

    return { errmsg, item: budget };
};

module.exports = {
    getListBudget,
    createOrUpdateBudget,
    getDetailBudget,
    deleteListBudget,
    getOptions,
    checkExistBudgetCode,
    exportExcel,
    downloadExcel,
    importExcel,
};
