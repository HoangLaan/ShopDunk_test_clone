const announceClass = require('./announce.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const { STORE_ANNOUNCECOMMENT } = require('./constant');

const getListAnnounce = async (user_name = 0, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const search = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', search)
            .execute(PROCEDURE_NAME.SYS_ANNOUNCE_GETLIST_APP);
        const announces = announceClass.list(data.recordsets[1]);

        announces.forEach(el => {
            let announce_content = el.announce_content;
            // announce_content = announce_content.replace(/(<([^>]+)>)/gi, '');
            announce_content = announce_content.substr(0, 99);
            if (el.announce_content.length > 100) announce_content += '...';
            el.announce_content = announce_content;
        });

        return new ServiceResponse(true, '', {
            data: announces,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'announceService.getListAnnounce' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (user_name = 0, queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .input('ANNOUNCEID', apiHelper.getValueFromObject(queryParams, 'announce_id'))
            .execute(PROCEDURE_NAME.SYS_ANNOUNCE_GETBYID_APP);

        if (!data.recordset.length) return new ServiceResponse(true, '', {});

        const announce = announceClass.detail(data.recordsets[0][0]);

        // ATTACHMENT
        announce.attachment = data.recordsets[1].length ? announceClass.attachment(data.recordsets[1]) : [];

        announce.attachment.forEach(el => {
            el.attachment_extension = el.attachment_path.split(/[#?]/)[0].split('.').pop().trim();
        });

        return new ServiceResponse(true, '', announce);
    } catch (e) {
        logger.error(e, { function: 'announceService.getById' });
        return new ServiceResponse(false, e.message);
    }
};

const getListUserView = async announceId => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ANNOUNCEID', announceId)
            .execute(PROCEDURE_NAME.SYS_ANNOUNCE_USERVIEW_GETLISTUSERVIEW_APP);

        const userView = announceClass.listUserView(data.recordset);

        return new ServiceResponse(true, 'success', userView);
    } catch (e) {
        logger.error(e, { function: 'announceService.getListUserView' });
        return new ServiceResponse(false, e.message);
    }
};

const getTotalUnreadByUsername = async user_name => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .execute(PROCEDURE_NAME.SYS_ANNOUNCE_USERVIEW_GETTOTALUNREADBYUSERNAME_APP);
        return new ServiceResponse(true, '', {
            total_unread: res.recordset.length ? res.recordset[0].TOTALUNREAD : 0,
        });
    } catch (e) {
        logger.error(e, { function: 'announceService.getTotalUnreadByUsername' });
        return new ServiceResponse(false, e.message);
    }
};

const createUserView = async (user_name, announce_id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', user_name)
            .input('ANNOUNCEID', announce_id)
            .execute('SYS_ANNOUNCE_USERVIEW_CREATE_APP');
        return new ServiceResponse(true, res.recordset[0].RESULT, {}, '');
    } catch (e) {
        logger.error(e, { function: 'announceService.getTotalUnreadByUsername' });
        return new ServiceResponse(false, e.message);
    }
};

// comment

const getListAnnounceComment = async (bodyParams = {}, queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('ANNOUNCEID', apiHelper.getValueFromObject(queryParams, 'announce_id'))
            .input('COMMENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(STORE_ANNOUNCECOMMENT.ANNOUCECOMMNENT_GETLIST);

        let listCommentParent =
            resData.recordsets && resData.recordsets.length > 0 ? announceClass.commentList(resData.recordsets[1]) : [];

        const listCommentReply =
            resData.recordsets && resData.recordsets.length > 0
                ? announceClass.replyCommentList(resData.recordsets[2])
                : [];

        listCommentParent = listCommentParent.map(commentParent => {
            commentParent.reply = listCommentReply.filter(
                commentReply => commentReply.reply_comment_id === commentParent.comment_id,
            );
            return commentParent;
        });

        return new ServiceResponse(true, '', listCommentParent);
    } catch (e) {
        logger.error(e, { function: 'announceService.getListAnnounceComment' });
        return new ServiceResponse(true, '', {});
    }
};

const getListReplyComment = async (bodyParams = {}, queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('REPLYCOMMENTID', apiHelper.getValueFromObject(queryParams, 'reply_comment_id'))
            .input('COMMENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(STORE_ANNOUNCECOMMENT.ANNOUCECOMMNENT_GETREPLYLIST);

        const listCommentReply =
            resData.recordsets && resData.recordsets.length > 0
                ? announceClass.replyCommentList(resData.recordsets[1])
                : [];

        return new ServiceResponse(true, '', listCommentReply);
    } catch (e) {
        logger.error(e, { function: 'announceService.getListAnnounceComment' });
        return new ServiceResponse(true, '', {});
    }
};

const createAnnounceCommentOrUpdate = async (bodyParams, file, auth) => {
    let obj = {
        comment_id: apiHelper.getValueFromObject(bodyParams, 'comment_id'),
        comment_content: apiHelper.getValueFromObject(bodyParams, 'comment_content'),
        reply_comment_id: apiHelper.getValueFromObject(bodyParams, 'reply_comment_id'),
        username: apiHelper.getValueFromObject(auth, 'user_name'),
        announce_id: apiHelper.getValueFromObject(bodyParams, 'announce_id'),
        is_active: 1,
        image: file,
    };

    try {
        if (obj.image) {
            if (typeof obj.image === 'string' && obj.image.includes(config.domain_cdn)) {
                obj.image = obj.image.replace(config.domain_cdn, '');
            } else if (typeof obj.image === 'object') {
                const imageRes = await fileHelper.uploadFile([obj.image]);
                obj.image = imageRes?.data?.[0]?.file;
            }
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMMENTANNOUNCEID', obj.comment_id)
            .input('COMMENTCONTENT', obj.comment_content)
            .input('REPLYTOCOMMENTID', obj.reply_comment_id)
            .input('COMMENTUSER', obj.username)
            .input('ANNOUNCEID', obj.announce_id)
            .input('ISACTIVE', obj.is_active)
            .input('URLIMAGE', obj.image)
            .execute(STORE_ANNOUNCECOMMENT.ANNOUCECOMMNENT_CREATEORUPDATE);

        let AnnounceCommentId = data.recordset && data.recordset.length > 0 ? data.recordset[0].RESULT : null;
        // let parentId = data.recordset && data.recordset.length > 0 ? data.recordset[0].REPLYTOCOMMENTID : null;
        let created_date = data.recordset && data.recordset.length > 0 ? data.recordset[0].CREATEDDATE : null;

        if (obj.image) {
            obj.image = config.domain_cdn + obj.image;
        }

        if (!AnnounceCommentId || !data.recordset) {
            return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
        }

        return new ServiceResponse(true, '', { ...obj, comment_id: AnnounceCommentId, created_date });
    } catch (e) {
        logger.error(e, { function: 'announceService.createAnnounceCommentOrUpdate' });
        // console.log(e.message)
        return new ServiceResponse(false, e.message);
    }
};

const likeOrDisLikeAnnounceComment = async bodyParams => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMMENTANNOUNCEID', apiHelper.getValueFromObject(bodyParams, 'comment_id'))
            .input('COMMENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISLIKE', apiHelper.getValueFromObject(bodyParams, 'is_like'))
            .execute(STORE_ANNOUNCECOMMENT.ANNOUCECOMMNENT_LIKE);

        let newsCommentId = data.recordset && data.recordset.length > 0 ? data.recordset[0].RESULT : null;

        return new ServiceResponse(true, '', newsCommentId);
    } catch (e) {
        logger.error(e, { function: 'announceService.likeOrDisLikeAnnounceComment' });
        return new ServiceResponse(false, e.message);
    }
};

const updateStatusAllAnnounceRead = async (user_name) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', user_name)
            .execute('SYS_ANNOUNCE_UpdateStatusAllRead_App');

        // Kiểm tra xem thủ tục có thành công hay không
        if (data.rowsAffected[0] === 0) {
            return new ServiceResponse(false, 'No announcements were updated');
        }

        return new ServiceResponse(true, 'Update status all announcements success', null);
    } catch (e) {
        logger.error(e, { function: 'announceService.updateStatusAllAnnounceRead' });
        return new ServiceResponse(false, e.message);
    }
};


module.exports = {
    getListAnnounce,
    getById,
    getListUserView,
    getTotalUnreadByUsername,
    createUserView,
    getListAnnounceComment,
    getListReplyComment,
    createAnnounceCommentOrUpdate,
    likeOrDisLikeAnnounceComment,
    updateStatusAllAnnounceRead,
};
