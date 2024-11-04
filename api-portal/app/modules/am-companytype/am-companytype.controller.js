const amCompanyTypeService = require('./am-companytype.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const optionService = require('../../common/services/options.service');

 /* Get list function
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
  try {
    const serviceRes = await optionService('AM_COMPANYTYPE', req.query);
    return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get list companytype
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getListCompanyType = async (req, res, next) => {
  try {
    const serviceRes = await amCompanyTypeService.getListCompanyType(req.query);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    const {data, total, page, limit} = serviceRes.getData();
    return res.json(new ListResponse(data, total, page, limit));
  } catch (error) {
    return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
  }
};

/**
 * detail a companytype
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
/**
 * Get detail
 */
const detailCompanyType = async (req, res, next) => {
  try {
    const serviceRes = await amCompanyTypeService.detailCompanyType(req.params.companyTypeId);
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
const deleteCompanyType = async (req, res, next) => {
  try {
    const companyTypeId = req.params.companyTypeId;
    // Check 
    const serviceResDetail = await amCompanyTypeService.detailCompanyType(companyTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    // Delete 
    const serviceRes = await amCompanyTypeService.deleteCompanyType(companyTypeId, req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(null, RESPONSE_MSG.COMPANY_TYPE.DELETE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};


/**
 * Change status
 */
const changeStatusCompanyType = async (req, res, next) => {
  try {
    const companyTypeId = req.params.companyTypeId;
    const serviceResDetail = await amCompanyTypeService.detailCompanyType(companyTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }
    // Update status
    const serviceRes = await amCompanyTypeService.changeStatusCompanyType(companyTypeId, req.body);
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.COMPANY_TYPE.CHANGE_STATUS_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Create
 */
const createCompanyType = async (req, res, next) => {
  try {
    req.body.companyType = null;
    const serviceRes = await amCompanyTypeService.createOrUpdateCompanyType(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.COMPANY_TYPE.CREATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update
 */
const updateCompanyType = async (req, res, next) => {
  try {
    const companyTypeId = req.params.companyTypeId;
    req.body.companyTypeId = companyTypeId;
    const serviceResDetail = await amCompanyTypeService.detailCompanyType(companyTypeId);
    if(serviceResDetail.isFailed()) {
      return next(serviceResDetail);
    }

    const serviceRes = await amCompanyTypeService.createOrUpdateCompanyType(req.body);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.COMPANY_TYPE.UPDATE_SUCCESS));
  } catch (error) {
    return next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
    const serviceRes = await amCompanyTypeService.exportExcel(req.query);
    const wb = serviceRes.getData();
    wb.write('COMPANY_TYPE.xlsx', res);
    if(serviceRes.isFailed()) {
      return next(serviceRes);
    }
    return serviceRes.getData();
    // return res.json(new SingleResponse(serviceRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOptions,
  getListCompanyType,
  detailCompanyType,
  deleteCompanyType,
  changeStatusCompanyType,
  createCompanyType,
  updateCompanyType,
  exportExcel,
};
