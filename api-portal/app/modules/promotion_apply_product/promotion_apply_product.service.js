/* eslint-disable no-await-in-loop */
const promotionApplyProductClass = require('../promotion_apply_product/promotion_apply_product.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const apiHelper = require('../../common/helpers/api.helper');
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
      .execute(PROCEDURE_NAME.SM_PROMOTIONAPPLY_PRODUCT_GETBYPROMOTIONID);

    const promotionsAProduct = data.recordset;
    let products = promotionApplyProductClass.list(promotionsAProduct);
    for (let i = 0; i < products.length; i++) {
      const dataBus = await pool.request() // eslint-disable-next-line no-await-in-loop
        .input('PRODUCTID', apiHelper.getValueFromObject(products[i], 'product_id'))
        .execute(PROCEDURE_NAME.MD_PRODUCT_BUSINESS_GETLISTBYPRODUCTID);
      const dataRecordBus = dataBus.recordset;
      products[i].businesses = [];
      if(dataRecordBus) {
        products[i].businesses = promotionApplyProductClass.listBussiness(dataRecordBus);
      }
    }
    return new ServiceResponse(true, '', products);
  } catch (e) {
    logger.error(e, {'function': 'promotionApplyProductService.getListByPromotionId'});
    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
  getListByPromotionId,
};
