const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const moduleClass = require('./denomination.class');
const fileHelper = require('../../common/helpers/file.helper');
// const PROCEDURE_NAME = require('../../common/const/procedureName.const');
// const sql = require('mssql');
// const cache = require('../../common/classes/cache.class');
// const API_CONST = require('../../common/const/api.const');
// const _ = require('lodash');
// const config = require('../../../config/config');
// const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
// const getDenominationList = async (queryParams = {}) => {
//     try {
//         const currentPage = apiHelper.getCurrentPage(queryParams);
//         const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
//         const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
//         const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
//         const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

//         const pool = await mssql.pool;
//         const data = await pool
//             .request()
//             .input('PageSize', itemsPerPage)
//             .input('PageIndex', currentPage)
//             .input('KEYWORD', keyword)
//             .input('CREATEDDATEFROM', createDateFrom)
//             .input('CREATEDDATETO', createDateTo)
//             .input('ISACTIVE', apiHelper.getFilterBoo)
//             .execute('MD_DENOMINATIONS_GetList_AdminWeb');

//         return new ServiceResponse(true, '', {
//             data: moduleClass.list(data.recordsets[1]),
//             page: currentPage,
//             limit: itemsPerPage,
//             total: apiHelper.getTotalData(data.recordset),
//         });
//     } catch (e) {
//         logger.error(e, { function: 'DenominationService.getDenominationList' });

//         return new ServiceResponse(true, '', {});
//     }
// };

const createOrUpdateDenomination = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    try {
        let image_url = apiHelper.getValueFromObject(bodyParams, 'image_url');

        if (fileHelper.isBase64(image_url)) {
            image_url = await fileHelper.saveBase64(null, image_url);
        } else {
            image_url = null;
        }

        // Save
        const resCreateOrUpdateDenomination = await pool
            .request()
            .input('DENOMINATIONSID', apiHelper.getValueFromObject(bodyParams, 'denomination_id'))
            .input('DENOMINATIONSVALUE', apiHelper.getValueFromObject(bodyParams, 'denomination_value'))
            .input('IMAGEURL', image_url)
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))

            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system')) //
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_DENOMINATIONS_CreateOrUpdate_AdminWeb');

        const denominationId = resCreateOrUpdateDenomination.recordset[0].RESULT;

        if (!denominationId || denominationId <= 0) {
            return new ServiceResponse(false, 'Tạo mệnh giá thất bại', null);
        }

        removeCacheOptions();

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { Denomination: 'DenominationService.createOrUpdateDenomination' });

        return new ServiceResponse(false, e.message);
    }
};

const denominationDetail = async (denominationId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('DENOMINATIONSID', denominationId)
            .execute('MD_DENOMINATIONS_GetById_AdminWeb');

        let denomination = resData.recordset[0];

        if (denomination) {
            denomination = moduleClass.detail(denomination);

            return new ServiceResponse(true, '', denomination);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'DenominationService.denominationDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteDenomination = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'DENOMINATIONSID')
            .input('TABLENAME', 'MD_DENOMINATIONS')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'DenominationService.deleteDenomination' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.AM_DENOMINATIONS_OPTIONS);
};

module.exports = {
    // getDenominationList,
    createOrUpdateDenomination,
    denominationDetail,
    deleteDenomination,
};
