const timeKeepingClaimTypeClass = require('./time-keeping-claim-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const sql = require('mssql');
const _ = require('lodash');
const ErrorResponse = require('../../common/responses/error.response');

const getListTimeKeepingClaimType = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BLOCKID', apiHelper.getValueFromObject(queryParams, 'block_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            // .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            // .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_GetList_AdminWeb');

        const dataRecord = data.recordset;
        const dataList = timeKeepingClaimTypeClass.list(dataRecord)?.map((item) => ({
            ...item,
            blocks: item.blocks?.split('|'),
        }));

        return new ServiceResponse(true, 'Lấy danh sách loại giải trình thành công', {
            data: dataList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'areaService.getListTimeKeepingClaimType' });
        return new ServiceResponse(true, '', {});
    }
};

const detailTimeKeepingClaimType = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(body, 'time_keeping_claim_type_id'))
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(body, 'time_keeping_claim_id'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_GetById_AdminWeb');

        const [timeKeepingTypeClaimRecord, blockDepartmentRecord, usersQCRecord, userReviewRecord] = data.recordsets;
        if (timeKeepingTypeClaimRecord.length === 0)
            return new ServiceResponse(false, 'Không thấy loại giải trình', {});
        const review_levels = timeKeepingClaimTypeClass.reviewLevel(userReviewRecord);
        const result = [];
        const userNamesMap = new Map();
        for (const item of review_levels) {
            const userName = item.user_name;
            if (!userNamesMap.has(userName)) {
                userNamesMap.set(userName, true);
                const departments = [];
                let idepartments = item.departments
                // if(idepartments != null  && item.departments !== undefined)
                {
                    for (const d of item.departments?.split(',')) {
                        const [departmentData, position_id] = d.split('*');
                        const [id, name] = departmentData.split('#');
                        const departmentFind = departments.findIndex((de) => de.id === id);
                        if (departmentFind > -1) {
                            departments[departmentFind]?.positions?.push(position_id);
                        } else {
                            departments.push({
                                id,
                                value: id,
                                name,
                                positions: [position_id],
                            });
                        }
                    }
                }
                const department_id = parseInt(item.department_id);
                const user_name = parseInt(item.user_name);
                const itemFindIndex = result.findIndex((rs) => rs.department_id === department_id);
                if (itemFindIndex > -1) {
                    result[itemFindIndex]?.user_name?.push(user_name);
                } else {
                    result.push({
                        ...item,
                        department_id,
                        user_name: [user_name],
                        departments,
                    });
                }
            }
        }
        return new ServiceResponse(true, '', {
            ...timeKeepingClaimTypeClass.detail(timeKeepingTypeClaimRecord[0]),
            block_id: Array.from(
                new Set(
                    timeKeepingClaimTypeClass
                        .blockDepartment(blockDepartmentRecord)
                        ?.map((item) => parseInt(item.block_id)),
                ),
            ),
            department_id: Array.from(
                new Set(
                    timeKeepingClaimTypeClass
                        .blockDepartment(blockDepartmentRecord)
                        ?.map((item) => parseInt(item.department_id)),
                ),
            ),
            users_qc: timeKeepingClaimTypeClass.usersQC(usersQCRecord),
            review_levels: result,
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimTypeService.detailTimeKeepingClaimType' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateTimeKeepingClaimType = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const time_keeping_claim_type_id = apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id');
        const claimTypeRequest = new sql.Request(transaction);
        const data = await claimTypeRequest
            .input('TIMEKEEPINGCLAIMTYPEID', time_keeping_claim_type_id)
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('TIMEKEEPINGCLAIMTYPENAME', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISINFORMQC', apiHelper.getValueFromObject(bodyParams, 'is_inform_qc'))
            .input('CLAIMDEADLINE', apiHelper.getValueFromObject(bodyParams, 'claim_deadline'))
            .input('CLAIMLIMITS', apiHelper.getValueFromObject(bodyParams, 'claim_limits'))
            .input('LIMITSCYLE', apiHelper.getValueFromObject(bodyParams, 'limits_cycle'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(`HR_TIMEKEEPINGCLAIMTYPE_CreateOrUpdate_AdminWeb`);
        const timeKeepingClaimTypeTypeId = data.recordset[0].id;

        bodyParams.time_keeping_claim_type_id = timeKeepingClaimTypeTypeId;
        // Nếu là update thì xóa các table map
        if (time_keeping_claim_type_id) {
            const requestBlockDepartmentDel = new sql.Request(transaction);
            const resBlockDepartmentDel = await deleteTKCTBlockDepartment(bodyParams, requestBlockDepartmentDel);
            if (resBlockDepartmentDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resBlockDepartmentDel.getMessage());
            }

            const requestQC = new sql.Request(transaction);
            const resQC = await deleteTKCTQC(bodyParams, requestQC);
            if (resQC.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resQC.getMessage());
            }

            const requestReviewLevelDel = new sql.Request(transaction);
            const resReviewLevelDel = await deleteTKCTReviewLevel(bodyParams, requestReviewLevelDel);
            if (resReviewLevelDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resReviewLevelDel.getMessage());
            }
        }

        const requestBlockDepartment = new sql.Request(transaction);
        const blocks_departments = apiHelper.getValueFromObject(bodyParams, 'blocks_departments');
        for (const { block_id, department_id } of blocks_departments) {
            bodyParams.block_id = block_id;
            bodyParams.department_id = department_id;
            const resBlockDepartment = await createOrUpdateTKCTBlockDepartment(bodyParams, requestBlockDepartment);
            if (resBlockDepartment.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(true, resBlockDepartment.getMessage());
            }
        }

        const requestQC = new sql.Request(transaction);
        const users_qc = apiHelper.getValueFromObject(bodyParams, 'users_qc');
        for (const user_name of users_qc) {
            bodyParams.user_name = user_name;
            const resQC = await createOrUpdateTKCTQC(bodyParams, requestQC);
            if (resQC.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(true, resQC.getMessage());
            }
        }

        const requestReviewLevel = new sql.Request(transaction);
        const review_levels = apiHelper.getValueFromObject(bodyParams, 'review_levels');
        for (const { review_level_id, department_id, user_review } of review_levels) {
            for (const user of user_review) {
                bodyParams.review_level_id = review_level_id;
                bodyParams.department_id = department_id;
                bodyParams.user_review = user.id ?? user.value ?? user;
                const resReviewLevel = await createOrUpdateTKCTReviewLevel(bodyParams, requestReviewLevel);
                if (resReviewLevel.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(true, resReviewLevel.getMessage());
                }
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, '');
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'timeKeepingClaimTypeService.createOrUpdateTimeKeepingClaimType' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteTKCTBlockDepartment = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_BLOCK_DEPARTMENT_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.deleteTKCTBlockDepartment' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateTKCTBlockDepartment = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id'))
            .input('BLOCKID', apiHelper.getValueFromObject(bodyParams, 'block_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_BLOCK_DEPARTMENT_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.createOrUpdateTKCTBlockDepartment' });

        return new ServiceResponse(false, error.message);
    }
};

const deleteTKCTQC = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_QC_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.deleteTKCTQC' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateTKCTQC = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'user_name'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_QC_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.createOrUpdateTKCTQC' });

        return new ServiceResponse(false, error.message);
    }
};

const deleteTKCTReviewLevel = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_REVIEWLEVEL_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.deleteTKCTReviewLevel' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateTKCTReviewLevel = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id'))
            .input('TIMEKEEPINGREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'review_level_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('USERREVIEW', apiHelper.getValueFromObject(bodyParams, 'user_review'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_REVIEWLEVEL_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.createOrUpdateTKCTReviewLevel' });

        return new ServiceResponse(false, error.message);
    }
};

const deleteTimeKeepingClaimType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', apiHelper.getValueFromObject(bodyParams, 'list_id'))
            .input('NAMEID', 'TIMEKEEPINGCLAIMTYPEID')
            .input('TABLENAME', 'HR_TIMEKEEPINGCLAIMTYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimTypeService.deleteTimeKeepingClaimType' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_AREA_OPTIONS);
};

const getUserList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getSearch(queryParams))
            // .input('DEPARTMENTIDS', apiHelper.getValueFromObject(queryParams, 'department_ids'))
            .execute(`HR_TIMEKEEPINGCLAIMTYPE_GetUserList_AdminWeb`);

        const users = data.recordset;

        return new ServiceResponse(true, '', {
            data: timeKeepingClaimTypeClass.userList(users),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(users),
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimTypeService.getUserList' });
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateReviewLevel = async (params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const departments = apiHelper.getValueFromObject(params, 'departments');
        const review_level_id = apiHelper.getValueFromObject(params, 'time_keeping_review_level_id');
        const reviewLevelRequest = new sql.Request(transaction);
        const reviewLevel = await reviewLevelRequest
            .input('TIMEKEEPINGTYPEREVIEWLEVELID', review_level_id)
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(params, 'review_level_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_TIMEKEEPINGTYPEREVIEWLEVEL_CreateOrUpdate_AdminWeb');
        const reviewLevelId = reviewLevel.recordset[0]?.id;
        if (!reviewLevelId || reviewLevelId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo mức duyệt thất bại', null);
        }

        params.review_level_id = reviewLevelId;
        // Nếu là update thì xóa các table map
        if (review_level_id) {
            const requestRLDPDel = new sql.Request(transaction);
            const resRLDPDel = await deleteRLDepartmentPosition(params, requestRLDPDel);
            if (resRLDPDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resRLDPDel.getMessage());
            }
        }

        const requestRLDP = new sql.Request(transaction);
        for (const department of departments) {
            params.department_id = department.id;
            for (const position_id of department.positions) {
                params.position_id = position_id;
                const resRLDP = await createOrUpdateRLDepartmentPosition(params, requestRLDP);
                if (resRLDP.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(true, resRLDP.getMessage());
                }
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công mức duyệt');
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'timeKeepingClaimTypeService.createReviewLevel' });
        return new ServiceResponse(false, error);
    }
};

const deleteRLDepartmentPosition = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('TIMEKEEPINGTYPEREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'review_level_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGTYPEREVIEWLEVEL_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.deleteRLDepartmentPosition' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateRLDepartmentPosition = async (bodyParams = {}, reqTrans) => {
    try {
        const resPTPositionLevel = await reqTrans
            .input('TIMEKEEPINGTYPEREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'review_level_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('POSITIONID', apiHelper.getValueFromObject(bodyParams, 'position_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGTYPEREVIEWLEVEL_DEPARTMENT_POSITION_CreateOrUpdate_AdminWeb');

        const templateId = resPTPositionLevel.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.createOrUpdateRLDepartmentPosition' });

        return new ServiceResponse(false, error.message);
    }
};

const getListReviewLevel = async (params = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);

        const pool = await mssql.pool;
        const reviewLevel = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('HR_TIMEKEEPINGTYPEREVIEWLEVEL_GetList_AdminWeb');

        const dataRecord = reviewLevel.recordset;
        const reviewLevelData = timeKeepingClaimTypeClass.listReviewLevel(dataRecord);

        // Merge review level sane id
        const data = [];
        for (let item of reviewLevelData) {
            item = {
                ...item,
                departments: [
                    {
                        id: item.department_id,
                        name: item.department_name,
                        positions: [{ name: item.position_name, id: item.position_id }],
                    },
                ],
            };

            const match = data.find((r) => r.review_level_id === item.review_level_id);
            if (match) {
                const departmentExistIndex = match.departments.findIndex((d) => d.name === item.department_name);
                if (departmentExistIndex > -1) {
                    match.departments[departmentExistIndex].positions.push({
                        name: item.position_name,
                        id: item.position_id,
                    });
                } else {
                    match.departments = match.departments.concat(item.departments);
                }
            } else {
                data.push(item);
            }
        }

        return new ServiceResponse(true, 'Lấy danh sách mức duyệt thành công', {
            data,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.getListReviewLevel' });
        return [];
    }
};

const deleteReviewLevel = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', apiHelper.getValueFromObject(bodyParams, 'list_id'))
            .input('NAMEID', 'TIMEKEEPINGTYPEREVIEWLEVELID')
            .input('TABLENAME', 'HR_TIMEKEEPINGTYPEREVIEWLEVEL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimTypeService.deleteReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

const getUsersByPosition = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const reviewLevel = await pool
            .request()
            .input('POSITIONIDS', apiHelper.getValueFromObject(params, 'position_ids'))
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(params, 'time_keeping_claim_type_id'))
            .execute('HR_TIMEKEEPINGTYPEREVIEWLEVEL_GetUsersByPosition_AdminWeb');
        //console.log('getUsersByPosition',reviewLevel.recordsets);
        return new ServiceResponse(true, 'Lấy danh sách user thành công', reviewLevel.recordset);
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.getUsersByPosition' });
        return new ErrorResponse(false, error.message);
    }
};
/*
Lấy thông tin user và mức duyệt theo phiếu giải trình or là theo loại giải trình.
 */
const getListUsersReviewByTimeKeepingType = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const reviewLevel = await pool
            .request()
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(params, 'time_keeping_claim_id'))
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(params, 'time_keeping_claim_type_id'))
            .execute('HR_TIMEKEEPINGCLAIM_GetUsersByClainType_AdminWeb');
        return new ServiceResponse(true, 'Lấy danh sách user thành công', reviewLevel.recordset);
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.getUsersByPosition' });
        return new ErrorResponse(false, error.message);
    }
};

module.exports = {
    // done
    getUserList,
    createOrUpdateReviewLevel,
    getListReviewLevel,
    deleteReviewLevel,
    getUsersByPosition,
    createOrUpdateTimeKeepingClaimType,
    getListTimeKeepingClaimType,
    deleteTimeKeepingClaimType,
    detailTimeKeepingClaimType,
    getListUsersReviewByTimeKeepingType,
};
