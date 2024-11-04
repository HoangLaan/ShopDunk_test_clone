const promotionCustomerTypeClass = require('../promotion_customer_type/promotion_customer_type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListByPromotionId = async (promotionId) => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PROMOTIONID', promotionId)
      .execute(PROCEDURE_NAME.SM_PROMOTION_CUSTOMERTYPE_GETBYPROMOTIONID);

    const promotionsCT = data.recordset;

    return new ServiceResponse(true, '', promotionCustomerTypeClass.list(promotionsCT));
  } catch (e) {
    logger.error(e, {'function': 'promotionCustomerTypeService.getListByPromotionId'});
    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
  getListByPromotionId,
};
