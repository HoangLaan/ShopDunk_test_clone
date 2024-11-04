const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const customerWorkingClass = require('./customer-working.class');
const stringHelper = require('../../common/helpers/string.helper');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const { getImageUrl } = require('./utils');

const generateCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GENCODE_ADMINWEB);
        return new ServiceResponse(true, '', data.recordset[0]?.GEN_CODE);
    } catch (e) {
        logger.error(e, { function: 'customerWorkingService.generateCode' });
        return new ServiceResponse(true, '', '');
    }
};

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
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('SOURCEID', apiHelper.getValueFromObject(queryParams, 'source_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.CRM_CUSTOMERWORKING_GETLIST_ADMINWEB);

        const customerWorkings = data.recordset;
        return new ServiceResponse(true, '', {
            data: customerWorkingClass.list(customerWorkings),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(customerWorkings),
        });
    } catch (error) {
        logger.error(error, { function: 'customerWorkingService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (customerWorkingId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TASKDETAILWORKINGID', customerWorkingId)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERWORKING_GETBYID_ADMINWEB);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy khách hàng working');
        }

        const detail = customerWorkingClass.getById(data.recordsets[0][0]);
        let products = customerWorkingClass.customerFavorite(data.recordsets[1]);
        let dataStore = customerWorkingClass.detailStore(data.recordsets[2]);
        if (dataStore) {
            const storeInfo =
                dataStore.store_code +
                ' - ' +
                dataStore.store_name +
                ' - ' +
                dataStore.phone_number +
                ' - ' +
                dataStore.address;
            dataStore.store_info = storeInfo;
        }
        products = products.reduce((a, v) => ({ ...a, [v.product_id]: v }), {});
        detail.products = products;
        detail.store = dataStore;

        return new ServiceResponse(true, '', detail);
    } catch (e) {
        logger.error(e, {
            function: 'customerWorkingService.getById',
        });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (body) => {
  const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');

        let password = apiHelper.getValueFromObject(body, 'password');
        if (!password) {
            password = apiHelper.getValueFromObject(body, 'phone_number');
            password = password ? stringHelper.hashPassword(password) : null;
        }

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
            const resGenCodeCustomerLead = await genCodeCustomerLead
                .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_GENCODE_ADMINWEB);
            dataLeadsCode = resGenCodeCustomerLead.recordset[0]?.GEN_CODE;

            if (!dataLeadsCode) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi lưu gen mã tạo khách hàng');
            }
        }

        //Create or update customer lead
        const createOrUpdateCustomerLeadResult = new sql.Request(transaction);
        const resCreateOrUpdateCustomerLeadResult = await createOrUpdateCustomerLeadResult
            .input('DATALEADSID', apiHelper.getValueFromObject(body, 'data_leads_id'))
            .input('DATALEADSCODE', dataLeadsCode)
            .input('PASSWORD', password)
            .input('IMAGEAVATAR', image_avatar)
            .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birthday'))
            .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(body, 'customer_type_id'))
            .input('ISACTIVE', 1)
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system', 0))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.CRM_CUSTOMERDATALEADS_CREATEORUPDATE_ADMINWEB);

        const idCustomerLeadResult = resCreateOrUpdateCustomerLeadResult.recordset[0]?.RESULT;
        if (!idCustomerLeadResult) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi lưu khách hàng tiềm năng');
        }

        // get task type auto id
        let dataTaskType = apiHelper.getValueFromObject(body, 'task_type_id');
        let taskNameDefault = 'Loại công việc hệ thống tự động tạo';
        // Create or update task
        // task type is auto value default 1 & auto active value default 1
        const createOrUpdateTask = new sql.Request(transaction);
        const resCreateOrUpdateTask = await createOrUpdateTask
            .input('TASKID', apiHelper.getValueFromObject(body, 'task_id'))
            .input('TASKNAME', taskNameDefault)
            .input('TASKTYPEID', dataTaskType)
            .input('STARTDATE', apiHelper.getValueFromObject(body, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(body, 'end_date'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('CRM_TASK_CreateOrUpdate_AdminWeb');

        const taskId = resCreateOrUpdateTask.recordset[0]?.RESULT;
        if (!taskId || taskId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lưu công việc thất bại', null);
        }

        // check and create task detail by member task id
        const createTaskDetail = new sql.Request(transaction);
        const resCreateTaskDetail = await createTaskDetail
            .input('TASKDETAILID', apiHelper.getValueFromObject(body, 'task_detail_id'))
            .input('DATALEADSID', idCustomerLeadResult)
            .input('MEMBERID', null)
            .input('TASKID', taskId)
            .input('STOREID', apiHelper.getValueFromObject(body, 'store_id'))
            .input('USERNAME', authName)
            .input('CREATEDUSER', authName)
            .execute('CRM_TASKDETAIL_CreateOrUpdate_AdminWeb');

        const taskDetailIdResult = resCreateTaskDetail.recordset[0]?.RESULT;

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
                return new ServiceResponse(false, 'Không tìm thấy dữ liệu', null);
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

        const careCommentId = createCareCommentResData.recordset[0]?.RESULT;

        if (!careCommentId || careCommentId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo comment thất bại', null);
        }

        let favoriteProductList = apiHelper.getValueFromObject(body, 'products', {});
        favoriteProductList = Object.values(favoriteProductList || {});

        const deleteFavoriteProductId = new sql.Request(transaction);
        const deleteFavoriteProduct = await deleteFavoriteProductId
            .input('TASKDETAILID', taskDetailIdResult)
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('CRM_FAVORITEPRODUCT_Delete_AdminWeb');


        const createFavoriteProduct = new sql.Request(transaction);
        if (favoriteProductList.length > 0) {
            for (let i = 0; i < favoriteProductList.length; i++) {
                const resCreateFavoriteProduct = await createFavoriteProduct
                    .input('TASKDETAILID', taskDetailIdResult)
                    .input('PRODUCTID', favoriteProductList[i].product_id)
                    .input('COMMENTID', careCommentId)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute('CRM_FAVORITEPRODUCT_Create_AdminWeb');

                const favoriteProductId = resCreateFavoriteProduct.recordset[0]?.RESULT;

                if (!favoriteProductId || favoriteProductId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo sản phẩm yêu thích', null);
                }
            }
        }

        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, 'Lưu khách hàng tiềm năng thành công', {});
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'customerLeadService.createOrUpdate' });
        return new ServiceResponse(false, e.message);
    }

};

const deleteTask = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'TASKDETAILID')
            .input('TABLENAME', 'CRM_TASKDETAIL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();
        // Return ok
        return new ServiceResponse(true, 'Xóa khách hàng working thành công', {});
    } catch (e) {
        logger.error(e, { function: 'customerLeadService.deleteTask' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const getStoreByUser = async (body) => {
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        // get store and username supervisor
        const getStoreAndSupervisor = await mssql.pool;
        const resGetStoreAndSupervisor = await getStoreAndSupervisor
            .request()
            .input('USERNAME', authName)
            .execute(PROCEDURE_NAME.MD_STORE_GETSTOREANDSUPPERVISION);
        let dataCompare = null;
        if(resGetStoreAndSupervisor.recordset[0]) {
          dataCompare = customerWorkingClass.detailStore(resGetStoreAndSupervisor.recordset[0]);
        }

        return new ServiceResponse(true, '', dataCompare);
    } catch (e) {
        logger.error(e, {
            function: 'customerWorkingService.getById',
        });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASK_OPTIONS);
};

module.exports = {
    createOrUpdate,
    generateCode,
    getList,
    getById,
    deleteTask,
    getStoreByUser,
};
