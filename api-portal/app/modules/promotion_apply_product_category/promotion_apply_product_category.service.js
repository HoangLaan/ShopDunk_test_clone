/* eslint-disable no-await-in-loop */
const prmotionApplyProCategoryClass = require('./promotion_apply_product_category.class');
const mssql = require('../../models/mssql');
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
            .execute('SM_PROMOTIONAPPLY_PRODUCTCATEGORY_GetByPromotionId_AdminWeb');

        const promotionsAProductCategory = data.recordset;
        let categories = prmotionApplyProCategoryClass.list(promotionsAProductCategory);
        return new ServiceResponse(true, '', categories);
    } catch (e) {
        console.log(e)
        logger.error(e, { 'function': 'promotionApplyProductCategoryService.getListByPromotionId' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListByPromotionId,
};
