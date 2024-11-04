const moduleClass = require('./chatbox.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const mongoose = require('mongoose');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const stringHelper = require('../../common/helpers/string.helper');
const fileHelper = require('../../common/helpers/file.helper');
const _ = require('lodash');
const Message = require('./models/message.model');

const createGroupConversation = async bodyParams => {
    try {
        const pool = await mssql.pool;

        const avatar = apiHelper.getValueFromObject(bodyParams, 'avatar', '');
        if (fileHelper.isBase64(avatar)) {
            const avatarUrl = await fileHelper.saveBase64(avatar);
            bodyParams.avatar_url = avatarUrl;
        }

        const password = apiHelper.getValueFromObject(bodyParams, 'password', '');
        const passwordHash = password ? stringHelper.encryptChatPassword(password) : '';

        let user_list = apiHelper.getValueFromObject(bodyParams, 'user_list', []);
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name', '');
        user_list = user_list.filter(username => username !== auth_name);

        const data = await pool
            .request()
            .input('CONVERSATIONNAME', apiHelper.getValueFromObject(bodyParams, 'conversation_name', ''))
            .input('AVATARURL', apiHelper.getValueFromObject(bodyParams, 'avatar_url', ''))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', ''))
            .input('PASSWORD', passwordHash)
            .input('USERLIST', user_list)
            .input('CREATEDUSER', auth_name)
            .execute('CO_CONVERSATION_CreateGroup_App');

        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, {function: 'chatboxService.createGroupConversation'});
        return new ServiceResponse(false, RESPONSE_MSG.ERROR_500, {});
    }
};

const addGroupParticipant = async bodyParams => {
    try {
        const pool = await mssql.pool;

        const conversation_id = apiHelper.getValueFromObject(bodyParams, 'conversation_id', 0);
        const user_list = apiHelper.getValueFromObject(bodyParams, 'user_list', []);

        const data = await pool
            .request()
            .input('CONVERSATIONID', conversation_id)
            .input('USERLIST', user_list)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', ''))
            .execute('CO_CONVERSATION_PARTICIPANT_Add_App');

        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, {function: 'chatboxService.addGroupParticipant'});
        return new ServiceResponse(false, RESPONSE_MSG.ERROR_500, {});
    }
};

const pinConversation = async bodyParams => {
    try {
        const pool = await mssql.pool;

        const cs_participant_id = apiHelper.getValueFromObject(bodyParams, 'cs_participant_id');
        const is_pin = apiHelper.getValueFromObject(bodyParams, 'is_pin', 0);

        const data = await pool
            .request()
            .input('CSPARTICIPANTID', cs_participant_id)
            .input('ISPIN', is_pin)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', ''))
            .execute('CO_CONVERSATION_PARTICIPANT_Pin_App');

        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, {function: 'chatboxService.pinConversation'});
        return new ServiceResponse(false, RESPONSE_MSG.ERROR_500, {});
    }
};

const getConversationList = async queryParams => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search', '').trim();

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name', ''))
            .execute('CO_CONVERSATION_GetList_App');

        return new ServiceResponse(true, '', {
            data: moduleClass.conversationList(data.recordsets[1]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, {function: 'chatboxService.getConversationList'});

        return new ServiceResponse(false, e.message, e);
    }
};

const updateConversation = async bodyParams => {
    try {
        const pool = await mssql.pool;

        const avatar = apiHelper.getValueFromObject(bodyParams, 'avatar', '');
        if (fileHelper.isBase64(avatar)) {
            const avatarUrl = await fileHelper.saveBase64(avatar);
            bodyParams.avatar_url = avatarUrl;
        }

        const password = apiHelper.getValueFromObject(bodyParams, 'password', '');
        const passwordHash = password ? stringHelper.encryptChatPassword(password) : '';

        const data = await pool
            .request()
            .input('CONVERSATIONID', apiHelper.getValueFromObject(bodyParams, 'conversation_id', 0))
            .input('CONVERSATIONNAME', apiHelper.getValueFromObject(bodyParams, 'conversation_name', ''))
            .input('AVATARURL', apiHelper.getValueFromObject(bodyParams, 'avatar_url', ''))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', ''))
            .input('PASSWORD', passwordHash)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', ''))
            .execute('CO_CONVERSATION_Update_App');

        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, {function: 'chatboxService.updateConversation'});

        return new ServiceResponse(false, e.message, e);
    }
};

const sendMessage = async (body, files, auth) => {
    try {
        const pool = await mssql.pool;
        const bodyParams = JSON.parse(JSON.stringify({...body, ...auth}));

        let conversation_id = apiHelper.getValueFromObject(bodyParams, 'conversation_id', 0);
        let messageText = apiHelper.getValueFromObject(bodyParams, 'message', '').trim();
        let parent_id = apiHelper.getValueFromObject(bodyParams, 'parent_id', null);
        parent_id = parent_id ? new mongoose.Types.ObjectId(parent_id) : null;
        const created_user = apiHelper.getValueFromObject(bodyParams, 'user_name', '');
        const username = apiHelper.getValueFromObject(bodyParams, 'username', '').trim();

        if (created_user === username) {
            return new ServiceResponse(false, 'Không thể tự nhắn tin cho chính mình', {});
        }

        // create conversation if not exist
        if (conversation_id === 0) {
            const resData = await pool
                .request()
                .input('USERNAME', username)
                .input('CREATEDUSER', created_user)
                .execute('CO_CONVERSATION_CreateUser_App');

            conversation_id = resData.recordset[0].RESULT;
        }

        // check conversation participant
        await pool
            .request()
            .input('CONVERSATIONID', conversation_id)
            .input('USERNAME', username)
            .execute('CO_CONVERSATION_PARTICIPANT_Check_App');

        // check parent_id
        if (parent_id) {
            const findRes = await Message.exists({
                cId: conversation_id,
                _id: parent_id,
            });

            if (!findRes) {
                return new ServiceResponse(false, 'Tin nhắn trả lời không hợp lệ', {});
            }
        }

        //save files
        const fileList = [];
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.buffer) {
                    const fileUrl = await fileHelper.saveFileV2(file);
                    fileList.push({
                        name: file.originalname,
                        path: fileUrl,
                    });
                }
            }
        }

        // check message
        if (!Boolean(messageText) && fileList.length === 0) {
            return new ServiceResponse(false, 'Tin nhắn không hợp lệ', {});
        }

        // update lastest message to conversation
        await pool
            .request()
            .input('CONVERSATIONID', conversation_id)
            .input(
                'LATESTMESSAGE',
                fileList.length > 0 ? `@${created_user}@ vừa gửi ${fileList.length} file` : messageText,
            )
            .input('UPDATEDUSER', created_user)
            .execute('CO_CONVERSATION_UpdateLastestMessage_App');

        // save message
        const message = await Message.create({
            cId: conversation_id,
            message: fileList.length > 0 ? {files: fileList} : {text: messageText},
            parentId: parent_id,
            createdUser: created_user,
        });

        return new ServiceResponse(true, '', message);
    } catch (e) {
        logger.error(e, {function: 'chatboxService.sendMessage'});

        return new ServiceResponse(false, e.message, e);
    }
};

const getMessageList = async queryParams => {
    try {
        const pool = await mssql.pool;

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const conversation_id = apiHelper.getValueFromObject(queryParams, 'conversation_id', 0);
        const auth_name = apiHelper.getValueFromObject(queryParams, 'auth_name', '');

        const participantRes = await pool
            .request()
            .input('CONVERSATIONID', conversation_id)
            .execute('CO_CONVERSATION_PARTICIPANT_GetList_App');

        const participantList = moduleClass.participantList(participantRes.recordset);

        const query = {
            cId: conversation_id,
        };

        const options = {
            page: currentPage,
            limit: itemsPerPage,
            sort: {createdAt: -1},
        };

        const messageRes = await Message.paginate(query, options);

        return new ServiceResponse(true, '', {
            data: moduleClass.messageList(messageRes.docs, participantList, auth_name),
            page: currentPage,
            limit: itemsPerPage,
            total: messageRes.totalDocs,
        });
    } catch (e) {
        logger.error(e, {function: 'chatboxService.getMessageList'});

        return new ServiceResponse(false, e.message, e);
    }
};

module.exports = {
    createGroupConversation,
    addGroupParticipant,
    pinConversation,
    getConversationList,
    updateConversation,
    sendMessage,
    getMessageList,
};
