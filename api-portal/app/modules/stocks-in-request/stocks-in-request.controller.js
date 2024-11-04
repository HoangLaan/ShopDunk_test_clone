const stocksInRequestService = require('./stocks-in-request.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');
const appRootPath = require('app-root-path');
const path = require('path');
const pathMediaUpload = path.normalize(`${appRootPath}/storage/uploads/stocksinrequest`);
const formidable = require('formidable');
const httpStatus = require('http-status');
const { mkdirp } = require('mkdirp');
const fs = require('fs');
const config = require('../../../config/config');
/**
 * Get list getOptsStocksStatus
 */
const getOptsStocksStatus = async (req, res, next) => {
    try {
        const serviceRes = await optionService('ST_STOCKSSTATUS', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsStocks
 */
const getOptsStocks = async (req, res, next) => {
    try {
        const serviceRes = await optionService('ST_STOCKS', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Gen genDataByStocksInTypeId
 */
const genDataByStocksInTypeId = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.genDataByStocksInTypeId(req.params.stocks_in_type_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Gen genCostValue
 */
const genCostValue = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.genCostValue(req.params.cost_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getListDescription
 */
const getListDescription = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SYS_APPCONFIG_DESCRIPTION', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStocksManager = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getStocksManager(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getVehicleList = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getVehicleList(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get list stocksInRequest
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListStocksInRequest = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getListStocksInRequest(Object.assign(req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * detail a stocksInRequest
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailStocksInRequest = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.detailStocksInRequest(req.params.stocksInRequestId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailToPrint = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.detailToPrint(req.params.stocksInRequestId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteStocksInRequest = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await stocksInRequestService.deleteStocksInRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKSINREQUEST.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status
 */
const changeStatusStocksInRequest = async (req, res, next) => {
    try {
        const stocksInRequestId = req.params.stocksInRequestId;
        const serviceResDetail = await stocksInRequestService.detailStocksInRequest(stocksInRequestId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update status
        const serviceRes = await stocksInRequestService.changeStatusStocksInRequest(stocksInRequestId, req.body);
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSINREQUEST.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createStocksInRequest = async (req, res, next) => {
    try {
        req.body.stocksInRequest = null;
        const serviceRes = await stocksInRequestService.createOrUpdateStocksInRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSINREQUEST.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateStocksInRequest = async (req, res, next) => {
    try {
        const stocksInRequestId = req.params.stocksInRequestId;
        req.body.stocksInRequestId = stocksInRequestId;
        const serviceResDetail = await stocksInRequestService.detailStocksInRequest(stocksInRequestId);

        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await stocksInRequestService.createOrUpdateStocksInRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSINREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getUnitList = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getUnitList(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const genStocksInCodeStocks = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.genStocksInCodeStocks(req.query.stocks_in_type);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getPhoneNumber = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getPhoneNumber(req.params.driver_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsProductCode
 */
const getOptsProductCode = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getOptsProductCode(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Gen genProductName
 */
const genProductName = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.genProductName(req.params.product_id);
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
        const serviceRes = await stocksInRequestService.exportPDF(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const genLotNumber = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.genLotNumber(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// get discount
const getDiscount = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getDiscount(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const downloadExcel = async (req, res, next) => {
    try {
        req.query.auth_id = req.body.auth_id;
        const serviceRes = await stocksInRequestService.downloadExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('PRODUCTTEMPLATE.xlsx', res);
    } catch (error) {
        return next(error);
    }
};
const downloadExcelư = async (req, res, next) => {
    try {
        //save the file to the public/exports folder
        var file = fs.writeFileSync('./public/exports/' + fileName, xls, 'binary');
        //send the results to the frontend
        res.json(200).json({ results: results, fileName: fileName });

        const fileName = 'Task' + '_Template.xlsx';
        const tempFilePath = __dirname + '\\public\\template\\' + fileName;
        workbook.xlsx.writeFile(tempFilePath).then(function () {
            res.send(fileName);
        });

        res.attachment('test.xlsx');
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
        const serviceRes = await stocksInRequestService.downloadExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('STOCKSINREQUESTEMPLATE.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

// get status output
const getOutputStatus = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getOutputStatus(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getUnitPriceList = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getUnitPriceList(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const changeUnitPrice = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.changeUnitPrice(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsProductType
 */
const getOptsProductType = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_PRODUCTTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const uploadExcel = async (req, res, next) => {
    try {
        if (!fs.existsSync(pathMediaUpload)) {
            mkdirp(pathMediaUpload).then(console.log(pathMediaUpload)).catch(console.error(pathMediaUpload));
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
            let { path: path_upload = null } = files && files.productsImport ? files.productsImport : {};
            const { stocks_id } = fields;
            if (!path_upload) return res.json(new SingleResponse(null));
            stocksInRequestService
                .readFileExcel(Object.assign({}, req.body, req.query, { stocks_id, path_upload }))
                .then(async (serviceRes) => {
                    if (serviceRes.isFailed()) {
                        return next(serviceRes);
                    }
                    const { product_list } = serviceRes.getData();

                    const checkDuplicateSkus = (productList) => {
                        const skuMap = {};
                        for (const product of productList) {
                            const sku = product.skus[0].sku;
                            if (skuMap[sku]) {
                                // Nếu sku đã tồn tại trong skuMap, có ít nhất một sku trùng lặp
                                return true;
                            }
                            skuMap[sku] = true;
                        }
                        // Nếu không có sku nào trùng lặp
                        return false;
                    };

                    const hasDuplicateSkus = checkDuplicateSkus(product_list);
                    if (hasDuplicateSkus) {
                        return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, `Imei trong file excel bị trùng.`));
                    }

                    //Kiểm tra imei đã tồn tại trong database chưa
                    await Promise.all(
                        product_list.map(async (item) => {
                            const found = await stocksInRequestService.checkImeiCodeInRequest({
                                imei: item?.skus[0]?.sku,
                            });
                            if (found.getData() == 1) {
                                return next(
                                    new ErrorResponse(
                                        httpStatus.BAD_REQUEST,
                                        null,
                                        `Imei “${item?.skus[0]?.sku}” đã tồn tại.`,
                                    ),
                                );
                            }
                        }),
                    );

                    return res.json(new SingleResponse(serviceRes.getData()));
                });
        });
    } catch (error) {
        return next(error);
    }
};

const getInit = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getInit(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getProductOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getProductOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getProductInit = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getProductInit(req.params.product_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStocksInTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getStocksInTypeOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getDetailStocksInType = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getStocksInTypeOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        // Lay stocks in type
        const { stocks_in_type_id = 0 } = req.params;
        if (!stocks_in_type_id)
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, `Không tìm thấy hình thức nhập kho.`));
        const stocksInType = (serviceRes.data || []).find((v) => v.id == stocks_in_type_id);
        if (!stocksInType)
            return next(new ErrorResponse(httpStatus.BAD_REQUEST, null, `Không tìm thấy hình thức nhập kho.`));
        // Lấy mã code
        const { stocks_in_type } = stocksInType;
        const serviceStocksInCodeRes = await stocksInRequestService.genStocksInCodeStocks(stocks_in_type);
        if (serviceStocksInCodeRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse({
                stocks_in_code: serviceStocksInCodeRes.data.stocks_in_code,
                stocks_in_type: stocksInType,
            }),
        );
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('NHAP_KHO.xlsx', res);
    } catch (error) {
        return next(error);
    }
};
const getOptionsUserRequest = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getOptionsUserRequest(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsStocksReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getOptionsStocksReviewLevel(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const approvedReview = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.approvedReview(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSINREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
const getOptionsCustomer = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getOptionsCustomer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
/**
 * Create stocks detail
 */
const createStocksDetail = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.createStocksDetail(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSINREQUEST.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const getInfoOfProductImeiCode = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getInfoOfProductImeiCode(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const checkImeiCode = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.checkImeiCode(Object.assign(req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailSupplierImportProductInStock = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.detailSupplierImportProductInStock(
            Object.assign(req.query, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsPurchase = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getOptionsPurchase(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsPurchaseWhenImportStock = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getOptionsPurchaseWhenImportStock(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionProductStRequestByPurchase = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getOptionProductStRequestByPurchase(
            Object.assign(req.query, req.body),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStoreOptions = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.getStoreOptions(req.query);
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
        const serviceRes = await stocksInRequestService.getCustomerOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateImei = async (req, res, next) => {
    try {
        const serviceRes = await stocksInRequestService.updateImeiInRequest(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKSINREQUEST.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptsStocksStatus,
    getOptsStocks,
    genDataByStocksInTypeId,
    getListStocksInRequest,
    detailStocksInRequest,
    deleteStocksInRequest,
    changeStatusStocksInRequest,
    createStocksInRequest,
    updateStocksInRequest,
    getStocksManager,
    getVehicleList,
    getPhoneNumber,
    genStocksInCodeStocks,
    getOptsProductCode,
    genProductName,
    getUnitList,
    genCostValue,
    getListDescription,
    exportPDF,
    detailToPrint,
    genLotNumber,
    getDiscount,
    downloadExcel,
    getOutputStatus,
    getUnitPriceList,
    changeUnitPrice,
    getOptsProductType,
    uploadExcel,
    getInit,
    // NEW STOCSKINREQUEST
    getProductOptions,
    getProductInit,
    getStocksInTypeOptions,
    getDetailStocksInType,
    exportExcel,
    getOptionsUserRequest,
    getOptionsStocksReviewLevel,
    approvedReview,
    getOptionsCustomer,
    createStocksDetail,
    getInfoOfProductImeiCode,
    checkImeiCode,
    detailSupplierImportProductInStock,
    getOptionsPurchase,
    getOptionProductStRequestByPurchase,
    getStoreOptions,
    getOptionsPurchaseWhenImportStock,
    getCustomerOptions,
    updateImei
};
