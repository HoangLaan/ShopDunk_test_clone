const priceReviewLevelClass = require('./price-review-level.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');

/**
 * Get list MD_PRICEREVIEWLEVEL
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListPriceReviewLevel = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('SL_PRICEREVIEWLEVEL_GetList_AdminWeb');
        const priceReviewLevels = data.recordsets[0];
        const totalItem = data.recordsets[0][0].TOTAL;
        return new ServiceResponse(true, '', {
            data: priceReviewLevelClass.list(priceReviewLevels),
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'PriceReviewLevelService.getListPriceReviewLevel' });
        return new ServiceResponse(true, '', {});
    }
};

// detail PriceReviewLevel
const detailPriceReviewLevel = async (priceReviewLevelId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRICEREVIEWLEVELID', priceReviewLevelId)
            .execute('SL_PRICEREVIEWLEVEL_GetById_AdminWeb');
        let priceReviewLevel = data.recordset;
        // If exists
        if (priceReviewLevel && priceReviewLevel.length > 0) {
            priceReviewLevel = priceReviewLevelClass.detail(priceReviewLevel[0]);

            return new ServiceResponse(true, '', priceReviewLevel);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'PriceReviewLevelService.detailPriceReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

//Delete PriceReviewLevel
const deletePriceReviewLevel = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PRICEREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'price_review_level_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_PRICEREVIEWLEVEL_Delete_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.PRICEREVIEWLEVEL.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'PriceReviewLevelService.deletePriceReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

// create or update priceReviewLevel
const createOrUpdatePriceReviewLevel = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        //check name
        const dataCheck = await pool
            .request()
            .input('PRICEREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'price_review_level_id'))
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'price_review_level_name'))
            .execute('SL_PRICEREVIEWLEVEL_CheckName_AdminWeb');
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.PRICEREVIEWLEVEL.EXISTS_NAME, null);
        }

        const data = await pool
            .request()
            .input('PRICEREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'price_review_level_id'))
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'price_review_level_name'))
            .input('ORDERINDEX', apiHelper.getValueFromObject(bodyParams, 'order_index'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_PRICEREVIEWLEVEL_CreateOrUpdate_AdminWeb');
        const priceReviewLevelId = data.recordset[0].RESULT;
        return new ServiceResponse(true, 'update success', priceReviewLevelId);
    } catch (e) {
        logger.error(e, { function: 'PriceReviewLevelService.createOrUpdatePriceReviewLevel' });
        return new ServiceResponse(false);
    }
};

const getOptions = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('IDS', apiHelper.getValueFromObject(queryParams, 'ids'))
            .execute('SL_PRICEREVIEWLEVEL_GetOptions');
        return new ServiceResponse(true, '', priceReviewLevelClass.options(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'PriceReviewLevelService.getOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListPriceReviewLevel,
    detailPriceReviewLevel,
    deletePriceReviewLevel,
    createOrUpdatePriceReviewLevel,
    getOptions,
};
