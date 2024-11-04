const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const BULLMQQUEUE = require('../../bullmq/queue');
const orderClass = require('./order.class');
const { sendMultipleMessage_V4_post_json } = require('../task-type/utils/sms');
const { sendZNSByCusOrderData } = require('../zalo-oa/zalo-oa.service');
const { sendOneMail } = require('./utils');
const { compliedTemplate } = require('../../common/helpers/utils.helper');
const { iphone15json } = require('./constants');
const omit = require('lodash/omit');
const sql = require('mssql');

const sendNotifyTask = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request()
            .query(`SELECT A1.ORDERNOTIFYID, A1.ORDERID, A1.ORDERSTATUSID, A1.ORDERTYPEID, A1.ISSEND
    FROM SL_ORDER_NOTIFY A1
    left join SL_ORDERTYPE_STATUS A2 ON A1.ORDERTYPEID = A2.ORDERTYPEID AND A1.ORDERSTATUSID = A2.ORDERSTATUSID AND A2.ISACTIVE = 1 AND A2.ISDELETED = 0
    WHERE A1.ISSEND = 0
    AND (A2.ISSENDSMS = 1 OR A2.ISSENDEMAIL = 1 OR A2.ISSENDZALOOA = 1)`);

        const listNotify = orderClass.sendNotifyTask(res.recordset);
        console.log('~ sendNotifyTask listNotify >>>', listNotify?.length);
        for (let i = 0; i < listNotify.length; i++) {
            await BULLMQQUEUE.addIfNotExists({
                type: 'order.sendNotifyJob',
                payload: listNotify[i],
                jobId: `ORDER_NOTIFY_${listNotify[i]?.order_notify_id}`,
            });
        }
    } catch (error) {
        logger.error(error, { function: 'orderService.sendNotifyTask' });
    }
};

const checkSendNotify = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        //Kiểm tra xem trạng thái đơn hàng có được gửi SMS hay ZaloOA hay không ?
        const dataOrderSendSMS = await pool
            .request()
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('ORDERSTATUSID', apiHelper.getValueFromObject(bodyParams, 'order_status_id'))
            .input('ORDERTYPEID', apiHelper.getValueFromObject(bodyParams, 'order_type_id'))
            .execute('SL_ORDER_CheckSendNotify_AdminWeb');

        const dataTemplate = orderClass.checkSendData(dataOrderSendSMS.recordsets[1][0]);
        const payment_form_names = (dataTemplate.payment_form_names || '').split('|');
        const _payment_name = payment_form_names?.length ? payment_form_names[1] || payment_form_names[0] : '';
        dataTemplate.payment_name = _payment_name;

        const result = {
            ...orderClass.checkSendNotify(dataOrderSendSMS.recordset[0]),
            dataSend: dataTemplate,
        };

        return new ServiceResponse(true, 'ok', result);
    } catch (e) {
        logger.error(e, { function: 'orderService.checkSendNotify' });
        return new ServiceResponse(false, '', {});
    }
};

const notifyWhenOrderStatusChange = async (orderStatusSendData) => {
    try {
        console.log(
            '~ notifyWhenOrderStatusChange dataSend >>>',
            JSON.stringify(omit(orderStatusSendData, 'email_template_html')),
        );
        const dataSend = orderStatusSendData?.dataSend || {};

        const productSelected = iphone15json.find((item) => item.productId == dataSend.product_id);
        if (productSelected) {
            dataSend.pre_product_image_url = productSelected.imageUrl;
            dataSend.pre_product_price = productSelected.price;
            dataSend.pre_product_listed_price = productSelected.price_listed;
            if (!dataSend?.total_money && dataSend?.pre_product_price) {
                dataSend.total_money = dataSend?.pre_product_price;
            }
        }

        let is_send_sms = 1,
            is_send_email = 1,
            is_send_zalo_oa = 1;

        if (orderStatusSendData?.is_send_sms) {
            const sms_content_complied = compliedTemplate(orderStatusSendData.content_sms || '', dataSend, 'SMS');
            const resSms = await sendMultipleMessage_V4_post_json({
                phone: dataSend.phone_number,
                content: sms_content_complied,
                brandname: 'SHOPDUNK',
                sandbox: 0,
            });
            if (resSms.isFailed()) {
                is_send_sms = 0;
            }
        }

        // Gửi tin nhắn zalo
        if (orderStatusSendData?.is_send_zalo_oa) {
            const resZalo = await sendZNSByCusOrderData({
                phone: dataSend.phone_number,
                template_id: orderStatusSendData?.oa_template_id,
                sendData: dataSend,
            });
            if (resZalo.isFailed()) {
                is_send_zalo_oa = 0;
            }
        }

        // Gửi email trạng thái có thì gửi luôn
        if (orderStatusSendData?.is_send_email && dataSend?.email) {
            let template = orderStatusSendData?.email_template_html || '';
            if (!dataSend?.total_money) {
                template = template.replace(
                    `<td style="padding: 5px 0px; font-size: 14px; height: 19.5703px;">Tổng tiền</td>`,
                    '',
                );
                template = template.replace(
                    `<td style="padding: 5px 0px; font-size: 14px; height: 19.5703px;"><strong>{{TOTALMONEY}} đ </strong></td>`,
                    '',
                );
            }
            template = template.replace(/{{/g, '<%= ').replace(/}}/g, ' %>');

            const compliedEmailContent = compliedTemplate(template, dataSend, 'EMAIL');
            const resEmail = await sendOneMail({
                from_email: orderStatusSendData?.mail_from || 'cskh@shopdunk.com',
                mail_to: dataSend?.email,
                from_name: orderStatusSendData?.mail_from_name || 'ShopDunk',
                mail_subject: orderStatusSendData?.mail_subject || 'ShopDunk',
                mail_reply: orderStatusSendData?.mail_reply || 'cskh@shopdunk.com',
                email_content: compliedEmailContent,
            });
            if (resEmail.isFailed()) {
                is_send_email = 0;
            }
        }

        return {
            is_send_sms,
            is_send_email,
            is_send_zalo_oa,
        };
    } catch (error) {
        return {
            is_send_sms: 0,
            is_send_email: 0,
            is_send_zalo_oa: 0,
        };
    }
};

const sendNotifyJob = async (payload) => {
    try {
        if (!payload?.order_id || !payload?.order_status_id || !payload?.order_type_id) {
            throw new Error('sendNotifyJob bad payload');
        }
        const orderStatusSendRes = await checkSendNotify({
            order_id: payload.order_id,
            order_status_id: payload.order_status_id,
            order_type_id: payload.order_type_id,
        });
        const orderStatusSendData = orderStatusSendRes.getData();
        const dataSend = orderStatusSendData?.dataSend || {};

        if (!dataSend?.is_send_notify) {
            const notifyRes = await notifyWhenOrderStatusChange(orderStatusSendData);
            const pool = await mssql.pool;
            await pool
                .request()
                .input('ORDERID', apiHelper.getValueFromObject(payload, 'order_id'))
                .input('ORDERTYPEID', apiHelper.getValueFromObject(payload, 'order_type_id'))
                .input('ORDERSTATUSID', apiHelper.getValueFromObject(payload, 'order_status_id'))
                .input('ISSEND', notifyRes?.is_send_sms || notifyRes?.is_send_email || notifyRes?.is_send_zalo_oa ? 1 : 0)
                .input('ISSENDSMS', notifyRes?.is_send_sms)
                .input('ISSENDEMAIL', notifyRes?.is_send_email)
                .input('ISSENDZALOOA', notifyRes?.is_send_zalo_oa)
                .execute('SL_ORDER_NOTIFY_Update_AdminWeb');
            return;
        }
        if (!dataSend?.is_send_sms && !dataSend.is_send_zalo_oa && !dataSend.is_send_email) {
            const pool = await mssql.pool;
            await pool
                .request()
                .input('ORDERID', apiHelper.getValueFromObject(payload, 'order_id'))
                .input('ORDERTYPEID', apiHelper.getValueFromObject(payload, 'order_type_id'))
                .input('ORDERSTATUSID', apiHelper.getValueFromObject(payload, 'order_status_id'))
                .input('ISSEND', -1)
                .execute('SL_ORDER_NOTIFY_Update_AdminWeb');
        }
    } catch (error) {
        console.log('orderService.sendNotifyJob', error?.message);
    }
};

const cancelOldOrder = async (payload) => {
    try {
        const pool = await mssql.pool;
        await pool.request().execute('SL_ORDER_RestoreOldImeis_Schedule');
        return;
    } catch (error) {
        console.log('orderService.cancelOldOrder', error?.message);
    }
};

const createOrUpdateNotify = async (payload) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        let notifyId
        let deviceToken
        const query = `SELECT * FROM SYS_NOTIFYTYPE SN
                WHERE SN.FEATUREKEY = 7
                AND SN.ISDELETED = 0
                AND SN.ISACTIVE = 1`;
        const dataNotifyType = await pool.request().query(query);

        const notifyTypeData = orderClass.notify(dataNotifyType.recordset[0]);

        if (!notifyTypeData.notify_type_id) {
            return new ServiceResponse(false, 'Không tìm thấy NOTIFYTYPE');
        }

        if (notifyTypeData.notify_type_id) {
            try {
                const createNotify = new sql.Request(transaction);
                const resultNotify = await createNotify
                    .input('NOTIFYTYPEID', 7)
                    .input('NOTIFYTITLE', notifyTypeData.notify_title)
                    .input('NOTIFYCONTENT', notifyTypeData.notify_content)
                    .input('ORDERID', payload.order_id)
                    .input('CREATEDUSER', payload.auth.user_name)
                    .execute('SYS_NOTIFY_CreateOrderReview_Service');

                const resNotifyId = resultNotify.recordset[0].NOTIFYID;
                notifyId = resNotifyId

                if (resNotifyId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo SYS_NOTIFY thất bại!');
                }

            } catch (error) {
                console.log(error.message);
                return new ServiceResponse(false, 'Tạo SYS_NOTIFY thất bại!');
            }

            if (notifyId) {
                const createNotifyUser = new sql.Request(transaction);
                const resultNotifyUser = await createNotifyUser
                    .input('NOTIFYID', notifyId)
                    .input('USERNAME', payload.review_user)
                    .execute('SYS_NOTIFY_USER_Create_Service');

                const resNotifyUserId = resultNotifyUser.recordset[0].RESULT
                deviceToken = resultNotifyUser.recordset[0].DEVICETOKEN

                if (resNotifyUserId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Tạo SYS_NOTIFY_USER thất bại!');
                }
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Thành công.', {
            notify_id: notifyId,
            notify_title: notifyTypeData.notify_title,
            notify_content: notifyTypeData.notify_content,
            device_token: deviceToken
        });
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'order.createOrUpdateNotify' });
        return new ServiceResponse(false, e.message);
    }
};

const updateIsPush = async (notifyId) => {
    try {
        const pool = await mssql.pool;
        const query = `UPDATE SYS_NOTIFY
      SET ISPUSHED = 1
      WHERE NOTIFYID = ${notifyId}
      AND ISDELETED IS NULL
      AND ISACTIVE = 1`;
        const receive = `UPDATE SYS_NOTIFY_USER
      SET RECEIVEDATE = GETDATE()
      WHERE NOTIFYID = ${notifyId}`;

        await pool.request().query(query);
        await pool.request().query(receive);
    } catch (e) {
        logger.error(e, { function: 'order.updateIsPush' });
        return new ServiceResponse(false, e.message);
    }
};

const orderService = {
    sendNotifyTask,
    sendNotifyJob,
    cancelOldOrder,
    updateIsPush,
    createOrUpdateNotify,
};

module.exports = orderService;
