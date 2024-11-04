const receiveTypeClass = require('../receive-type/receive-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getListReceiveType = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id', 0))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id', 0))
            .input('LEVEL', apiHelper.getValueFromObject(queryParams, 'level'))
            .execute('MD_RECEIVETYPE_GetList_AdminWeb');

        const item = data.recordset;
      //  console.log('queryParams==>> ',queryParams);
        let resultList = receiveTypeClass.list(item);
        if (resultList && resultList.length > 0) {
            const promiseList = resultList.map(async (item) => {
                item.child_count = await _countChildrenByParent(item.receive_type_id, queryParams);
                return item;
            });
            resultList = await Promise.all(promiseList);
        }

        return new ServiceResponse(true, '', {
            data: resultList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'receiveTypeService.getListReceiveType' });
        return new ServiceResponse(true, '', {});
    }
};

const _countChildrenByParent = async (parent_id, queryParams) => {
    const pool = await mssql.pool;
    const data = await pool
        .request()
        .input('KEYWORD', apiHelper.getSearch(queryParams))
        .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
        .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
        .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
        .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id', 0))
        .input('PARENTID', parent_id)
        .execute('MD_RECEIVETYPE_GetList_AdminWeb');
    return data?.recordset[0]?.TOTALITEMS || 0;
};

const getListBankAccount = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        let business_ids = apiHelper.getValueFromObject(queryParams, 'business_ids');
        if (business_ids) {
            business_ids = business_ids.join();
        } else {
            business_ids = null;
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('LISTID', business_ids)
            .execute('AM_COMPANY_BANKACCOUNT_GetListByCompanyAndBusiness_AdminWeb');

        const item = data.recordset;

        return new ServiceResponse(true, '', {
            data: receiveTypeClass.listBankAccount(item),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'receiveTypeService.getListBankAccount' });
        return new ServiceResponse(true, '', {});
    }
};

const detailReceiveType = async (receive_type_id) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('RECEIVETYPEID', receive_type_id)
            .execute('MD_RECEIVETYPE_GetById_AdminWeb');

        let item = data.recordset;
        let business_id_list = (data.recordsets[1] ?? []).map((e) => parseInt(e?.BUSINESSID));

        // If exists
        if (item && item.length > 0) {
            item = receiveTypeClass.detail(item[0]);
            item.business_id_list = business_id_list;

            const bankAccountRes = await pool
                .request()
                .input('RECEIVETYPEID', receive_type_id)
                .execute('MD_RECEIVETYPE_BANKACCOUNT_GetBankAccountByExpendType_AdminWeb');
            const bankAccountData = receiveTypeClass.listBankAccount(bankAccountRes.recordset);

            item.bank_account_list = bankAccountData;
            return new ServiceResponse(true, '', item);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'receiveTypeService.detailReceiveType' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteReceiveType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'RECEIVETYPEID')
            .input('TABLENAME', 'MD_RECEIVETYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'ReceiveTypeService.service.deleteReceiveType' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const receive_type_id = apiHelper.getValueFromObject(bodyParams, 'receive_type_id', null);

        const checkCode = await pool
            .request()
            .input('RECEIVETYPEID', receive_type_id)
            .input('RECEIVETYPECODE', apiHelper.getValueFromObject(bodyParams, 'receive_type_code'))
            .execute('MD_RECEIVETYPE_CheckCode_AdminWeb');

        const resultCheckCode = checkCode.recordset[0].RESULT;
        if (resultCheckCode) {
            return new ServiceResponse(false, 'Loại thu trùng mã code');
        }

        const data = await pool
            .request()
            .input('RECEIVETYPEID', receive_type_id)
            .input('RECEIVETYPECODE', apiHelper.getValueFromObject(bodyParams, 'receive_type_code'))
            .input('RECEIVETYPENAME', apiHelper.getValueFromObject(bodyParams, 'receive_type_name'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id', 0))
            .input('BUSINESSIDLIST', apiHelper.getValueFromObject(bodyParams, 'business_id_list', []))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_RECEIVETYPE_CreateOrUpdate_AdminWeb');
        const receiveTypeId = data.recordset[0].RESULT;

        if (Boolean(receive_type_id)) {
            await pool
                .request()
                .input('RECEIVETYPEID', receive_type_id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_RECEIVETYPE_BANKACCOUNT_Delete_AdminWeb');
        }

        const bank_account_business_ids = apiHelper.getValueFromObject(bodyParams, 'bank_account_business_ids', []);
        if (bank_account_business_ids.length > 0) {
            for (const account_business_id of bank_account_business_ids) {
                await pool
                    .request()
                    .input('RECEIVETYPEID', receiveTypeId)
                    .input('BANKACCOUNTID', account_business_id)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('MD_RECEIVETYPE_BANKACCOUNT_Create_AdminWeb');
            }
        }
        removeCacheOptions();
        return new ServiceResponse(true, '', receiveTypeId);
    } catch (e) {
        logger.error(e, { function: 'receiveTypeService.createOrUpdate' });
        return new ServiceResponse(false);
    }
};

const getReceiveTypeOptions = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MD_RECEIVETYPE_GetReceiveTypeOptions_AdminWeb');
        const data_ = receiveTypeClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'receiveTypeService.getListReceiveTypeOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getCompanyOptions = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MD_RECEIVETYPE_GetCompanyOptions_AdminWeb');
        const data_ = receiveTypeClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'receiveTypeService.getListCompanyOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getBusinessOptions = async (bodyParams) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .execute('MD_RECEIVETYPE_GetBusinessOptions_AdminWeb');

        const data_ = receiveTypeClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'receiveTypeService.getBusinessOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getUserOptions = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'keyword'))
            .input('LIMIT', apiHelper.getValueFromObject(bodyParams, 'limit', 20))
            .execute('SL_RECEIPTPAYMENT_LEVEL_USER_GetUserOptions_AdminWeb');

        const data_ = receiveTypeClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'receiveTypeService.getUserOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getTree = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PARENTID', apiHelper.getValueFromObject(params, 'parent_id'))
            .input('RECEIVETYPEID', apiHelper.getValueFromObject(params, 'receive_type_id'))
            .execute('MD_RECEIVETYPE_GetTree_AdminWeb');
        return new ServiceResponse(true, '', {
            items: receiveTypeClass.tree(res.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'receiveTypeService.getTree' });
        return new ServiceResponse(false, error, []);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_RECEIVETYPE_OPTION);
};

module.exports = {
    getListReceiveType,
    deleteReceiveType,
    detailReceiveType,
    createOrUpdate,
    getReceiveTypeOptions,
    getCompanyOptions,
    getBusinessOptions,
    getUserOptions,
    getListBankAccount,
    getTree,
};
