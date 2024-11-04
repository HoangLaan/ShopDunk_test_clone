const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const notifyClass = require('../notify/notify.class');
const { sendMultipleMessage_V4_post_json, sendMultipleSMSBrandname_json } = require('./utils/sms');
const zalo = require('../../common/services/zalo');
const { truncateString } = require('./utils/utils');
const template = require('lodash/template');
const { sendOneMail } = require('./utils/email');

const sendSMS = async (body) => {
    try {
        const sendSmsRes = await sendMultipleMessage_V4_post_json({
            phone: apiHelper.getValueFromObject(body, 'phone_number'),
            content: apiHelper.getValueFromObject(body, 'content_sms'),
            brandname: apiHelper.getValueFromObject(body, 'brandname'),
        });

        if (sendSmsRes.isFailed()) {
            return new ServiceResponse(false, 'Gửi SMS thất bại', null);
        }

        return new ServiceResponse(true, 'Gửi SMS thành công');
    } catch (e) {
        logger.error(e, { function: 'notifyService.sendSMS' });
        return new ServiceResponse(false, '', {});
    }
};

const sendAdv = async ({ phones, content, send_date }) => {
    try {
        const sendSmsRes = await sendMultipleSMSBrandname_json({
            phones: phones,
            content: content,
            brandname: 'SHOPDUNK',
            send_date: send_date,
        });

        if (sendSmsRes.isFailed()) {
            return new ServiceResponse(false, 'Gửi tin quảng cáo thất bại', null);
        }

        return new ServiceResponse(true, 'Gửi tin quảng cáo thành công');
    } catch (e) {
        logger.error(e, { function: 'notifyService.sendAdv' });
        return new ServiceResponse(false, '', {});
    }
};

const getListNotify = async (reqParams) => {
    try {
        const authName = apiHelper.getValueFromObject(reqParams, 'auth_name');
        const currentPage = apiHelper.getCurrentPage(reqParams);
        const itemPerPage = apiHelper.getItemsPerPage(reqParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', authName)
            .input('PAGESIZE', itemPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('SYS_NOTIFY_USER_GetByUserName_AdminWeb');
        const listNotify = notifyClass.listNotify(data.recordsets[0]);

        return new ServiceResponse(true, '', {
            items: listNotify,
            page: currentPage,
            itemPerPage: itemPerPage,
            totalItems: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'notifyService.getListNotify' });
        return new ServiceResponse(false, '', {});
    }
};

const updateReadNotify = async (bodyParams = {}) => {
    try {
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const notifyUserId = apiHelper.getValueFromObject(bodyParams, 'notify_user_id');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', authName)
            .input('NOTIFYUSERID', notifyUserId)
            .execute('SYS_NOTIFY_USER_UpdateReadNoti_AdminWeb');

        const noti = data.recordset[0]?.RESULT;
        if (!noti) {
            return new ServiceResponse(false, 'Update read notify failed!');
        }

        return new ServiceResponse(true, 'ok', noti);
    } catch (error) {
        logger.error(error, { function: 'notifyService.updateReadNotify' });
        return new ServiceResponse(false, '', {});
    }
};

const updateReadAllNotify = async (bodyParams = {}) => {
    try {
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', authName)
            .execute('SYS_NOTIFY_USER_UpdateAllReadNoti_AdminWeb');

        const noti = data.recordset[0]?.RESULT;
        if (!noti) {
            return new ServiceResponse(false, 'Update read notify failed!');
        }

        return new ServiceResponse(true, 'ok', noti);
    } catch (error) {
        logger.error(error, { function: 'notifyService.updateReadAllNotify' });
        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    sendSMS,
    sendAdv,
    getListNotify,
    updateReadNotify,
    updateReadAllNotify,
};
