const fileHelper = require('../../common/helpers/file.helper');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const moduleClass = require('./bank.class');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const apiHelper = require('../../common/helpers/api.helper');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getBankList = async (queryParams = {}) => {
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
            .input('ISACTIVE', apiHelper.getFilterBoo)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_BANK_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordsets[1]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'BankService.getBankList' });

        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateBank = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    try {
        const bank_logo = apiHelper.getValueFromObject(bodyParams, 'bank_logo');
        let logo_url = null;
        if (fileHelper.isBase64(bank_logo)) {
            logo_url = await fileHelper.saveBase64('bank', bank_logo);
        }

        // Save
        const resCreateOrUpdateBank = await pool
            .request()
            .input('BANKID', apiHelper.getValueFromObject(bodyParams, 'bank_id'))
            .input('BANKCODE', apiHelper.getValueFromObject(bodyParams, 'bank_code'))
            .input('BANKNAME', apiHelper.getValueFromObject(bodyParams, 'bank_name'))
            .input('BANKLOGO', logo_url)
            .input('BANKNAMEEN', apiHelper.getValueFromObject(bodyParams, 'bank_name_en'))
            .input('REGISTEREDOFFICE', apiHelper.getValueFromObject(bodyParams, 'registered_office'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))

            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_BANK_CreateOrUpdate_AdminWeb');

        const bankId = resCreateOrUpdateBank.recordset[0].RESULT;

        if (!bankId || bankId <= 0) {
            return new ServiceResponse(false, 'Thêm ngân hàng thất bại', null);
        }

        removeCacheOptions();

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { Bank: 'BankService.createOrUpdateBank' });

        return new ServiceResponse(false, error.message);
    }
};

const bankDetail = async (bankId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool.request().input('BANKID', bankId).execute('MD_BANK_GetById_AdminWeb');

        let bank = resData.recordset[0];

        if (bank) {
            bank = moduleClass.detail(bank);

            return new ServiceResponse(true, '', bank);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'BankService.bankDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteBank = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'BANKID')
            .input('TABLENAME', 'MD_BANK')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'BankService.deleteBank' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MD_BANK_GetOption_AdminWeb');
        return new ServiceResponse(true, '', moduleClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'bankService.getOptions' });
        return new ServiceResponse(false, '', []);
    }
};

const getOptionsByCompany = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .execute('AM_COMPANY_BANKACCOUNT_GetOptionByCompany_AdminWeb');
        return new ServiceResponse(true, '', moduleClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'bankService.getOptionsByCompany' });
        return new ServiceResponse(false, '', []);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_BANK_OPTIONS);
};

module.exports = {
    getBankList,
    createOrUpdateBank,
    bankDetail,
    deleteBank,
    getOptions,
    getOptionsByCompany,
};
