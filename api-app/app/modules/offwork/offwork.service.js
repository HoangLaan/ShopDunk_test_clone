const OffWorkClass = require('./offwork.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const moment = require('moment');

const getListOffWork = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('STATUS', apiHelper.getValueFromObject(queryParams, 'status')) //0: TU CHOI; 1:CHAP NHAN; 2:CHUA DUYET; 3:DANG DUYET
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .execute('HR_OFFWORK_GetList_App');

        const offworks = data.recordset;

        return new ServiceResponse(true, '', {
            data: OffWorkClass.list(offworks),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(offworks),
        });
    } catch (e) {
        logger.error(e, {function: 'offWorkService.getListOffWork'});
        return new ServiceResponse(false, '', {});
    }
};

const createOffWork = async (bodyParams = {}, files = [], {user_name, full_name}) => {
    return await createUserOrUpdate(JSON.parse(bodyParams.body), files, user_name, full_name);
};

const createUserOrUpdate = async (bodyParams = {}, files = [], user_name, full_name) => {
    const pool = await mssql.pool;
    let allFile = [];
    const transaction = await new sql.Transaction(pool);
    try {
        if (files && files.length) {
            const resFile = await fileHelper.uploadFile(files);
            if (!resFile || Object.keys(resFile).length === 0)
                return new ServiceResponse(false, 'Upload file attachment failed!');
            allFile = allFile.concat(resFile.data);
        }
        await transaction.begin();
        const is_refuse = apiHelper.getValueFromObject(bodyParams, 'is_refuse');
        const {user_refuse, full_name_refuse, from_date, to_date, total_time_off} = bodyParams;
        const user_send = `${user_name} - ${full_name}`;
        const date_off = `${from_date} - ${to_date}`;
        const requestOffWorkCreate = new sql.Request(transaction);
        const resultOffWorkCreate = await requestOffWorkCreate
            .input('OFFWORKID', apiHelper.getValueFromObject(bodyParams, 'off_work_id'))
            .input('USERNAME', user_name)
            .input('OFFWORKTYPEID', apiHelper.getValueFromObject(bodyParams, 'off_work_type_id'))
            .input('CONTENTOFFWORK', apiHelper.getValueFromObject(bodyParams, 'content_off_work'))
            .input('ISAPPROVE', apiHelper.getValueFromObject(bodyParams, 'is_approve'))
            .input('ISREFUSE', apiHelper.getValueFromObject(bodyParams, 'is_refuse'))
            .input('USERREFUSE', is_refuse ? apiHelper.getValueFromObject(bodyParams, 'user_refuse') : null)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('DATEOFFFROM', apiHelper.getValueFromObject(bodyParams, 'from_date'))
            .input('DATEOFFTO', apiHelper.getValueFromObject(bodyParams, 'to_date'))
            .input('TOTALTIMEOFF', apiHelper.getValueFromObject(bodyParams, 'total_time_off'))
            .execute(PROCEDURE_NAME.HR_OFFWORK_CREATEORUPDATE_APP);

        const offWorkId = resultOffWorkCreate.recordset[0].RESULT;
        if (!offWorkId) {
            throw new Error('Create offwork failed!');
        }
        if (allFile.length) {
            const reqInsertAttachment = new sql.Request(transaction);
            for (const item of allFile) {
                const resInsertAttachment = await reqInsertAttachment
                    .input('OFFWORKID', offWorkId)
                    .input('ATTACHMENTPATH', item.file || item.attachment_path)
                    .input('ATTACHMENTNAME', item.fileName || item.attachment_name || 'file name')
                    .input('CREATEDUSER', user_name)
                    .execute(PROCEDURE_NAME.HR_OFFWORK_ATTACHMENT_CREATE_APP);
                if (!resInsertAttachment.recordset[0].RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Insert attachment offwork failed!');
                }
            }
        }
        const id = apiHelper.getValueFromObject(bodyParams, 'off_work_id');

        if (id && id != '') {
            // Delete offwork review list
            const requestOffWorkReviewListDelete = new sql.Request(transaction);
            const resultOffWorkReviewList = await requestOffWorkReviewListDelete
                .input('OFFWORKID', id)
                .input('UPDATEDUSER', user_name)
                .execute(PROCEDURE_NAME.HR_OFFWORKREVIEWLIST_DELETEBYOFFWORKID_APP);

            if (!resultOffWorkReviewList.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Delete offwork review list failed!');
            }
        }
        const dataOffWorkReviewLists = apiHelper.getValueFromObject(bodyParams, 'offwork_review_list', []);
        if (dataOffWorkReviewLists && dataOffWorkReviewLists.length) {
            const listCheckOffWorkReviewLists = _.uniqBy(dataOffWorkReviewLists, 'user_review');

            if (listCheckOffWorkReviewLists.length !== dataOffWorkReviewLists.length) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Double user review.');
            }
            const list_payload_mail_review = [];
            for (let i = 0; i < dataOffWorkReviewLists.length; i++) {
                let {
                    offwork_review_level_id: offWorkReviewLevelId,
                    user_review,
                    is_auto_review = 0,
                    full_name_review,
                } = dataOffWorkReviewLists[i];
                if (offWorkReviewLevelId) {
                    let requestOffWorkReviewList = new sql.Request(transaction);
                    let resultOffWorkReviewList = await requestOffWorkReviewList // eslint-disable-line no-await-in-loop
                        .input('OFFWORKID', offWorkId)
                        .input('OFFWORKREVIEWLEVELID', offWorkReviewLevelId)
                        .input('REVIEWUSER', user_review)
                        .input('ISAUTOREVIEW', is_auto_review)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute(PROCEDURE_NAME.HR_OFFWORKREVIEWLIST_CREATE_APP);

                    if (!resultOffWorkReviewList.recordset[0].RESULT) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Create offwork review list failed!');
                    }

                    // Gửi mail cho user duyệt
                    const bodyMailReview = {
                        is_send_to_all: 0,
                        parent_id: 0,
                        recipient_email: [
                            {
                                value: `USER-${user_review}`,
                                label: `${user_review} - ${full_name_review}`,
                            },
                        ],
                        mail_subject: `Xác nhận duyệt bàn giao công việc trong thời gian nghỉ phép của ${user_send} ngày ${date_off}`,
                        mail_content: `<h3>Kính gửi Anh/Chị,</h3>\n<p>Nhân sự ${user_send}, đã tạo nghỉ phép ngày ${date_off}. Là nhân sự duyệt, Anh/Chị vui lòng xác nhận\n<p>Thông tin nghỉ phép - Số ngày nghỉ: ${total_time_off}</p>\n<a target="_blank" href=\"${config.domain_cdn}portal/off-work/review/${offWorkId}\">Xác nhận</a>\n<p>Trân trọng cảm ơn Anh/Chị.</p>`,
                    };
                    list_payload_mail_review.push(bodyMailReview);
                }
            }
            bodyParams.list_payload_mail_review = list_payload_mail_review;
        }

        // Gửi mail cho nhân sự thay thế
        if (!id && is_refuse) {
            const bodyMail = {
                is_send_to_all: 0,
                parent_id: 0,
                recipient_email: [
                    {
                        value: `USER-${user_refuse}`,
                        label: `${user_refuse} - ${full_name_refuse}`,
                    },
                ],
                mail_subject: `Xác nhận bàn giao công việc trong thời gian nghỉ phép của ${user_send} ngày ${date_off}`,
                mail_content: `<h3>Kính gửi anh/chị,</h3>\n<p>Nhân sự ${user_send}, đã tạo nghỉ phép ngày ${date_off}.Là nhân sự thay thế, anh/chị vui lòng bấm <b>Nhận bàn giao.</b></p>\n<p>Thông tin nghỉ phép - Số ngày nghỉ: ${total_time_off}</p>\n<a target="_blank" href=\"${config.domain_cdn}portal/off-work/edit/${offWorkId}?user_refuse=${user_refuse}\">Xác nhận</a>\n<p>Trân trọng cảm ơn anh/chị.</p>`,
            };
            bodyParams = {
                ...bodyParams,
                ...bodyMail,
            };
        }

        await transaction.commit();
        return new ServiceResponse(true, 'ok', bodyParams);
    } catch (e) {
        console.log(e);
        await transaction.rollback();
        logger.error(e, {function: 'offWorkService.createUserOrUpdate'});
        return new ServiceResponse(false, e);
    }
};

const detailOffWork = async offWorkId => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('OFFWORKID', offWorkId).execute('HR_OFFWORK_GetById_App');
        let offwork = OffWorkClass.detail(data.recordset[0]);
        offwork.off_work_type = OffWorkClass.detailOffWorkType(data.recordsets[1][0]);
        offwork.offwork_review_list = OffWorkClass.offWorkReviewList(data.recordsets[2]);
        offwork.attachments = OffWorkClass.detailAttachment(data.recordsets[3]);
        // Kiem tra nghi phep dang duyet hay khong
        if (
            offwork.is_approve == 2 &&
            (offwork.offwork_review_list || []).filter(x => !x.is_auto_review && x.review_date).length
        ) {
            offwork.is_approve = 3; // dang duyet
        }
        return new ServiceResponse(true, '', offwork);
    } catch (e) {
        logger.error(e, {function: 'offWorkService.detailOffWork'});

        return new ServiceResponse(false, e.message);
    }
};

const detailOffWorkReview = async (reqParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OFFWORKID', apiHelper.getValueFromObject(reqParams, 'offWorkId'))
            .input('USERNAME', apiHelper.getValueFromObject(reqParams, 'auth_name'))
            .execute('HR_OFFWORK_GetReviewById_App');

        let offwork = OffWorkClass.detail(data.recordset[0]);

        offwork.off_work_type = OffWorkClass.detailOffWorkType(data.recordsets[1][0]);
        offwork.offwork_review = OffWorkClass.offWorkReview(data.recordsets[2]);
        // Kiem tra nghi phep dang duyet hay khong
        if (
            offwork.is_approve == 2 &&
            (offwork.offwork_review_list || []).filter(x => !x.is_auto_review && x.review_date).length
        ) {
            offwork.is_approve = 3; // dang duyet
        }
        return new ServiceResponse(true, '', offwork);
    } catch (e) {
        logger.error(e, {function: 'offWorkService.detailOffWork'});

        return new ServiceResponse(false, e.message);
    }
};

const getTotalDayOffWork = async (reqParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(reqParams, 'auth_name'))
            .execute('HR_TOTALDAYOFFWORK_GetByUserName_App');

        let dayOffwork =
            data.recordset && data.recordset.length
                ? OffWorkClass.dayoffwork(data.recordset[0])
                : {
                      total_time_off: 0,
                      time_can_off: 0,
                      total_time: 0,
                      is_can_review: 0,
                  };
        return new ServiceResponse(true, '', dayOffwork);
    } catch (e) {
        logger.error(e, {function: 'offWorkService.getTotalDayOffWork'});
        return new ServiceResponse(false, e.message);
    }
};

const approvedOffWorkReviewList = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const {
            user_name_register,
            full_name_register,
            auth_name: user_review,
            review_user_full_name: full_name_review,
        } = bodyParams;
        const user_register = `${user_name_register} - ${full_name_register}`;
        const is_review = apiHelper.getValueFromObject(bodyParams, 'is_review');

        const data = await pool
            .request()
            .input('OFFWORKREVIEWLISTID', apiHelper.getValueFromObject(bodyParams, 'off_work_review_list_id'))
            .input('ISREVIEW', is_review)
            .input('REVIEWNOTE', apiHelper.getValueFromObject(bodyParams, 'review_note'))
            .input('REVIEWUSER', user_review)
            .execute('HR_OFFWORKREVIEWLIST_Approved_App');

        console.log(data.recordset);

        let result = data.recordset[0].RESULT;

        switch (result) {
            case 1:
                const bodyMailConfirm = {
                    is_send_to_all: 0,
                    parent_id: 0,
                    recipient_email: [
                        {
                            value: `USER-${user_name_register}`,
                            label: user_register,
                        },
                    ],
                    mail_subject: `Xác nhận trạng thái nghỉ phép của ${user_register} ngày ${moment().format(
                        'DD/MM/YYYY',
                    )}`,
                    mail_content: `Xác nhận nghỉ phép của bạn đã được ${user_review} - ${full_name_review} xác nhận ! \n<p>Trạng thái duyệt: ${
                        is_review ? 'Đã duyệt' : 'Không duyệt'
                    }</p>`,
                };
                return new ServiceResponse(true, 'Approved success', bodyMailConfirm);
            case 0:
                return new ServiceResponse(false, 'Approved failed', {reason: 'Offwork review list was approved'});
            case -1:
                return new ServiceResponse(false, 'Approved failed', {reason: 'Offwork review list id exists'});
            default:
                return new ServiceResponse(false, 'Approved failed', {reason: 'Unknown'});
        }
    } catch (e) {
        logger.error(e, {function: 'offWorkService.approvedOffWorkReviewList'});
        return new ServiceResponse(false, e.message);
    }
};

const getListOffWorkReview = async (queryParams = {}) => {
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
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('MONTHOFFWORK', apiHelper.getValueFromObject(queryParams, 'month'))
            .input('STATUS', apiHelper.getValueFromObject(queryParams, 'status', 3))
            .execute('HR_OFFWORK_GetListReview_App');

        const offworks = data.recordset;
        return new ServiceResponse(true, '', {
            data: OffWorkClass.listReview(offworks),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(offworks),
        });
    } catch (e) {
        logger.error(e, {function: 'offWorkService.getListOffWorkReview'});
        return new ServiceResponse(true, '', {});
    }
};

const getListUserRefuse = async (reqParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(reqParams, 'search'))
            .input('USERNAME', apiHelper.getValueFromObject(reqParams, 'auth_name'))
            .execute('HR_OFFWORK_GetListUserRefuse_App');

        return new ServiceResponse(true, '', OffWorkClass.options(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'offWorkService.getListUserRefuse'});
        return new ServiceResponse(false, e.message);
    }
};

const updateConfirm = async off_work_id => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('OFFWORKID', off_work_id).execute('HR_OFFWORK_UpdateConfirm_App');

        return new ServiceResponse(true, 'Xác nhận thay thế thành công', {});
    } catch (e) {
        logger.error(e, {function: 'offWorkService.updateConfirm'});
        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    getListOffWork,
    createOffWork,
    getTotalDayOffWork,
    detailOffWork,
    approvedOffWorkReviewList,
    getListOffWorkReview,
    detailOffWorkReview,
    getListUserRefuse,
    updateConfirm,
};
