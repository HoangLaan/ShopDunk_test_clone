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
    logger.error(error, { function: 'SmsBrandnameService.sendMultipleMessage_V4_post_json' });
    return new ServiceResponse(false, error.message);
  }
};

// console.log('sendMultipleMessage_V4_post_json');

// sendMultipleMessage_V4_post_json({
//   phone: '0329927227',
//   content: 'Chuc mung Anh/chi Dang Nhat Phi da nhan duoc 01 Voucher tri gia 290000 tu minigame cua ShopDunk. Ma qua tang ABCDED. Ho tro giai dap thac mac: 19006626',
//   brandname: 'SHOPDUNK',
//   sandbox: 0
// })

module.exports = {
  sendMultipleMessage_V4_post_json,
};
