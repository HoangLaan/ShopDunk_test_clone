const CostTypeService = require('./cost-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await CostTypeService.getListCostType(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const createCostType = async (req, res, next) => {
  try {
    req.body.order_status_id = null;
    const serviceRes = await CostTypeService.createCostTypeOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const updateCostType = async (req, res, next) => {
  try {
    const costTypeId = req.params.costTypeId;

    const serviceResDetail = await CostTypeService.detailCostType(costTypeId);

    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await CostTypeService.createCostTypeOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CRUD.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const deleteCostTypes = async (req, res, next) => {
  try {
    const serviceRes = await CostTypeService.deleteCostTypes(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(null, RESPONSE_MSG.CRUD.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const detailCostType = async (req, res, next) => {
  try {
    const serviceRes = await CostTypeService.detailCostType(req.params.costTypeId);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await CostTypeService.getOptions(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOptions,
  deleteCostTypes,
  getList,
  createCostType,
  updateCostType,
  detailCostType
};
