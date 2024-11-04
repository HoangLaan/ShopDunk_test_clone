const BudgetReviewLVService = require('./budget-review-lv.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');


const createBudgetReviewLv = async (req, res, next) => {
  try {
    req.body.created_user = req.auth.user_name;
    const serviceRes = await BudgetReviewLVService.createOrUpdateHandler(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


const getListBudgetReviewLv = async (req, res, next) => {
  try {
    const {list} = await BudgetReviewLVService.getListBudgetReviewLv(req.query);
    return res.json(new ListResponse(list, req.query.page, req.query.itemsPerPage));
  } catch (error) {
    return next(error);
  }
};

const getListUserReview = async (req, res, next) => {
  try {
    const serviceRes = await BudgetReviewLVService.getListUserReview(req.query?.review_lv_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


const deleteBudgetReviewLv = async (req, res, next) => {
    try {
      req.body.deleted_user = req.auth.user_name;
      const serviceRes = await BudgetReviewLVService.deleteBudgetReviewLv(req.params.id,req.body);
      if (serviceRes.isFailed()) {
        return next(serviceRes);
      }

      return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERTYPE.DELETE_SUCCESS));
    } catch (error) {
      return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }

  };

module.exports = {
  createBudgetReviewLv,
  getListBudgetReviewLv,
  getListUserReview,
  deleteBudgetReviewLv
};
