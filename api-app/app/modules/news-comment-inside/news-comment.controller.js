const newsService = require('./news-comment.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
/**
 * Get list MD_STORE
 */

const getListNewsComment = async (req, res, next) => {
  try {
    const serviceRes = await newsService.getListNewsComment(req.body, req.query);
    const { data, total, page, limit, parent, children } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit, parent, children));
  } catch (error) {
    return next(error);
  }
};




const getListReplyComment = async (req, res, next) => {
  try {
    const serviceRes = await newsService.getListRelyComment(req.body, req.query);
    const { data, total, page, limit, parent, children } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit, parent, children));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail 
 */
const detailNewsComment = async (req, res, next) => {
  try {
    const serviceRes = await newsService.detailNewsComment(req.params.CommentID);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createNewsComment = async (req, res, next) => {
  try {

    const serviceRes = await newsService.createNewsCommentOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    if (parseInt(serviceRes.data.comment_id) === req.body.comment_id) {
      return res.json(new SingleResponse(serviceRes.getData(), "chỉnh sửa thành công"));
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Like or Dislike comment News
 */
const likeOrDisLikeNewsComment = async (req, res, next) => {
  try {
    const serviceRes = await newsService.likeOrDisLikeNewsComment(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateNewsComment = async (req, res, next) => {
  try {
    let obj = { ...req.body, comment_id: req.params.CommentID };
    const serviceRes = await newsService.createNewsCommentOrUpdate(obj);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteNewsComment = async (req, res, next) => {
  try {
    const serviceRes = await newsService.deleteNewsComment(req.params.CommentID, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.NEWS.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getListNewsComment,
  detailNewsComment,
  createNewsComment,
  updateNewsComment,
  deleteNewsComment,
  likeOrDisLikeNewsComment,
  getListReplyComment
};

