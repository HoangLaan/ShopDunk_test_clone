const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const sellerStoreConnectService = require('./seller-store-connect.service');

const getProfileShop = async (req, res, next) => {
  try {
    const serviceRes = await sellerStoreConnectService.getListShopProfile(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptsStocks = async (req, res, next) => {
  try {
    const serviceRes = await sellerStoreConnectService.getOptsStocks(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updateStocks = async (req, res, next) => {
  try {
    const serviceRes = await sellerStoreConnectService.updateStocks(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getProfileShop,
  getOptsStocks,
  updateStocks
};
