const timeKeepingClaimTypeClass = require('./time-keeping-claim-type.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const ErrorResponse = require('../../common/responses/error.response');

const countTimesExplained = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
        .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
        .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(body, 'time_keeping_claim_type_id'))
        .execute(`HR_TIMEKEEPINGCLAIM_CountTimesExplain_App`);

        return new ServiceResponse(true, '', data.recordset[0]?.TOTALEXPLAIN);
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.countTimesExplained' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'search'))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMTYPE_GetOptions_App');

        const dataRecord = data.recordset;
        const user_name = apiHelper.getValueFromObject(params, 'auth_name');
        const result = await Promise.all(timeKeepingClaimTypeClass.options(dataRecord)?.map(async (item) => {
            const countData = await countTimesExplained({time_keeping_claim_type_id: item.id, user_name})
            return {
                ...item,
                limit_times_explain: parseInt(item.limit_times_explain ?? 0),
                total_explained: countData.getData() ?? 0
            }
        }));

        return new ServiceResponse(true, 'Lấy danh sách loại giải trình thành công', result);
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.getOptions' });
        return new ErrorResponse(false, error.message);
    }
};

const detailTimeKeepingClaimType = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
        .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(body, 'time_keeping_claim_type_id'))
        .execute(`HR_TIMEKEEPINGCLAIMTYPE_GetById_App`);

        const [timeKeepingTypeClaimRecord, blockDepartmentRecord, usersQCRecord, userReviewRecord ] = data.recordsets;
        if(timeKeepingTypeClaimRecord.length === 0) return new ServiceResponse(false, 'Không thấy loại giải trình', {});

        const review_levels = timeKeepingClaimTypeClass.reviewLevel(userReviewRecord)
        const result = [];
        for (const item of review_levels) {
            const departments = []
            for (const d of item.departments?.split(",")) {
                const [departmentData, position_id] = d.split("*")
                const [id, name] = departmentData.split("#");
                const departmentFind = departments.findIndex(de => de.id === id)
                if(departmentFind > -1){
                    departments[departmentFind]?.positions?.push(position_id)
                } else {
                    departments.push({
                        id, 
                        value: id,
                        name,
                        positions: [position_id]
                    })
                }
            }
            result.push({
                ...item,
                department_id: parseInt(item.department_id),
                user_name: parseInt(item.user_name),
                departments
            })
        }

        return new ServiceResponse(true, '', {
            ...timeKeepingClaimTypeClass.detail(timeKeepingTypeClaimRecord[0]),
            block_id: Array.from(new Set(timeKeepingClaimTypeClass.blockDepartment(blockDepartmentRecord)?.map(item => parseInt(item.block_id)))),
            department_id: Array.from(new Set(timeKeepingClaimTypeClass.blockDepartment(blockDepartmentRecord)?.map(item => parseInt(item.department_id)))),
            users_qc: timeKeepingClaimTypeClass.usersQC(usersQCRecord),
            review_levels: result,
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimTypeService.detailTimeKeepingClaimType' });
        return new ServiceResponse(false, e.message);
    }
};

const getReviewLevels = async (body = {}) => {
    try {
       const data = await detailTimeKeepingClaimType({time_keeping_claim_type_id: apiHelper.getValueFromObject(body, 'time_keeping_claim_type_id')})
       if(data.isFailed()) return new ServiceResponse(false, 'Lấy danh sách duyệt thất bại'); 

        return new ServiceResponse(true, 'Lấy danh sách duyệt thành công', data.getData()?.review_levels);
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimTypeService.getOptions' });
        return new ErrorResponse(false, error.message);
    }
};

const getTotalExplainAllTimeKeepingClaimType = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
        .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
        .execute(`HR_TIMEKEEPINGCLAIM_CountTimesExplainAll_App`);

        return new ServiceResponse(true, '', {total_explained_all: data.recordset[0]?.TOTALEXPLAINALL ?? 0});
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.getTotalExplainAllTimeKeepingClaimType' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getOptions,
    detailTimeKeepingClaimType,
    getReviewLevels,
    getTotalExplainAllTimeKeepingClaimType
};
