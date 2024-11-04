const stocksReviewLevelClass = require('../stocks-review-level/stocks-review-level.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListStocksReviewLevel = async (queryParams = {}) => {

    console.log(queryParams);

    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('STOCKSREVIEWLEVELTYPE', apiHelper.getValueFromObject(queryParams, 'stocks_type'))
            .execute(PROCEDURE_NAME.ST_STOCKSREVIEWLEVEL_GETLIST_ADMINWEB);
        const StocksReviewLevels = data.recordsets[0];
        const totalItem = data.recordsets[1][0].TOTAL;
        return new ServiceResponse(true, '', {
            data: stocksReviewLevelClass.list(StocksReviewLevels),
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'stocksReviewLevelService.getListStocksReviewLevel' });
        return new ServiceResponse(true, '', {});
    }
};

// detail StocksReviewLevel
const detailStocksReviewLevel = async stocksReviewLevelId => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSREVIEWLEVELID', stocksReviewLevelId)
            .execute(PROCEDURE_NAME.ST_STOCKSREVIEWLEVEL_GETBYID_ADMINWEB);
        let stocksReviewLevel = data.recordset;
        // If exists
        if (stocksReviewLevel && stocksReviewLevel.length > 0) {
            stocksReviewLevel = stocksReviewLevelClass.detail(stocksReviewLevel[0]);
            stocksReviewLevel.department = stocksReviewLevelClass.options(data.recordsets[1]);
            stocksReviewLevel.position = stocksReviewLevelClass.options(data.recordsets[2]);
            return new ServiceResponse(true, '', stocksReviewLevel);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksReviewLevelService.getListStocksReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

//Delete stocksReviewLevel
const deleteStocksReviewLevel = async (stocksReviewLevelId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSREVIEWLEVELID', stocksReviewLevelId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSREVIEWLEVEL_DELETE_ADMINWEB);
        return new ServiceResponse(true, RESPONSE_MSG.STOCKS_REVIEW_LEVEL.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'stocksReviewLevelService.deleteStocksReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

// change Status StocksReviewLevel
const changeStatusStocksReviewLevel = async (stocksReviewLevelId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSREVIEWLEVELID', stocksReviewLevelId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name')) // return administrator
            .execute(PROCEDURE_NAME.ST_STOCKSREVIEWLEVEL_UPDATESTATUS_ADMINWEB);
        return new ServiceResponse(true, 'change status success', { isSuccess: true });
    } catch (e) {
        logger.error(e, { function: 'stocksReviewLevelService.changeStatusStocksReviewLevel' });
        return new ServiceResponse(false);
    }
};

// create or update StocksReviewLevel
const createOrUpdateStocksReviewLevel = async bodyParams => {

    console.log(bodyParams);

    const pool = await mssql.pool;

    //check name
    const dataCheck = await pool
        .request()
        .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_id'))
        .input('STOCKSREVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_name'))
        .execute(PROCEDURE_NAME.ST_STOCKSREVIEWLEVEL_CHECKNAME_ADMINWEB);
    if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
        return new ServiceResponse(false, RESPONSE_MSG.STOCKS_REVIEW_LEVEL.EXISTS_NAME, null);
    }

    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const data = new sql.Request(transaction);
        const resultData = await data
            .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_id'))
            .input('STOCKSREVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISSTOCKSIN', apiHelper.getValueFromObject(bodyParams, 'is_stocks_in'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('ISSTOCKSOUT', apiHelper.getValueFromObject(bodyParams, 'is_stocks_out'))
            .input('ISSTOCKSTAKE', apiHelper.getValueFromObject(bodyParams, 'is_stocks_take'))
            .input('ISSTOCKSTRANSFER', apiHelper.getValueFromObject(bodyParams, 'is_stocks_transfer'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ISAPPLYALLDEPARTMENT', apiHelper.getValueFromObject(bodyParams, 'is_apply_all_department'))
            .input('ISAPPLYALLPOSITION', apiHelper.getValueFromObject(bodyParams, 'is_apply_all_position'))
            .execute(PROCEDURE_NAME.ST_STOCKSREVIEWLEVEL_CREATEORUPDATE_ADMINWEB);
        const stocksRlId = resultData.recordset[0].RESULT;
        const id = apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_id');

        if (!stocksRlId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm mới mức duyệt thất bại.');
        }

        if (id) {
            const requestStocksRlDepartmentDelete = new sql.Request(transaction);
            const resultStocksRLDepartmentDelete = await requestStocksRlDepartmentDelete
                .input('STOCKSREVIEWLEVELID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('ST_STOCKSREVIEWLEVEL_DEPARTMENTPOSITION_Delete_AdminWeb');
            if (!resultStocksRLDepartmentDelete.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa phòng ban và vị trí mức duyệt thất bại.');
            }

            // const requestStocksRlPositionDelete = new sql.Request(transaction);
            // const resultStocksRLPositionDelete = await requestStocksRlPositionDelete
            //     .input('STOCKSREVIEWLEVELID', id)
            //     .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            //     .execute('ST_STOCKSREVIEWLEVEL_APPLY_POSITION_Delete_AdminWeb');
            // if (!resultStocksRLPositionDelete.recordset[0].RESULT) {
            //     await transaction.rollback();
            //     return new ServiceResponse(false, 'Xóa vị trí duyệt thất bại.')
            // }
        }
        // Thêm phòng ban duyệt
        let departments = apiHelper.getValueFromObject(bodyParams, 'department', []).filter(x => x !== -1);
        console.log(departments);

        if (departments && departments.length) {
            for (let i = 0; i < departments.length; i++) {
                const requestStocksRlDepartmentCreate = new sql.Request(transaction);
                const resultStocksRLDepartmentCreate = await requestStocksRlDepartmentCreate
                    .input('STOCKSREVIEWLEVELID', stocksRlId)
                    .input('DEPARTMENTID', departments[i])
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('ST_STOCKSREVIEWLEVEL_DEPARTMENTPOSITION_CreateOrUpdate_AdminWeb');

                if (!resultStocksRLDepartmentCreate.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm mới phòng ban duyệt thất bại.');
                }
            }
        }
        // Thêm chức vụ duyệt
        let positions = apiHelper.getValueFromObject(bodyParams, 'position', []).filter(x => x !== -1);
        console.log(positions);
        if (positions && positions.length) {
            for (let i = 0; i < positions.length; i++) {
                const requestStocksRlPositionCreate = new sql.Request(transaction);
                const resultStocksRLPositionCreate = await requestStocksRlPositionCreate
                    .input('STOCKSREVIEWLEVELID', stocksRlId)
                    .input('POSITIONID', positions[i])
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('ST_STOCKSREVIEWLEVEL_DEPARTMENTPOSITION_CreateOrUpdate_AdminWeb');

                if (!resultStocksRLPositionCreate.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm mới chức vụ duyệt thất bại.');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Create stocks review level success!!', stocksRlId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'stocksRLService.createUserOrUpdate' });
        return new ServiceResponse(false, e);
    }
};

const getOptionsByType = async (type = 0) => {
    try {
        const pool = await mssql.pool;
        const resOptions = await pool
            .request()
            .input('TYPE', type)
            .execute('ST_STOCKSREVIEWLEVEL_GetOptionType_AdminWeb');
        return new ServiceResponse(true, '', stocksReviewLevelClass.options(resOptions.recordset));
    } catch (error) {
        logger.error(error, { function: 'stocksRLService.getOptionsByType' });
        return new ServiceResponse(false, e);
    }
};

module.exports = {
    getListStocksReviewLevel,
    detailStocksReviewLevel,
    deleteStocksReviewLevel,
    changeStatusStocksReviewLevel,
    createOrUpdateStocksReviewLevel,
    getOptionsByType
};
