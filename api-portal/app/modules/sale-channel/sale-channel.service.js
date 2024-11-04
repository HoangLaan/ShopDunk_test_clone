const apiHelper = require('../../common/helpers/api.helper');
const scclass = require('./sale-channel.class');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const fbService = require('../../common/services/facebook.service');
const fileHelper = require('../../common/helpers/file.helper');
const numberFormatHelper = require('../../common/helpers/numberFormat');
const moment = require('moment');
const config = require('../../../config/config');
const {setHash, set, getByHash, delHash} = require('../../common/helpers/redis.helper');

const {push: publisMessage} = require('../../common/helpers/mqtt.helper');
const {default: axios} = require('axios');
const {getListMessageByConversationId, getConversationByPageId} = require('./utils/helpers');

const SC_FACEBOOK_FANPAGE = 'SC_FACEBOOK_FANPAGE';

const getUserStatus = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .input('SOCIAL', 'facebook')
            .execute('SC_PAGE_ADMIN_CheckStatus_AdminWeb');
        return new ServiceResponse(true, 'ok', data.recordset.length ? 'connected' : 'not_exists');
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getUserStatus'});
        return new ServiceResponse(false);
    }
};

const getUserToken = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .input('SOCIAL', 'facebook')
            .execute('SC_ADMIN_GetUserToken_AdminWeb');
        if (!data || !data.recordset.length)
            return new ServiceResponse(false, 'Không tìm thấy tài khoản kết nối. Vui lòng thử lại.');
        return new ServiceResponse(true, 'ok', data.recordset[0].ACCESSTOKEN);
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getUserToken'});
        return new ServiceResponse(false);
    }
};

// Đồng bộ dữ liệu facebook gồm có tin nhắn
const syncFacebookData = async bodyParams => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const token = apiHelper.getValueFromObject(bodyParams, 'accessToken');
        if (!token) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Mã người dùng là bắt buộc.');
        }
        // Lấy token dài hạn hạn
        const longToken = await fbService.getUserToken(token);
        if (!longToken) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lấy mã người dùng kết nối không thành công.');
        }
        // Luu thông tin người dùng với long live token (facebook hạn sử dụng là 60 ngày)
        const userId = apiHelper.getValueFromObject(bodyParams, 'userID');
        const requestAdmin = new sql.Request(transaction);
        const expired_date = moment().add(40, 'days').format('DD/MM/YYYY HH:mm:ss');
        await requestAdmin
            .input('USERID', userId)
            .input('ACCESSTOKEN', longToken)
            .input('SOCIAL', 'facebook')
            .input('EXPIREDDATE', expired_date)
            .execute('SC_ADMIN_Create_AdminWeb');
        // Lấy danh sách fan page với longlive token
        const pages = await fbService.getListPage(longToken);
        if (!pages || !pages.length)
            return new ServiceResponse(false, 'Tài khoản của bạn chưa được kết nối với fan page nào!');
        // Lấy các thông tin vè tin nhắn để cập nhật
        const requestPage = new sql.Request(transaction);
        for (let i = 0; i < pages.length; i++) {
            let {name, id, access_token, picture} = pages[i];
            let pageRequest = {name, id, access_token};
            // Neu co hinh anh thi upload
            if (picture && picture.data && picture.data.url) {
                try {
                    pageRequest.page_avatar = await fileHelper.downloadImgFB(picture.data.url);
                } catch (error) {
                    logger.error(error, {function: 'saleChannelService.downloadImgFB'});
                }
                if (pageRequest.page_avatar) pageRequest.page_avatar = `${config.domain_cdn}${pageRequest.page_avatar}`;
            }
            // Lưu thông tin page
            const pageId = apiHelper.getValueFromObject(pageRequest, 'id');
            const pageAccessToken = apiHelper.getValueFromObject(pageRequest, 'access_token');
            await requestPage
                .input('PAGEID', pageId)
                .input('PAGEAVATAR', apiHelper.getValueFromObject(pageRequest, 'page_avatar'))
                .input('PAGENAME', apiHelper.getValueFromObject(pageRequest, 'name'))
                .input('ACCESSTOKEN', pageAccessToken)
                .input('SOCIAL', 'facebook')
                .input('USERID', userId)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SC_PAGE_Create_AdminWeb');
            // Subscrice webhook page
            publisMessage({
                topic: `sc/facebook/page/webhook/${config.scFacebookName}`,
                payload: {
                    type: 'sc.facebook.subscribe',
                    page_id: pageId,
                    token: pageAccessToken,
                },
            });
            // BULLMQ.push({
            //     type: 'sc.facebook.subscribe',
            //     payload: {
            //         page_id: pageId,
            //         token: pageAccessToken,
            //     },
            // });
            // Lấy danh sách tin nhắn cua page để đồng bộ
            const dataGetConversations = await fbService.getConversations(id, access_token);
            const {conversations, paging} = dataGetConversations;
            const requestConversation = new sql.Request(transaction);
            const requestConversationParticipants = new sql.Request(transaction);
            const requestMessage = new sql.Request(transaction);
            const requestMessageAttachment = new sql.Request(transaction);

            for (let j = 0; j < conversations.length; j++) {
                const conversation = conversations[j];
                // Luu thong tin cuoc hoi thoai
                const resultRequestConversation = await requestConversation
                    .input('PAGEID', pageId)
                    .input('CONVERSATIONID', apiHelper.getValueFromObject(conversation, 'id'))
                    .input('MESSAGECOUNT', apiHelper.getValueFromObject(conversation, 'message_count'))
                    .execute('SC_PAGE_CONVERSATIONS_Create_AdminWeb');
                const {RESULT: conversationId} = resultRequestConversation.recordset[0];
                if (!conversationId) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Đã có lỗi xảy ra trong quá trình đồng bộ dữ liệu.');
                }
                // Luu thong tin danh sach nguoi tham gia
                const {participants, messages} = conversation;
                if (participants && participants.data && participants.data.length) {
                    for (let k = 0; k < participants.data.length; k++) {
                        const participantId = apiHelper.getValueFromObject(participants.data[k], 'id');
                        const participantName = apiHelper.getValueFromObject(participants.data[k], 'name');
                        const participantEmail = apiHelper.getValueFromObject(participants.data[k], 'email');
                        await requestConversationParticipants
                            .input('PAGECONVERSATIONID', conversationId)
                            .input('CONVERSATIONID', apiHelper.getValueFromObject(conversation, 'id'))
                            .input('USERID', participantId)
                            .input('NAME', participantName)
                            .input('EMAIL', participantEmail)
                            .execute('SC_PAGE_CONVERSATIONS_PARTICIPANTS_Create_AdminWeb');

                        publisMessage({
                            topic: `sc/facebook/page/webhook/${config.scFacebookName}`,
                            payload: {
                                type: 'sc.facebook.profile',
                                user_id: participantId,
                                name: participantName,
                                email: participantEmail,
                                page_id: pageId,
                                token: pageAccessToken,
                            },
                            qos: 1,
                        });
                    }
                }
                // Luu thong tin tin nhan
                if (messages && messages.data && messages.data.length) {
                    let _mesages = messages.data;
                    for (let m = 0; m < _mesages.length; m++) {
                        const {
                            created_time,
                            from,
                            id,
                            message,
                            sticker,
                            tags,
                            thread_id,
                            to,
                            message_type,
                            attachments,
                        } = _mesages[m];
                        // Lấy trạng thái đọc của tin nhắn và source
                        let isRead,
                            isSent = 0;
                        let source,
                            toId,
                            toName,
                            toEmail = '';
                        if (tags && tags.data) {
                            for (let n = 0; n < tags.data.length; n++) {
                                if (tags.data[n].name == 'read') isRead = 1;
                                if (tags.data[n].name == 'sent') isSent = 1;
                                if (tags.data[n].name.includes('source')) {
                                    source = tags.data[n].name;
                                }
                            }
                        }
                        // Lấy người nhận. tạm thời chỉ lấy một người nhận
                        if (to && to.data && to.data.length) {
                            toId = to.data[0].id;
                            toName = to.data[0].name;
                            toEmail = to.data[0].email;
                        }
                        const resultRequestMessage = await requestMessage
                            .input('PAGECONVERSATIONID', conversationId)
                            .input('CONVERSATIONID', apiHelper.getValueFromObject(conversation, 'id'))
                            .input('FROMNAME', apiHelper.getValueFromObject(from, 'name'))
                            .input('FROMEMAIL', apiHelper.getValueFromObject(from, 'email'))
                            .input('FROMID', apiHelper.getValueFromObject(from, 'id'))
                            .input('MESSAGEID', id)
                            .input('MESSAGE', message)
                            .input('TONAME', toName)
                            .input('TOEMAIL', toEmail)
                            .input('TOID', toId)
                            .input('STICKER', sticker)
                            .input('THREADID', thread_id)
                            .input('MESSAGETYPE', message_type)
                            .input('ISSENT', isSent)
                            .input('ISREAD', isRead)
                            .input('SOURCE', source)
                            .input('CREATEDDATE', moment(created_time).format('YYYY-MM-DD HH:mm:ss'))
                            .execute('SC_PAGE_CONVERSATIONS_MESSAGES_Create_AdminWeb');
                        const {RESULT: conversationMessageId} = resultRequestMessage.recordset[0];
                        if (!conversationMessageId) {
                            await transaction.rollback();
                            return new ServiceResponse(false, 'Đã có lỗi xảy ra trong quá trình đồng bộ dữ liệu.');
                        }
                        // Lưu thông tin file đính kèm
                        if (attachments && attachments.data && attachments.data.length) {
                            const attachment = attachments.data[0];
                            let file_url = '';
                            let width,
                                height,
                                maxWidth,
                                maxHeight = 0;
                            if (attachment.image_data) {
                                file_url = attachment.image_data.url;
                                width = attachment.image_data.width;
                                height = attachment.image_data.height;
                                maxWidth = attachment.image_data.max_width;
                                maxHeight = attachment.image_data.max_height;
                            } else file_url = attachment.file_url;
                            await requestMessageAttachment
                                .input('CONVERSATIONSMESSAGEID', conversationMessageId)
                                .input('MESSAGEID', id)
                                .input('ATTACHMENTID', apiHelper.getValueFromObject(attachment, 'id'))
                                .input('MIMETYPE', apiHelper.getValueFromObject(attachment, 'mime_type'))
                                .input('NAME', apiHelper.getValueFromObject(attachment, 'name'))
                                .input('SIZE', apiHelper.getValueFromObject(attachment, 'size'))
                                .input('FILEURL', file_url)
                                .input('WIDTH', width)
                                .input('HEIGHT', height)
                                .input('MAXWIDTH', maxWidth)
                                .input('MAXHEIGHT', maxHeight)
                                .execute('SC_PAGE_CONVERSATIONS_MESSAGES_ATTACHMENTS_Create_AdminWeb');
                        }
                    }
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, 'ok', pages);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, {function: 'saleChannelService.syncFacebookData'});
        return new ServiceResponse(false);
    }
};

// Đồng bộ dữ liệu facebook gồm có tin nhắn
const syncPageData = async bodyParams => {
    const pool = await mssql.pool;
    //const transaction = await new sql.Transaction(pool);
    try {
        //await transaction.begin();
        // Kiểm tra xem có page để sync không
        const pageSync = apiHelper.getValueFromObject(bodyParams, 'page_ids');
        if (!pageSync || !pageSync.length) {
            //await transaction.rollback();
            return new ServiceResponse(false, 'Danh sách page đồng bộ data là bắt buộc.');
        }
        // Lấy token của người dùng
        const token = apiHelper.getValueFromObject(bodyParams, 'user_access_token');
        if (!token) {
            //await transaction.rollback();
            return new ServiceResponse(false, 'Mã người dùng là bắt buộc.');
        }
        // Lấy token dài hạn h      ạn
        const longToken = await fbService.getUserToken(token);
        if (!longToken) {
            //await transaction.rollback();
            return new ServiceResponse(false, 'Lấy mã người dùng kết nối không thành công.');
        }
        // Luu thông tin người dùng với long live token (facebook hạn sử dụng là 60 ngày)
        const userId = apiHelper.getValueFromObject(bodyParams, 'user_id');
        //const requestAdmin = new sql.Request(transaction);
        const expired_date = moment().add(40, 'days').format('DD/MM/YYYY HH:mm:ss');
        await pool
            .request()
            .input('USERID', userId)
            .input('ACCESSTOKEN', longToken)
            .input('SOCIAL', 'facebook')
            .input('EXPIREDDATE', expired_date)
            .execute('SC_ADMIN_Create_AdminWeb');
        // Lấy danh sách fan page với lo nglive token
        let pages = await fbService.getListPage(longToken);
        if (!pages || !pages.length) {
            //await transaction.rollback();
            return new ServiceResponse(false, 'Tài khoản của bạn chưa được kết nối với fan page nào!');
        }
        // Lấy các thông tin vè tin nhắn để cập nhật
        // Chu lay cac page chua sync
        pages = (pages || []).filter(page => (pageSync || []).findIndex(x => x == page.id) >= 0);

        //const requestPage = new sql.Request(transaction);

        for (let i = 0; i < pages.length; i++) {
            let {name, id, access_token, picture} = pages[i];
            let pageRequest = {name, id, access_token};
            // Neu co hinh anh thi upload
            if (picture && picture.data && picture.data.url) {
                try {
                    pageRequest.page_avatar = await fileHelper.downloadImgFB(picture.data.url);
                } catch (error) {
                    logger.error(error, {function: 'saleChannelService.downloadImgFB'});
                }
                if (pageRequest.page_avatar) pageRequest.page_avatar = `${config.domain_cdn}${pageRequest.page_avatar}`;
            }
            // Lưu thông tin page
            const pageId = apiHelper.getValueFromObject(pageRequest, 'id');
            const pageAccessToken = apiHelper.getValueFromObject(pageRequest, 'access_token');
            await pool
                .request()
                .input('PAGEID', pageId)
                .input('PAGEAVATAR', apiHelper.getValueFromObject(pageRequest, 'page_avatar'))
                .input('PAGENAME', apiHelper.getValueFromObject(pageRequest, 'name'))
                .input('ACCESSTOKEN', pageAccessToken)
                .input('SOCIAL', 'facebook')
                .input('USERID', userId)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SC_PAGE_Create_AdminWeb');
            // Subscrice webhook page

            publisMessage({
                topic: `sc/facebook/page/webhook/${config.scFacebookName}`,
                payload: {
                    type: 'sc.facebook.subscribe',
                    page_id: pageId,
                    token: pageAccessToken,
                },
            });
        }

        for (let i = 0; i < pages.length; i++) {
            let {name, id, access_token, picture} = pages[i];
            let pageRequest = {name, id, access_token};
            // Neu co hinh anh thi upload
            if (picture && picture.data && picture.data.url) {
                try {
                    pageRequest.page_avatar = await fileHelper.downloadImgFB(picture.data.url);
                } catch (error) {
                    logger.error(error, {function: 'saleChannelService.downloadImgFB'});
                }
                if (pageRequest.page_avatar) pageRequest.page_avatar = `${config.domain_cdn}${pageRequest.page_avatar}`;
            }
            // Lưu thông tin page
            const pageId = apiHelper.getValueFromObject(pageRequest, 'id');
            const pageAccessToken = apiHelper.getValueFromObject(pageRequest, 'access_token');
            // await pool
            //     .request()
            //     .input('PAGEID', pageId)
            //     .input('PAGEAVATAR', apiHelper.getValueFromObject(pageRequest, 'page_avatar'))
            //     .input('PAGENAME', apiHelper.getValueFromObject(pageRequest, 'name'))
            //     .input('ACCESSTOKEN', pageAccessToken)
            //     .input('SOCIAL', 'facebook')
            //     .input('USERID', userId)
            //     .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            //     .execute('SC_PAGE_Create_AdminWeb');
            // Subscrice webhook page

            // publisMessage({
            //     topic: `sc/facebook/page/webhook/${config.scFacebookName}`,
            //     payload: {
            //         type: 'sc.facebook.subscribe',
            //         page_id: pageId,
            //         token: pageAccessToken,
            //     },
            // });

            let isFirst = true;
            let after = null;
            let stopSync = false;

            while (after || isFirst || stopSync) {
                // Lấy danh sách tin nhắn cua page để đồng bộ
                isFirst = false;
                const dataGetConversations = await fbService.getConversations(id, access_token, after);
                //const requestConversation = new sql.Request(transaction);
                //const requestConversationParticipants = new sql.Request(transaction);
                //const requestMessage = new sql.Request(transaction);
                //const requestMessageAttachment = new sql.Request(transaction);

                const {conversations, paging} = dataGetConversations;

                if (paging && Boolean(paging.next)) {
                    after = paging.cursors.after;
                }
                const dateNow = moment().subtract(100, 'd').format('YYYY-MM-DD');

                for (let j = 0; j < conversations.length; j++) {
                    const conversation = conversations[j];
                    const conversationDate = moment(conversation.updated_time).format('YYYY-MM-DD');
                    if (dateNow >= conversationDate) {
                        stopSync = true;
                        break;
                    }
                    // Luu thong tin cuoc hoi thoai
                    const resultRequestConversation = await pool
                        .request()
                        .input('PAGEID', pageId)
                        .input('CONVERSATIONID', apiHelper.getValueFromObject(conversation, 'id'))
                        .input('MESSAGECOUNT', apiHelper.getValueFromObject(conversation, 'message_count'))
                        .execute('SC_PAGE_CONVERSATIONS_Create_AdminWeb');
                    const {RESULT: conversationId} = resultRequestConversation.recordset[0];

                    if (!conversationId) {
                        //await transaction.rollback();
                        return new ServiceResxponse(false, 'Đã có lỗi xảy ra trong quá trình đồng bộ dữ liệu.');
                    }
                    // Luu thong tin danh sach nguoi tham gia
                    const {participants, messages} = conversation;
                    if (participants && participants.data && participants.data.length) {
                        for (let k = 0; k < participants.data.length; k++) {
                            const participantId = apiHelper.getValueFromObject(participants.data[k], 'id');
                            const participantName = apiHelper.getValueFromObject(participants.data[k], 'name');
                            const participantEmail = apiHelper.getValueFromObject(participants.data[k], 'email');
                            await pool
                                .request()
                                .input('PAGECONVERSATIONID', conversationId)
                                .input('CONVERSATIONID', apiHelper.getValueFromObject(conversation, 'id'))
                                .input('USERID', participantId)
                                .input('NAME', participantName)
                                .input('EMAIL', participantEmail)
                                .execute('SC_PAGE_CONVERSATIONS_PARTICIPANTS_Create_AdminWeb');

                            publisMessage({
                                topic: `sc/facebook/page/webhook/${config.scFacebookName}`,
                                payload: {
                                    type: 'sc.facebook.profile',
                                    user_id: participantId,
                                    name: participantName,
                                    email: participantEmail,
                                    page_id: pageId,
                                    token: pageAccessToken,
                                },
                            });

                            // publisMessage(
                            //     {
                            //         type: 'sc.facebook.profile',
                            //         payload: {
                            //             user_id: participantId,
                            //             name: participantName,
                            //             email: participantEmail,
                            //             page_id: pageId,
                            //             token: pageAccessToken,
                            //         },
                            //     },
                            //     {
                            //         jobId: `${participantId}-${Math.random()}-${pageId}`,
                            //         attempts: 2,
                            //     },
                            // );
                        }
                    }
                    // Luu thong tin tin nhan
                    if (messages && messages.data && messages.data.length) {
                        let _mesages = messages.data;
                        for (let m = 0; m < _mesages.length; m++) {
                            const {
                                created_time,
                                from,
                                id,
                                message,
                                sticker,
                                tags,
                                thread_id,
                                to,
                                message_type,
                                attachments,
                            } = _mesages[m];
                            // Lấy trạng thái đọc của tin nhắn và source
                            let isRead,
                                isSent = 0;
                            let source,
                                toId,
                                toName,
                                toEmail = '';
                            if (tags && tags.data) {
                                for (let n = 0; n < tags.data.length; n++) {
                                    if (tags.data[n].name == 'read') isRead = 1;
                                    if (tags.data[n].name == 'sent') isSent = 1;
                                    if (tags.data[n].name.includes('source')) {
                                        source = tags.data[n].name;
                                    }
                                }
                            }
                            // Lấy người nhận. tạm thời chỉ lấy một người nhận
                            if (to && to.data && to.data.length) {
                                toId = to.data[0].id;
                                toName = to.data[0].name;
                                toEmail = to.data[0].email;
                            }
                            const resultRequestMessage = await pool
                                .request()
                                .input('PAGECONVERSATIONID', conversationId)
                                .input('CONVERSATIONID', apiHelper.getValueFromObject(conversation, 'id'))
                                .input('FROMNAME', apiHelper.getValueFromObject(from, 'name'))
                                .input('FROMEMAIL', apiHelper.getValueFromObject(from, 'email'))
                                .input('FROMID', apiHelper.getValueFromObject(from, 'id'))
                                .input('MESSAGEID', id)
                                .input('MESSAGE', message)
                                .input('TONAME', toName)
                                .input('TOEMAIL', toEmail)
                                .input('TOID', toId)
                                .input('STICKER', sticker)
                                .input('THREADID', thread_id)
                                .input('MESSAGETYPE', message_type)
                                .input('ISSENT', isSent)
                                .input('ISREAD', isRead)
                                .input('SOURCE', source)
                                .input('CREATEDDATE', moment(created_time).format('YYYY-MM-DD HH:mm:ss'))
                                .execute('SC_PAGE_CONVERSATIONS_MESSAGES_Create_AdminWeb');
                            const {RESULT: conversationMessageId} = resultRequestMessage.recordset[0];
                            if (!conversationMessageId) {
                                //await transaction.rollback();
                                return new ServiceResponse(false, 'Đã có lỗi xảy ra trong quá trình đồng bộ dữ liệu.');
                            }
                            // Lưu thông tin file đính kèm
                            if (attachments && attachments.data && attachments.data.length) {
                                const attachment = attachments.data[0];
                                let file_url = '';
                                let width,
                                    height,
                                    maxWidth,
                                    maxHeight = 0;
                                if (attachment.image_data) {
                                    file_url = attachment.image_data.url;
                                    width = attachment.image_data.width;
                                    height = attachment.image_data.height;
                                    maxWidth = attachment.image_data.max_width;
                                    maxHeight = attachment.image_data.max_height;
                                } else file_url = attachment.file_url;
                                await pool
                                    .request()
                                    .input('CONVERSATIONSMESSAGEID', conversationMessageId)
                                    .input('MESSAGEID', id)
                                    .input('ATTACHMENTID', apiHelper.getValueFromObject(attachment, 'id'))
                                    .input('MIMETYPE', apiHelper.getValueFromObject(attachment, 'mime_type'))
                                    .input('NAME', apiHelper.getValueFromObject(attachment, 'name'))
                                    .input('SIZE', apiHelper.getValueFromObject(attachment, 'size'))
                                    .input('FILEURL', file_url)
                                    .input('WIDTH', width)
                                    .input('HEIGHT', height)
                                    .input('MAXWIDTH', maxWidth)
                                    .input('MAXHEIGHT', maxHeight)
                                    .execute('SC_PAGE_CONVERSATIONS_MESSAGES_ATTACHMENTS_Create_AdminWeb');
                            }
                        }
                    }
                }
            }
        }
        //await transaction.commit();
        for (let value of bodyParams.page_ids) {
            setHash(SC_FACEBOOK_FANPAGE, value, {
                source: config.scFacebookName,
            });
        }
        return new ServiceResponse(true, 'ok', pages);
    } catch (e) {
        //await transaction.rollback();
        logger.error(e, {function: 'saleChannelService.syncFacebookData'});
        if (e.includes('613')) {
            return new ServiceResponse(true, 'ok');
        }
        return new ServiceResponse(false);
    }
};

// Đồng bộ dữ liệu facebook gồm có tin nhắn
const syncPageDataNew = async bodyParams => {
    const pool = await mssql.pool;
    //const transaction = await new sql.Transaction(pool);
    try {
        //await transaction.begin();
        // Kiểm tra xem có page để sync không
        const pageSync = apiHelper.getValueFromObject(bodyParams, 'page_ids');
        if (!pageSync || !pageSync.length) {
            //await transaction.rollback();
            return new ServiceResponse(false, 'Danh sách page đồng bộ data là bắt buộc.');
        }
        // Lấy token của người dùng
        const token = apiHelper.getValueFromObject(bodyParams, 'user_access_token');
        if (!token) {
            //await transaction.rollback();
            return new ServiceResponse(false, 'Mã người dùng là bắt buộc.');
        }
        // Lấy token dài hạn h      ạn
        const longToken = await fbService.getUserToken(token);
        if (!longToken) {
            //await transaction.rollback();
            return new ServiceResponse(false, 'Lấy mã người dùng kết nối không thành công.');
        }
        // Luu thông tin người dùng với long live token (facebook hạn sử dụng là 60 ngày)
        const userId = apiHelper.getValueFromObject(bodyParams, 'user_id');
        //const requestAdmin = new sql.Request(transaction);
        const expired_date = moment().add(40, 'days').format('DD/MM/YYYY HH:mm:ss');
        await pool
            .request()
            .input('USERID', userId)
            .input('ACCESSTOKEN', longToken)
            .input('SOCIAL', 'facebook')
            .input('EXPIREDDATE', expired_date)
            .execute('SC_ADMIN_Create_AdminWeb');
        // Lấy danh sách fan page với lo nglive token
        let pages = await fbService.getListPage(longToken);
        if (!pages || !pages.length) {
            //await transaction.rollback();
            return new ServiceResponse(false, 'Tài khoản của bạn chưa được kết nối với fan page nào!');
        }
        // Lấy các thông tin vè tin nhắn để cập nhật
        // Chu lay cac page chua sync
        pages = (pages || []).filter(page => (pageSync || []).findIndex(x => x == page.id) >= 0);
        //const requestPage = new sql.Request(transaction);

        for (let i = 0; i < pages.length; i++) {
            let {name, id, access_token, picture} = pages[i];
            let pageRequest = {name, id, access_token};
            // Neu co hinh anh thi upload
            if (picture && picture.data && picture.data.url) {
                try {
                    pageRequest.page_avatar = await fileHelper.downloadImgFB(picture.data.url);
                } catch (error) {
                    logger.error(error, {function: 'saleChannelService.downloadImgFB'});
                }
                if (pageRequest.page_avatar) pageRequest.page_avatar = `${config.domain_cdn}${pageRequest.page_avatar}`;
            }
            // Lưu thông tin page
            const pageId = apiHelper.getValueFromObject(pageRequest, 'id');
            const pageAccessToken = apiHelper.getValueFromObject(pageRequest, 'access_token');
            await pool
                .request()
                .input('PAGEID', pageId)
                .input('PAGEAVATAR', apiHelper.getValueFromObject(pageRequest, 'page_avatar'))
                .input('PAGENAME', apiHelper.getValueFromObject(pageRequest, 'name'))
                .input('ACCESSTOKEN', pageAccessToken)
                .input('SOCIAL', 'facebook')
                .input('USERID', userId)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('SC_PAGE_Create_AdminWeb');
            // Subscrice webhook page

            publisMessage({
                topic: `sc/facebook/page/webhook/${config.scFacebookName}`,
                payload: {
                    type: 'sc.facebook.subscribe',
                    page_id: pageId,
                    token: pageAccessToken,
                },
            });
        }

        for (let value of bodyParams.page_ids) {
            setHash(SC_FACEBOOK_FANPAGE, value, {
                source: config.scFacebookName,
            });
        }
        return new ServiceResponse(true, 'ok', pages);
    } catch (e) {
        //await transaction.rollback();
        logger.error(e, {function: 'saleChannelService.syncFacebookData'});
        if (e.includes('613')) {
            return new ServiceResponse(true, 'ok');
        }
        return new ServiceResponse(false);
    }
};

// Lấy danh sách page mà user đó quản lý
const getListPage = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(params, 'facebook_user_id'))
            .input('SOCIAL', 'facebook')
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('SC_PAGE_GetListConnect_AdminWeb');
        return new ServiceResponse(true, 'ok', scclass.listPageConnect(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getPageConnect'});
        return new ServiceResponse(false);
    }
};

// Lay trang thai page
const getListPageToSync = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGEIDS', apiHelper.getValueFromObject(params, 'page_ids', []).join('|'))
            .execute('SC_PAGE_GetStatus_AdminWeb');
        const pageSync = (data.recordset || []).map(item => item.PAGEID);
        return new ServiceResponse(true, 'ok', pageSync);
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getListPageToSync'});
        return new ServiceResponse(false);
    }
};

// Lay danh sach page da connect theo user cua he thong
const getListPageConnect = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('SOCIAL', 'facebook')
            .execute('SC_PAGE_CONNECT_GetList_AdminWeb');
        return new ServiceResponse(true, 'ok', scclass.listPageConnect(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getListPageConnect'});
        return new ServiceResponse(false);
    }
};

// Go ket noi cac page dang co cua user
const deletePageConnect = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('ISDISCONNECTALL', apiHelper.getValueFromObject(params, 'is_disconnect_all'))
            .input('PAGEIDS', apiHelper.getValueFromObject(params, 'page_ids', []).join('|'))
            .input('SOCIAL', 'facebook')
            .execute('SC_PAGE_CONNECT_Delete_AdminWeb');
        // if (data.recordsets && data.recordsets[0]) {
        //     for (let i of data.recordsets[0]) {
        //         delHash(SC_FACEBOOK_FANPAGE, i.PAGEID);
        //     }
        // }
        return new ServiceResponse(true, 'ok', 'ok');
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.deletePageConnect'});
        return new ServiceResponse(false);
    }
};

// Lấy danh sách các cuộc hội thoại gần nhất của page
const getListConversation = async (queryParams = {}) => {
    try {
        const page_id = apiHelper.getValueFromObject(queryParams, 'page_id');
        const after = apiHelper.getValueFromObject(queryParams, 'after');
        const access_token = apiHelper.getValueFromObject(queryParams, 'access_token');
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const hash_tags = apiHelper.getValueFromObject(queryParams, 'hash_tags');

        if (hash_tags || keyword) {
            const pool = await mssql.pool;
            const data = await pool
                .request()
                .input('PAGESIZE', itemsPerPage)
                .input('PAGEINDEX', currentPage)
                .input('KEYWORD', keyword)
                .input('PAGEID', page_id)
                .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
                .execute('SC_PAGE_CONVERSATIONS_GetListByPageId_AdminWeb');
            let conversations = scclass.listConversation(data.recordset);
            const hashtags = scclass.listHashTag(data.recordsets[1], true);
            conversations = (conversations || []).filter(conversation => {
                conversation.hash_tags = (hashtags || []).filter(x => {
                    const isConversation = conversation.user && x.user_id == conversation.user.user_id;
                    return isConversation;
                });
                if (hash_tags) {
                    if (conversation.hash_tags.find(p => hash_tags.includes(p.id))) {
                        return conversation;
                    }
                } else {
                    return conversation;
                }
            });
            return new ServiceResponse(true, '', {
                data: conversations.sort(function (left, right) {
                    return moment.utc(right.message.created_date).diff(moment.utc(left.message.created_date));
                }),
                page: currentPage,
                limit: itemsPerPage,
                total: apiHelper.getTotalData(data.recordset),
            });
        } else {
            const getFromFacebook = await getConversationByPageId(page_id, access_token, after);
            const listAllHashTags = await getListHashTagFacebookUser({})
            let data = (getFromFacebook?.data || [])?.map(e => {
                return {
                    page_id: page_id,
                    conversation_id: e?.id,
                    is_seen: !Boolean(e?.unread_count),
                    message: {
                        message_id: null,
                        text: e?.snippet,
                        created_date: e?.updated_time,
                    },
                    user: {
                        user_id: e?.participants?.data[0]?.id,
                        email: e?.participants?.data[0]?.email,
                        name: e?.participants?.data[0]?.name,
                        profile_pic: `https://graph.facebook.com/${e?.participants?.data[0]?.id}/picture?type=square&access_token=${access_token}`,
                    },
                    user_hash_tags: (listAllHashTags.data || []).filter(x => x.__user_id == e?.participants?.data[0]?.id),
                };
            });
            let page = getFromFacebook.paging;
            return new ServiceResponse(true, '', {
                data,
                page,
                limit: itemsPerPage,
            });
        }
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getListConversation'});
        return new ServiceResponse(false, '', {});
    }
};

const getPageAccessToken = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGEID', apiHelper.getValueFromObject(queryParams, 'page_id'))
            .execute('SC_PAGE_GetAccessToken_AdminWeb');
        if (!data || !data.recordset || !data.recordset.length)
            return new ServiceResponse(false, 'Không thể kết nối đến fan page.');
        return new ServiceResponse(true, 'ok', data.recordset[0].ACCESSTOKEN);
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getPageAccessToken'});
        return new ServiceResponse(false);
    }
};

const deleteFacebookUser = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .input('PAGEID', apiHelper.getValueFromObject(queryParams, 'page_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SC_USER_Delete_AdminWeb');
        return new ServiceResponse(true, 'ok', 'ok');
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.deleteFacebookUser'});
        return new ServiceResponse(false);
    }
};

const getMessageFacebookUser = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .input('PAGEID', apiHelper.getValueFromObject(queryParams, 'page_id'))
            .input('CONVERSATIONID', apiHelper.getValueFromObject(queryParams, 'conversation_id'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SC_PAGE_CONVERSATIONS_MESSAGES_GetList_AdminWeb');
        const TOTALITEMS = data.recordset[0].TOTALITEMS;
        const messages = scclass.listMessage(data.recordsets[1]);
        return new ServiceResponse(true, '', {
            data: messages,
            page: currentPage,
            limit: itemsPerPage,
            total: TOTALITEMS,
        });
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getMessageFacebookUser'});
        return new ServiceResponse(false);
    }
};

const getMessageFacebookLive = async queryParams => {
    try {
        const cid = apiHelper.getValueFromObject(queryParams, 'conversation_id');
        const access_token = apiHelper.getValueFromObject(queryParams, 'access_token');
        const limit = apiHelper.getValueFromObject(queryParams, 'limit');
        const after = apiHelper.getValueFromObject(queryParams, 'after');

        const getConversationByUserId = await getListMessageByConversationId(
            cid,
            access_token,
            limit,
            after,
        );

        return new ServiceResponse(true, '', {
            data: getConversationByUserId.data.map(e => {
                return {
                    attachment: e?.attachments
                        ? {
                              ...e?.attachments?.data[0],
                              file_url: e?.attachments?.data[0]?.mime_type.includes('image')
                                  ? e?.attachments?.data[0]?.image_data?.url
                                  : e?.attachments?.data[0]?.file_url,
                              file_type: e?.attachments?.data[0]?.mime_type.includes('image') ? 'image' : 'file',
                              file_name: e?.attachments?.data[0]?.name,
                          }
                        : null,
                    conversation_id: e.thread_id,
                    created_date: moment(e?.created_time).format('DD/MM/YYYY HH:mm:ss'),
                    message_id: e?.id,
                    text: e?.message,
                    from: e?.from,
                    to: e?.to,
                };
            }),
            paging: getConversationByUserId.paging,
        });
    } catch (error) {
        console.log(error);
        logger.error(error, {function: 'saleChannelService.getMessageFacebookLive'});
        return new ServiceResponse(false);
    }
};

const sendMessageFacebookUser = async (bodyParams = {}) => {
    try {
        const userId = apiHelper.getValueFromObject(bodyParams, 'user_id');
        const pageId = apiHelper.getValueFromObject(bodyParams, 'page_id');
        const pageToken = apiHelper.getValueFromObject(bodyParams, 'page_token');
        const conversationId = apiHelper.getValueFromObject(bodyParams, 'conversation_id');
        const file = apiHelper.getValueFromObject(bodyParams, 'file');
        const fileType = apiHelper.getValueFromObject(bodyParams, 'file_type');
        let fileUrl = null;
        // Upload file qua cdn để lấy link
        if (file) {
            try {
                fileUrl = await fileHelper.saveFileFB(file);
            } catch (error) {
                logger.error(e, {function: 'saleChannelService.uploadFileFB'});
            }
        }
        const message = apiHelper.getValueFromObject(bodyParams, 'message');
        // Neu không có file và message thì báo lỗi k thể gửi tin nhắn
        if (!fileUrl && !message) {
            return new ServiceResponse(false, 'Nội dung tin nhắn là bắt buộc!');
        }
        // Nếu có file thì gửi tin nhắn dạng attachment, chỉ gửi 2 loại, image hoặc file
        // Ngược lại gửi tin nhắn dạng text
        let payload = {
            recipient: {id: userId},
        };
        if (message) {
            payload = {...payload, message: {text: message}};
        } else if (fileUrl) {
            payload = {
                ...payload,
                message: {
                    attachment: {
                        type: fileType,
                        payload: {
                            url: `${config.domain_cdn}${fileUrl}`,
                            is_reusable: true,
                        },
                    },
                },
            };
        }
        // Gui tin nhan facebook
        let messageRes = null;
        try {
            messageRes = await fbService.sendMessage(payload, pageToken);
        } catch (error) {
            logger.error(error, {function: 'saleChannelService.sendMessageFB'});
            return new ServiceResponse(false, error);
        }

        const {message_id: mid} = messageRes;
        if (!mid) return new ServiceResponse(false, 'Không thể gửi tin nhắn!');
        // Push queue luu tin nhan cho service
        // publisMessage({
        //     topic: `sc/facebook/page/webhook/${config.scFacebookName}`,
        //     payload: {
        //         type: 'sc.facebook.message',
        //         pageId,
        //         pageToken,
        //         mid,
        //         conversationId,
        //     },
        //     qos: 2,
        // });

        return new ServiceResponse(true, 'ok', {
            message_id: mid,
            message: {
                text: message ? message : null,
                attachment: fileUrl
                    ? {
                          type: fileType,
                          url: `${config.domain_cdn}${fileUrl}`,
                          name: apiHelper.getValueFromObject(file, 'originalname'),
                          size: apiHelper.getValueFromObject(file, 'size'),
                      }
                    : null,
            },
        });
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.sendMessageFacebookUser'});
        return new ServiceResponse(false);
    }
};

const updateMessageFacebookUser = async (bodyParams = {}) => {
    try {
        const pageId = apiHelper.getValueFromObject(bodyParams, 'page_id');
        const pageToken = apiHelper.getValueFromObject(bodyParams, 'page_token');
        const conversationId = apiHelper.getValueFromObject(bodyParams, 'conversation_id');
        const messageId = apiHelper.getValueFromObject(bodyParams, 'message_id');
        const username = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const message = apiHelper.getValueFromObject(bodyParams, 'message');
        const created_date = apiHelper.getValueFromObject(bodyParams, 'created_date');

        if (!messageId) return new ServiceResponse(false, 'Không thể gửi tin nhắn!');

        // Push queue luu tin nhan
        publisMessage({
            topic: `sc/facebook/page/${bodyParams.page_id}/webhook`,
            payload: {
                clientId: bodyParams.clientId,
                sender_id: bodyParams.page_id,
                recipient_id: bodyParams.user_id,
                conversation_id: bodyParams.conversation_id,
                created_date: bodyParams.created_date,
                last_reply_fullname: bodyParams.last_reply_fullname,
                last_reply_userid: bodyParams.last_reply_userid,
                last_reply_username: bodyParams.last_reply_username,
                isPageAdmin: true,
                message: message,
            },
            qos: 1,
        });

        publisMessage({
            topic: `sc/facebook/page/webhook/${config.scFacebookName}`,
            payload: {
                type: 'sc.facebook.message',
                pageId,
                pageToken,
                mid: messageId,
                conversationId,
                created_date,
                username,
            },
            qos: 2,
        });

        return new ServiceResponse(true, 'ok', 'ok');
    } catch (e) {
        logger.error(e, {
            function: 'saleChannelService.updateMessageFacebookUser',
        });
        return new ServiceResponse(false);
    }
};

const updatePageAvatar = async (bodyParams = {}) => {
    try {
        const url = apiHelper.getValueFromObject(bodyParams, 'url');
        let pageAvatar = null;
        try {
            pageAvatar = await fileHelper.downloadImgFB(url);
        } catch (error) {
            return new ServiceResponse(false, error.message);
        }
        if (!pageAvatar) return new ServiceResponse(false, 'Không lấy được hình ảnh của page!');
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PAGEID', apiHelper.getValueFromObject(bodyParams, 'page_id'))
            .input('PAGEAVATAR', `${config.domain_cdn}${pageAvatar}`)
            .execute('SC_PAGE_UpdateAvatar_AdminWeb');
        return new ServiceResponse(true, 'ok', 'ok');
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.updatePageAvatar'});
        return new ServiceResponse(false);
    }
};

const getListHashTag = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('SC_HASHTAG_GetAll_AdminWeb');
        return new ServiceResponse(true, 'ok', scclass.listHashTag(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getListHashTag'});
        return new ServiceResponse(false);
    }
};

const createHashTag = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('NAME', apiHelper.getValueFromObject(bodyParams, 'name'))
            .input('COLOR', apiHelper.getValueFromObject(bodyParams, 'color'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SC_HASHTAG_CreateOrUpdate_AdminWeb');
        return new ServiceResponse(true, 'ok', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.createHashTag'});
        return new ServiceResponse(false);
    }
};

const updateHashTag = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ID', apiHelper.getValueFromObject(bodyParams, 'hash_tag_id'))
            .input('COLOR', apiHelper.getValueFromObject(bodyParams, 'color'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SC_HASHTAG_CreateOrUpdate_AdminWeb');
        return new ServiceResponse(true, 'ok', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.updateHashTag'});
        return new ServiceResponse(false);
    }
};

const deleteHashTag = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('HASHTAGID', apiHelper.getValueFromObject(params, 'hash_tag_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute('SC_HASHTAG_Delete_AdminWeb');
        return new ServiceResponse(true, 'ok', 'ok');
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.deleteHashTag'});
        return new ServiceResponse(false);
    }
};

const getListHashTagFacebookUser = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .execute('SC_USER_HASHTAG_GetList_AdminWeb');
        return new ServiceResponse(true, 'ok', scclass.listHashTag(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'saleChannelService.getListHashTagFacebookUser',
        });
        return new ServiceResponse(false);
    }
};

const createOrUpdateHashTagFacebookUser = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(bodyParams, 'user_id'))
            .input('HASHTAGID', apiHelper.getValueFromObject(bodyParams, 'hash_tag_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISTAG', apiHelper.getValueFromObject(bodyParams, 'is_tag'))
            .execute('SC_USER_HASHTAG_CreateOrUpdate_AdminWeb');
        return new ServiceResponse(true, 'ok', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, {
            function: 'saleChannelService.createOrUpdateHashTagFacebookUser',
        });
        return new ServiceResponse(false);
    }
};

const getListNoteFacebookUser = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .execute('SC_USER_NOTE_GetList_AdminWeb');
        return new ServiceResponse(true, 'ok', scclass.listNote(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.getListNoteFacebookUser'});
        return new ServiceResponse(false);
    }
};

const createNoteFacebookUser = async (bodyParams = {}) => {
    try {
        const note = apiHelper.getValueFromObject(bodyParams, 'note');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(bodyParams, 'user_id'))
            .input('NOTE', note)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SC_USER_NOTE_Create_AdminWeb');
        return new ServiceResponse(true, 'ok', {
            id: data.recordset[0].RESULT,
            note,
            created_date: moment().format('DD/MM/YYYY HH:mm'),
        });
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.createNoteFacebookUser'});
        return new ServiceResponse(false);
    }
};

const deleteNoteFacebookUser = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(bodyParams, 'user_id'))
            .input('NOTEID', apiHelper.getValueFromObject(bodyParams, 'note_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SC_USER_NOTE_Delete_AdminWeb');
        return new ServiceResponse(true, 'ok', 'ok');
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.deleteNoteFacebookUser'});
        return new ServiceResponse(false);
    }
};

const getListOrderFacebookUser = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .execute('SC_USER_ORDER_GetList_AdminWeb');
        return new ServiceResponse(true, 'ok', {
            total_order: data.recordset && data.recordset.length ? data.recordset[0].TOTALORDER : 0,
            orders: scclass.listOrder(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'saleChannelService.getListOrderFacebookUser',
        });
        return new ServiceResponse(false);
    }
};

// Lấy all thông tin của user bao gồm : đơn hàng, thông tin cá nhân, ghi chú và hash tag
const detailFacebookUser = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id'))
            .input('PAGEID', apiHelper.getValueFromObject(queryParams, 'page_id'))
            .execute('SC_USER_GetById_AdminWeb');
        return new ServiceResponse(true, 'ok', {
            info: scclass.infoUser(data.recordset[0]),
            orders: {
                total: data.recordsets[1] && data.recordsets[1].length ? data.recordsets[1][0].TOTALORDER : 0,
                list: scclass.listOrder(data.recordsets[1]),
            },
            notes: scclass.listNote(data.recordsets[2]),
            hash_tags: scclass.listHashTag(data.recordsets[3]),
        });
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.detailFacebookUser'});
        return new ServiceResponse(false);
    }
};

const updateFacebookUser = async (bodyParams = {}) => {
    try {
        // Cap nhat thong tin
        const pool = await mssql.pool;
        const userReq = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(bodyParams, 'user_id'))
            .input('PAGEID', apiHelper.getValueFromObject(bodyParams, 'page_id'))
            .input('FULLNAME', apiHelper.getValueFromObject(bodyParams, 'full_name'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(bodyParams, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(bodyParams, 'email'))
            .input('COUNTRYID', apiHelper.getValueFromObject(bodyParams, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(bodyParams, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(bodyParams, 'district_id'))
            .input('BIRTHDAY', apiHelper.getValueFromObject(bodyParams, 'dob'))
            .input('WARDID', apiHelper.getValueFromObject(bodyParams, 'ward_id'))
            .input('ADDRESS', apiHelper.getValueFromObject(bodyParams, 'address'))
            .input('GENDER', apiHelper.getValueFromObject(bodyParams, 'gender'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SC_USER_CreateOrUpdate_AdminWeb');
        const {RESULT, MEMBERID, FULLNAME} = userReq.recordset[0];

        if (RESULT == -1) {
            // Đã tồn tại người dùng
            return new ServiceResponse(false, 'Số điện thoại đã được sử dụng!');
        } else if (RESULT == 0) {
            // Đã tồn tại người dùng với số điện thoại có muốn cập nhật không
            return new ServiceResponse(true, 'ok', {
                member_id: MEMBERID,
                full_name: FULLNAME,
                is_exist: 1,
            });
        }
        // Lấy thông tin của người dùng
        const data = await pool
            .request()
            .input('USERID', apiHelper.getValueFromObject(bodyParams, 'user_id'))
            .input('PAGEID', apiHelper.getValueFromObject(bodyParams, 'page_id'))
            .execute('SC_USER_GetInfo_AdminWeb');

        return new ServiceResponse(true, 'ok', scclass.infoUser(data.recordset[0]));
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.updateFacebookUser'});
        return new ServiceResponse(false);
    }
};

const getListProduct = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('MODELID', apiHelper.getValueFromObject(queryParams, 'model_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(queryParams, 'product_category_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SC_USER_ORDER_GetListProduct_AdminWeb');
        return new ServiceResponse(true, '', {
            data: scclass.listProduct(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'saleChannelService.getListProduct',
        });
        return new ServiceResponse(true, '', {});
    }
};

const searchProduct = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .execute('SC_USER_ORDER_SearchProduct_AdminWeb');
        return new ServiceResponse(true, '', scclass.optionsSearchProduct(data.recordset));
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.searchProduct'});
        return new ServiceResponse(true, '', []);
    }
};

const detailProduct = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SC_USER_ORDER_GetProductById_AdminWeb');
        return new ServiceResponse(true, '', scclass.listProduct(data.recordset[0]));
    } catch (e) {
        logger.error(e, {function: 'saleChannelService.detailProduct'});
        return new ServiceResponse(true, '', {});
    }
};

const getListPromotion = async (bodyParams = {}) => {
    try {
        const order_details = apiHelper.getValueFromObject(bodyParams, 'items');
        if (!order_details || !order_details.length) return new ServiceResponse(true, 'ok', []);
        const pool = await mssql.pool;
        // Lay danh sach khuyen mai con han su dung
        const dataPromotion = await pool.request().execute('SC_USER_ORDER_GetListPromotion_AdminWeb');
        const promotions = scclass.promotions(dataPromotion.recordset);
        const productApply = scclass.productApplyPromotion(dataPromotion.recordsets[1]);
        const offers = scclass.offers(dataPromotion.recordsets[2]);
        const gifts = scclass.gift(dataPromotion.recordsets[3]);
        const productCategoryApply = scclass.productCategoryApplyPromotion(dataPromotion.recordsets[4]);

        // Filter cap nhat lai danh sach san pham ap dung tren tung ct khuyen mai neu co
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let product_apply = (productApply || []).filter(p => p.promotion_id == promotion.promotion_id);
            let product_category_apply = (productCategoryApply || []).filter(
                p => p.promotion_id == promotion.promotion_id,
            );
            promotions[i].product_apply = product_apply || [];
            promotions[i].product_category_apply = product_category_apply || [];
        }
        // Filter cap nhat lai danh sach uu dai tren khuyen mai
        for (let i = 0; i < promotions.length; i++) {
            let promotion = promotions[i];
            let _offers = (offers || []).filter(p => p.promotion_id == promotion.promotion_id);
            for (let j = 0; j < _offers.length; j++) {
                const {is_fixed_gift, promotion_offer_id} = _offers[j];
                // Neu co qua tang thi lay danh sach qua tang
                if (is_fixed_gift) {
                    _offers[j].gifts = (gifts || []).filter(v => v.promotion_offer_id == promotion_offer_id);
                }
            }
            promotions[i].offers = _offers || [];
        }

        // Tinh tong so tien cua tung san pham trong don hang
        // Chi lay cac san pham trong don hang co gia
        let sub_total = 0;
        let total_quantity = 0;
        // Bỏ qua các sản phẩm là quà tặng
        (order_details || [])
            .filter(v => v.price && !v.is_gift)
            .forEach(item => {
                sub_total += item.quantity * item.price;
                total_quantity += 1 * item.quantity;
            });
        //Duyêt danh sách khuyến mãi để check điều kiện
        let promotionApply = [];
        for (let k = 0; k < promotions.length; k++) {
            let promotion = promotions[k];
            let {
                is_apply_all_product,
                is_apply_product_category,
                is_promotion_by_price,
                from_price,
                to_price,
                is_promotion_by_total_money,
                min_promotion_total_money,
                max_promotion_total_money,
                is_promotion_by_total_quantity,
                min_promotion_total_quantity,
                max_promotion_total_quantity,
                is_combo_promotion,
                product_apply = [],
                product_category_apply = [],
            } = promotion || {};
            // Danh sach nganh hang ap dung va co check combo hay khong
            if (is_apply_product_category) {
                if (!product_category_apply.length) continue;
                if (is_combo_promotion) {
                    let product_category_apply_combo = (product_category_apply || []).filter(v => {
                        return (order_details || [])
                            .filter(v => !v.is_gift)
                            .find(x => x.product_category_id == v.product_category_id);
                    });
                    if (product_category_apply_combo.length != product_category_apply.length) {
                        continue;
                    }
                } else {
                    const checkProductCategory = order_details
                        .filter(v => !v.is_gift)
                        .filter(x => {
                            return product_category_apply.find(y => x.product_category_id == y.product_category_id);
                        });
                    if (!checkProductCategory.length) {
                        continue;
                    }
                }
            } else if (!is_apply_all_product) {
                //Danh sách sản phẩm áp dụng va co ap dung combo haykhong
                if (!product_apply.length) continue;
                if (is_combo_promotion) {
                    let product_apply_combo = (product_apply || []).filter(v => {
                        return (order_details || []).filter(v => !v.is_gift).find(x => x.product_id == v.product_id);
                    });
                    if (product_apply_combo.length != product_apply.length) {
                        continue;
                    }
                } else {
                    const checkProduct = order_details
                        .filter(v => !v.is_gift)
                        .filter(x => {
                            return product_apply.find(y => x.product_id == y.product_id);
                        });
                    if (!checkProduct.length) {
                        continue;
                    }
                }
            }

            // Kiem tra số tiền Khuyến mại theo mức giá
            if (is_promotion_by_price) {
                const checkProduct = order_details
                    .filter(v => !v.is_gift)
                    .filter(x => {
                        return x.price < from_price || x.price > to_price;
                    });
                if (checkProduct.length) {
                    continue;
                }
            }

            //Kiểm tra Khuyến mại trên tổng tiền
            if (
                is_promotion_by_total_money &&
                (sub_total < min_promotion_total_money || sub_total > max_promotion_total_money)
            ) {
                continue;
            }

            //Kiểm tra số lượng tối thiểu
            if (
                is_promotion_by_total_quantity &&
                (total_quantity < min_promotion_total_quantity || total_quantity > max_promotion_total_quantity)
            ) {
                continue;
            }

            promotionApply.push(promotion);
        }
        // Tính giá trị được uu đãi trên từng promotion
        const promotionApplyOffer = calcPromotionDiscount(order_details, sub_total, promotionApply);
        return new ServiceResponse(true, '', promotionApplyOffer);
    } catch (e) {
        logger.error(e, {function: 'orderService.getListPromotion'});
        return new ServiceResponse(true, '', []);
    }
};

// Tính số tiền được giảm trên từng ưu đãi trong các chương trình khuyến mãi
const calcPromotionDiscount = (items, totalMoney, promotionApply) => {
    // Duyệt các chương trình thỏa điều kiện
    for (let i = 0; i < promotionApply.length; i++) {
        const {offers, is_apply_order} = promotionApply[i];
        for (let j = 0; j < offers.length; j++) {
            const offer = offers[j];
            // Tính giá được khuyên mãi trên tổng đơn hàng hay tren từng sản phẩm
            // Nếu km áp dụng trên đơn hàng thì tính giá trị discount
            // Ngược lại nếu không tính trên đơn hàng thì tính offer discoung trên từng sản phẩm xem giá tri được bao nhiêu
            promotionApply[i]['offers'][j].discount = is_apply_order ? calcPromotionApplyOrder(offer, totalMoney) : 0;
            if (!is_apply_order) {
                promotionApply[i]['offers'][j].offer_product = calcPromotionApplyProduct(
                    offer,
                    items,
                    promotionApply[i],
                );
            }
        }
    }
    return promotionApply;
};

// Tính giảm giá trên đơn hàng
const calcPromotionApplyOrder = (offer, totalMoney) => {
    let discount = 0;
    const {is_fix_price = 0, is_percent_discount = 0, is_discount_by_set_price = 0, discount_value = 0} = offer;
    // Nếu là giảm giá trực tiếp là giá được km
    if (is_discount_by_set_price) {
        discount += discount_value;
    }
    // Nếu giảm giá % thì sẽ tính giá trị giảm trên % tổng đơn hàng
    else if (is_percent_discount) {
        discount += ((totalMoney * discount_value * 1) / 100).toFixed(2);
    }
    // Giảm giá cứng: KM = tổng giá trị đơn hàng - giảm giá cứng
    else if (is_fix_price) {
        const fixDiscountPrice = totalMoney - discount_value;
        if (fixDiscountPrice <= 0) discount = 0;
        else discount = fixDiscountPrice;
    }
    return discount;
};

// Tính giảm giá trên từng sản phẩm trong đơn hàng
const calcPromotionApplyProduct = (offer, products, promotion = {}) => {
    const {
        is_apply_all_product,
        is_apply_product_category,
        product_apply = [],
        product_category_apply = [],
    } = promotion;
    // Sẽ trả về offer theo từng sản phẩm hình thức xuất trong đơn hàng
    let offer_product = [];
    for (let i = 0; i < products.length; i++) {
        const {
            quantity = 0,
            price = 0,
            product_output_type_id,
            product_unit_id,
            product_id,
            product_category_id,
        } = products[i];
        const {is_fix_price = 0, is_percent_discount = 0, is_discount_by_set_price = 0, discount_value = 0} = offer;
        let discount = 0;
        // Kiểm tra xem sản phẩm nào thỏa điều kiện thì sẽ tính giảm giá cho sp đó
        if (
            is_apply_all_product ||
            (is_apply_product_category &&
                product_category_apply.findIndex(x => x.product_category_id == product_category_id) >= 0) ||
            product_apply.findIndex(k => k.product_id == product_id) >= 0
        ) {
            // Nếu là giảm giá trực tiếp là giá được km
            if (is_discount_by_set_price) {
                discount = discount_value * quantity * 1;
            }
            // Nếu giảm giá % thì sẽ tính giá trị giảm trên % tổng đơn hàng
            else if (is_percent_discount) {
                discount = parseFloat(`${(((price * discount_value * 1) / 100) * quantity).toFixed(2)}`);
            }
            // Giảm giá cứng: KM = tổng giá trị đơn hàng - giảm giá cứng
            else if (is_fix_price) {
                const fixDiscountPrice = price - discount_value;
                if (fixDiscountPrice <= 0) discount += 0;
                else discount = parseFloat(`${(fixDiscountPrice * quantity * 1).toFixed(2)}`);
            }
            // Set gia tri khuyen mai cho san pham do
            offer_product.push({
                discount,
                product_id,
                product_category_id,
                product_output_type_id,
                product_unit_id,
            });
        }
    }
    return offer_product;
};

const createOrderFacebookUser = async bodyParams => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const items = apiHelper.getValueFromObject(bodyParams, 'items');
        const customer = apiHelper.getValueFromObject(bodyParams, 'customer');

        await transaction.begin();
        const requestCreateOrUpdateOrder = new sql.Request(transaction);
        const data = await requestCreateOrUpdateOrder
            .input('ORDERID', apiHelper.getValueFromObject(bodyParams, 'order_id'))
            .input('USERID', apiHelper.getValueFromObject(customer, 'user_id'))
            .input('TOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'total_money'))
            .input('TOTALDISCOUNT', apiHelper.getValueFromObject(bodyParams, 'total_discount'))
            .input('SUBTOTAL', apiHelper.getValueFromObject(bodyParams, 'total_money'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('PREMONEY', apiHelper.getValueFromObject(bodyParams, 'pre_money'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('FULLNAME', apiHelper.getValueFromObject(customer, 'full_name'))
            .input('PHONENUMBER', apiHelper.getValueFromObject(customer, 'phone_number'))
            .input('EMAIL', apiHelper.getValueFromObject(customer, 'email'))
            .input('COUNTRYID', apiHelper.getValueFromObject(customer, 'country_id'))
            .input('PROVINCEID', apiHelper.getValueFromObject(customer, 'province_id'))
            .input('DISTRICTID', apiHelper.getValueFromObject(customer, 'district_id'))
            .input('WARDID', apiHelper.getValueFromObject(customer, 'ward_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(customer, 'stocks_id'))
            .input('ADDRESS', apiHelper.getValueFromObject(customer, 'address'))
            .input('ORDERSOURCE', 4)
            .input('PAGEID', apiHelper.getValueFromObject(bodyParams, 'page_id'))
            .input('MEMBERID', apiHelper.getValueFromObject(customer, 'member_id'))
            .input('ADDRESSID', apiHelper.getValueFromObject(customer, 'address_id'))
            .execute('SC_USER_ORDER_Create_AdminWeb');
        const {RESULT: orderId, ORDERNO, TOTALMONEY} = data.recordset[0];

        if (orderId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo đơn hàng không thành công!');
        }

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            const {price = 0, quantity = 1} = item;
            const requestOrderDetailCreate = new sql.Request(transaction);
            const dataOrderDetailCreate = await requestOrderDetailCreate
                .input('ORDERID', orderId)
                .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                .input('TOTALPRICE', sql.Money, 1 * price * quantity)
                .input('TOTALAMOUNT', sql.Money, 1 * price * quantity)
                .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity', 0, true))
                .input('PRICE', 1 * apiHelper.getValueFromObject(item, 'price'))
                .input('CHANGEPRICE', apiHelper.getValueFromObject(item, 'price', 0))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .input('ISPROMOTIONGIFT', apiHelper.getValueFromObject(item, 'is_gift'))
                .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
                .input('AREAID', apiHelper.getValueFromObject(item, 'area_id'))
                .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
                .execute('SC_USER_ORDER_CreateOrderDetail_AdminWeb');
            const {RESULT} = dataOrderDetailCreate.recordset[0];
            const orderDetailId = RESULT;
            if (orderDetailId <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, e.message);
            }
        }
        // Luu gia khuyen mai ap dung
        const promotions = apiHelper.getValueFromObject(bodyParams, 'promotion_apply');
        if (promotions && promotions.length) {
            for (let i = 0; i < promotions.length; i++) {
                let {offers = []} = promotions[i];
                offers = offers.filter(o => o.is_picked);
                if (offers.length) {
                    for (let j = 0; j < offers.length; j++) {
                        let {gifts = []} = offers[j];
                        gifts = gifts.filter(g => g.is_picked && g.quantity > 0);
                        if (gifts.length) {
                            for (let k = 0; k < gifts.length; k++) {
                                const requestPromotionCreate = new sql.Request(transaction);
                                const dataPromotionCreate = await requestPromotionCreate
                                    .input('ORDERID', orderId)
                                    .input('PRODUCTID', apiHelper.getValueFromObject(gifts[k], 'product_id'))
                                    .input('PROMOTIONID', apiHelper.getValueFromObject(offers[j], 'promotion_id'))
                                    .input(
                                        'PROMOTIONOFFERAPPLYID',
                                        apiHelper.getValueFromObject(offers[j], 'promotion_offer_id'),
                                    )
                                    .input('QUANTITY', apiHelper.getValueFromObject(gifts[k], 'quantity', 0, true))
                                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                    .execute('SM_PROMOTION_ORDER_CreateOrUpdate_AdminWeb');
                                const {RESULT} = dataPromotionCreate.recordset[0];
                                if (!RESULT) {
                                    await transaction.rollback();
                                    return new ServiceResponse(false, 'Thêm mới khuyến mãi thất bại.');
                                }
                            }
                        } else {
                            const requestPromotionCreate = new sql.Request(transaction);
                            const dataPromotionCreate = await requestPromotionCreate
                                .input('ORDERID', orderId)
                                .input('PROMOTIONID', apiHelper.getValueFromObject(offers[j], 'promotion_id'))
                                .input(
                                    'PROMOTIONOFFERAPPLYID',
                                    apiHelper.getValueFromObject(offers[j], 'promotion_offer_id'),
                                )
                                .input('DISCOUNTVALUE', apiHelper.getValueFromObject(offers[j], 'discount', 0))
                                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                .execute('SM_PROMOTION_ORDER_CreateOrUpdate_AdminWeb');
                            const {RESULT} = dataPromotionCreate.recordset[0];
                            if (!RESULT) {
                                await transaction.rollback();
                                return new ServiceResponse(false, 'Thêm mới khuyến mãi thất bại.');
                            }
                        }
                    }
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(
            true,
            'update success',
            `
                Đơn hàng #${ORDERNO} của khách hàng đã được tạo thành công.
                Tổng giá trị đơn hàng là ${numberFormatHelper.toPrice(TOTALMONEY)}. Cám ơn quý khách đã đặt hàng.`,
        );
    } catch (e) {
        await transaction.rollback();
        logger.error(e, {function: 'saleChannelService.createOrderFacebookUser'});
        return new ServiceResponse(false, e.message);
    }
};

const getListFileByConversationId = async (queryParams = {}) => {
    try {
        const typeFile = apiHelper.getValueFromObject(queryParams, 'type_file');
        const conversationId = apiHelper.getValueFromObject(queryParams, 'conversation_id');
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CONVERSATIONID', conversationId)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            //.input('TYPEFILE', typeFile)
            .execute('SC_PAGE_CONVERSATIONS_MESSAGES_ATTACHMENTS_GetByConversationId');
        return new ServiceResponse(true, '', {
            image: scclass.listAttachmentByConversationId(data.recordsets[0]),
            file: scclass.listAttachmentByConversationId(data.recordsets[1]),
            //page: currentPage,
            //limit: itemsPerPage,
            //total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {
            function: 'saleChannelService.getListProduct',
        });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getUserStatus,
    getUserToken,
    syncFacebookData,
    getListPage,
    getListPageToSync,
    getListPageConnect,
    syncPageData,
    deletePageConnect,
    getListConversation,
    getPageAccessToken,
    updatePageAvatar,
    detailFacebookUser,
    deleteFacebookUser,
    getMessageFacebookUser,
    sendMessageFacebookUser,
    updateMessageFacebookUser,
    getListHashTag,
    createHashTag,
    deleteHashTag,
    updateHashTag,
    getListHashTagFacebookUser,
    createOrUpdateHashTagFacebookUser,
    getListNoteFacebookUser,
    getListNoteFacebookUser,
    createNoteFacebookUser,
    deleteNoteFacebookUser,
    getListOrderFacebookUser,
    updateFacebookUser,
    getListProduct,
    searchProduct,
    detailProduct,
    getListPromotion,
    createOrderFacebookUser,
    getListFileByConversationId,
    getMessageFacebookLive,
    syncPageDataNew,
};
