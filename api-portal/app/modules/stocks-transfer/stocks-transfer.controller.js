const stocksTransferService = require('./stocks-transfer.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list Stocks Transfer
 */
const getListStocksTransfer = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.getListStocksTransfer(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * createStocksTransfer
 */
const createStocksTransfer = async (req, res, next) => {
    try {
        req.body.stocks_transfer_id = null;
        const serviceRes = await stocksTransferService.createOrUpdateStocksTransfer(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'CREATE_SUCCESS'));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a ST_STOCKSTRANFERTYPE
 */
const updateStocksTransfer = async (req, res, next) => {
    try {
        const stocks_transfer_id = req.params.stocks_transfer_id;
        req.body.stocks_transfer_id = stocks_transfer_id;

        // Check stocksTranferType exists
        const serviceResDetail = await stocksTransferService.detailStocksTransfer(
            Object.assign({}, req.body, req.params),
        );

        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update stocksTranferType
        const serviceRes = await stocksTransferService.createOrUpdateStocksTransfer(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'UPDATE_SUCCESS'));
    } catch (error) {
        return next(error);
    }
};

/**
 * Gen detailStocksTransfer
 */
const detailStocksTransfer = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.detailStocksTransfer(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Gen getUserOpts
 */
const getUserOpts = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.getUserOpts(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getSysUserOpts = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.getSysOpts(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
/**
 * Gen deleteStocksTransfer
 */
const deleteStocksTransfer = async (req, res, next) => {
    try {
        const stocks_transfer_id = req.params.stocks_transfer_id;
        // Check stocksTranferType exists
        const serviceResDetail = await stocksTransferService.detailStocksTransfer(
            Object.assign({}, req.body, req.params),
        );
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Delete area
        const serviceRes = await stocksTransferService.deleteStocksTransfer(stocks_transfer_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, 'DELETE_SUCCESS'));
    } catch (error) {
        return next(error);
    }
};
/**
 * Gen genStocksTransferCode
 */
const genStocksTransferCode = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.genStocksTransferCode(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
/**
 * Gen getProductTransfer
 */
const getProductTransfer = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.getProductTransfer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Gen genReviewLevel
 */
const genReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.genReviewLevel(req.params.stocks_transfer_type_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * reviewStocksTransferReview
 */
const reviewStocksTransferReview = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.reviewStocksTransferReview(
            Object.assign({}, req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const downloadExcel = async (req, res, next) => {
    try {
        req.query.auth_id = req.body.auth_id;
        const serviceRes = await stocksTransferService.downloadExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('PRODUCTTEMPLATE.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const uploadExcel = async (req, res, next) => {
    try {
        const _files = req.files;

        if (_files && _files.length) {
            const path_upload = _files[0].path + '';

            const serviceRes = await stocksTransferService.readExcel(
                Object.assign(req.body, req.query, req.params, { path_upload }),
            );
            if (serviceRes.isFailed()) {
                return next(serviceRes);
            }

            return res.json(new SingleResponse(serviceRes.getData()));
        }

        return res.json(new SingleResponse(null, ''));
    } catch (error) {
        return next(error);
    }
};

/**
 * Gen detailStocksTransfer
 */
const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.exportPDF(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const confirmTranferProduct = async (req, res, next) => {
    try {
        const serviceResDetail = await stocksTransferService.detailStocksTransfer(
            Object.assign({}, req.body, req.params),
        );
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await stocksTransferService.confirmTranferProduct(
            Object.assign({}, req.body, req.params, serviceResDetail.getData()),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const checkProductInventory = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.checkProductInventory(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStocksByCode = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.getStocksByCode(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getGeneralStocks = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.getGeneralStocks(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getProductTransferByImei = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.getProductTransferByImei(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
}

const getInfoStocks = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.getInfoStocks(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateStatusTransfer = async (req, res, next) => {
    try {
        const serviceRes = await stocksTransferService.updateStatusTransfer(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListStocksTransfer,
    getUserOpts,
    deleteStocksTransfer,
    genStocksTransferCode,
    getProductTransfer,
    genReviewLevel,
    createStocksTransfer,
    detailStocksTransfer,
    updateStocksTransfer,
    reviewStocksTransferReview,
    downloadExcel,
    uploadExcel,
    exportPDF,
    confirmTranferProduct,
    getProductTransferByImei,
    getGeneralStocks,
    getSysUserOpts,
    checkProductInventory,
    getStocksByCode,
    getInfoStocks,
    updateStatusTransfer
};
