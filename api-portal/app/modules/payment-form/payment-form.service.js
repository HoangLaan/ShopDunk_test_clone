const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const _ = require('lodash');
const paymentFormClass = require('./payment-form.class');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getPaymentFormList = async (queryParams = {}) => {
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
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(queryParams, 'payment_type'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(PROCEDURE_NAME.AC_PAYMENTFORM_GETLIST_ADMINWEB);

        const paymentForm = data.recordset;

        return new ServiceResponse(true, '', {
            data: paymentFormClass.list(paymentForm),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(paymentForm),
        });
    } catch (e) {
        logger.error(e, { function: 'paymentFormService.getPaymentFormList' });

        return new ServiceResponse(true, '', {});
    }
};

const createOrUpdatePaymentForm = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        // Save
        const createOrUpdatePaymentForm = new sql.Request(transaction);
        const resCreateOrUpdatePaymentForm = await createOrUpdatePaymentForm
            .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
            .input('PAYMENTFORMNAME', apiHelper.getValueFromObject(bodyParams, 'payment_form_name'))
            .input('PAYMENTFORMCODE', apiHelper.getValueFromObject(bodyParams, 'payment_form_code')) //
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('PARTNERID', apiHelper.getValueFromObject(bodyParams, 'partner_id')) //
            .input('PAYMENTTYPE', apiHelper.getValueFromObject(bodyParams, 'payment_type')) //
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('ISALLBUSINESS', apiHelper.getValueFromObject(bodyParams, 'is_all_business'))
            .input('ISALLSTORE', apiHelper.getValueFromObject(bodyParams, 'is_all_store'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system')) //
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.AC_PAYMENTFORM_CREATEORUPDATE_ADMINWEB);

        const paymentFormId = apiHelper.getResult(resCreateOrUpdatePaymentForm.recordset);

        if (paymentFormId === 'error_name') {
            await transaction.rollback();
            return new ServiceResponse(false, 'Trùng tên hình thức thanh toán', null);
        }

        if (paymentFormId === 'error_code') {
            await transaction.rollback();
            return new ServiceResponse(false, 'Trùng mã hình thức thanh toán', null);
        }

        if (!paymentFormId) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo thanh toán thất bại', null);
        }

        const list_store = apiHelper.getValueFromObject(bodyParams, 'list_store');
        const list_business = apiHelper.getValueFromObject(bodyParams, 'list_business');
        if (apiHelper.getValueFromObject(bodyParams, 'payment_form_id')) {
            //Delete store in update payment form
            const list_store_delete = list_store.filter((x) => !_.isEmpty(x.payment_form_store_id));
            const list_business_delete = list_business.filter((x) => !_.isEmpty(x.payment_form_business_id));
            const requestStoreDelete = new sql.Request(transaction);
            const resStoreDelete = await requestStoreDelete
                .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
                .input('LISTID', list_store_delete.map((x) => x.payment_form_store_id).join(','))
                .execute(PROCEDURE_NAME.AC_PAYMENTFORM_STORE_DELETEMANY_ADMINWEB);
            if (!apiHelper.getResult(resStoreDelete.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi xóa cửa hàng.');
            }
            //Delete business in update payment form
            const requestBusinessDelete = new sql.Request(transaction);
            const resBusinessDelete = await requestBusinessDelete
                .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
                .input('LISTID', list_business_delete.map((x) => x.payment_form_business_id).join(','))
                .execute(PROCEDURE_NAME.AC_PAYMENTFORM_BUSINESS_DETELEMANY_ADMINWEB);
            if (!apiHelper.getResult(resBusinessDelete.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi xóa cửa hàng.');
            }
        }
        const list_store_create = list_store?.filter((x) => _.isEmpty(x.payment_form_store_id));
        const list_business_create = list_business?.filter((x) => _.isEmpty(x.payment_form_business_id));
        if (list_store_create && list_store_create.length > 0) {
            for (const element of list_store_create) {
                const requestStoreCreate = new sql.Request(transaction);
                const resStoreCreate = await requestStoreCreate
                    .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
                    .input('STOREID', apiHelper.getValueFromObject(element, 'store_id'))
                    .execute(PROCEDURE_NAME.AC_PAYMENTFORM_STORE_CREATE_ADMINWEB);
                if (!apiHelper.getResult(resStoreCreate.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi thêm mới cửa hàng.');
                }
            }
        }

        if (list_business_create && list_business_create.length > 0) {
            for (const element of list_business_create) {
                const requestBusinessCreate = new sql.Request(transaction);
                const resBusinessCreate = await requestBusinessCreate
                    .input('PAYMENTFORMID', apiHelper.getValueFromObject(bodyParams, 'payment_form_id'))
                    .input('BUSINESSID', apiHelper.getValueFromObject(element, 'business_id'))
                    .execute(PROCEDURE_NAME.AC_PAYMENTFORM_BUSINESS_CREATE_ADMINWEB);
                if (!apiHelper.getResult(resBusinessCreate.recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Lỗi thêm mới miền.');
                }
            }
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { PaymentForm: 'paymentFormService.createOrUpdatePaymentForm' });
        return new ServiceResponse(false, e.message);
    }
};

const paymentFormDetail = async (id) => {
    try {
        const pool = await mssql.pool;

        const resData = await pool
            .request()
            .input('PAYMENTFORMID', id)
            .execute(PROCEDURE_NAME.AC_PAYMENTFORM_GETBYID_ADMINWEB);
        return new ServiceResponse(true, '', {
            ...paymentFormClass.detail(resData.recordsets?.[0]?.[0]),
            list_store: paymentFormClass.listStore(resData.recordsets?.[1]),
            list_business: paymentFormClass.listBusiness(resData.recordsets?.[2]),
        });
    } catch (e) {
        logger.error(e, { function: 'paymentFormService.paymentFormDetail' });

        return new ServiceResponse(false, e.message);
    }
};

const deletePaymentForm = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        for (let index = 0; index < list_id.length; index++) {
            const requestDelete = new sql.Request(transaction);
            const resDelete = await requestDelete
                .input('PAYMENTFORMID', list_id[index])
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.AC_PAYMENTFORM_DELETE_ADMINWEB);
            if (!apiHelper.getResult(resDelete.recordset)) {
                await transaction.rollback();
                return ServiceResponse(false, 'Lỗi xóa hình thức thanh toán');
            }
        }
        await transaction.commit();
        removeCacheOptions();
        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        await transaction.rollback();

        logger.error(e, { function: 'paymentFormService.deletePaymentForm' });
        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const PAYMENT_TYPE = {
    CASH: 1,
    BANK: 2,
    PAY_PARTNER: 3,
    POS: 4,

};
/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListByStore = async (store_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', store_id)
            .execute(PROCEDURE_NAME.AC_PAYMENTFORM_GETLISTBYSTOREID_ADMINWEB);
        const list = paymentFormClass.listByStore(data.recordsets[0]);
        const list_bank = paymentFormClass.listBank(data.recordsets[1]);

        const paymentList = (list || []).reduce((acc, curr) => {
            // thanh toan tien mat
            if (curr.payment_type === PAYMENT_TYPE.CASH) {
                acc.push(curr);
            }
            // thanh toan chuyen khoan
            else if (curr.payment_type === PAYMENT_TYPE.BANK) {
                acc.push({ ...curr, bank_list: list_bank });
            }
            // thanh toan doi tac
            else if (curr.payment_type === PAYMENT_TYPE.PAY_PARTNER) {
                acc.push(curr);
            }  
             // thanh toan may pos
            else if (curr.payment_type === PAYMENT_TYPE.POS) {
                acc.push(curr);
            }

            return acc;
        }, []);
        return new ServiceResponse(true, '', paymentList);
    } catch (e) {
        logger.error(e, { function: 'paymentFormService.getListByStore' });
        return new ServiceResponse(false, e, []);
    }
};

const getOptions = async (query) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COMPANYID', apiHelper.getValueFromObject(query, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(query, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(query, 'store_id'))
            .execute('AC_PAYMENTFORM_GetOptions_AdminWeb');
        const options = data.recordset || [];

        return new ServiceResponse(true, '', paymentFormClass.listOption(options));
    } catch (e) {
        logger.error(e, { function: 'paymentFormService.getOptions' });
        return new ServiceResponse(true, e?.message, []);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.AC_PAYMENTFORM_OPTIONS);
};

module.exports = {
    getPaymentFormList,
    createOrUpdatePaymentForm,
    paymentFormDetail,
    deletePaymentForm,
    getListByStore,
    getOptions,
};
