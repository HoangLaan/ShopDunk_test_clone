const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const interestContentService = require('./interest-content.service');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await interestContentService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const serviceRes = await interestContentService.getById(req.params.id);
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
    const serviceRes = await interestContentService.createOrUpdate(req.body);
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
    const serviceRes = await interestContentService.delete(req.body);
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
};
