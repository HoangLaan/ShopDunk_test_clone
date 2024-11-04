const promotionCompanyClass = require('../promotion_company/promotion_company.class');
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
      .execute(PROCEDURE_NAME.SM_PROMOTION_COMPANY_GETBYPROMOTIONID);

    const promotionsCompany = data.recordset;

    return new ServiceResponse(true, '', promotionCompanyClass.list(promotionsCompany));
  } catch (e) {
    logger.error(e, {'function': 'promotionCompanyService.getListByPromotionId'});
    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
  getListByPromotionId,
};
