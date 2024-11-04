const requestPurchaseOrderService = require('./request-purchase-order.service');
const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');

const generateCode = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.generateCode();
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
        const serviceRes = await requestPurchaseOrderService.createOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const purchaseSamSung = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.purchaseSamSung(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getList = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.getList(req.query, req.body);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const detail = async (req, res, next) => {
    try {
        const requestPurchaseId = req.params.requestPurchaseId;
        const serviceRes = await requestPurchaseOrderService.detail(requestPurchaseId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getPRProduct = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.getPRProduct(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const searchPurchaseRequisition = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.searchPurchaseRequisition(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit, totalQuantity } = serviceRes.getData();
        const response = new ListResponse(data, total, page, limit);
        response.data.totalQuantity = totalQuantity;
        return res.json(response);
    } catch (error) {
        return next(error);
    }
};

const _delete = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.delete(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Xóa đơn đặt hàng thành công'));
    } catch (error) {
        return next(error);
    }
};

const print = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.print(req.params.requestPurchaseId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOrderHistory = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.getOrderHistory(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const detailByCode = async (req, res, next) => {
    try {
        const requestPurchaseCode = req.params.requestPurchaseCode;
        const serviceRes = await requestPurchaseOrderService.detailByCode(requestPurchaseCode);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const countIsOrdered = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.countIsOrdered(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailByMultiPO = async (req, res, next) => {
    try {
        const requestPurchaseCode = req.body;
        const serviceRes = await requestPurchaseOrderService.detailByMultiPO(requestPurchaseCode);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getUserByDepartmentId = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.getUserByDepartmentId(req.query);
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
        const serviceRes = await requestPurchaseOrderService.updateReview(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStoreOptionsByPurchaseRequisitionIds = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.getStoreOptionsByPurchaseRequisitionIds(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getPriceNearly = async (req, res, next) => {
    try {
        const serviceRes = await requestPurchaseOrderService.getPriceNearly(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    generateCode,
    createOrUpdate,
    delete: _delete,
    getList,
    detail,
    getPRProduct,
    searchPurchaseRequisition,
    print,
    getOrderHistory,
    detailByCode,
    countIsOrdered,
    detailByMultiPO,
    getUserByDepartmentId,
    updateReview,
    getStoreOptionsByPurchaseRequisitionIds,
    getPriceNearly,
    purchaseSamSung,
};
