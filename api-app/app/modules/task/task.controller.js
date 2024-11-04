const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
const service = require('./task.service');
/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getTaskTypeOptions = async (req, res, next) => {
  try {
      const serviceRes = await optionService('CRM_TASKTYPE', req.query);
      return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
      return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};


const getTaskTypeAutoOptions = async (req, res, next) => {
  try {
      const serviceRes = await service.getTaskTypeAutoOptions(req.query);
      let result = [];
      if(serviceRes.getData()) {
        result = serviceRes.getData()?.data
      }
      return res.json(new SingleResponse(result));
  } catch (error) {
      return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

module.exports = {
    getTaskTypeOptions,
    getTaskTypeAutoOptions,
};
