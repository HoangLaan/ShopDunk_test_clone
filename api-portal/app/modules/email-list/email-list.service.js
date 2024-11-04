const lodash = require('lodash');
const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const moduleClass = require('./email-list.class');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('EMAILLISTTYPE', apiHelper.getValueFromObject(queryParams, 'email_list_type'))
            .execute(PROCEDURE_NAME.CRM_EMAILLIST_GETLIST_ADMINWEB);

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'EmailListService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdate = async (bodyParams) => {
    let emailListId = apiHelper.getValueFromObject(bodyParams, 'email_list_id');

    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const MainRequest = new sql.Request(transaction);

        const resCreateOrUpdate = await MainRequest.input('EMAILLISTID', emailListId)
            .input('EMAILLISTNAME', apiHelper.getValueFromObject(bodyParams, 'email_list_name'))
            .input('EMAILLISTTYPE', apiHelper.getValueFromObject(bodyParams, 'email_list_type'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_EMAILLIST_CREATEORUPDATE_ADMINWEB);

        emailListId = resCreateOrUpdate.recordset[0].RESULT;

        if (!emailListId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Thêm mới hoặc cập nhật danh sách gửi mail thất bại !');
        }

        // insert or update accounting list
        const customerList = apiHelper.getValueFromObject(bodyParams, 'customer_list');
        if (customerList && customerList.length > 0) {
            const result = await _createOrUpdateCustomerList(customerList, emailListId, transaction);
            if (!result) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Thêm mới hoặc cập nhật danh sách gửi mail thất bại !');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', emailListId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'EmailListService.CreateOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const _createOrUpdateCustomerList = async (customerList, emailListId, transaction) => {
    // delete customer list
    const deleteRequest = new sql.Request(transaction);
    const deleteRes = await deleteRequest
        .input('EMAILLISTID', emailListId)
        .execute(PROCEDURE_NAME.CRM_EMAILLIST_CUSTOMER_DELTEBYEMAILLISTID_ADMINWEB);

    const deleteResult = deleteRes.recordset[0]?.RESULT;
    if (deleteResult <= 0) {
        return false;
    }

    // insert or update customer list
    for (let customer of customerList) {
        const childRequest = new sql.Request(transaction);
        const resultChild = await childRequest
            .input('EMAILLISTID', emailListId)
            .input('CUSTOMERID', apiHelper.getValueFromObject(customer, 'customer_id'))
            .execute(PROCEDURE_NAME.CRM_EMAILLIST_CUSTOMER_CREATE_ADMINWEB);

        const childId = resultChild.recordset[0]?.RESULT;
        if (childId <= 0) {
            return false;
        }
    }

    return true;
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('EMAILLISTID', id)
            .execute(PROCEDURE_NAME.CRM_EMAILLIST_GETBYID_ADMINWEB);

        let emailList = responseData.recordset[0];
        let customerList = responseData.recordsets[1];

        if (emailList) {
            emailList = moduleClass.detail(emailList);
            emailList.customer_list = moduleClass.customerDetail(customerList);
            return new ServiceResponse(true, '', emailList);
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (e) {
        logger.error(e, { function: 'EmailListService.getDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteList = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

    try {
        await transaction.begin();
        for (let emailListId of list_id) {
            const request = new sql.Request(transaction);
            const resultRes = await request
                .input('EMAILLISTID', emailListId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.CRM_EMAILLIST_DELETE_ADMINWEB);

            if (!resultRes.recordset[0]?.RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa danh sách gửi mail thất bại !');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'EmailListService.deleteList' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getList,
    createOrUpdate,
    getDetail,
    deleteList,
};
