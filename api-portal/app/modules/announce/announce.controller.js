const httpStatus = require('http-status');
const announceService = require('./announce.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const config = require('../../../config/config');
const axios = require('axios');

// const ValidationResponse = require('../../common/responses/validation.response');
// const optionService = require('../../common/services/options.service');
// const apiHelper = require('../../common/helpers/api.helper');

/**
 * Get list
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListAnnounce = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListAnnounce(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListUserView = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListUserView(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListCompany = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListCompany(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

// /**
//  * Create
//  */
const createAnnounce = async (req, res, next) => {
    try {
        const serviceRes = await announceService.createAnnounceOrUpdate(req.body, req.files, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        axios({
            method: 'post',
            url: `${config.domain_service}/announce`,
            data: {
                ...req.body,
                announce_id: serviceRes.getData()?.announce_id || '',
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        })
            .then((response) => {})
            .catch((error) => {})
            .finally(() => {});

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ANNOUNCE.CREATE_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const updateAnnounce = async (req, res, next) => {
    try {
        const announce_id = req.params.announce_id;
        req.body.announce_id = announce_id;

        // Check exists
        const serviceResDetail = await announceService.detailAnnounce(announce_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        // Update
        const serviceRes = await announceService.createAnnounceOrUpdate(req.body, req.files, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.ANNOUNCE.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const detailAnnounce = async (req, res, next) => {
    try {
        const serviceRes = await announceService.detailAnnounce(req.params.announce_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const detailAnnounceView = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getAnnounceView(req.params.announce_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const downloadAttachment = async (req, res, next) => {
    try {
        const serviceRes = await announceService.downloadAttachment(req.params.announce_attachment_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { attachment_path, attachment_name } = serviceRes.getData();

        const axios = require('axios');
        const response = await axios({
            method: 'get',
            url: attachment_path,
            responseType: 'stream',
        });

        res.attachment(attachment_name);
        response.data.pipe(res);
    } catch (error) {
        return next(error);
    }
};

// const updateAnnounce = async (req, res, next) => {
//     try {
//         const announce_id = req.params.announce_id;
//         req.body.announce_id = announce_id;

//         // Check segment exists
//         const serviceResDetail = await stocksService.detailStocks(stocks_id);
//         if (serviceResDetail.isFailed()) {
//             return next(serviceResDetail);
//         }

//         // Update segment
//         const serviceRes = await stocksService.createStocksOrUpdate(req.body);
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }

//         return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS.UPDATE_SUCCESS));
//     } catch (error) {
//         return next(error);
//     }
// };
// /**
//  * Create
//  */
// const createStocksStocksManager = async (req, res, next) => {
//   try {
//     const serviceRes = await stocksService.createStocksOrUpdateStocksManager(req.body);
//     if (serviceRes.isFailed()) {
//       return next(serviceRes);
//     }
//     return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS.CREATE_SUCCESS));
//   } catch (error) {
//     return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//   }
// };

// /**
//  * Update
//  */
// const updateStocks = async (req, res, next) => {
//   try {
//     const stocks_id = req.params.stocks_id;
//     req.body.stocks_id = stocks_id;

//     // Check segment exists
//     const serviceResDetail = await stocksService.detailStocks(stocks_id);
//     if (serviceResDetail.isFailed()) {
//       return next(serviceResDetail);
//     }

//     // Update segment
//     const serviceRes = await stocksService.createStocksOrUpdate(req.body);
//     if (serviceRes.isFailed()) {
//       return next(serviceRes);
//     }

//     return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.STOCKS.UPDATE_SUCCESS));
//   } catch (error) {
//     return next(error);
//   }
// };

// /**
//  * delete
//  *
//  */
// const deleteStocks = async (req, res, next) => {
//   try {
//     // Delete
//     const serviceRes = await stocksService.deleteStocks(req.body);
//     if (serviceRes.isFailed()) {
//       return next(serviceRes);
//     }
//     return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKS.DELETE_SUCCESS));
//   } catch (error) {
//     return next(error);
//   }
// };

// const deleteStocksStocksManager = async (req, res, next) => {
//   try {
//     const stocks_manager_id = req.params.stocks_manager_id;

//     // Check
//     // const serviceResDetail = await stocksService.detailStocks(stocks_id);
//     // if (serviceResDetail.isFailed()) {
//     //   return next(serviceResDetail);
//     // }

//     // Delete
//     const serviceRes = await stocksService.deleteStocksStocksManager(stocks_manager_id, req.body);
//     if (serviceRes.isFailed()) {
//       return next(serviceRes);
//     }
//     return res.json(new SingleResponse(null, RESPONSE_MSG.STOCKS.DELETE_SUCCESS));
//   } catch (error) {
//     return next(error);
//   }
// };

// const getOptions = async (req, res, next) => {
//   try {
//     const serviceRes = await stocksService.getOptions(req.query);
//     if (serviceRes.isFailed()) {
//       return next(serviceResDetail);
//     }
//     return res.json(new SingleResponse(serviceRes.getData()));
//   } catch (error) {
//     return next(error);
//   }
// };

// const getListStoreOptions = async (req, res, next) => {
//   try {
//     const serviceRes = await stocksService.getListStoreOptions(req.query);
//     if (serviceRes.isFailed()) {
//       return next(serviceResDetail);
//     }
//     return res.json(new SingleResponse(serviceRes.getData()));
//   } catch (error) {
//     return next(error);
//   }
// };

const getListAnnounceTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListAnnounceTypeOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceResDetail);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const getOptionsAnnounceReviewLevel = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListReviewLevelByAnnounceTypeId(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
// const getOptionsReviewLevel = async (req, res, next) => {
//     try {
//         const serviceRes = await optionService('ST_STOCKSREVIEWLEVEL', req.query);
//         return res.json(new SingleResponse(serviceRes.getData()));
//     } catch (error) {
//         return next(error);
//     }
// };
// const getOptionsUserReviewLevel = async (req, res, next) => {
//     try {
//         const serviceRes = await announceService.getOptionsUserReviewLevel(req.query);
//         if (serviceRes.isFailed()) {
//             return next(serviceResDetail);
//         }
//         return res.json(new SingleResponse(serviceRes.getData()));
//     } catch (error) {
//         return next(error);
//     }
// };
// const getListUserByStoreIdOptions = async (req, res, next) => {
//   try {
//     const serviceRes = await stocksService.getListUserByStoreIdOptions(req.query);
//     if (serviceRes.isFailed()) {
//       return next(serviceResDetail);
//     }
//     return res.json(new SingleResponse(serviceRes.getData()));
//   } catch (error) {
//     return next(error);
//   }
// };

// const upload = async (req, res, next) => {
//     try {
//         if (!req.files || !req.files.length)
//             return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));

//         let file = req.files[0];
//         if (file.buffer || !file.includes(config.domain_cdn)) {
//             url = await fileHelper.saveFile(file);
//         } else {
//             url = file.split(config.domain_cdn)[1];
//         }
//         // console.log(url);
//         res.json(new SingleResponse(url));
//     } catch (error) {
//         console.log(error);
//         return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//     }
// };

// const getListReviewLevelByAnnounceTypeId = async (req, res, next) => {
//     try {
//         const serviceRes = await announceService.getListReviewLevelByAnnounceTypeId(
//             Object.assign(req.body, req.params),
//         );
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }
//         return res.json(new SingleResponse(serviceRes.getData()));
//     } catch (error) {
//         return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//     }
// };
const createAnnounceUserView = async (req, res, next) => {
    try {
        const serviceRes = await announceService.createAnnounceUserView(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const reviewAnnounce = async (req, res, next) => {
    try {
        const serviceRes = await announceService.reviewAnnounce(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, RESPONSE_MSG.ANNOUNCE.REVIEW_SUCCESS));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getListAnnounceView = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListAnnounceView(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total } = serviceRes.getData();
        return res.json(new ListResponse(data, total));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const getListAnnounceNotRead = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListAnnounceNotRead(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const getListAllAnnounce = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListAllAnnounce(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total } = serviceRes.getData();
        return res.json(new ListResponse(data, total));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};
const deleteAnnounce = async (req, res, next) => {
    try {
        const serviceRes = await announceService.deleteAnnounce(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.ANNOUNCE.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListAnnounce,
    getListUserView,
    getListAnnounceView,
    getListAnnounceNotRead,
    // upload,
    // getListStocksType,
    getListCompany,
    createAnnounce,
    createAnnounceUserView,
    detailAnnounce,
    downloadAttachment,
    // getListManufacturer,
    // getListStockManager,
    // getListBusinessByCompanyID,
    // detailStocks,
    // createStocks,
    // createStocksStocksManager,
    updateAnnounce,
    // deleteStocks,
    // deleteStocksStocksManager,
    // getOptions,
    // getListStoreOptions,
    getListAnnounceTypeOptions,
    getOptionsAnnounceReviewLevel,
    // getOptionsReviewLevel,
    // getOptionsUserReviewLevel,
    // getListReviewLevelByAnnounceTypeId,
    // getListUserByStoreIdOptions,
    reviewAnnounce,
    getListAllAnnounce,
    deleteAnnounce,
    detailAnnounceView,
};
