const service = require('./purchase-requisition.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const fileHelper = require('../../common/helpers/file.helper');

const getList = async (req, res, next) => {
    try {
        const serviceRes = await service.getList(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const deletePurchaseRequisition = async (req, res, next) => {
    try {
        const serviceRes = await service.deletePurchaseRequisition(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.REQUESTPURCHASE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const serviceRes = await service.getById(req.params.purchase_requisition_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createPurchaseRequisition = async (req, res, next) => {
    try {
        const _body = JSON.parse(JSON.stringify(req.body));
        _body.purchase_requisition_id = null;
        _body.auth_id = req.auth.user_id;
        _body.auth_name = req.auth.user_name;
        if (req.file && req.file.buffer) {
            _body.document_name = req.file.originalname;
            _body.document_url = await fileHelper.saveFileV2(req.file);
        }

        const serviceRes = await service.createOrUpdate(_body, req.file);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.REQUESTPURCHASE.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const updatePurchaseRequisition = async (req, res, next) => {
    try {
        // Check  exists
        const serviceResDetail = await service.getById(req.body.purchase_requisition_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const _body = JSON.parse(JSON.stringify(req.body));
        _body.auth_id = req.auth.user_id;
        _body.auth_name = req.auth.user_name;
        if (req.file && req.file.buffer) {
            _body.document_name = req.file.originalname;
            _body.document_url = await fileHelper.saveFileV2(req.file);
        }

        // Update
        const serviceRes = await service.createOrUpdate(_body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.REQUESTPURCHASE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await service.exportPDF(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await optionService('PO_PURCHASEREQUISITION', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getUserOptions = async (req, res, next) => {
    try {
        const serviceRes = await service.getUserOptions(req.query);
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
        const serviceRes = await service.getReviewLevelList(req.query);

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
        const serviceRes = await service.createReviewLevel(req.body);
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
        const serviceRes = await service.deleteReviewLevel(req.body);
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
        const serviceRes = await service.getReviewInformation({
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
        const serviceRes = await service.updateReview(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const countPrStatus = async (req, res, next) => {
    try {
        const serviceRes = await service.countPrStatus(req.query);
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
    deletePurchaseRequisition,
    createPurchaseRequisition,
    updatePurchaseRequisition,
    exportPDF,
    getOptions,
    getUserOptions,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
    getReviewInformation,
    updateReview,
    countPrStatus,
};
