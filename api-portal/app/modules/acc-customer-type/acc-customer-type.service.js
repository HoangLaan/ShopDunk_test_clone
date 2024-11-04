const accCustomerTypeClass = require('../acc-customer-type/acc-customer-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
/**
 * Get list CRM_ACC_CUSTOMERTYPE
 *
 * @param queryParams
 * @returns ServiceResponse
 */

const createAccCustomerTypeOrUpdate = async (body = {}, member_id) => {
    try {
        const pool = await mssql.pool;
        // Insert child table
        body.customer_type_id ? body.customer_type_id : [];
        for (let i = 0; i < body.customer_type_id.length; i++) {
            let value = body.customer_type_id[i].value;
            await pool
                .request()
                .input('MEMBERID', member_id)
                .input('CUSTOMERTYPEID', value)
                .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'created_user'))
                // .input('CREATEDDATE', apiHelper.getValueFromObject(body, 'created_date'))
                // .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'updated_user'))
                // .input('UPDATEDDATE', apiHelper.getValueFromObject(body, 'updated_date'))
                .input('ISDELETED', apiHelper.getValueFromObject(body, 'is_deleted') || 0)
                // .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'deleted_user'))
                // .input('DELETEDDATE', apiHelper.getValueFromObject(body, 'deleted_date'))
                .execute(PROCEDURE_NAME.CRM_ACC_CUSTOMERTYPE_CREATEORUPDATE);
        }

        return new ServiceResponse(true, '', member_id);
    } catch (error) {
        logger.error(error, { accCustomerType: 'accCustomerTypeService.createAccCustomerTypeOrUpdate' });
        console.error('accCustomerTypeService.createAccCustomerTypeOrUpdate', error);
        return new ServiceResponse(false, error.message);
    }
};

const detailAccCustomerType = async (memberid) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MEMBERID', memberid)
            .execute(PROCEDURE_NAME.CRM_ACC_CUSTOMERTYPE_GETBYID);
        const AccCustomerType = data.recordset;
        if (AccCustomerType) {
            return new ServiceResponse(true, '', accCustomerTypeClass.detail(AccCustomerType));
        }
        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, {
            function: 'AccCustomerTypeService.detailAccCustomerType',
        });

        return new ServiceResponse(false, e.message);
    }
};

const deleteAccCustomerType = async (memberid) => {
    const pool = await mssql.pool;
    try {
        await pool.request().input('MEMBERID', memberid).execute(PROCEDURE_NAME.CRM_ACC_CUSTOMERTYPE_DELETE);
        // return done
        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, {
            function: 'AccCustomerType.deleteAccCustomerType',
        });

        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    createAccCustomerTypeOrUpdate,
    detailAccCustomerType,
    deleteAccCustomerType,
};
