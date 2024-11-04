const degreeService = require('./degree.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');


/**
 * Get list
 */
const getListDegree = async (req, res, next) => {
  try {
    const serviceRes = await degreeService.getListDegree(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailDegree = async (req, res, next) => {
  try {
    const serviceRes = await degreeService.detailDegree(req.params.degree_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};
// /**
//  * Create new a 
//  */
const createDegree = async (req, res, next) => {
  try {
    req.body.degree_id = null;
    const serviceRes = await degreeService.createDegreeOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DEGREE.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Update a
//  */
const updateDegree = async (req, res, next) => {
  try {
    const degree_id = req.params.degree_id;
    req.body.degree_id = degree_id;

    // Check exists
    const serviceResDetail = await degreeService.detailDegree(degree_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update
    const serviceRes = await degreeService.createDegreeOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.DEGREE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Delete
//  */
const deleteDegree = async (req, res, next) => {
  try {

    const serviceRes = await degreeService.deleteDegree(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.DEGREE.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListDegree,
  detailDegree,
  deleteDegree,
  createDegree,
  updateDegree,
};
