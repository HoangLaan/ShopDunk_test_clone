const httpStatus = require('http-status');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const path = require('path');
const appRootPath = require('app-root-path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/receivePaymentSlip`);
const formidable = require('formidable');
const { mkdirp } = require('mkdirp');
const fs = require('fs');

const service = require('./receive-payment-slip.service');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await service.getList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const deleteList = async (req, res, next) => {
    try {
        const serviceRes = await service.deleteList(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.CONTRACT.DELETE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const statistics = async (req, res, next) => {
    try {
        const serviceRes = await service.statistics(Object.assign(req.body, req.query));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const bookkeeping = async (req, res, next) => {
    try {
        const serviceRes = await service.bookkeeping(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const unBookkeeping = async (req, res, next) => {
    try {
        const serviceRes = await service.unBookkeeping(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDeptAccountingAccountOpts = async (req, res, next) => {
    try {
        const serviceRes = await service.deptAccountingAccountOpts(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getCreditAccountingAccountOpts = async (req, res, next) => {
    try {
        const serviceRes = await service.creditAccountingAccountOpts(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getReceiveTypeOpts = async (req, res, next) => {
    try {
        const serviceRes = await service.receiveTypeOpts(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getPaymentSlipTypeOpts = async (req, res, next) => {
    try {
        const serviceRes = await service.paymentTypeOpts(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getBusinessOptionsByUser = async (req, res, next) => {
    try {
        const serviceRes = await service.businessOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStoreOptionsByUser = async (req, res, next) => {
    try {
        const serviceRes = await service.storeOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await service.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('item.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const downloadExcel = async (req, res, next) => {
    try {
        const serviceRes = await service.downloadExcel();
        const wb = serviceRes.getData();
        wb.write('ITEMIMPORTTEMPALTE.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const importExcel = async (req, res, next) => {
    try {
        if (!fs.existsSync(pathMediaUpload)) {
            await mkdirp(pathMediaUpload);
        }

        const form = formidable({
            multiples: false,
            uploadDir: pathMediaUpload,
            maxFileSize: 4 * 1024 * 1024 * 1024,
            hash: true,
            keepExtensions: true,
        });

        form.onPart = function (part) {
            if (!part.filename || part.filename.match(/\.(xlsx)$/i)) {
                this.handlePart(part);
            } else {
                return next(
                    new ErrorResponse(
                        httpStatus.BAD_REQUEST,
                        null,
                        `Tập tin “${part.filename}” tải lên không đúng định dạng.`,
                    ),
                );
            }
        };

        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            let { path: path_upload } = files && files.itemimport;
            if (!path_upload)
                return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, 'Vui lòng chọn tập tin tải lên.'));
            service.importExcel(Object.assign(req.body, req.query, req.params, { path_upload })).then((serviceRes) => {
                if (serviceRes.isFailed()) {
                    return next(serviceRes);
                }
                return res.json(new SingleResponse(serviceRes.getData()));
            });
        });
    } catch (error) {
        return next(error);
    }
};

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await service.exportPDF(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const serviceRes = await service.updateReview(req.body);
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
    deleteList,
    getDeptAccountingAccountOpts,
    getCreditAccountingAccountOpts,
    getReceiveTypeOpts,
    getPaymentSlipTypeOpts,
    getBusinessOptionsByUser,
    getStoreOptionsByUser,
    statistics,
    bookkeeping,
    unBookkeeping,
    exportExcel,
    importExcel,
    downloadExcel,
    exportPDF,
    updateReview,
};
