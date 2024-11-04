const newsCommentClass = require('./news-comment.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const folderName = 'news';
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const moment = require('moment');



const getListRelyComment = async (bodyParams = {}, queryParams = {}) => {
  try {

    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('REPLYCOMMENTID', apiHelper.getValueFromObject(queryParams, 'reply_comment_id'))
      .input('COMMENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('NEWS_NEWS_COMMENT_GetListReplyID_App');
    const listCommentReply = data.recordsets && data.recordsets.length > 0 ? newsCommentClass.listReply(data.recordsets[0]) : []
    const total = data && data.recordsets && data.recordsets.length > 0 && data.recordsets[1][0] ? data.recordsets[1][0].TOTAL : []

    return new ServiceResponse(true, '', {
      'data': listCommentReply,
      'page': currentPage,
      'limit': itemsPerPage,
      'total': total,
    });
  } catch (e) {
    logger.error(e, { 'function': 'newsCommentService.getListReplyComment' });
    return new ServiceResponse(true, '', {});
  }
};



const getListNewsComment = async (bodyParams = {}, queryParams = {}) => {
  try {

    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('NEWSID', apiHelper.getValueFromObject(queryParams, 'news_id'))
      .input('COMMENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('NEWS_NEWS_COMMENT_GetById_App');
    const result = data.recordset;
    const listCommentParent = data.recordsets && data.recordsets.length > 0 ? newsCommentClass.list(data.recordsets[2]) : []
    const listCommentReply = data.recordsets && data.recordsets.length > 0 ? newsCommentClass.listReply(data.recordsets[0]) : []

    let array = [...listCommentParent, ...listCommentReply]
    const getReplies = commentId => {
      return array.filter(backendComment => backendComment.reply_comment_id === commentId);
    };


    let arrayConvert = listCommentParent.map(comment => {
      return { ...comment, child: { parentId: comment.comment_id, totalReply: comment.totalReply, items: getReplies(comment.comment_id) } }
    })

    const total = data && data.recordsets && data.recordsets.length > 0 && data.recordsets[1][0] ? data.recordsets[1][0].TOTAL : 0
    return new ServiceResponse(true, '', {
      'data': arrayConvert,
      'parent': listCommentParent.length,
      'children': listCommentReply.length,
      'page': currentPage,
      'limit': itemsPerPage,
      'total': total,
    });
  } catch (e) {
    logger.error(e, { 'function': 'newsCommentService.getListNewsComment' });
    return new ServiceResponse(true, '', {});
  }
};

const detailNewsComment = async (CommentID) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('COMMENTID', CommentID)
      .execute("NEWS_NEWS_COMMENT_GetByCommentId_App");
    let result = newsCommentClass.detail(data.recordsets[0]);

    return new ServiceResponse(true, "", result);
  } catch (e) {
    logger.error(e, { 'function': 'newsCommentService.detailNewsComment' });
    return new ServiceResponse(false, e.message);
  }
};

const createNewsCommentOrUpdate = async (bodyParams) => {

  let obj = {
    comment_id: apiHelper.getValueFromObject(bodyParams, 'comment_id'),
    comment_content: apiHelper.getValueFromObject(bodyParams, 'comment_content'),
    reply_comment_id: apiHelper.getValueFromObject(bodyParams, 'reply_comment_id'),
    author: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
    news_id: apiHelper.getValueFromObject(bodyParams, 'news_id'),
    username: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
    created_user: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
    is_active: apiHelper.getValueFromObject(bodyParams, 'is_active'),
    image: apiHelper.getValueFromObject(bodyParams, 'image'),
    news_comment_like_id: null,
    is_like: null,
    created_date: null,
    avatar: null
  }

  try {
    if (obj.image) {
      if (obj.image.indexOf(config.domain_cdn)) {
        const imageRes = await fileHelper.saveBase64(obj.image);
        obj.image = imageRes
      }
      if (obj.image.includes(config.domain_cdn))
        obj.image = obj.image.replace(config.domain_cdn, "")
    }

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('COMMENTID', obj.comment_id)
      .input('COMMENTCONTENT', obj.comment_content)
      .input('REPLYTOCOMMENTID', obj.reply_comment_id)
      .input('COMMENTUSER', obj.author)
      .input('NEWSID', obj.news_id)
      .input('ISACTIVE', obj.is_active)
      .input('URLIMAGE', obj.image)
      .execute('NEWS_NEWS_COMMENT_CreateOrUpdate_App');
    let newsCommentId = data.recordset && data.recordset.length > 0 ? data.recordset[0].RESULT : null;
    let parentId = data.recordset && data.recordset.length > 0 ? data.recordset[0].REPLYTOCOMMENTID : null;
    let created_date = data.recordset && data.recordset.length > 0 ? data.recordset[0].CREATEDDATE : null;
    if (obj.image)
      obj.image = config.domain_cdn + obj.image
    if (!newsCommentId || !data.recordset) {
      return new ServiceResponse(false, RESPONSE_MSG.CRUD.CREATE_FAILED);
    }
    if (newsCommentId == 'ERROR_1') {
      return new ServiceResponse(false, 'Bạn không được phép chỉnh sửa');
    }

    return new ServiceResponse(true, '', { ...obj, comment_id: newsCommentId, created_date });
  } catch (e) {
    logger.error(e, { 'function': 'newsCommentService.createNewsCommentOrUpdate' });
    // console.log(e.message)
    return new ServiceResponse(false, e.message);
  }
};





const likeOrDisLikeNewsComment = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('NEWSCOMMENTID', apiHelper.getValueFromObject(bodyParams, 'comment_id'))
      .input('COMMENTUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('ISLIKE', apiHelper.getValueFromObject(bodyParams, 'is_like'))
      .execute('NEWS_NEWS_COMMENT_LIKE_CreateOrUpdate_App');

    let newsCommentId = data.recordset && data.recordset.length > 0 ? data.recordset[0].RESULT : null;

    return new ServiceResponse(true, '', newsCommentId);
  } catch (e) {
    logger.error(e, { 'function': 'newsCommentService.likeOrDisLikeNewsComment' });
    // console.log(e.message)
    return new ServiceResponse(false, e.message);
  }
};



const deleteNewsComment = async (CommentID, bodyParams) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('COMMENTID', CommentID)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute("NEWS_NEWS_COMMENT_Delete_App");

    let result = data.recordset && data.recordset.length > 0 ? data.recordset[0].RESULT : null
    if (result == 'ERROR_1') {
      return new ServiceResponse(false, 'Bạn không được phép xóa bình luận này');
    }
    if (!result || !data.recordset) {
      return new ServiceResponse(false, 'Có lỗi vui lòng thử lại sau');
    }
    if (result) {
      return new ServiceResponse(true, RESPONSE_MSG.NEWS.DELETE_SUCCESS, true);
    }

  } catch (e) {
    logger.error(e, { 'function': 'newsCommentService.deleteNewsComment' });
    return new ServiceResponse(false, e.message);
  }
};


module.exports = {
  getListNewsComment,
  detailNewsComment,
  createNewsCommentOrUpdate,
  deleteNewsComment,
  likeOrDisLikeNewsComment,
  getListRelyComment
};
