const storeService = require('./store.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const requestIp = require('request-ip');
const { WriteGrayLog } = require('../../common/classes/graylog.class');
/**
 * Get list MD_STORE
 */
const getListStore = async (req, res, next) => {
  try {
    const serviceRes = await storeService.getListStore(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detail MD_STORE
 */
const detailStore = async (req, res, next) => {
  try {
    // Check company exists
    const serviceRes = await storeService.detailStore(req.params.storeId);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new a MD_STORE
 */
const createStore = async (req, res, next) => {
  try {
    req.body.store_id = null;
    const serviceRes = await storeService.createAreaOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STORE.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a MD_STORE
 */
const updateStore = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    req.body.store_id = storeId;

    // Check segment exists
    const serviceResDetail = await storeService.detailStore(storeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update segment
    const serviceRes = await storeService.createAreaOrUpdate(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STORE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Change status MD_STORE
 */
const changeStatusStore = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;

    // Check userGroup exists
    const serviceResDetail = await storeService.detailStore(storeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Update status
    await storeService.changeStatusStore(storeId, req.body);
    return res.json(new SingleResponse(null, RESPONSE_MSG.STORE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CRM_SEGMENT
 */
const deleteStore = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;

    // Check area exists
    const serviceResDetail = await storeService.detailStore(storeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete area
    const serviceRes = await storeService.deleteStore(storeId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.STORE.DELETE_SUCCESS));
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
    const serviceRes = await optionService('MD_STORE', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const checkIp = async (req, res, next) => {
  try {
    const clientIp = requestIp.getClientIp(req).replace('::ffff:', '');
    const serviceRes = await storeService.checkIp(clientIp);
    if(serviceRes.isFailed()) return next(serviceRes)
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getStoreByUser = async (req, res, next) => {
  try {
      const serviceRes = await storeService.getStoreByUser(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(error);
  }
};

module.exports = {
  getListStore,
  detailStore,
  createStore,
  updateStore,
  changeStatusStore,
  deleteStore,
  getOptions,
  checkIp,
  getStoreByUser,
};
