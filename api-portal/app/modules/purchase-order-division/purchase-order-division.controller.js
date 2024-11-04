const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const purchaseOrderDivisionService = require('./purchase-order-division.service');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.getById(req.params.id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const createOrUpdate = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.createOrUpdate(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};

const _delete = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.delete(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


const getReviewLevelList = async (req, res, next) => {
  try {
      const serviceRes = await purchaseOrderDivisionService.getReviewLevelList(req.query);

      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      const { data, total, page, limit } = serviceRes.getData();

      return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
      return next(error);
  }
};

const createReviewLevel = async (req, res, next) => {
  try {
      const serviceRes = await purchaseOrderDivisionService.createReviewLevel(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

const deleteReviewLevel = async (req, res, next) => {
  try {
      const serviceRes = await purchaseOrderDivisionService.deleteReviewLevel(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }

      return res.json(new SingleResponse(null, 'Xoá mức duyệt thành công'));
  } catch (error) {
      return next(error);
  }
};

const createOrUpdateWithMultiStore = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.createOrUpdateWithMultiStore(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
    return next(error);
  }
};

const getListStockOptions = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.getListStockOptions({...req.query, ...req.body});
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const genCode = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.genCode(req.query);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getStockOfBusiness = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.getStockOfBusiness({...req.query, ...req.body});
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getInventoryByProduct = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.getInventoryByProduct({...req.query, ...req.body});
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getBusinessByStore = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.getBusinessByStore({...req.query, ...req.body});
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getProStocksInventory = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.getProStocksInventory({...req.query, ...req.body});
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getHistoryOrderList = async (req, res, next) => {
  try {
    const serviceRes = await purchaseOrderDivisionService.getHistoryOrderList({...req.query, ...req.body});
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  getList,
  getById,
  createOrUpdate,
  delete: _delete,
  getReviewLevelList,
  createReviewLevel,
  deleteReviewLevel,
  createOrUpdateWithMultiStore,
  getListStockOptions,
  genCode,
  getStockOfBusiness,
  getInventoryByProduct,
  getBusinessByStore,
  getProStocksInventory,
  getHistoryOrderList,
};
