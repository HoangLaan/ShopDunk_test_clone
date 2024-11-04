const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const notifyClass = require('../notify/notify.class');
const { sendMultipleMessage_V4_post_json } = require('./utils/sms');
const zalo = require('../../common/services/zalo');
const { truncateString } = require('./utils/utils');
const template = require('lodash/template');
const { sendOneMail } = require('./utils/email');
const { getEmailVoucher, getEmailSubscriber, getEmailCuSac } = require('./utils/constants');

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

const sendSMSVoucher = async ({ phone, email, customer_name, voucher_code, discount_money, coupon_auto_code_id }) => {
    try {
        const discountMoney = discount_money === -1 ? 290000 : discount_money || 290000;

        let voucherName;
        if (discount_money == -1) {
            voucherName = `INNOS20W`;
        } else {
            voucherName = `${discountMoney}VND`;
        }
        const msgContent = `Chuc mung Anh/chi ${customer_name} da nhan duoc 01 Voucher ${voucherName} tu minigame cua ShopDunk. Ma qua tang ${voucher_code}. Ho tro giai dap thac mac: 19006626`;

        const sendSmsRes = await sendMultipleMessage_V4_post_json({
            phone,
            content: msgContent,
            brandname: 'SHOPDUNK',
        });
        const sendSmsData = sendSmsRes.getData();
        const isSendSMS = Boolean(sendSmsData.SMSID);

        /**
         * -1: củ sạc 290k
         */

        const emailContent =
            discount_money === -1
                ? getEmailCuSac(customer_name, voucher_code)
                : getEmailVoucher(customer_name, voucher_code, discountMoney);
        const resSendMail = await sendOneMail({
            from_email: 'cskh@shopdunk.com',
            mail_to: email,
            from_name: 'Shopdunk',
            mail_subject: 'SHOPDUNK - MÃ QUÀ TẶNG MINI GAME 15 HỘP QUÀ',
            mail_reply: 'cskh@shopdunk.com',
            email_content: emailContent,
        });
        const isSendEmail = resSendMail?.data[0]?.status === 'sent';

        const pool = await mssql.pool;
        await pool
            .request()
            .input('SENTCONTENT', msgContent)
            .input('EMAIL', email)
            .input('PHONENUMBER', phone)
            .input('ISSENT', isSendSMS || isSendEmail)
            .input('ISSENTSMS', isSendSMS)
            .input('ISSENTEMAIL', isSendEmail)
            .input('SENTTYPE', 'VOUCHER')
            .execute('CRM_NOTIFY_HISTORY_Create_AdminWeb');

        if (coupon_auto_code_id) {
            await pool
                .request()
                .query(
                    `update SM_COUPON_AUTOCODE
                    set ISSENT = ${Boolean(isSendEmail || isSendSMS) ? 1 : 0},
                    ISSENTSMS = ${isSendSMS ? 1 : 0},
                    ISSENTEMAIL = ${isSendEmail ? 1 : 0}
                    where COUPONAUTOCODEID = ${coupon_auto_code_id}`,
                );
        }

        if (!isSendSMS && !isSendEmail) {
            throw new Error('Gửi tin nhắn SMS hoặc Email thất bại');
        }

        return new ServiceResponse(true, 'Gửi tin nhắn SMS và Email thành công');
    } catch (e) {
        logger.error(e, { function: 'notifyService.sendSMS' });
        return new ServiceResponse(false, '', {});
    }
};

const sendSMSToSubscriber = async ({ email, phone, customer_name, email_subscriber_id }) => {
    try {
        // const msgContent = `Cam on Anh/chi ${customer_name} da dang ky nhan thong tin san pham moi tai ShopDunk. Ho tro giai dap thac mac: 19006626. Website: https://shopdunk.com/`;
        const msgContent = `Cam on Anh/chi ${customer_name} da dang ky nhan thong tin SP moi tai ShopDunk. Ho tro giai dap thac mac: 19006626. Website: https://shopdunk.com/`;
        const sendSmsRes = await sendMultipleMessage_V4_post_json({
            phone,
            content: msgContent,
            brandname: 'SHOPDUNK',
            sandbox: 0,
        });
        const sendSmsData = sendSmsRes.getData();
        const isSendSMS = Boolean(sendSmsData.SMSID);

        const resSendMail = await sendOneMail({
            from_email: 'cskh@shopdunk.com',
            mail_to: email,
            from_name: 'Shopdunk',
            mail_subject: 'XÁC NHẬN ĐĂNG KÝ THÔNG TIN',
            mail_reply: 'cskh@shopdunk.com',
            email_content: getEmailSubscriber(customer_name),
        });
        const isSendEmail = resSendMail?.data[0]?.status === 'sent';

        const pool = await mssql.pool;
        await pool
            .request()
            .input('SENTCONTENT', msgContent)
            .input('EMAIL', email)
            .input('PHONENUMBER', phone)
            .input('ISSENT', isSendSMS || isSendEmail)
            .input('ISSENTSMS', isSendSMS)
            .input('ISSENTEMAIL', isSendEmail)
            .input('SENTTYPE', 'SUBSCRIBER')
            .execute('CRM_NOTIFY_HISTORY_Create_AdminWeb');

        if (email_subscriber_id) {
            await pool
                .request()
                .query(
                    `update CRM_EMAILSUBSCRIBER
                    set ISSENT = ${Boolean(isSendEmail || isSendSMS) ? 1 : 0},
                    ISSENTSMS = ${isSendSMS ? 1 : 0},
                    ISSENTEMAIL = ${isSendEmail ? 1 : 0}
                    where EMAILSUBSCRIBERID = ${email_subscriber_id}`,
                );
        }

        if (!isSendSMS && !isSendEmail) {
            throw new Error('Gửi tin nhắn SMS hoặc Email thất bại');
        }
        return new ServiceResponse(true, 'Gửi tin nhắn SMS và Email thành công');
    } catch (e) {
        logger.error(e, { function: 'notifyService.sendSMS' });
        return new ServiceResponse(false, '', {});
    }
};

// sendSMSToSubscriber({ phone: '0329927227', email: 'phidnblackwind@gmail.com', customer_name: 'Dang Nhat Phi' })
// sendSMSVoucher({
//     phone: '84329927227',
//     email: 'phidnblackwind@gmail.com',
//     customer_name: 'Dang Nhat Phi',
//     voucher_code: '123456',
//     discount_money: 200000,
//     coupon_auto_code_id: 1035,
// });
// sendSMSVoucher({ phone: '84329927227', email: 'phidnblackwind@gmail.com', customer_name: 'Dang Nhat Phi', voucher_code: '123456', discount_money: -1 })

const sendZNSByCusOrderData = async ({ phone, template_id, sendData, mode }) => {
    try {
        const znsPayload = { phone, template_id, mode };
        const znsDetail = await zalo.getTemplateById(template_id);

        const templateDataMapped = {
            name: sendData?.full_name,
            customer_name: sendData?.full_name,
            phone_number: sendData?.phone_number,
            email: sendData?.email,

            order_code: sendData?.order_no,
            order_date: sendData?.order_date,
            price: sendData?.total_amount,
            order_price: sendData?.total_amount,
            status: sendData?.status_name,
            product_name: truncateString(sendData?.product_name_list || '', 95),
            pre_order_no: sendData?.pre_order_no,
            pre_order_code: sendData?.pre_order_no,
            store_name: sendData?.store_name,
            date: sendData?.receiving_date,
            time: sendData?.receiving_time,
            receive_address: sendData?.receive_address,
            payment_type: sendData?.payment_type,
        };

        if (+template_id == 278295) {
            templateDataMapped.total_money = sendData.pre_money;
        }

        const znsTemplateData = {};
        znsDetail.listParams
            .map((x) => x.name)
            .forEach((param) => {
                znsTemplateData[param] = templateDataMapped[param] || '';
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
        logger.error(error, { function: 'notifyService.sendZNS' });
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
        logger.error(error, { function: 'notifyService.sendZNS' });
        return new ServiceResponse(false, '', {});
    }
};

const sendZNSMiniGame = async ({ mode, phone, mini_game, voucher_price, customer_name }) => {
    try {
        const znsPayload = {
            phone,
            template_id: '278996',
            template_data: {
                minigame: mini_game,
                customer_name,
                voucher_price,
            },
        };
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
        logger.error(error, { function: 'notifyService.sendZNSMiniGame' });
        return new ServiceResponse(false, '', {});
    }
};

// sendZNS({
//   phone: '84329927227',
//   template_id: '278996',
//   template_data: {
//     "customer_name": "Dang Nhat Phi v2",
//     "minigame": "Lật game quẩy chất: 15 hộp quà",
//     "voucher_price": "100.000"
//   },
//   mode: 'development',
// });

// sendZNSMiniGame({
//   mode: 'development',
//   phone: '84329927227',
//   mini_game: 'Lật game quẩy chất: 15 hộp quà',
//   voucher_price: '100.000',
//   customer_name: 'Dang Nhat Phi v3',
// })

module.exports = {
    sendSMS,
    sendZNS,
    sendZNSMiniGame,
    sendSMSVoucher,
    sendSMSToSubscriber,
};
