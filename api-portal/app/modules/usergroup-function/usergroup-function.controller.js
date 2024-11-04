const userGroupFunctionService = require('./usergroup-function.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

/**
 * Create new a SYS_USERGROUP_FUNCTION
 */
const createUserGroupFunction = async (req, res, next) => {
  try {
    const serviceRes = await userGroupFunctionService.createUserGroupFunction(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.USERGROUP_FUNCTION.SAVE_SYS_USERGROUP_FUNCTION_SUCCESS));
  } catch (error) {
    return next(error);
  }
};
const getListFunctionGroup = async (req, res, next) => {
  try {
    const serviceRes = await userGroupFunctionService.getListFunctionGroup(req.query);
    const {data} = serviceRes.getData();

    return res.json(new ListResponse(data));
  } catch (error) {
    return next(error);
  }
};
const getListFunctionByFunctionGroupID = async (req, res, next) => {
  try {
    const serviceRes = await userGroupFunctionService.getListFunctionByFunctionGroupID(req.params.functionGroupId);
    const {data} = serviceRes.getData();

    return res.json(new ListResponse(data));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUserGroupFunction,
  getListFunctionGroup,
  getListFunctionByFunctionGroupID,
};
