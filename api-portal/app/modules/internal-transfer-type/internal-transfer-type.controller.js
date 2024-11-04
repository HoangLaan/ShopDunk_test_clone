const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const internalTransferTypeService = require('./internal-transfer-type.service');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await internalTransferTypeService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const serviceRes = await internalTransferTypeService.getById(req.params.id);
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
    const serviceRes = await internalTransferTypeService.createOrUpdate(req.body);
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
    const serviceRes = await internalTransferTypeService.delete(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getUserOptions = async (req, res, next) => {
  try {
      const serviceRes = await internalTransferTypeService.getUserOptions(req.query);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      const datares = serviceRes.getData();
      return res.json(new SingleResponse(datares));
  } catch (error) {
      return next(error);
  }
};

const getReviewLevelList = async (req, res, next) => {
  try {
      const serviceRes = await internalTransferTypeService.getReviewLevelList(req.query);

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
      const serviceRes = await internalTransferTypeService.createReviewLevel(req.body);
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
      const serviceRes = await internalTransferTypeService.deleteReviewLevel(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }

      return res.json(new SingleResponse(null, RESPONSE_MSG.EXPEND_TYPE.REVIEW_LEVEL.DELETE_SUCCESS));
  } catch (error) {
      return next(error);
  }
};

const getReviewInformation = async (req, res, next) => {
  try {
      const serviceRes = await internalTransferTypeService.getReviewInformation({
          ...req.query,
          auth_name: req.body.auth_name,
      });
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
  } catch (error) {
      return next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
      const serviceRes = await internalTransferTypeService.updateReview(req.body);
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
  getUserOptions,
  getReviewInformation,
  updateReview
};
