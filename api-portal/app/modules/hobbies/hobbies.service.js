const sql = require('mssql');
const mssql = require('../../models/mssql');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const hobbiesClass = require('./hobbies.class');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const createOrUpdate = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();

        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const idUpdate = apiHelper.getValueFromObject(body, 'hobbies_id');

        // create or update request purchase
        const hobbiesResult = await new sql.Request(transaction)
            .input('HOBBIESID', idUpdate)
            .input('HOBBIESNAME', apiHelper.getValueFromObject(body, 'hobbies_name'))
            .input('ISAPPLYATTRIBUTE', apiHelper.getValueFromObject(body, 'is_apply_attribute'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', authName)
            .execute(PROCEDURE_NAME.MD_HOBBIES_CREATEORUPDATE_ADMINWEB);

        const idResult = hobbiesResult.recordset[0].RESULT;
        if (!idResult) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi lưu sở thích');
        }

        if (idUpdate) {
            await new sql.Request(transaction)
                .input('HOBBIESID', idUpdate)
                .execute(PROCEDURE_NAME.MD_HOBBIES_DELETEMAPPING_ADMINWEB);
        }

        // #region hobbies_value_list
        const hobbies_value_list = apiHelper.getValueFromObject(body, 'hobbies_value_list', []);
        for (let i = 0; i < hobbies_value_list.length; i++) {
            await new sql.Request(transaction)
                .input('HOBBIESID', idResult)
                .input('VALUE', hobbies_value_list[i])
                .input('CREATEDUSER', authName)
                .execute(PROCEDURE_NAME.MD_HOBBIES_CREATEORUPDATEHOBBIESVALUE_ADMINWEB);
        }
        // #endregion hobbies_value_list

        // #region product_attribute_list
        const product_attribute_list = apiHelper.getValueFromObject(body, 'product_attribute_list', []);
        for (let i = 0; i < product_attribute_list.length; i++) {
            await new sql.Request(transaction)
                .input('HOBBIESID', idResult)
                .input('PRODUCTATTRIBUTEID', product_attribute_list[i])
                .execute(PROCEDURE_NAME.MD_HOBBIES_CREATEPROATTRIBUTE_ADMINWEB);
        }
        // #endregion product_attribute_list

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu sở thích thành công', {});
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'hobbiesService.createOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const getList = async (queryParams = {}) => {
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
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.MD_HOBBIES_GETLIST_ADMINWEB);

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: hobbiesClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (e) {
        logger.error(e, { function: 'hobbiesService.getList' });
        return new ServiceResponse(true, '', {
            data: [],
            page: currentPage,
            limit: itemsPerPage,
            total: 0,
        });
    }
};

module.exports = {
    getList,
    createOrUpdate,
};
