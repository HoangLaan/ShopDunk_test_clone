const levelService = require('./level.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');


/**
 * Get list
 */
const getListLevel = async (req, res, next) => {
  try {
    const serviceRes = await levelService.getListLevel(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail
 */
const detailLevel = async (req, res, next) => {
  try {
    const serviceRes = await levelService.detailLevel(req.params.level_id);
    if(serviceRes.isFailed()) {
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
const createLevel = async (req, res, next) => {
  try {
    req.body.level_id = null;
    const serviceRes = await levelService.createLevelOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BANNER.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Update a
//  */
const updateLevel = async (req, res, next) => {
  try {
    const level_id = req.params.level_id;
    req.body.level_id = level_id;

    // Check exists
    const serviceResDetail = await levelService.detailLevel(level_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update
    const serviceRes = await levelService.createLevelOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.BANNER.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

// /**
//  * Delete
//  */
const deleteLevel = async (req, res, next) => {
  try {
    const level_id = req.params.level_id;

    // Check area exists
    const serviceResDetail = await levelService.detailLevel(level_id);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await levelService.deleteLevel(level_id, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.BANNER.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
/**
 * Get options
 */
 const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await levelService.getOptions();
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
getListLevel,
detailLevel,
deleteLevel,
createLevel,
updateLevel,
getOptions,
};
