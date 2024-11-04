const axios = require('axios');
const config = require('../../../../config/config');
const ServiceResponse = require('../../../common/responses/service.response');
const logger = require('../../../common/classes/logger.class');

/**
 *
 * @param {sandbox} : 0 => send sms, 1 => not send sms
 * @returns
 */
const sendMultipleMessage_V4_post_json = async ({ phone, content, brandname, sandbox = +config.smsBrandname.Sandbox }) => {
  try {
    const res = await axios({
      url: `${config.smsBrandname.rootUrl}/SendMultipleMessage_V4_post_json`,
      method: 'POST',
      data: {
        ApiKey: config.smsBrandname.ApiKey,
        SecretKey: config.smsBrandname.SecretKey,
        Phone: phone, // Số điện thoại nhận tin
        Content: content, // Nội dung tin nhắn
        Brandname: brandname, // Tên Brandname (tên công ty hay tổ chức khi gửi tin sẽ hiển thị trên tin nhắn đó).
        SmsType: 2,
        IsUnicode: 0, // Gửi nội dung có dấu
        Sandbox: sandbox, // 1: Tin thử nghiệm, không gửi tin nhắn, chỉ trả về kết quả SMS, tin không lưu hệ thống và không trừ tiền. 0: Không thử nghiệm, tin đi thật.
        campaignid: null, // Tên chiến dịch gửi tin.
        RequestId: null, // ID Tin nhắn của đối tác, dùng để kiểm tra ID này đã được hệ thống esms tiếp nhận trước đó hay chưa.
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if ((res && res.status === 200) || +res.data.CodeResult === 100) {
      return new ServiceResponse(true, '', res.data);
    }

    return new ServiceResponse(false, 'Gửi tin nhắn thất bại');
  } catch (error) {
    logger.error(error, { function: 'notifyUtils.sendMultipleMessage_V4_post_json' });
    return new ServiceResponse(false, error.message);
  }
};

/**
 *
 * @param {sandbox} : 0 => send sms, 1 => not send sms
 * @returns
 */
const sendMultipleSMSBrandname_json = async ({ phones = [], content, brandname, sandbox = +config.smsBrandname.Sandbox, send_date }) => {
  try {
    const res = await axios({
      url: `${config.smsBrandname.rootUrl}/SendMultipleSMSBrandname_json`,
      method: 'POST',
      data: {
        ApiKey: config.smsBrandname.ApiKey,
        SecretKey: config.smsBrandname.SecretKey,
        Brandname: brandname, // Tên Brandname (tên công ty hay tổ chức khi gửi tin sẽ hiển thị trên tin nhắn đó).
        Content: content, // Nội dung tin nhắn
        Phones: phones, // Số điện thoại nhận tin
        SmsType: "1",
        SendDate: send_date
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if ((res && res.status === 200) && +res.data.CodeResult === 100) {
      return new ServiceResponse(true, '', res.data);
    }

    return new ServiceResponse(false, 'Gửi tin nhắn thất bại', res.data);
  } catch (error) {
    logger.error(error, { function: 'notifyUtils.sendMultipleSMSBrandname_json' });
    return new ServiceResponse(false, error.message);
  }
};


module.exports = {
  sendMultipleMessage_V4_post_json,
  sendMultipleSMSBrandname_json,
};
