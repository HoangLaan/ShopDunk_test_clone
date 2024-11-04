const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const purchaseRequisitionTypeService = require('./purchase-requisition-type.service');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await purchaseRequisitionTypeService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const serviceRes = await purchaseRequisitionTypeService.getById(req.params.id);
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
    const serviceRes = await purchaseRequisitionTypeService.createOrUpdate(req.body);
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
    const serviceRes = await purchaseRequisitionTypeService.delete(req.body);
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
      const serviceRes = await purchaseRequisitionTypeService.getReviewLevelList(req.query);

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
      const serviceRes = await purchaseRequisitionTypeService.createReviewLevel(req.body);
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
      const serviceRes = await purchaseRequisitionTypeService.deleteReviewLevel(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }

      return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
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
};
