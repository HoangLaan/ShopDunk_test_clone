const lazadaService = require('./lazada.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const connectLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.connectLazada(Object.assign(req.query, req.body));
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

const getProfileShop = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.getListShopProfile(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.getProduct(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const updateProductIDLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.updateProductIDLazada(req.body);
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
    const serviceRes = await lazadaService.getOptsStocks(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getProductOptions = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.getProductOptions(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const deleteIDLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.deleteIDLazada(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getWareHouse = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.getWareHouse(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updateStockLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.updateStockLazada(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


const getListOrder = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.getListOrder(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    // return res.json(new SingleResponse(serviceRes.getData()));
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const printShipping = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.printShipping(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const createPackOrder = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.createPackOrder(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const serviceCreateRTS = await lazadaService.createReadyToShip({...req.body, ...serviceRes.getData()});
    if (serviceCreateRTS.isFailed()) {
      return next(serviceCreateRTS);
    }
    return res.json(new SingleResponse(serviceCreateRTS.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionCancel = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.getOptionCancel(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.cancelOrder(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updateFailedOrSuccessOrder = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.updateFailedOrSuccessOrder(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const DisconnectLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.removeToken(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const serviceResRemoveProfile = await lazadaService.deleteShopProfile(req.body);
    if (serviceResRemoveProfile.isFailed()) {
      return next(serviceResRemoveProfile);
    }
    return res.json(new SingleResponse(serviceResRemoveProfile.getData()));
  } catch (error) {
    return next(error);
  }
};

const getconnectLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.getconnectLazada(req.body);
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
    const serviceRes = await lazadaService.updateStocks(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getPushLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.getPushLazada(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    const GenCustomerCode = await lazadaService.detailGenCustomerCode();
    if (serviceRes.isFailed()) {
      return next(GenCustomerCode);
    }

    const resInsertOrder = await lazadaService.crawlListOrderInsert({ ...req.body, ...serviceRes.getData(), ...GenCustomerCode.getData() });
    if (resInsertOrder.isFailed()) {
      return next(resInsertOrder);
    }
    // const updateOrderStatus = await lazadaService.updateOrderStatus(req.body);
    // if (updateOrderStatus.isFailed()) {
    //   return next(updateOrderStatus)
    // }

    return res.json(new SingleResponse());
  } catch (error) {
    return next(error);
  }
};

const updateSingleStockLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.updateSingleStockLazada(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updateListProductLazada = async (req, res, next) => {
  try {
    const serviceRes = await lazadaService.updateListProductLazada(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};



module.exports = {
  connectLazada,
  getProfileShop,
  getProduct,
  updateProductIDLazada,
  getOptsStocks,
  getProductOptions,
  deleteIDLazada,
  getWareHouse,
  updateStockLazada,
  getListOrder,
  printShipping,
  createPackOrder,
  getOptionCancel,
  cancelOrder,
  updateFailedOrSuccessOrder,
  DisconnectLazada,
  getconnectLazada,
  updateStocks,
  getPushLazada,
  updateSingleStockLazada,
  updateListProductLazada
  // updateStockLazadaDefault
};
