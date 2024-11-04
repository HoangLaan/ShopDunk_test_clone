const sql = require('mssql');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const internalTransferTypeClass = require('./internal-transfer-type.class');
const { spName, checkReview } = require('./utils');

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
            data: internalTransferTypeClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, { function: 'internalTransferTypeService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (internalTransferTypeId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('INTERNALTRANSFERTYPEID', internalTransferTypeId)
            .execute(spName.getById);

        if (!data.recordset[0]) {
            return new ServiceResponse(false, 'Không tìm thấy hình thức chuyển tiền');
        }

        const result = internalTransferTypeClass.getById(data.recordset[0]);
        result.review_level_user_list = internalTransferTypeClass.levelUserDetailList(data.recordsets[1]);
        result.is_reviewed = checkReview(result.review_level_user_list);

        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, { function: 'internalTransferTypeService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdate = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();

        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const idUpdate = apiHelper.getValueFromObject(body, 'internal_transfer_type_id');
        const review_level_user_list = apiHelper.getValueFromObject(body, 'review_level_user_list', []);

        const result = await new sql.Request(transaction)
            .input('INTERNALTRANSFERTYPEID', idUpdate)
            .input('INTERNALTRANSFERTYPENAME', apiHelper.getValueFromObject(body, 'internal_transfer_type_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ISSAMEBUSSINESS', apiHelper.getValueFromObject(body, 'is_same_bussiness'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .execute(spName.createOrUpdate);

        const idResult = result.recordset[0].RESULT;
        if (!idResult) {
            throw new Error('Lỗi tạo yêu cầu mua hàng');
        }

        if (!!idUpdate) {
            await new sql.Request(transaction).input('INTERNALTRANSFERTYPEID', idUpdate).execute(spName.deleteMapping);
        }

        for (let i = 0; i < review_level_user_list.length; i++) {
            const rluItem = review_level_user_list[i];
            const isAutoReview = Boolean(rluItem.is_auto_review);
            await new sql.Request(transaction)
                .input('USERREVIEW', isAutoReview ? null : rluItem?.user_review?.value || rluItem?.user_review)
                .input('ISAUTOREVIEW', isAutoReview)
                .input('ISCOMPLETE', rluItem.is_complete)
                .input('REVIEWLEVELID', rluItem.review_level_id)
                .input('INTERNALTRANSFERTYPEID', idResult)
                .execute(spName.createReviewLevelUser);
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu hình thức chuyển tiền thành công', {
            internal_transfer_type_id: idResult,
        });
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'internalTransferTypeService.createOrUpdate' });
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
            .input('NAMEID', 'INTERNALTRANSFERTYPEID')
            .input('TABLENAME', 'SL_INTERNALTRANSFERTYPE')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'internalTransferTypeService._delete' });
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
            .execute(spName.getUserOptions);

        const data_ = internalTransferTypeClass.option(data.recordset);
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'internalTransferTypeService.getUserOptions' });
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

        let reviewLevelList = internalTransferTypeClass.reviewLevelList(resData.recordset);
        let departmentList = internalTransferTypeClass.departmentList(resData.recordsets[1]);
        let positionList = internalTransferTypeClass.positionList(resData.recordsets[2]);

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
        logger.error(e, { function: 'internalTransferTypeService.getReviewLevelList' });
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
        logger.error(e, { function: 'internalTransferTypeService.createReviewLevel' });
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
            .input('NAMEID', 'REVIEWLEVELID')
            .input('TABLENAME', 'SL_RECEIPTPAYMENT_REVIEWLEVEL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'internalTransferTypeService.deleteReviewLevel' });
        return new ServiceResponse(false, '', {});
    }
};

const getReviewInformation = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('PURCHASEREQUISITIONID', apiHelper.getValueFromObject(queryParams, 'purchase_requisition_id'))
            .execute(spName.getReviewInformation);

        return new ServiceResponse(true, '', internalTransferTypeClass.getReviewInformation(res.recordsets[0]?.[0]));
    } catch (error) {
        logger.error(error, { function: 'internalTransferTypeService.getReviewInformation' });
        return new ServiceResponse(false, error);
    }
};

const updateReview = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PURCHASEREQUISITIONID', apiHelper.getValueFromObject(body, 'purchase_requisition_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(body, 'is_review'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('REVIEWUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(spName.updateReview);
        if (!apiHelper.getResult(res.recordset)) {
            return new ServiceResponse(false, 'Lỗi cập nhật duyệt');
        }

        return new ServiceResponse(true, 'Cập nhật duyệt thành công');
    } catch (error) {
        logger.error(error, { function: 'internalTransferTypeService.updateReview' });
    }
};

module.exports = {
    getList,
    getById,
    createOrUpdate,
    delete: _delete,
    getUserOptions,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
    getReviewInformation,
    updateReview,
};
