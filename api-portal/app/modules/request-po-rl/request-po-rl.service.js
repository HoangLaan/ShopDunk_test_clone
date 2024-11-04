const RequestPoRLClass = require('./request-po-rl.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require("mssql");
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getListRequestPoRL = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);


        const pool = await mssql.pool;
        const data = await pool.request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('PO_REQUESTPO_REVIEWLEVEL_GetList_AdminWeb');

        const RequestPoRL = data.recordset;
        return new ServiceResponse(true, '', {
            'data': RequestPoRLClass.list(RequestPoRL),
            'page': currentPage,
            'limit': itemsPerPage,
            'total': apiHelper.getTotalData(RequestPoRL),
        });
    } catch (e) {
        logger.error(e, { 'function': 'requestPoRLService.getListRequestPoRL' });
        return new ServiceResponse(false, '', {});
    }
};

const createRequestPoRL = async (bodyParams = {}) => {
    return await createUserOrUpdate(bodyParams);
};

const updateRequestPoRL = async (bodyParams) => {
    return await createUserOrUpdate(bodyParams);
};

const createUserOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        const requestRequestPoRLCreate = new sql.Request(transaction);
        const id = apiHelper.getValueFromObject(bodyParams, 'request_po_review_level_id');
        const is_apply_all_department = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_department')
        const is_apply_all_position = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_position')
        const resultRequestPoRLCreate = await requestRequestPoRLCreate
            .input('REQUESTPOREVIEWLEVELID', id)
            .input('REQUESTPOREVIEWNAME', apiHelper.getValueFromObject(bodyParams, 'review_level_name'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('ISAPPLYALLDEPARTMENT', is_apply_all_department)
            .input('ISAPPLYALLPOSITION', is_apply_all_department ? is_apply_all_position : 0)
            .execute('PO_REQUESTPO_REVIEWLEVEL_CreateOrUpdate_AdminWeb');

        const requestPoRlId = resultRequestPoRLCreate.recordset[0].RESULT;

        if (!requestPoRlId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm mới mức duyệt bán hàng thất bại.')
        }

        const requestRequestpositions = new sql.Request(transaction);
        const positions = apiHelper.getValueFromObject(bodyParams, 'positions', []);
        for (let position of positions) {
            for (let department of position?.departments) {
                await requestRequestpositions
                    .input('REQUESTPOREVIEWLEVELID', requestPoRlId)
                    .input('DEPARTMENTID', department)
                    .input('POSITIONID', position?.position_id)
                    .input('ISAPPLYALLPOSITION', position?.is_apply_all_position)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('PO_REQUESTPO_REVIEWLEVELDEPARTMENT_CreateOrUpdate_AdminWeb');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Create request po review level success!!', requestPoRlId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { 'function': 'requestPoRLService.createUserOrUpdate' });
        return new ServiceResponse(false, e);
    }
};

const detailRequestPoRL = async (id, bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('REQUESTPOREVIEWLEVELID', id)
            .execute('PO_REQUESTPO_REVIEWLEVEL_GetById_AdminWeb');
        let requestPoRL = RequestPoRLClass.detail(data.recordset[0]);
        requestPoRL.departments = [...new Set(data.recordsets[1].map(o => o.department_id))]
        requestPoRL.positions = [...new Set(data.recordsets[1].map(o => o.position_id))]
        requestPoRL.is_can_edit = 1
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name')
        if (requestPoRL.is_system == 1 && auth_name != 'administrator') {
            requestPoRL.is_can_edit = 0
        }
        return new ServiceResponse(true, '', requestPoRL);

    } catch (e) {
        console.log(e)
        //logger.error(e, { 'function': 'requestPoRLService.detailRequestPoRL' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteRequestPoRL = async (bodyParams) => {
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'REQUESTPOREVIEWLEVELID')
            .input('TABLENAME', 'PO_REQUESTPO_REVIEWLEVEL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { 'function': 'requestPoRLService.deleteRequestPoRL' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};


const getRequestPoRLOptions = async (companyId = null) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('COMPANYID', companyId)
            .execute('PO_REQUESTPO_REVIEWLEVEL_GetOption_AdminWeb');
        let requestPoRL = RequestPoRLClass.options(data.recordset);
        return new ServiceResponse(true, '', requestPoRL);
    } catch (e) {
        logger.error(e, { 'function': 'requestPoRLService.getRequestPoRLOptions' });
        return new ServiceResponse(false, e.message);
    }
};


module.exports = {
    getListRequestPoRL,
    createRequestPoRL,
    detailRequestPoRL,
    updateRequestPoRL,
    deleteRequestPoRL,
    getRequestPoRLOptions
};
