const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const zaloTemplateService = require('./zalo-template.service');
const fileHelper = require('../../common/helpers/file.helper');

const getList = async (req, res, next) => {
  try {
    const serviceRes = await zaloTemplateService.getList(req.query);
    const { data, total, page, limit } = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const serviceRes = await zaloTemplateService.getById(req.params.id);
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
    const serviceRes = await zaloTemplateService.createOrUpdate(req.body);
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
    const serviceRes = await zaloTemplateService.delete(req.body);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const getListHistory = async (req, res, next) => {
  try {
    const serviceRes = await zaloTemplateService.getListHistory(req.query);
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
  getListHistory
};
