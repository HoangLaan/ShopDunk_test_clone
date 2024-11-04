const paymentSlipService = require('./payment-slip.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const httpStatus = require('http-status');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');
const MailService = require('../../common/services/mail.service');
const { barcodeCurrency, formatCurrency } = require('../../common/helpers/numberFormat');
const optionService = require('../../common/services/options.service');

/**
 * Get list stocksType
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const getOptionsExpendType = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getOptionsExpendType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getOptionsPayer = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getOptionsPayer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const createPaymentSlip = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PAYMENTSLIP.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updatePaymentSlip = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PAYMENTSLIP.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getCountByDate = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getCountByDate(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const detailPaymentSlip = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.detailPaymentSlip(Object.assign({}, req.params, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getPaymentSlipImage = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getPaymentSlipImage(req.params.paymentSlipId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.exportPDF(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const genPaymentSlipCode = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.genPaymentSlipCode(req.query);
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
        if (!req.files || !req.files.length)
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));
        let file = req.files[0];
        if (file.buffer || !file.includes(config.domain_cdn)) {
            url = await fileHelper.saveFileV2(file);
        } else {
            url = file.split(config.domain_cdn)[1];
        }
        return res.json(
            new SingleResponse({
                file_name: file.originalname,
                file_url: `${url}`,
            }),
        );
    } catch (error) {
        console.log(error);
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteFile = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.deleteFile(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const approvedReviewList = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.approvedReviewList(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        // Lay thong tin phieu chi
        const { paymentSlipId } = req.params;
        const serviceDetailRes = await paymentSlipService.detailPaymentSlip(Object.assign({}, req.body, req.params));
        if (serviceDetailRes.isFailed()) {
            return next(serviceDetailRes);
        }
        // Chi gui mail neu duyet la dong y
        if (req.body.is_review) {
            // Gui thong tin duyet tiep theo
            let mail = serviceDetailRes.getData();
            if (mail.total_money) mail.total_money_text = barcodeCurrency(mail.total_money);
            const users = (mail.review_level_list || [])
                .filter((x) => !x.is_auto_review && !x.review_date)
                .map((x) => ({ ...x, user_name: x.review_user }));
            mail.review_link = `/payment-slip/detail/${paymentSlipId}`;
            if (users && users.length) {
                mail.users = [users[0]];
            }
            // Neu có user send thì mới send
            if (mail.users && mail.users.length) {
                const serviceSendRes = await MailService.sendToInside(mail, 'PAYMENTSLIP');
                if (serviceSendRes.isFailed()) {
                    return next(serviceSendRes);
                }
            }
        }
        return res.json(new SingleResponse(serviceDetailRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getReceiverOptions = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getReceiverOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getListOrder = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getListOrder(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getReviewLevelByExpendType = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getReviewLevelByExpendType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const downloadFile = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.downloadFile(req.params.file_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { file_url, file_name } = serviceRes.getData();

        if (!file_name) {
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, RESPONSE_MSG.RECEIVESLIP.FILE_NOT_FOUND));
        }

        const axios = require('axios');
        const response = await axios({
            method: 'get',
            url: file_url,
            responseType: 'stream',
        });

        // res.setHeader('Content-disposition', 'attachment; filename=' + file_name);

        res.attachment(file_name);
        response.data.pipe(res);
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListReviewByExpendType = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getReviewListByExpendType(req.params.expendTypeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getInvoiceOptions = async (req, res, next) => {
    try {
        const serviceRes = await paymentSlipService.getInvoiceOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

module.exports = {
    getOptionsExpendType,
    getOptionsPayer,
    createPaymentSlip,
    updatePaymentSlip,
    getCountByDate,
    detailPaymentSlip,
    getPaymentSlipImage,
    exportPDF,
    genPaymentSlipCode,
    upload,
    deleteFile,
    approvedReviewList,
    getReceiverOptions,
    getListOrder,
    getReviewLevelByExpendType,
    downloadFile,
    getListReviewByExpendType,
    getInvoiceOptions,
};
