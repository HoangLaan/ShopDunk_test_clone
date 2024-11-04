const sql = require('mssql');
const expendTypeClass = require('../expend-type/expend-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getListExpendType = async (queryParams) => {
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
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .execute('MD_EXPENDTYPE_GetList_AdminWeb_V2');

        const item = data.recordset;

        let expendList = expendTypeClass.list(item);

        if (expendList && expendList.length > 0) {
            const promiseList = expendList.map(async (item) => {
                item.child_count = await _countExpendTypeByParent(item.expend_type_id, queryParams);
                return item;
            });
            expendList = await Promise.all(promiseList);
        }

        return new ServiceResponse(true, '', {
            data: expendList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getListExpendType' });
        return new ServiceResponse(true, '', {});
    }
};

const _countExpendTypeByParent = async (parent_id, queryParams) => {
    const pool = await mssql.pool;
    const data = await pool
        .request()
        .input('KEYWORD', apiHelper.getSearch(queryParams))
        .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
        .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
        .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
        .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id', 0))
        .input('PARENTID', parent_id)
        .execute('MD_EXPENDTYPE_CountByParent_AdminWeb');

    return data?.recordset[0]?.COUNT || 0;
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
            data: expendTypeClass.listBankAccount(item),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getListBankAccount' });
        return new ServiceResponse(true, '', {});
    }
};

const detailExpendType = async (expend_type_id) => {
    try {
        const pool = await mssql.pool;

        const expendTypeRes = await pool
            .request()
            .input('EXPENDTYPEID', expend_type_id)
            .execute('MD_EXPENDTYPE_GetById_AdminWeb');

        let expendTypeData = expendTypeRes.recordset;
        let business_id_list = (expendTypeRes.recordsets[1] ?? []).map((e) => parseInt(e?.BUSINESSIDLIST));

        // If exists
        if (expendTypeData && expendTypeData.length > 0) {
            expendTypeData = expendTypeClass.detail(expendTypeData[0]);
            expendTypeData.business_id_list = business_id_list;

            const levelUserRes = await pool
                .request()
                .input('EXPENDTYPEID', expend_type_id)
                .execute('SL_RECEIPTPAYMENT_LEVEL_USER_GetByExpendType_AdminWeb');
            levelUserData = expendTypeClass.levelUserDetailList(levelUserRes.recordset);
            levelUserData.forEach((_, index, levelUserData) => {
                levelUserData[index].user_review_list = levelUserData[index].user_review_list?.split('|');
            });

            expendTypeData.review_level_user_list = levelUserData;

            const bankAccountRes = await pool
                .request()
                .input('EXPENDTYPEID', expend_type_id)
                .execute('MD_EXPENDTYPE_BANKACCOUNT_GetBankAccountByExpendType_AdminWeb');
            const bankAccountData = expendTypeClass.listBankAccount(bankAccountRes.recordset);

            expendTypeData.bank_account_list = bankAccountData;
            return new ServiceResponse(true, '', expendTypeData);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.detailExpendType' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteExpendType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'EXPENDTYPEID')
            .input('TABLENAME', 'MD_EXPENDTYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'ExpendTypeService.service.deleteExpendType' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (bodyParams) => {
    try {
        const pool = await mssql.pool;

        const expend_type_id = apiHelper.getValueFromObject(bodyParams, 'expend_type_id');

        const data = await pool
            .request()
            .input('EXPENDTYPEID', expend_type_id)
            .input('EXPENDTYPECODE', apiHelper.getValueFromObject(bodyParams, 'expend_type_code'))
            .input('EXPENDTYPENAME', apiHelper.getValueFromObject(bodyParams, 'expend_type_name'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id', 0))
            .input('BUSINESSIDLIST', apiHelper.getValueFromObject(bodyParams, 'business_id_list', []))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_EXPENDTYPE_CreateOrUpdate_AdminWeb');
        const expendTypeId = data.recordset[0].RESULT;

        if (Boolean(expend_type_id)) {
            await pool
                .request()
                .input('EXPENDTYPEID', expend_type_id)
                .execute('SL_RECEIPTPAYMENT_LEVEL_USER_Delete_AdminWeb');

            await pool
                .request()
                .input('EXPENDTYPEID', expend_type_id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('MD_EXPENDTYPE_BANKACCOUNT_Delete_AdminWeb');
        }

        //create level user
        const review_level_user_list = apiHelper.getValueFromObject(bodyParams, 'review_level_user_list', []);
        if (review_level_user_list.length > 0) {
            review_level_user_list.forEach(async (review_level_user) => {
                if (Boolean(review_level_user.is_auto_review)) {
                    await pool
                        .request()
                        .input('ISAUTOREVIEW', true)
                        .input('ISCOMPLETEREVIEW', review_level_user.is_complete_review)
                        .input('ORDERINDEX', review_level_user.order_index)
                        .input('EXPENDTYPEID', expendTypeId)
                        .input('REVIEWLEVELID', review_level_user.review_level_id)
                        .execute('SL_RECEIPTPAYMENT_LEVEL_USER_Create_AdminWeb');
                } else {
                    review_level_user.user_review_list.forEach(async (user_review) => {
                        await pool
                            .request()
                            .input('USERREVIEW', user_review)
                            .input('ISAUTOREVIEW', false)
                            .input('ISCOMPLETEREVIEW', review_level_user.is_complete_review)
                            .input('ORDERINDEX', review_level_user.order_index)
                            .input('EXPENDTYPEID', expendTypeId)
                            .input('REVIEWLEVELID', review_level_user.review_level_id)
                            .execute('SL_RECEIPTPAYMENT_LEVEL_USER_Create_AdminWeb');
                    });
                }
            });
        }

        const bank_account_business_ids = apiHelper.getValueFromObject(bodyParams, 'bank_account_business_ids', []);
        if (bank_account_business_ids.length > 0) {
            for (const account_business_id of bank_account_business_ids) {
                await pool
                    .request()
                    .input('EXPENDTYPEID', expendTypeId)
                    .input('BANKACCOUNTID', account_business_id)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('MD_EXPENDTYPE_BANKACCOUNT_Create_AdminWeb');
            }
        }

        removeCacheOptions();
        return new ServiceResponse(true, '', expendTypeId);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.createOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const getExpendTypeOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .execute('MD_EXPENDTYPE_GetExpendTypeOptions_AdminWeb');
        const data_ = expendTypeClass.options(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getListExpendTypeOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getCompanyOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('MD_EXPENDTYPE_GetCompanyOptions_AdminWeb');
        const data_ = expendTypeClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getListCompanyOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getBusinessOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .execute('MD_EXPENDTYPE_GetBusinessOptions_AdminWeb');

        const data_ = expendTypeClass.option(data.recordset);

        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getBusinessOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getUserOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('REVIEWLEVELID', apiHelper.getValueFromObject(queryParams, 'review_level_id'))
            .execute('SL_RECEIPTPAYMENT_LEVEL_USER_GetUserOptions_AdminWeb');

        const data_ = expendTypeClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getUserOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getDepartmentOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .execute('MD_EXPENDTYPE_GetDepartmentOptions_AdminWeb');
        const data_ = expendTypeClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getDepartmentOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getPositionOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .execute('MD_EXPENDTYPE_GetPositionOptions_AdminWeb');
        const data_ = expendTypeClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getPositionOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getReviewLevelList = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute('SL_RECEIPTPAYMENT_REVIEWLEVEL_GetList_AdminWeb');

        const item = data.recordset;
        return new ServiceResponse(true, '', {
            data: expendTypeClass.reviewLevelList(item),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.getReviewLevelList' });
        return new ServiceResponse(true, '', {});
    }
};

const createReviewLevel = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();

        const is_apply_all_department = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_department', false);
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');

        const request = new sql.Request(transaction);
        const reviewLevelData = await request
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'review_level_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ISAPPLYALLDEPARTMENT', is_apply_all_department)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', true))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_RECEIPTPAYMENT_REVIEWLEVEL_Create_AdminWeb');

        const reviewLevelId = reviewLevelData.recordset[0]?.RESULT;
        if (!reviewLevelId) {
            transaction.rollback();
            return new ServiceResponse(false, 'Tạo mức duyệt thất bại !');
        }

        if (!is_apply_all_department) {
            const department_ids = apiHelper.getValueFromObject(bodyParams, 'department_id_list', []);
            const position_list = apiHelper.getValueFromObject(bodyParams, 'position_list', []);
            if (department_ids?.length > 0) {
                for (const departmentId of department_ids) {
                    const positionListItem = position_list.find((item) => item.department_id === departmentId);
                    if (positionListItem) {
                        let positionIds = positionListItem?.position_id?.map((_) => _.id);

                        if (positionIds.includes(0)) {
                            // null is apply all position
                            positionIds = [null];
                        }

                        for (const id of positionIds) {
                            const request = new sql.Request(transaction);
                            const res = await request
                                .input('REVIEWLEVELID', reviewLevelId)
                                .input('DEPARTMENTID', departmentId)
                                .input('POSITIONID', id)
                                .input('CREATEDUSER', authName)
                                .execute('SL_RECEIPTPAYMENT_REVIEWLEVEL_APPLY_Create_AdminWeb');

                            if (!res.recordset[0]?.RESULT) {
                                transaction.rollback();
                                return new ServiceResponse(false, 'Tạo mức duyệt thất bại !');
                            }
                        }
                    }
                }
            }
        }

        transaction.commit();
        return new ServiceResponse(true, '', reviewLevelId);
    } catch (e) {
        transaction.rollback();
        logger.error(e, { function: 'expendTypeService.createReviewLevel' });
        return new ServiceResponse(false, '', {});
    }
};

const deleteReviewLevel = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'REVIEWLEVELID')
            .input('TABLENAME', 'SL_RECEIPTPAYMENT_REVIEWLEVEL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'expendTypeService.deleteReviewLevel' });
        return new ServiceResponse(false, '', {});
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_EXPENDTYPE_OPTION);
};

module.exports = {
    getListExpendType,
    deleteExpendType,
    detailExpendType,
    createOrUpdate,
    getExpendTypeOptions,
    getCompanyOptions,
    getBusinessOptions,
    getUserOptions,
    getDepartmentOptions,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
    getPositionOptions,
    getListBankAccount,
};
