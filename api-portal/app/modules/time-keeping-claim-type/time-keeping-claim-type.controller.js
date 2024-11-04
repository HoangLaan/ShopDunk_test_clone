const timeKeepingClaimTypeService = require('./time-keeping-claim-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status')
/**
 * Get list CRM_SEGMENT
 */
const getListTimeKeepingClaimType = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.getListTimeKeepingClaimType(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_SEGMENT
 */
const detailTimeKeepingClaimType = async (req, res, next) => {
  try {
    // Check company exists
    req.body.time_keeping_claim_type_id = req.params.id;
    const serviceRes = await timeKeepingClaimTypeService.detailTimeKeepingClaimType(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_AREA
 */
const createTimeKeepingClaimType = async (req, res, next) => {
  try {
    req.body.timeKeepingClaim_id = null;
    const serviceRes = await timeKeepingClaimTypeService.createOrUpdateTimeKeepingClaimType(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.AREA.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a MD_AREA
 */
const updateTimeKeepingClaimType = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.createOrUpdateTimeKeepingClaimType(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.AREA.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteTimeKeepingClaimType = async (req, res, next) => {
  try {
    // Delete timeKeepingClaim
    const serviceRes = await timeKeepingClaimTypeService.deleteTimeKeepingClaimType({...req.body, ...req.query});
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.AREA.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const getUserList = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.getUserList(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const createOrUpdateReviewLevel = async (req, res, next) => {
  try {
      const result = await timeKeepingClaimTypeService.createOrUpdateReviewLevel(req.body);
      if (result.isFailed()) {
          return next(new ErrorResponse(false, result.getMessage()));
      }
      return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
      return next(error);
  }
};

const getListReviewLevel = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.getListReviewLevel(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
      return next(error);
  }
};

const deleteReviewLevel = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.deleteReviewLevel({...req.query, ...req.body});
    if(serviceRes.isFailed()) return next(serviceRes)
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

const getUsersByPosition = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.getUsersByPosition(req.query);
    if(serviceRes.isFailed()) return next(serviceRes)
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};
/*
Lấy thông tin user và mức duyệt theo phiếu giải trình or là theo loại giải trình.
 */
const getUsersByTypeClaimId = async (req, res, next) => {
  try {
    const serviceRes = await timeKeepingClaimTypeService.getListUsersReviewByTimeKeepingType(req.query);
    if(serviceRes.isFailed()) return next(serviceRes)
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

module.exports = {
  detailTimeKeepingClaimType,
  // done
  getUserList,
  createOrUpdateReviewLevel,
  getListReviewLevel,
  deleteReviewLevel,
  getUsersByPosition,
  createTimeKeepingClaimType,
  updateTimeKeepingClaimType,
  deleteTimeKeepingClaimType,
  getListTimeKeepingClaimType,
  getUsersByTypeClaimId,
};
