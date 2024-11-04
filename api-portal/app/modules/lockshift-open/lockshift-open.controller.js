const lockShiftService = require('./lockshift-open.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const httpStatus = require('http-status');
const ErrorResponse = require('../../common/responses/error.response');
/**
 * Get list
 */
const getListLockShiftOpen = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.getListLockShiftOpen(req.query);
    const {data, total, page, limit} = serviceRes?.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createOrUpdateLockShiftOpen = async (req, res, next) => {
  try {
    req.body.created_user=req.auth.user_name
    const serviceRes = await lockShiftService.createOrUpdateLockShiftOpen(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
    }
    return res.json(new SingleResponse(serviceRes.getData(),RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
  }
};


const checkIsAllowOpenShift = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.checkIsAllowOpenShift(req.auth.user_name);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const checkHasPermission = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.checkHasPermission(req.auth.user_name);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(),serviceRes.getMessage()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const detailLockShift = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.getDetailLockShift(req.auth.user_name,req.query);

    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const statisticsLockShift = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.statisticsLockShift(req.auth.user_name,req.query);

    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Get list cash
 */
const getListLockShiftCash = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.getListLockShiftCash(req.auth.user_name,req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};


/**
 * Get list equipment
 */
const getListLockShiftEquipment = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.getListLockShiftEquipment(req.auth.user_name,req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};


/**
 * Get list product
 */
const getListLockShiftProduct = async (req, res, next) => {
  try {

    const serviceRes = await lockShiftService.getListLockShiftProduct(req.auth.user_name,req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};


/**
 * Get list customer
 */
const getListLockShiftCustomer = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.getListLockShiftCustomer(req.auth.user_name,req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const deleteProductInShift = async (req, res, next) => {
  try {
    const serviceRes = await lockShiftService.deleteProductInShift(req.auth.user_name,req.params.id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getListLockShiftOpen,
  createOrUpdateLockShiftOpen,
  checkIsAllowOpenShift,
  getListLockShiftCash,
  getListLockShiftEquipment,
  detailLockShift,
  statisticsLockShift,
  getListLockShiftProduct,
  getListLockShiftCustomer,
  checkHasPermission,
  deleteProductInShift
};
