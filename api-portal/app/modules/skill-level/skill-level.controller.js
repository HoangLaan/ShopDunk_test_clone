const skillLevelService = require('./skill-level.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');


/**
 * Get list
 */
const getListSkillLevel = async (req, res, next) => {
  try {
    const serviceRes = await skillLevelService.getListSkillLevel(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailSkillLevel = async (req, res, next) => {
  try {
    const serviceRes = await skillLevelService.detailSkillLevel(req.params.level_id);
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
const createSkillLevel = async (req, res, next) => {
  try {
    req.body.level_id = null;
    const serviceRes = await skillLevelService.createLevelOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SKILLLEVEL.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Update a
//  */
const updateSkillLevel = async (req, res, next) => {
  try {
    const level_id = req.params.level_id;
    req.body.level_id = level_id;

    // Check exists
    const serviceResDetail = await skillLevelService.detailSkillLevel(level_id);
    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update
    const serviceRes = await skillLevelService.createLevelOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SKILLLEVEL.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Delete
//  */
const deleteSkillLevel = async (req, res, next) => {
  try {
    // Delete 
    const serviceRes = await skillLevelService.deleteSkillLevel(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.SKILLLEVEL.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get options
 */
const getOptionsSkillLevel = async (req, res, next) => {
  try {
    const serviceRes = await skillLevelService.getOptionsSkillLevel(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getListSkillLevel,
  detailSkillLevel,
  deleteSkillLevel,
  createSkillLevel,
  updateSkillLevel,
  getOptionsSkillLevel
};
