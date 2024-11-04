
const appConfigService = require('./app-config.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const httpStatus = require('http-status');

/**
 * Get list stocksType
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */



const createOrUpdateAppConfig = async (req, res, next) => {
  try {
    req.body.paymentSlip = null;
    const serviceRes = await appConfigService.createOrUpdateAppConfig(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.APPCONFIG.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const getListAppConfig = async (req, res, next) => {
  try {
    const serviceRes = await appConfigService.getListAppConfig(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const deleteAppConfig = async (req, res, next) => {
  try {
    const appConfigId = req.params.appConfigId;
    // Delete 
    const serviceRes = await appConfigService.deleteAppConfig(appConfigId, req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.APPCONFIG.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const detailAppConfig = async (req, res, next) => {
  try {
    const serviceRes = await appConfigService.detailAppConfig(req.params.appConfigId);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

// Get by key
const getByKey = async (req, res, next) => {
  try {
    const serviceRes = await appConfigService.getByKey(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const getPageConfig = async (req, res, next) => {
  try {
    const serviceRes = await appConfigService.getPageConfig(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updatePageConfig = async (req, res, next) => {
  try {
 
    const serviceRes = await appConfigService.updatePageConfig(Object.assign({}, req.params, { configs: req.body}));
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updateConfig = async (req, res, next) => {
  try {
    const serviceRes = await appConfigService.updateConfig(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  createOrUpdateAppConfig,
  getListAppConfig,
  deleteAppConfig,
  detailAppConfig,
  getByKey,
  getPageConfig,
  updatePageConfig,
  updateConfig
};
