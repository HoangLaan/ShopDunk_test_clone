const promotionOfferApplyClass = require('../promotion_offer_apply/promotion_offer_apply.class');
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
      .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_APPLY_GETBYPROMOTIONID);

    const promotionsOA = data.recordset;

    return new ServiceResponse(true, '', promotionOfferApplyClass.list(promotionsOA));
  } catch (e) {
    logger.error(e, {'function': 'promotionOfferApplyService.getListByPromotionId'});
    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
  getListByPromotionId,
};
