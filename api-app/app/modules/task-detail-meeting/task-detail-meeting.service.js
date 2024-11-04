const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const taskDetailClass = require('./task-detail-meeting.class');

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
            .input('DATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('DATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'auth_id'))
            .execute('CRM_TASKDETAILMEETING_GetList_App');

        const dataRecord = data.recordset;

        return new ServiceResponse(true, '', {
            data: taskDetailClass.list(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, {function: 'taskDetailService.getList'});
        return new ServiceResponse(true, '', {});
    }
};

const getProductOptions = async (queryParams = {}) => {
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
            .execute('MD_PRODUCT_GetOptionsPaging_App');

        const dataRecord = data.recordset;
        const productOptions = taskDetailClass.productOptions(dataRecord);

        return new ServiceResponse(true, '', {
            data: productOptions,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, {function: 'taskDetailService.getProductOptions'});
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DATALEADSMEETINGID', apiHelper.getValueFromObject(queryParams, 'meeting_id'))
            .execute('CRM_TASKDETAILMEETING_GetById_App');
        const dataRecord = data.recordset;
        if (dataRecord.length === 0) {
            return new ServiceResponse(false, 'Không tìm thấy');
        }

        const taskDetail = taskDetailClass.detail(dataRecord)[0];
        taskDetail.favorite_product_list = taskDetail.product_list?.split('`').map(item => {
            const [product_id, product_code, product_name, model_id] = item.split('-');
            return {
                product_id,
                product_code,
                product_name,
                model_id,
            };
        });
        delete taskDetail.product_list;

        return new ServiceResponse(true, '', taskDetail);
    } catch (e) {
        logger.error(e, {function: 'taskDetailService.detail'});
        return new ServiceResponse(false, e.message);
    }
};

const getListTaskWorkFlow = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TASKDETAILID', apiHelper.getValueFromObject(queryParams, 'task_detail_id'))
            .execute('CRM_TASKWORKFLOW_GetByTaskId_App');

        const listWorkFlow = taskDetailClass.taskWorkFlow(data.recordset);

        const result = [];
        for (const wf of listWorkFlow) {
            if (!result.find(item => item.task_work_flow_id === wf.task_work_flow_id)) {
                result.push(wf);
            }
        }

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {function: 'taskDetailService.getListTaskWorkFlow'});
        return new ServiceResponse(false, e.message);
    }
};

const update = async (queryParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const updateMeeting = new sql.Request(transaction);
        const dataUpdate = await updateMeeting
            .input('DATALEADSMEETINGID', apiHelper.getValueFromObject(queryParams, 'meeting_id'))
            .input('CONTENTMEETING', apiHelper.getValueFromObject(queryParams, 'content_meeting'))
            .input('TASKWORKFLOWID', apiHelper.getValueFromObject(queryParams, 'task_work_flow_id'))
            .input('ISCOMING', apiHelper.getValueFromObject(queryParams, 'is_coming', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(queryParams, 'auth_name', null))
            .execute('CRM_TASKDETAILMEETING_Update_App');

        const tasDetailId = dataUpdate.recordset[0].id;

        if (!tasDetailId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Cập nhật thất bại');
        }

        queryParams.task_detail_id = tasDetailId;
        const favorite_product_ids = apiHelper.getValueFromObject(queryParams, 'favorite_product_ids', []);

        const reqDelete = new sql.Request(transaction);
        const dataDelete = await deleteFavoriteProduct(queryParams, reqDelete);
        if (dataDelete.isFailed()) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Cập nhật thất bại');
        }

        const data = dataDelete.getData();
        const createFavoriteReq = new sql.Request(transaction);
        if (favorite_product_ids?.length > 0) {
            for (const {product_id, model_id} of favorite_product_ids) {
                for (const item of data) {
                    queryParams.product_id = product_id;
                    queryParams.model_id = model_id;
                    queryParams.comment_id = item.comment_id;
                    const dataFavoriteCreate = await createFavoriteProduct(queryParams, createFavoriteReq);
                    if (dataFavoriteCreate.isFailed()) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Cập nhật thất bại');
                    }
                }
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, 'Cập nhật thành công', tasDetailId);
    } catch (error) {
        logger.error(error, {function: 'taskDetailService.update'});
        return new ServiceResponse(false, error);
    }
};

const createFavoriteProduct = async (queryParams = {}, transReq) => {
    try {
        const dataUpdate = await transReq
            .input('TASKDETAILID', apiHelper.getValueFromObject(queryParams, 'task_detail_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('MODELID', apiHelper.getValueFromObject(queryParams, 'model_id'))
            .input('COMMENTID', apiHelper.getValueFromObject(queryParams, 'comment_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(queryParams, 'auth_name', null))
            .execute('CRM_FAVORITEPRODUCT_Create_App');
        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, {function: 'taskDetailService.createFavoriteProduct'});
        return new ServiceResponse(false, error);
    }
};

const deleteFavoriteProduct = async (queryParams = {}, reqTransaction) => {
    try {
        const dataDelete = await reqTransaction
            .input('TASKDETAILID', apiHelper.getValueFromObject(queryParams, 'task_detail_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(queryParams, 'auth_name', null))
            .execute('CRM_FAVORITEPRODUCT_Delete_App');

        const deleteRecord = dataDelete.recordset;

        if (deleteRecord.length === 0) {
            return new ServiceResponse(false, 'Xóa thất bại');
        }
        removeCacheOptions();
        return new ServiceResponse(true, 'Xóa thành công', taskDetailClass.deleteFavorite(deleteRecord));
    } catch (error) {
        logger.error(error, {function: 'taskDetailService.deleteFavoriteProduct'});
        return new ServiceResponse(false, error);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_DEPARTMENT_OPTIONS);
};

module.exports = {
    getList,
    detail,
    getListTaskWorkFlow,
    update,
    getProductOptions,
};
