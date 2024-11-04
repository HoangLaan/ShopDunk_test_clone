const SingleResponse = require("../../common/responses/single.response");

const workTypeService = require("./work-type.service");
const ErrorResponse = require("../../common/responses/error.response");
const ListResponse = require("../../common/responses/list.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");

/**
 * Get list WorkType
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListWorkType = async (req, res, next) => {
  try {
    const serviceRes = await workTypeService.getListWorkType(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};
/**
 * Create
 */
const createWorkType = async (req, res, next) => {
  try {
    // req.body.WorkType = null;
    const serviceRes = await workTypeService.createOrUpdateWorkType(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ORIGIN.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
/**
 * detail a WorkType
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailWorkType = async (req, res, next) => {
  try {
    const serviceRes = await workTypeService.detailWorkType(req.params.workTypeId);
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
const deleteWorkType = async (req, res, next) => {
  try {
    const workTypeId = req.params.workTypeId;
    // Check
    const serviceResDetail = await workTypeService.deleteWorkType(workTypeId);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

   
    return res.json(new SingleResponse(null, RESPONSE_MSG.ORIGIN.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const updateWorkType = async (req, res, next) => {
  try {
      const workTypeId = req.params.workTypeId;
      req.body.work_type_id=workTypeId;
      const serviceResDetail = await workTypeService.detailWorkType(workTypeId);
      if (serviceResDetail.isFailed()) {
        return next(serviceResDetail);
      }
      const serviceRes = await workTypeService.createOrUpdateWorkType(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.TOPIC.UPDATE_SUCCESS));
  } catch (error) {
      return next(error);
  }
};
module.exports = {
  getListWorkType,
  createWorkType,
  updateWorkType,
  deleteWorkType,
  detailWorkType,
};