const database = require('../../models');
const defaultAccountClass = require('./default-account.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
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

const getList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const defaultAccount = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('DOCUMENTID', apiHelper.getValueFromObject(params, 'document_id', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .execute('AC_DEFAULTACCOUNT_GetList_AdminWeb');

        const listDefaultAccount = defaultAccountClass.list(defaultAccount.recordsets[0]);
        const data = [];
        const defaultAccountTypes = ['debt', 'credit'];
        for (const item of listDefaultAccount) {
            for (const type of defaultAccountTypes) {
                data.push({
                    ...item,
                    [type]: await getDefaultAccountType(type, item.ac_default_account_id),
                });
            }
        }

        const result = _(data)
            .groupBy('ac_default_account_id')
            .map((g) => _.mergeWith({}, ...g, (obj, src) => (_.isArray(obj) ? obj.concat(src) : undefined)))
            .value();

        return {
            list: result,
            total: apiHelper.getTotalData(defaultAccount.recordsets[0]),
        };
    } catch (error) {
        logger.error(error, { function: 'defaultAccountService.getList' });
        return [];
    }
};

const getDefaultAccountType = async (type, acDefaultAccountId) => {
    try {
        const pool = await mssql.pool;
        const defaultAccountData = await pool
            .request()
            .input('ACDEFAULTACCOUNTID', acDefaultAccountId)
            .execute(`AC_DEFAULTACC_${type.toUpperCase()}_GetList_AdminWeb`);

        return defaultAccountClass.listDefaultAccountType(type, defaultAccountData.recordset);
    } catch (error) {
        logger.error(error, { function: 'defaultAccountService.getDefaultAccountOther' });
        return [];
    }
};

const getDocumentOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('AC_DOCUMENT', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'defaultAccountService.getDocumentOptions' });
        return [];
    }
};

const getAccountingAccountOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const accountData = await pool.request().execute(`AC_ACCOUNTINGACCOUNT_GetOptions_AdminWeb`);

        return defaultAccountClass.listAccountOptions(accountData.recordset);
    } catch (error) {
        logger.error(error, { function: 'defaultAccountService.getAccountingAccountOptions' });
        return [];
    }
};

const createOrUpdate = async (params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const ac_default_account_id = apiHelper.getValueFromObject(params, 'id', null);
        const defaultAccountCreateOrUpdate = new sql.Request(transaction);
        const defaultAccount = await defaultAccountCreateOrUpdate
            .input('ACDEFAULTACCOUNTID', ac_default_account_id)
            .input('ACDEFAULTACCOUNTNAME', apiHelper.getValueFromObject(params, 'ac_default_account_name', ''))
            .input('DOCUMENTID', apiHelper.getValueFromObject(params, 'document_id', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('AC_DEFAULTACCOUNT_CreateOrUpdate_AdminWeb');
        removeCacheOptions();
        const acDefaultAccountId = defaultAccount.recordset[0].id;
        if (!acDefaultAccountId || acDefaultAccountId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo hoặc cập nhật tài khoản ngầm định thất bại', null);
        }

        const defaultAccountList = apiHelper
            .getValueFromObject(params, 'default_account_list', [])
            .filter((item) => item && !_.isEmpty(item));

        if (defaultAccountList.length === 0 && !ac_default_account_id) {
            await transaction.commit();
            return new ServiceResponse(true, 'Tạo thành công tài khoản ngầm định');
        }

        for (const da of defaultAccountList) {
            const keys = Object.keys(da);
            const type = keys[0].split('_')[0];
            const daType = {
                ...da,
                ac_default_account_id: ac_default_account_id ?? acDefaultAccountId,
                type,
            };
            params.daType = daType;
            const data = await createOrUpdateDefaultAccountType(params, transaction);
            if (data.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Tạo hoặc cập nhật tài khoản ngầm định thất bại');
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công tài khoản ngầm định');
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'DefaultAccountService.createOrUpdateHandler' });
    }
};

const createOrUpdateDefaultAccountType = async (params = {}, transaction) => {
    try {
        const daType = apiHelper.getValueFromObject(params, 'daType', {});
        const type = daType.type;
        const ac_default_account_id = daType.ac_default_account_id;
        const created_user = apiHelper.getValueFromObject(params, 'auth_name');

        // Delete ids_old if update
        const list_id_old = daType[`ids_old`];
        if (list_id_old) {
            const data = await deleteDefaultAccountType(type, list_id_old, created_user);
            if (data.isFailed()) {
                return new ServiceResponse(false, `Tạo hoặc cập nhật ${type} thất bại`, null);
            }
        }
        for (const index in daType[`${type}_ids`]) {
            const daTypeUpdate = new sql.Request(transaction);
            const defaultAccountType = await daTypeUpdate
                .input(`${type.toUpperCase()}ACCOUNTTID`, daType[`${type}_ids`][index])
                .input('ACDEFAULTACCOUNTID', ac_default_account_id)
                .input('DEFAULTACCOUNTTID', apiHelper.getValueFromObject(daType, `${type}_id_main`, null))
                .input('CREATEDUSER', created_user)
                .execute(`AC_DEFAULTACC_${type.toUpperCase()}_Create_AdminWeb`);
            const defaultAccountTypeId = defaultAccountType.recordset[0].id;
            if (!defaultAccountTypeId || defaultAccountTypeId <= 0) {
                return new ServiceResponse(false, `Tạo hoặc cập nhật ${type} thất bại`, null);
            }
        }
        removeCacheOptions();
        return new ServiceResponse(true, `Tạo ${type} thành công`);
    } catch (error) {
        logger.error(error, { function: 'DefaultAccountService.createOrUpdateDefaultAccountType' });
        return new ServiceResponse(false);
    }
};

const deleteDefaultAccountType = async (type, list_id = [], deleted_user) => {
    try {
        const pool = await mssql.pool;
        const defaultAccountType = await pool
            .request()
            .input(`LIST_ID`, list_id.join(','))
            .input(`CREATEDUSER`, deleted_user)
            .execute(`AC_DEFAULTACC_${type.toUpperCase()}_Delete_AdminWeb`);
        removeCacheOptions();
        return new ServiceResponse(true, `Xóa ${type} thành công`);
    } catch (error) {
        logger.error(error, { function: 'DefaultAccountService.createOrUpdateDefaultAccountType' });
        return new ServiceResponse(false);
    }
};

const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const defaultAccount = await pool
            .request()
            .input('ACDEFAULTACCOUNTID', id)
            .execute('AC_DEFAULTACCOUNT_GetById_AdminWeb');

        const detailDefaultAccount = defaultAccountClass.detail(defaultAccount.recordset[0]);

        const defaultAccountTypes = [
            'debt',
            'credit',
            // 'tax'
        ];
        detailDefaultAccount.default_account_list = [];

        for (const type of defaultAccountTypes) {
            const detailType = await getDetailDefaultAccountType(type, detailDefaultAccount.ac_default_account_id);
            detailDefaultAccount.default_account_list.push({
                [`${type}_ids`]: detailType.map((item) => item[`${type}_account_id`]),
                [`${type}_id_main`]: detailType[0]?.default_account_id,
                [`ids_old`]: detailType.map((item) => item[`${type}_default_account_id`]),
            });
        }
        return detailDefaultAccount;
    } catch (error) {
        logger.error(error, { function: 'defaultAccountService.detail' });
        return null;
    }
};

const getDetailDefaultAccountType = async (type, acDefaultAccountId) => {
    try {
        const pool = await mssql.pool;
        const defaultAccountData = await pool
            .request()
            .input('ACDEFAULTACCOUNTID', acDefaultAccountId)
            .execute(`AC_DEFAULTACC_${type.toUpperCase()}_GetById_AdminWeb`);
        const value = defaultAccountClass.detailDefaultAccountType(type, defaultAccountData.recordset);
        return value;
    } catch (error) {
        logger.error(error, { function: 'defaultAccountService.getDefaultAccountOther' });
        return [];
    }
};

const remove = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'ACDEFAULTACCOUNTID')
            .input('TABLENAME', 'AC_DEFAULTACCOUNT')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKWORKFLOW_OPTIONS);
};

const exportExcel = async (queryParams = {}) => {
    try {
        const serviceRes = await getList(queryParams);
        const { list } = serviceRes;

        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();
        // Add Worksheets to the workbook
        const ws = wb.addWorksheet('Danh sách tài khoản ngầm định', {});
        // Set width
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(50);
        ws.column(2).setWidth(50);
        ws.column(3).setWidth(40);
        ws.column(5).setWidth(50);
        ws.column(6).setWidth(50);

        const customList = list.map((item) => ({
            ...item,
            debt: item.debt.map((d) => d.accounting_account_code).join(', '),
            credit: item.credit.map((c) => c.accounting_account_code).join(', '),
        }));

        const header = {
            ac_default_account_name: 'Tên bước định khoản',
            debt: 'TK Nợ',
            credit: 'TK Có',
            document_name: 'Loại chứng từ',
            created_user: 'Người tạo',
            created_date: 'Ngày tạo',
            is_active: 'Kích hoạt',
        };
        customList.unshift(header);

        customList.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            ws.cell(indexRow, ++indexCol).string((item.ac_default_account_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.debt || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.credit || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.document_name || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.created_user || '').toString());
            ws.cell(indexRow, ++indexCol).string((item.created_date || '').toString());
            ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_active : item.is_active ? 'Có' : 'Không');
        });
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'defaultAccountService.exportExcel' });
    }
};

module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
    exportExcel,
    getDocumentOptions,
    getAccountingAccountOptions,
};
