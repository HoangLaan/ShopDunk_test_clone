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
const moduleClass = require('./task.class');
const {
    getTemplate,
    getListBrandname,
    sendMultipleMessage_V4_post_json,
} = require('../sms-brandname/sms-brandname.service');
const { removeCharactersVietnamese } = require('./utils/helper');
const { distance } = require('fastest-levenshtein');
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getTaskList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id'))
            .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('SUPERVISORNAME', apiHelper.getValueFromObject(queryParams, 'supervisor_name'))
            .input('SUPERVISORUSERNAME', apiHelper.getValueFromObject(queryParams, 'supervisor_username'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('OBJECTTYPE', apiHelper.getValueFromObject(queryParams, 'object_type'))
            .input('STARTDATEFROM', apiHelper.getValueFromObject(queryParams, 'start_date_from'))
            .input('STARTDDATETO', apiHelper.getValueFromObject(queryParams, 'start_date_to'))
            .input('ENDDATEFROM', apiHelper.getValueFromObject(queryParams, 'end_date_from'))
            .input('ENDDATEFROM', apiHelper.getValueFromObject(queryParams, 'end_date_to'))
            .input('ISCOMPLETE', apiHelper.getFilterBoolean(queryParams, 'is_complete'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.CRM_TASK_GETLIST_ADMINWEB);
        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordsets[0]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
        });
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'TaskService.getTaskList' });
        return new ServiceResponse(true, '', {});
    }
};

const getCustomerList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('TASKID', apiHelper.getValueFromObject(queryParams, 'task_id'))
            .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('TYPEPURCHASE', apiHelper.getValueFromObject(queryParams, 'type_purchase'))
            .input('BIRTHDAYDATEFROM', apiHelper.getValueFromObject(queryParams, 'birthday_date_from'))
            .input('BIRTHDAYDATETO', apiHelper.getValueFromObject(queryParams, 'birthday_date_to'))
            .input('TASKTYPEWFLOWID', apiHelper.getValueFromObject(queryParams, 'task_type_wflow_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.CRM_TASKDETAIL_GETLIST_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.listCustomer(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            meta: {
                in_progress: data.recordsets[1][0]?.COUNTINPROGRESS,
                success: data.recordsets[1][0]?.COUNTSUCCESS,
                failed: data.recordsets[1][0]?.COUNTFAILED,
                all: data.recordsets[1][0]?.COUNTALL,
            },
        });
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'TaskService.getTaskList' });
        return new ServiceResponse(true, '', {});
    }
};

const getCustomerListByUser = async (queryParams = {}, bodyParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');

        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id'))
            .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(queryParams, 'customer_type_id'))
            .input('COUNTRYID', apiHelper.getValueFromObject(queryParams, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(queryParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(queryParams, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(queryParams, 'ward_id'))
            .input('TYPEPURCHASE', apiHelper.getValueFromObject(queryParams, 'type_purchase'))
            .input('BIRTHDAYDATEFROM', apiHelper.getValueFromObject(queryParams, 'birthday_date_from'))
            .input('BIRTHDAYDATETO', apiHelper.getValueFromObject(queryParams, 'birthday_date_to'))
            .input('SUPERVISORUSERNAME', authName)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.CRM_TASKDETAIL_GETLISTBYUSER_ADMINWEB);
        return new ServiceResponse(true, '', {
            data: moduleClass.listCustomerByUser(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            meta: {
                in_progress: data.recordsets[1][0]?.COUNTINPROGRESS,
                success: data.recordsets[1][0]?.COUNTSUCCESS,
                failed: data.recordsets[1][0]?.COUNTFAILED,
                all: data.recordsets[1][0]?.COUNTALL,
            },
        });
    } catch (e) {
        console.log(e);
        logger.error(e, { function: 'TaskService.getTaskList' });
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateTask = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        // Save]
        const createOrUpdateTask = new sql.Request(transaction);
        const resCreateOrUpdateTask = await createOrUpdateTask
            .input('TASKID', apiHelper.getValueFromObject(bodyParams, 'task_id'))
            .input('TASKNAME', apiHelper.getValueFromObject(bodyParams, 'task_name'))
            .input('TASKTYPEID', apiHelper.getValueFromObject(bodyParams, 'task_type_id'))
            .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
            .input('PARENTID', apiHelper.getValueFromObject(bodyParams, 'parent_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))

            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CRM_TASK_CreateOrUpdate_AdminWeb');

        const taskId = resCreateOrUpdateTask.recordset[0].RESULT;

        if (!taskId || taskId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo công việc thất bại', null);
        }

        // delete old member
        const deleteMember = new sql.Request(transaction);
        const data = await deleteMember
            .input('LISTID', [apiHelper.getValueFromObject(bodyParams, 'task_id')])
            .input('NAMEID', 'TASKID')
            .input('TABLENAME', 'CRM_TASKDETAIL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        const member_list = apiHelper.getValueFromObject(bodyParams, 'member_list', []);

        if (member_list?.length > 0) {
            for (let i = 0; i < member_list.length; i++) {
                const createMember = new sql.Request(transaction);
                const resCreateMember = await createMember
                    .input('DATALEADSID', member_list[i].data_leads_id)
                    .input('MEMBERID', member_list[i].member_id)
                    .input('TASKID', taskId)
                    .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
                    .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                    .input('SUPERVISORNAME', apiHelper.getValueFromObject(bodyParams, 'supervisor_user'))
                    .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'staff_user'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('CRM_TASKDETAIL_Create_AdminWeb');
            }
        } else {
            await transaction.rollback();
            return new ServiceResponse(false, 'Danh sách khách hàng là bắt buộc', null);
        }

        removeCacheOptions();

        await transaction.commit();
        return new ServiceResponse(true, '', taskId);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { Task: 'TaskService.createOrUpdateTask' });

        return new ServiceResponse(false, error.message);
    }
};

const taskDetail = async (taskId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool.request().input('TASKID', taskId).execute('CRM_TASK_GetById_AdminWeb');

        let task = resData.recordset[0];

        if (task) {
            task = moduleClass.detail(task);

            task.member_list = moduleClass.memberList(resData.recordsets[1]);

            return new ServiceResponse(true, '', task);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'TaskService.taskDetail' });

        return new ServiceResponse(false, e.message);
    }
};

// const taskAttachmentDetail = async (taskId) => {
//     try {
//         const pool = await mssql.pool;

//         const resData = await pool.request().input('TASKID', taskId).execute('CRM_TASK_GetById_AdminWeb');

//         let task = resData.recordset[0];

//         if (task) {
//             task = moduleClass.attachmentDetail(task);

//             return new ServiceResponse(true, '', task);
//         }

//         return new ServiceResponse(false, '', null);
//     } catch (e) {
//         logger.error(e, { function: 'TaskService.taskAttachmentDetail' });
//     }
// };

const taskCareDetail = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('TASKDETAILID', apiHelper.getValueFromObject(queryParams, 'task_detail_id'))
            .execute('CRM_TASK_GetCareDetail_AdminWeb');

        const customerInformation = moduleClass.customerInformation(resData.recordsets[0][0]);
        customerInformation.interest_content_list = (customerInformation?.interest_content || []).map((item) => {
            return {
                id: item,
                value: item,
            };
        });

        return new ServiceResponse(true, '', {
            currWFlow: resData.recordsets[0][0]?.TASKWORKFLOWID,
            customer_information: customerInformation,
            task_information: moduleClass.taskInformation(resData.recordsets[1][0]),
            workflow_list: moduleClass.workflowList(resData.recordsets[2]),
            total_task: resData.recordsets[3][0]?.TOTALTASK,
        });
    } catch (e) {
        logger.error(e, { function: 'TaskService.taskCareDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const createCareComment = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const createCareComment = new sql.Request(transaction);
        const createCareCommentResData = await createCareComment
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
            .input('WORKFLOWID', apiHelper.getValueFromObject(bodyParams, 'workflow_id'))
            .input('CONTENTCOMMENT', apiHelper.getValueFromObject(bodyParams, 'content_comment'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CRM_TASKDETAILCOMMENT_CreateOrUpdate_AdminWeb');

        const careCommentId = createCareCommentResData.recordset[0].RESULT;

        if (!careCommentId || careCommentId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo comment thất bại', null);
        }

        // Insert IMAGES
        const images = apiHelper.getValueFromObject(bodyParams, 'images');
        if (images && images.length) {
            for (let i = 0; i < images.length; i++) {
                let picture_url;

                if (!images[i].picture_url) {
                    if (fileHelper.isBase64(images[i])) {
                        picture_url = await fileHelper.saveBase64(null, images[i]);
                    }
                }
                picture_url = picture_url || images[i].picture_url?.replace(config.domain_cdn, '');

                const requestCreateImage = new sql.Request(transaction);
                const resultCreateOmage = await requestCreateImage
                    .input('COMMENTID', careCommentId)
                    .input('PICTUREURL', picture_url)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('CRM_TASK_DETAIL_COMMENT_IMAGE_Create_AdminWeb');

                const result = resultCreateOmage.recordset[0].RESULT;
                if (result <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Thêm hình ảnh không thành công.');
                }
            }
        }

        const careProductList = apiHelper.getValueFromObject(bodyParams, 'care_product_list', []);

        if (careProductList.length > 0) {
            const createCareProduct = new sql.Request(transaction);
            for (let i = 0; i < careProductList.length; i++) {
                const createCareProductResData = await createCareProduct
                    .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
                    .input('PRODUCTID', careProductList[i].value)
                    .input('COMMENTID', careCommentId)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('CRM_FAVORITEPRODUCT_Create_AdminWeb');

                const careProductId = createCareProductResData.recordset[0].RESULT;

                if (!careProductId || careProductId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo comment thất bại', null);
                }
            }
        }

        const resData_ = await pool
            .request()
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            //.input('TASKWORKFLOWID', apiHelper.getValueFromObject(bodyParams, 'task_workflow_old_id'))
            .execute('CRM_HISTORY_TASKDETAIL_GetDataChangeWFlow_AdminWeb');

        const conditionList = resData_.recordsets[0].map((e) => ({
            value: removeCharactersVietnamese(e.CONDITIONVALUE),
            id: e?.TASKWORKFLOWID,
        }));
        const productNameList = _.uniq(careProductList.map((e) => removeCharactersVietnamese(e.name)));

        let flag = false;
        if (conditionList.length === 0) {
            flag = true;
        }
        let conditionValue = null;

        // kiểm tra điều kiện sản phẩm
        if (conditionList.length > 0 && productNameList.length > 0) {
            for (let i = 0; i < conditionList.length; i++) {
                for (let j = 0; j < productNameList.length; j++) {
                    const distanceValue = distance(conditionList[i]?.value, productNameList[j]);
                    const minLength = _.min([conditionList[i]?.value.length, productNameList[j].length]);
                    const maxLength = _.max([conditionList[i]?.value.length, productNameList[j].length]);
                    const reverseDistanceValue = maxLength - distanceValue;

                    if (reverseDistanceValue / minLength >= 0.95) {
                        flag = true;
                        conditionValue = conditionList[i];
                        break;
                    }
                }

                if (flag) {
                    break;
                }
            }
        }

        const contentComment = apiHelper.getValueFromObject(bodyParams, 'content_comment');
        const conditionContentComment = resData_.recordsets[0].find(
            (condition) => condition.CONDITIONVALUE === contentComment,
        );

        let dataResponse = null;

        if (
            (flag && conditionValue) ||
            (conditionContentComment &&
                apiHelper.getValueFromObject(bodyParams, 'workflow_id') !== conditionContentComment?.TASKWORKFLOWID)
        ) {
            const createCareProduct = new sql.Request(transaction);
            const resData = await createCareProduct
                .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
                .input(
                    'TASKWORKFLOWID',
                    conditionContentComment ? conditionContentComment?.TASKWORKFLOWID : conditionValue?.id,
                )
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('CRM_HISTORY_TASKDETAIL_ChangeWFlow_AdminWeb');

            const result = resData.recordset[0].RESULT;

            dataResponse = result;
            if (!result || result <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Chuyển bước thất bại', null);
            }
        }
        const result = { careCommentId: careCommentId, dataResponse: dataResponse}
        await transaction.commit();
        return new ServiceResponse(true, '', result);
    } catch (e) {
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const updateInterestContent = async (payload) => {
    try {
        const pool = await mssql.pool;
        const updateInterestContentResData = await pool
            .request()
            .input('TASKDETAILID', apiHelper.getValueFromObject(payload, 'task_detail_id'))
            .input('INTERESTCONTENT', apiHelper.getValueFromObject(payload, 'interest_content'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(payload, 'auth_name'))
            .execute('CRM_TASKDETAIL_UpdateInterestContent_AdminWeb');

        const result = updateInterestContentResData.recordset[0].RESULT;

        if (!result || result <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo nội dung quan tâm thất bại', null);
        }

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'TaskService.updateInterestContent' });
        return new ServiceResponse(false, e.message);
    }
};

const getCareCommentList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const resData = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('TASKDETAILID', apiHelper.getValueFromObject(queryParams, 'task_detail_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id'))
            // .input('WORKFLOWID', apiHelper.getValueFromObject(queryParams, 'workflow_id'))
            .execute('CRM_TASKDETAILCOMMENT_GetList_AdminWeb');

        let commentList = moduleClass.careCommentList(resData.recordset);
        const productList = moduleClass.careProductList(resData.recordsets[1]);
        const imageList = moduleClass.imagesList(resData.recordsets[2]);
        commentList = commentList.map((comment) => {
            comment.picture_url = imageList.filter((item) => item.comment_id === comment.comment_id);
            comment.care_product_list = productList.filter((product) => product.comment_id === comment.comment_id);
            return comment;
        });

        return new ServiceResponse(true, '', {
            data: commentList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'TaskService.getCareCommentList' });

        return new ServiceResponse(false, e.message);
    }
};

const getCareProductList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const resData = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('TASKDETAILID', apiHelper.getValueFromObject(queryParams, 'task_detail_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id'))
            .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id'))
            .execute('CRM_TASKDETAILCOMMENT_GetList_HistoryProduct_Care_AdminWeb');
            
        return new ServiceResponse(true, '', {
            data: moduleClass.careProductHistory(resData.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'TaskService.getCareProductList' });

        return new ServiceResponse(false, e.message);
    }
};

const changeWorkFlow = async (bodyParams) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            .input('TASKWORKFLOWID', apiHelper.getValueFromObject(bodyParams, 'task_workflow_id'))
            //.input('TASKWORKFLOWOLDID', apiHelper.getValueFromObject(bodyParams, 'task_workflow_old_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CRM_HISTORY_TASKDETAIL_ChangeWFlow_AdminWeb');

        const result = resData.recordset[0].RESULT;

        if (!result || result <= 0) {
            return new ServiceResponse(false, 'Thay đổi trạng thái thất bại', null);
        }

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, { function: 'TaskService.changeWorkFlow' });
        return new ServiceResponse(false, e.message);
    }
};

const getCareHistoryList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const resData = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('TASKDETAILID', apiHelper.getValueFromObject(queryParams, 'task_detail_id'))
            .input('TAB', apiHelper.getValueFromObject(queryParams, 'tab'))
            .execute('CRM_TASKDETAILHISTORY_GetList_AdminWeb');

        let historyList = moduleClass.careHistoryList(resData.recordset);

        const productList = moduleClass.careProductList(resData.recordsets[1]);

        historyList = historyList.map((comment) => {
            comment.care_product_list = productList.filter((product) => product.comment_id === comment.comment_id);
            return comment;
        });

        return new ServiceResponse(true, '', {
            data: historyList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'TaskService.getCareHistoryList' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteTask = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'TASKID')
            .input('TABLENAME', 'CRM_TASK')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'TaskService.deleteTask' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TASKTYPEID', apiHelper.getValueFromObject(queryParams, 'task_type_id', null))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id', null))
            .input('PARENTID', apiHelper.getValueFromObject(queryParams, 'parent_id', null))
            .input('ISACTIVE', 1)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search', null))
            .input('LIMIT', apiHelper.getValueFromObject(queryParams, 'limit', 100))
            .execute('CRM_TASK_GetOptions_AdminWeb');

        return new ServiceResponse(true, '', moduleClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'TaskService.getOptions' });
        return new ServiceResponse(true, '', {});
    }
};

const getUserOptionsByDepartmentStore = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id', null))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id', null))
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search', null))
            .input('LIMIT', apiHelper.getValueFromObject(queryParams, 'limit', 100))
            .execute('CRM_TASK_GetUserOptionsByDepartment_AdminWeb');

        removeCacheOptions();

        return new ServiceResponse(true, '', moduleClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'TaskService.getUserOptionsByDepartmentStore' });

        return new ServiceResponse(true, '', {});
    }
};

const getMemberList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('CUSTOMERTYPE', apiHelper.getValueFromObject(queryParams, 'customer_type'))
            .input('GENDER', apiHelper.getValueFromObject(queryParams, 'gender'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('CRM_TASK_GetMemberList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.memberList(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'TaskService.getMemberList' });

        return new ServiceResponse(true, '', {});
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASK_OPTIONS);
};

const createSMSCustomer = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        // console.log(
        //     apiHelper.getValueFromObject(bodyParams, 'content_sms', '').replace(/\{(.+?)\,(\d*)\}/, (match, p1, p2) => {
        //         return '12345678901234567890123456789012345678901345678901234567890'.slice(0, p2);
        //     }),
        // );
        const sendSmsRes = await sendMultipleMessage_V4_post_json({
            phone: apiHelper.getValueFromObject(bodyParams, 'phone_number'),
            content: apiHelper.getValueFromObject(bodyParams, 'content_sms'),
            brandname: apiHelper.getValueFromObject(bodyParams, 'brandname'),
        });

        if (sendSmsRes.isFailed()) {
            return new ServiceResponse(false, 'Gửi sms thất bại', null);
        }

        const sms_id = sendSmsRes.getData().SMSID;

        const createSMSCustomerResData = await pool
            .request()
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            .input('CONTENTSMS', apiHelper.getValueFromObject(bodyParams, 'content_sms'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('TASKSCHEDULEID', apiHelper.getValueFromObject(bodyParams, 'taskschedule_id'))
            .input('STATUS', apiHelper.getValueFromObject(bodyParams, 'status'))
            .input('ISSENT', 0)
            .input('ERRORMSG', apiHelper.getValueFromObject(bodyParams, 'error_msg'))
            .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
            .input('SMSID', sms_id)
            .execute(PROCEDURE_NAME.CRM_TASKDETAILSMS_CREATE_ADMINWEB);

        const smsCustomerId = createSMSCustomerResData.recordset[0].RESULT;

        if (!smsCustomerId || smsCustomerId <= 0) {
            return new ServiceResponse(false, 'Tạo sms thất bại', null);
        }

        return new ServiceResponse(true, '', smsCustomerId);
    } catch (e) {
        logger.error(e, { function: 'TaskService.createSMSCustomer' });

        return new ServiceResponse(false, e.message);
    }
};

const updateSMSStatus = async (queryParams) => {
    try {
        // SMSID: 'Mã tin nhắn';
        // SendFailed: 'Số lượng tin nhắn thất bại';
        // SendStatus: `Trạng thái tin nhắn
        //                 1: Chờ duyệt
        //                 4: Từ chối
        //                 5: Đã gửi xong`;
        // SendSuccess: 'Số lượng tin thành công';
        // TotalReceiver: 'Tổng số người nhận';
        // TotalSent: 'Tổng số lượng tin được gửi';
        // RequestId: 'Mã request của khách hàng';
        // TypeId: `Loại tin nhắn
        //             1: tin quảng cáo
        //             2: tin chăm sóc khách hàng
        //             23: tin viber
        //             24: tin zalo ưu tiên
        //             25: tin zalo bình thường`;
        // telcoid: `Nhà mạng
        //             1: Viettel, 2: Mobi, 3: Vina, 4: Vietnammobile, 5: Gtel, 6: Itel, 7: Reddi`;
        // phonenumber: 'Số điện thoại người nhận';

        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('SMSID', apiHelper.getValueFromObject(queryParams, 'SMSID'))
            .input('ISSENT', apiHelper.getValueFromObject(queryParams, 'SendSuccess', 0) > 0)
            .execute('CRM_TASKDETAILSMS_UpdateStatus_AdminWeb');

        // console.log(queryParams);

        return new ServiceResponse(true, '', {});
    } catch (e) {
        logger.error(e, { function: 'TaskService.updateSMSStatus' });

        return new ServiceResponse(false, e.message);
    }
};

const createCallCustomer = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const createCallCustomer = new sql.Request(transaction);

        const createCallCustomerResData = await createCallCustomer
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            .input('RESPONSIBLEUSERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('CALLTYPEID', apiHelper.getValueFromObject(bodyParams, 'call_type_id'))
            .input('EVENTSTARTDATETIME', apiHelper.getValueFromObject(bodyParams, 'datetime_from'))
            .input('EVENTENDDATETIME', apiHelper.getValueFromObject(bodyParams, 'datetime_to'))
            .input('DURATION', apiHelper.getValueFromObject(bodyParams, 'duration'))
            .input('SUBJECT', apiHelper.getValueFromObject(bodyParams, 'call_subject'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'content_call'))
            .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
            .input('SIPID', apiHelper.getValueFromObject(bodyParams, 'sip_id'))
            .execute(PROCEDURE_NAME.CRM_TASKDETAILCALL_CREATE_ADMINWEB);

        const callCustomerId = createCallCustomerResData.recordset[0].RESULT;

        if (!callCustomerId || callCustomerId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo call thất bại', null);
        }

        await transaction.commit();
        return new ServiceResponse(true, '', callCustomerId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'TaskService.createCallCustomer' });

        return new ServiceResponse(false, e.message);
    }
};

const createMeetingCustomer = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const createCallCustomer = new sql.Request(transaction);

        const createCallCustomerResData = await createCallCustomer
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            .input('RESPONSIBLEUSERNAME', apiHelper.getValueFromObject(bodyParams, 'username'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('EVENTSTARTDATETIME', apiHelper.getValueFromObject(bodyParams, 'datetime_from'))
            .input('EVENTENDDATETIME', apiHelper.getValueFromObject(bodyParams, 'datetime_to'))
            .input('MEETINGSUBJECT', apiHelper.getValueFromObject(bodyParams, 'appointment_subject'))
            .input('CONTENTMEETING', apiHelper.getValueFromObject(bodyParams, 'content_appointment'))
            .input('LOCATION', apiHelper.getValueFromObject(bodyParams, 'location'))
            .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'data_leads_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .execute(PROCEDURE_NAME.CRM_TASKDETAILMEETING_CREATE_ADMINWEB);

        const meetingCustomerId = createCallCustomerResData.recordset[0].RESULT;

        if (!meetingCustomerId || meetingCustomerId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo meeting thất bại', null);
        }

        await transaction.commit();
        return new ServiceResponse(true, '', meetingCustomerId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'TaskService.createMeetingCustomer' });

        return new ServiceResponse(false, e.message);
    }
};

const getBrandnameOptions = async () => {
    try {
        const resData = await getListBrandname();

        if (resData.isFailed()) {
            return resData;
        }

        const data = resData.getData();

        return new ServiceResponse(
            true,
            '',
            _.uniqBy(moduleClass.brandnameOptions(data.ListBrandName), (obj) => obj.id),
        );
    } catch (e) {
        logger.error(e, { function: 'TaskService.getBrandnameOptions' });

        return new ServiceResponse(true, '', {});
    }
};

const getSmsTemplateOptions = async (queryParams) => {
    try {
        const resData = await getTemplate({ brandname: apiHelper.getValueFromObject(queryParams, 'brandname') });

        if (resData.isFailed()) {
            return resData;
        }

        const data = resData.getData();

        return new ServiceResponse(true, '', moduleClass.smsTemplateOptions(data.BrandnameTemplates));
    } catch (e) {
        logger.error(e, { function: 'TaskService.getSmsTemplateOptions' });

        return new ServiceResponse(true, '', {});
    }
};

const getTaskTypeAutoOptions = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('ISACTIVE', 1)
            .input('ISDELETED', 0)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.CRM_TASKTYPE_GETLIST);

        return new ServiceResponse(true, '', {
            data: moduleClass.taskTypeOption(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'TaskService.getTaskList' });
        return new ServiceResponse(true, '', {});
    }
};

const getTaskWithVoip = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('MEMBERID', apiHelper.getValueFromObject(queryParams, 'member_id', null))
            .input('DATALEADSID', apiHelper.getValueFromObject(queryParams, 'data_leads_id', null))
            .execute('CRM_TASKTYPE_WFLOW_GetWithVoip_AdminWeb');
        const data = resData.recordset[0];
        if (data) {
            data.work_flow_list = resData.recordsets[1];
        }
        return new ServiceResponse(true, '', data ?? null);
    } catch (e) {
        logger.error(e, { function: 'TaskService.getTaskWithVoip' });

        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getTaskList,
    createOrUpdateTask,
    taskDetail,
    // taskAttachmentDetail,
    taskCareDetail,
    createCareComment,
    getCareCommentList,
    changeWorkFlow,
    getCareHistoryList,
    deleteTask,
    getOptions,
    getUserOptionsByDepartmentStore,
    getMemberList,
    getCustomerList,
    getCustomerListByUser,
    createSMSCustomer,
    updateSMSStatus,
    createCallCustomer,
    createMeetingCustomer,
    getBrandnameOptions,
    getSmsTemplateOptions,
    getTaskTypeAutoOptions,
    getTaskWithVoip,
    updateInterestContent,
    getCareProductList
};
