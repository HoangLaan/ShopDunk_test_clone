const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./business.class');
const { crypto } = require('../../common/helpers/encode.helper');
const redisHelper = require('../../common/helpers/redis.helper');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getBusinessList = async (queryParams = {}) => {
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
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('BUSINESSTYPEIDS', apiHelper.getValueFromObject(queryParams, 'business_type_ids'))
            .input('AREAIDS', apiHelper.getValueFromObject(queryParams, 'area_ids'))
            .execute(PROCEDURE_NAME.AM_BUSINESS_GETLIST);

        const business = data.recordset;

        return new ServiceResponse(true, '', {
            data: moduleClass.list(business),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(business),
        });
    } catch (e) {
        logger.error(e, { function: 'BusinessService.getBusinessList' });

        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateBusiness = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        // checkname
        const dataCheck = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('BUSINESSNAME', apiHelper.getValueFromObject(bodyParams, 'business_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .execute(PROCEDURE_NAME.AM_BUSINESS_CHECKNAME);
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.AMBUSINESS.EXISTS_NAME, null);
        }
        await transaction.begin();

        // Save
        const createOrUpdateBusiness = new sql.Request(transaction);
        const resCreateOrUpdateBusiness = await createOrUpdateBusiness
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('BUSINESSCODE', apiHelper.getValueFromObject(bodyParams, 'business_code'))
            .input('BUSINESSTAXCODE', apiHelper.getValueFromObject(bodyParams, 'business_tax_code')) //
            .input('BUSINESSNAME', apiHelper.getValueFromObject(bodyParams, 'business_name'))
            .input('BUSINESSSHORTNAME', apiHelper.getValueFromObject(bodyParams, 'business_short_name')) //
            .input('REPRESENTATIVENAME', apiHelper.getValueFromObject(bodyParams, 'representative_name')) //
            .input('AREAID', apiHelper.getValueFromObject(bodyParams, 'area_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('BUSINESSTYPEID', apiHelper.getValueFromObject(bodyParams, 'business_type_id'))
            .input('BUSINESSPHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'business_phone_number'))
            .input('BUSINESSEMAIL', apiHelper.getValueFromObject(bodyParams, 'business_mail'))
            .input('OPENINGDATE', apiHelper.getValueFromObject(bodyParams, 'opening_date'))
            .input('COUNTRYID', apiHelper.getValueFromObject(bodyParams, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
            .input('POSTALCODE', apiHelper.getValueFromObject(bodyParams, 'postal_code'))
            .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system')) //
            .input('ISBUSINESSPLACE', apiHelper.getValueFromObject(bodyParams, 'is_business_place')) //
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.AM_BUSINESS_CREATEORUPDATE);

        const businessId = resCreateOrUpdateBusiness.recordset[0].RESULT;

        if (!businessId || businessId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo miền thất bại', null);
        }

        const password = apiHelper.getValueFromObject(bodyParams, 'misa_password');

        const createOrUpdateMisaAccount = new sql.Request(transaction);
        const result = await createOrUpdateMisaAccount
            .input('ACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'account_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'misa_username'))
            .input('PASSWORD', bodyParams.is_change_password ? crypto.encodeData(password) : null)
            .input('TAXCODE', apiHelper.getValueFromObject(bodyParams, 'business_tax_code'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .execute('SL_MISAACCOUTS_CreateOrUpdate_AdminWeb');

        // xóa cache token redis
        if (bodyParams.is_change_password) {
            const key = `MISA_TOKEN_REDIS_KEY_${apiHelper.getValueFromObject(bodyParams, 'business_tax_code')}`;
            const API_PARTNER_PREFIX = 'INSIDE:';
            redisHelper.delCrossApp(API_PARTNER_PREFIX + key);
        }

        if (!(result.recordset[0]?.RESULT > 0)) {
            throw 'Cập nhật tài khoản misa thất bại !';
        }

        const requestBankAccountDel = new sql.Request(transaction);
        const dataBankAccountDel = await requestBankAccountDel
            .input('LISTID', [businessId])
            .input('NAMEID', 'BUSINESSID')
            .input('TABLENAME', 'AM_BUSINESS_BANKACCOUNT')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        const bankAccountList = apiHelper.getValueFromObject(bodyParams, 'bank_account_list');
        if (bankAccountList && bankAccountList.length) {
            for (let i = 0; i < bankAccountList.length; i++) {
                const requestBankAccountCreate = new sql.Request(transaction);
                const resCreateBankAccount = await requestBankAccountCreate
                    .input('BUSINESSID', businessId)
                    .input(
                        'BANKACCOUNTBUSSINESSID',
                        apiHelper.getValueFromObject(bankAccountList[i], 'bank_account_business_id'),
                    )
                    .input('BANKID', apiHelper.getValueFromObject(bankAccountList[i], 'bank_id'))
                    .input('BANKNUMBER', apiHelper.getValueFromObject(bankAccountList[i], 'bank_number'))
                    .input('BANKBRANCH', apiHelper.getValueFromObject(bankAccountList[i], 'bank_branch'))
                    .input('BANKCODE', apiHelper.getValueFromObject(bankAccountList[i], 'bank_code'))
                    .input('ISDEFAULT', apiHelper.getValueFromObject(bankAccountList[i], 'is_default'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('BANKACCOUNTNAME', apiHelper.getValueFromObject(bankAccountList[i], 'bank_account_name'))
                    .execute('AM_BUSINESS_BANKACCOUNT_CreateOrUpdate_AdminWeb');
                if (
                    !resCreateBankAccount.recordset ||
                    !resCreateBankAccount.recordset.length ||
                    !resCreateBankAccount.recordset[0].RESULT
                ) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi thêm mới tài khoản ngân hàng.');
                }
            }
        }

        removeCacheOptions();

        await transaction.commit();
        return new ServiceResponse(true);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { Business: 'BusinessService.createOrUpdateBusiness' });

        return new ServiceResponse(false, error.message);
    }
};

const businessDetail = async (businessId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('BUSINESSID', businessId)
            .execute(PROCEDURE_NAME.AM_BUSINESS_GETBYID);

        let business = resData.recordset[0];

        if (business) {
            business = moduleClass.detail(business);
            business.misa_password = 'xxxxxxxxxx'; // mật khẩu mặc định cho bảo mật
            business.bank_account_list = moduleClass.bankAccountList(resData.recordsets[1]);

            return new ServiceResponse(true, '', business);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'BusinessService.businessDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteBusiness = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'BUSINESSID')
            .input('TABLENAME', 'AM_BUSINESS')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'BusinessService.deleteBusiness' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

// const changeStatusBusiness = async (businessId, authId, isActive) => {
//     try {
//         const pool = await mssql.pool;
//         await pool
//             .request()
//             .input('BUSINESSID', businessId)
//             .input('ISACTIVE', isActive)
//             .input('UPDATEDUSER', authId)
//             .execute(PROCEDURE_NAME.AM_BUSINESS_UPDATESTATUS);
//         removeCacheOptions();
//         return new ServiceResponse(true);
//     } catch (e) {
//         logger.error(e, {function: 'BusinessService.changeStatusBusiness'});

//         return new ServiceResponse(false);
//     }
// };

// const getOptions = async function (UserId) {
//     try {
//         const pool = await mssql.pool;
//         const data = await pool
//             .request()
//             .input('IsActive', API_CONST.ISACTIVE.ALL)
//             .input('UserId', UserId)
//             .execute(PROCEDURE_NAME.AM_BUSINESS_GETOPTIONS);

//         return data.recordset;
//     } catch (e) {
//         logger.error(e, {function: 'BusinessService.getOptions'});
//         return [];
//     }
// };

// const getOptionsByAreaList = async function (queryParams) {
//     try {
//         const pool = await mssql.pool;
//         const res = await pool
//             .request()
//             .input('COMPANYID', queryParams.company_id)
//             .input('AREAID', queryParams.area_id)
//             .execute(PROCEDURE_NAME.AM_BUSINESS_GETOPTIONS_BY_AREA_LIST);
//         const data = res.recordset;
//         return new ServiceResponse(true, '', moduleClass.optionsByAreaList(data));
//     } catch (e) {
//         logger.error(e, {function: 'BusinessService.getOptionsByAreaList'});
//         return [];
//     }
// };

// const getOptionsAll = async (queryParams = {}) => {
//     try {
//         // Get parameter
//         const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
//         const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
//         const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
//         const userId = apiHelper.getValueFromObject(queryParams, 'auth_id');
//         // Get data from cache
//         //const data = await cache.wrap(CACHE_CONST.AM_BUSINESS_OPTIONS, () => {
//         // return getOptions(userId);
//         //});
//         const data = await getOptions(userId);

//         // Filter values: empty, null, undefined
//         const idsFilter = ids.filter(item => {
//             return item;
//         });
//         const dataFilter = _.filter(data, item => {
//             let isFilter = true;
//             if (Number(isActive) !== API_CONST.ISACTIVE.ALL && Boolean(Number(isActive)) !== item.ISACTIVE) {
//                 isFilter = false;
//             }
//             if (idsFilter.length && !idsFilter.includes(item.ID.toString())) {
//                 isFilter = false;
//             }
//             if (parentId && Number(parentId) !== Number(item.PARENTID)) {
//                 isFilter = false;
//             }

//             if (isFilter) {
//                 return item;
//             }
//             return null;
//         });

//         return new ServiceResponse(true, '', moduleClass.options(dataFilter));
//     } catch (e) {
//         logger.error(e, {function: 'BusinessService.getOptionsAll'});

//         return new ServiceResponse(true, '', []);
//     }
// };

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.AM_BUSINESS_OPTIONS);
};

// const getOptionsByAreaId = async function (queryParams) {
//     try {
//         const pool = await mssql.pool;
//         const res = await pool
//             .request()
//             .input('AREAID', queryParams.area_id)
//             .execute(PROCEDURE_NAME.AM_BUSINESS_GETOPTIONSBYAREAID_ADMINWEB);
//         const data = res.recordset;
//         return new ServiceResponse(true, '', moduleClass.options(data));
//     } catch (e) {
//         logger.error(e, {function: 'BusinessService.getOptionsByAreaList'});
//         return [];
//     }
// };

const getOptions = async (queryParams) => {
    const pool = await mssql.pool;
    try {
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .execute('AM_BUSINESS_GetOptionsV3');

        const options = data?.recordset || [];

        return new ServiceResponse(true, 'success', moduleClass.optionsV3(options));
    } catch (e) {
        logger.error(e, { function: 'BusinessService.getOptions' });
        return new ServiceResponse(false, e?.message || 'Load business failed !');
    }
};

module.exports = {
    getBusinessList,
    createOrUpdateBusiness,
    businessDetail,
    deleteBusiness,
    getOptions,
    // changeStatusBusiness,
    // getOptionsAll,
    // getOptionsByAreaList,
    // getOptionsByAreaId,
};
