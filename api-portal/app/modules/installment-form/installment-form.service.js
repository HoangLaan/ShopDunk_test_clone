const lodash = require('lodash');
const sql = require('mssql');
const mssql = require('../../models/mssql');

const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const moduleClass = require('./installment-form.class');

const getList = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getValueFromObject(queryParams, 'search');
        const installmentPartnerId = apiHelper.getValueFromObject(queryParams, 'installment_partner_id');

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('INSTALLMENTPARTNERID', installmentPartnerId)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute('SL_INSTALLMENTFORM_GetList_AdminWeb');

        return new ServiceResponse(true, '', {
            data: moduleClass.list(data.recordset),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'InstallmentForm.getList' });
        return new ServiceResponse(true, '', []);
    }
};

const createOrUpdate = async (bodyParams) => {
    let installmentFormId = apiHelper.getValueFromObject(bodyParams, 'installment_form_id');
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        const resCreateOrUpdateBudget = await request
            .input('INSTALLMENTFORMID', installmentFormId)
            .input('INSTALLMENTFORMNAME', apiHelper.getValueFromObject(bodyParams, 'installment_form_name'))
            .input('INSTALLMENTPARTNERID', apiHelper.getValueFromObject(bodyParams, 'installment_partner_id'))
            .input(
                'INSTALLMENTPARTNERPERIODID',
                apiHelper.getValueFromObject(bodyParams, 'installment_partner_period_id'),
            )
            .input('ISCREDITCARD', apiHelper.getValueFromObject(bodyParams, 'is_credit_card'))
            .input('ISFINANCECOMPANY', apiHelper.getValueFromObject(bodyParams, 'is_finance_company'))
            .input('ISAPPLYORDER', apiHelper.getValueFromObject(bodyParams, 'is_apply_order'))
            .input('ISAPPLYPRODUCT', apiHelper.getValueFromObject(bodyParams, 'is_apply_product'))
            .input('TOTALMONEYFROM', apiHelper.getValueFromObject(bodyParams, 'total_money_from'))
            .input('TOTALMONEYTO', apiHelper.getValueFromObject(bodyParams, 'total_money_to'))
            .input('ISAPPLYALLCATEGORY', apiHelper.getValueFromObject(bodyParams, 'is_apply_all_category'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .execute('SL_INSTALLMENTFORM_CreateOrUpdate_AdminWeb');

        installmentFormId = resCreateOrUpdateBudget.recordset[0].RESULT;

        if (!installmentFormId) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        const productList = apiHelper.getValueFromObject(bodyParams, 'product_list', []);
        const createProductsResult = await _createInstallmentFormProduct(installmentFormId, productList, transaction);
        if (!createProductsResult) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        const categoryList = apiHelper.getValueFromObject(bodyParams, 'category_list', []);
        const createCategoryResult = await _createInstallmentFormCategory(installmentFormId, categoryList, transaction);
        if (!createCategoryResult) {
            await transaction.rollback();
            return ServiceResponse(false, 'failed');
        }

        await transaction.commit();
        return new ServiceResponse(true, '', installmentFormId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'InstallmentFormService.CreateOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const _createInstallmentFormProduct = async (installmentFormId, data, transaction) => {
    try {
        // delete
        const request = new sql.Request(transaction);
        await request
            .input('INSTALLMENTFORMID', installmentFormId)
            .execute('SL_INSTALLMENTFORM_PRODUCT_DeleteByInstallmentFormId_AdminWeb');
        // insert
        for (const product of data) {
            const request = new sql.Request(transaction);
            await request
                .input('INSTALLMENTFORMID', installmentFormId)
                .input('PRODUCTID', product.product_id)
                .execute('SL_INSTALLMENTFORM_PRODUCT_Create_AdminWeb');
        }

        return true;
    } catch (error) {
        logger.error(error, { function: 'InstallmentFormService._createInstallmentFormProduct' });
        return false;
    }
};

const _createInstallmentFormCategory = async (installmentFormId, data, transaction) => {
    try {
        // delete
        const request = new sql.Request(transaction);
        await request
            .input('INSTALLMENTFORMID', installmentFormId)
            .execute('SL_INSTALLMENTFORM_CATEGORY_DeleteByInstallmentFormId_AdminWeb');
        // insert
        for (const category of data) {
            const request = new sql.Request(transaction);
            await request
                .input('INSTALLMENTFORMID', installmentFormId)
                .input('CATEGORYID', category.category_id)
                .execute('SL_INSTALLMENTFORM_CATEGORY_Create_AdminWeb');
        }

        return true;
    } catch (error) {
        logger.error(error, { function: 'InstallmentFormService._createInstallmentFormCategory' });
        return false;
    }
};

const getDetail = async (id) => {
    try {
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('INSTALLMENTFORMID', id)
            .execute('SL_INSTALLMENTFORM_GetById_AdminWeb');

        let installmentForm = responseData.recordset[0] || {};
        let categorys = responseData.recordsets[1];
        let products = responseData.recordsets[2];

        const installmentFormDetail = moduleClass.detail(installmentForm);
        installmentFormDetail.category_list = moduleClass.categoryList(categorys);
        installmentFormDetail.product_list = moduleClass.productList(products);

        // handle for radio
        if (installmentFormDetail.is_credit_card) {
            installmentFormDetail.installment_type = 1;
        } else {
            installmentFormDetail.installment_type = 0;
        }

        installmentFormDetail.installment_partner_period_id = Number(
            installmentFormDetail.installment_partner_period_id,
        );

        return new ServiceResponse(true, '', installmentFormDetail);
    } catch (e) {
        logger.error(e, { function: 'InstallmentFormService.getDetail' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteList = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);

    try {
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await transaction.begin();

        if (list_id && list_id.length > 0) {
            for (let id of list_id) {
                const request = new sql.Request(transaction);
                const dataRes = await request
                    .input('INSTALLMENTFORMID', id)
                    .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SL_INSTALLMENT_FORM_DeleteById_AdminWeb');

                if (!dataRes?.recordset[0]?.RESULT) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'failed');
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'InstallmentFormService.deleteList' });
        return new ServiceResponse(false, e.message);
    }
};

const getOptions = async (queryParams) => {
    try {
        const totalMoney = apiHelper.getValueFromObject(queryParams, 'total_money');
        const productIds = apiHelper.getValueFromObject(queryParams, 'product_ids');
        const installmentType = apiHelper.getValueFromObject(queryParams, 'installment_type'); // 1 là qua thẻ tín dụng, 2 là qua công ty tài chính
        const pool = await mssql.pool;
        const responseData = await pool
            .request()
            .input('TOTALMONEY', totalMoney)
            .input('PRODUCTIDS', productIds)
            .input('INSTALLMENTTYPE', installmentType)
            .execute('SL_INSTALLMENTFORM_GetOptions_AdminWeb');

        return new ServiceResponse(true, '', moduleClass.option(responseData.recordset));
    } catch (e) {
        logger.error(e, { function: 'InstallmentFormService.getOptions' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getList,
    createOrUpdate,
    getDetail,
    deleteList,
    getOptions,
};
