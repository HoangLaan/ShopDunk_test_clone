const moduleClass = require('../regime-type/regime-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');

const getListRegimeType = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams, '');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword.trim())
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id', 0))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id', 0))
            .execute('HR_REGIMETYPE_GetList_AdminWeb');

        const item = data.recordset;
        return new ServiceResponse(true, '', {
            data: moduleClass.list(item),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(item),
        });
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.getListRegimeType' });
        return new ServiceResponse(true, '', {});
    }
};

const detailRegimeType = async (regime_type_id) => {
    try {
        const pool = await mssql.pool;

        const regimeTypeRes = await pool
            .request()
            .input('REGIMETYPEID', regime_type_id)
            .execute('HR_REGIMETYPE_GetById_AdminWeb');

        let regimeTypeData = regimeTypeRes.recordset;

        // If exists
        if (regimeTypeData && regimeTypeData.length > 0) {
            regimeTypeData = moduleClass.detail(regimeTypeData[0]);

            levelUserData = moduleClass.levelUserDetailList(regimeTypeRes.recordsets[1]);
            levelUserData.forEach((_, index, levelUserData) => {
                levelUserData[index].user_review_list = levelUserData[index].user_review_list
                    ?.split('|')
                    .map((item) => {
                        const temp = item.split('#');
                        return {
                            value: temp[0],
                            label: temp[1],
                        };
                    });
            });

            regimeTypeData.review_level_user_list = levelUserData;

            return new ServiceResponse(true, '', regimeTypeData);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.detailRegimeType' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteRegimeType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'REGIMETYPEID')
            .input('TABLENAME', 'HR_REGIMETYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'RegimeTypeService.service.deleteRegimeType' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const regime_type_id = apiHelper.getValueFromObject(bodyParams, 'regime_type_id');
        const is_auto_review = apiHelper.getValueFromObject(bodyParams, 'is_auto_review');

        const createRegimeTypeRequest = new sql.Request(transaction);
        const data = await createRegimeTypeRequest
            .input('REGIMETYPEID', regime_type_id)
            .input('REGIMETYPECODE', apiHelper.getValueFromObject(bodyParams, 'regime_type_code'))
            .input('REGIMETYPENAME', apiHelper.getValueFromObject(bodyParams, 'regime_type_name'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id', 0))
            .input('POLICY', apiHelper.getValueFromObject(bodyParams, 'policy'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('ISAUTOREVIEW', is_auto_review)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_REGIMETYPE_CreateOrUpdate_AdminWeb');
        const regimeTypeId = data.recordset[0].RESULT;

        if (regimeTypeId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo loại chế độ');
        }

        if (Boolean(regime_type_id)) {
            await pool
                .request()
                .input('REGIMETYPEID', regime_type_id)
                .execute('HR_REGIMETYPE_REVIEWLEVEL_Delete_AdminWeb');
        }

        if (!is_auto_review) {
            //create level user
            const review_level_user_list = apiHelper.getValueFromObject(bodyParams, 'review_level_user_list', []);
            if (review_level_user_list.length > 0) {
                for (let i = 0; i < review_level_user_list.length; i++) {
                    const review_level_user = review_level_user_list[i];
                    const createReviewLevelUserRequest = new sql.Request(transaction);
                    await createReviewLevelUserRequest
                        .input('USERREVIEWLIST', review_level_user.user_review_list)
                        .input('ISAUTOREVIEW', review_level_user.is_auto_review)
                        .input('ISCOMPLETE', review_level_user.is_complete_review)
                        .input('ORDERINDEX', review_level_user.order_index)
                        .input('REGIMETYPEID', regimeTypeId)
                        .input('REGIMEREVIEWLEVELID', review_level_user.review_level_id)
                        .execute('HR_REGIMETYPE_REVIEWLEVEL_Create_AdminWeb');
                }
            }
        }

        removeCacheOptions();

        await transaction.commit();
        return new ServiceResponse(true, '', regimeTypeId);
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.createOrUpdate' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const getUserOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('REGIMEREVIEWLEVELID', apiHelper.getValueFromObject(queryParams, 'review_level_id'))
            .execute('HR_REGIMEREVIEWLEVEL_GetUserOptions_AdminWeb');

        const data_ = moduleClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.getUserOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getDepartmentOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .execute('MD_REGIMETYPE_GetDepartmentOptions_AdminWeb');
        const data_ = moduleClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.getDepartmentOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getPositionOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .execute('MD_REGIMETYPE_GetPositionOptions_AdminWeb');
        const data_ = moduleClass.option(data.recordset);
        removeCacheOptions();
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.getPositionOptions' });
        return new ServiceResponse(false, '', {});
    }
};

const getReviewLevelList = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute('HR_REGIMEREVIEWLEVEL_GetList_AdminWeb');

        let reviewLevelList = moduleClass.reviewLevelList(resData.recordset);
        let departmentList = moduleClass.departmentList(resData.recordsets[1]);
        let positionList = moduleClass.positionList(resData.recordsets[2]);

        for (let i = 0; i < reviewLevelList.length; i++) {
            reviewLevelList[i].department_list = departmentList
                .filter((department) => department.review_level_id === reviewLevelList[i].review_level_id)
                .map((department) => {
                    const position_list = positionList
                        .filter(
                            (position) =>
                                position.review_level_id === reviewLevelList[i].review_level_id &&
                                position.department_id === department.department_id,
                        )
                        .map((position) => {
                            if (position.position_id && position.position_id !== -1) {
                                return {
                                    position_id: position.position_id,
                                    position_name: position.position_name,
                                };
                            }
                        });

                    return {
                        department_id: department.department_id,
                        department_name: department.department_name,
                        position_list,
                    };
                });
        }

        return new ServiceResponse(true, '', {
            data: reviewLevelList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.getReviewLevelList' });
        return new ServiceResponse(true, '', {});
    }
};

const createReviewLevel = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const is_apply_all_department = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_department', false);
        const createReviewLevelRequest = new sql.Request(transaction);
        const reviewLevelRes = await createReviewLevelRequest
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'review_level_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ISAPPLYALLDEPARTMENT', is_apply_all_department)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', true))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_REGIMEREVIEWLEVEL_Create_AdminWeb');

        const reviewLevelId = reviewLevelRes.recordset[0].RESULT;
        if (reviewLevelId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo mức duyệt');
        }

        if (!is_apply_all_department) {
            const department_ids = apiHelper.getValueFromObject(bodyParams, 'department_ids', []);
            const position_list = apiHelper.getValueFromObject(bodyParams, 'position_list', []);

            if (department_ids?.length > 0) {
                for (let i = 0; i < department_ids.length; i++) {
                    const department_id = department_ids[i];
                    const find = position_list.find((item) => item.department_id === department_id);
                    const position_ids = find ? find.position_ids : '';

                    if (position_ids.find((item) => item.value === -1)) {
                        const createReviewLevelApplyRequest = new sql.Request(transaction);
                        const reviewLevelApplyRes = await createReviewLevelApplyRequest
                            .input('REVIEWLEVELID', reviewLevelId)
                            .input('DEPARTMENTID', department_id)
                            .input('POSITIONID', -1)
                            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                            .execute('HR_REGIMEREVIEWLEVEL_APPLYDEPARTMENT_Create_AdminWeb');

                        if (reviewLevelApplyRes.recordset[0].RESULT <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, 'Lỗi thêm phòng ban, vị trí');
                        }
                    } else {
                        for (let j = 0; j < position_ids.length; j++) {
                            const position_id = position_ids[j].value;

                            const createReviewLevelApplyRequest = new sql.Request(transaction);
                            const reviewLevelApplyRes = await createReviewLevelApplyRequest
                                .input('REVIEWLEVELID', reviewLevelId)
                                .input('DEPARTMENTID', department_id)
                                .input('POSITIONID', position_id)
                                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                .execute('HR_REGIMEREVIEWLEVEL_APPLYDEPARTMENT_Create_AdminWeb');

                            if (reviewLevelApplyRes.recordset[0].RESULT <= 0) {
                                await transaction.rollback();
                                return new ServiceResponse(false, 'Lỗi thêm phòng ban, vị trí');
                            }
                        }
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', reviewLevelRes.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.createReviewLevel' });
        await transaction.rollback();
        return new ServiceResponse(false, '', {});
    }
};

const deleteReviewLevel = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        console.log(list_id);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'REGIMEREVIEWLEVELID')
            .input('TABLENAME', 'HR_REGIMEREVIEWLEVEL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'regimeTypeService.deleteReviewLevel' });
        return new ServiceResponse(false, '', {});
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_REGIMETYPE_OPTION);
};

module.exports = {
    getListRegimeType,
    deleteRegimeType,
    detailRegimeType,
    createOrUpdate,
    getUserOptions,
    getDepartmentOptions,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
    getPositionOptions,
};
