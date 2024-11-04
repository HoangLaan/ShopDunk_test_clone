const VatClass = require('./vat.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
var xl = require('excel4node');
/**
 * Get list MD_ORIGIN
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListVat = async (queryParams = {}) => {
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
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('MD_VAT_GetList_AdminWeb');
        const vat = data.recordsets[0];
        const totalItem = data.recordsets[0][0].TOTAL;
        return new ServiceResponse(true, '', {
            data: VatClass.list(vat),
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, { function: 'VatService.getListVat' });
        return new ServiceResponse(true, '', {});
    }
};

// detail Vat
const detailVat = async (vatId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('VATID', vatId).execute('MD_VAT_GetById_AdminWeb');
        let vat = data.recordset;
        // If exists
        if (vat && vat.length > 0) {
            vat = VatClass.detail(vat[0]);
            return new ServiceResponse(true, '', vat);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'VatService.detailVat' });
        return new ServiceResponse(false, e.message);
    }
};

//Delete Vat
const deleteVat = async (vatId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('VATID', vatId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_VAT_Delete_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.VAT.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'VatService.deleteVat' });
        return new ServiceResponse(false, e.message);
    }
};

// create or update vat
const createOrUpdateVat = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        //check name
        const dataCheck = await pool
            .request()
            .input('VATID', apiHelper.getValueFromObject(bodyParams, 'vat_id'))
            .input('VATNAME', apiHelper.getValueFromObject(bodyParams, 'vat_name'))
            .execute('MD_VAT_CheckName_AdminWeb');
        if (dataCheck.recordset && dataCheck.recordset[0].RESULT == 1) {
            return new ServiceResponse(false, RESPONSE_MSG.VAT.EXISTS_NAME, null);
        }

        const data = await pool
            .request()
            .input('VATID', apiHelper.getValueFromObject(bodyParams, 'vat_id'))
            .input('VATNAME', apiHelper.getValueFromObject(bodyParams, 'vat_name'))
            .input('VALUE', apiHelper.getValueFromObject(bodyParams, 'value'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'desc'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_VAT_CreateOrUpdate_AdminWeb');

        const vatId = data.recordset[0].RESULT;
        return new ServiceResponse(true, 'update success', vatId);
    } catch (e) {
        logger.error(e, { function: 'VatService.createOrUpdateVat' });
        return new ServiceResponse(false);
    }
};

module.exports = {
    getListVat,
    detailVat,
    deleteVat,
    createOrUpdateVat,
};
