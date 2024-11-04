const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./contract.class');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getContractList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('CONTRACTTYPEID', apiHelper.getValueFromObject(queryParams, 'contract_type_id'))
            .input('WORKINGFORMID', apiHelper.getValueFromObject(queryParams, 'working_form_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('HR_CONTRACT_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordsets[0]),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'ContractService.getContractList' });

        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdateContract = async (body, file, auth) => {
    body = JSON.parse(JSON.stringify(body));

    const pool = await mssql.pool;
    try {
        let attachment_path = null;

        if (file && file.buffer) {
            const resUploadFile = await fileHelper.uploadFile(file);
            body.attachment_name = file.originalname;
            attachment_path = resUploadFile.data.file;
        }

        // Save
        const resCreateOrUpdateContract = await pool
            .request()
            .input('CONTRACTID', apiHelper.getValueFromObject(body, 'contract_id'))
            // .input('CONTRACTNO', apiHelper.getValueFromObject(body, 'contract_no'))
            .input('CONTRACTNAME', apiHelper.getValueFromObject(body, 'contract_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('CONTRACTTYPEID', apiHelper.getValueFromObject(body, 'contract_type_id'))
            .input('WORKINGFORMID', apiHelper.getValueFromObject(body, 'working_form_id'))
            .input('CONTRACTTERMID', apiHelper.getValueFromObject(body, 'contract_term_id'))

            .input('ATTACHMENTNAME', apiHelper.getValueFromObject(body, 'attachment_name'))
            .input('ATTACHMENTPATH', attachment_path)

            .input('CONTENT', apiHelper.getValueFromObject(body, 'content'))

            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(auth, 'user_name'))
            .execute('HR_CONTRACT_CreateOrUpdate_AdminWeb');

        const contractId = resCreateOrUpdateContract.recordset[0].RESULT;

        if (!contractId || contractId <= 0) {
            return new ServiceResponse(false, 'Tạo hợp đồng thất bại', null);
        }

        removeCacheOptions();

        return new ServiceResponse(true);
    } catch (error) {
        logger.error(error, { Contract: 'ContractService.createOrUpdateContract' });

        return new ServiceResponse(false, error.message);
    }
};

const contractDetail = async (contractId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool.request().input('CONTRACTID', contractId).execute('HR_CONTRACT_GetById_AdminWeb');

        let contract = resData.recordset[0];

        if (contract) {
            contract = moduleClass.detail(contract);

            return new ServiceResponse(true, '', contract);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'ContractService.contractDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const contractAttachmentDetail = async (contractId) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool.request().input('CONTRACTID', contractId).execute('HR_CONTRACT_GetById_AdminWeb');

        let contract = resData.recordset[0];

        if (contract) {
            contract = moduleClass.attachmentDetail(contract);

            return new ServiceResponse(true, '', contract);
        }

        return new ServiceResponse(false, '', null);
    } catch (e) {
        logger.error(e, { function: 'ContractService.contractAttachmentDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteContract = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'CONTRACTID')
            .input('TABLENAME', 'HR_CONTRACT')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        removeCacheOptions();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'ContractService.deleteContract' });

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.HR_CONTRACT_OPTIONS);
};

module.exports = {
    getContractList,
    createOrUpdateContract,
    contractDetail,
    contractAttachmentDetail,
    deleteContract,
};
