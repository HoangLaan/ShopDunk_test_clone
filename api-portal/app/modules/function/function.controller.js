const httpStatus = require('http-status');
const functionService = require('./function.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
/**
 * Get list function
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListFunction = async (req, res, next) => {
  try {
    const functions = await functionService.getListFunction(req);

    return res.json(new ListResponse(functions['data'], functions['total'], functions['page'], functions['limit']));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Create new a function
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createFunction = async (req, res, next) => {
  try {
    // Check function alias exists
    const functionIsExist = await functionService.checkExistFunctionAlias(req.body.function_alias);
    if(functionIsExist) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.FUNCTION.CHECK_ALIAS_FAILED));
    }
    const functionCheckName = await functionService.checkNameFunction(req.body.function_name);
    if(!functionCheckName) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.FUNCTION.CHECK_NAME_FAILED));
    }
    // Insert function
    const result = await functionService.createFunction(req);

    if(! result) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.FUNCTION.CREATE_FAILED));
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.FUNCTION.CREATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * Update a function
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateFunction = async (req, res, next) => {
  try {
    const functionId = req.params.functionId;
    // Check function exists
    const func = await functionService.detailFunction(functionId);
    if(! func) {
      return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
    }

    // Check function alias exists
    const functionIsExist = await functionService.checkExistFunctionAlias(req.body.function_alias, functionId);
    if(functionIsExist) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.FUNCTION.CHECK_ALIAS_FAILED));
    }
    const functionCheckName = await functionService.checkNameFunction(req.body.function_name, functionId);
    if(!functionCheckName) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.FUNCTION.CHECK_NAME_FAILED));
    }
    // Update function
    const result = await functionService.updateFunction(req);

    if(! result) {
      return next(new ErrorResponse(null, null, RESPONSE_MSG.FUNCTION.UPDATE_FAILED));
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.FUNCTION.UPDATE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const deleteFunction = async (req, res, next) => {
  try {
    const functionId = req.params.functionId;

    // Check function exists
    const func = await functionService.detailFunction(functionId);
    if(! func) {
      return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
    }

    // Delete function
    await functionService.deleteFunction(functionId, req);

    return res.json(new SingleResponse(null, RESPONSE_MSG.FUNCTION.DELETE_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const detailFunction = async (req, res, next) => {
  try {
    const functionId = req.params.functionId;

    // Check function exists
    const func = await functionService.detailFunction(functionId);
    if(! func) {
      return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
    }

    return res.json(new SingleResponse(func));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const changeStatusFunction = async (req, res, next) => {
  try {
    const functionId = req.params.functionId;

    // Check function exists
    const func = await functionService.detailFunction(functionId);
    if(! func) {
      return next(new ErrorResponse(httpStatus.NOT_FOUND, null, RESPONSE_MSG.NOT_FOUND));
    }

    // Update password of function
    await functionService.changeStatusFunction(functionId, req);

    return res.json(new SingleResponse(null, RESPONSE_MSG.FUNCTION.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('SYS_FUNCTION', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getListFunctionsByUserGroup = async (req, res, next) => {
  try {
    // Get functions by user groups
    const serviceRes = await functionService.getListFunctionsByUserGroup(req.auth.user_groups);

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const deleteListFunction = async (req, res, next) => {
  try {
      const serviceRes = await functionService.deleteListFunction(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(true, 'Xoá phân quyền thành công'));
  } catch (error) {
      return next(error);
  }
};

module.exports = {
  getListFunction,
  createFunction,
  updateFunction,
  deleteFunction,
  deleteListFunction,
  detailFunction,
  changeStatusFunction,
  getOptions,
  getListFunctionsByUserGroup,
};
