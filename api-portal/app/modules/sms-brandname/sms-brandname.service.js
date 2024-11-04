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
const moduleClass = require('./sms-brandname.class');
const httpClient = require('./utils/httpClient');
const responseCodes = require('./utils/responseCodes');

const getBalance = async () => {
    try {
        const res = await httpClient.post('/GetBalance_json', {
            ApiKey: config.smsBrandname.ApiKey,
            SecretKey: config.smsBrandname.SecretKey,
        });

        if (res && res.status === 200 && +res.data.CodeResponse === 100) {
            return new ServiceResponse(true, '', res.data);
        }

        return new ServiceResponse(false, responseCodes[res.data.CodeResponse] || RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, { function: 'SmsBrandnameService.getBalance' });

        return new ServiceResponse(false, e.message);
    }
};

const getSmsSentData_V1 = async (bodyParams = {}) => {
    try {
        const xml = `
          <RQST>
            <APIKEY>${config.smsBrandname.ApiKey}</APIKEY>
            <SECRETKEY>${config.smsBrandname.SecretKey}</SECRETKEY>
            <FROM>${apiHelper.getValueFromObject(bodyParams, 'from')}</FROM>
            <TO>${apiHelper.getValueFromObject(bodyParams, 'to')}</TO>
          </RQST>
        `;
        const res = await httpClient.post('/getSmsSentData_V1', xml, {
            headers: {
                'Content-Type': 'text/plain',
                // Cookie: 'ASP.NET_SessionId=s44vwfxrpd2cpeexirifi1bg; path=/; HttpOnly',
            },
        });

        if (res && res.status === 200 && +res.data.CodeResult === 100) {
            return new ServiceResponse(true, '', res.data);
        }

        return new ServiceResponse(false, responseCodes[res.data.CodeResult] || RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, { function: 'SmsBrandnameService.getSmsSentData_V1' });

        return new ServiceResponse(false, e.message);
    }
};

const getSendStatus = async (queryParams = {}) => {
    try {
        const res = await httpClient.get('/GetSendStatus', {
            params: {
                ApiKey: config.smsBrandname.ApiKey,
                SecretKey: config.smsBrandname.SecretKey,
                RefId: apiHelper.getValueFromObject(queryParams, 'sms_id'),
            },
        });

        if (res && res.status === 200 && +res.data.CodeResponse === 100) {
            return new ServiceResponse(true, '', res.data);
        }

        return new ServiceResponse(false, responseCodes[res.data.CodeResponse] || RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, { function: 'SmsBrandnameService.getSendStatus' });

        return new ServiceResponse(false, e.message);
    }
};

const getListBrandname = async () => {
    try {
        const res = await httpClient.get(
            `/GetListBrandname/${config.smsBrandname.ApiKey}/${config.smsBrandname.SecretKey}`,
        );

        if (res && res.status === 200 && +res.data.CodeResponse === 100) {
            return new ServiceResponse(true, '', res.data);
        }

        return new ServiceResponse(false, responseCodes[res.data.CodeResponse] || RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, { function: 'SmsBrandnameService.getListBrandname' });

        return new ServiceResponse(false, e.message);
    }
};

const getTemplate = async (bodyParams = {}) => {
    try {
        const res = await httpClient.post(`/GetTemplate`, {
            ApiKey: config.smsBrandname.ApiKey,
            SecretKey: config.smsBrandname.SecretKey,
            SmsType: 2, // Loại tin nhắn
            Brandname: apiHelper.getValueFromObject(bodyParams, 'brandname'), // Tên Brandname
        });

        if (res && res.status === 200 && +res.data.CodeResult === 100) {
            return new ServiceResponse(true, '', res.data);
        }

        return new ServiceResponse(false, responseCodes[res.data.CodeResult] || RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, { function: 'SmsBrandnameService.getTemplate' });

        return new ServiceResponse(false, e.message);
    }
};

const sendMultipleMessage_V4_post_json = async (bodyParams = {}) => {
  try {
        const res = await httpClient.post(`/SendMultipleMessage_V4_post_json`, {
            ApiKey: config.smsBrandname.ApiKey,
            SecretKey: config.smsBrandname.SecretKey,
            Phone: apiHelper.getValueFromObject(bodyParams, 'phone'), // Số điện thoại nhận tin
            Content: apiHelper.getValueFromObject(bodyParams, 'content'), // Nội dung tin nhắn
            Brandname: apiHelper.getValueFromObject(bodyParams, 'brandname'), // Tên Brandname (tên công ty hay tổ chức khi gửi tin sẽ hiển thị trên tin nhắn đó).
            SmsType: 2,
            IsUnicode: apiHelper.getValueFromObject(bodyParams, 'is_unicode', 0), // Gửi nội dung có dấu
            Sandbox: apiHelper.getValueFromObject(bodyParams, 'sandbox', config.smsBrandname.Sandbox), // 1: Tin thử nghiệm, không gửi tin nhắn, chỉ trả về kết quả SMS, tin không lưu hệ thống và không trừ tiền. 0: Không thử nghiệm, tin đi thật.
            campaignid: apiHelper.getValueFromObject(bodyParams, 'campaign_id'), // Tên chiến dịch gửi tin.
            RequestId: apiHelper.getValueFromObject(bodyParams, 'request_id'), // ID Tin nhắn của đối tác, dùng để kiểm tra ID này đã được hệ thống esms tiếp nhận trước đó hay chưa.
            CallbackUrl: apiHelper.getValueFromObject(
                bodyParams,
                'callback_url',
                config.appUrl + '/task/care/sms/update-status',
            ), // Kết quả tin nhắn eSMS trả về
        });

        if ((res && res.status === 200) || +res.data.CodeResult === 100) {
            return new ServiceResponse(true, '', res.data);
        }

        return new ServiceResponse(false, responseCodes[res.data.CodeResult] || RESPONSE_MSG.REQUEST_FAILED);
    } catch (e) {
        logger.error(e, { function: 'SmsBrandnameService.sendMultipleMessage_V4_post_json' });

        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getBalance,
    getSmsSentData_V1,
    getSendStatus,
    getListBrandname,
    getTemplate,
    sendMultipleMessage_V4_post_json,
};
