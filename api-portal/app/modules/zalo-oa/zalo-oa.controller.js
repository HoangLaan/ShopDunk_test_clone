const SingleResponse = require('../../common/responses/single.response');
const zaloOAService = require('./zalo-oa.service');
const ListResponse = require('../../common/responses/list.response');
const config = require('../../../config/config');
const { default: axios } = require('axios');

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

const getTemplateZaloPayById = async (req, res, next) => {
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

const getListTemplateZaloPay = async (req, res, next) => {
    try {
        const serviceRes = await zaloOAService.getListTemplateZaloPay(req.query);
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
        // const serviceRes = await zaloOAService.sendZNSZaloPay(req.body);
        axios({
            method: 'post',
            url: `${config.domain_service}/zalo-oa/send-zns-zalo-pay`,
            data: {
                ...req.body,
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        }).then((resp) => {
            return res.json(new SingleResponse(true, 'Gửi ZNS thành công'));
        })

        // if (serviceRes.isFailed()) {
        //     return next(serviceRes);
        // }
        // return res.json(new SingleResponse(serviceRes.getData(), ''));
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
    getListTemplateZaloPay,
    getTemplateZaloPayById,
    sendZNSZaloPay
};
