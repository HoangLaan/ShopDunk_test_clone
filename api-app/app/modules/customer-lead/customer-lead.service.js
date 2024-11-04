const sql = require('mssql');
const mssql = require('../../models/mssql');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const CACHE_CONST = require('../../common/const/cache.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const stringHelper = require('../../common/helpers/string.helper');
const { getImageUrl } = require('./utils');

const createOrUpdate = async body => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');

        let password = apiHelper.getValueFromObject(body, 'phone_number');
        password = password ? stringHelper.hashPassword(password) : null;

        let image_avatar = apiHelper.getValueFromObject(body, 'image_avatar');
        if (image_avatar) {
            const path_image_avatar = await getImageUrl(image_avatar);
            if (path_image_avatar) {
                image_avatar = path_image_avatar;
            }
        }

        await transaction.begin();
        let dataLeadsCode = apiHelper.getValueFromObject(body, 'data_leads_id');
        if (!dataLeadsCode) {
            const genCodeCustomerLead = new sql.Request(transaction);
            const resGenCodeCustomerLead = await genCodeCustomerLead.execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GENCODE_ADMINWEB);
            dataLeadsCode = resGenCodeCustomerLead.recordset[0].GEN_CODE;

            if (!dataLeadsCode) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi lưu gen mã tạo khách hàng');
            }
        }

        //Create or update customer lead
        const createOrUpdateCustomerLeadResult = new sql.Request(transaction);
        const resCreateOrUpdateCustomerLeadResult = await createOrUpdateCustomerLeadResult
            .input('DATALEADSCODE', dataLeadsCode)
            .input('PASSWORD', password)
            .input('IMAGEAVATAR', image_avatar)
            .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birthday'))
            .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('ADDRESSFULL', apiHelper.getValueFromObject(body, 'address'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(body, 'customer_type_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active', 1))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CREATEORUPDATE_APP);

        const idCustomerLeadResult = resCreateOrUpdateCustomerLeadResult.recordset[0].RESULT;
        if (!idCustomerLeadResult) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo khách hàng Walk in thất bại');
        }

        //get task type auto id
        let dataTaskType = apiHelper.getValueFromObject(body, 'task_type_id');
        if (dataTaskType) {
            // Create or update task
            const taskNameDefault = 'Loại công việc hệ thống tự động tạo';
            // Create or update task
            // task type is auto value default 1 & auto active value default 1
            const createOrUpdateTask = new sql.Request(transaction);
            const resCreateOrUpdateTask = await createOrUpdateTask
                .input('TASKNAME', taskNameDefault)
                .input('TASKTYPEID', dataTaskType)
                .input('STARTDATE', apiHelper.getValueFromObject(body, 'start_date'))
                .input('ENDDATE', apiHelper.getValueFromObject(body, 'end_date'))
                .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
                .input('ISACTIVE', 1)
                .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute('CRM_TASK_CreateOrUpdate_AdminWeb');

            const taskId = resCreateOrUpdateTask.recordset[0].RESULT;
            if (!taskId || taskId <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Tạo công việc thất bại', null);
            }

            // get store and username supervisor
            const getStoreAndSupervisor = new sql.Request(transaction);
            const resGetStoreAndSupervisor = await getStoreAndSupervisor
                .input('USERNAME', authName)
                .execute(PROCEDURE_NAME.MD_STORE_GETSTOREANDSUPPERVISION);

            if (!resGetStoreAndSupervisor.recordset[0]?.STOREID || resGetStoreAndSupervisor.recordset[0]?.STOREID <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'không tìm thấy dữ liệu', null);
            }

            const dataStoreAndSupervisor = {
                store_id: resGetStoreAndSupervisor.recordset[0].STOREID,
                supervisor_user: resGetStoreAndSupervisor.recordset[0].MANAGEMENTUSERNAME,
                department_id: resGetStoreAndSupervisor.recordset[0].DEPARTMENTID,
            };

            // check and create task detail by member task id
            const createTaskDetail = new sql.Request(transaction);
            const resCreateTaskDetail = await createTaskDetail
                .input('DATALEADSID', idCustomerLeadResult)
                .input('MEMBERID', null)
                .input('TASKID', taskId)
                .input('DEPARTMENTID', dataStoreAndSupervisor.department_id)
                .input('STOREID', dataStoreAndSupervisor.store_id)
                .input('SUPERVISORNAME', dataStoreAndSupervisor.supervisor_user)
                .input('USERNAME', authName)
                .input('CREATEDUSER', authName)
                .execute('CRM_TASKDETAIL_Create_AdminWeb');

            const taskDetailIdResult = resCreateTaskDetail.recordset[0].RESULT;
            if (!taskDetailIdResult) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo mô tả task', null);
            }

            //get workflow first by task id
            let dataWorkFlowId = apiHelper.getValueFromObject(body, 'work_flow_id');
            if (!dataWorkFlowId) {
                const getWorkFlowId = new sql.Request(transaction);
                const resGetWorkFlowId = await getWorkFlowId
                    .input('TASKTYPEID', dataTaskType)
                    .execute(PROCEDURE_NAME.CRM_TASKTYPE_GETFIRSTTASKWORKFLOWBYTASKTYPE);
                dataWorkFlowId = resGetWorkFlowId.recordset[0]?.TASKWORKFLOWID;

                if (!dataWorkFlowId || dataWorkFlowId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'không tìm thấy dữ liệu', null);
                }
            }

            const commentDefaults = 'Tạo tự động';
            const createCareComment = new sql.Request(transaction);
            const createCareCommentResData = await createCareComment
                .input('TASKDETAILID', taskDetailIdResult)
                .input('MEMBERID', null)
                .input('DATALEADSID', idCustomerLeadResult)
                .input('WORKFLOWID', dataWorkFlowId)
                .input('CONTENTCOMMENT', commentDefaults)
                .input('CREATEDUSER', authName)
                .execute('CRM_TASKDETAILCOMMENT_CreateOrUpdate_AdminWeb');

            const careCommentId = createCareCommentResData.recordset[0].RESULT;

            if (!careCommentId || careCommentId <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Tạo comment thất bại', null);
            }

            const favoriteProductList = apiHelper.getValueFromObject(body, 'product_favorite_list', []);
            const deleteFavoriteProductId = new sql.Request(transaction);
            const deleteFavoriteProduct = await deleteFavoriteProductId
                .input('TASKDETAILID', taskDetailIdResult)
                .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                .execute('CRM_FAVORITEPRODUCT_Delete_AdminWeb');

            if (favoriteProductList.length > 0) {
                for (let i = 0; i < favoriteProductList.length; i++) {
                    const createFavoriteProduct = new sql.Request(transaction);
                    const resCreateFavoriteProduct = await createFavoriteProduct
                        .input('TASKDETAILID', taskDetailIdResult)
                        .input('PRODUCTID', favoriteProductList[i].product_id)
                        .input('COMMENTID', careCommentId)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                        .execute('CRM_FAVORITEPRODUCT_Create_AdminWeb');

                    const favoriteProductId = resCreateFavoriteProduct.recordset[0].RESULT;

                    if (!favoriteProductId || favoriteProductId <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Lỗi tạo sản phẩm yêu thích', null);
                    }
                }
            }

            removeCacheOptions();

            await transaction.commit();
            return new ServiceResponse(true, 'Tạo khách hàng  Walk in thành công', {});
        }
        await transaction.rollback();
        return new ServiceResponse(false, 'Tạo khách hàng Walk in thất bại', null);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'customerLeadService.createOrUpdate' });
        return new ServiceResponse(false, "Tạo khách hàng Walk in thất bại");
    }
}

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASK_OPTIONS);
};

module.exports = {
    createOrUpdate,
};