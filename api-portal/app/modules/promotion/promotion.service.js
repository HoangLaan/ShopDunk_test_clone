const promotionClass = require('../promotion/promotion.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const _ = require('lodash');
const folderNameImg = 'promotion';
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');

const COUPON_PRODUCT_TYPE = {
    ANY: 1,
    APPOINT: 2,
};
/**
 * Get list CRM_SEGMENT
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListPromotion = async (queryParams = {}, username = '') => {
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
            .input('BEGINDATE', apiHelper.getValueFromObject(queryParams, 'begin_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(queryParams, 'end_date'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'bussiness_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('USERNAME', username)
            .input('APPLYSTATUS', apiHelper.getValueFromObject(queryParams, 'apply_status'))
            .execute(PROCEDURE_NAME.SM_PROMOTION_GETLIST);
        const promotions = data.recordset;
        return new ServiceResponse(true, '', {
            data: promotionClass.list(promotions),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(promotions),
        });
    } catch (e) {
        logger.error(e, { function: 'promotionService.getListPromotion' });
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (promotionId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('PROMOTIONID', promotionId).execute('SM_PROMOTION_GetById_AdminWeb');

        let promotion = data.recordsets[0];
        if (promotion && promotion.length > 0) {
            promotion = promotionClass.detail(promotion[0]);
            if (promotion.business_id) {
                promotion.business_id = parseArrToString(promotion.business_id, false, ',');
            }
            promotion.store_apply_list = data.recordsets[1];
            promotion.product_list = data.recordsets[2];
            promotion.customer_type_list = data.recordsets[3];
            promotion.product_category_apply_list = data.recordsets[4];
            promotion.payment_form_list = data.recordsets[5];
            promotion.promotion_offer_apply_list = data.recordsets[6];
            promotion.order_type_list = data.recordsets[7]?.map(o => o?.id);
            promotion.check_offer_apply = 1;
            promotion.product_promotion_list = data.recordsets[8];
            return new ServiceResponse(true, '', promotion);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'promotionService.detail' });
        return new ServiceResponse(false, e.message);
    }
};

const saveImg = async (base64) => {
    let avatarIcon = null;
    try {
        if (fileHelper.isBase64(base64)) {
            const extension = fileHelper.getExtensionFromBase64(base64);
            const d = new Date();
            const nameFile =
                String(d.getDay().toString()) +
                d.getMonth().toString() +
                d.getFullYear().toString() +
                d.getHours().toString() +
                d.getMinutes().toString() +
                d.getSeconds().toString() +
                d.getMilliseconds().toString();
            avatarIcon = await fileHelper.saveBase64(folderNameImg, base64, `${nameFile}.${extension}`);
        } else {
            avatarIcon = base64.split(config.domain_cdn)[1];
        }
    } catch (e) {
        logger.error(e, { function: 'promotionService.saveImg' });

        return avatarIcon;
    }
    return avatarIcon;
};

const checkArray = (value) => {
    if (value.prop && value.prop.constructor === Array) {
        return true;
    }
    return false;
};

const parseArrToString = (value, parse = true, syb = ',', type = 'string', valueDefault = null) => {
    let result = valueDefault;
    if (value) {
        if (parse) {
            if (checkArray(value)) {
                result = value.join(syb);
            }
        } else {
            value = value.toString();
            if (value.includes(syb)) {
                let arrSplit = [];
                result = [];
                arrSplit = value.split(syb);
                arrSplit.map((val, index) => {
                    if (val) {
                        let checkValNum = parseInt(val) ?? 0;
                        if (type === 'string') {
                            checkValNum = `${checkValNum}`;
                        }
                        result.push(checkValNum);
                    }
                });
            }
        }
    }
    return result;
};

// Create Promotions
const createPromotionOrUpdates = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const url_banner = apiHelper.getValueFromObject(bodyParams, 'url_banner_promotion');
        const url_image_promotion = apiHelper.getValueFromObject(bodyParams, 'url_image_promotion');
        const pathUrlBanner =
            url_banner !== null && url_banner !== ''
                ? await saveImg(apiHelper.getValueFromObject(bodyParams, 'url_banner_promotion'))
                : '';
        const pathUrlImagePromotion =
            url_image_promotion !== null && url_image_promotion !== ''
                ? await saveImg(apiHelper.getValueFromObject(bodyParams, 'url_image_promotion'))
                : '';
        const is_apply_all_store = apiHelper.getValueFromObject(bodyParams, 'is_apply_all_store', 0);
        const is_all_product = apiHelper.getValueFromObject(bodyParams, 'is_all_product', 0);
        const is_all_product_category = apiHelper.getValueFromObject(bodyParams, 'is_apply_product_category', 0);
        const is_all_customer_type = apiHelper.getValueFromObject(bodyParams, 'is_all_customer_type', 0);
        const is_all_payment_form = apiHelper.getValueFromObject(bodyParams, 'is_all_payment_form', 0);
        const type_apply_product = apiHelper.getValueFromObject(bodyParams, 'type_apply_product');

        //set time start & time end when is apply hour
        let time_start = apiHelper.getValueFromObject(bodyParams, 'time_start');
        let time_end = apiHelper.getValueFromObject(bodyParams, 'time_end');
        const is_apply_hour = apiHelper.getValueFromObject(bodyParams, 'is_apply_hour', 0);
        if (is_apply_hour) {
            time_start = null;
            time_end = null;
        }
        //set apply  birthday list
        let apply_birthday_list = apiHelper.getValueFromObject(bodyParams, 'apply_birthday_list');
        let is_promorion_by_apply_birthday = apiHelper.getValueFromObject(bodyParams, 'is_promorion_by_apply_birthday');
        if (!is_promorion_by_apply_birthday) {
            apply_birthday_list = null;
        }
        let isApplyPromotionAnyProduct = 0;
        let isApplyPromotionAppointProduct = 0;
        const isAllPromotionProduct = apiHelper.getValueFromObject(bodyParams, 'is_all_promotion_product', 0);
        const typeApplyPromotionProduct = apiHelper.getValueFromObject(bodyParams, 'type_apply_promotion_product');
        if (isAllPromotionProduct) {
            if (typeApplyPromotionProduct == 1) {
                isApplyPromotionAnyProduct = 1;
            } else {
                isApplyPromotionAppointProduct = 1;
            }
        }
        // create table Promotions
        const requestPromotionCreate = new sql.Request(transaction);
        const dataPromotionCreate = await requestPromotionCreate
            .input('PROMOTIONID', apiHelper.getValueFromObject(bodyParams, 'promotion_id'))
            .input('PROMOTIONNAME', apiHelper.getValueFromObject(bodyParams, 'promotion_name'))
            // .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('SHORTDESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'short_description'))
            .input('URLBANNER', pathUrlBanner)
            .input('BEGINDATE', apiHelper.getValueFromObject(bodyParams, 'begin_date'))
            .input('ISPROMOTIONCUSTOMERTYPE', is_all_customer_type ? 0 : 1)
            .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
            .input('ISPROMOTIONBYPRICE', apiHelper.getValueFromObject(bodyParams, 'is_promotion_by_price'))
            .input('FROMPRICE', apiHelper.getValueFromObject(bodyParams, 'from_price'))
            .input('TOPRICE', apiHelper.getValueFromObject(bodyParams, 'to_price', 0)?.toString())
            .input(
                'ISAPPLYWITHORDERPROMOTION',
                apiHelper.getValueFromObject(bodyParams, 'is_apply_with_order_promotion'),
            )
            .input('ISPROMOTIONBYTOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'is_promotion_by_total_money'))
            .input('ISPROMORIONBYAPPLYBIRTHDAY', is_promorion_by_apply_birthday)
            .input('STARTHOURS', apiHelper.getValueFromObject(bodyParams, 'start_hours'))
            .input('ENDHOURS', apiHelper.getValueFromObject(bodyParams, 'end_hours'))
            .input('MINPROMOTIONTOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'min_promotion_total_money'))
            .input('MAXPROMOTIONTOTALMONEY', apiHelper.getValueFromObject(bodyParams, 'max_promotion_total_money'))
            .input(
                'ISPROMOTIONBYTOTALQUANTITY',
                apiHelper.getValueFromObject(bodyParams, 'is_promorion_by_total_quantity'),
            )
            .input(
                'MINPROMOTIONTOTALQUANTITY',
                apiHelper.getValueFromObject(bodyParams, 'min_promotion_total_quantity'),
            )
            .input(
                'MAXPROMOTIONTOTALQUANTITY',
                apiHelper.getValueFromObject(bodyParams, 'max_promotion_total_quantity'),
            )
            .input('ISLIMITPROMOTIONTIMES', apiHelper.getValueFromObject(bodyParams, 'is_limit_promotion_times'))
            .input('MAXPROMOTIONTIMES', apiHelper.getValueFromObject(bodyParams, 'max_promotion_times'))
            .input('URLIMAGEPROMOTION', pathUrlImagePromotion)
            .input('ISAPPLYHOURS', apiHelper.getValueFromObject(bodyParams, 'is_apply_hours'))
            .input('ISAPPLYSUN', apiHelper.getValueFromObject(bodyParams, 'is_apply_sun'))
            .input('ISAPPLYMON', apiHelper.getValueFromObject(bodyParams, 'is_apply_mon'))
            .input('ISAPPLYTU', apiHelper.getValueFromObject(bodyParams, 'is_apply_tu'))
            .input('ISAPPLYWE', apiHelper.getValueFromObject(bodyParams, 'is_apply_we'))
            .input('ISAPPLYTH', apiHelper.getValueFromObject(bodyParams, 'is_apply_th'))
            .input('ISAPPLYFR', apiHelper.getValueFromObject(bodyParams, 'is_apply_fr'))
            .input('ISAPPLYSA', apiHelper.getValueFromObject(bodyParams, 'is_apply_sa'))
            .input('ISCOMBOPROMOTION', apiHelper.getValueFromObject(bodyParams, 'is_combo_promotion'))
            .input('ISREWARDPOINT', apiHelper.getValueFromObject(bodyParams, 'is_reward_point'))
            .input('USERREVIEW', apiHelper.getValueFromObject(bodyParams, 'reviewed_user'))
            .input('NOTEREVIEW', apiHelper.getValueFromObject(bodyParams, 'note_review'))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('ISPROMOTIONBYPRODUCT', isAllPromotionProduct)
            .input('ISPROMOTIONANYPRODUCT', isApplyPromotionAnyProduct)
            .input('ISPROMOTIONAPPOINTPRODUCT', isApplyPromotionAppointProduct)
            .input('CREATEDUSER', auth_name)
            .input('ISAPPLYORDER', apiHelper.getValueFromObject(bodyParams, 'is_apply_order'))
            .input('ISAPPLYALLPRODUCT', is_all_product)
            .input('ISAPPLYPRODUCTCOMBO', apiHelper.getValueFromObject(bodyParams, 'is_apply_product_combo', false))
            .input('ISAPPLYFORWEB', apiHelper.getValueFromObject(bodyParams, 'is_apply_for_web', false))
            .input('ISAPPLYSALECHANNEL', apiHelper.getValueFromObject(bodyParams, 'is_apply_sale_channel', false))
            .input('TIMESTART', apiHelper.getValueFromObject(bodyParams, 'time_start'))
            .input('TIMEEND', apiHelper.getValueFromObject(bodyParams, 'time_end'))
            .input('ISAPPLYALLSTORE', is_apply_all_store)
            .input('ISAPPLYPRODUCTCATEGORY', is_all_product_category ? 0 : 1)
            .input('APPLYBIRTHDAYLIST', apply_birthday_list)
            .input('ISALLPAYMENTFORM', is_all_payment_form)
            .input('ORDERTYPELIST', apiHelper.getValueFromObject(bodyParams, 'order_type_list'))
            .input('ISAPLLYANYPRODUCT', type_apply_product == COUPON_PRODUCT_TYPE.ANY)
            .input('ISAPLLYAPPOINTPRODUCT', type_apply_product == COUPON_PRODUCT_TYPE.APPOINT)
            .execute('SM_PROMOTION_CreateOrUpdate_AdminWeb');

        const promotionId = dataPromotionCreate.recordset[0].RESULT;
        if (promotionId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.PROMOTION.CREATE_FAILED);
        }
        // check update
        const id = apiHelper.getValueFromObject(bodyParams, 'promotion_id');

        if (Boolean(id)) {
            // remove table map SM_PROMOTIONAPPLY_PRODUCTCATEGORY
            const deleteMapingTransaction = new sql.Request(transaction);
            await deleteMapingTransaction
                .input('PROMOTIONID', id)
                .input('UPDATEDUSER', auth_name)
                .execute('SM_PROMOTIONAPPLY_PRODUCT_DeleteByMapping_AdminWeb');
        }

        if (!is_all_product) {
            // create table SM_PROMOTIONAPPLY_PRODUCT
            const list_apply_product = apiHelper.getValueFromObject(bodyParams, 'product_list');
            if (list_apply_product && list_apply_product.length > 0) {
                const requestPromotionAPCreate = new sql.Request(transaction);
                for (let i = 0; i < list_apply_product.length; i++) {
                    const item = list_apply_product[i];
                    await requestPromotionAPCreate // eslint-disable-line no-await-in-loop
                        .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                        .input('PROMOTIONID', promotionId)
                        .input('CREATEDUSER', auth_name)
                        .execute('SM_PROMOTIONAPPLY_PRODUCT_Create_AdminWeb');
                }
            }
        }

        if (isAllPromotionProduct) {
            // create table SM_PROMOTIONAPPLY_PRODUCT
            const list_promotion_apply_product = apiHelper.getValueFromObject(bodyParams, 'product_promotion_list');
            if (list_promotion_apply_product && Array.isArray(list_promotion_apply_product) && list_promotion_apply_product.length > 0) {
                const requestPromotionAPCreate = new sql.Request(transaction);
                for (let i = 0; i < list_promotion_apply_product.length; i++) {
                    const item = list_promotion_apply_product[i];
                    await requestPromotionAPCreate // eslint-disable-line no-await-in-loop
                        .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                        .input('PROMOTIONID', promotionId)
                        .input('CREATEDUSER', auth_name)
                        .execute('SM_PROMOTIONAPPLY_PRODUCT_GIFT_Create_AdminWeb');
                }
            }
        }

        if (!is_all_product_category) {
            // create table SM_PROMOTIONAPPLY_PRODUCTCATEGORY
            const product_category_apply_list = apiHelper.getValueFromObject(bodyParams, 'product_category_apply_list');
            if (product_category_apply_list && product_category_apply_list.length > 0) {
                const requestPromotionAPCCreate = new sql.Request(transaction);
                for (let i = 0; i < product_category_apply_list.length; i++) {
                    const item = product_category_apply_list[i];
                    await requestPromotionAPCCreate // eslint-disable-line no-await-in-loop
                        .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(item, 'product_category_id'))
                        .input('PROMOTIONID', promotionId)
                        .input('CREATEDUSER', auth_name)
                        .execute('SM_PROMOTIONAPPLY_PRODUCTCATEGORY_Create_AdminWeb');
                }
            }
        }

        // create table SM_PROMOTIONOFFER_APPLY
        const promotion_offer_apply_list = apiHelper.getValueFromObject(bodyParams, 'promotion_offer_apply_list');
        if (promotion_offer_apply_list && promotion_offer_apply_list.length > 0) {
            const requestPromotionOACreate = new sql.Request(transaction);
            for (let i = 0; i < promotion_offer_apply_list.length; i++) {
                const item = promotion_offer_apply_list[i];
                await requestPromotionOACreate // eslint-disable-line no-await-in-loop
                    .input('PROMOTIONID', promotionId)
                    .input('PROMOTIONOFFERID', apiHelper.getValueFromObject(item, 'promotion_offer_id'))
                    .input('CREATEDUSER', auth_name)
                    .execute('SM_PROMOTIONOFFER_APPLY_Create_AdminWeb');
            }
        }

        if (!is_all_customer_type) {
            // create table SM_PROMOTION_CUSTOMERTYPE
            const customer_type_list = apiHelper.getValueFromObject(bodyParams, 'customer_type_list');
            if (customer_type_list && customer_type_list.length > 0) {
                const requestPromotionCTCreate = new sql.Request(transaction);
                for (let i = 0; i < customer_type_list.length; i++) {
                    const item = customer_type_list[i];
                    await requestPromotionCTCreate // eslint-disable-line no-await-in-loop
                        .input('PROMOTIONID', promotionId)
                        .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
                        .input('CUSTOMERTYPEID', apiHelper.getValueFromObject(item, 'customer_type_id'))
                        .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
                        .input('CREATEDUSER', auth_name)
                        .execute('SM_PROMOTION_CUSTOMERTYPE_Create_AdminWeb');
                }
            }
        }

        //create table SM_PROMOTION_BUSINESS
        let businessArrId = apiHelper.getValueFromObject(bodyParams, 'business_id', []);
        if (businessArrId && businessArrId.length > 0) {
            const requestPromotionBusinessCreate = new sql.Request(transaction);
            for (let i = 0; i < businessArrId.length; i++) {
                const item = businessArrId[i];
                await requestPromotionBusinessCreate // eslint-disable-line no-await-in-loop
                    .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
                    .input('PROMOTIONID', promotionId)
                    .input('BUSINESSID', item)
                    .input('ISACTIVE', 1)
                    .input('CREATEDUSER', auth_name)
                    .execute('SM_PROMOTION_COMPANY_CreateOrUpdate_AdminWeb');
            }
        }

        // create table SM_PROMOTION_COMPANY
        const list_company = apiHelper.getValueFromObject(bodyParams, 'list_company');
        if (list_company && list_company.length > 0) {
            const requestPromotionCompanyCreate = new sql.Request(transaction);
            for (let i = 0; i < list_company.length; i++) {
                const item = list_company[i];
                await requestPromotionCompanyCreate // eslint-disable-line no-await-in-loop
                    .input('COMPANYID', apiHelper.getValueFromObject(item, 'company_id'))
                    .input('PROMOTIONID', promotionId)
                    .input('BUSINESSID', apiHelper.getValueFromObject(item, 'business_id'))
                    .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
                    .input('CREATEDUSER', auth_name)
                    .execute('SM_PROMOTION_COMPANY_Create_AdminWeb');
            }
        }

        if (!is_all_payment_form) {
            //create table SM_PROMOTIONAPPLY_PAYMENT
            const payment_form_list = apiHelper.getValueFromObject(bodyParams, 'payment_form_list');
            const reqAddPromotionPaymentForm = new sql.Request(transaction);
            if (payment_form_list && payment_form_list.length > 0) {
                for (let k = 0; k < payment_form_list.length; k++) {
                    const paymentForm = payment_form_list[k];
                    await reqAddPromotionPaymentForm
                        .input('PROMOTIONID', promotionId)
                        .input('PAYMENTFORMID', paymentForm.payment_form_id)
                        .input('CREATEDUSER', auth_name)
                        .execute('SM_PROMOTIONAPPLY_PAYMENTFORM_Create_AdminWeb');
                }
            }
        }

        if (!is_apply_all_store) {
            //create table SM_PROMOTIONAPPLY_PAYMENT
            const store_apply_list = apiHelper.getValueFromObject(bodyParams, 'store_apply_list');
            if (store_apply_list && store_apply_list.length > 0) {
                const reqAddPromotionPaymentForm = new sql.Request(transaction);
                for (let k = 0; k < store_apply_list.length; k++) {
                    const paymentForm = store_apply_list[k];
                    await reqAddPromotionPaymentForm
                        .input('PROMOTIONID', promotionId)
                        .input('STOREID', paymentForm.store_id)
                        .input('CREATEDUSER', auth_name)
                        .execute('SM_PROMOTIONAPPLY_STORE_Create_AdminWeb');
                }
            }
        }

        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, '', promotionId);
    } catch (e) {
        logger.error(e, { function: 'promotionService.createPromotionOrUpdates' });
        await transaction.rollback();
        return new ServiceResponse(false);
    }
};

const changeStatusPromotion = async (promotionId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PROMOTIONID', promotionId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SM_PROMOTION_UPDATESTATUS);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'promotionService.changeStatusPromotion' });

        return new ServiceResponse(false);
    }
};

const deletePromotion = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
    const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
    await transaction.begin();
    try {
        // check array delete
        if (list_id?.length > 0) {
            // construction request transaction
            const requestPromotionCheckUsed = new sql.Request(transaction);
            const requestPromotionProductDelete = new sql.Request(transaction);
            const requestPromotionOfferDelete = new sql.Request(transaction);
            const requestPromotionCustomerDelete = new sql.Request(transaction);
            const requestPromotionCompanyDelete = new sql.Request(transaction);
            const requestPromotionDelete = new sql.Request(transaction);
            // begin loop delete
            for (let i = 0; i < list_id.length; i++) {
                let promotionId = list_id[i];
                // check used
                const data = await requestPromotionCheckUsed
                    .input('PROMOTIONID', promotionId)
                    .execute(PROCEDURE_NAME.SM_PROMOTION_CHECKUSED);
                let used = promotionClass.detailUsed(data.recordset);
                if (used[0].result === 1) {
                    // used
                    return new ServiceResponse(
                        false,
                        'Không thể xóa, khuyến mãi này đang sử dụng bởi ' + used[0].table_used,
                        null,
                    );
                }

                // remove table map SM_PROMOTIONAPPLY_PRODUCT
                const dataPromotionProductDelete = await requestPromotionProductDelete
                    .input('PROMOTIONID', promotionId)
                    .input('UPDATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.SM_PROMOTIONAPPLY_PRODUCT_DELETEBYPROMOTIONID);
                const resultPromotionProductDelete = dataPromotionProductDelete.recordset[0].RESULT;
                if (resultPromotionProductDelete <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PROMOTION.DELETE_FAILED);
                }

                // remove table map SM_PROMOTIONOFFER_APPLY
                const dataPromotionOfferDelete = await requestPromotionOfferDelete
                    .input('PROMOTIONID', promotionId)
                    .input('UPDATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.SM_PROMOTIONOFFER_APPLY_DELETEBYPROMOTIONID);
                const resultPromotionOfferDelete = dataPromotionOfferDelete.recordset[0].RESULT;
                if (resultPromotionOfferDelete <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PROMOTION.DELETE_FAILED);
                }

                // remove table map SM_PROMOTION_CUSTOMER
                const dataPromotionCustomerDelete = await requestPromotionCustomerDelete
                    .input('PROMOTIONID', promotionId)
                    .input('UPDATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.SM_PROMOTION_CUSTOMERTYPE_DELETEBYPROMOTIONID);
                const resultPromotionCustomerDelete = dataPromotionCustomerDelete.recordset[0].RESULT;
                if (resultPromotionCustomerDelete <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PROMOTION.DELETE_FAILED);
                }

                // remove table map SM_PROMOTION_CUSTOMER
                const dataPromotionCompanyDelete = await requestPromotionCompanyDelete
                    .input('PROMOTIONID', promotionId)
                    .input('UPDATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.SM_PROMOTION_COMPANY_DELETEBYPROMOTIONID);
                const resultPromotionCompanyDelete = dataPromotionCompanyDelete.recordset[0].RESULT;
                if (resultPromotionCompanyDelete <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PROMOTION.DELETE_FAILED);
                }

                // remove table PROMOTION
                const dataPromotiondelete = await requestPromotionDelete
                    .input('PROMOTIONID', promotionId)
                    .input('UPDATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.SM_PROMOTION_DELETE);
                const resultPromotionDelete = dataPromotiondelete.recordset[0].RESULT;
                if (resultPromotionDelete <= 0) {
                    return new ServiceResponse(false, RESPONSE_MSG.PROMOTION.DELETE_FAILED);
                }
            }
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true, RESPONSE_MSG.PROMOTION.DELETE_SUCCESS);
    } catch (e) {
        logger.error(e, { function: 'promotionService.deletePromotion' });
        await transaction.rollback();
        return new ServiceResponse(false, e.message);
    }
};

const approvePromotion = async (promotionId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PROMOTIONID', promotionId)
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
            .input('NOTEREVIEW', apiHelper.getValueFromObject(bodyParams, 'note_review'))
            .input('USERREVIEW', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.SM_PROMOTION_APPROVE);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'promotionService.approvePromotion' });

        return new ServiceResponse(false);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.CRM_TASKTYPE_OPTIONS);
};

const stopPromotion = async (promotionId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PROMOTIONID', promotionId)
            .input('STOPPEDREASON', apiHelper.getValueFromObject(bodyParams, 'reason'))
            .input('STOPPEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SM_PROMOTION_Stop_AdminWeb');
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'promotionService.stopPromotion' });

        return new ServiceResponse(false);
    }
};

const getTotalPromotion = async (queryParams = {}, username = '') => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.SM_PROMOTION_GETTOTAL_ADMINWEB);
        let promotions = data.recordsets;
        let groupPromotion = {};
        if (promotions[3]) {
            groupPromotion = {
                total_use: promotions[0]?.[0]?.TOTALUSE ?? 0,
                total_not_use: promotions[1]?.[0]?.TOTALPEDDING ?? 0,
                total_stop: promotions[2]?.[0]?.TOTALSTOP ?? 0,
                total: promotions[3]?.[0]?.TOTAL ?? 0,
            };
        } else {
            groupPromotion = {
                total_use: 0,
                total_not_use: 0,
                total_stop: 0,
                total: 0,
            };
        }
        return new ServiceResponse(true, '', groupPromotion);
    } catch (e) {
        logger.error(e, { function: 'promotionService.getTotalPromotion' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListPromotion,
    detail,
    createPromotionOrUpdates,
    changeStatusPromotion,
    approvePromotion,
    deletePromotion,
    stopPromotion,
    getTotalPromotion,
    parseArrToString
};
