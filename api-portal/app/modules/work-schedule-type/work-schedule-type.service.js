const database = require('../../models');
const workScheduleTypeClass = require('./work-schedule-type.class');
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
        const workScheduleType = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .execute('HR_WORKSCHEDULETYPE_GetList_AdminWeb');

        const listWorkScheduleType = workScheduleTypeClass.list(workScheduleType.recordsets[0]);

        return {
            list: listWorkScheduleType,
            total: apiHelper.getTotalData(workScheduleType.recordsets[0]),
        };
    } catch (error) {
        logger.error(error, { function: 'workScheduleTypeService.getList' });
        return [];
    }
};

// ok
const getDepartmentOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('MD_DEPARTMENT', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'workScheduleTypeService.getDepartmentOptions' });
        return [];
    }
};

// ok
const getCompanyOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('AM_COMPANY', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'workScheduleTypeService.getCompanyOptions' });
        return [];
    }
};

// ok
const getPositionOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('MD_POSITION', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'workScheduleTypeService.getPositionOptions' });
        return [];
    }
};

// ok
const getUserOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('SYS_USER', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'workScheduleTypeService.getUserOptions' });
        return [];
    }
};

// ok
const createOrUpdate = async (params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const work_schedule_type_id = apiHelper.getValueFromObject(params, 'id');
        const is_auto_review = apiHelper.getValueFromObject(params, 'is_auto_review', 0);
        const workScheduleTypeCreateOrUpdate = new sql.Request(transaction);
        const workScheduleType = await workScheduleTypeCreateOrUpdate
            .input('WORKSCHEDULETYPEID', work_schedule_type_id)
            .input('WORKSCHEDULETYPENAME', apiHelper.getValueFromObject(params, 'work_schedule_type_name', ''))
            .input('ISAUTOREVIEW', apiHelper.getValueFromObject(params, 'is_auto_review', 0))
            .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', ''))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_WORKSCHEDULETYPE_CreateOrUpdate_AdminWeb');
        removeCacheOptions();
        const workScheduleTypeId = workScheduleType.recordset[0].id;
        if (!workScheduleTypeId || workScheduleTypeId <= 0) {
            await transaction.commit();
            return new ServiceResponse(false, 'Tạo hoặc cập nhật loại lịch công tác thất bại', null);
        }

        const reasons = apiHelper.getValueFromObject(params, 'reasons', []);
        if (reasons.length > 0) {
            const workScheduleReasonRequest = new sql.Request(transaction);
            const WSTReasonRequest = new sql.Request(transaction);
            for (const reason of reasons) {
                params.work_schedule_type_id = work_schedule_type_id ?? workScheduleTypeId;
                params.WSReason = {
                    work_schedule_type_id: apiHelper.getValueFromObject(params, 'id'),
                    work_schedule_reason_id: reason.work_schedule_reason_id,
                    work_schedule_reason_name: reason.name,
                    description_reason: reason.description,
                };
                const dataReason = await createOrUpdateWorkScheduleReason(
                    params,
                    workScheduleReasonRequest,
                    WSTReasonRequest,
                );

                if (dataReason.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(
                        false,
                        dataReason.message ?? 'Tạo hoặc cập nhật loại lịch công tác thất bại',
                        null,
                    );
                }
            }
        }

        if (is_auto_review === 1) {
            await transaction.commit();
            return new ServiceResponse(true, 'Tạo thành công loại lịch công tác');
        }

        const reviewLevels = apiHelper.getValueFromObject(params, 'review_levels', []);
        const deleteWSTReviewLevelRequest = new sql.Request(transaction);
        const WSTReviewLevelRequest = new sql.Request(transaction);
        const WSTReviewLevelUserRequest = new sql.Request(transaction);
        const deleteResult = await deleteWSTReviewLevel(work_schedule_type_id, deleteWSTReviewLevelRequest);
        if (deleteResult.isFailed()) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Xóa loại lịch công tác thất bại', null);
        }
        for (const rl of reviewLevels) {
            params.WSTReviewLevel = {
                work_schedule_type_id: work_schedule_type_id ?? workScheduleTypeId,
                work_schedule_review_level_id: rl.work_schedule_review_level_id,
                work_schedule_type_review_level_id: rl.work_schedule_type_review_level_id,
                user_name: rl.user_name,
                is_auto_review: rl.is_auto_review,
                is_complete: rl.is_complete,
            };
            const data = await createWSTReviewLevel(params, WSTReviewLevelRequest, WSTReviewLevelUserRequest);
            if (data.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Tạo hoặc cập nhật loại lịch công tác thất bại', null);
            }
        }

        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, 'Tạo thành công loại lịch công tác');
    } catch (error) {
        logger.error(error, { function: 'WorkScheduleTypeService.createOrUpdate' });
        return new ServiceResponse(false, error.message ?? 'Tạo thất bại loại lịch công tác');
    }
};

const createOrUpdateWorkScheduleReason = async (params = {}, WSReasonRequest, WSTReasonRequest) => {
    try {
        const work_schedule_reason = apiHelper.getValueFromObject(params, 'WSReason');
        const work_schedule_type_id = apiHelper.getValueFromObject(params, 'work_schedule_type_id');
        const work_schedule_reason_id = apiHelper.getValueFromObject(work_schedule_reason, 'work_schedule_reason_id');
        const workScheduleReason = await WSReasonRequest.input('WORKSCHEDULEREASONID', work_schedule_reason_id)
            .input(
                'WORKSCHEDULEREASON',
                apiHelper.getValueFromObject(work_schedule_reason, 'work_schedule_reason_name', ''),
            )
            .input('WORKSCHEDULETYPEID', work_schedule_type_id)
            .input('DESCRIPTION', apiHelper.getValueFromObject(work_schedule_reason, 'description_reason', ''))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_WORKSCHEDULEREASON_CreateOrUpdate_AdminWeb');
        removeCacheOptions();
        const workScheduleReasonId = workScheduleReason.recordset[0].id;
        if (!workScheduleReasonId || workScheduleReasonId <= 0) {
            return new ServiceResponse(false, 'Tạo hoặc cập nhật lý do thất bại', null);
        }

        params.work_schedule_reason_id = work_schedule_reason_id ?? workScheduleReasonId;
        await createWSTReason(params, WSTReasonRequest);

        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công lý do');
    } catch (error) {
        logger.error(error, { function: 'WorkScheduleTypeService.createOrUpdateWorkScheduleReason' });
        return new ServiceResponse(false, error.message ?? 'Tạo thất bại lý do');
    }
};

const createWSTReason = async (params = {}, WSReasonRequest) => {
    try {
        const workScheduleReason = await WSReasonRequest.input(
            'WORKSCHEDULETYPEREASONID',
            apiHelper.getValueFromObject(params, 'work_schedule_type_reason_id'),
        )
            .input('WORKSCHEDULEREASONID', apiHelper.getValueFromObject(params, 'work_schedule_reason_id'))
            .input('WORKSCHEDULETYPEID', apiHelper.getValueFromObject(params, 'work_schedule_type_id', ''))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_WORKSCHEDULETYPE_REASON_Create_AdminWeb');
        const workScheduleTypeId = workScheduleReason.recordset[0].id;
        if (!workScheduleTypeId || workScheduleTypeId <= 0) {
            return new ServiceResponse(false, 'Tạo hoặc cập nhật WSTReason thất bại', null);
        }

        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công WSTReason');
    } catch (error) {
        logger.error(error, { function: 'WorkScheduleTypeService.createWSTReason' });
        return new ServiceResponse(false, 'Tạo thất bại WSTReason ');
    }
};

// ok
const createWSTReviewLevel = async (params = {}, WSTReviewLevelRequest, WSTReviewLevelUserRequest) => {
    try {
        const WSTReviewLevelParams = apiHelper.getValueFromObject(params, 'WSTReviewLevel');
        const work_schedule_review_level_id = apiHelper.getValueFromObject(
            WSTReviewLevelParams,
            'work_schedule_review_level_id',
        );
        const WSTReviewLevel = await WSTReviewLevelRequest.input(
            'WORKSCHEDULETYPEREVIEWLEVELID',
            apiHelper.getValueFromObject(WSTReviewLevelParams, 'work_schedule_type_review_level_id'),
        )
            .input('WORKSCHEDULETYPEID', apiHelper.getValueFromObject(WSTReviewLevelParams, 'work_schedule_type_id'))
            .input('WORKSCHEDULEREVIEWLEVELID', work_schedule_review_level_id)
            .input('ISCOMPLETE', apiHelper.getValueFromObject(WSTReviewLevelParams, 'is_complete', 0))
            .input('ISAUTOREVIEW', apiHelper.getValueFromObject(WSTReviewLevelParams, 'is_auto_review', 0))
            .execute('HR_WORKSCHEDULETYPE_REVIEWLEVEL_Create_AdminWeb');
        const WSTReviewLevelId = WSTReviewLevel.recordset[0].id;
        if (!WSTReviewLevelId || WSTReviewLevelId <= 0) {
            return new ServiceResponse(false, 'Tạo WSTReviewLevel thất bại', null);
        }

        params.WSTReviewLevelUser = {
            work_schedule_review_level_user_id: apiHelper.getValueFromObject(
                WSTReviewLevelParams,
                'work_schedule_review_level_user_id',
            ),
            work_schedule_review_level_id,
            work_schedule_type_review_level_id: WSTReviewLevelId,
            user_name: apiHelper.getValueFromObject(WSTReviewLevelParams, 'user_name'),
        };
        const data = await createWSTReviewLevelUser(params, WSTReviewLevelUserRequest);

        if (data.isFailed()) {
            return new ServiceResponse(false, 'Tạo WSTReviewLevel thất bại', null);
        }
        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công WSTReviewLevel');
    } catch (error) {
        logger.error(error, { function: 'WorkScheduleTypeService.createWSTReviewLevel' });
        return new ServiceResponse(false, error);
    }
};

const deleteWSTReviewLevel = async (work_schedule_type_id, deleteWSTReviewLevelRequest) => {
    try {
        const data = await deleteWSTReviewLevelRequest
            .input('WORKSCHEDULETYPEID', work_schedule_type_id)
            .execute('HR_WORKSCHEDULETYPE_REVIEWLEVEL_Delete_AdminWeb');
        const result = data.recordset[0].RESULT;
        if (!result || result <= 0) {
            return new ServiceResponse(false, 'Xóa WSTReviewLevel thất bại', null);
        }

        removeCacheOptions();
        return new ServiceResponse(true, '');
    } catch (error) {
        logger.error(error, { function: 'WorkScheduleTypeService.deleteWSTReviewLevel' });
        return new ServiceResponse(false, error);
    }
};

// ok
const createWSTReviewLevelUser = async (params = {}, WSTReviewLevelUserRequest) => {
    try {
        const WSTReviewLevelUserParams = apiHelper.getValueFromObject(params, 'WSTReviewLevelUser');
        const WSTreviewLevel = await WSTReviewLevelUserRequest.input(
            'WORKSCHEDULEREVIEWLEVELUSERID',
            apiHelper.getValueFromObject(WSTReviewLevelUserParams, 'work_schedule_review_level_user_id'),
        )
            .input(
                'WORKSCHEDULEREVIEWLEVELID',
                apiHelper.getValueFromObject(WSTReviewLevelUserParams, 'work_schedule_review_level_id'),
            )
            .input(
                'WORKSCHEDULETYPEREVIEWLEVELID',
                apiHelper.getValueFromObject(WSTReviewLevelUserParams, 'work_schedule_type_review_level_id'),
            )
            .input('USERNAME', apiHelper.getValueFromObject(WSTReviewLevelUserParams, 'user_name'))
            .execute('HR_WORKSCHEDULETYPE_REVIEWLEVEL_USER_Create_AdminWeb');
        const WSTreviewLevelId = WSTreviewLevel.recordset[0].id;
        if (!WSTreviewLevelId || WSTreviewLevelId <= 0) {
            return new ServiceResponse(false, 'Tạo WSTReviewLevelUser thất bại', null);
        }

        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công WSTReviewLevelUser');
    } catch (error) {
        logger.error(error, { function: 'WorkScheduleTypeService.createWSTReviewLevelUser' });
        return new ServiceResponse(false, error);
    }
};

// ok
const createReviewLevel = async (params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const isAllDepartment = apiHelper.getValueFromObject(params, 'is_apply_all_department');
        const isAllPosition = apiHelper.getValueFromObject(params, 'is_apply_all_position');
        const reviewLevelRequest = new sql.Request(transaction);
        const reviewLevel = await reviewLevelRequest
            .input(
                'WORKSCHEDULEREVIEWLEVELNAME',
                apiHelper.getValueFromObject(params, 'work_schedule_review_level_name', ''),
            )
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .input('ISAPPLYALLDEPARTMENT', isAllDepartment)
            .input('ISAPPLYALLPOSITION', isAllPosition)
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_WORKSCHEDULEREVIEWLEVEL_Create_AdminWeb');
        const reviewLevelId = reviewLevel.recordset[0].id;
        if (!reviewLevelId || reviewLevelId <= 0) {
            return new ServiceResponse(false, 'Tạo mức duyệt thất bại', null);
        }

        if (isAllDepartment === 1 && isAllPosition === 1) {
            await transaction.commit();
            return new ServiceResponse(true, 'Tạo thành công mức duyệt');
        }

        // create departments and positions
        params.work_schedule_review_level_id = reviewLevelId;
        const departments = apiHelper.getValueFromObject(params, 'departments');

        const reviewLevelApplyRequest = new sql.Request(transaction);
        for (const department of departments) {
            for (const position of department.positions) {
                params.department_id = department.id;
                params.position_id = position.id;
                const data = await createReviewLevelApply(params, reviewLevelApplyRequest);
                if (data.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo mức duyệt thất bại');
                }
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công mức duyệt');
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'WorkScheduleTypeService.createReviewLevel' });
        return new ServiceResponse(false, error);
    }
};

// ok
const createReviewLevelApply = async (params = {}, reviewLevelApplyRequest) => {
    try {
        const reviewLevelApply = await reviewLevelApplyRequest
            .input(
                'WORKSCHEDULEREVIEWLEVELID',
                apiHelper.getValueFromObject(params, 'work_schedule_review_level_id', null),
            )
            .input('DEPARTMENTID', apiHelper.getValueFromObject(params, 'department_id', null))
            .input('POSITIONID', apiHelper.getValueFromObject(params, 'position_id', null))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_WORKSCHEDULEREVIEWLEVEL_APPLYDEPARTMENT_Create_AdminWeb');
        removeCacheOptions();
        const reviewLevelApplyId = reviewLevelApply.recordset[0].id;
        if (!reviewLevelApplyId || reviewLevelApplyId <= 0) {
            return new ServiceResponse(false, 'Tạo ReviewLevelApply thất bại', null);
        }

        return new ServiceResponse(true, 'Tạo thành công ReviewLevelApply');
    } catch (error) {
        logger.error(error, { function: 'WorkScheduleTypeService.createReviewLevelApply' });
        return new ServiceResponse(false);
    }
};

// ok
const getListReviewLevel = async (params = {}) => {
    try {
        const currentPage = +apiHelper.getCurrentPage(params);
        const itemsPerPage = +apiHelper.getItemsPerPage(params);

        const pool = await mssql.pool;
        const reviewLevel = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('HR_WORKSCHEDULEREVIEWLEVEL_GetList_AdminWeb');

        const reviewLevelData = workScheduleTypeClass.listReviewLevel(reviewLevel.recordsets[0]);

        const data = [];
        for (let item of reviewLevelData) {
            item = {
                ...item,
                departments: [
                    {
                        id: item.department_id,
                        name: item.department_name,
                        positions: [{ id: item.position_id, name: item.position_name }],
                    },
                ],
            };

            const match = data.find((r) => r.work_schedule_review_level_id === item.work_schedule_review_level_id);
            if (match) {
                const departmentExistIndex = match.departments.findIndex((d) => d.name === item.departments[0].name);
                if (departmentExistIndex === -1) {
                    match.departments = match.departments.concat(item.departments);
                } else {
                    match.departments[departmentExistIndex].positions = match.departments[
                        departmentExistIndex
                    ].positions.concat(item.departments[0].positions);
                }
            } else {
                data.push(item);
            }
        }

        return {
            list: data,
            page: currentPage,
            limit: itemsPerPage,
            total: data.length,
        };
    } catch (error) {
        logger.error(error, { function: 'workScheduleTypeService.getList' });
        return [];
    }
};

// ok
const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const workScheduleType = await pool
            .request()
            .input('WORKSCHEDULETYPEID', id)
            .execute('HR_WORKSCHEDULETYPE_GetById_AdminWeb');
        const detailWorkScheduleType = workScheduleTypeClass.detail(workScheduleType.recordset);

        const data = [];
        for (let item of detailWorkScheduleType) {
            item = {
                ...item,
                reasons: [
                    {
                        name: item.work_schedule_reason,
                        description: item.description_reason,
                        work_schedule_reason_id: item.work_schedule_reason_id,
                        work_schedule_type_reason_id: item.work_schedule_type_reason_id,
                    },
                ],
            };
            if (item.work_schedule_review_level_id) {
                item = {
                    ...item,
                    review_levels: [
                        {
                            work_schedule_review_level_id: item.work_schedule_review_level_id,
                            work_schedule_review_level_name: item.work_schedule_review_level_name,
                            user_name: item.user_name,
                            is_auto_review: item.is_auto_review_child,
                            is_complete: item.is_complete,
                            work_schedule_type_review_level_id: item.work_schedule_type_review_level_id,
                            work_schedule_review_level_user_id: item.work_schedule_review_level_user_id,
                        },
                    ],
                };
            }

            const match = data.find((r) => r.work_schedule_type_id === item.work_schedule_type_id);
            if (match) {
                if (match.review_levels && !match.review_levels.find((r) => r.work_schedule_review_level_id === item.review_levels[0].work_schedule_review_level_id)) match.review_levels = match.review_levels.concat(item.review_levels);
                if (!match.reasons.find((r) => r.name === item.reasons[0].name))
                    match.reasons = match.reasons.concat(item.reasons);
            } else {
                data.push(item);
            }
        }

        if (data[0].is_auto_review === 1) {
            data[0].review_levels = [];
        }

        return data[0];
    } catch (error) {
        logger.error(error, { function: 'workScheduleTypeService.detail' });
        return null;
    }
};

// ok
const remove = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'WORKSCHEDULETYPEID')
            .input('TABLENAME', 'HR_WORKSCHEDULETYPE')
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

module.exports = {
    getList,
    createOrUpdate,
    detail,
    remove,
    getDepartmentOptions,
    getCompanyOptions,
    getPositionOptions,
    createReviewLevel,
    getListReviewLevel,
    getUserOptions,
};
