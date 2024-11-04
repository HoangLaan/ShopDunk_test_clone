const accountingAccountClass = require('./accounting-account.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const excelHelper = require('../../common/helpers/excel.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const globalService = require('../global/global.service');
const { propertys, columns } = require('./utils/constants');
const _ = require('lodash');
const xl = require('excel4node');
const readXlsxFile = require('read-excel-file/node');
const { changeToSlug } = require('../../common/helpers/string.helper');
const getList = async (params = {}) => {
    const currentPage = apiHelper.getCurrentPage(params);
    const itemsPerPage = apiHelper.getItemsPerPage(params);

    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .input('PROPERTY', apiHelper.getValueFromObject(params, 'property'))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .input('PARENTID', apiHelper.getValueFromObject(params, 'parent_id'))
            .execute(PROCEDURE_NAME.AC_ACCOUNTINGACCOUNT_GETLIST_ADMINWEB);

        const item = data.recordset;
        let resultList = accountingAccountClass.list(item);

        if (resultList && resultList.length > 0) {
            const promiseList = resultList.map(async (item) => {
                item.child_count = await _countChildrenByParent(item.accounting_account_id, params);
                return item;
            });
            resultList = await Promise.all(promiseList);
        }

        return new ServiceResponse(true, '', {
            list: resultList,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'AccountingAccountService.getList' });
        return new ServiceResponse(false, error, []);
    }
};

const getOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute('AC_ACCOUNTINGACCOUNT_GetOptions_AdminWeb');
        return new ServiceResponse(true, '', accountingAccountClass.options(res.recordset));
    } catch (error) {
        logger.error(error, { function: 'AccountingAccountService.getOptions' });
        return new ServiceResponse(false, error, []);
    }
};

const _countChildrenByParent = async (parent_id, params) => {
    const pool = await mssql.pool;
    const res = await pool
        .request()
        .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword'))
        .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
        .input('PROPERTY', apiHelper.getValueFromObject(params, 'property'))
        .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
        .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
        .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
        .input('PARENTID', parent_id)
        .execute(PROCEDURE_NAME.AC_ACCOUNTINGACCOUNT_GETLIST_ADMINWEB);

    return res?.recordset[0]?.TOTALITEMS || 0;
};

const getTree = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('ACCOUNTPARENTID', apiHelper.getValueFromObject(params, 'parent_id'))
            .input('ACCOUNTINGACCOUNTID', apiHelper.getValueFromObject(params, 'accounting_account_id'))
            .execute(PROCEDURE_NAME.AC_ACCOUNTINGACCOUNT_GETTREE_ADMINWEB);
        return new ServiceResponse(true, '', {
            items: accountingAccountClass.tree(res.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'AccountingAccountService.getTree' });
        return new ServiceResponse(false, error, []);
    }
};

const createOrUpdate = async (id = null, params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('ACCOUNTINGACCOUNTID', apiHelper.getValueFromObject(params, 'accounting_account_id', id))
            .input('ACCOUNTINGACCOUNTNAME', apiHelper.getValueFromObject(params, 'accounting_account_name', null))
            .input('ACCOUNTINGACCOUNTCODE', apiHelper.getValueFromObject(params, 'accounting_account_code', null))
            .input('ACCOUNTPARENTID', apiHelper.getValueFromObject(params, 'account_parent_id', null))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id', null))
            .input('PROPERTY', apiHelper.getValueFromObject(params, 'property', null))
            .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', null))
            .input('NOTE', apiHelper.getValueFromObject(params, 'note', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ACTIVE))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ACTIVE))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
            .execute(PROCEDURE_NAME.AC_ACCOUNTINGACCOUNT_CREATEORUPDATE_ADMINWEB);
        let result = apiHelper.getResult(res.recordset);
        if (!result) {
            return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật tài khoản kế toán');
        }
        removeCacheOptions();
        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, { function: 'AccountingAccountService.createOrUpdate' });
        return new ServiceResponse(false, error);
    }
};

const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('ACCOUNTINGACCOUNTID', id)
            .execute(PROCEDURE_NAME.AC_ACCOUNTINGACCOUNT_GETBYID_ADMINWEB);
        return new ServiceResponse(true, '', accountingAccountClass.detail(res.recordset[0]));
    } catch (error) {
        logger.error(error, { function: 'AccountingAccountService.detail' });
        return new ServiceResponse(false, error);
    }
};

const remove = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'ACCOUNTINGACCOUNTID')
            .input('TABLENAME', 'AC_ACCOUNTINGACCOUNT')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (params) => {
    try {
        params.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
        let resService = await getList(params);
        let { list } = resService.getData();
        let data = excelHelper.addWorksheet(
            new xl.Workbook(),
            'DANH SÁCH TÀI KHOẢN KẾ TOÁN',
            'Tài khoản kế toán',
            [
                {
                    width: 10,
                    title: 'STT',
                    formatter: (item, index) => index + 1,
                },
                {
                    width: 40,
                    title: 'Tên tài khoản',
                    field: 'accounting_account_name',
                },
                {
                    width: 50,
                    title: 'Mã tài khoản',
                    field: 'accounting_account_code',
                },
                {
                    width: 20,
                    title: 'Tính chất',
                    formatter: (item) => _.find(propertys, (x) => x.value === item.property)?.label,
                },
                {
                    width: 50,
                    title: 'Diễn giải',
                    field: 'description',
                },
                {
                    width: 30,
                    title: 'Công ty áp dụng',
                    field: 'company_name',
                },
                {
                    width: 20,
                    title: 'Người tạo',
                    field: 'full_name',
                },
                {
                    width: 20,
                    title: 'Ngày tạo',
                    field: 'create_date',
                },
            ],
            list,
        );

        return new ServiceResponse(true, '', data);
    } catch (error) {
        logger.error(error, { function: 'AccountingAccountService.exportExcel' });
        return new ServiceResponse(false, error);
    }
};

const downloadTemplate = async () => {
    try {
        let wb = new xl.Workbook();
        let res_company = await globalService.getOptionsCommon({ type: 'company' });
        let list_company = res_company.getData();
        let res_accounting_account = await globalService.getOptionsCommon({ type: 'accounting_account' });
        let list_accounting_account = res_accounting_account.getData();
        let data = excelHelper.addWorksheet(
            wb,
            'DANH SÁCH TÀI KHOẢN KẾ TOÁN',
            'Tài khoản kế toán',
            [
                {
                    width: 40,
                    title: columns.accounting_account_code,
                    field: 'accounting_account_code',
                },
                {
                    width: 50,
                    title: columns.accounting_account_name,
                    field: 'accounting_account_name',
                },
                {
                    width: 20,
                    title: columns.property,
                    validate: {
                        type: 'list',
                        allowBlank: false,
                        prompt: 'Choose from dropdown',
                        error: 'Invalid choice was chosen',
                        showDropDown: true,
                        sqref: 'C2:C10',
                        formulas: [`='Danh sách tính chất'!$C$2:$C$${1 + propertys?.length}`],
                    },
                },
                {
                    width: 50,
                    title: columns.description,
                    field: 'description',
                },
                {
                    width: 30,
                    title: columns.company,
                    validate: {
                        type: 'list',
                        allowBlank: false,
                        prompt: 'Choose from dropdown',
                        error: 'Invalid choice was chosen',
                        showDropDown: true,
                        sqref: 'E2:E10',
                        formulas: [`='Danh sách công ty'!$C$2:$C$${1 + list_company?.length}`],
                    },
                },
                {
                    width: 10,
                    title: columns.is_active,
                    field: 'is_active',
                },
            ],
            [
                {
                    accounting_account_code: '123',
                    accounting_account_name: 'Tiền',
                    description: 'Tiền',
                    is_active: 'Có',
                },
            ],
        );
        data = excelHelper.addWorksheet(
            data,
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
                    title: 'Giá trị',
                    formatter: (item) => `${item.id}-${item.name}`,
                },
            ],
            list_company,
        );
        data = excelHelper.addWorksheet(
            data,
            null,
            'Danh sách tính chất',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'value',
                },
                {
                    width: 20,
                    title: 'Tên tính chất',
                    field: 'label',
                },
                {
                    width: 30,
                    title: 'Giá trị',
                    formatter: (item) => `${item.value}-${item.label}`,
                },
            ],
            propertys,
        );

        data = excelHelper.addWorksheet(
            data,
            null,
            'Danh sách các tài khoản kế toán',
            [
                {
                    width: 10,
                    title: 'Id',
                    field: 'id',
                },
                {
                    width: 30,
                    title: 'Tên tài khoản kế toán',
                    field: 'name',
                },
                {
                    width: 30,
                    title: 'Giá trị',
                    formatter: (item) => `${item.id}-${item.name}`,
                },
            ],
            list_accounting_account,
        );
        return new ServiceResponse(true, '', data);
    } catch (error) {
        logger.error(error, { function: 'AccountingAccountService.downloadTemplate' });
        return new ServiceResponse(false, error);
    }
};
const checkAccountingAcountImport = (accountingAccount, pool = null) => {
    let errmsg = [];
    let arrVal = ['co', 'khong', '1', '0'];
    let {
        accounting_account_code = null,
        accounting_account_name = null,
        property,
        company,
        is_active = null,
    } = accountingAccount || {};
    if (!accounting_account_name) errmsg.push('Tên tài khoản là bắt buộc');
    if (!accounting_account_code) errmsg.push('Mã tài khoản là bắt buộc');
    if (!property) errmsg.push('Tính chất là bắt buộc');
    if (!company) errmsg.push('Công ty áp dụng là bắt buộc');
    if (!is_active) {
        errmsg.push('Kích hoạt là bắt buộc.');
    } else {
        if (!arrVal.includes(changeToSlug(is_active))) {
            errmsg.push('Kích hoạt vui lòng nhập có/không hoặc 1/0.');
        }
    }
    if (is_active) {
        if (isNaN(is_active)) {
            is_active = changeToSlug(is_active) == 'co' ? 1 : 0;
        } else {
            is_active = is_active == 1 ? 1 : 0;
        }
    }

    let item = {
        ...accountingAccount,
        company_id: +accountingAccount.company.split('-')[0],
        property: +accountingAccount.property.split('-')[0],
        is_active: is_active,
    };
    return { errmsg, item };
};
const importExcel = async (bodyParams = {}, file) => {
    try {
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        const rows = await readXlsxFile(file.buffer);
        let data = excelHelper.getValueExcel(rows, columns);
        let pool = await mssql.pool;
        let import_data = [];
        let import_errors = [];
        let import_total = 0;
        for (let i = 1; i < data.length; i++) {
            import_total += 1;
            let accountingAccount = data[i];
            let { errmsg, item } = checkAccountingAcountImport(accountingAccount, pool);
            if (errmsg && errmsg.length > 0) {
                import_errors.push({
                    accountingAccount,
                    errmsg,
                    i,
                });
            } else {
                try {
                    let res = await createOrUpdate(null, { ...item, auth_name });
                    if (res.isFailed()) {
                        import_errors.push({
                            accountingAccount,
                            errmsg: [res.getMessage()],
                            i,
                        });
                    }
                    import_data.push(res.getData());
                } catch (error) {
                    import_errors.push({
                        accountingAccount,
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
    return cacheHelper.removeByKey(CACHE_CONST.AC_ACCOUNTINGACCOUNT_OPTIONS);
};

module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
    getTree,
    exportExcel,
    importExcel,
    downloadTemplate,
    getOptions,
};
