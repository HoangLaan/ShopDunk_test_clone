const sql = require('mssql');
const mssql = require('../../models/mssql');

const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const moduleClass = require('./email-template.class');

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
            .input('MAILSUPPLIER', apiHelper.getValueFromObject(queryParams, 'mail_supplier'))
            .execute(PROCEDURE_NAME.CRM_EMAILTEMPLATE_GETLIST_ADMINWEB);

        const templateData = moduleClass.list(data.recordset);

        templateData.email_template_params = templateData.email_template_params
            ? JSON.parse(templateData.email_template_params)
            : [];

        return new ServiceResponse(true, '', {
            data: templateData,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'EmailTemplateService.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdate = async (bodyParams) => {
    let emailTemplateId = apiHelper.getValueFromObject(bodyParams, 'email_template_id');
    const templateParams = JSON.stringify(apiHelper.getValueFromObject(bodyParams, 'email_template_params', []));

    try {
        const pool = await mssql.pool;

        const resCreateOrUpdate = await pool
            .request()
            .input('EMAILTEMPLATEID', emailTemplateId)
            .input('EMAILTEMPLATENAME', apiHelper.getValueFromObject(bodyParams, 'email_template_name'))
            .input('EMAILTEMPLATEHTML', apiHelper.getValueFromObject(bodyParams, 'email_template_html'))
            .input('MAILSUPPLIER', apiHelper.getValueFromObject(bodyParams, 'mail_supplier'))
            .input('EMAILTEMPLATEPARAMS', templateParams)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.CRM_EMAILTEMPLATE_CREATEORUPDATE_ADMINWEB);

        emailTemplateId = resCreateOrUpdate.recordset[0].RESULT;

        if (!emailTemplateId) {
            return new ServiceResponse(false, 'Thêm mới hoặc cập nhật danh sách gửi mail thất bại !');
        }

        return new ServiceResponse(true, '', emailTemplateId);
    } catch (e) {
        logger.error(e, { function: 'EmailTemplateService.CreateOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('EMAILTEMPLATEID', id)
            .execute(PROCEDURE_NAME.CRM_EMAILTEMPLATE_GETBYID_ADMINWEB);

        let emailTemplate = responseData.recordset[0];

        if (emailTemplate) {
            emailTemplate = moduleClass.detail(emailTemplate);

            emailTemplate.email_template_params = emailTemplate.email_template_params
                ? JSON.parse(emailTemplate.email_template_params)
                : [];

            return new ServiceResponse(true, '', emailTemplate);
        } else {
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        }
    } catch (e) {
        logger.error(e, { function: 'EmailTemplateService.getDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deleteList = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

    try {
        await transaction.begin();
        for (let emailTemplateId of list_id) {
            const request = new sql.Request(transaction);
            const resultRes = await request
                .input('EMAILTEMPLATEID', emailTemplateId)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.CRM_EMAILTEMPLATE_DELETE_ADMINWEB);

            if (!resultRes.recordset[0]?.RESULT) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Xóa mẫu email thất bại !');
            }
        }

        await transaction.commit();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'EmailTemplateService.deleteList' });
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
