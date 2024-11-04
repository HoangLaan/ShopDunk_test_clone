const OffWorkRLClass = require('./offwork-rl.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require("mssql");
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListOffWorkRL = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);


        const pool = await mssql.pool;
        const data = await pool.request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('HR_OFFWORK_REVIEWLEVEL_GetList_AdminWeb');

        const OffWorkRL = data.recordset;
        return new ServiceResponse(true, '', {
            'data': OffWorkRLClass.list(OffWorkRL),
            'page': currentPage,
            'limit': itemsPerPage,
            'total': apiHelper.getTotalData(OffWorkRL),
        });
    } catch (e) {

        logger.error(e, { 'function': 'offworkRLService.getListOffWorkRL' });
        return new ServiceResponse(true, '', {});
    }
};

const createOffWorkRL = async (bodyParams = {}) => {
    return await createUserOrUpdate(bodyParams);
};

const updateOffWorkRL = async (bodyParams) => {
    return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const requestOffWorkRLCreate = new sql.Request(transaction);
        const resultOffWorkRLCreate = await requestOffWorkRLCreate
            .input('OFFWORKREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'off_work_review_level_id'))
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'review_level_name'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('ISAUTOREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_auto_review'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ISAPPLYALLDEPARTMENT', apiHelper.getValueFromObject(bodyParams, 'is_apply_all_department'))
            .input('ISAPPLYALLPOSITION', apiHelper.getValueFromObject(bodyParams, 'is_apply_all_position'))
            .execute('HR_OFFWORK_REVIEWLEVEL_CreateOrUpdate_AdminWeb');

        const offWorkRlId = resultOffWorkRLCreate.recordset[0].RESULT;
        const id = apiHelper.getValueFromObject(bodyParams, 'off_work_review_level_id');

        if (!offWorkRlId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm mới mức duyệt nghỉ phép thất bại.')
        }

        if (id) {
            const requestOffWorkRlDepartmentDelete = new sql.Request(transaction);
            const resultOffWorkRLDepartmentDelete = await requestOffWorkRlDepartmentDelete
                .input('OFFWORKREVIEWLEVELID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('HR_OFFWORKREVIEWLEVEL_APPLY_DEPARTMENT_DeleteByOffWorkRLId_AdminWeb');
            if (!resultOffWorkRLDepartmentDelete.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa phòng ban duyệt thất bại.')
            }

            const requestOffWorkRlPositionDelete = new sql.Request(transaction);
            const resultOffWorkRLPositionDelete = await requestOffWorkRlPositionDelete
                .input('OFFWORKREVIEWLEVELID', id)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('HR_OFFWORKREVIEWLEVEL_APPLY_POSITION_DeleteByOffWorkRLId_AdminWeb');
            if (!resultOffWorkRLPositionDelete.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa chức vụ duyệt thất bại.')
            }
        }
        // Thêm phòng ban duyệt 
        let departments = apiHelper.getValueFromObject(bodyParams, 'departments', []).filter((x) => x.value !== -1);
        if (departments && departments.length) {
            for (let i = 0; i < departments.length; i++) {
                const requestOffWorkRlDepartmentCreate = new sql.Request(transaction);
                const resultOffWorkRLDepartmentCreate = await requestOffWorkRlDepartmentCreate
                    .input('OFFWORKREVIEWLEVELID', offWorkRlId)
                    .input('DEPARTMENTID', apiHelper.getValueFromObject(departments[i], 'value'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('HR_OFFWORKREVIEWLEVEL_APPLY_DEPARTMENT_Create_AdminWeb');

                if (!resultOffWorkRLDepartmentCreate.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm mới phòng ban duyệt thất bại.')
                }
            }
        }
        // Thêm chức vụ duyệt 
        let positions = apiHelper.getValueFromObject(bodyParams, 'positions', []).filter((x) => x.value !== -1);
        if (positions && positions.length) {
            for (let i = 0; i < positions.length; i++) {
                const requestOffWorkRlPositionCreate = new sql.Request(transaction);
                const resultOffWorkRLPositionCreate = await requestOffWorkRlPositionCreate
                    .input('OFFWORKREVIEWLEVELID', offWorkRlId)
                    .input('POSITIONID', apiHelper.getValueFromObject(positions[i], 'value'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('HR_OFFWORKREVIEWLEVEL_APPLY_POSITION_Create_AdminWeb');

                if (!resultOffWorkRLPositionCreate.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm mới chức vụ duyệt thất bại.')
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Create offwork review level success!!', offWorkRlId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { 'function': 'offworkRLService.createUserOrUpdate' });
        return new ServiceResponse(false, e);
    }
};

const detailOffWorkRL = async (offWorkId,bodyParams={}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('OFFWORKREVIEWLEVELID', offWorkId)
            .execute('HR_OFFWORK_REVIEWLEVEL_GetById_AdminWeb');
        let offworkRl = OffWorkRLClass.detail(data.recordset[0]);
        offworkRl.departments = OffWorkRLClass.options(data.recordsets[1])
        offworkRl.positions = OffWorkRLClass.options(data.recordsets[2])

        offworkRl.company_id = offworkRl.company_id + ""

        offworkRl.is_can_edit = 1
        // Kiểm tra nếu là có trạng thái is_system = 1
        // ==> kiểm tra xem user login có phải administrator hay không
        //==> nếu administrator thì không cho phép chỉnh sửa
        const auth_name =  apiHelper.getValueFromObject(bodyParams, 'auth_name') 
        if(offworkRl.is_system == 1 && auth_name !='administrator'){
            offworkRl.is_can_edit = 0
        }

        return new ServiceResponse(true, '', offworkRl);

    } catch (e) {
        logger.error(e, { 'function': 'offworkRLService.detailOffWorkRL' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteOffWorkRL = async (offWorkId, auth) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('OFFWORKREVIEWLEVELID', offWorkId)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(auth, 'auth_name'))
            .execute('HR_OFFWORK_REVIEWLEVEL_Delete_AdminWeb');
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { 'function': 'offworkRLService.deleteOffWorkRL' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const getListUserReview = async (offWorkRLId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('OFFWORKREVIEWLEVELID', offWorkRLId)
            .execute('HR_OFFWORK_REVIEWLEVEL_GetUserReview_AdminWeb');
        let offworkRl = OffWorkRLClass.options(data.recordset);
        return new ServiceResponse(true, '', offworkRl);
    } catch (e) {
        logger.error(e, { 'function': 'offworkRLService.getListUserReview' });
        return new ServiceResponse(false, e.message);
    }
};

const getOffworkRLOptions = async (companyId = null) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('COMPANYID', companyId)
            .execute('HR_OFFWORK_REVIEWLEVEL_GetOption_AdminWeb');
        let offworkRl = OffWorkRLClass.options(data.recordset);
        return new ServiceResponse(true, '', offworkRl);
    } catch (e) {
        logger.error(e, { 'function': 'offworkRLService.getOffworkRLOptions' });
        return new ServiceResponse(false, e.message);
    }
};


module.exports = {
    getListOffWorkRL,
    createOffWorkRL,
    detailOffWorkRL,
    updateOffWorkRL,
    deleteOffWorkRL,
    getListUserReview,
    getOffworkRLOptions
};
