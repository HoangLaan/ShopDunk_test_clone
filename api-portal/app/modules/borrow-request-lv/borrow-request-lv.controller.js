const serveice = require('./borrow-request-lv.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');


const createBorrowRequestLv = async (req, res, next) => {
  try {
    req.body.created_user = req.auth.user_name;
    const serviceRes = await serveice.createOrUpdateHandler(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


const getListBorrowRequestLv = async (req, res, next) => {
  try {
    const {list} = await serveice.getListBorrowRequestLv(req.query);
    return res.json(new ListResponse(list, req.query.page, req.query.itemsPerPage));
  } catch (error) {
    return next(error);
  }
};

const getListUserReview = async (req, res, next) => {
  try {
    const serviceRes = await serveice.getListUserReview(req.query?.review_lv_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createBorrowRequestLv,
  getListBorrowRequestLv,
  getListUserReview
};
