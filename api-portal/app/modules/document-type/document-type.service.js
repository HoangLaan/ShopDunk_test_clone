const mssql = require('../../models/mssql');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const doctumentTypeClass = require('./document-type.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const getOptions = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ISMANAGEDOCUMENT', apiHelper.getValueFromObject(queryParams, 'is_managed_document'))
            .execute(`MD_DOCUMENTTYPE_GetOptions_AdminWeb`);

        return new ServiceResponse(true, '', doctumentTypeClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'EmailHistoryService.getList' });
        return new ServiceResponse(true, '', []);
    }
};


//Get list
const getListDocumentType = async (bodyParams = {}, queryParams = {}) => {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input("PAGESIZE", itemsPerPage)
            .input("PAGEINDEX", currentPage)
            .input("DOCUMENTTYPEID", apiHelper.getValueFromObject(queryParams, "document_type_id"))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISMANAGEDOCUMENT', apiHelper.getValueFromObject(queryParams, 'is_managed_document'))
            .execute("MD_DOCUMENTTYPE_GetList_AdminWeb");

        const result =
            data.recordsets && data.recordsets.length > 0 && data.recordsets[0]
                ? doctumentTypeClass.list(data.recordsets[0])
                : [];
        const total =
            data.recordsets &&
                data.recordsets.length > 0 &&
                data.recordsets[1].length > 0 &&
                data.recordsets[1][0]
                ? data.recordsets[1][0].TOTALITEMS
                : 0;
        return new ServiceResponse(true, "", {
            data: result,
            page: currentPage,
            limit: itemsPerPage,
            total: total,
        });
    } catch (e) {
        logger.error(e, { function: "documentTypeService.getListDocumentType" });
        return new ServiceResponse(true, "", {});
    }
};

// Get detail
const detailDocumentType = async (document_type_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('DOCUMENTTYPEID', document_type_id).execute("MD_DOCUMENTTYPE_GetById_AdminWeb");

        let result = data.recordset;

        // If exists
        if (result && result.length > 0) {
            result = doctumentTypeClass.detail(result[0]);
            return new ServiceResponse(true, '', result);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'documentTypeService.detailDocumentType' });
        return new ServiceResponse(false, e.message);
    }
};

// create or update DocumentType
const createOrUpdateDocumentType = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DOCUMENTTYPEID', apiHelper.getValueFromObject(bodyParams, 'document_type_id'))
            .input('DOCUMENTTYPENAME', apiHelper.getValueFromObject(bodyParams, 'document_type_name'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISREQUIRED', apiHelper.getValueFromObject(bodyParams, 'is_required'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input("ISSYSTEM", apiHelper.getValueFromObject(bodyParams, "is_system"))
            .input("ISMANAGEDOCUMENT", apiHelper.getValueFromObject(bodyParams, "is_managed_document"))
            .execute('MD_DOCUMENTTYPE_CreateOrUpdate_AdminWeb_V2');

        let document_type_id = data && data.recordset && data.recordset.length > 0 && data.recordset[0] ? data.recordset[0].RESULT : null
        let document_type_name_old = data && data.recordset && data.recordset.length > 0 && data.recordset[0] ? data.recordset[0].OLDNAME : null
        let document_type_name_new = data && data.recordset && data.recordset.length > 0 && data.recordset[0] ? data.recordset[0].NEWNAME : null


        if (!document_type_id || !data.recordset) {
            return new ServiceResponse(false, 'Khởi tạo loại tài liệu thất bại');
        }
        return new ServiceResponse(true, '', {
            name_document_type_old: document_type_name_old,
            name_document_type_new: document_type_name_new,
            status: 'success',
            message: 'Lưu thành công!'
        });
    } catch (e) {
        logger.error(e, { function: 'documentTypeService.createOrUpdateDocumentType' });
        return new ServiceResponse(false);
    }
};

//Delete 
const deleteDocumentType = async (document_type_id, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('DOCUMENTTYPEID', document_type_id)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_DOCUMENTTYPE_Delete_AdminWeb');
        return new ServiceResponse(true, RESPONSE_MSG.DOCUMENTTYPE.DELETE_SUCCESS, '');
    } catch (e) {
        logger.error(e, { function: 'documentTypeService.deleteDocumentType' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getOptions,
    getListDocumentType,
    detailDocumentType,
    deleteDocumentType,
    createOrUpdateDocumentType
};
