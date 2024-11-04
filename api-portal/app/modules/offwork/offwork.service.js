const OffWorkClass = require('./offwork.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
const mailBoxService = require('../mailbox/mailbox.service');
const config = require('../../../config/config');
const moment = require('moment');
const { convertIsApprove } = require('./utils/helper');
let xl = require('excel4node');
/**
 * Get list AM_COMPANY
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListOffWork = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STATUS', apiHelper.getValueFromObject(queryParams, 'status'))
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .execute('HR_OFFWORK_GetList_AdminWeb');

        const offworks = data.recordset;
        return new ServiceResponse(true, '', {
            data: OffWorkClass.list(offworks),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(offworks),
        });
    } catch (e) {
        logger.error(e, { function: 'offWorkService.getListOffWork' });
        return new ServiceResponse(true, '', {});
    }
};

const createOffWork = async (bodyParams = {}) => {
    return await createUserOrUpdate(bodyParams);
};

const updateOffWork = async (bodyParams) => {
    return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const id = apiHelper.getValueFromObject(bodyParams, 'off_work_id');
        const is_refuse = apiHelper.getValueFromObject(bodyParams, 'is_refuse');
        const auth = apiHelper.getValueFromObject(bodyParams, 'auth');
        const { user_refuse, full_name_refuse, full_name, from_date, to_date, total_time_off } = bodyParams;
        const user_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const user_send = `${user_name} - ${full_name}`;
        const date_off = `${from_date} - ${to_date}`;
        const requestOffWorkCreate = new sql.Request(transaction);
        const resultOffWorkCreate = await requestOffWorkCreate
            .input('OFFWORKID', apiHelper.getValueFromObject(bodyParams, 'off_work_id'))
            .input(
                'USERNAME',
                id
                    ? apiHelper.getValueFromObject(bodyParams, 'user_name')
                    : apiHelper.getValueFromObject(bodyParams, 'auth_name'),
            )
            .input('OFFWORKTYPEID', apiHelper.getValueFromObject(bodyParams, 'off_work_type_id'))
            .input('CONTENTOFFWORK', apiHelper.getValueFromObject(bodyParams, 'content_off_work'))
            .input('ISAPPROVE', apiHelper.getValueFromObject(bodyParams, 'is_approve'))
            .input('ISREFUSE', is_refuse)
            .input('ISCONFIRM', apiHelper.getValueFromObject(bodyParams, 'is_confirm'))
            .input('USERREFUSE', apiHelper.getValueFromObject(bodyParams, 'user_refuse'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('DATEOFFFROM', apiHelper.getValueFromObject(bodyParams, 'from_date'))
            .input('DATEOFFTO', apiHelper.getValueFromObject(bodyParams, 'to_date'))
            .input('TOTALTIMEOFF', apiHelper.getValueFromObject(bodyParams, 'total_time_off'))
            .input('STARTHOUR', apiHelper.getValueFromObject(bodyParams, 'start_hour'))
            .input('ENDHOUR', apiHelper.getValueFromObject(bodyParams, 'end_hour'))
            .execute('HR_OFFWORK_CreateOrUpdate_AdminWeb');

        const offWorkId = resultOffWorkCreate.recordset[0].RESULT;
        if (!offWorkId) {
            await transaction.rollback();
            throw new Error('Create offwork failed!');
        }

        // const schedule_list = apiHelper.getValueFromObject(bodyParams, 'shift_list');
        // const _schedule_list = (schedule_list|| []).map((i)=>i.schedule_id).join('|');
        // // delete schedule mapping
        // const deleteSchedule = new sql.Request(transaction);
        // const reqDel = await deleteSchedule
        //     .input('SCHEDULELIST',_schedule_list)
        //     .input('OFFWORKID',offWorkId)
        //     .execute('HR_OFFWORK_SCHEDULE_DeleteMapping_AdminWeb');
        //  // create schedule mapping
        // for(let i=0;i<schedule_list.length;i++){
        //     const requestSchedule = new sql.Request(transaction);
        //     const req1 = await requestSchedule
        //     .input('OFFWORKID',offWorkId)
        //     .input('OFFWORKSCHEDULEID',schedule_list[i]?.off_work_schedule_id)
        //     .input('SCHEDULEID',schedule_list[i].schedule_id)
        //     .input('SHIFTDATE',schedule_list[i].shift_date)
        //     .input('SHIFTID',schedule_list[i].shift_id)
        //     .input('USERNAME',apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //     .execute('HR_OFFWORK_SCHEDULE_CreateOrUpdate_AdminWeb');
        // }

        if (id && id != '') {
            // Delete offwork review list
            const requestOffWorkReviewListDelete = new sql.Request(transaction);
            const resultOffWorkReviewList = await requestOffWorkReviewListDelete
                .input('OFFWORKID', id)
                .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('HR_OFFWORKREVIEWLIST_DeleteByOffWorkId_AdminWeb');

            if (!resultOffWorkReviewList.recordset[0].RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Delete offwork review list failed!');
            }
        }
        const dataOffWorkReviewLists = apiHelper.getValueFromObject(bodyParams, 'offwork_review_list', []);
        if (dataOffWorkReviewLists && dataOffWorkReviewLists.length) {
            for (let i = 0; i < dataOffWorkReviewLists.length; i++) {
                let {
                    offwork_review_level_id: offWorkReviewLevelId,
                    review_user,
                    is_auto_review = 0,
                    off_work_review_list_id,
                    users,
                } = dataOffWorkReviewLists[i];

                if (offWorkReviewLevelId) {
                    let requestOffWorkReviewList = new sql.Request(transaction);
                    let resultOffWorkReviewList = await requestOffWorkReviewList // eslint-disable-line no-await-in-loop
                        .input('OFFWORKID', offWorkId)
                        .input('OFFWORKREVIEWLEVELID', offWorkReviewLevelId)
                        .input('REVIEWUSER', review_user)
                        .input('ISAUTOREVIEW', is_auto_review)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .input('OFFWORKREVIEWLISTID', off_work_review_list_id)
                        .execute('HR_OFFWORKREVIEWLIST_Create_AdminWeb');

                    if (!resultOffWorkReviewList.recordset[0].RESULT) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Create offwork review list failed!');
                    }

                    for (const { username: user_name_review, full_name: full_name_review } of users) {
                        // Gửi mail cho user duyệt
                        const bodyMailReview = {
                            is_send_to_all: 0,
                            parent_id: 0,
                            recipient_email: [
                                {
                                    value: `USER-${user_name_review}`,
                                    label: `${user_name_review} - ${full_name_review}`,
                                },
                            ],
                            mail_subject: `Xác nhận duyệt bàn giao công việc trong thời gian nghỉ phép của ${user_send} ngày ${date_off}`,
                            mail_content: `<h3>Kính gửi Anh/Chị,</h3>\n<p>Nhân sự ${user_send}, đã tạo nghỉ phép ngày ${date_off}. Là nhân sự duyệt, Anh/Chị vui lòng xác nhận\n<p>Thông tin nghỉ phép - Số ngày nghỉ: ${total_time_off}</p>\n<a target="_blank" href=\"${config.domain_cdn}portal/off-work/review/${offWorkId}\">Xác nhận</a>\n<p>Trân trọng cảm ơn Anh/Chị.</p>`,
                        };
                        await mailBoxService.sendNewMail(bodyMailReview, null, auth, null);
                    }
                }
            }
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
            await mailBoxService.sendNewMail(bodyMail, null, auth, null);
        }

        await transaction.commit();
        return new ServiceResponse(true, 'ok', offWorkId);
    } catch (e) {
        logger.error(e, { function: 'offWorkService.createUserOrUpdate' });
        await transaction.rollback();

        return new ServiceResponse(false, e);
    }
};

const detailOffWork = async (offWorkId, bodyParams = {}) => {
    try {
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');

        const pool = await mssql.pool;
        const data = await pool.request().input('OFFWORKID', offWorkId).execute('HR_OFFWORK_GetById_AdminWeb');

        const _shift_list = await pool
            .request()
            .input('OFFWORKID', offWorkId)
            .execute('HR_OFFWORK_SCHEDULE_GetDetailInfoOffWork_AdminWeb');
        let offwork = OffWorkClass.detail(data.recordset[0]);
        offwork.off_work_type = OffWorkClass.detailOffWorkType(data.recordsets[1][0]);
        offwork.offwork_review_list = OffWorkClass.offWorkReviewList(data.recordsets[2]);
        offwork.shift_list = OffWorkClass.shiftInfo(_shift_list.recordset);
        const dateSet = new Set();
        for (const item of offwork.shift_list) {
            dateSet.add(item.shift_date);
        }
        const dateList = [...dateSet];
        offwork.date_list = dateList;
        const users = OffWorkClass.offWorkREviewUsers(data.recordsets[3]);
        if (users && users.length) {
            offwork.offwork_review_list = (offwork.offwork_review_list || []).map((x) => {
                return {
                    ...x,
                    users: users.filter((u) => u.offwork_review_level_id == x.offwork_review_level_id),
                    is_can_review: x.review_user ? (x.review_user == authName ? 1 : 0) : 0,
                };
            });
        }
        // Kiem tra nghi phep dang duyet hay khong
        if (
            offwork.is_approve == 2 &&
            (offwork.offwork_review_list || []).filter((x) => !x.is_auto_review && x.review_date).length
        ) {
            offwork.is_approve = 3; // dang duyet
        }

        return new ServiceResponse(true, '', offwork);
    } catch (e) {
        logger.error(e, { function: 'offWorkService.detailOffWork' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteOffWork = async (offWorkId, auth) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OFFWORKID', offWorkId)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(auth, 'auth_name'))
            .execute('HR_OFFWORK_Delete_AdminWeb');
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'offWorkService.deleteOffWork' });
        return new ServiceResponse(false, e.message);
    }
};

const approvedOffWorkReviewList = async (bodyParams = {}) => {
    try {
        const auth = apiHelper.getValueFromObject(bodyParams, 'auth');
        const {
            user_name_register,
            full_name_register,
            auth_name: user_review,
            review_user_full_name: full_name_review,
        } = bodyParams;
        const user_register = `${user_name_register} - ${full_name_register}`;
        const is_review = apiHelper.getValueFromObject(bodyParams, 'is_review');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OFFWORKREVIEWLISTID', apiHelper.getValueFromObject(bodyParams, 'off_work_review_list_id'))
            .input('ISREVIEW', is_review)
            .input('REVIEWNOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('REVIEWUSER', user_review)
            .execute('HR_OFFWORKREVIEWLIST_Approved_AdminWeb');

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
                await mailBoxService.sendNewMail(bodyMailConfirm, null, auth, null);
                return new ServiceResponse(true, RESPONSE_MSG.CAMPAIGNREVIEWLIST.APPROVED_SUCCESS);
            case 0:
                return new ServiceResponse(false, RESPONSE_MSG.CAMPAIGNREVIEWLIST.APPROVED_FAILED, {
                    reason: 'Offwork review list was approved',
                });
            case -1:
                return new ServiceResponse(false, RESPONSE_MSG.CAMPAIGNREVIEWLIST.APPROVED_FAILED, {
                    reason: 'Offwork review list id exists',
                });
            default:
                return new ServiceResponse(false, RESPONSE_MSG.CAMPAIGNREVIEWLIST.APPROVED_FAILED, {
                    reason: 'Unknown',
                });
        }
    } catch (e) {
        logger.error(e, { function: 'offWorkService.approvedOffWorkReviewList' });
        return new ServiceResponse(false, e.message);
    }
};

const getTotalDayOffWork = async (reqParams = {}) => {
    try {
        const authName = apiHelper.getValueFromObject(reqParams, 'auth_name');
        const username = apiHelper.getValueFromObject(reqParams, 'username');
        const off_workId = apiHelper.getValueFromObject(reqParams, 'off_workId');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', username && authName != username ? username : authName)
            .input('OFFWORKID', off_workId)
            .execute('HR_TOTALDAYOFFWORK_GetByUserName_AdminWeb');

        let dayOffwork =
            data.recordset && data.recordset.length
                ? OffWorkClass.dayoffwork(data.recordset[0])
                : {
                      total_time_off: 0,
                      time_can_off: 0,
                      total_time: 0,
                  };
        return new ServiceResponse(true, '', dayOffwork);
    } catch (e) {
        logger.error(e, { function: 'offWorkService.getTotalDayOffWork' });
        return new ServiceResponse(false, e.message);
    }
};

const checkIsExistsReview = async (offWorkId, bodyParams = {}) => {
    try {
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', authName)
            .input('OFFWORKID', offWorkId)
            .execute('HR_OFFWORKREVIEWLIST_CheckUserReview_AdminWeb');

        let is_exists = data.recordset && data.recordset.length ? data.recordset[0].RESULT : 0;
        return new ServiceResponse(true, '', is_exists);
    } catch (e) {
        logger.error(e, { function: 'offWorkService.checkIsExistsReview' });
        return new ServiceResponse(false, e.message);
    }
};

const getUserOfDepartmentOpts = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('USERID', apiHelper.getValueFromObject(bodyParams, 'auth_id'))
            .input('FROMDATE', apiHelper.getValueFromObject(bodyParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(bodyParams, 'to_date'))
            .execute('HR_OFFWORK_GetUserDepartment_AdminWeb');

        let data_user = data.recordset && data.recordset.length ? data.recordset : [];

        return new ServiceResponse(true, '', OffWorkClass.options(data_user));
    } catch (e) {
        logger.error(e, { function: 'offWorkService.checkIsExistsReview' });
        return new ServiceResponse(false, e.message);
    }
};

const getUserScheduleOtps = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'user_name'))
            .input('DATE', apiHelper.getValueFromObject(bodyParams, 'date'))
            .execute('HR_USER_SCHEDULE_GetByUserAndDate');
        const res = data.recordset;
        return new ServiceResponse(true, 'ok', OffWorkClass.shiftInfo(res));
    } catch (e) {
        logger.error(e, { function: 'offWorkService.getUserSchedule' });
        return new ServiceResponse(false, e.message);
    }
};

const updateConfirm = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OFFWORKID', apiHelper.getValueFromObject(bodyParams, 'off_work_id'))
            .input('ISCONFIRM', apiHelper.getValueFromObject(bodyParams, 'is_confirm'))
            .execute('HR_OFFWORK_UpdateConfirm_AdminWeb');
        return new ServiceResponse(true, 'Xác nhận thành công');
    } catch (e) {
        logger.error(e, { function: 'offWorkService.updateConfirm' });
        return new ServiceResponse(false, e.message);
    }
};

const exportListOffWork = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const dataRes = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('STATUS', apiHelper.getValueFromObject(queryParams, 'status'))
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .execute('HR_OFFWORK_Exportlist_AdminWeb');

        const offworks = dataRes.recordset;
        const data = OffWorkClass.list(offworks);

        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true, color: 'FFFFFF' },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                },
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '#0e99cd',
                },
            },
            header: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    bottom: {
                        style: 'thin',
                    },
                },
            },
            row: {
                border: {
                    bottom: { style: 'dashed' },
                    left: { style: 'thin' },
                },
            },
            last_row: {
                border: {
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                },
            },
            row_last_column: {
                bottom: { style: 'thin' },
                left: { style: 'thin' },
            },
            border: {
                line: {
                    top_right: {
                        border: {
                            top: {
                                style: 'thin',
                            },
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    right: {
                        border: {
                            right: {
                                style: 'thin',
                            },
                        },
                    },
                    left_top_right: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                    },
                    all: {
                        left: { style: 'thin' },
                        top: { style: 'thin' },
                        right: { style: 'thin' },
                        bottom: { style: 'thin' },
                    },
                },
                line_top_left: {
                    border: {
                        top: {
                            style: 'thick',
                            colo: 'black',
                        },
                        left: {
                            style: 'thick',
                            colo: 'black',
                        },
                    },
                },
            },
            body_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            },
        };

        let work_book = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });

        let work_sheet = null;
        work_sheet = work_book.addWorksheet('Danh sách nghỉ phép');

        work_sheet.row(1).setHeight(40);
        work_sheet.column(1).freeze();
        work_sheet.column(3).setWidth(30);
        work_sheet.column(6).setWidth(100);

        const obj_short = [1, 2, 4, 5, 7, 8, 9, 10];

        obj_short.map((item, index) => work_sheet.column(item).setWidth(20));

        work_sheet.cell(1, 1, 1, 1, true).string('Mã ERP').style(styles.bold_center);
        work_sheet.cell(1, 2, 1, 2, true).string('Mã nhân viên').style(styles.bold_center);
        work_sheet.cell(1, 3, 1, 3, true).string('Nhân viên').style(styles.bold_center);
        work_sheet.cell(1, 4, 1, 4, true).string('Từ ngày').style(styles.bold_center);
        work_sheet.cell(1, 5, 1, 5, true).string('Đến ngày').style(styles.bold_center);
        work_sheet.cell(1, 6, 1, 6, true).string('Lý do').style(styles.bold_center);
        work_sheet.cell(1, 7, 1, 7, true).string('Loại phép').style(styles.bold_center);
        work_sheet.cell(1, 8, 1, 8, true).string('Số ngày').style(styles.bold_center);
        work_sheet.cell(1, 9, 1, 9, true).string('Trạng thái').style(styles.bold_center);
        work_sheet.cell(1, 10, 1, 10, true).string('Ngày xin').style(styles.bold_center);

        let row_position = 2;
        for (let i = 0; i < data.length; i++) {
            work_sheet
                .cell(row_position, 1)
                .string(`${data[i]?.erp_code || ''}`)
                .style(styles.body_center);
            work_sheet
                .cell(row_position, 2)
                .string(`${data[i]?.user_name || ''}`)
                .style(styles.body_center);
            work_sheet.cell(row_position, 3).string(`${data[i]?.full_name || ''}`);
            work_sheet
                .cell(row_position, 4)
                .string(`${data[i]?.from_date || ''}`)
                .style(styles.body_center);
            work_sheet
                .cell(row_position, 5)
                .string(`${data[i]?.to_date || ''}`)
                .style(styles.body_center);
            work_sheet.cell(row_position, 6).string(`${data[i]?.content_off_work || ''}`);
            work_sheet.cell(row_position, 7).string(`${data[i]?.off_work_type_name || ''}`);
            work_sheet
                .cell(row_position, 8)
                .string(`${data[i]?.total_time_off + ' Ngày' || ''}`)
                .style(styles.body_center);
            work_sheet.cell(row_position, 9).string(`${convertIsApprove(data[i]?.is_approve) || ''}`);
            work_sheet
                .cell(row_position, 10)
                .string(`${data[i]?.created_date || ''}`)
                .style(styles.body_center);

            row_position += 1;
        }

        return new ServiceResponse(true, '', work_book);
    } catch (e) {
        logger.error(e, { function: 'offWorkService.exportListOffWork' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListOffWork,
    createOffWork,
    detailOffWork,
    updateOffWork,
    deleteOffWork,
    approvedOffWorkReviewList,
    getTotalDayOffWork,
    checkIsExistsReview,
    getUserOfDepartmentOpts,
    getUserScheduleOtps,
    updateConfirm,
    exportListOffWork,
};
