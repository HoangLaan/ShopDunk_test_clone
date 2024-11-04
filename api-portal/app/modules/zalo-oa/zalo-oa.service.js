const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const zalo = require('../../common/services/zalo');
const { truncateString } = require('./utils');
const mssql = require('../../models/mssql');
const zaloClass = require('./zalo-oa.class');
const CryptoJS = require('crypto-js');

const hashKey = (message, secretKey) => {
    const hmac = CryptoJS.HmacSHA256(message, secretKey);
    return hmac.toString(CryptoJS.enc.Hex);
}

const getOAInfo = async () => {
    try {
        const info = await zalo.getInfo();
        return new ServiceResponse(true, '', info);
    } catch (error) {
        logger.error(error, { function: 'zaloOAService.getOAInfo' });
        return new ServiceResponse(false, '', {});
    }
};

// (async () => {
//   const oaInfoRes = await getOAInfo();
//   console.log('~  oa_id >>>', oaInfoRes.data.oa_id)
// })()

// (async () => {
//   const numberOfRequests = 10;
//   const promises = [];

//   for (let i = 0; i < numberOfRequests; i++) {
//     promises.push(getOAInfo()); // Thêm 10 request vào mảng promises
//   }

//   try {
//     const results = await Promise.all(promises);
//     // Xử lý kết quả của từng request
//     results.forEach((oaInfoRes, index) => {
//       console.log(`~ Result ${index + 1}:`, oaInfoRes.data.oa_id);
//     });
//   } catch (error) {
//     console.error('Lỗi trong quá trình gửi request:', error);
//   }
// })();

const sendTextMessage = async ({ user_id, text_message, attachment_url }) => {
    try {
        const res = await zalo.sendTextMessage({ user_id, text_message, attachment_url });
        if (!res?.message_id) {
            throw new Error('Gửi tin nhắn thất bại');
        }
        return new ServiceResponse(true, '', 'Gửi tin nhắn thành công');
    } catch (error) {
        logger.error(error, { function: 'zaloOAService.sendTextMessage' });
        return new ServiceResponse(false, '', {});
    }
};

const sendZNS = async ({ phone, template_id, template_data, mode }) => {
    try {
        const znsPayload = { phone, template_id, template_data };
        if (mode) {
            znsPayload.mode = mode;
        }
        if (phone && phone.startsWith('0')) {
            znsPayload.phone = phone.replace('0', '84');
        }

        if (znsPayload.phone === '84329927227') {
          znsPayload.mode = 'development';
        }

        const res = await zalo.sendZNS(znsPayload);
        if (!res?.msg_id) {
            throw new Error('Gửi ZNS thất bại');
        }
        return new ServiceResponse(true, '', 'Gửi ZNS thành công');
    } catch (error) {
        logger.error(error, { function: 'zaloOAService.sendZNS' });
        return new ServiceResponse(false, '', {});
    }
};


const sendZNSByCusOrderData = async ({ phone, template_id, sendData, mode }) => {
  try {
      const znsPayload = { phone, template_id, mode };
      const znsDetail = await zalo.getTemplateById(template_id);

      const templateDataMapped = {
        name: sendData.full_name,
        full_name: sendData.full_name,
        customer_name: sendData.full_name,
        phone_number: sendData.phone_number,
        email: sendData.email,

        order_code: sendData.order_no,
        order_date: sendData.order_date,
        price: sendData.total_amount || 0,
        order_price: sendData.total_amount || 0,
        total_money: sendData.total_amount || 0,
        status: sendData.status_name,
        product_name: truncateString(sendData.product_name_list, 95),
        pre_order_no: sendData.pre_order_no,
        pre_order_code: sendData.pre_order_no,
        store_name: sendData.store_name,
        date: sendData.receiving_date,
        time: sendData.receiving_time,
        receive_address: sendData.receive_address,
        payment_type: sendData.payment_type,
      }

      if (+template_id == 278295) {
        templateDataMapped.total_money = sendData.pre_money || 0
      }

      const znsTemplateData = {}
      znsDetail.listParams.map(x => x.name).forEach(param => {
        znsTemplateData[param] = templateDataMapped[param] ?? ''
      });

      if (phone && phone.startsWith('0')) {
          znsPayload.phone = phone.replace('0', '84');
      }

      znsPayload.template_data = znsTemplateData;

      if (znsPayload.phone === '84329927227') {
        znsPayload.mode = 'development';
      }

      const res = await zalo.sendZNS(znsPayload);
      if (!res?.msg_id) {
          throw new Error('Gửi ZNS thất bại');
      }
      return new ServiceResponse(true, '', 'Gửi ZNS thành công');
  } catch (error) {
      logger.error(error, { function: 'zaloOAService.sendZNS' });
      return new ServiceResponse(false, '', {});
  }
};

// sendZNSByCusOrderData({
//   phone: '84329927227',
//   template_id: '276322',
//   sendData: {
//     full_name: 'Le  Van C',
//     phone_number: '0329927227',
//     email: 'Cc@gmail,com',
//     status_name: 'Đơn hàng mới 1',
//     order_date: '22/08/2023',
//     total_amount: 29700000,
//     order_no: '123456789',
//   },
//   mode: 'development',
// });

const getListTemplate = async () => {
    try {
        const list = await zalo.getListTemplate();
        const enableList = (list || []).filter(x => x?.status === 'ENABLE')
        return new ServiceResponse(true, '', enableList);
    } catch (error) {
        logger.error(error, { function: 'zaloOAService.getListTemplate' });
        return new ServiceResponse(true, '', {});
    }
};

const getTemplateById = async (templateId) => {
    try {
        const info = await zalo.getTemplateById(templateId);
        return new ServiceResponse(true, '', info);
    } catch (error) {
        logger.error(error, { function: 'zaloOAService.getTemplateById' });
        return new ServiceResponse(true, '', {});
    }
};

const getListTemplateZaloPay = async ({featureKey}) => {
    try {        
      const pool = await mssql.pool;
      const data = await pool
        .request()
        .input('FEATUREKEY', featureKey)
        .execute('CRM_ZALOPAYTEMPLATE_GetList_AdminWeb');

      return new ServiceResponse(true, '', zaloClass.list(data.recordset));
    } catch (error) {
        logger.error(error, { function: 'zaloOAService.getListTemplateZaloPay' });
        return new ServiceResponse(true, '', {});
    }
};

const sendZNSZaloPay = async (body) => {
    try {

        // const znsPayload = { phone, template_id, template_data };
        // const pool = await mssql.pool;
        // const data = await pool
        // .request()
        // .input('MEMBERID', member_id)
        // .execute('SL_ORDER_GetOrderByMemberID_AdminWeb');

        // const infoTemplate = await pool
        // .request()
        // .query(`SELECT TOP 1 * FROM CRM_ZALOOATEMPLATE WHERE TEMPLATEID = ${template_id} AND FEATUREKEY = ${feature_key}`);
        

        // const result = zaloClass.getOrderByMember(data.recordset);
        // const mapping = {
        //     customer_name: 'customer_name', // Assuming customer_name is in result (you may adjust this)
        //     product_name: 'product_name',
        //     date: 'date',
        //     bill_id: 'bill_id'
        // };

        // if (result && result.length > 0) {
        //     Object.keys(template_data).forEach(key => {
        //         if (!template_data[key] || template_data[key].trim() === '') {
        //             // template_data[key] = result[0][mapping[key]]?.trim()
        //             const value = result[0][mapping[key]]?.trim();
        //             if (value) {
        //                 template_data[key] = value;
        //             }
        //         }
        //     });
        // }
        
        // if (phone && phone.startsWith('0')) {
        //     znsPayload.phone = phone.replace('0', '84');
        // }

        // const dataBody = {
        //     zalo_oa_id: infoTemplate.recordset[0]?.ZALOOAID,
        //     phone: znsPayload.phone,
        //     content: {
        //         template_id: infoTemplate.recordset[0]?.TEMPLATEID,
        //         template_data: {
        //             customer_name: template_data?.customer_name || '',
        //             order_code: template_data?.bill_id || '',
        //             date: template_data?.date || ''
        //         }
        //     },
        //     callback_url: 'http://cms.zalopay.test/zns/v1/callback'
        // }
        // // hash key
        // const message = `${infoTemplate.recordset[0].XCLIENTID}|order_0412|${JSON.stringify(dataBody)}`
        // const xClientHash = hashKey(message, feature_key == 1 ? process.env.SECRECTKEY_ZALOPAY : process.env.SECRECTKEY_ZALOPAY_SAMCENTER);
        
        // const dataSend = {
        //     xClientId: infoTemplate.recordset[0].XCLIENTID,
        //     xRequestId: 'order_0412',
        //     xClientHash,
        //     dataBody: JSON.stringify(dataBody)
        // }
        
        // const res = await zalo.sendZNSZaloPay(dataSend);

        // if (!res?.msg_id) {
        //     throw new Error('Gửi ZNS thất bại');
        // }
        return new ServiceResponse(true, '', 'Gửi ZNS thành công');
    } catch (error) {
        logger.error(error, { function: 'zaloOAService.sendZNS' });
        return new ServiceResponse(false, '', error.message);
    }
};

module.exports = {
    getOAInfo,
    sendTextMessage,
    sendZNS,
    getListTemplate,
    getTemplateById,
    sendZNSByCusOrderData,
    getListTemplateZaloPay,
    sendZNSZaloPay
};
