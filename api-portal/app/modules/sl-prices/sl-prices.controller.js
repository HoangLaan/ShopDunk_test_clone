const priceService = require('./sl-prices.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ErrorResponse = require('../../common/responses/error.response');
const optionService = require('../../common/services/options.service');
const httpStatus = require('http-status');
const outputTypeService = require('../output-type/output-type.service');
const _ = require('lodash');
/**
 * Get list SL_PRICES
 */
const getListPrice = async (req, res, next) => {
    try {
        const serviceRes = await priceService.getListPrice(Object.assign({}, req.query, req.body));
        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};
const getListOutputType = async (req, res, next) => {
    try {
        const serviceRes = await outputTypeService.getListOutputType(req.query);
        let datatemp = serviceRes.getData().data;
        if (datatemp && datatemp.length) {
            for (const outputtype of datatemp) {
                outputtype.price_review_lv_users = [];
                // eslint-disable-next-line no-await-in-loop
                const serviceRes = await priceService.getListPriceReviewLVUser(outputtype.output_type_id);
                outputtype.price_review_lv_users = serviceRes.getData();
            }
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a SL_PRICES
 */
const createPrice = async (req, res, next) => {
    try {
        req.body.price_id = null;
        const serviceRes = await priceService.createPrice(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SL_PRICES.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update the SL_PRICES
 */
const updatePrice = async (req, res, next) => {
    try {
        const bodyParams = req.body;
        const priceId = req.params.priceId;
        bodyParams.price_id = priceId;

        // Update slPrice
        const serviceRes = await priceService.updatePrice(bodyParams);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SL_PRICES.UPDATE_SUCCESS));
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

/**
 * Delete the SL_PRICES
 */
const deletePrice = async (req, res, next) => {
    try {
        const priceId = req.params.priceId;
        // Delete slPrice
        const dataDelete = {
            price_id: priceId,
            user_name: req.auth.user_name,
        };

        const serviceRes = await priceService.deletePrice(dataDelete);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.SL_PRICES.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail the SL_PRICES
 */
const detailPrice = async (req, res, next) => {
    try {
        // Check slPrice exists
        const serviceRes = await priceService.detailPrice(req.params.productId, Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail the SL_PRICES by product
 */
const detailPriceProduct = async (req, res, next) => {
  try {
      // Check slPrice exists
      const serviceRes = await priceService.detailPriceProduct(req.params.productId, Object.assign({}, req.query, req.body));
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
 * Get detail the SL_PRICES
 */
const valueOutPutType = async (req, res, next) => {
    try {
        // Check slPrice exists
        const serviceRes = await priceService.valueOutPutType(req.params.outputtypeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail the SL_PRICES
 */
const valueAreaOutPutType = async (req, res, next) => {
    try {
        // Check slPrice exists
        const serviceRes = await priceService.valueAreaOutPutType(req.params.outputtypeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail the SL_PRICES
 */
const valueUnitOutPutType = async (req, res, next) => {
    try {
        // Check slPrice exists
        const serviceRes = await priceService.valueUnitOutPutType(req.params.outputtypeId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Change status the SL_PRICES
 */
const changeStatusPrice = async (req, res, next) => {
    try {
        const priceId = req.params.priceId;
        // Update status
        const dataUpdate = {
            price_id: priceId,
            is_active: req.body.is_active,
            user_name: req.auth.user_name,
        };
        const serviceResUpdate = await priceService.changeStatusPrice(dataUpdate);
        if (serviceResUpdate.isFailed()) {
            return next(serviceResUpdate);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.SL_PRICES.CHANGE_STATUS_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const approvedPriceReviewList = async (req, res, next) => {
    try {
        const serviceRes = await priceService.approvedPriceReviewList(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const listAreaByOutputType = async (req, res, next) => {
    try {
        const serviceRes = await priceService.listAreaByOutputType(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const listBussinessByArea = async (req, res, next) => {
    try {
        const serviceRes = await priceService.listBussinessByArea(req.query);
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
        const serviceRes = await priceService.exportExcel(req.query);
        const wb = serviceRes.getData();
        wb.write('PRICES.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const exportExcelPriceList = async (req, res, next) => {
    try {
        const serviceRes = await priceService.exportExcelPriceList(req.query);
        const wb = serviceRes.getData();
        wb.write('PRICES_LIST.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsPrices
 */
const getOptionsOutPutType = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SL_PRICES_OUTPUTTYPE', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsPrices
 */
const getOptionsReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SL_PRICES_REVIEWLEVEL', req.query.ids);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsPrices
 */
const getOptionsReviewLevelUser = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SL_PRICES_LV_USER', req.query.ids);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsPrices
 */
const getOptionsArea = async (req, res, next) => {
    try {
        const serviceRes = await optionService('MD_AREA', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsPrices
 */
const getOptionsBusiness = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SL_PRICES_BUSINESS', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list getOptsPrices
 */
const getOptionsVat = async (req, res, next) => {
    try {
        const serviceRes = await optionService('SL_OUTPUTTYPE_VAT', req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail the SL_PRICES
 */
const checkVat = async (req, res, next) => {
    try {
        // Check slPrice exists
        const serviceRes = await priceService.checkVat(req.params.productId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const reviewPrice = async (req, res, next) => {
    try {
        const serviceRes = await priceService.reviewPrice(req.params.priceId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, serviceRes.getData()));
    } catch (error) {
        return next(error); 
    }
};

const changePriceMultiProduct = async (req, res, next) => {
    try {
        req.body.price_id = null;
        const serviceRes = await priceService.changePriceMultiProduct(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.SL_PRICES.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

// search for stocks detail
const getListPriceProductHistory = async (req, res, next) => {
    try {
        const serviceRes = await priceService.getListPriceProductHistory(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const reviewListPrice = async (req, res, next) => {
    try {
        const serviceRes = await priceService.reviewListPrice(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// detail product
const detailProduct = async (req, res, next) => {
    try {
        const serviceRes = await priceService.detailProduct(Object.assign({}, req.params, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListProductAndComponent = async (req, res, next) => {
    try {
        const serviceRes = await priceService.getListProductAndComponent(req.query);
        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail the SL_PRICES by option
 */
const detailPriceByOption = async (req, res, next) => {
  try {
      // Check slPrice exists
      const serviceRes = await priceService.detailPriceByOption(req.params.productId, Object.assign({}, req.query, req.body));
      if (serviceRes.isFailed()) {
          return next(serviceRes);
      }
      const { data, total, page, limit } = serviceRes.getData();
      return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
      return next(error);
  }
};

// detail model
const detailModelAttribute = async (req, res, next) => {
  try {
      const serviceRes = await priceService.detailModelAttribute(Object.assign({}, req.params, req.query));
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
        const serviceRes = await priceService.downloadExcel();
        const wb = serviceRes.getData();
        wb.write('PRICEIMPORTTEMPALTE.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const importExcel = async (req, res, next) => {
    try {
        if (!Boolean(req.file))
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));
 
        let serviceRes = await priceService.importExcel(req.body, req.file, req.auth);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListPrice,
    createPrice,
    updatePrice,
    deletePrice,
    detailPrice,
    changeStatusPrice,
    approvedPriceReviewList,
    getListOutputType,
    listAreaByOutputType,
    listBussinessByArea,
    exportExcel,
    exportExcelPriceList,
    getOptionsOutPutType,
    getOptionsReviewLevel,
    getOptionsReviewLevelUser,
    getOptionsArea,
    getOptionsBusiness,
    getOptionsVat,
    valueOutPutType,
    valueAreaOutPutType,
    valueUnitOutPutType,
    reviewPrice,
    changePriceMultiProduct,
    getListPriceProductHistory,
    reviewListPrice,
    detailProduct,
    getListProductAndComponent,
    detailPriceByOption,
    detailModelAttribute,
    detailPriceProduct,
    downloadExcel,
    importExcel,
};
