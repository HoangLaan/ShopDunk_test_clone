const shopeeService = require('./shopee.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const { notification } = require('../../common/services/bullmq.service');
const NOTIFY_CONST = require('../../common/const/notify.const');
const moment = require('moment');
const httpStatus = require('http-status');
// const configService = require('../config/config.service')
const config = require('../../../config/config');
// const events = require('../../common/events');
// const htmlHelper = require('../../common/helpers/html.helper');
const { Blob } = require('buffer');
const fs = require('fs');
// const shopeeSVG = require('.')


const connectShoppe = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.connectShoppe(req.body);
    let { is_send_mail = null } = req.body
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const DisconnectShopee = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.DisconnectShopee(req.body);
    let { is_send_mail = null } = req.body
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getProfileShop = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getListShopProfile(req.body);
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
    const serviceRes = await shopeeService.getProduct(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const removeToken = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.removeToken(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const checkToken = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.checkToken(req.body);
    let { is_send_mail = null } = req.body
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updateStockShopee = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.updateStockShopee(req.body);
    let { is_send_mail = null } = req.body
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
    const serviceRes = await shopeeService.getListOrder(req.body);
    let { is_send_mail = null } = req.body
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const refeshToken = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.refeshToken(req.body);
    let { is_send_mail = null } = req.body
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const crawlListOrderInsert = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.crawlListOrderInsert(req.body);
    let { is_send_mail = null } = req.body
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getAccessToken = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getAccessToken(req.body);
    let { is_send_mail = null } = req.body
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getSignShopee = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getSignShopee(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


const getAuthor = async (req, res, next) => {
  try {
    let { disconnect = 'false' } = req.query;
    // Nếu xóa connect Shopee
    if (disconnect === 'true') {
      const serviceRes = await shopeeService.removeToken(req.query);
      if (serviceRes.isFailed()) {
        return next(serviceRes);
      }
      const serviceResRemoveProfile = await shopeeService.deleteShopProfile(req.query);
      if (serviceResRemoveProfile.isFailed()) {
        return next(serviceResRemoveProfile);
      }
      return res.json(new SingleResponse(serviceResRemoveProfile.getData()));
      // Nếu thực hiện thao tác kết nối
    } else {
      const serviceRes = await shopeeService.getAccessToken(req.query);
      if (serviceRes.isFailed()) {
        return next(serviceRes);
      }
      // Lấy thông tin từ Shopee
      const serviceResGetProfile = await shopeeService.getProfileShop(req.query);
      if (serviceResGetProfile.isFailed()) {
        return next(serviceRes);
      }
      let { data = null } = serviceResGetProfile.getData();
      if (!!data) {
        const serviceSave = await shopeeService.createShopeeProfile({ ...data, ...req.query, ...req.auth })
        if (serviceSave.isFailed()) {
          return next(serviceSave);
        }
        return res.json(new SingleResponse(serviceResGetProfile.getData()));
      }
    }
  } catch (error) {
    return next(error);
  }
};

const getOptionShipping = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getOptionShipping(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getOptionShippingList = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getOptionShippingList(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


const shipOrder = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.shipOrder(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getTrackingNumberCode = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getTrackingNumberCode(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const shippingDocument = async (req, res, next) => {
  try {
    // const resultGetListParamater = await shopeeService.getListShippingDocumentParamater(req.body);
    // if(resultGetListParamater.isFailed()){
    //     return next(resultGetListParamater);
    // }
    // tạo phiếu in ở Shopee
    const serviceRes = await shopeeService.shippingDocument(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    // Check kết quả phiếu in
    const listResultCheck = await shopeeService.getResultShippingDocument(req.body);
    if (listResultCheck.isFailed()) {
      return next(listResultCheck);
    }
    // // Download phiếu in
    const getWaybill = await shopeeService.getWaybill(req.body);
    if (getWaybill.isFailed()) {
      return next(getWaybill)
    }
    return res.json(new SingleResponse(getWaybill.getData()));
  } catch (error) {
    return next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.cancelOrder(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getPushShopee = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getPushShopee(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const GenCustomerCode = await shopeeService.detailGenCustomerCode();
    if (serviceRes.isFailed()) {
      return next(GenCustomerCode);
    }

    const resInsertOrder = await shopeeService.crawlListOrderInsert({ ...req.body, ...serviceRes.getData(), ...GenCustomerCode.getData() });
    if (resInsertOrder.isFailed()) {
      return next(resInsertOrder);
    }

    // const updateOrderStatus = await shopeeService.updateOrderStatus(req.body);
    // if (updateOrderStatus.isFailed()) {
    //   return next(updateOrderStatus)
    // }

    return res.json(new SingleResponse());
  } catch (error) {
    return next(error);
  }
};

const getOptsStocks = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getOptsStocks(req.query);
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
    const serviceRes = await shopeeService.updateStocks(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const updateProductIDShopee = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.updateProductIDShopee(req.body);
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
    const serviceRes = await shopeeService.getProductOptions(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const deleteIDShopee = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.deleteIDShopee(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getModelList = async (req, res, next) => {
  try {
    const serviceRes = await shopeeService.getModelList(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  connectShoppe,
  DisconnectShopee,
  getProfileShop,
  getProduct,
  removeToken,
  checkToken,
  updateStockShopee,
  getListOrder,
  refeshToken,
  crawlListOrderInsert,
  getAccessToken,
  getSignShopee,
  getAuthor,
  getOptionShipping,
  shipOrder,
  getTrackingNumberCode,
  shippingDocument,
  getOptionShippingList,
  cancelOrder,
  getPushShopee,
  getOptsStocks,
  updateStocks,
  updateProductIDShopee,
  getProductOptions,
  deleteIDShopee,
  getModelList
};
