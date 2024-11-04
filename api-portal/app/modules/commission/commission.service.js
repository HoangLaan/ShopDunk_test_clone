const sql = require('mssql');
const mssql = require('../../models/mssql');
const commissionClass = require('./commission.class');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListCommission = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('STARTDATE', apiHelper.getValueFromObject(queryParams, 'from_date_apply'))
            .input('ENDDATE', apiHelper.getValueFromObject(queryParams, 'to_date_apply'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('STATUS', apiHelper.getValueFromObject(queryParams, 'status'))
            .input('ISACTIVE', Number(apiHelper.getFilterBoolean(queryParams, 'is_active')))
            .execute('SL_COMMISSION_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: commissionClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'CommissionService.getListCommission',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getCommissionCompanyOptions = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SL_COMMISSION_getCompanyOptions_AdminWeb');

        return new ServiceResponse(true, '', {
            data: commissionClass.companyList(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'CommissionService.getCommissionCompanyOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const detailCommission = async (commissionId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMMISSIONID', commissionId)
            .execute('SL_COMMISSION_GetDetailById_AdminWeb_V3');

        if (!data.recordsets[0][0]) {
            return new ServiceResponse(false, 'Không tìm thấy hoa hồng');
        }

        const detail = commissionClass.detail(data.recordsets[0][0]);
        const business_apply = commissionClass.businessApply(data.recordsets[1]);
        const stores_apply = commissionClass.businessStoreApply(data.recordsets[2]);
        const order_types = commissionClass.orderTypeApply(data.recordsets[3]);
        const departments = commissionClass.departmentApply(data.recordsets[4]);
        const pre_positions = commissionClass.departmentPositionApply(data.recordsets[5]);

        // check divide to position or not
        const DIVIDE_BY = {
            BY_DEPARTMENT: 1,
            BY_SHIFT: 2,
            TO_SALE_EMPLOYEE: 3,
        };

        if (departments?.length) {
            detail.is_divide_to_position = departments[0].is_divide_to_position;
            if (departments[0].is_divide_by_department) {
                detail.is_divide = DIVIDE_BY.BY_DEPARTMENT;
            } else if (departments[0].is_divide_by_shift) {
                detail.is_divide = DIVIDE_BY.BY_SHIFT;
            } else if (departments[0].is_divide_to_sale_employee) {
                detail.is_divide = DIVIDE_BY.TO_SALE_EMPLOYEE;
            }
        }

        return new ServiceResponse(true, '', {
            data: {
                ...detail,
                business_apply,
                stores: stores_apply,
                order_types,
                departments,
                pre_positions,
            },
        });
    } catch (e) {
        logger.error(e, {
            function: 'CommissionService.detailCommission',
        });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateCommission = async (data) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();

        const idUpdate = apiHelper.getValueFromObject(data, 'commission_id');
        if (idUpdate) {
            // delete store apply commission
            const resDelStoreApply = await new sql.Request(transaction)
                .input('COMMISSIONID', apiHelper.getValueFromObject(data, 'commission_id'))
                .input('DELETEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
                .execute('SL_COMMISSION_BUSINESS_delete_AdminWeb');
            if (resDelStoreApply.recordset[0]?.RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa miền cửa hàng cũ thất bại');
            }

            // delete order type apply commission
            const resDelOrderTypeApply = await new sql.Request(transaction)
                .input('COMMISSIONID', apiHelper.getValueFromObject(data, 'commission_id'))
                .input('DELETEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
                .execute('SL_COMMISSION_ORDERTYPE_delete_AdminWeb');
            if (resDelOrderTypeApply.recordset[0]?.RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa loại đơn hàng cũ thất bại');
            }

            // delete department apply commission
            const resDelDepartmentApply = await new sql.Request(transaction)
                .input('COMMISSIONID', apiHelper.getValueFromObject(data, 'commission_id'))
                .input('DELETEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
                .execute('SL_COMMISSION_DEPARTMENT_delete_AdminWeb');
            if (resDelDepartmentApply.recordset[0]?.RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa phòng ban cũ thất bại');
            }

            // delete position apply commission
            const resDelPositionApply = await new sql.Request(transaction)
                .input('COMMISSIONID', apiHelper.getValueFromObject(data, 'commission_id'))
                .input('DELETEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
                .execute('SL_COMMISSION_DEPARTMENT_POSITION_delete_AdminWeb');
            if (resDelPositionApply.recordset[0]?.RESULT <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa vị trí - chức vụ cũ thất bại');
            }
        }

        // create or update commission
        const commissionResult = await new sql.Request(transaction)
            .input('COMMISSIONID', apiHelper.getValueFromObject(data, 'commission_id'))
            .input('COMMISSIONNAME', apiHelper.getValueFromObject(data, 'commission_name'))
            .input('COMMISSIONVALUE', apiHelper.getValueFromObject(data, 'commission_value'))
            .input('TYPEVALUE', apiHelper.getValueFromObject(data, 'type_value'))
            .input('STARTDATE', apiHelper.getValueFromObject(data, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(data, 'end_date'))
            .input('COMPANYID', apiHelper.getValueFromObject(data, 'company_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(data, 'description'))
            .input('ISAPPLYOTHERCOMMISSION', apiHelper.getValueFromObject(data, 'is_apply_other_commission'))
            .input('ISAUTORENEW', apiHelper.getValueFromObject(data, 'is_auto_renew'))
            .input('RENEWDAYINMONTH', apiHelper.getValueFromObject(data, 'renew_day_in_month'))
            .input('ISSTOPPED', apiHelper.getValueFromObject(data, 'is_stopped'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(data, 'is_reviewed'))
            .input('REVIEWEDUSER', apiHelper.getValueFromObject(data, 'reviewed_user'))
            .input('REVIEWEDNOTE', apiHelper.getValueFromObject(data, 'reviewed_note'))
            .input('ISACTIVE', apiHelper.getValueFromObject(data, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
            .execute('SL_COMMISSION_createOrUpdate_AdminWeb_V3');

        const idResult = commissionResult?.recordset[0]?.RESULT;

        if (!idResult) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi lưu hoa hồng');
        }

        // create business store apply commission
        const com_store_ids = [];
        for (let i = 0; i < data.stores.length; i++) {
            const storeItem = data.stores[i];
            const storeApplyResult = await new sql.Request(transaction)
                .input('COMMISSIONID', idResult)
                .input('BUSINESSID', storeItem.business_id)
                .input('STOREID', storeItem.store_id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
                .execute('SL_COMMISSION_BUSINESS_createOrUpdate_AdminWeb');

            const com_store_id = storeApplyResult?.recordset[0]?.RESULT;
            if (!com_store_id) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi lưu miền - cửa hàng');
            }
            com_store_ids.push(com_store_id);
        }

        // create order type apply commission
        const com_order_type_result = [];
        if (data.order_types?.length) {
            for (let i = 0; i < data.order_types.length; i++) {
                const orderTypeItem = data.order_types[i];
                const orderTypeApplyResult = await new sql.Request(transaction)
                    .input('COMMISSIONID', idResult)
                    .input('ORDERTYPEID', orderTypeItem.id)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
                    .execute('SL_COMMISSION_ORDERTYPE_createOrUpdate_AdminWeb');
                const com_order_type_id = orderTypeApplyResult.recordset[0].RESULT;
                if (!com_order_type_id) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi lưu loại đơn hàng');
                }
                com_order_type_result.push(com_order_type_id);
            }
        }

        // create department apply commission
        const com_department_ids = [];
        if (data.departments?.length) {
            for (let i = 0; i < data.departments.length; i++) {
                const departmentItem = data.departments[i];
                const departmentApplyResult = await new sql.Request(transaction)
                    .input('COMMISSIONID', idResult)
                    .input('DEPARTMENTID', apiHelper.getValueFromObject(departmentItem, 'department_id'))
                    .input('COMMISSIONVALUE', apiHelper.getValueFromObject(departmentItem, 'commission_value'))
                    .input('TYPEVALUE', apiHelper.getValueFromObject(departmentItem, 'type_value'))
                    .input('ISDIVIDETOPOSITION', apiHelper.getValueFromObject(data, 'is_divide_to_position'))
                    .input('ISDIVIDEBYDEPARTMENT', apiHelper.getValueFromObject(data, 'is_divide_by_department'))
                    .input('ISDIVIDEBYSHIFT', apiHelper.getValueFromObject(data, 'is_divide_by_shift'))
                    .input('ISDIVIDETOSALEEMPLOYEE', apiHelper.getValueFromObject(data, 'is_divide_to_sale_employee'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
                    .execute('SL_COMMISSION_DEPARTMENT_createOrUpdate_AdminWeb');
                const com_department_id = departmentApplyResult.recordset[0].RESULT;
                if (!com_department_id) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi lưu phòng ban');
                }
                com_department_ids.push({
                    com_department_id,
                    department_id: departmentItem.department_id,
                });
            }
        }

        // create position apply commission
        const com_position_ids = [];
        if (data.is_divide_to_position === 1 && data.positions?.length) {
            for (let i = 0; i < data.positions.length; i++) {
                const positionItem = data.positions[i];
                const comDepartmentId = com_department_ids.find((x) => x.department_id == positionItem.department_id);
                if (!comDepartmentId?.com_department_id) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Không tìm thấy vị trí - chức vụ trong phòng ban hiện tại');
                }
                const positionApplyResult = await new sql.Request(transaction)
                    .input('COMDEPARTMENTID', comDepartmentId.com_department_id)
                    .input('COMDEPOSITIONID', apiHelper.getValueFromObject(positionItem, 'com_de_position_id'))
                    .input('POSITIONID', apiHelper.getValueFromObject(positionItem, 'position_id'))
                    .input('COMMISSIONVALUE', apiHelper.getValueFromObject(positionItem, 'commission_value'))
                    .input('TYPEVALUE', apiHelper.getValueFromObject(positionItem, 'type_value'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(data, 'auth_name'))
                    .execute('SL_COMMISSION_DEPARTMENT_POSITION_createOrUpdate_AdminWeb');
                const com_position_id = positionApplyResult.recordset[0].RESULT;
                if (!com_position_id) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi lưu vị trí chức vụ');
                }
                com_position_ids.push({
                    com_position_id,
                    position_id: positionItem.position_id,
                });
            }
        }

        await transaction.commit();

        return new ServiceResponse(true, '', {});
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'CommissionService.createOrUpdateCommission' });
        return new ServiceResponse(false, e.message);
    }
};

const createCommission = async (data = {}) => {
    return await createOrUpdateCommission(data);
};

const updateCommission = async (data = {}) => {
    return await createOrUpdateCommission(data);
};

const stopCommission = async (body) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('COMMISSIONID', apiHelper.getValueFromObject(body, 'commission_id'))
            .input('ISSTOPPED', apiHelper.getValueFromObject(body, 'is_stopped'))
            .input('STOPPEDREASON', apiHelper.getValueFromObject(body, 'stopped_reason'))
            .input('STOPPEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SL_COMMISSION_Stop_AdminWeb');
        return new ServiceResponse(true, '', null);
    } catch (e) {
        logger.error(e, { function: 'CommissionService.stopCommission' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteCommission = async (body) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('COMMISSIONID', apiHelper.getValueFromObject(body, 'commission_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SL_COMMISSION_Delete_AdminWeb');
        return new ServiceResponse(true, '', { data: null });
    } catch (e) {
        logger.error(e, { function: 'CommissionService.deleteCommission' });
        return new ServiceResponse(false, e.message);
    }
};

const delCommissionIds = async (body) => {
    try {
        const commissionIds = apiHelper.getValueFromObject(body, 'ids');
        const ids = commissionIds.join(',');
        const pool = await mssql.pool;
        await pool
            .request()
            .input('COMMISSIONIDS', ids)
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SL_COMMISSION_DeleteIds_AdminWeb');
        return new ServiceResponse(true, '', { data: null });
    } catch (e) {
        logger.error(e, { function: 'CommissionService.delCommissionIds' });
        return new ServiceResponse(false, e.message);
    }
};

const getDepartmentPosition = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('COMMISSIONID', apiHelper.getValueFromObject(queryParams, 'commission_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('DEPARTMENTIDS', apiHelper.getValueFromObject(queryParams, 'department_ids'))
            .execute('SL_COMMISSION_DEPARTMENT_POSITION_getList_AdminWeb');

        const stores = data.recordset;

        return new ServiceResponse(true, '', {
            data: commissionClass.getDepartmentPosition(stores),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(stores),
        });
    } catch (e) {
        logger.error(e, { function: 'CommissionService.getDepartmentPosition' });
        return new ServiceResponse(true, '', {
            data: [],
            page: currentPage,
            limit: itemsPerPage,
            total: 0,
        });
    }
};

const getDepartmentPositionV2 = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMMISSIONID', apiHelper.getValueFromObject(queryParams, 'commission_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('DEPARTMENTIDS', apiHelper.getValueFromObject(queryParams, 'department_ids'))
            .execute('SL_COMMISSION_DEPARTMENT_POSITION_getList_AdminWeb_V2');

        const result = data.recordset;

        return new ServiceResponse(true, '', commissionClass.getDepartmentPositionV2(result));
    } catch (e) {
        logger.error(e, { function: 'CommissionService.getDepartmentPosition' });
        return new ServiceResponse(true, '', {
            data: [],
            page: currentPage,
            limit: itemsPerPage,
            total: 0,
        });
    }
};

const getUserDepartmentOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .input('KEYWORD', '')
            .execute('SYS_USER_GetUserDepartment_AdminWeb');

        let data_user = data.recordset && data.recordset.length ? data.recordset : [];

        return new ServiceResponse(true, '', commissionClass.getUserDepartmentOptions(data_user));
    } catch (e) {
        logger.error(e, { function: 'CommissionService.getUserDepartmentOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const getOrderTypeOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_ORDER_GetOrderTypeOptions_AdminWeb');
        return new ServiceResponse(true, '', orderClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'CommissionService.getOrderTypeOptions' });
        return new ServiceResponse(true, '', []);
    }
};

const changeStatusReview = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMMISSIONID', apiHelper.getValueFromObject(queryParams, 'commission_id', null))
            .input('ISREVIEWED', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_COMMISSION__Update_Review_AdminWeb');
            
        let message = 'Duyệt thành công';
        return new ServiceResponse(true, message, {});
    } catch (e) {
        logger.error(e, { function: 'CommissionService.changeStatusReview' });
        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    getListCommission,
    getCommissionCompanyOptions,
    detailCommission,
    createCommission,
    updateCommission,
    deleteCommission,
    delCommissionIds,
    stopCommission,
    getDepartmentPosition,
    getDepartmentPositionV2,
    getUserDepartmentOptions,
    getOrderTypeOptions,
    changeStatusReview,
};
