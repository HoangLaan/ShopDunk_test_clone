const RegimeService = require('./regime.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const config = require('../../../config/config');

const getListRegime = async (req, res, next) => {
  try {
    const serviceRes = await RegimeService.getListRegime(req.query);
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(error);
  }
};

const createRegime = async (req, res, next) => {
  try {
    req.body = JSON.parse(req.body.data)
    const serviceRes = await RegimeService.createOrUpdateRegime(req.body, req.files, req.auth);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse([]));
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const updateRegime = async (req, res, next) => {
  try {
    req.body = JSON.parse(req.body.data)
    req.body.regime_id = req.params.regime_id
    const serviceRes = await RegimeService.createOrUpdateRegime(req.body, req.files, req.auth);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse([]));
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const getListReviewRegime = async (req, res, next) => {
  try {
    const serviceRes = await RegimeService.getListReviewRegime(req.query);
    const {data} = serviceRes.getData();
    return res.json(new SingleResponse(data));
  } catch (error) {
    return next(error);
  }
};

const detailRegime = async (req, res, next) => {
  try {
    const serviceRes = await RegimeService.detailRegime(req.params.regime_id);
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const deleteRegime = async (req, res, next) => {
  try {
    const serviceRes = await RegimeService.deleteRegime(req.params.regime_id, req.body);

    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

module.exports = {
  getListRegime,
  createRegime,
  getListReviewRegime,
  detailRegime,
  updateRegime,
  deleteRegime
}
