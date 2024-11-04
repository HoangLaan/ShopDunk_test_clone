const timekeepingClass = require('./timekeeping.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const fileHelper = require('../../common/helpers/file.helper');

const getShiftInfo = async (user_name, clientIp) => {
    try {
        const pool = await mssql.pool;

        let clientIpReplace;
        if (clientIp.includes('::ffff:')) {
            clientIpReplace = clientIp.replace('::ffff:', '');
        } else {
            clientIpReplace = clientIp;
        }

        //get shift info
        const dataRes = await pool
            .request()
            .input('IPADDRESS', clientIpReplace) 
            .input('USERNAME', user_name)
            .execute('HR_USER_TIMEKEEPING_GetShiftInfoWItIpAddress_App');

        if (dataRes.recordset.length === 0) {
            return new ServiceResponse(false, 'Bạn không có ca làm việc hôm nay!');
        }
        return new ServiceResponse(true, '', timekeepingClass.shiftInfo(dataRes.recordset[0]));
    } catch (e) {
        logger.error(e, {function: 'timekeepingService.getCheckInInfo'});
        return new ServiceResponse(false, e.message);
    }
};

const checkInOrCheckOut = async (clientIp, user_name, bodyParams = {}) => {
    try {
        const pool = await mssql.pool;

        let clientIpReplace;
        if (clientIp.includes('::ffff:')) {
            clientIpReplace = clientIp.replace('::ffff:', '');
        } else {
            clientIpReplace = clientIp;
        }

        const dataRes = await pool
            .request()
            .input('IPADDRESS', clientIpReplace)
            .input('USERNAME', user_name)
            .execute('HR_USER_TIMEKEEPING_GetShiftInfoWItIpAddress_App');

        if (dataRes.recordset.length === 0) {
            return new ServiceResponse(false, 'Bạn không có ca làm việc hôm nay!');
        }

        //check in or check out
        const picture_base64 = apiHelper.getValueFromObject(bodyParams, 'picture_base64');
        const imageUrl = await fileHelper.saveBase64(picture_base64);

        await Promise.all(
            dataRes.recordset.map(async item => {
                const scheduleInfo = timekeepingClass.shiftInfo(item);
                if (scheduleInfo.is_break_shift) {
                    return await pool
                        .request()
                        .input('USERNAME', user_name)
                        .input('URLPICTURE', imageUrl)
                        .input('SHIFTID', scheduleInfo.shift_id)
                        .input('CHECKINTIME', scheduleInfo.checkin_time)
                        .input('CHECKOUTBREAKTIME', scheduleInfo.checkout_break_time)
                        .input('CHECKINBREAKTIME', scheduleInfo.checkin_break_time)
                        .execute('HR_USER_TIMEKEEPING_CreateOrUpdate_breakshift');
                }
                return await pool
                    .request()
                    .input('USERNAME', user_name)
                    .input('URLPICTURE', imageUrl)
                    .input('SHIFTID', scheduleInfo.shift_id)
                    .input('CHECKINTIME', scheduleInfo.checkin_time)
                    .execute('HR_USER_TIMEKEEPING_CreateOrUpdate_shift');
            }),
        );

        return new ServiceResponse(true, '', RESPONSE_MSG.CRUD.UPDATE_SUCCESS);
    } catch (e) {
        logger.error(e, {function: 'timekeepingService.checkInOrCheckOut'});
        return new ServiceResponse(false, e.message);
    }
};

const getStatiticsTimeKeeping = async (user_name, queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('USERNAME', user_name)
            .input('TIMEKEEPINGFROMDATE', apiHelper.getValueFromObject(queryParams, 'timekeeping_from_date'))
            .input('TIMEKEEPINGTODATE', apiHelper.getValueFromObject(queryParams, 'timekeeping_to_date'))
            .execute('HR_USER_TIMEKEEPING_GetStatiticByDay_App');

        return new ServiceResponse(true, '', timekeepingClass.timekeepingStatitics(resData.recordset[0]));
    } catch (e) {
        logger.error(e, {function: 'timekeepingService.getStatiticsTimeKeeping'});
        return new ServiceResponse(false, e.message);
    }
};

const getListTimeKeeping = async (user_name, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('USERNAME', user_name)
            .input('TIMEKEEPINGFROMDATE', apiHelper.getValueFromObject(queryParams, 'timekeeping_from_date'))
            .input('TIMEKEEPINGTODATE', apiHelper.getValueFromObject(queryParams, 'timekeeping_to_date'))
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute('HR_USER_TIMEKEEPING_GetListByDay_App');

        return new ServiceResponse(true, '', {
            data: timekeepingClass.timekeepingList(resData.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'timekeepingService.getListTimeKeeping'});
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getShiftInfo,
    checkInOrCheckOut,
    getStatiticsTimeKeeping,
    getListTimeKeeping,
};
