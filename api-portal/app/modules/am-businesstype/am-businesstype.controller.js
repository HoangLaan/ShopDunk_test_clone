const httpStatus = require('http-status');
const amBusinessTypeService = require('./am-businesstype.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * Get list businesstype
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListAMBusinessType = async (req, res, next) => {
  try {
    const serviceRes = await amBusinessTypeService.getListAMBusinessType(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Create new a AM_BUSINESSTYPE
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createAMBusinessType= async (req, res, next) => {
  try {
    // Insert AMBusinessType
    const serviceRes = await amBusinessTypeService.createAMBusinessType(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESSTYPE.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Update a AM_BUSINESSTYPE
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateAMBusinessType = async (req, res, next) => {
  try {
    const business_type_id = req.params.business_type_id;
    // Check AMBusinessType exists
    const serviceResDetail = await amBusinessTypeService.detailAMBusinessType(business_type_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update AMBusinessType
    const serviceRes = await amBusinessTypeService.updateAMBusinessType(req.body,business_type_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESSTYPE.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
/**
 * delete a AM_BUSINESSTYPE
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteAMBusinessType = async (req, res, next) => {
  try {
    const business_type_id = req.params.business_type_id;
    const authId = apiHelper.getAuthId(req);
    // Check AMBusinessType exists

    const serviceResDetail = await amBusinessTypeService.detailAMBusinessType(business_type_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Delete AMBusinessType
    const serviceRes = await amBusinessTypeService.deleteAMBusinessType(business_type_id,authId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESSTYPE.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
/**
 * detail a AM_BUSINESSTYPE
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const detailAMBusinessType = async (req, res, next) => {
  try {
    const business_type_id = req.params.business_type_id;

    // Check AMBusinessType exists
    const serviceRes = await amBusinessTypeService.detailAMBusinessType(business_type_id);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
  /**
 * change status a AM_BUSINESSTYPE
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const changeStatusAMBusinessType = async (req, res, next) => {
  try {
    const business_type_id = req.params.business_type_id;
    const authId = apiHelper.getAuthId(req);
    const isActive = apiHelper.getValueFromObject(req.body, 'is_active');
    // Check function exists
    const serviceResDetail = await amBusinessTypeService.detailAMBusinessType(business_type_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    const serviceRes = await amBusinessTypeService.changeStatusAMBusinessType(business_type_id,authId,isActive);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.AMBUSINESSTYPE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('AM_BUSINESSTYPE', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getListAMBusinessType,
  createAMBusinessType,
  updateAMBusinessType,
  deleteAMBusinessType,
  detailAMBusinessType,
  changeStatusAMBusinessType,
  getOptions,
};
