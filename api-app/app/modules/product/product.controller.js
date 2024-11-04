const service = require('./product.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');

/**
 * Get information product
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getInformationProduct = async (req, res, next) => {
    try {
        const serviceRes = await service.getInformationProduct(req.params);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get list product
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListProduct = async (req, res, next) => {
    try {
        const serviceRes = await service.getListProduct(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getAttributesProduct = async (req, res, next) => {
    try {
        const serviceRes = await service.getAttributesProduct(req.query, req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProductByModelId = async (req, res, next) => {
    try {
        const serviceRes = await service.getProductByModelId(req.params.model_id, req.query, req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getPromotionProduct = async (req, res, next) => {
    try {
        const serviceRes = await service.getPromotionProduct(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getProductByIMEI =async (req, res, next) => {
  try {
    const serviceRes = await service.getProductByIMEI({...req.query, ...req.body});
    if (serviceRes.isFailed()) {
      return next(serviceRes);
    }

    return res.json(new SingleResponse(serviceRes.getData()));
} catch (error) {
  return next(
    new ErrorResponse(
      httpStatus.NOT_IMPLEMENTED,
      error,
      RESPONSE_MSG.REQUEST_FAILED
    )
  );
}
}

  const getPreOrderModels =async (req, res, next) => {
    try {
      const serviceRes = await service.getPreOrderModels({...req.query, ...req.body});
      if (serviceRes.isFailed()) {
        return next(serviceRes);
      }
  
      return res.json(new SingleResponse(serviceRes.getData(), 'get models thành công'));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
  }

  const getPreOrderMoneyDeposit =async (req, res, next) => {
    try {
      const serviceRes = await service.getPreOrderMoneyDeposit({...req.query, ...req.body});
      if (serviceRes.isFailed()) {
        return next(serviceRes);
      }
  
      return res.json(new SingleResponse(serviceRes.getData(), 'get models thành công'));
  } catch (error) {
    return next(
      new ErrorResponse(
        httpStatus.NOT_IMPLEMENTED,
        error,
        RESPONSE_MSG.REQUEST_FAILED
      )
    );
  }
  }

module.exports = {
    getInformationProduct,
    getListProduct,
    getAttributesProduct,
    getProductByModelId,
    getPromotionProduct,
    getProductByIMEI,
    getPreOrderModels,
    getPreOrderMoneyDeposit
};




