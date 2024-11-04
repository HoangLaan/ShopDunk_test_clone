const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const notifyClass = require('./notify.class');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const authName = apiHelper.getValueFromObject(queryParams, 'auth_name');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', authName)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.SYS_NOTIFY_GETALLLIST_APP);
        const listNotify = data.recordset;

        return new ServiceResponse(true, '', {
            data: notifyClass.list(listNotify),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(listNotify),
        });
    } catch (e) {
        logger.error(e, { function: 'notifyService.getList' });
        return new ServiceResponse(true, '', {});
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
            .execute(PROCEDURE_NAME.SYS_NOTIFY_UPDATEREADNOTI_APP);

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
            .execute('SYS_NOTIFY_USER_UpdateAllReadNoti_App');

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
    getList,
    updateReadNotify,
    updateReadAllNotify
};