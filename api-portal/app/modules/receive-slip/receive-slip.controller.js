const httpStatus = require('http-status');
const receiveslipService = require('./receive-slip.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.getList(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, statistic } = serviceRes.getData();
        let response = new ListResponse(data, total, page, limit);
        if (statistic) {
            response.setData({ statistic });
        }
        return res.json(response);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailReceiveSlip = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.detail(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createReceiveSlip = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.RECEIVESLIP.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createListReceiveSlip = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.createListReceiveSlip(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.RECEIVESLIP.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updateReceiveSlip = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.RECEIVESLIP.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getCashierByCompanyId = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.getCashierByCompanyId({ ...req.query, ...req.body });
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const genReceiveSlipCode = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.genReceiveSlipCode(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const upload = async (req, res, next) => {
    try {
        if (!req.files || !req.files[0])
            return next(
                new ErrorResponse(
                    httpStatus.NOT_IMPLEMENTED,
                    RESPONSE_MSG.REQUEST_FAILED,
                    'Tải tệp lên không thành công !',
                ),
            );
        const file = req.files[0];
        if (file.buffer || !file.includes(config.domain_cdn)) {
            url = await fileHelper.saveFileV2(file);
        } else {
            url = file.split(config.domain_cdn)[1];
        }
        return res.json(
            new SingleResponse({
                attachment_name: file.originalname,
                attachment_path: `${url}`,
            }),
        );
    } catch (error) {
        return next(error);
    }
};

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.exportPDF(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const confirmReceiveMoney = async (req, res, next) => {
    try {
        const serviceRes = await receiveslipService.confirmReceiveMoney(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getList,
    detailReceiveSlip,
    createReceiveSlip,
    updateReceiveSlip,
    getCashierByCompanyId,
    genReceiveSlipCode,
    upload,
    exportPDF,
    createListReceiveSlip,
    confirmReceiveMoney,
};
