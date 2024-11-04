const qcClass = require('./qc.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const fileHelper = require('../../common/helpers/file.helper');

const getStoreQCInfo = async (clientIp,user_name, queryParams = {}) => {
    try {
        let clientIpReplace;
        if (clientIp.includes('::ffff:')) {
            clientIpReplace = clientIp.replace('::ffff:', '');
        } else {
            clientIpReplace = clientIp;
        }
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('USERNAME', user_name)
            .input('IPADDRESS', clientIpReplace)
            .execute('HR_IMAGE_QC_GET_INFO');

        const data = qcClass.storeQCInfo(resData.recordset[0]);
        if(data.time_start && data.time_end){
            data.checkin_status = 2
        } 
        if(data.time_start && !data.time_end){
            data.checkin_status = 1
        }
        if(!data.time_start && !data.time_end){
            data.checkin_status = 0
        }
        return new ServiceResponse(true, '', data);
    } catch (e) {
        logger.error(e, { function: 'qcService.getListStoreQC' });
        return new ServiceResponse(false, e.message);
    }
};

const getListStoreQC = async (user_name, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('USERNAME', user_name)
            .input('STARTDATE', apiHelper.getValueFromObject(queryParams, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('TYPE', apiHelper.getValueFromObject(queryParams, 'type'))
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('HR_IMAGE_QC_GETLIST_APP');

        return new ServiceResponse(true, '', {
            data: qcClass.storeQCList(resData.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'qcService.getListStoreQC' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdatestoreQC = async (clientIp, user_name, bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        let clientIpReplace;
        if (clientIp.includes('::ffff:')) {
            clientIpReplace = clientIp.replace('::ffff:', '');
        } else {
            clientIpReplace = clientIp;
        }
        const imageUrl = await fileHelper.saveFile(apiHelper.getValueFromObject(bodyParams, 'image_base64'),'qcimage');

        await pool
            .request()
            .input('IPADDRESS', clientIpReplace)
            .input('USERNAME', user_name)
            .input('IMAGEURL', imageUrl)
            .execute('HR_IMAGE_QC_CREATEORUPDATE_APP');

        return new ServiceResponse(true, '', RESPONSE_MSG.CRUD.UPDATE_SUCCESS);
    } catch (e) {
        // logger.error(e, { function: 'timekeepingService.checkInOrCheckOut' });
        return new ServiceResponse(false, e.message);
    }
};

const finishQCStore = async (clientIp, user_name, bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const imageUrl = await fileHelper.saveFile(apiHelper.getValueFromObject(bodyParams, 'image_base64'));
        await pool
            .request()
            .input('USERNAME', user_name)
            .input('URLPICTURECHECKOUT', imageUrl)
            .execute('HR_IMAGE_QC_FINISH_QC_STORE_APP');

        return new ServiceResponse(true, '', RESPONSE_MSG.CRUD.UPDATE_SUCCESS);
    } catch (e) {
        // logger.error(e, { function: 'timekeepingService.checkInOrCheckOut' });
        return new ServiceResponse(false, e.message);
    }
};



module.exports = {
    getListStoreQC,
    createOrUpdatestoreQC,
    finishQCStore,
    getStoreQCInfo
};
