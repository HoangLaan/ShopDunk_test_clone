
const originService = require('./origin.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Get list options Origin
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('MD_ORIGIN', req.query);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list Origin
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListOrigin = async (req, res, next) => {
  try {
    const serviceRes = await originService.getListOrigin(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/** 
 * detail a Origin
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailOrigin = async (req, res, next) => {
  try {
    const serviceRes = await originService.detailOrigin(req.params.originId);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 */
const deleteOrigin = async (req, res, next) => {
  try {
    const originId = req.params.originId;
    // Check 
    const serviceResDetail = await originService.detailOrigin(originId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete 
    const serviceRes = await originService.deleteOrigin(originId, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.ORIGIN.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


/**
 * Change status
 */
const changeStatusOrigin = async (req, res, next) => {
  try {
    const originId = req.params.originId;
    const serviceResDetail = await originService.detailOrigin(originId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update status
    const serviceRes = await originService.changeStatusOrigin(originId, req.body);
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORIGIN.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createOrigin = async (req, res, next) => {
  try {
    req.body.Origin = null;
    const serviceRes = await originService.createOrUpdateOrigin(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORIGIN.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateOrigin = async (req, res, next) => {
  try {
    const originId = req.params.originId;
    req.body.originId = originId;
    const serviceResDetail = await originService.detailOrigin(originId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await originService.createOrUpdateOrigin(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORIGIN.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getOptions,
  getListOrigin,
  detailOrigin,
  deleteOrigin,
  changeStatusOrigin,
  createOrigin,
  updateOrigin,
};
