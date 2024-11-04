const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const ModuleClass = require('./discount-program.class');
const _ = require('lodash');
const folderNameImg = 'discountProgram';
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');
const { PromotionCodeType, InstallmentType } = require('./ultils/constant');
const { parseArrToString } = require('../promotion/promotion.service');

/**
 * Get list discount
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListDiscountProgram = async (queryParams = {}) => {
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
            .input('APPLYDATEFROM', apiHelper.getValueFromObject(queryParams, 'apply_date_from'))
            .input('APPLYDATETO', apiHelper.getValueFromObject(queryParams, 'apply_date_to'))
            .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            //.input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('ISDEBIT', apiHelper.getValueFromObject(queryParams, 'is_debit'))
            .input('TAB', apiHelper.getValueFromObject(queryParams, 'tab'))
            //.input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .execute('PO_DISCOUNTPROGRAM_GetList_AdminWeb');

        const discountPrograms = data.recordset;
        return new ServiceResponse(true, '', {
            data: discountPrograms,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(discountPrograms),
        });
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.getListDiscountProgram' });
        return new ServiceResponse(true, '', {});
    }
};

const getStatiticDiscountProgram = async (queryParams = {}) => {
    try {
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('APPLYDATEFROM', apiHelper.getValueFromObject(queryParams, 'apply_date_from'))
            .input('APPLYDATETO', apiHelper.getValueFromObject(queryParams, 'apply_date_to'))
            .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            //.input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('ISDEBIT', apiHelper.getValueFromObject(queryParams, 'is_debit'))
            //.input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .execute('PO_DISCOUNTPROGRAM_Statitic_AdminWeb');

        const data = resData.recordset;
        return new ServiceResponse(true, '', data);
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.getListDiscountProgram' });
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (discountProgramId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DISCOUNTPROGRAMID', discountProgramId)
            .execute('PO_DISCOUNTPROGRAM_GetById_AdminWeb');

        let discountProgram = data.recordset[0];
        if (discountProgram.business_id) {
            discountProgram.business_id = parseArrToString(discountProgram.business_id, false, ',');
        }
        discountProgram.area_list = data.recordsets[1]?.map((o) => o?.id);
        discountProgram.store_apply_list = data.recordsets[2];
        discountProgram.product_list = data.recordsets[3];
        discountProgram.trade_in_program_list = data.recordsets[4];
        discountProgram.promotion_code_list = data.recordsets[5];
        discountProgram.gift_list = data.recordsets[6];
        discountProgram.service_package_list = data.recordsets[7];
        discountProgram.finance_company_list = data.recordsets[8];
        discountProgram.bank_list = (data.recordsets[9] || []).map((o) => ({
            ...o,
            bank_logo: o.bank_logo ? config.domain_cdn + o.bank_logo : null,
        }));

        return new ServiceResponse(true, '', discountProgram);
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

// Create discount
const createDiscountProgramOrUpdates = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const discount_program_id = apiHelper.getValueFromObject(bodyParams, 'discount_program_id');
        const is_apply_all_product = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_product');

        const is_apply_with_trade_in_program = apiHelper.getValueFromObject(
            bodyParams,
            'is_apply_with_trade_in_program',
        );
        const is_apply_direct_discount = apiHelper.getValueFromObject(bodyParams, 'is_apply_direct_discount');
        const supplier_promotion_code = apiHelper.getValueFromObject(bodyParams, 'supplier_promotion_code');
        const is_apply_quantity_discount = apiHelper.getValueFromObject(bodyParams, 'is_apply_quantity_discount');
        const is_apply_gift = apiHelper.getValueFromObject(bodyParams, 'is_apply_gift');
        const is_apply_service_pack = apiHelper.getValueFromObject(bodyParams, 'is_apply_service_pack');
        const is_free_service_package = apiHelper.getValueFromObject(bodyParams, 'is_free_service_package');
        const is_apply_installment_product = apiHelper.getValueFromObject(bodyParams, 'is_apply_installment_product');
        const is_installment_finance_company = apiHelper.getValueFromObject(
            bodyParams,
            'is_installment_finance_company',
        );
        const is_apply_all_discount_program = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_discount_program');

        const requestDiscountProgramCreate = new sql.Request(transaction);
        const dataDiscountProgramCreate = await requestDiscountProgramCreate
            // common info
            .input('DISCOUNTPROGRAMID', discount_program_id)
            .input('DISCOUNTPROGRAMNAME', apiHelper.getValueFromObject(bodyParams, 'discount_program_name', '').trim())
            .input('ISDEBIT', apiHelper.getValueFromObject(bodyParams, 'debit_type'))
            .input('MANUFACTUREID', apiHelper.getValueFromObject(bodyParams, 'manufacture_id'))
            .input('FROMDATE', apiHelper.getValueFromObject(bodyParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(bodyParams, 'to_date'))
            // .input('FROMHOUR', apiHelper.getValueFromObject(bodyParams, 'from_hour'))
            // .input('TOHOUR', apiHelper.getValueFromObject(bodyParams, 'to_hour'))
            // .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('AREALIST', JSON.stringify(apiHelper.getValueFromObject(bodyParams, 'area_list', [])))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description', '').trim())

            //condition
            .input('ISAPPLYWITHTRADEINPROGRAM', is_apply_with_trade_in_program)
            .input('ISAPPLYDIRECTDISCOUNT', is_apply_direct_discount)
            .input('SUPPLIERPROMOTIONCODE', supplier_promotion_code)
            .input('ISAPPLYQUANTITYDISCOUNT', is_apply_quantity_discount)
            .input('ISAPPLYGIFT', is_apply_gift)
            .input('ISAPPLYSERVICEPACK', is_apply_service_pack)
            .input('ISFREESERVICEPACKAGE', is_free_service_package)
            .input('ISAPPLYINSTALLMENTPRODUCT', is_apply_installment_product)
            .input('ISINSTALLMENTFINANCECOMPANY', is_installment_finance_company)
            .input('ISAPPLYALLDISCOUNTPROGRAM', is_apply_all_discount_program)

            .input('ISAPPLYALLPRODUCT', is_apply_all_product)

            .input('ISAPPLYALLSTORE', apiHelper.getValueFromObject(bodyParams, 'is_apply_all_store', 0))
            .input('STORELIST', JSON.stringify(apiHelper.getValueFromObject(bodyParams, 'store_apply_list', [])))

            .input('USERNAME', auth_name)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('USERREVIEW', apiHelper.getValueFromObject(bodyParams, 'reviewed_user', null))
            .execute('PO_DISCOUNTPROGRAM_CreateOrUpdate_AdminWeb');

        const discountProgramId = dataDiscountProgramCreate.recordset[0]?.RESULT;
        if (discountProgramId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Tạo chương trình chiết khấu không thành công');
        }

        const businessArrId = apiHelper.getValueFromObject(bodyParams, 'business_id', []);
        let businessId = []

        businessArrId.forEach(item => {
            businessId.push(item);
        });
        const resultString = businessId.join('|');
        const requestProgramBusinessCreate = new sql.Request(transaction);
        await requestProgramBusinessCreate // eslint-disable-line no-await-in-loop
            .input('DISCOUNTPROGRAMID', discountProgramId)
            .input('BUSINESSID', resultString)
            .input('ISACTIVE', 1)
            .input('CREATEDUSER', auth_name)
            .execute('PO_DISCOUNTPROGRAM_BUSINESS_CreateOrUpdate_AdminWeb');

        const product_list = apiHelper.getValueFromObject(bodyParams, 'product_list');
        if (product_list && product_list.length > 0 && !Boolean(is_apply_quantity_discount)) {
            const addProductRequest = new sql.Request(transaction);

            for (let i = 0; i < product_list.length; i++) {
                const item = product_list[i];
                await addProductRequest
                    .input('DISCOUNTPROGRAMID', discountProgramId)
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                    .input('CREATEDUSER', auth_name)
                    .execute('PO_DISCOUNTPROGRAM_PRODUCT_CreateOrUpdate_AdminWeb');
            }
        }

        switch (true) {
            case Boolean(is_apply_with_trade_in_program):
                const trade_in_program_list = apiHelper.getValueFromObject(bodyParams, 'trade_in_program_list', []);
                const addTradeInProgramRequest = new sql.Request(transaction);

                for (let i = 0; i < trade_in_program_list.length; i++) {
                    const item = trade_in_program_list[i];
                    await addTradeInProgramRequest
                        .input('DISCOUNTPROGRAMID', discountProgramId)
                        .input('TRADEINPROGRAMID', apiHelper.getValueFromObject(item, 'trade_in_program_id'))
                        .input('SUPPLIERDEDUCTIBLE', apiHelper.getValueFromObject(item, 'supplier_deductible'))
                        .input('BUYERDEDUCTIBLE', apiHelper.getValueFromObject(item, 'buyer_deductible'))
                        .input('SUPPLIERDEDUCTIBLETYPE', apiHelper.getValueFromObject(item, 'supplier_deductible_type'))
                        .input('BUYERDEDUCTIBLETYPE', apiHelper.getValueFromObject(item, 'buyer_deductible_type'))
                        .execute('PO_DISCOUNTPROGRAM_TRADEINPROGRAM_CreateOrUpdate_AdminWeb');
                }

                break;
            case Boolean(is_apply_direct_discount):
                if (+supplier_promotion_code === PromotionCodeType.SHOPDUNK) {
                    const promotion_code_list = apiHelper.getValueFromObject(bodyParams, 'promotion_code_list', []);
                    const addPromotionCodeRequest = new sql.Request(transaction);

                    for (let i = 0; i < promotion_code_list.length; i++) {
                        const item = promotion_code_list[i];
                        await addPromotionCodeRequest
                            .input('DISCOUNTPROGRAMID', discountProgramId)
                            .input('PROMOTIONCODE', apiHelper.getValueFromObject(item, 'promotion_code'))
                            .input('CODETYPE', apiHelper.getValueFromObject(item, 'code_type'))
                            .input('CODEVALUE', apiHelper.getValueFromObject(item, 'code_value'))
                            .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
                            .execute('PO_DISCOUNTPROGRAM_PROMOTIONCODE_CreateOrUpdate_AdminWeb');
                    }
                }

                break;
            case Boolean(is_apply_quantity_discount):
                const discount_product_list = apiHelper.getValueFromObject(bodyParams, 'discount_product_list', []);
                const addDiscountProductRequest = new sql.Request(transaction);

                for (let i = 0; i < discount_product_list.length; i++) {
                    const item = discount_product_list[i];
                    await addDiscountProductRequest
                        .input('DISCOUNTPROGRAMID', discountProgramId)
                        .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                        .input('NUMBEROFPRODUCT', apiHelper.getValueFromObject(item, 'number_of_product'))
                        .input('VALUE', apiHelper.getValueFromObject(item, 'value'))
                        .input('VALUETYPE', apiHelper.getValueFromObject(item, 'value_type'))
                        .input('CREATEDUSER', auth_name)
                        .execute('PO_DISCOUNTPROGRAM_PRODUCT_CreateOrUpdate_AdminWeb');
                }

                break;
            case Boolean(is_apply_gift):
                const gift_list = apiHelper.getValueFromObject(bodyParams, 'gift_list', []);
                const addGiftRequest = new sql.Request(transaction);

                for (let i = 0; i < gift_list.length; i++) {
                    const item = gift_list[i];
                    await addGiftRequest
                        .input('DISCOUNTPROGRAMID', discountProgramId)
                        .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                        .input('QUANTITYGIFT', apiHelper.getValueFromObject(item, 'quantity_gift'))
                        .execute('PO_DISCOUNTPROGRAM_GIFT_CreateOrUpdate_AdminWeb');
                }

                break;
            case Boolean(is_apply_service_pack):
                const service_package_list = apiHelper.getValueFromObject(bodyParams, 'service_package_list', []);
                const addServicePackageRequest = new sql.Request(transaction);

                for (let i = 0; i < service_package_list.length; i++) {
                    const item = service_package_list[i];
                    await addServicePackageRequest
                        .input('DISCOUNTPROGRAMID', discountProgramId)
                        .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                        .input('TIME', apiHelper.getValueFromObject(item, 'time'))
                        .input('TIMETYPE', apiHelper.getValueFromObject(item, 'time_type'))
                        .execute('PO_DISCOUNTPROGRAM_SERVICEPACK_CreateOrUpdate_AdminWeb');
                }

                break;
            case Boolean(is_apply_installment_product):
                if (+is_installment_finance_company === InstallmentType.FINANCE_COMPANY) {
                    const finance_company_list = apiHelper.getValueFromObject(bodyParams, 'finance_company_list', []);
                    const addServicePackageRequest = new sql.Request(transaction);

                    for (let i = 0; i < finance_company_list.length; i++) {
                        const item = finance_company_list[i];
                        await addServicePackageRequest
                            .input('DISCOUNTPROGRAMID', discountProgramId)
                            .input('FINANCECOMPANYID', apiHelper.getValueFromObject(item, 'finance_company_id'))
                            .input('PREPAYMENTRATE', apiHelper.getValueFromObject(item, 'prepayment_rate'))
                            .input('FROMTIME', apiHelper.getValueFromObject(item, 'from_time'))
                            .input('TOTIME', apiHelper.getValueFromObject(item, 'to_time'))
                            .input('TIMETYPE', apiHelper.getValueFromObject(item, 'time_type'))
                            .execute('PO_DISCOUNTPROGRAM_FINANCIALCOMPANY_CreateOrUpdate_AdminWeb');
                    }
                }

                if (+is_installment_finance_company === InstallmentType.BANK) {
                    const bank_list = apiHelper.getValueFromObject(bodyParams, 'bank_list', []);
                    const addServicePackageRequest = new sql.Request(transaction);

                    for (let i = 0; i < bank_list.length; i++) {
                        const item = bank_list[i];
                        await addServicePackageRequest
                            .input('DISCOUNTPROGRAMID', discountProgramId)
                            .input('BANKID', apiHelper.getValueFromObject(item, 'bank_id'))
                            .execute('PO_DISCOUNTPROGRAM_BANK_CreateOrUpdate_AdminWeb');
                    }
                }

                break;
        }

        removeCacheOptions();
        // await transaction.rollback();
        await transaction.commit();
        return new ServiceResponse(true, '', discountProgramId);
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.createDiscountProgramOrUpdates' });
        await transaction.rollback();
        return new ServiceResponse(false);
    }
};

const deleteDiscountProgram = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
    const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
    await transaction.begin();
    try {
        // check array delete
        if (list_id?.length > 0) {
            // construction request transaction
            const requestDiscountProgramProductApplyDelete = new sql.Request(transaction);
            const requestDiscountProgramProductDelete = new sql.Request(transaction);
            const requestDiscountProgramDelete = new sql.Request(transaction);
            // begin loop delete
            for (let i = 0; i < list_id.length; i++) {
                let discountProgramId = list_id[i];

                // remove table map PO_DISCOUNTPROGRAMPRODUCT_APPLY
                const dataDiscountProgramProductApplyDelete = await requestDiscountProgramProductApplyDelete
                    .input('DISCOUNTPROGRAMID', discountProgramId)
                    .input('UPDATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.PO_DISCOUNTPROGRAMPRODUCT_APPLY_DELETEBYID_ADMINWEB);
                const resultPromotionProductIdDelete = dataDiscountProgramProductApplyDelete.recordset[0].RESULT;
                if (resultPromotionProductIdDelete <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PO_DISCOUNTPROGRAM.DELETE_FAILED);
                }

                // remove table map PO_DISCOUNTPROGRAM_PRODUCT
                const dataDiscountProgramProductDelete = await requestDiscountProgramProductDelete
                    .input('DISCOUNTPROGRAMID', discountProgramId)
                    .input('UPDATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.PO_DISCOUNTPROGRAM_PRODUCT_DELETEBYID_ADMINWEB);
                const resultDiscountProgramProductDelete = dataDiscountProgramProductDelete.recordset[0].RESULT;
                if (resultDiscountProgramProductDelete <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PO_DISCOUNTPROGRAM.DELETE_FAILED);
                }

                // remove table PO_DISCOUNTPROGRAM
                const dataDiscountProgramDelete = await requestDiscountProgramDelete
                    .input('DISCOUNTPROGRAMID', discountProgramId)
                    .input('UPDATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.PO_DISCOUNTPROGRAM_DELETEBYID_ADMINWEB);
                const resultDiscountProgramDelete = dataDiscountProgramDelete.recordset[0].RESULT;
                if (resultDiscountProgramDelete <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PO_DISCOUNTPROGRAM.DELETE_FAILED);
                }
            }
        }

        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, RESPONSE_MSG.PO_DISCOUNTPROGRAM.DELETE_SUCCESS);
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.deleteDiscountProgram' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const approveReview = async (discountProgramId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('DISCOUNTPROGRAMID', discountProgramId)
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
            .input('NOTEREVIEW', apiHelper.getValueFromObject(bodyParams, 'note_review'))
            .input('USERREVIEW', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('PO_DISCOUNTPROGRAM_Approve');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.approveReview' });

        return new ServiceResponse(false);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.PO_DISCOUNTPROGRAM_OPTIONS);
};

const getOptions = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('PO_DISCOUNTPROGRAM_GetOptions_AdminWeb');

        const list = ModuleClass.getOptions(data.recordset);

        return new ServiceResponse(true, 'success', list);
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.getOptions' });
        return new ServiceResponse(false, e.message);
    }
};

const getDiscountProducts = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DISCOUNTPROGRAMIDS', apiHelper.getValueFromObject(queryParams, 'discount_program_ids', null))
            .execute('PO_DISCOUNTPROGRAM_GetProductList_AdminWeb');
        const list = ModuleClass.getProducts(data.recordset);
        return new ServiceResponse(true, 'success', list);
    } catch (e) {
        logger.error(e, { function: 'discountProgramService.getDiscountProducts' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListDiscountProgram,
    getStatiticDiscountProgram,
    detail,
    createDiscountProgramOrUpdates,
    deleteDiscountProgram,
    getOptions,
    getDiscountProducts,
    approveReview,
};
