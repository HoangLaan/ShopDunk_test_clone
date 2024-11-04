const experienceService = require('./experience.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list
 */
const getListExperience = async (req, res, next) => {
  try {
    const {list, total} = await experienceService.getListExperience(req.query);
    return res.json(new ListResponse(list, total, req.query.page, req.query.itemsPerPage));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a experience
 */
const createExperience = async (req, res, next) => {
  try {
    req.body.created_user = req.auth.user_name;
    const serviceRes = await experienceService.createOrUpdateHandler(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.CREATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Update experience
 */
const updateExperience = async (req, res, next) => {
  try {
    req.body.updated_user = req.auth.user_name;
    const serviceRes = await experienceService.createOrUpdateHandler(req.body);
    if (serviceRes.isFailed()) {
      return next(new ErrorResponse(httpStatus.INTERNAL_SERVER_ERROR, null, RESPONSE_MSG.CRUD.UPDATE_FAILED));
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Delete experience
 */
const deleteExperience = async (req, res, next) => {
  try {

      const experienceId = req.params.id
      // Check Experience exists
      const serviceResDetail = await experienceService.getById(experienceId);
      if (serviceResDetail.isFailed()) {
        return next(serviceResDetail);
      }

    req.body.deleted_user = req.auth.user_name;
    // Delete Experience
    const serviceRes = await experienceService.deleteExperience(experienceId,req.body);
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
const deleteListExperience = async (req, res, next) => {
  try {
    const serviceRes = await experienceService.deleteListExperience(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(true, 'Xoá kinh nghiệm thành công'));
  } catch (error) {
    return next(error);
  }
};


const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const serviceRes = await experienceService.getById(id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getListExperience,
  createExperience,
  getById,
  updateExperience,
  deleteExperience,
  deleteListExperience

};
