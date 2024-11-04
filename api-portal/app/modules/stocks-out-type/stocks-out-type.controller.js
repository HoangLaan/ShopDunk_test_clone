
const stocksOutTypeService = require('./stocks-out-type.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await stocksOutTypeService.getOptions();
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const dataReturn = serviceRes.getData();
    return res.json(new SingleResponse(dataReturn));
  } catch (error) {
    return next(error);
  }
};

const getListStocksOutType = async (req, res, next) => {
  try {
    const serviceRes = await stocksOutTypeService.getListStocksOutType(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const detailStocksOutType = async (req, res, next) => {
  try {
    const serviceRes = await stocksOutTypeService.detailStocksOutType(req.params.stocksOutTypeId);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const deleteStocksOutType = async (req, res, next) => {
  try {

    const serviceRes = await stocksOutTypeService.deleteStocksOutType(Object.assign(req.query, req.body));
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSOUTTYPE.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const createStocksOutType = async (req, res, next) => {
  try {
    const serviceRes = await stocksOutTypeService.createOrUpdateStocksOutType(req.body);

    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSOUTTYPE.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const updateStocksInType = async (req, res, next) => {
  try {
    const stocksOutTypeId = req.params.stocksOutTypeId;
    req.body.stocksOutTypeId = stocksOutTypeId;
    const serviceResDetail = await stocksOutTypeService.detailStocksOutType(stocksOutTypeId);

    if (serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await stocksOutTypeService.createOrUpdateStocksOutType(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSOUTTYPE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const getOptionsReviewLevel = async (req, res, next) => {
  try {
    const serviceRes = await stocksOutTypeService.getOptionsReviewLevel(Object.assign(req.body, req.query));
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


const getListUserReview = async (req, res, next) => {
  try {
    const serviceRes = await stocksOutTypeService.getListUserReview(Object.assign(req.body, req.query));
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
  getListStocksOutType,
  detailStocksOutType,
  deleteStocksOutType,
  createStocksOutType,
  updateStocksInType,
  getListUserReview,
  getOptionsReviewLevel
};
