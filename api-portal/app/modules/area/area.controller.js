const areaService = require('./area.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
/**
 * Get list CRM_SEGMENT
 */
const getListArea = async (req, res, next) => {
  try {
    const serviceRes = await areaService.getListArea(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail CRM_SEGMENT
 */
const detailArea = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await areaService.detailArea(req.params.areaId);
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
const createArea = async (req, res, next) => {
  try {
    req.body.area_id = null;
    const serviceRes = await areaService.createAreaOrUpdate(req.body);
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
const updateArea = async (req, res, next) => {
  try {
    const areaId = req.params.areaId;
    req.body.area_id = areaId;

    // Check segment exists
    const serviceResDetail = await areaService.detailArea(areaId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await areaService.createAreaOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.AREA.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status MD_AREA
 */
const changeStatusArea = async (req, res, next) => {
  try {
    const areaId = req.params.areaId;

    // Check userGroup exists
    const serviceResDetail = await areaService.detailArea(areaId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await areaService.changeStatusArea(areaId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.AREA.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteArea = async (req, res, next) => {
  try {
    const areaId = req.params.areaId;

    // Check area exists
    const serviceResDetail = await areaService.detailArea(areaId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await areaService.deleteArea(areaId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.AREA.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
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
    const serviceRes = await optionService('MD_AREA', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


/**
 * Delete list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteListArea = async (req, res, next) => {
  try {
      const serviceRes = await areaService.deleteListArea(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(true, 'Xoá khu vực thành công'));
  } catch (error) {
      return next(error);
  }
};



module.exports = {
  getListArea,
  detailArea,
  createArea,
  updateArea,
  changeStatusArea,
  deleteArea,
  deleteListArea,
  getOptions,

};
