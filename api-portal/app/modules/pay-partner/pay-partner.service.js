const payPartnerClass = require('./pay-partner.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const sql = require('mssql');
const fileHelper = require('../../common/helpers/file.helper');

const getList = async (params = {}) => {
    try {
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const page = apiHelper.getCurrentPage(params);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', page)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .execute(PROCEDURE_NAME.MD_PAYPARTNER_GETLIST_ADMINWEB);
        return new ServiceResponse(true, '', {
            list: payPartnerClass.list(res.recordset),
            total: apiHelper.getTotalData(res.recordset),
            itemsPerPage: itemsPerPage,
            page: page,
        });
    } catch (error) {
        logger.error(error, { function: 'PayPartnerService.getList' });
        return new ServiceResponse(false, error);
    }
};

const getListStoreBankAccount = async (params = {}) => {
    try {
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const page = apiHelper.getCurrentPage(params);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'keyword', null))
            .input('ISACTIVE', apiHelper.getValueFromObject(params, 'is_active', API_CONST.ISACTIVE.ALL))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', page)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .execute(PROCEDURE_NAME.MD_STOREBANKACCOUNT_GETLIST_ADMINWEB);
        return new ServiceResponse(true, '', {
            list: payPartnerClass.listStoreBankAccount(res.recordset),
            total: apiHelper.getTotalData(res.recordset),
            itemsPerPage: itemsPerPage,
            page: page,
        });
    } catch (error) {
        logger.error(error, { function: 'PayPartnerService.getListStoreBankAccount' });
        return new ServiceResponse(false, error);
    }
};

const createOrUpdate = async (id = null, body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        let logo = apiHelper.getValueFromObject(body, 'logo');
        if (fileHelper.isBase64(logo)) {
            logo = await fileHelper.saveBase64(null, logo);
        }
        const requestCreateOrUpdate = new sql.Request(transaction);
        const res = await requestCreateOrUpdate
            .input('PAYPARTNERID', id)
            .input('PAYPARTNERNAME', apiHelper.getValueFromObject(body, 'pay_partner_name'))
            .input('PAYPARTNERFULLNAME', apiHelper.getValueFromObject(body, 'pay_partner_full_name'))
            .input('PAYPARTNERCODE', apiHelper.getValueFromObject(body, 'pay_partner_code'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('NAMECONTACT', apiHelper.getValueFromObject(body, 'name_contact'))
            .input('PHONECONTACT', apiHelper.getValueFromObject(body, 'phone_contact'))
            .input('POSITIONCONTACT', apiHelper.getValueFromObject(body, 'position_contact'))
            .input('EMAILCONTACT', apiHelper.getValueFromObject(body, 'email_contact'))
            .input('REFUNDAY', apiHelper.getValueFromObject(body, 'refun_day'))
            .input('TRANSACTIONFEELC', apiHelper.getValueFromObject(body, 'transaction_fee_lc'))
            .input('FIXEDCHARGELC', apiHelper.getValueFromObject(body, 'fixed_charge_lc'))
            .input('ARISEFEELC', apiHelper.getValueFromObject(body, 'arise_fee_lc'))
            .input('TRANSACTIONFEEIC', apiHelper.getValueFromObject(body, 'transaction_fee_ic'))
            .input('FIXEDCHARGEIC', apiHelper.getValueFromObject(body, 'fixed_charge_ic'))
            .input('ARISEFEEIC', apiHelper.getValueFromObject(body, 'arise_fee_ic'))
            .input('FILENAME', apiHelper.getValueFromObject(body, 'file_name'))
            .input('FILENAMEPATH', apiHelper.getValueFromObject(body, 'file_name_path'))
            .input('LOGO', logo)
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active', API_CONST.ISACTIVE.ACTIVE))
            .input('ISSYSTEM', apiHelper.getValueFromObject(body, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(PROCEDURE_NAME.MD_PAYPARTNER_CREATEORUPDATE_ADMINWEB);
        if (!apiHelper.getResult(res.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Trùng mã đối tác thanh toán');
        }
        const list_api = apiHelper.getValueFromObject(body, 'list_api', []);
        const list_account = apiHelper.getValueFromObject(body, 'list_account', []);
        if (id) {
            const requestDeleteApi = new sql.Request(transaction);
            const responseDeleteApi = await requestDeleteApi
                .input('PAYPARTNERID', id)
                .execute(PROCEDURE_NAME.MD_PAYPARTNER_API_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(responseDeleteApi.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đối tác thanh toán');
            }
            const list_account_delete = list_account.filter((x) => x.pay_partner_benefit_acc_id);
            const requestDeleteACC = new sql.Request(transaction);
            const responseDeleteACC = await requestDeleteACC
                .input('LISTID', list_account_delete.map((x) => x.pay_partner_benefit_acc_id).join(','))
                .input('PAYPARTNERID', id)
                .execute(PROCEDURE_NAME.MD_PAYPARTNER_BENEFITACC_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(responseDeleteACC.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đối tác thanh toán');
            }
        }
        if (list_api.length > 0) {
            for (let index = 0; index < list_api.length; index++) {
                const element = list_api[index];
                const requestCreateOrUpdateAPI = new sql.Request(transaction);
                const resCreateOrUpdateAPI = await requestCreateOrUpdateAPI
                    .input('PAYPARTNERAPIID', apiHelper.getValueFromObject(element, 'pay_partner_api_id'))
                    .input('PAYPARTNERID', apiHelper.getResult(res.recordset))
                    .input('APIURL', apiHelper.getValueFromObject(element, 'api_url'))
                    .input('ACCOUNT', apiHelper.getValueFromObject(element, 'account'))
                    .input('PASSWORD', apiHelper.getValueFromObject(element, 'password'))
                    .input('ISDEFAULT', apiHelper.getValueFromObject(element, 'is_default'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.MD_PAYPARTNER_API_CREATEORUPDATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateOrUpdateAPI.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đối tác thanh toán');
                }
            }
        }
        if (list_account.length > 0) {
            let list_create_ACC = list_account.filter((x) => !x.pay_partner_benefit_acc_id);
            for (let index = 0; index < list_create_ACC.length; index++) {
                const element = list_create_ACC[index];
                const requestCreateACC = new sql.Request(transaction);
                const resCreateACC = await requestCreateACC
                    .input('PAYPARTNERID', apiHelper.getResult(res.recordset))
                    .input('BANKACCOUNTID', apiHelper.getValueFromObject(element, 'bank_account_id'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute(PROCEDURE_NAME.MD_PAYPARTNER_BENEFITACC_CREATE_ADMINWEB);
                if (!apiHelper.getResult(resCreateACC.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi tạo hoặc cập nhật đối tác thanh toán');
                }
            }
        }
        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'PayPartnerService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const detail = async (id) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PAYPARTNERID', id)
            .execute(PROCEDURE_NAME.MD_PAYPARTNER_GETBYID_ADMINWEB);
        return new ServiceResponse(true, '', {
            ...payPartnerClass.detail(res.recordsets[0]?.[0]),
            list_account: payPartnerClass.listStoreBankAccount(res.recordsets[1]),
            list_api: payPartnerClass.listApi(res.recordsets[2]),
        });
    } catch (error) {
        logger.error(error, { function: 'PayPartnerService.detail' });
        return new ServiceResponse(false, '', {});
    }
};

const remove = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const requestDelete = new sql.Request(transaction);
        for (let index = 0; index < list_id.length; index++) {
            const element = list_id[index];
            const data = await requestDelete
                .input('PAYPARTNERID', element)
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.MD_PAYPARTNER_DELETE_ADMINWEB);
            if (!apiHelper.getResult(data.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi xóa đối tác thanh toán');
            }
        }
        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'PayPartnerService.delete' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_PAYPARTNER_OPTIONS);
};

const getListOptions = async (query) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('ISINSTALLMENT', apiHelper.getValueFromObject(query, 'is_installment'))
            .execute('MD_PAYPARTNER_GetListOptions_AdminWeb');

        return new ServiceResponse(true, '', payPartnerClass.options(res.recordset));
    } catch (error) {
        logger.error(error, { function: 'PayPartnerService.detail' });
        return new ServiceResponse(false, '', {});
    }
};

module.exports = {
    getList,
    detail,
    remove,
    createOrUpdate,
    getListStoreBankAccount,
    getListOptions,
};
