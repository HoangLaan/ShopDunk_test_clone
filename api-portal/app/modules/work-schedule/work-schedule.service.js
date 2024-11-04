const ModuleClass = require('./work-schedule.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const moment = require('moment');
const sql = require('mssql');
const API_CONST = require('../../common/const/api.const');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const fileHelper = require('../../common/helpers/file.helper');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('WORKSCHEDULETYPEID', apiHelper.getValueFromObject(queryParams, 'work_schedule_type_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_filter'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_GETLIST_ADMINWEB);

        const workScheduleData = ModuleClass.listWorkSchedule(data.recordset);
        const resDataTrans = workScheduleData.map((item) => {
            return {
                ...item,
                review_info: item?.review_info
                    ? ModuleClass.detailInfoReview(
                          JSON.parse(item?.review_info)?.map((item) => ({
                              ...item,
                              ISREVIEW: parseInt(item.ISREVIEW),
                          })),
                      )
                    : [],
            };
        });

        return new ServiceResponse(true, '', {
            data: resDataTrans,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'workScheduleService.getListWorkSchedule' });
        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdate = async (bodyParams = {}, files = [], { user_name }) => {
    const pool = await mssql.pool;
    let newAttachments = [];
    let workScheduleId = apiHelper.getValueFromObject(bodyParams, 'work_schedule_id');
    const transaction = new sql.Transaction(pool);
    try {
        if (files && files.length) {
            for (let i = 0; i < files.length; i++) {
                const resFile = await fileHelper.uploadFile(files[i]);
                resFile.data.fileName = files[i].originalname;
                if (!resFile || Object.keys(resFile).length === 0)
                    return new ServiceResponse(false, 'Upload file attachment failed!');
                newAttachments.push(resFile.data);
            }
        }
        // convert time
        let startTime = apiHelper.getValueFromObject(bodyParams, 'start_time');
        let endTime = apiHelper.getValueFromObject(bodyParams, 'end_time');
        startTime = moment.utc(startTime, 'hh:mm A DD/MM/YYYY').toDate();
        endTime = moment.utc(endTime, 'hh:mm A DD/MM/YYYY').toDate();

        await transaction.begin();
        const requestCreate = new sql.Request(transaction);
        const resultCreate = await requestCreate
            .input('WORKSCHEDULEID', workScheduleId)
            .input('WORKSCHEDULETYPEID', apiHelper.getValueFromObject(bodyParams, 'work_schedule_type_id'))
            .input('WORKSCHEDULENAME', apiHelper.getValueFromObject(bodyParams, 'work_schedule_name'))
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('STARTTIME', startTime)
            .input('ENDTIME', endTime)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', user_name)
            .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_CREATEORUPDATE_ADMINWEB);

        workScheduleId = resultCreate.recordset[0]?.RESULT;
        if (!workScheduleId) {
            throw new Error('Create or update work schedule failed!');
        }

        // delete attachments except
        const attachments = apiHelper.getValueFromObject(bodyParams, 'attached_files') || [];
        if (workScheduleId) {
            const previousAttachmentIds = attachments.map((_) => _.attachment_id);
            const requestDeleteFile = new sql.Request(transaction);
            const resultFile = await requestDeleteFile
                .input('LISTID', previousAttachmentIds)
                .input('WORKSCHEDULEID', workScheduleId)
                .input('DELETEDUSER', user_name)
                .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_ATTACHMENT_DELETEBYWORKSCHEDULEID_ADMINWEB);

            if (!resultFile.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Delete attachment failed!');
            }
        }

        // insert attachments
        if (newAttachments.length > 0) {
            const reqInsertAttachment = new sql.Request(transaction);
            for (const item of newAttachments) {
                const resInsertAttachment = await reqInsertAttachment
                    .input('WORKSCHEDULEID', workScheduleId)
                    .input('ATTACHMENTPATH', item[0].file || item[0].attachment_path)
                    .input('ATTACHMENTNAME', item[0].fileName || item[0].attachment_name || 'file name')
                    .input('CREATEDUSER', user_name)
                    .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_ATTACHMENT_CRETAE_ADMINWEB);
                if (!resInsertAttachment.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Insert attachment work schedule failed!');
                }
            }
        }

        // delete review list
        if (workScheduleId) {
            const requestReviewListDelete = new sql.Request(transaction);
            const resultDelReviewList = await requestReviewListDelete
                .input('WORKSCHEDULEID', workScheduleId)
                .input('UPDATEDUSER', user_name)
                .execute(PROCEDURE_NAME.HR_WORKSCHEDULEREVIEWLIST_DELETEBYWORKSCHEDULEID_ADMINWEB);

            if (!resultDelReviewList.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Delete work schedule review list failed!');
            }
        }

        // insert review list
        const dataReviewLists = apiHelper.getValueFromObject(bodyParams, 'work_schedule_review', []);
        if (dataReviewLists && dataReviewLists.length > 0) {
            const listCheckReview = _.uniqBy(dataReviewLists, 'user_review');
            if (listCheckReview.length !== dataReviewLists.length) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Người duyệt phải khác nhau ở mỗi mức duyệt !');
            }

            for (let reviewItem of dataReviewLists) {
                let { work_schedule_review_level_id: reviewLevelId, user_review: userReview = null } = reviewItem;
                if (reviewLevelId) {
                    let requestAddReviewList = new sql.Request(transaction);
                    let resultAddReviewList = await requestAddReviewList
                        .input('WORKSCHEDULEID', workScheduleId)
                        .input('WORKSCHEDULEREVIEWLEVELID', reviewLevelId)
                        .input('REVIEWUSER', userReview)
                        .input('CREATEDUSER', user_name)
                        .execute(PROCEDURE_NAME.HR_WORKSCHEDULEREVIEWLIST_CREATE_ADMINWEB);

                    if (!resultAddReviewList.recordset[0].RESULT) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Create work schedule review list failed!');
                    }
                }
            }
        }

        // delete work schedule reasons
        if (workScheduleId) {
            const requestReasonListDelete = new sql.Request(transaction);
            const resultDelReason = await requestReasonListDelete
                .input('WORKSCHEDULEID', workScheduleId)
                .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_REASON_DELETEBYWORKSCHEDULEID_ADMINWEB);

            if (!resultDelReason.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Delete work schedule reason failed!');
            }
        }

        // create or update reasons
        const reasonList = apiHelper.getValueFromObject(bodyParams, 'reason_list', []);
        for (let reason of reasonList) {
            const reasonId = Number.isInteger(reason) ? reason : reason.id;
            if (isNaN(Number(reasonId))) {
                continue;
            }

            let requestAddReason = new sql.Request(transaction);
            let resultAddReason = await requestAddReason
                .input('WORKSCHEDULEID', workScheduleId)
                .input('WORKSCHEDULEREASONID', reasonId)
                .input('CREATEDUSER', user_name)
                .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_REASON_CREATE_ADMINWEB);

            if (!resultAddReason.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Create work schedule review list failed!');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'success');
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'workScheduleService.createUserOrUpdate' });
        return new ServiceResponse(false, e);
    }
};

const getListReview = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('WORKSCHEDULETYPEID', apiHelper.getValueFromObject(queryParams, 'work_schedule_type_id'))
            .execute(PROCEDURE_NAME.HR_WORKSCHEDULETYPE_GETLISTREVIEW_ADMINWEB);

        const resData = ModuleClass.reviewList(data.recordset).reduce((acc, item) => {
            const existingItem = acc.find(i => i.work_schedule_review_level_id === item.work_schedule_review_level_id);
            if (!existingItem) {
                acc.push(item);
            }
            return acc;
        }, []);
        const resDataTrans = resData.map((item) => {
            return { ...item, users: item.users ? ModuleClass.detailUser(JSON.parse(item.users)) : [] };
        });
        return new ServiceResponse(true, '', { data: resDataTrans || [] });
    } catch (e) {
        logger.error(e, { function: 'workScheduleService.getListReview' });
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (workScheduleId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('WORKSCHEDULEID', workScheduleId)
            .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_GETBYID_ADMINWEB);
        let dataRes = ModuleClass.detailWorkSchedule(data.recordsets[0][0]);
        // convert time
        dataRes.start_time = moment.utc(dataRes.start_time).format('HH:00 A DD/MM/YYYY');
        dataRes.end_time = moment.utc(dataRes.end_time).format('HH:00 A DD/MM/YYYY');
        dataRes.attached_files = ModuleClass.detailAttachment(data.recordsets[2]);
        const reasonIds = data.recordsets[3];
        if (reasonIds && reasonIds.length > 0) {
            dataRes.reason_list = reasonIds.map((_) => _.ID);
        }

        dataRes.work_schedule_review = ModuleClass.listInfoReview(data.recordsets[1]);
        // get list user review
        if (dataRes.work_schedule_type_id) {
            const reviewRes = await getListReview({ work_schedule_type_id: dataRes.work_schedule_type_id });
            if (reviewRes.isSuccess()) {
                const reviewListByType = reviewRes.getData()?.data || [];

                dataRes.work_schedule_review?.forEach((review) => {
                    const reviewByType = reviewListByType.find(
                        (_) => _.work_schedule_review_level_id == review.work_schedule_review_level_id,
                    );
                    if (reviewByType) {
                        review.users = reviewByType.users;
                    }
                });
            }
        }

        return new ServiceResponse(true, '', dataRes);
    } catch (e) {
        logger.error(e, { function: 'workScheduleService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteWorkSchedule = async (workScheduleId, body) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const requestDeleteWorkSchedule = new sql.Request(transaction);
        await requestDeleteWorkSchedule
            .input('WORKSCHEDULEID', workScheduleId)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_DELETEBYID_ADMINWEB);

        const requestDeleteAttachment = new sql.Request(transaction);
        await requestDeleteAttachment
            .input('WORKSCHEDULEID', workScheduleId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.HR_WORKSCHEDULE_ATTACHMENT_DELETEBYWORKSCHEDULEID_ADMINWEB);

        const requestDeleteReviewList = new sql.Request(transaction);
        await requestDeleteReviewList
            .input('WORKSCHEDULEID', workScheduleId)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.HR_WORKSCHEDULEREVIEWLIST_DELETEBYWORKSCHEDULEID_ADMINWEB);

        await transaction.commit();
        return new ServiceResponse(true, 'success');
    } catch (error) {
        logger.error(error, { function: 'workScheduleService.delete' });
        await transaction.rollback();
        return new ServiceResponse(false, error.message);
    }
};

const updateReviewLevel = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('WORKSCHEDULEID', apiHelper.getValueFromObject(body, 'work_schedule_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(body, 'is_review'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(`HR_WORKSCHEDULEREVIEWLIST_UpdateReview_AdminWeb`);

        return new ServiceResponse(true, 'success');
    } catch (error) {
        logger.error(error, { function: 'workScheduleService.updateReviewLevel' });
        return new ServiceResponse(false, error.message);
    }
};

const getOrderApply = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(`HR_WORKSCHEDULETYPE_GetOrderApply_AdminWeb`);
        return new ServiceResponse(
            true,
            'Lấy danh sách đơn hàng áp dụng thành công',
            ModuleClass.orderApply(data.recordset),
        );
    } catch (e) {
        logger.error(e, { function: 'workScheduleService.getOrderApply' });
        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    getList,
    createOrUpdate,
    getListReview,
    detail,
    deleteWorkSchedule,
    updateReviewLevel,
    getOrderApply,
};
