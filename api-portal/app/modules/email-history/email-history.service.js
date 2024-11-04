const sql = require('mssql');
const moment = require('moment');
const mailchimpTransactional = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_TRANSACTION_APIKEY);

const mssql = require('../../models/mssql');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const moduleClass = require('./email-history.class');
const { MAIL_STATUS } = require('./constant');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('MAILSUPPLIER', apiHelper.getValueFromObject(queryParams, 'mail_supplier'))
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .input('STATUS', apiHelper.getValueFromObject(queryParams, 'status'))
            .input('TASKDETAILID', apiHelper.getValueFromObject(queryParams, 'task_detail_id'))
            .execute(PROCEDURE_NAME.CRM_EMAILHISTORY_GETLIST_ADMINWEB);

        const meta = await mailchimpTransactional.senders.info({ address: 'cskh@shopdunk.com' });
        const scheduledList = await mailchimpTransactional.messages.listScheduled();

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
            meta: {
              ...meta,
              scheduled: scheduledList?.length || 0
            }
        });
    } catch (e) {
        logger.error(e, { function: 'EmailHistoryService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdate = async (bodyParams) => {
    let emailHistoryId = apiHelper.getValueFromObject(bodyParams, 'email_history_id');

    try {
        const pool = await mssql.pool;
        const resCreateOrUpdate = await pool
            .request()
            .input('EMAILHISTORYID', emailHistoryId)
            .input('EMAILFROM', apiHelper.getValueFromObject(bodyParams, 'email_from'))
            .input('EMAILTO', apiHelper.getValueFromObject(bodyParams, 'email_to'))
            .input('EMAILTEMPLATEID', apiHelper.getValueFromObject(bodyParams, 'email_template_id'))
            .input('SENDTIME', apiHelper.getValueFromObject(bodyParams, 'send_time'))
            .input('TYPE', apiHelper.getValueFromObject(bodyParams, 'type'))
            .input('STATUS', apiHelper.getValueFromObject(bodyParams, 'status'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('SUBJECT', apiHelper.getValueFromObject(bodyParams, 'subject'))
            .input('EMAILCONTENT', apiHelper.getValueFromObject(bodyParams, 'email_content'))
            .input('MAILSUPPLIER', apiHelper.getValueFromObject(bodyParams, 'mail_supplier'))
            .input('MESSAGEID', apiHelper.getValueFromObject(bodyParams, 'message_id'))
            .input('DATALEADSID', apiHelper.getValueFromObject(bodyParams, 'dataleads_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('PARTNERID', apiHelper.getValueFromObject(bodyParams, 'partner_id'))
            .input('TASKDETAILID', apiHelper.getValueFromObject(bodyParams, 'task_detail_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('SCHEDULETIME', apiHelper.getValueFromObject(bodyParams, 'schedule_time'))
            .input('REPLYTO', apiHelper.getValueFromObject(bodyParams, 'reply_to'))
            .input('DISPLAYNAME', apiHelper.getValueFromObject(bodyParams, 'display_name'))
            .execute(PROCEDURE_NAME.CRM_EMAILHISTORY_CREATEORUPDATE_ADMINWEB);

        emailHistoryId = resCreateOrUpdate.recordset[0].RESULT;

        if (!emailHistoryId) {
            return new ServiceResponse(false, 'Thêm mới hoặc cập nhật danh sách gửi mail thất bại !');
        }

        return new ServiceResponse(true, '', emailHistoryId);
    } catch (e) {
        logger.error(e, { function: 'EmailHistoryService.CreateOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('EMAILHISTORYID', id)
            .execute(PROCEDURE_NAME.CRM_EMAILHISTORY_GETBYID_ADMINWEB);

        let emailHistory = responseData.recordset[0];

        if (emailHistory) {
            const detailData = moduleClass.detail(emailHistory);
            detailData.send_time = detailData.send_time
                ? moment.utc(detailData.send_time).format('HH:00 A DD/MM/YYYY')
                : '-';
            detailData.send_time = detailData.schedule_time
                ? moment.utc(detailData.schedule_time).format('HH:00 A DD/MM/YYYY')
                : '-';
            return new ServiceResponse(true, '', detailData);
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (e) {
        logger.error(e, { function: 'EmailHistoryService.getDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteList = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

    try {
        await transaction.begin();
        for (let emailHistoryId of list_id) {
            const request = new sql.Request(transaction);
            const resultRes = await request
                .input('EMAILHISTORYID', emailHistoryId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.CRM_EMAILHISTORY_DELETE_ADMINWEB);

            if (!resultRes.recordset[0]?.RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa mail thất bại !');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'EmailHistoryService.deleteList' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const getStatistics = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool.request('MESSAGEID').execute('SL_EMAILHISTORY_Statistics_AdminWeb');
        const statistics = responseData.recordset[0];
        if (statistics) {
            return new ServiceResponse(true, '', moduleClass.statistics(statistics));
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (e) {
        logger.error(e, { function: 'EmailHistoryService.statistics' });
        return new ServiceResponse(false, e.message);
    }
};

const updateMailStatus = async (body) => {
    try {
        const events = JSON.parse(body.mandrill_events);
        if (events && events.length > 0) {
            for (let event in events) {
                await _handleUpdateStatus(event);
            }
        }
        return new ServiceResponse(false, 'success');
    } catch (e) {
        logger.error(e, { function: 'EmailHistoryService.updateMailStatus' });
        return new ServiceResponse(false, e.message);
    }
};

const _handleUpdateStatus = async (eventItem) => {
    const updatedData = {
        message_id: eventItem._id,
        is_open: null,
        is_clicked: null,
        status: null,
        send_time: null,
    };

    switch (eventItem.event) {
        case 'send':
            updatedData.status = MAIL_STATUS.SUCCESS;
            updatedData.send_time = new Date();
            break;
        case 'delivered':
            updatedData.status = MAIL_STATUS.SUCCESS;
            updatedData.send_time = new Date();
            break;
        case 'open':
            updatedData.is_open = 1;
            break;
        case 'click':
            updatedData.is_clicked = 1;
            break;
        case 'reject':
            updatedData.status = MAIL_STATUS.FAILED;
            break;
    }

    const pool = await mssql.pool;
    await pool
        .request()
        .input('MESSAGEID', updatedData.message_id)
        .input('STATUS', updatedData.status)
        .input('ISOPEN', updatedData.is_open)
        .input('ISCLICKED', updatedData.is_clicked)
        .input('SENDTIME', updatedData.send_time)
        .execute('SL_EMAILHISTORY_UpdateStatusByMessageId_AdminWeb');
};

module.exports = {
    getList,
    createOrUpdate,
    getDetail,
    deleteList,
    getStatistics,
    updateMailStatus,
};
