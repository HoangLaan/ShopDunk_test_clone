const SingleResponse = require('../../common/responses/single.response');
const zaloOAService = require('./zalo-oa.service');
const ListResponse = require('../../common/responses/list.response');

const getOAInfo = async (req, res, next) => {
    try {
        const serviceRes = await zaloOAService.getOAInfo(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
};

const sendTextMessage = async (req, res, next) => {
    try {
        const serviceRes = await zaloOAService.sendTextMessage(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
};

const sendZNS = async (req, res, next) => {
    try {
        const serviceRes = await zaloOAService.sendZNS(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
};

const getListTemplate = async (req, res, next) => {
  try {
      const serviceRes = await zaloOAService.getListTemplate(req.body);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), ''));
  } catch (error) {
      return next(error);
  }
};

const getTemplateById = async (req, res, next) => {
  try {
      const serviceRes = await zaloOAService.getTemplateById(req.query.template_id);
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData(), ''));
  } catch (error) {
      return next(error);
  }
};

const sendZNSZaloPay = async (req, res, next) => {
    try {
        const serviceRes = await zaloOAService.sendZNSZaloPay(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOAInfo,
    sendTextMessage,
    sendZNS,
    getListTemplate,
    getTemplateById,
    sendZNSZaloPay
};
