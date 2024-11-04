const mailchimpTransactional = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_TRANSACTION_APIKEY);
const moment = require('moment');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');

const { getDetail: getEmailListById } = require('../email-list/email-list.service');
const { getDetail: getEmailTemplateById } = require('../email-template/email-template.service');
const { createOrUpdate: createEmailHistory } = require('../email-history/email-history.service');

const { convertMailStatus, convertTemplate, mergeVarsToTemplate } = require('./helper');
const { EMAIL_LIST_TYPE, EMAIL_TYPE, sendedList } = require('./contants');

const getListTransactionalTemplate = async (bodyParams = {}) => {
    try {
        const response = await mailchimpTransactional.templates.list();

        return new ServiceResponse(true, 'OK', response);
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.getListCampaign' });
        return new ServiceResponse(false, e.message);
    }
};

const createTransactionTemplate = async (bodyParams = {}) => {
    try {
        const name = apiHelper.getValueFromObject(bodyParams, 'name');
        const code = apiHelper.getValueFromObject(bodyParams, 'code');
        const from_email = apiHelper.getValueFromObject(bodyParams, 'from_email');
        const from_name = apiHelper.getValueFromObject(bodyParams, 'from_name');
        const subject = apiHelper.getValueFromObject(bodyParams, 'subject');

        const response = await mailchimpTransactional.templates.add({
            name,
            from_email,
            from_name,
            subject,
            code,
        });

        return new ServiceResponse(true, 'OK', response);
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.createTransactionTemplate' });
        return new ServiceResponse(false, e.message);
    }
};

const sendMailByTemplate = async (bodyParams = {}) => {
    try {
        const template_name = apiHelper.getValueFromObject(bodyParams, 'template_name');
        const subject = apiHelper.getValueFromObject(bodyParams, 'subject');
        const from_email = apiHelper.getValueFromObject(bodyParams, 'from_email');
        const from_name = apiHelper.getValueFromObject(bodyParams, 'from_name');
        const to = apiHelper.getValueFromObject(bodyParams, 'to');
        const merge_vars = apiHelper.getValueFromObject(bodyParams, 'merge_vars');

        const response = await mailchimpTransactional.messages.sendTemplate({
            template_name,
            template_content: [{}],
            message: {
                subject,
                from_email,
                from_name,
                to,
            },
            merge_vars,
        });

        return new ServiceResponse(true, 'OK', response);
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.createTransactionTemplate' });
        return new ServiceResponse(false, e.message);
    }
};

const sendListMail = async (bodyParams = {}) => {
    try {
        const mail_from = apiHelper.getValueFromObject(bodyParams, 'mail_from');
        const mail_from_name = apiHelper.getValueFromObject(bodyParams, 'mail_from_name');
        const mail_subject = apiHelper.getValueFromObject(bodyParams, 'mail_subject');
        const mail_reply = apiHelper.getValueFromObject(bodyParams, 'mail_reply');
        const email_template_id = apiHelper.getValueFromObject(bodyParams, 'email_template_id');
        const email_list_id = apiHelper.getValueFromObject(bodyParams, 'email_list_id');
        const mail_supplier = apiHelper.getValueFromObject(bodyParams, 'mail_supplier');
        const send_schedule = apiHelper.getValueFromObject(bodyParams, 'send_schedule');

        const template = await getEmailTemplateById(email_template_id);
        const emailList = await getEmailListById(email_list_id);

        const { email_template_html, email_template_params = [] } = template.getData() || {};
        const { customer_list = [], email_list_type } = emailList.getData() || {};

        if (email_template_html && customer_list && customer_list.length > 0) {
            const receiveList = customer_list.filter((_) => _.customer_email);
            const mergeVars = await _getMergeVars(email_template_params, receiveList, email_list_type);

            const payload = {
                message: {
                    html: convertTemplate(email_template_html),
                    subject: mail_subject,
                    from_email: mail_from,
                    from_name: mail_from_name,
                    reply_to: mail_reply,
                    to: receiveList.map((customer) => ({
                        email: customer.customer_email,
                        name: customer.customer_name,
                    })),
                    global_merge_vars: [],
                    merge_vars: mergeVars,
                    track_opens: true,
                    track_clicks: true,
                },
            };

            if (send_schedule) {
                const send_at = moment
                    .tz(send_schedule, 'hh:mm A DD/MM/YYYY', 'Asia/Ho_Chi_Minh')
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss');
                if (send_at) {
                    payload.send_at = send_at;
                }
            }

            const response = await mailchimpTransactional.messages.send(payload);

            if (response && response.length > 0) {
                for (emailItem of response) {
                    const emailHistoryData = {
                        auth_name: bodyParams?.auth_name,
                        subject: mail_subject,
                        email_template_id: email_template_id,
                        email_from: mail_from,
                        email_to: emailItem.email,
                        note: emailItem.reject_reason || emailItem.queued_reason,
                        message_id: emailItem._id,
                        type: send_schedule ? EMAIL_TYPE.SCHEDULE : EMAIL_TYPE.NORMAL,
                        email_content: mergeVarsToTemplate(emailItem.email, email_template_html, mergeVars),
                        mail_supplier: mail_supplier,
                        status: convertMailStatus(emailItem.status),
                        send_time: emailItem.status === 'sent' ? moment.utc().toDate() : null,
                        schedule_time: send_schedule ? moment.utc(send_schedule, 'hh:mm A DD/MM/YYYY').toDate() : null,
                        reply_to: mail_reply,
                        display_name: mail_from_name,
                    };

                    // add customer id
                    const targetCustomer = customer_list.find((_) => _.customer_email === emailItem.email);
                    switch (email_list_type) {
                        case EMAIL_LIST_TYPE.PRESONAL:
                            emailHistoryData.member_id = targetCustomer?.customer_id;
                            break;
                        case EMAIL_LIST_TYPE.LEAD:
                            emailHistoryData.dataleads_id = targetCustomer?.customer_id;
                            break;
                        case EMAIL_LIST_TYPE.PARNER:
                            emailHistoryData.partner_id = targetCustomer?.customer_id;
                            break;
                    }

                    const createResult = await createEmailHistory(emailHistoryData);

                    if (createResult.isFailed()) {
                        return new ServiceResponse(false, 'Thêm dữ liệu gửi mail xảy ra lỗi');
                    }
                }
            }

            return new ServiceResponse(true, 'success', response);
        }

        return new ServiceResponse(false, 'Gửi mail xảy ra lỗi');
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.sendTransactionListMail' });
        return new ServiceResponse(false, e.message);
    }
};

// const sendListMailV2 = async (bodyParams = {}) => {
//   try {
//       const mail_from = apiHelper.getValueFromObject(bodyParams, 'mail_from');
//       const mail_to = apiHelper.getValueFromObject(bodyParams, 'mail_to');
//       const mail_from_name = apiHelper.getValueFromObject(bodyParams, 'mail_from_name');
//       const mail_subject = apiHelper.getValueFromObject(bodyParams, 'mail_subject');
//       const mail_reply = apiHelper.getValueFromObject(bodyParams, 'mail_reply');
//       const email_template_id = apiHelper.getValueFromObject(bodyParams, 'email_template_id');
//       const mail_supplier = apiHelper.getValueFromObject(bodyParams, 'mail_supplier');

//       const template = await getEmailTemplateById(email_template_id);

//       const { email_template_html } = template.getData() || {};

//       const payload = {
//           message: {
//               html: convertTemplate(email_template_html),
//               subject: mail_subject,
//               from_email: mail_from,
//               from_name: mail_from_name,
//               reply_to: mail_reply,
//               to: mail_to,
//               global_merge_vars: [],
//               track_opens: true,
//               track_clicks: true,
//           },
//       };

//       const response = await mailchimpTransactional.messages.send(payload);
//       console.log('~  response >>>', response)

//       if (response && response.length > 0) {
//           for (emailItem of response) {
//               const emailHistoryData = {
//                   auth_name: bodyParams?.auth_name,
//                   subject: mail_subject,
//                   email_template_id: email_template_id,
//                   email_from: mail_from,
//                   email_to: emailItem.email,
//                   note: emailItem.reject_reason || emailItem.queued_reason,
//                   message_id: emailItem._id,
//                   type: EMAIL_TYPE.NORMAL,
//                   email_content: email_template_html,
//                   mail_supplier: mail_supplier,
//                   status: convertMailStatus(emailItem.status),
//                   send_time: emailItem.status === 'sent' ? moment.utc().toDate() : null,
//                   schedule_time: null,
//                   reply_to: mail_reply,
//                   display_name: mail_from_name,
//               };

//               const createResult = await createEmailHistory(emailHistoryData);
//               console.log('~  createResult >>>', createResult?.data)

//               if (createResult.isFailed()) {
//                   return new ServiceResponse(false, 'Thêm dữ liệu gửi mail xảy ra lỗi');
//               }
//           }
//       }

//       return new ServiceResponse(false, 'Gửi mail xảy ra lỗi');
//   } catch (e) {
//       logger.error(e.message, { function: 'MailChimpService.sendTransactionListMail' });
//       return new ServiceResponse(false, e.message);
//   }
// };

const sendOneMail = async (bodyParams = {}) => {
  try {
        const mail_from = apiHelper.getValueFromObject(bodyParams, 'mail_from');
        const mail_to = apiHelper.getValueFromObject(bodyParams, 'mail_to');
        const mail_from_name = apiHelper.getValueFromObject(bodyParams, 'mail_from_name');
        const mail_subject = apiHelper.getValueFromObject(bodyParams, 'subject');
        const mail_reply = apiHelper.getValueFromObject(bodyParams, 'mail_reply');
        const email_template_id = apiHelper.getValueFromObject(bodyParams, 'email_template_id');
        const mail_supplier = apiHelper.getValueFromObject(bodyParams, 'mail_supplier');
        const send_schedule = apiHelper.getValueFromObject(bodyParams, 'send_schedule');
        const task_detail_id = apiHelper.getValueFromObject(bodyParams, 'task_detail_id');
        const member_id = apiHelper.getValueFromObject(bodyParams, 'member_id');
        const dataleads_id = apiHelper.getValueFromObject(bodyParams, 'dataleads_id');
        const customer_code = bodyParams.customer_code || bodyParams.data_leads_code || 'KH0000001';
        const _customer_code = customer_code? Buffer.from(`EMAIL_${customer_code.trim()}`).toString('base64'): ''

        const template = await getEmailTemplateById(email_template_id);
        const { email_template_html: _email_template_html, email_template_params } = template.getData() || {};

        let email_template_html = _email_template_html;
        if (email_template_html?.includes('{{INTERESTID}}')) {
            email_template_html = email_template_html.replace('{{INTERESTID}}', _customer_code);
        }

        if (email_template_html && mail_to) {
            let mergeVars = [];
            if (member_id) {
                mergeVars = await _getMergeVars(
                    email_template_params,
                    [{ customer_email: mail_to, customer_id: member_id }],
                    EMAIL_LIST_TYPE.PRESONAL,
                );
            } else if (dataleads_id) {
                mergeVars = await _getMergeVars(
                    email_template_params,
                    [{ customer_email: mail_to, customer_id: dataleads_id }],
                    EMAIL_LIST_TYPE.LEAD,
                );
            }

            const payload = {
                message: {
                    html: convertTemplate(email_template_html),
                    subject: mail_subject,
                    from_email: mail_from,
                    from_name: mail_from_name,
                    reply_to: mail_reply,
                    to: [
                        {
                            email: mail_to,
                        },
                    ],
                    global_merge_vars: [],
                    merge_vars: mergeVars,
                    track_opens: true,
                    track_clicks: true,
                },
            };

            if (send_schedule) {
                const send_at = moment
                    .tz(send_schedule, 'hh:mm A DD/MM/YYYY', 'Asia/Ho_Chi_Minh')
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss');
                if (send_at) {
                    payload.send_at = send_at;
                }
            }

            const response = await mailchimpTransactional.messages.send(payload);

            // if (response && response.length > 0) {
            //   console.log('SUCCESS', response[0]?.email, response[0]?.status)
            // } else {
            //   console.log('FAIL', payload?.mail_to)
            // }

            if (response && response.length > 0) {
                for (emailItem of response) {
                    const emailHistoryData = {
                        auth_name: bodyParams?.auth_name,
                        subject: mail_subject,
                        email_template_id: email_template_id,
                        email_from: mail_from,
                        email_to: emailItem.email,
                        note: emailItem.reject_reason || emailItem.queued_reason,
                        message_id: emailItem._id,
                        type: send_schedule ? EMAIL_TYPE.SCHEDULE : EMAIL_TYPE.NORMAL,
                        email_content: mergeVarsToTemplate(emailItem.email, email_template_html, mergeVars),
                        mail_supplier: mail_supplier,
                        status: convertMailStatus(emailItem.status),
                        send_time: emailItem.status === 'sent' ? moment().utc().toDate() : null,
                        task_detail_id: task_detail_id,
                        member_id: member_id,
                        dataleads_id: dataleads_id,
                        schedule_time: send_schedule ? moment.utc(send_schedule, 'hh:mm A DD/MM/YYYY').toDate() : null,
                        reply_to: mail_reply,
                        display_name: mail_from_name,
                    };

                    const createResult = await createEmailHistory(emailHistoryData);

                    if (createResult.isFailed()) {
                        return new ServiceResponse(false, 'Thêm dữ liệu gửi mail xảy ra lỗi');
                    }
                }
            }

            return new ServiceResponse(true, 'success', response);
        }

        return new ServiceResponse(false, 'Gửi mail xảy ra lỗi');
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.sendOneMail' });
        return new ServiceResponse(false, e.message);
    }
};

const sendListMailToCustomerLeads = async (bodyParams = {}) => {
    try {
        const mail_from = apiHelper.getValueFromObject(bodyParams, 'mail_from');
        const mail_from_name = apiHelper.getValueFromObject(bodyParams, 'mail_from_name');
        const mail_subject = apiHelper.getValueFromObject(bodyParams, 'mail_subject');
        const mail_reply = apiHelper.getValueFromObject(bodyParams, 'mail_reply');
        const email_template_id = apiHelper.getValueFromObject(bodyParams, 'email_template_id');
        const customer_list = apiHelper.getValueFromObject(bodyParams, 'customer_list');
        const mail_supplier = apiHelper.getValueFromObject(bodyParams, 'mail_supplier');
        const send_schedule = apiHelper.getValueFromObject(bodyParams, 'send_schedule');

        const template = await getEmailTemplateById(email_template_id);

        const { email_template_html, email_template_params = [] } = template.getData() || {};

        if (email_template_html && customer_list && customer_list.length > 0) {
            const receiveList = customer_list.filter((_) => _.email && _.data_leads_id);
            const mergeVars = await _getMergeVars(
                email_template_params,
                receiveList.map((customer) => ({
                    customer_id: customer.data_leads_id,
                    customer_email: customer.email,
                })),
                EMAIL_LIST_TYPE.LEAD,
            );

            const payload = {
                message: {
                    html: convertTemplate(email_template_html),
                    subject: mail_subject,
                    from_email: mail_from,
                    from_name: mail_from_name,
                    reply_to: mail_reply,
                    to: receiveList.map((customer) => ({
                        email: customer.email,
                        name: customer.full_name,
                    })),
                    global_merge_vars: [],
                    merge_vars: mergeVars,
                    track_opens: true,
                    track_clicks: true,
                },
            };

            if (send_schedule) {
                const send_at = moment.utc(send_schedule, 'hh:mm A DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
                if (send_at) {
                    payload.send_at = send_at;
                }
            }

            const response = await mailchimpTransactional.messages.send(payload);

            if (response && response.length > 0) {
                for (emailItem of response) {
                    const emailHistoryData = {
                        auth_name: bodyParams?.auth_name,
                        subject: mail_subject,
                        email_template_id: email_template_id,
                        email_from: mail_from,
                        email_to: emailItem.email,
                        note: emailItem.reject_reason || emailItem.queued_reason,
                        message_id: emailItem._id,
                        type: send_schedule ? EMAIL_TYPE.SCHEDULE : EMAIL_TYPE.NORMAL,
                        email_content: mergeVarsToTemplate(emailItem.email, email_template_html, mergeVars),
                        mail_supplier: mail_supplier,
                        status: convertMailStatus(emailItem.status),
                        send_time: emailItem.status === 'sent' ? moment.utc().toDate() : null,
                        schedule_time: send_schedule ? moment.utc(send_schedule, 'hh:mm A DD/MM/YYYY').toDate() : null,
                        reply_to: mail_reply,
                        display_name: mail_from_name,
                    };

                    // add customer id
                    const targetCustomer = customer_list.find((_) => _.email === emailItem.email);
                    emailHistoryData.dataleads_id = targetCustomer?.data_leads_id || null;

                    const createResult = await createEmailHistory(emailHistoryData);

                    if (createResult.isFailed()) {
                        return new ServiceResponse(false, 'Thêm dữ liệu gửi mail xảy ra lỗi');
                    }
                }
            }

            return new ServiceResponse(true, 'success', response);
        }

        return new ServiceResponse(false, 'Gửi mail xảy ra lỗi');
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.sendTransactionListMail' });
        return new ServiceResponse(false, e.message);
    }
};

const sendListMailToMember = async (bodyParams = {}) => {
    try {
        const mail_from = apiHelper.getValueFromObject(bodyParams, 'mail_from');
        const mail_from_name = apiHelper.getValueFromObject(bodyParams, 'mail_from_name');
        const mail_subject = apiHelper.getValueFromObject(bodyParams, 'mail_subject');
        const mail_reply = apiHelper.getValueFromObject(bodyParams, 'mail_reply');
        const email_template_id = apiHelper.getValueFromObject(bodyParams, 'email_template_id');
        const customer_list = apiHelper.getValueFromObject(bodyParams, 'customer_list');
        const mail_supplier = apiHelper.getValueFromObject(bodyParams, 'mail_supplier');
        const send_schedule = apiHelper.getValueFromObject(bodyParams, 'send_schedule');

        const template = await getEmailTemplateById(email_template_id);

        const { email_template_html, email_template_params = [] } = template.getData() || {};

        if (email_template_html && customer_list && customer_list.length > 0) {
            const receiveList = customer_list.filter((_) => _.email && _.member_id);
            const mergeVars = await _getMergeVars(
                email_template_params,
                receiveList.map((customer) => ({
                    customer_id: customer.member_id,
                    customer_email: customer.email,
                })),
                EMAIL_LIST_TYPE.PRESONAL,
            );

            const payload = {
                message: {
                    html: convertTemplate(email_template_html),
                    subject: mail_subject,
                    from_email: mail_from,
                    from_name: mail_from_name,
                    reply_to: mail_reply,
                    to: receiveList.map((customer) => ({
                        email: customer.email,
                        name: customer.full_name,
                    })),
                    global_merge_vars: [],
                    merge_vars: mergeVars,
                    track_opens: true,
                    track_clicks: true,
                },
            };

            if (send_schedule) {
                const send_at = moment.utc(send_schedule, 'hh:mm A DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
                if (send_at) {
                    payload.send_at = send_at;
                }
            }

            const response = await mailchimpTransactional.messages.send(payload);

            if (response && response.length > 0) {
                for (emailItem of response) {
                    const emailHistoryData = {
                        auth_name: bodyParams?.auth_name,
                        subject: mail_subject,
                        email_template_id: email_template_id,
                        email_from: mail_from,
                        email_to: emailItem.email,
                        note: emailItem.reject_reason || emailItem.queued_reason,
                        message_id: emailItem._id,
                        type: send_schedule ? EMAIL_TYPE.SCHEDULE : EMAIL_TYPE.NORMAL,
                        email_content: mergeVarsToTemplate(emailItem.email, email_template_html, mergeVars),
                        mail_supplier: mail_supplier,
                        status: convertMailStatus(emailItem.status),
                        send_time: emailItem.status === 'sent' ? moment.utc().toDate() : null,
                        schedule_time: send_schedule ? moment.utc(send_schedule, 'hh:mm A DD/MM/YYYY').toDate() : null,
                        reply_to: mail_reply,
                        display_name: mail_from_name,
                    };

                    // add customer id
                    const targetCustomer = customer_list.find((_) => _.email === emailItem.email);
                    emailHistoryData.member_id = targetCustomer?.member_id || null;

                    const createResult = await createEmailHistory(emailHistoryData);

                    if (createResult.isFailed()) {
                        return new ServiceResponse(false, 'Thêm dữ liệu gửi mail xảy ra lỗi');
                    }
                }
            }

            return new ServiceResponse(true, 'success', response);
        }

        return new ServiceResponse(false, 'Gửi mail xảy ra lỗi');
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.sendListMailToMember' });
        return new ServiceResponse(false, e.message);
    }
};

const getSenderInfo = async () => {
    try {
        const response = await mailchimpTransactional.senders.list();

        return new ServiceResponse(true, 'OK', response);
    } catch (e) {
        logger.error(e.message, { function: 'MailChimpService.getSenderInfo' });
        return new ServiceResponse(false, e.message);
    }
};

const _getDataFromPartner = async (columns = [], id) => {
    try {
        const query = `SELECT ${columns.join(',')} FROM CRM_PARTNER WHERE ISDELETED = 0 AND PARTNERID = ${id}`;
        const pool = await mssql.pool;
        const dataRes = await pool.request().query(query);

        return dataRes?.recordset[0] || {};
    } catch (e) {
        logger.error(e, { function: 'MailChimpService._getDataFromPartner' });
        return {};
    }
};

const _getDataFromDataLeads = async (columns, id) => {
    try {
        const query = `SELECT ${columns.join(
            ',',
        )} FROM CRM_CUSTOMERDATALEADS WHERE ISDELETED = 0 AND DATALEADSID = ${id}`;
        const pool = await mssql.pool;
        const dataRes = await pool.request().query(query);
        const dataResult = dataRes?.recordset[0] || {};
        if (dataResult && dataResult.BIRTHDAY) {
            dataResult.BIRTHDAY = moment(dataResult.BIRTHDAY).format('DD/MM/YYYY');
        }

        return dataResult;
    } catch (e) {
        logger.error(e, { function: 'MailChimpService._getDataFromDataLeads' });
        return {};
    }
};

const _getDataFromAccount = async (columns, id) => {
    try {
        const query = `SELECT ${columns.join(',')} FROM CRM_ACCOUNT WHERE ISDELETED = 0 AND MEMBERID = ${id}`;
        const pool = await mssql.pool;
        const dataRes = await pool.request().query(query);
        const dataResult = dataRes?.recordset[0] || {};
        if (dataResult && dataResult.BIRTHDAY) {
            dataResult.BIRTHDAY = moment(dataResult.BIRTHDAY).format('DD/MM/YYYY');
        }

        return dataResult;
    } catch (e) {
        // logger.error(e, { function: 'MailChimpService._getValueFromAccount' });
        return {};
    }
};

const _getMergeVars = async (templateParams, customerList, receiveType = EMAIL_LIST_TYPE.PRESONAL) => {
    if (!templateParams || templateParams.length <= 0) {
        return [];
    }

    try {
        const promiseList = customerList.map(async (customer) => {
            const mergeVars = { rcpt: customer.customer_email };

            switch (receiveType) {
                case EMAIL_LIST_TYPE.PRESONAL:
                    const individualCustoemrColumns = templateParams
                        .map((_) => _.individual_customer_param)
                        .filter((_) => _);
                    const accountData = await _getDataFromAccount(individualCustoemrColumns, customer.customer_id);
                    mergeVars.vars = templateParams.map((templateParam) => ({
                        name: templateParam.template_param,
                        content: (accountData[templateParam.individual_customer_param] ?? '').toString(),
                    }));
                    break;
                case EMAIL_LIST_TYPE.LEAD:
                    const potentialCustomerColumns = templateParams
                        .map((_) => _.potentital_customer_param)
                        .filter((_) => _);
                    const leadsData = await _getDataFromDataLeads(potentialCustomerColumns, customer.customer_id);
                    mergeVars.vars = templateParams.map((templateParam) => ({
                        name: templateParam.template_param,
                        content: (leadsData[templateParam.potentital_customer_param] ?? '').toString(),
                    }));
                    break;
                case EMAIL_LIST_TYPE.PARNER:
                    const businessCustomerColumns = templateParams
                        .map((_) => _.business_customer_param)
                        .filter((_) => _);
                    const partnerData = await _getDataFromPartner(businessCustomerColumns, customer.customer_id);
                    mergeVars.vars = templateParams.map((templateParam) => ({
                        name: templateParam.template_param,
                        content: (partnerData[templateParam.business_customer_param] ?? '').toString(),
                    }));
                    break;
            }

            return mergeVars;
        });

        const mergeVars = await Promise.all(promiseList);

        return mergeVars;
    } catch (e) {
        logger.error(e, { function: 'MailChimpService._getMergeVars' });
        return [];
    }
};

module.exports = {
    getListTransactionalTemplate,
    createTransactionTemplate,
    sendMailByTemplate,
    sendListMail,
    sendOneMail,
    getSenderInfo,
    sendListMailToCustomerLeads,
    sendListMailToMember,
};
