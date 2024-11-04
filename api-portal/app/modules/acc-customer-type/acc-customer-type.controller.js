const httpStatus = require('http-status');
const crmAccCustomerTypeService = require('./acc-customer-type.service');
const crmAccountService = require('../account/account.service')
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ValidationResponse = require('../../common/responses/validation.response');
const optionService = require('../../common/services/options.service');
const apiHelper = require('../../common/helpers/api.helper');
/**
 * update CRM_ACC_CUSTOMERTYPE
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */

const updateAccCustomerType = async (req, res, next) => {
    try {
        const member_id = req.params.member_id;
        // Update CustomerType
        const serviceRes = await (crmAccCustomerTypeService.deleteAccCustomerType(member_id), crmAccCustomerTypeService.createAccCustomerTypeOrUpdate(req.body,member_id));
        if(serviceRes.isFailed()) {
            return next(serviceRes);
        } 
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CUSTOMERTYPE.UPDATE_SUCCESS));
    }   catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
}

const detailAccCustomerType = async (req, res, next) => {
    try {
      const customer_type_id = req.params.member_id;
      // Check CUSTOMERTYPE exists
      const serviceRes = await crmAccCustomerTypeService.detailAccCustomerType(customer_type_id);
      if(serviceRes.isFailed()) {
        return next(serviceRes);
      }
      return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
      return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
  };

// const createAccCustomerType = async (req, res, next) => {
//     try {
//         const serviceRes = await crmAccountService.createCRMAccountOrUpdate({}, req.body)
//         if(serviceRes.isFailed()) {
//             return next(serviceRes);
//         }
//         return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.CUSTOMERTYPE.UPDATE_SUCCESS));
//     }   catch (error) {
//         return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//     }
// }

// const deleteAccCustomerType = async (req, res, next) => {
//     try {
//         const member_id = req.params.member_id;
//         console.log("member_id", member_id)
//         // Delete Acc_Customer_Type
//         const serviceRes = await crmAccCustomerTypeService.deleteAccCustomerType(member_id);
//         if(serviceRes.isFailed()) {
//             return next(serviceRes);
//           }
//         return res.json(new SingleResponse(null, RESPONSE_MSG.ACCOUNT.DELETE_SUCCESS));
//     } catch (error) {
//         return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
//     }
// }

module.exports = {
    // createAccCustomerType,
    updateAccCustomerType,
    // deleteAccCustomerType
    detailAccCustomerType,
};