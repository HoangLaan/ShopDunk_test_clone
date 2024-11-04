const BudgetTypeService = require('./budget-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');


const createBudgetType = async (req, res, next) => {
  try {
    req.body.updated_user = req.auth.user_name;
    const serviceRes = await BudgetTypeService.createOrUpdateHandler(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, serviceRes.getMessage()));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


const updateBudgetType = async (req, res, next) => {
  try {
    req.body.updated_user = req.auth.user_name;
    const serviceRes = await BudgetTypeService.createOrUpdateHandler(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const getListBudgetType = async (req, res, next) => {
  try {
    const {list, total} = await BudgetTypeService.getListBudgetType(req.query);
    return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const serviceRes = await BudgetTypeService.getById(id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


/**
 * Delete budget type
 */
const deleteBudgetType = async (req, res, next) => {
  try {

    const budgetTypeId = req.params.id
    // Check Budget Type
    const serviceResDetail = await BudgetTypeService.getById(budgetTypeId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    req.body.deleted_user = req.auth.user_name;
    // Delete budget type
    const serviceRes = await BudgetTypeService.deleteBudgetType(budgetTypeId,req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CUSTOMERTYPE.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }

};

/**
 * Delete list
 */
const deleteListBudgetType = async (req, res, next) => {
  try {
    const serviceRes = await BudgetTypeService.deleteListBudgetType(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(true, 'Xoá danh sách loại ngân sách thành công'));
  } catch (error) {
    return next(error);
  }
};



module.exports = {
  createBudgetType,
  getListBudgetType,
  getById,
  updateBudgetType,
  deleteBudgetType,
  deleteListBudgetType
};
