const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const purchaseRequisitionTypeClass = require('./purchase-requisition-type.class');
const { spName } = require('./constants');
const { checkReview } = require('./utils');

const getList = async (queryParams = {}) => {
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
            .execute(spName.getList);

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: purchaseRequisitionTypeClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, { function: 'purchaseRequisitionTypeService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (purchaseRequisitionTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PURCHASEREQUISITIONTYPEID', purchaseRequisitionTypeId)
            .execute(spName.getById);

        if (!data.recordset[0]) {
            return new ServiceResponse(false, 'Không tìm thấy loại yêu cầu mua hàng');
        }

        const result = purchaseRequisitionTypeClass.getById(data.recordset[0]);
        result.review_level_user_list = purchaseRequisitionTypeClass.reviewUserList(data.recordsets[1]);
        result.accounting_list = purchaseRequisitionTypeClass.accountingList(data.recordsets[2]);

        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, { function: 'purchaseRequisitionTypeService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdate = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();

        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const idUpdate = apiHelper.getValueFromObject(body, 'purchase_requisition_type_id');
        const result = await new sql.Request(transaction)
            .input('PURCHASEREQUISITIONTYPEID', idUpdate)
            .input('PURCHASEREQUISITIONTYPENAME', apiHelper.getValueFromObject(body, 'purchase_requisition_type_name'))
            .input('NUMBEROFCANCELDATE', apiHelper.getValueFromObject(body, 'number_of_cancel_date'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .input('ISRETURNEDGOODS', apiHelper.getValueFromObject(body, 'is_returned_goods'))
            .execute(spName.createOrUpdate);

        const idResult = result.recordset[0].RESULT;
        if (!idResult) {
            throw new Error('Lỗi lưu loại yêu cầu mua hàng');
        }

        body.purchase_requisition_type_id = idUpdate ?? idResult;
        if (idUpdate) {
            await new sql.Request(transaction)
                .input('PURCHASEREQUISITIONTYPEID', idUpdate)
                .execute(spName.deleteMapping);

            // Hạch toán
            const requestAccountingDel = new sql.Request(transaction);
            const resAccountingDel = await deleteAccounting(body, requestAccountingDel);
            if (resAccountingDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resAccountingDel.getMessage());
            }
        }

        const review_level_user_list = apiHelper.getValueFromObject(body, 'review_level_user_list', []);
        for (let i = 0; i < review_level_user_list.length; i++) {
            if (Boolean(review_level_user_list[i].is_auto_review)) {
                await new sql.Request(transaction)
                    .input('ISAUTOREVIEW', true)
                    .input('ISCOMPLETE', review_level_user_list[i].is_complete)
                    .input('PURCHASEREQUISITIONREVIEWLEVELID', review_level_user_list[i].review_level_id)
                    .input('PURCHASEREQUISITIONTYPEID', idResult)
                    .execute(spName.createReviewLevelUser);
            } else {
                const user_review = review_level_user_list[i].user_review;
                await new sql.Request(transaction)
                    .input('USERREVIEW', user_review?.value || user_review)
                    .input('ISAUTOREVIEW', false)
                    .input('ISCOMPLETE', review_level_user_list[i].is_complete)
                    .input('PURCHASEREQUISITIONREVIEWLEVELID', review_level_user_list[i].review_level_id)
                    .input('PURCHASEREQUISITIONTYPEID', idResult)
                    .execute(spName.createReviewLevelUser);
            }
        }

        const requestAccounting = new sql.Request(transaction);
        const accounting_list = apiHelper.getValueFromObject(body, 'accounting_list', []);
        for (const { type_accounting, accounting_option, accounting_account_id } of accounting_list) {
            body.type_accounting = type_accounting;
            body.accounting_option = accounting_option;
            body.accounting_account_id = accounting_account_id;
            const resAccounting = await createOrUpdateAccounting(body, requestAccounting);
            if (resAccounting.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(true, resAccounting.getMessage());
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu loại yêu cầu mua hàng thành công', {
            purchase_requisition_type_id: idResult,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'purchaseRequisitionTypeService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const _delete = async (bodyParams) => {
    try {
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'PURCHASEREQUISITIONTYPEID')
            .input('TABLENAME', 'PO_PURCHASEREQUISITION_TYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionTypeService._delete' });
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
            .execute(spName.getReviewLevelList);

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
        logger.error(e, { function: 'purchaseRequisitionService.getReviewLevelList' });
        return new ServiceResponse(true, '', {});
    }
};

const createReviewLevel = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const createReviewLevelRequest = new sql.Request(transaction);
        const reviewLevelRes = await createReviewLevelRequest
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'review_level_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', true))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(spName.createReviewLevel);

        const reviewLevelId = reviewLevelRes.recordset[0].RESULT;
        if (reviewLevelId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo mức duyệt');
        }

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
                        .execute(spName.createApplyDepartmentReviewLevel);

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
                            .execute(spName.createApplyDepartmentReviewLevel);

                        if (reviewLevelApplyRes.recordset[0].RESULT <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, 'Lỗi thêm phòng ban, vị trí');
                        }
                    }
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu mức duyệt thành công', reviewLevelRes.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.createReviewLevel' });
        await transaction.rollback();
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
            .input('NAMEID', 'PURCHASEREQUISITIONREVIEWLEVELID')
            .input('TABLENAME', 'PO_PURCHASEREQUISITIONREVIEWLEVEL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.deleteReviewLevel' });
        return new ServiceResponse(false, '', {});
    }
};

const deleteAccounting = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input(
                'PURCHASEREQUISITIONTYPEID',
                apiHelper.getValueFromObject(bodyParams, 'purchase_requisition_type_id'),
            )
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('PO_PURCHASEREQUISITION_TYPE_ACCOUNTING_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'purchaseRequisitionService.deleteAccounting' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateAccounting = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input(
                'PURCHASEREQUISITIONTYPEID',
                apiHelper.getValueFromObject(bodyParams, 'purchase_requisition_type_id'),
            )
            .input('TYPEACCOUNTING', apiHelper.getValueFromObject(bodyParams, 'type_accounting'))
            .input('ACCOUNTINGOPTION', apiHelper.getValueFromObject(bodyParams, 'accounting_option'))
            .input('ACCOUNTINGACCOUNTID', apiHelper.getValueFromObject(bodyParams, 'accounting_account_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('PO_PURCHASEREQUISITION_TYPE_ACCOUNTING_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'purchaseRequisitionService.createOrUpdateAccounting' });

        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    getList,
    getById,
    createOrUpdate,
    delete: _delete,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
};
