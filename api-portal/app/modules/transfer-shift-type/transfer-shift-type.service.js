const database = require('../../models');
const transferShiftTypeClass = require('./transfer-shift-type.class');
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

// done
const getList = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const transferShiftType = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .execute('HR_TRANSFERSHIFT_TYPE_GetList_AdminWeb');

        const listTransferShiftType = transferShiftTypeClass.list(transferShiftType.recordsets[0]);

        return {
            list: listTransferShiftType,
            total: apiHelper.getTotalData(transferShiftType.recordsets[0]),
        };
    } catch (error) {
        logger.error(error, { function: 'transferShiftTypeService.getList' });
        return [];
    }
};

// done
const getDepartmentOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('MD_DEPARTMENT', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'transferShiftTypeService.getDepartmentOptions' });
        return [];
    }
};

// done
const getCompanyOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('AM_COMPANY', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'transferShiftTypeService.getCompanyOptions' });
        return [];
    }
};

// done
const getPositionOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('MD_POSITION', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'transferShiftTypeService.getPositionOptions' });
        return [];
    }
};

// done
const getUserOptions = async (params = {}) => {
    try {
        const serviceRes = await optionService('SYS_USER', params);
        return serviceRes.getData();
    } catch (error) {
        logger.error(error, { function: 'transferShiftTypeService.getUserOptions' });
        return [];
    }
};

// done
const createOrUpdate = async (params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const transfer_shift_type_id = apiHelper.getValueFromObject(params, 'id');
        const is_auto_review = apiHelper.getValueFromObject(params, 'is_auto_review', 0);
        const label = transfer_shift_type_id ? 'Chỉnh sửa' : 'Tạo';
        const transferShiftTypeRequest = new sql.Request(transaction);
        const transferShiftType = await transferShiftTypeRequest
            .input('TRANSFERSHIFTTYPEID', transfer_shift_type_id)
            .input('TRANSFERSHIFTTYPENAME', apiHelper.getValueFromObject(params, 'transfer_shift_type_name', ''))
            .input('DESCRIPTION', apiHelper.getValueFromObject(params, 'description', ''))
            .input('ISANOTHERBUSINESS', apiHelper.getValueFromObject(params, 'is_another_business', 0))
            .input('ISAUTOREVIEW', is_auto_review)
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .execute('HR_TRANSFERSHIFT_TYPE_CreateOrUpdate_AdminWeb');
        removeCacheOptions();
        const transferShiftTypeId = transferShiftType.recordset[0].id;
        if (!transferShiftTypeId || transferShiftTypeId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, `${label} loại chuyển ca thất bại`, null);
        }

        if (is_auto_review === 1 && label === 'Tạo') {
            await transaction.commit();
            return new ServiceResponse(true, `${label} thành công loại chuyển ca`);
        }

        const reviewLevels = apiHelper.getValueFromObject(params, 'review_levels', []);

        const TSLevelUserRequest = new sql.Request(transaction);
        for (const rl of reviewLevels) {
            params.TSLevelUser = {
                transfer_shift_level_user_id: rl.transfer_shift_level_user_id,
                transfer_shift_review_level_id: rl.transfer_shift_review_level_id,
                transfer_shift_type_id: transfer_shift_type_id ?? transferShiftTypeId,
                user_name: rl.user_name,
                order_index: rl.order_index,
                is_auto_review: rl.is_auto_review,
                is_complete_review: rl.is_complete,
                is_auto_review_parent: is_auto_review,
            };
            const data = await createOrUpdateTSLevelUser(params, TSLevelUserRequest);
            if (data.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, `${label} loại chuyển ca thất bại`, null);
            }
        }

        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, `${label} thành công loại chuyển ca`);
    } catch (error) {
        logger.error(error, { function: 'TransferShiftTypeService.createOrUpdate' });
        return new ServiceResponse(false, 'Tạo hoặc cập nhật thất bại loại chuyển ca');
    }
};

// done
const createOrUpdateTSLevelUser = async (params = {}, TSLevelUserRequest) => {
    try {
        const TSLevelUserParams = apiHelper.getValueFromObject(params, 'TSLevelUser');
        const TSLevelUser = await TSLevelUserRequest.input(
            'TRANSFERSHIFTLEVELUSERID',
            apiHelper.getValueFromObject(TSLevelUserParams, 'transfer_shift_level_user_id'),
        )
            .input('REVIEWLEVELID', apiHelper.getValueFromObject(TSLevelUserParams, 'transfer_shift_review_level_id'))
            .input('TRANSFERSHIFTTYPEID', apiHelper.getValueFromObject(TSLevelUserParams, 'transfer_shift_type_id'))
            .input('USERNAME', apiHelper.getValueFromObject(TSLevelUserParams, 'user_name'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(TSLevelUserParams, 'order_index', 0))
            .input('ISCOMPLETEREVIEW', apiHelper.getValueFromObject(TSLevelUserParams, 'is_complete_review', 0))
            .input('ISAUTOREVIEW', apiHelper.getValueFromObject(TSLevelUserParams, 'is_auto_review', 0))
            .input('ISAUTOREVIEWPARENT', apiHelper.getValueFromObject(TSLevelUserParams, 'is_auto_review_parent', 0))
            .execute('HR_TRANSFERSHIFT_LEVEL_USER_Create_AdminWeb');
        const TSLevelUserId = TSLevelUser.recordset[0].id;
        if (!TSLevelUserId || TSLevelUserId <= 0) {
            return new ServiceResponse(false, 'Tạo TSLevelUser thất bại', null);
        }

        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công TSLevelUser');
    } catch (error) {
        logger.error(error, { function: 'TransferShiftTypeService.createOrUpdateTSLevelUser' });
        return new ServiceResponse(false, error);
    }
};

// done
const createReviewLevel = async (params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const isAllDepartment = apiHelper.getValueFromObject(params, 'is_apply_all_department');
        const isAllPosition = apiHelper.getValueFromObject(params, 'is_apply_all_position');
        const review_level_id = apiHelper.getValueFromObject(params, 'transfer_shift_review_level_id');
        const reviewLevelRequest = new sql.Request(transaction);
        const reviewLevel = await reviewLevelRequest
            .input('TRANSFERSHIFTREVIEWLEVELID', review_level_id)
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(params, 'transfer_shift_review_level_name', ''))
            .input('ORDERINDEX', apiHelper.getValueFromObject(params, 'order_index', 0))
            .input('COMPANYID', apiHelper.getValueFromObject(params, 'company_id'))
            .input('ISAPPLYALLDEPARTMENT', isAllDepartment)
            .input('ISAPPLYALLPOSITION', isAllPosition)
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_TRANSFERSHIFT_REVIEWLEVEL_Create_AdminWeb');
        const reviewLevelId = reviewLevel.recordset[0].id;
        if (!reviewLevelId || reviewLevelId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo mức duyệt thất bại', null);
        }

        if (isAllDepartment === 1 && isAllPosition === 1) {
            await transaction.commit();
            return new ServiceResponse(true, 'Tạo thành công mức duyệt');
        }

        // create departments and positions
        params.transfer_shift_review_level_id = review_level_id ?? reviewLevelId;
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
        logger.error(error, { function: 'TransferShiftTypeService.createReviewLevel' });
        return new ServiceResponse(false, error);
    }
};

// done
const createReviewLevelApply = async (params = {}, reviewLevelApplyRequest) => {
    try {
        const reviewLevelApply = await reviewLevelApplyRequest
            .input('REVIEWLEVELID', apiHelper.getValueFromObject(params, 'transfer_shift_review_level_id', null))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(params, 'department_id', null))
            .input('POSITIONID', apiHelper.getValueFromObject(params, 'position_id', null))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_TRANSFERSHIFTREVIEWLEVEL_APPLY_POSITION_Create_AdminWeb');
        removeCacheOptions();
        const reviewLevelApplyId = reviewLevelApply.recordset[0].id;
        if (!reviewLevelApplyId || reviewLevelApplyId <= 0) {
            return new ServiceResponse(false, 'Tạo ReviewLevelApply thất bại', null);
        }

        return new ServiceResponse(true, 'Tạo thành công ReviewLevelApply');
    } catch (error) {
        logger.error(error, { function: 'TransferShiftTypeService.createReviewLevelApply' });
        return new ServiceResponse(false);
    }
};

// done
const getListReviewLevel = async (params = {}) => {
    try {
        const currentPage = +apiHelper.getCurrentPage(params);
        const itemsPerPage = +apiHelper.getItemsPerPage(params);

        const pool = await mssql.pool;
        const reviewLevel = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('HR_TRANSFERSHIFT_REVIEWLEVEL_GetList_AdminWeb');

        const reviewLevelData = transferShiftTypeClass.listReviewLevel(reviewLevel.recordsets[0]);
        const totalRecord = apiHelper.getTotalData(reviewLevel.recordsets[1]);
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

            const match = data.find((r) => r.transfer_shift_review_level_id === item.transfer_shift_review_level_id);
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
            total: totalRecord,
        };
    } catch (error) {
        logger.error(error, { function: 'transferShiftTypeService.getListReviewLevel' });
        return [];
    }
};

// done
const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const transferShiftType = await pool
            .request()
            .input('TRANSFERSHIFTTYPEID', id)
            .execute('HR_TRANSFERSHIFT_TYPE_GetById_AdminWeb');

        const detailTransferShiftType = transferShiftTypeClass.detail(transferShiftType.recordset);

        const data = [];
        for (let item of detailTransferShiftType) {
            if (item.transfer_shift_review_level_id) {
                item = {
                    ...item,
                    review_levels: [
                        {
                            transfer_shift_review_level_id: item.transfer_shift_review_level_id,
                            transfer_shift_review_level_name: item.transfer_shift_review_level_name,
                            user_name: +item.user_name,
                            is_auto_review: item.is_auto_review_child,
                            is_complete: item.is_complete,
                            transfer_shift_level_user_id: item.transfer_shift_level_user_id,
                            departments: [
                                { id: item.department_id ?? 0, name: item.department_name ?? 'Tất cả phòng ban' },
                            ],
                        },
                    ],
                };
            }

            // Lấy thêm departments
            const match = data.find((r) => r.transfer_shift_type_id === item.transfer_shift_type_id);
            if (match) {
                if (match.review_levels) {
                    const reviewLevelExistsIndex = match.review_levels.findIndex(
                        (rl) =>
                            rl.transfer_shift_review_level_id === item.review_levels[0].transfer_shift_review_level_id,
                    );
                    if (reviewLevelExistsIndex === -1) {
                        match.review_levels = match.review_levels.concat(item.review_levels);
                    } else {
                        match.review_levels[reviewLevelExistsIndex].departments = match.review_levels[
                            reviewLevelExistsIndex
                        ].departments.concat(item.review_levels[reviewLevelExistsIndex].departments);
                    }
                }
            } else {
                data.push(item);
            }
        }

        return data[0];
    } catch (error) {
        logger.error(error, { function: 'transferShiftTypeService.detail' });
        return null;
    }
};

// DONE
const remove = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'TRANSFERSHIFTTYPEID')
            .input('TABLENAME', 'HR_TRANSFERSHIFT_TYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ManufacturerService.deleteManufacturer' });
        return new ServiceResponse(false, e.message);
    }
};

// done
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
