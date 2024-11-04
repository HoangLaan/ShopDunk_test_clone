const purchaseOrdersService = require('./purchase-orders.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

// const getUserList = async (req, res, next) => {
//     try {
//         const serviceRes = await performanceReportService.getUserList(req.query);
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }
//         return res.json(new SingleResponse(serviceRes.getData()));
//     } catch (error) {
//         return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//     }
// };

const getStoreOptions = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getStoreListByBusiness(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const dataRes = serviceRes.getData();
        return res.json(new SingleResponse(dataRes));
    } catch (error) {
        return next(error);
    }
};

const getPurchaseOrderId = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getPurchaseOrderId();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const dataRes = serviceRes.getData();
        return res.json(new SingleResponse(dataRes));
    } catch (error) {
        return next(error);
    }
};
const getListCustomerDeboune = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getListCustomerDeboune(
            Object.assign(req.body, req.params, req.query),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getListPurchaseOrder = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getListPurchaseOrder(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};
const createPurchaseOrder = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.createOrUpdatePurchaseOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PURCHASEORDER.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const detailPurchaseOrder = async (req, res, next) => {
    try {
        // Check PurchaseRequisition exists
        const serviceRes = await purchaseOrdersService.detailPurchaseOrder(req.params.purchase_order_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getDoAndPo = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getDoAndPo(req.params.purchase_order_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updatePurchaseOrder = async (req, res, next) => {
    try {
        // Check  exists
        const serviceResDetail = await purchaseOrdersService.detailPurchaseOrder(req.body.purchase_order_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await purchaseOrdersService.createOrUpdatePurchaseOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.PURCHASEORDER.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
const deletePurchaseOrder = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.deletePurchaseOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.PURCHASEORDER.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const detailListPurchaseOrder = async (req, res, next) => {
    try {
        // Check PurchaseRequisition exists
        const serviceRes = await purchaseOrdersService.detailListPurchaseOrder(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
// const exportExcelPerformanceReport = async (req, res, next) => {
//     try {
//         const serviceRes = await performanceReportService.exportExcelPerformanceReport(req.query);
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }

//         const dataRes = serviceRes.getData();
//         dataRes.write('performance-report.xlsx', res);
//     } catch (error) {
//         return next(error);
//     }
// };

const countOrderStatus = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.countOrderStatus(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListRequestPurchaseOrderOptions = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getListRequestPurchaseOrderOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getDoAndPoMulti = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getDoAndPoMulti(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getCustomerOptions = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getCustomerOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOrderOptions = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getOrderOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getProductsOfOrder = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getProductsOfOrder(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListPurchaseOrderReturned = async (req, res, next) => {
    try {
        const serviceRes = await purchaseOrdersService.getListPurchaseOrderReturned(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getStoreOptions,
    getPurchaseOrderId,
    getListCustomerDeboune,
    getListPurchaseOrder,
    detailPurchaseOrder,
    updatePurchaseOrder,
    createPurchaseOrder,
    deletePurchaseOrder,
    getDoAndPo,
    countOrderStatus,
    detailListPurchaseOrder,
    getDoAndPo,
    getListRequestPurchaseOrderOptions,
    // getUserList,
    // exportExcelPerformanceReport,
    getDoAndPoMulti,
    getCustomerOptions,
    getOrderOptions,
    getProductsOfOrder,
    getListPurchaseOrderReturned,
};
