const PriceClass = require('../sl-prices/sl-prices.class');
const ProductService = require('../product/product.service');
const outputTypeClass = require('../output-type/output-type.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const readXlsxFile = require('read-excel-file/node');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const _ = require('lodash');
const API_CONST = require('../../common/const/api.const');
let xl = require('excel4node');
const { COMMON_GETLISTSTOCKSOUTTYPEFILTER } = require('../../common/const/procedureName.const');
const { CRUD } = require('../../common/const/responseMsg.const');
const contain = require('./contain');
const { getListArea } = require('../area/area.service');
const { getBusinessList } = require('../business/business.service');
const { getListOutputType } = require('../output-type/output-type.service');
const { getCurrentDateFormatted } = require('./helper');
const { insertImportPriceQueue } = require('../../queue/import-prices');

/**
 * Get list SL_PRICES
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListPrice = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        let product_type_id = apiHelper.getValueFromObject(queryParams, 'product_type_id');
        const product_type_pro_mat = apiHelper.getValueFromObject(queryParams, 'product_type_pro_mat', null);
        let model_id = apiHelper.getValueFromObject(queryParams, 'model_id');
        if (parseInt(product_type_id) === contain.checkProductType['3']) {
            product_type_id = 2;
        } else {
            // model_id = null;
        }


        let productCategoryId = apiHelper.getValueFromObject(queryParams, 'product_category_id', null);

        let resultProductCategory = null;
        if (productCategoryId) {
            const poolProductCategory = await mssql.pool;
            const dataProductCategory = await poolProductCategory
                .request()
                .input('PARENTID', productCategoryId)
                .execute('MD_PRODUCTCATEGORY_GetListRecursiveOption');
            resultProductCategory = dataProductCategory.recordset;
            resultProductCategory = PriceClass.optionsProductCategory(resultProductCategory) ?? [];
            if (contain.checkEmptyArray(resultProductCategory)) {
                const FEILDDEFF = 'id_category';
                resultProductCategory = resultProductCategory?.map(o => o?.id_category);
            }
            resultProductCategory.push(productCategoryId);
            resultProductCategory = resultProductCategory.join(',')
        }

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(queryParams, 'output_type_id'))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('MODELID', model_id)
            .input('PRODUCTTYPEPROORMAT', product_type_pro_mat)
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(queryParams, 'imei_code'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('ISREVIEW', apiHelper.getValueFromObject(queryParams, 'is_review'))
            .input('STATUSAPPLYID', apiHelper.getValueFromObject(queryParams, 'status_apply_id'))
            .input('STARTDATE', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('ENDDATE', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('PRODUCTTYPEID', product_type_id)
            .input('CATEGORYID', resultProductCategory)
            .input('USERLOGIN', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_PRICES_GetList');
        const prices = data.recordset;

        return new ServiceResponse(true, '', {
            data: PriceClass.list(prices),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(prices),
        });
    } catch (e) {
        logger.error(e, { function: 'priceService.getListPrice' });
        return new ServiceResponse(false, '', {});
    }
};

/**
 * Create SL_PRICES
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createPrice = async (bodyParams = {}) => {
    return await createOrUpdatePrice(bodyParams);
};

const updatePrice = async (bodyParams = {}) => {
    return await createOrUpdatePrice(bodyParams);
};

const createOrUpdatePrice = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        // Begin transaction
        await transaction.begin();
        let arPriceList = [];
        // check trung giá
        let areaId = '|';
        let storeId = '|';
        let businessId = '|';
        let productType = apiHelper.getValueFromObject(bodyParams, 'product_type');
        // return new ServiceResponse(true, RESPONSE_MSG.SL_PRICES.CREATE_SUCCESS);
        // lấy danh sach khu vực áp dụng chuyen ve chuoi theo dang a|b
        const list_areas = apiHelper.getValueFromObject(bodyParams, 'areas');
        if (list_areas && list_areas.length > 0) {
            areaId = list_areas.map((_area) => _area.value).join('|');
        }

        // // lấy danh sách cửa hàng áp dụng chuyển về chuỗi dạng a|b
        // const list_store = apiHelper.getValueFromObject(bodyParams, 'stores');
        // if (list_store && list_store.length > 0) {
        //     storeId = list_store.map((_store) => _store.value).join("|")
        // }

        // Lấy danh sách cở sở/chi nhánh áp dụng chuyển về theo dạng a|b
        const list_business = apiHelper.getValueFromObject(bodyParams, 'businesses');
        if (list_business && list_business.length > 0) {
            businessId = list_business.map((_business) => _business.value).join('|');
        }

        // Trường hợp 1 htx thì chọn bình thường
        // Trường hợp làm giá cho nhiều htx, htx được chọn cũng phải có tất cả mức duyệt là tự động, được insert
        let checkListOutputType = apiHelper.getValueFromObject(bodyParams, 'list_output_type_submit');

        checkListOutputType = Object.values(checkListOutputType || {});

        const checkReviewList = apiHelper.getValueFromObject(bodyParams, 'review_list');

        let countCheck = 0;
        let resultCheckOutputList = false;
        if (checkReviewList && checkReviewList.length) {
            for (let i = 0; i < checkReviewList.length; i++) {
                if (1 * checkReviewList[i].is_auto_reviewed == 1) {
                    countCheck++;
                }
            }
            if (countCheck == checkReviewList.length) {
                resultCheckOutputList = true;
            }
        }

        // Lấy danh sách sản phẩm và nguyên liệu áp dụng
        let product_list = apiHelper.getValueFromObject(bodyParams, 'product_list');

        product_list = Object.values(product_list) || [];

        const productError = [];

        // Làm giá 1 htx sẽ không có checkListOutputType hoặc nhiều htx với htx đó có resultCheckOutputList true
        if (
            !checkListOutputType ||
            checkListOutputType.length == 0 ||
            (checkListOutputType && checkListOutputType.length > 0 && 1 * resultCheckOutputList === 1)
        ) {
            const requestPrice = new sql.Request(transaction);

            const requestApplyReviewLevelCreate = new sql.Request(transaction);

            const requestApplyReviewDelete = new sql.Request(transaction);

            const requestApplyOutputtypeDelete = new sql.Request(transaction);
            for (let i = 0; i < product_list.length; i++) {
                let item = product_list[i];
                let productId = null;
                let materialId = null;
                const checkTypeProductDeff = apiHelper.getValueFromObject(item, 'product_type_deff', 1);
                if (contain.DEFFPRODUCTMATERIAL.product == checkTypeProductDeff) {
                    productId = apiHelper.getValueFromObject(item, 'product_id');
                } else {
                    materialId = apiHelper.getValueFromObject(item, 'product_id');
                }
                // check trùng giá sản phẩm
                const checkDuplicatesPrice = new sql.Request(transaction);
                const datacheckDuplicatesPrice = await checkDuplicatesPrice
                    .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
                    .input('PRODUCTID', productId)
                    .input('MATERIALID', materialId)
                    .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(item, 'product_imei'))
                    .input('AREAID', areaId)
                    .input('BUSINESSID', businessId)
                    .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
                    .input('PRICEID', apiHelper.getValueFromObject(bodyParams, 'price_id'))
                    .input('PRODUCTTYPE', apiHelper.getValueFromObject(item, 'product_type'))
                    .execute('SL_PRICES_CheckDuplicates');
                const resultCheck = datacheckDuplicatesPrice.recordset[0].RESULT;

                if (resultCheck) {
                    productError.push({ product_id: item?.product_id, product_type: item?.product_type });
                }
                let productImei = apiHelper.getValueFromObject(item, 'product_imei');
                if (parseInt(productType) !== contain.checkProductType['1']) {
                    productImei = null;
                }
                let priceVat = apiHelper.getValueFromObject(bodyParams, 'price_vat');
                if (parseInt(productType) === contain.checkProductType['3']) {
                    priceVat = apiHelper.getValueFromObject(item, 'price_vat');
                }
                const resultPrice = await requestPrice
                    .input('PRICEID', apiHelper.getValueFromObject(bodyParams, 'price_id'))
                    .input('PRODUCTID', productId)
                    .input('MATERIALID', materialId)
                    .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
                    .input('PRICE', priceVat)
                    .input('BASEPRICE', apiHelper.getValueFromObject(bodyParams, 'base_price'))
                    .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
                    .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
                    .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
                    .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
                    .input('ISOUTPUTFORWEB', apiHelper.getValueFromObject(bodyParams, 'is_output_for_web'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                    .input('MODELID', apiHelper.getValueFromObject(item, 'model_id'))
                    .input('PRODUCTIMEICODE', productImei)
                    .input('PRODUCTTYPE', apiHelper.getValueFromObject(item, 'product_type'))
                    .execute('SL_PRICES_CreateOrUpdate');
                // Get PRICEID
                const priceId = resultPrice.recordset[0].RESULT;
                if (!priceId) {
                    await transaction.rollback();
                    throw new Error(RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                } else {
                    arPriceList.push(priceId);
                }
                // insert apply outputtype
                // check update
                const id = apiHelper.getValueFromObject(bodyParams, 'price_id');
                if (id && id !== '') {
                    // if update -> delete table SL_PRICE_APPLY_OUTPUTTYPE_BUSINESS

                    const dataApplyPutputtypeDelete = await requestApplyOutputtypeDelete
                        .input('PRICEID', id)
                        .execute(PROCEDURE_NAME.SL_PRICE_APPLY_BUSINESS_OUTPUTTYPE_BUSINESS_DELETE);
                    const resultDelete = dataApplyPutputtypeDelete.recordset[0].RESULT;
                    if (resultDelete <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.UPDATE_FAILED);
                    }
                    // if update -> delete table SL_PRICE_APPLY_REVIEWLEVEL_Delete

                    const dataApplyReviewDelete = await requestApplyReviewDelete
                        .input('PRICEID', id)
                        .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_DELETE);
                    const resultReviewDelete = dataApplyReviewDelete.recordset[0].RESULT;
                    if (resultReviewDelete <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.UPDATE_FAILED);
                    }
                }
                const list_business_apply = apiHelper.getValueFromObject(bodyParams, 'businesses');
                const list_areas_apply = apiHelper.getValueFromObject(bodyParams, 'areas');

                const requestApplyOutputtypeCreate = new sql.Request(transaction);

                if (list_business_apply && list_business_apply.length > 0) {
                    for (let i = 0; i < list_business_apply.length; i++) {
                        const item = list_business_apply[i];
                        if (list_areas_apply && list_areas_apply.length > 0) {
                            for (let i = 0; i < list_areas_apply.length; i++) {
                                const area = list_areas_apply[i];

                                const dataTaskApplyPutputtypeCreate = await requestApplyOutputtypeCreate // eslint-disable-line no-await-in-loop
                                    .input('PRICEID', priceId)
                                    .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
                                    .input('AREAID', apiHelper.getValueFromObject(area, 'value'))
                                    .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
                                    .input('BUSINESSID', apiHelper.getValueFromObject(item, 'value'))
                                    .execute(PROCEDURE_NAME.SL_PRICES_APPLY_OUTPUTTYPE_CREATEORUPDATE);
                                const applyOutputtypeId = dataTaskApplyPutputtypeCreate.recordset[0].RESULT;
                                if (applyOutputtypeId <= 0) {
                                    await transaction.rollback();
                                    return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                                }
                            }
                        }
                    }
                }
                const price_apply_reviewlevel = apiHelper.getValueFromObject(bodyParams, 'review_list');

                if (price_apply_reviewlevel && price_apply_reviewlevel.length > 0) {
                    for (let i = 0; i < price_apply_reviewlevel.length; i++) {
                        const item2 = price_apply_reviewlevel[i];

                        const dataTaskApplyReviewLevelCreate = await requestApplyReviewLevelCreate // eslint-disable-line no-await-in-loop
                            .input('PRICEID', priceId)
                            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
                            .input('PRICEREVIEWLEVELID', apiHelper.getValueFromObject(item2, 'price_review_level_id'))
                            .input('REVIEWUSER', apiHelper.getValueFromObject(item2, 'review_user'))
                            .input('AUTOREVIEW', apiHelper.getValueFromObject(item2, 'is_auto_reviewed'))
                            .input('DEPARTMENTID', apiHelper.getValueFromObject(item2, 'department_id'))
                            .execute('SL_PRICE_APPLY_REVIEWLEVEL_CreateOrUpdate');
                        const applyReviewLevelId = dataTaskApplyReviewLevelCreate.recordset[0].RESULT;
                        if (applyReviewLevelId <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                        }
                    }
                }
            }

            // Sau khi kết thúc thêm giá với nhiều htx
            if (productError && productError.length >= 1) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Lỗi đã tồn tại giá sản phẩm áp dụng cho cửa hàng và miền.', {
                    product_error: productError,
                });
            }
        } // kết thúc hàm create nếu chỉ có 1 hình thức xuất

        // Làm giá cho nhiều hình thức xuất - loại sản phẩm
        let list_output_type_submit = apiHelper.getValueFromObject(bodyParams, 'list_output_type_submit');

        list_output_type_submit = Object.values(list_output_type_submit || {});

        if (list_output_type_submit && list_output_type_submit.length) {
            for (let i = 0; i < list_output_type_submit.length; i++) {
                let item = list_output_type_submit[i];

                let checkPriceReviewLvUsers = apiHelper.getValueFromObject(item, 'reviews');

                let checkCountIsAuto = 0;

                if (checkPriceReviewLvUsers && checkPriceReviewLvUsers.length && item.price) {
                    for (let k = 0; k < checkPriceReviewLvUsers.length; k++) {
                        if (checkPriceReviewLvUsers[k].is_auto_reviewed == 1) {
                            checkCountIsAuto++;
                        }
                    }

                    if (checkCountIsAuto == checkPriceReviewLvUsers.length) {
                        // insert area, business
                        let list_business_apply = apiHelper.getValueFromObject(bodyParams, 'businesses') || [];
                        let list_areas_apply = apiHelper.getValueFromObject(bodyParams, 'areas') || [];

                        // get list area by output type id
                        // const resListArea = await listAreaByOutputType({ output_type_id: item.value });
                        // const listArea = resListArea.getData().data || [];
                        let listBusiness = [];

                        const resListBusiness = await listBussinessByArea({ area_id: areaId });
                        listBusiness = resListBusiness.getData() || [];

                        // list_areas_apply = list_areas_apply.filter((ele) => {
                        //     const area = listArea.find((el) => ele.value * 1 === el.area_id * 1);
                        //     if (area) return true;
                        //     return false;
                        // });

                        list_business_apply = list_business_apply.filter((ele) => {
                            const business = listBusiness.find((el) => ele.value * 1 === el.business_id * 1);
                            if (business) return true;
                            return false;
                        });

                        if (list_business_apply.length <= 0 || list_business_apply.length <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, 'Lỗi thêm giá với nhiều hình thức xuất');
                        }

                        for (let i = 0; i < product_list.length; i++) {
                            let itemProduct = product_list[i];

                            // Save SL_PRICES cho từng hình thức
                            const requestPrice = new sql.Request(transaction);
                            const resultPrice = await requestPrice
                                .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                                .input('PRODUCTID', apiHelper.getValueFromObject(itemProduct, 'product_id'))
                                .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'value'))
                                .input('PRICE', apiHelper.getValueFromObject(item, 'price'))
                                .input('CHANGEVALUE', apiHelper.getValueFromObject(item, 'change_value'))
                                .input('CHANGEPRICE', apiHelper.getValueFromObject(item, 'change_price'))
                                .input('BASEPRICE', apiHelper.getValueFromObject(bodyParams, 'base_price'))
                                .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
                                .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
                                .input('ISREVIEW', apiHelper.getValueFromObject(itemProduct, 'is_review'))
                                .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
                                .input('ISOUTPUTFORWEB', apiHelper.getValueFromObject(bodyParams, 'is_output_for_web'))
                                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                .input('UNITID', apiHelper.getValueFromObject(itemProduct, 'unit_id'))
                                .input('MODELID', apiHelper.getValueFromObject(itemProduct, 'model_id'))
                                .input('PRODUCTTYPE', apiHelper.getValueFromObject(itemProduct, 'product_type'))
                                .execute(PROCEDURE_NAME.SL_PRICES_CREATEORUPDATE);
                            // Get PRICEID
                            const priceIdCreateList = resultPrice.recordset[0].RESULT;

                            if (!priceIdCreateList) {
                                await transaction.rollback();
                                throw new Error(RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                            } else {
                                arPriceList.push(priceIdCreateList);
                            }

                            // insert apply output type
                            // check update case
                            const idCheck = apiHelper.getValueFromObject(item, 'price_id');
                            if (idCheck && idCheck !== '') {
                                // if update -> delete table SL_PRICE_APPLY_OUTPUTTYPE_BUSINESS
                                const requestApplyOutputtypeDelete = new sql.Request(transaction);
                                const dataApplyPutputtypeDelete = await requestApplyOutputtypeDelete
                                    .input('PRICEID', idCheck)
                                    .execute(PROCEDURE_NAME.SL_PRICE_APPLY_BUSINESS_OUTPUTTYPE_BUSINESS_DELETE);
                                const resultDelete = dataApplyPutputtypeDelete.recordset[0].RESULT;
                                if (resultDelete <= 0) {
                                    await transaction.rollback();
                                    return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.UPDATE_FAILED);
                                }
                                // if update -> delete table SL_PRICE_APPLY_REVIEWLEVEL_Delete
                                const requestApplyReviewDelete = new sql.Request(transaction);
                                const dataApplyReviewDelete = await requestApplyReviewDelete
                                    .input('PRICEID', idCheck)
                                    .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                                    .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_DELETE);
                                const resultReviewDelete = dataApplyReviewDelete.recordset[0].RESULT;
                                if (resultReviewDelete <= 0) {
                                    await transaction.rollback();
                                    return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.UPDATE_FAILED);
                                }
                            }

                            if (list_business_apply && list_business_apply.length > 0) {
                                for (let j = 0; j < list_business_apply.length; j++) {
                                    const itemBusiness = list_business_apply[j];
                                    if (list_areas_apply && list_areas_apply.length > 0) {
                                        for (let j = 0; j < list_areas_apply.length; j++) {
                                            const area = list_areas_apply[j];
                                            const requestApplyOutputtypeCreate = new sql.Request(transaction);
                                            const dataTaskApplyPutputtypeCreate = await requestApplyOutputtypeCreate // eslint-disable-line no-await-in-loop
                                                .input('PRICEID', priceIdCreateList)
                                                .input('OUTPUTTYPEID', item.value)
                                                .input('AREAID', apiHelper.getValueFromObject(area, 'value'))
                                                .input(
                                                    'COMPANYID',
                                                    apiHelper.getValueFromObject(bodyParams, 'company_id'),
                                                )
                                                .input(
                                                    'BUSINESSID',
                                                    apiHelper.getValueFromObject(itemBusiness, 'value'),
                                                )
                                                .execute(PROCEDURE_NAME.SL_PRICES_APPLY_OUTPUTTYPE_CREATEORUPDATE);
                                            const applyOutputtypeListId =
                                                dataTaskApplyPutputtypeCreate.recordset[0].RESULT;
                                            if (applyOutputtypeListId <= 0) {
                                                await transaction.rollback();
                                                return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                                            }
                                        }
                                    }
                                }
                            }

                            // insert mức duyệt
                            const price_review_lv_users = apiHelper.getValueFromObject(item, 'reviews');
                            if (price_review_lv_users && price_review_lv_users.length > 0) {
                                for (let i = 0; i < price_review_lv_users.length; i++) {
                                    const item2 = price_review_lv_users[i];
                                    const requestApplyReviewLevelCreate = new sql.Request(transaction);
                                    const dataTaskApplyReviewLevelCreate = await requestApplyReviewLevelCreate // eslint-disable-line no-await-in-loop
                                        .input('PRICEID', priceIdCreateList)
                                        .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
                                        .input(
                                            'PRICEREVIEWLEVELID',
                                            apiHelper.getValueFromObject(item2, 'price_review_level_id'),
                                        )
                                        .input('REVIEWUSER', apiHelper.getValueFromObject(item2, 'user_name'))
                                        .input('AUTOREVIEW', apiHelper.getValueFromObject(item2, 'is_auto_reviewed'))
                                        .input(
                                            'ISCOMPELEREVIEW',
                                            apiHelper.getValueFromObject(item2, 'is_compele_review'),
                                        )
                                        .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_LIST_OUPUT_CREATEORUPDATE);
                                    const applyReviewLevelId = dataTaskApplyReviewLevelCreate.recordset[0].RESULT;
                                    if (applyReviewLevelId <= 0) {
                                        await transaction.rollback();
                                        return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Commit transaction
        await transaction.commit();

        return new ServiceResponse(true, RESPONSE_MSG.SL_PRICES.CREATE_SUCCESS, {
            price_id: arPriceList,
        });
    } catch (e) {
        // Write log
        logger.error(e, { function: 'priceService.createOrUpdatePrice' });

        // Rollback transaction
        await transaction.rollback();

        return new ServiceResponse(false, e);
    }
};

const detailPrice = async (productId, queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', productId)
            .input('PAGESIZE', apiHelper.getItemsPerPage(queryParams))
            .input('PAGEINDEX', apiHelper.getCurrentPage(queryParams))
            .input('PRICEID', apiHelper.getValueFromObject(queryParams, 'price_id', null))
            .input('USERLOGIN', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_PRICES_GetByProductId');
        let slPriceByProduct = data.recordsets[0];

        if (!slPriceByProduct.length)
            return new ServiceResponse(false, 'Không có danh sách giá chi tiết của sản phẩm', {});

        // If exists SL_PRICES
        let slPrice = PriceClass.detailProduct(slPriceByProduct[0]);

        slPrice.totalItems = slPriceByProduct[0] ? slPriceByProduct[0].TOTALITEMS : 0;
        slPrice.price_apply = [];
        for (const item of slPriceByProduct) {
            // danh sách prices lấy theo productid
            // Lấy thoog tin hình thức xuất, giá,.. của 1 price
            let priceId = item.PRICEID;
            const dataPriceApplyOutputtype = await pool
                .request() // eslint-disable-line no-await-in-loop
                .input('PRICEID', priceId)
                .input('USERLOGIN', apiHelper.getValueFromObject(queryParams, 'auth_name'))
                .execute(PROCEDURE_NAME.SL_PRICES_GETBYID);
            let itemPrice = PriceClass.detailPrices(dataPriceApplyOutputtype.recordsets[0][0]);

            // lấy thông tin mức duyệt của htx
            itemPrice.review_list = [];
            const dataPriceApplyReviewlevel = await pool
                .request() // eslint-disable-line no-await-in-loop
                .input('PRICEID', priceId)
                .input('OUTPUTTYPEID', item.OUTPUTTYPEID)
                .input('USERLOGIN', apiHelper.getValueFromObject(queryParams, 'auth_name'))
                .execute('SL_PRICE_APPLY_OUTPUTTYPE_REVIEWLEVEL_GetListByPriceId');
            if (dataPriceApplyReviewlevel.recordsets && dataPriceApplyReviewlevel.recordsets.length > 0) {
                const listPriceApplyReviewLevel = PriceClass.listReviewlevel(dataPriceApplyReviewlevel.recordsets[0]);
                itemPrice.review_list = listPriceApplyReviewLevel;
            }

            // lấy danh sách khu vuc áp dụng
            itemPrice.areas = [];
            const dataAreaApply = await pool
                .request() // eslint-disable-line no-await-in-loop
                .input('PRICEID', item.PARENTID)
                .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
                .execute(PROCEDURE_NAME.SL_PRICE_GetListAreaByPriceID);
            let areaIds = '';
            if (dataAreaApply.recordsets && dataAreaApply.recordsets.length > 0) {
                const listArea = PriceClass.listArea(dataAreaApply.recordsets[0]);
                itemPrice.areas = listArea;
                itemPrice.area_name = (listArea || []).map((item) => item?.area_name).join('|');
                areaIds = (listArea || []).map((item) => item?.area_id).join('|');
            }
            // lấy danh sách miền áp dụng theo giá
            itemPrice.businesses = [];
            const dataBusinessApply = await pool
                .request() // eslint-disable-line no-await-in-loop
                .input('PRICEID', item.PARENTID)
                .input('AREAIDS', areaIds)
                .execute(PROCEDURE_NAME.SL_PRICE_GetListBusinessByPriceID);

            if (dataBusinessApply.recordsets && dataBusinessApply.recordsets.length > 0) {
                const listBusiness = PriceClass.listBusiness(dataBusinessApply.recordsets[0]);
                itemPrice.businesses = listBusiness;
                itemPrice.business_name = (listBusiness || []).map((item) => item?.business_name).join('|');
            }

            slPrice.price_apply.push(itemPrice);
        }

        return new ServiceResponse(true, '', slPrice);
    } catch (e) {
        logger.error(e, { function: 'priceService.detailPrice' });

        return new ServiceResponse(false, e.message);
    }
};

const detailPriceProduct = async (productId, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', productId)
            .input('PAGESIZE', apiHelper.getItemsPerPage(queryParams))
            .input('PAGEINDEX', apiHelper.getCurrentPage(queryParams))
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(queryParams, 'imei_code'))
            .input('USERLOGIN', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_PRICES_GetAllDetailByProductId');

        let slPriceByProduct = data.recordset;
        if (!slPriceByProduct.length)
            return new ServiceResponse(false, 'Không có danh sách giá chi tiết của sản phẩm', {});

        // If exists SL_PRICES
        const slPrice = PriceClass.detailProduct(slPriceByProduct);

        return new ServiceResponse(true, '', {
            data: slPrice,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(slPriceByProduct),
        });
    } catch (e) {
        logger.error(e, { function: 'priceService.detailPrice' });

        return new ServiceResponse(false, e.message);
    }
};

const valueOutPutType = async (outputtype_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OUTPUTTYPEID', outputtype_id)
            .execute(PROCEDURE_NAME.SL_PRICES_GETBYID_OUTPUTTYPE);

        let item = data.recordset;
        // If exists MD_SUPPLIER
        if (item && item.length > 0) {
            item = PriceClass.valueOutPutType(item);
            return new ServiceResponse(true, '', item);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'supplierService.valueOutPutType' });
        return new ServiceResponse(false, e.message);
    }
};

const valueAreaOutPutType = async (outputtype_id) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('OUTPUTTYPEID', outputtype_id)
            .execute(PROCEDURE_NAME.SL_PRICES_GETAREABY_OUTPUTTYPE);

        let item = data.recordset;
        // If exists MD_SUPPLIER
        if (item && item.length > 0) {
            item = PriceClass.valueAreaOutPutType(item);
            return new ServiceResponse(true, '', item);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'pricesListService.valueAreaOutPutType' });
        return new ServiceResponse(false, e.message);
    }
};

const valueUnitOutPutType = async (product_id) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('PRODUCTID', product_id)
            .execute(PROCEDURE_NAME.SL_PRICES_GETUNITBY_PRODUCTID);

        let item = data.recordset;
        // If exists MD_SUPPLIER
        if (item && item.length > 0) {
            item = PriceClass.valueUnitOutPutType(item);
            return new ServiceResponse(true, '', item);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'pricesListService.valueUnitOutPutType' });
        return new ServiceResponse(false, e.message);
    }
};

const deletePrice = async (dataDelete = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        // Begin transaction
        await transaction.begin();
        // Delete SL_PRICES
        const requestPrice = new sql.Request(transaction);
        const resultPrice = await requestPrice
            .input('PRICEID', apiHelper.getValueFromObject(dataDelete, 'price_id'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(dataDelete, 'user_name'))
            .execute(PROCEDURE_NAME.SL_PRICES_DELETE);
        // If store can not delete data
        if (resultPrice.recordset[0].RESULT === 0) {
            throw new Error(RESPONSE_MSG.SL_PRICES.DELETE_FAILED);
        }
        // Delete SL_PRICES_APPLY_OUTPUTTYPE
        const requestPriceoutputtypeDelete = new sql.Request(transaction);
        const resultPriceOutputtypeDelete = await requestPriceoutputtypeDelete
            .input('PRICEID', apiHelper.getValueFromObject(dataDelete, 'price_id'))
            .execute(PROCEDURE_NAME.SL_PRICE_APPLY_BUSINESS_OUTPUTTYPE_BUSINESS_DELETE);
        // If store can not delete data
        if (resultPriceOutputtypeDelete.recordset[0].RESULT === 0) {
            throw new Error(RESPONSE_MSG.SL_PRICES.DELETE_FAILED);
        }
        // Delete SL_PRICES_APPLY_REVIEWLEVEL
        const requestPriceReviewLevelDelete = new sql.Request(transaction);
        const resultPriceReviewLevelDelete = await requestPriceReviewLevelDelete
            .input('PRICEID', apiHelper.getValueFromObject(dataDelete, 'price_id'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(dataDelete, 'auth_name'))
            .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_DELETE);
        // If store can not delete data
        if (resultPriceReviewLevelDelete.recordset[0].RESULT === 0) {
            throw new Error(RESPONSE_MSG.SL_PRICES.DELETE_FAILED);
        }
        // Commit transaction
        await transaction.commit();

        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'priceService.deletePrice' });

        // Rollback transaction
        await transaction.rollback();

        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const changeStatusPrice = async (dataUpdate = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('PRICEID', apiHelper.getValueFromObject(dataUpdate, 'price_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(dataUpdate, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(dataUpdate, 'user_name'))
            .execute(PROCEDURE_NAME.SL_PRICES_UPDATESTATUS);

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'priceService.changeStatusPrice' });

        return new ServiceResponse(false, e);
    }
};

const approvedPriceReviewList = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;

        const data = await pool
            .request()
            .input('PRICEAPPLYREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'price_apply_review_level_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('USERNAME', bodyParams.auth_name)
            .execute(PROCEDURE_NAME.SL_PRICES_APPROVE);
        let result = data.recordset[0].RESULT;
        switch (result) {
            case 1:
                return new ServiceResponse(true, RESPONSE_MSG.SL_PRICES.APPROVE_SUCCESS);
            case 0:
                return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_EXITST);
            case -1:
                return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_NOTEXITST);
            default:
                return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_UNNOW);
        }
    } catch (e) {
        logger.error(e, { function: 'priceService.approvedPriceReviewList' });

        return new ServiceResponse(false, e.message);
    }
};

const getListPriceReviewLVUser = async (output_type_id) => {
    try {
        let price_review_lv_users = [];
        const pool = await mssql.pool;
        const dataPriceReviewLVUser = await pool
            .request()
            .input('OUTPUTTYPEID', output_type_id)
            .execute(PROCEDURE_NAME.SL_PRICE_REVIEW_LV_USER_GETBYOUTPUTTYPE);
        if (dataPriceReviewLVUser.recordset && dataPriceReviewLVUser.recordset.length > 0) {
            let dataRaw = outputTypeClass.listPriceReviewLVUser(dataPriceReviewLVUser.recordset);
            const dataPriceReviewLevel = _.chain(dataRaw)
                .groupBy('price_review_level_id')
                .map((value, key) => ({
                    price_review_level_id: key,
                    data: value,
                }))
                .value();
            for (const value of dataPriceReviewLevel) {
                let price_review_level = value.data[0];
                price_review_level.users = [];
                for (const value2 of value.data) {
                    if ((price_review_level.users || []).findIndex((u) => u.user_name == value2.user_name) < 0) {
                        price_review_level.users.push({
                            user_name: value2.user_name,
                            user_full_name: value2.user_full_name,
                        });
                    }
                }
                price_review_level = removeKeyFromObject(price_review_level, [
                    'user_name',
                    'user_full_name',
                    'product_category_id',
                    'product_category_name',
                ]);
                price_review_lv_users.push(price_review_level);
            }
        }
        return new ServiceResponse(true, '', price_review_lv_users);
    } catch (e) {
        logger.error(e, { function: 'priceService.getListPriceReviewLVUser' });

        return new ServiceResponse(true, '', {});
    }
};
const removeKeyFromObject = (data = {}, propRemove = []) => {
    return Object.keys(data).reduce((object, key) => {
        if (!propRemove.includes(key)) {
            object[key] = data[key];
        }
        return object;
    }, {});
};

const listAreaByOutputType = async (queryParams = {}) => {
    try {
        const outPutTypeId = apiHelper.getValueFromObject(queryParams, 'output_type_id');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('OUTPUTTYPEID', outPutTypeId)
            .execute('SL_OUTPUT_AREA_GetListByOutputTypeID');
        let datas = data.recordsets[0];

        return new ServiceResponse(true, '', PriceClass.listArea(datas));
    } catch (e) {
        logger.error(e, { function: 'priceService.listAreaByOutputType' });

        return new ServiceResponse(false, e.message);
    }
};

const listBussinessByArea = async (queryParams = {}) => {
    try {
        const areaId = apiHelper.getValueFromObject(queryParams, 'area_id');

        const pool = await mssql.pool;
        let data = await pool.request().input('AREAID', areaId).execute('AM_BUSSINESS_GetListByAreaID');
        let datas = data.recordsets[0];

        return new ServiceResponse(true, '', PriceClass.listBusiness(datas));
    } catch (e) {
        logger.error(e, { function: 'priceService.listBussinessByArea' });

        return new ServiceResponse(false, e.message);
    }
};

const listStoreByArea = async (queryParams = {}) => {
    try {
        const areaId = apiHelper.getValueFromObject(queryParams, 'area_id');

        const pool = await mssql.pool;
        let data = await pool.request().input('AREAID', areaId).execute('MD_STORE_GetListByAreaID');
        let datas = data.recordsets[0];

        return new ServiceResponse(true, '', PriceClass.listStore(datas));
    } catch (e) {
        logger.error(e, { function: 'priceService.listStoreByArea' });

        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
    queryParams.is_active = 2;
    const serviceRes = await getListPrice(queryParams);
    const { data } = serviceRes.getData();
    // Create a new instance of a Workbook class
    const wb = new xl.Workbook();
    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('List Price', {});
    // Set width
    ws.column(1).setWidth(15);
    ws.column(2).setWidth(40);
    ws.column(3).setWidth(40);
    ws.column(4).setWidth(50);
    ws.column(5).setWidth(50);
    ws.column(6).setWidth(50);
    ws.column(7).setWidth(50);
    ws.column(8).setWidth(50);
    ws.column(9).setWidth(50);
    ws.column(10).setWidth(50);
    ws.column(11).setWidth(50);

    const header = {
        product_code: 'Mã sản phẩm',
        product_name: 'Tên sản phẩm',
        output_type_name: 'Hình thức xuất',
        company_name: 'Công ty',
        area_name: 'Khu vực',
        business_name: 'Cơ sở',
        price: 'Giá sản phẩm',
        price_vat: 'Giá sau VAT',
        apply_time: 'Thời gian áp dụng',
        is_review: 'Trạng thái',
        is_output_for_web: 'Giá hiển thị web',
    };
    data.unshift(header);

    data.forEach((item, index) => {
        let indexRow = index + 1;
        let indexCol = 0;
        ws.cell(indexRow, ++indexCol).string((item.product_code || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.product_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.output_type_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.company_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.area_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.business_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.price || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.price_vat || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.apply_time || '').toString());
        ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_review : item.is_review ? 'Đã duyệt' : 'Chưa duyệt');
        ws.cell(indexRow, ++indexCol).string(
            index === 0 ? item.is_output_for_web : item.is_output_for_web ? 'Có' : 'Không',
        );
    });

    return new ServiceResponse(true, '', wb);
};

const exportExcelPriceList = async (queryParams = {}) => {
    queryParams.itemsPerPage = API_CONST.MAX_EXPORT_EXCEL;
    queryParams.is_active = 2;
    const serviceRes = await ProductService.getListProduct(queryParams);
    const { data } = serviceRes.getData();
    // Create a new instance of a Workbook class
    const wb = new xl.Workbook();
    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('List Price', {});
    // Set width
    ws.column(1).setWidth(15);
    ws.column(2).setWidth(40);
    ws.column(3).setWidth(40);
    ws.column(4).setWidth(50);

    const header = {
        product_code: 'Mã sản phẩm',
        product_name: 'Tên sản phẩm',
        category_name: 'Ngành hàng',
        is_active: 'Trạng thái',
    };
    data.unshift(header);

    data.forEach((item, index) => {
        let indexRow = index + 1;
        let indexCol = 0;
        ws.cell(indexRow, ++indexCol).string((item.product_code || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.product_name || '').toString());
        ws.cell(indexRow, ++indexCol).string((item.category_name || '').toString());
        ws.cell(indexRow, ++indexCol).string(index === 0 ? item.is_active : item.is_active ? 'Có' : 'Không');
    });

    return new ServiceResponse(true, '', wb);
};

const reviewPrice = async (priceId, bodyParams = {}) => {
    try {
        let parseInPriceId = parseInt(priceId) ?? 0;
        const pool = await mssql.pool;

        const data = await pool
            .request()
            //.input('PRICEAPPLYREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'price_apply_review_level_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'review_note'))
            .input('USERNAME', bodyParams.auth_name)
            .input('PRICEID', parseInPriceId)
            .execute('SL_PRICES_Approve_List_AdminWeb');
        let result = data.recordset[0].RESULT;
        switch (result) {
            case 1:
                return new ServiceResponse(true, RESPONSE_MSG.SL_PRICES.APPROVE_SUCCESS);
            case 0:
                return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_EXITST);
            case -1:
                return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_NOTEXITST);
            default:
                return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_UNNOW);
        }
    } catch (e) {
        logger.error(e, { function: 'priceService.approvedPriceReviewList' });

        return new ServiceResponse(false, e.message);
    }
};

const changePriceMultiProduct = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        // Begin transaction
        await transaction.begin();

        let listPrice = [];

        // mảng sản phẩm chỉnh sửa
        let list_price = apiHelper.getValueFromObject(bodyParams, 'list_price');
        let new_list_price = [];
        for (key in list_price) {
            new_list_price.push(list_price[key]);
        }
        if (new_list_price) {
            const checkDatePrice = new sql.Request(transaction);
            const requestSaveListHistory = new sql.Request(transaction);
            const checkDuplicatesPrice = new sql.Request(transaction);
            for (let i = 0; i < new_list_price.length; i++) {
                let item = new_list_price[i];
                // kiểm tra xem thời gian app dụng điều chỉnh có đang trùng với thời gian cũ hay không
                // nếu trung không cho phép cập nhật
                const reqcheckDatePrice = await checkDatePrice
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                    .input('PRODUCTTYPE', apiHelper.getValueFromObject(item, 'product_type'))
                    .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
                    .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                    .execute('SL_PRICE_CheckDatePriceListChange_AdminWeb');
                const resCheckdate = reqcheckDatePrice.recordset[0].RESULT;

                if (resCheckdate > 0) {
                    await transaction.rollback();
                    return new ServiceResponse(
                        false,
                        'Thời gian áp dụng điều chỉnh trùng với thời gian đã áp dụng trước đó!',
                    );
                }

                const datacheckDuplicatesPrice = await checkDuplicatesPrice
                    .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                    .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                    .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
                    .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                    .input('PRODUCTTYPE', apiHelper.getValueFromObject(item, 'product_type'))
                    .execute(PROCEDURE_NAME.SL_PRICES_CHECKDUPLICATES);
                const resultCheck = datacheckDuplicatesPrice.recordset[0].RESULT;

                if (resultCheck > 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CHECK_DUPLICATES);
                }

                // lưu history
                let priceIdCheck = apiHelper.getValueFromObject(item, 'parent_price_id');
                priceIdCheck = priceIdCheck ? priceIdCheck : apiHelper.getValueFromObject(item, 'price_id');
                const dataSaveListHistory = await requestSaveListHistory
                    .input('PRICEID', priceIdCheck)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('CHANGEPRICE', apiHelper.getValueFromObject(item, 'change_price'))
                    .input('PRICE', apiHelper.getValueFromObject(item, 'price_vat'))
                    .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                    .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
                    .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
                    .execute(PROCEDURE_NAME.SL_HISTORYPRICE_CREATE_ADMINWEB);
                const resultListHistory = dataSaveListHistory.recordset[0].RESULT;

                if (resultListHistory <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, e.message);
                }
                let output_type_id = apiHelper.getValueFromObject(item, 'output_type_id');
                const requestOutputType = new sql.Request(transaction);
                const resultOutputType = await requestOutputType
                    .input('OUTPUTTYPEID', output_type_id)
                    .execute(PROCEDURE_NAME.SL_OUTPUTTYPE_GETBYID);
                let outputtype = outputTypeClass.detail(resultOutputType.recordset[0]);
                let changePrice = apiHelper.getValueFromObject(item, 'change_price');
                if (resultOutputType.recordset[0]) {
                    if (outputtype?.vat_value && changePrice) {
                        let numberAbide = Number(changePrice) / (100 + outputtype?.vat_value);
                        changePrice = Math.round(numberAbide * 100);
                    }
                }
                // Save SL_PRICES
                const requestPrice = new sql.Request(transaction);
                const resultPrice = await requestPrice
                    .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                    .input('OUTPUTTYPEID', output_type_id)
                    .input('PRODUCTTYPE', apiHelper.getValueFromObject(item, 'product_type'))
                    .input('PRICEPARENTID', priceIdCheck)
                    .input('PRICE', changePrice)
                    .input('BASEPRICE', changePrice)
                    .input('CHANGEVALUE', apiHelper.getValueFromObject(bodyParams, 'change_value'))
                    .input('CHANGEPRICE', apiHelper.getValueFromObject(item, 'change_price'))
                    .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
                    .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
                    .input('ISREVIEW', 2)
                    .input('ISACTIVE', apiHelper.getValueFromObject(item, 'is_active'))
                    .input('ISOUTPUTFORWEB', apiHelper.getValueFromObject(item, 'is_output_for_web'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                    .input('MODELID', apiHelper.getValueFromObject(item, 'model_id'))
                    .execute(PROCEDURE_NAME.SL_PRICES_CHANGEPRICE_MUTIPLE_CREATEORUPDATE);
                // Get PRICEID
                const priceId = resultPrice.recordset[0].RESULT;
                if (!priceId) {
                    await transaction.rollback();
                    throw new Error(RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                }
                // nếu như là thêm mới thì thêm output type cho giá sản phẩm
                // if (!resCheckdate) {
                //     let list_output_type = item.list_output_type || [];
                //     const requestApplyOutputtypeCreate = new sql.Request(transaction);
                //     for (let i = 0; i < list_output_type.length; i++) {
                //         const item_opt = list_output_type[i];

                //         const dataTaskApplyPutputtypeCreate = await requestApplyOutputtypeCreate // eslint-disable-line no-await-in-loop
                //             .input('PRICEID', priceId)
                //             .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item_opt, 'output_type_id'))
                //             .input('AREAID', apiHelper.getValueFromObject(item_opt, 'area_id'))
                //             .input('COMPANYID', apiHelper.getValueFromObject(item_opt, 'company_id'))
                //             .input('STOREID', apiHelper.getValueFromObject(item_opt, 'store_id'))
                //             .execute(PROCEDURE_NAME.SL_PRICES_APPLY_OUTPUTTYPE_CREATEORUPDATE);
                //         const applyOutputtypeId = dataTaskApplyPutputtypeCreate.recordset[0].RESULT;
                //         if (applyOutputtypeId <= 0) {
                //             await transaction.rollback();
                //             return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                //         }
                //     }
                // }

                // lấy thông tin mức duyệt của htx
                // const dataPriceApplyReviewlevel = await pool
                //     .request() // eslint-disable-line no-await-in-loop
                //     .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                //     .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
                //     .execute(PROCEDURE_NAME.SL_PRICE_APPLY_OUTPUTTYPE_REVIEWLEVEL_GETLISTBYPRICEID);
                // if (dataPriceApplyReviewlevel.recordsets && dataPriceApplyReviewlevel.recordsets.length > 0) {
                //     const listPriceApplyReviewLevel = PriceClass.listReviewlevel(
                //         dataPriceApplyReviewlevel.recordsets[0],
                //     );
                //     item.data_review_level = listPriceApplyReviewLevel;
                // }

                // Nếu đã lấy được danh sách thông tin mức duyệt
                //==> xoá danh sách mức duyệt hiện tại của giá sản phẩm
                // const requestApplyReviewDelete = new sql.Request(transaction);
                // const dataApplyReviewDelete = await requestApplyReviewDelete
                //     .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                //     .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                //     .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_DELETE);
                // const resultReviewDelete = dataApplyReviewDelete.recordset[0].RESULT;
                // if (resultReviewDelete <= 0) {
                //     await transaction.rollback();
                //     return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.UPDATE_FAILED);
                // }

                // let checkAutoReview = 0;
                // const requestApplyReviewLevelCreate = new sql.Request(transaction);
                // const requestApplyReviewLevelUpdate = new sql.Request(transaction);

                // if (item.data_review_level && item.data_review_level.length > 0) {
                //     for (let i = 0; i < item.data_review_level.length; i++) {
                //         const item2 = item.data_review_level[i];
                //         if (1 * item2.auto_review == 1) {
                //             checkAutoReview++;
                //         }
                //         if (!resCheckdate) {
                //             const dataTaskApplyReviewLevelCreate = await requestApplyReviewLevelCreate // eslint-disable-line no-await-in-loop
                //                 .input('PRICEID', priceId)
                //                 .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
                //                 .input(
                //                     'PRICEREVIEWLEVELID',
                //                     apiHelper.getValueFromObject(item2, 'price_review_level_id'),
                //                 )
                //                 .input('REVIEWUSER', apiHelper.getValueFromObject(item2, 'review_user'))
                //                 .input('AUTOREVIEW', 1 * apiHelper.getValueFromObject(item2, 'is_auto_reviewed'))
                //                 .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_CREATEORUPDATE);
                //             const applyReviewLevelId = dataTaskApplyReviewLevelCreate.recordset[0].RESULT;
                //             if (applyReviewLevelId <= 0) {
                //                 await transaction.rollback();
                //                 return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                //             }
                //         } else {
                //             const dataTaskApplyReviewLevelUpdate = await requestApplyReviewLevelUpdate // eslint-disable-line no-await-in-loop
                //                 .input(
                //                     'PRICEID',
                //                     !resCheckdate ? priceId : apiHelper.getValueFromObject(item, 'price_id'),
                //                 )
                //                 .input(
                //                     'PRICEAPPLYREVIEWLEVELID',
                //                     apiHelper.getValueFromObject(item2, 'price_apply_review_level_id'),
                //                 )
                //                 .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                //                 .input('AUTOREVIEW', 1 * apiHelper.getValueFromObject(item2, 'is_auto_reviewed'))
                //                 .execute(PROCEDURE_NAME.SL_PRICE_APPLY_REVIEWLEVEL_UPDATE_LIST_ADMINWEB);
                //             const applyReviewLevelId = dataTaskApplyReviewLevelUpdate.recordset[0].RESULT;

                //             if (applyReviewLevelId <= 0) {
                //                 await transaction.rollback();
                //                 return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                //             }
                //         }
                //     }
                //     if (checkAutoReview && checkAutoReview == item.data_review_level.length) {
                //         const requestUpdateIsreviewUpdate = new sql.Request(transaction);
                //         const dataUpdateIsreviewUpdate = await requestUpdateIsreviewUpdate // eslint-disable-line no-await-in-loop
                //             .input('PRICEID', !resCheckdate ? priceId : apiHelper.getValueFromObject(item, 'price_id'))
                //             .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                //             .output('RESULT', apiHelper.getValueFromObject(bodyParams, 'result'))
                //             .execute(PROCEDURE_NAME.SL_PRICES_UPDATE_REVIEW_ADMINWEB);
                //         const updateIsreviewId = dataUpdateIsreviewUpdate.output.RESULT;
                //         if (updateIsreviewId != 1) {
                //             await transaction.rollback();
                //             return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
                //         }
                //     }
                // }

                listPrice.push(priceId);
            }
        }
        // Commit transaction
        await transaction.commit();
        return new ServiceResponse(true, RESPONSE_MSG.SL_PRICES.CREATE_SUCCESS, {
            list_price: listPrice,
        });
    } catch (e) {
        // Write log
        logger.error(e, { function: 'priceService.changePriceMultiProduct' });
        // Rollback transaction
        transaction.rollback();

        return new ServiceResponse(false, e);
    }
};

const getListPriceProductHistory = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const data = await pool
            .request()
            // .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('PRICEID', apiHelper.getValueFromObject(queryParams, 'price_id'))
            .input('FROMDATE', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('TODATE', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'user_name'))
            .input('PRODUCTTYPE', apiHelper.getValueFromObject(queryParams, 'product_type'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute('SL_HISTORYPRICE_GetList_AdminWeb');
        let listPriceProductHistory = data.recordset;
        return new ServiceResponse(true, '', {
            data: PriceClass.listPriceProductHistory(listPriceProductHistory),
            page: currentPage,
            limit: itemsPerPage,
            total: data.recordsets[1][0].TOTAL,
        });
    } catch (e) {
        logger.error(e, { function: 'priceService.getListPriceProductHistory' });
        return new ServiceResponse(true, '', {});
    }
};

const reviewListPrice = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        let list_product_review = apiHelper.getValueFromObject(bodyParams, 'list_product_review');
        if (list_product_review && list_product_review.length) {
            for (let i = 0; i < list_product_review.length; i++) {
                let item = list_product_review[i];

                // lấy thông tin mức duyệt của htx
                const dataPriceApplyReviewlevel = await pool
                    .request() // eslint-disable-line no-await-in-loop
                    .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                    .input('OUTPUTTYPEID', apiHelper.getValueFromObject(item, 'output_type_id'))
                    .execute(PROCEDURE_NAME.SL_PRICE_APPLY_OUTPUTTYPE_REVIEWLEVEL_GETLISTBYPRICEID);
                if (dataPriceApplyReviewlevel.recordsets && dataPriceApplyReviewlevel.recordsets.length > 0) {
                    const listPriceApplyReviewLevel = PriceClass.listReviewlevel(
                        dataPriceApplyReviewlevel.recordsets[0],
                    );
                    item.data_review_level = listPriceApplyReviewLevel;
                }
                if (item.data_review_level && item.data_review_level.length > 0) {
                    for (let i = 0; i < item.data_review_level.length; i++) {
                        const item2 = item.data_review_level[i];
                        if (1 * item2.auto_review != 1) {
                            const data = await pool
                                .request()
                                .input(
                                    'PRICEAPPLYREVIEWLEVELID',
                                    apiHelper.getValueFromObject(item2, 'price_apply_review_level_id'),
                                )
                                .input('ISREVIEW', 1 * apiHelper.getValueFromObject(item, 'is_review_by_list'))
                                .input('NOTE', apiHelper.getValueFromObject(item, 'review_note'))
                                .input('USERNAME', bodyParams.auth_name)
                                .input('PRICEID', apiHelper.getValueFromObject(item, 'price_id'))
                                .output('RESULT', apiHelper.getValueFromObject(bodyParams, 'result'))
                                .execute(PROCEDURE_NAME.SL_PRICE_APPROVE_LISTREVIEW_ADMINWEB);
                            let result = data.output.RESULT;
                            if (result && result != 1) {
                                return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.APPROVE_UNNOW);
                            }
                        }
                    }
                }
            }
        }
        return new ServiceResponse(true, RESPONSE_MSG.SL_PRICES.APPROVE_SUCCESS);
    } catch (e) {
        logger.error(e, { function: 'priceService.reviewListPrice' });

        return new ServiceResponse(false, e.message);
    }
};

const detailProduct = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTTYPEDEFF', apiHelper.getValueFromObject(queryParams, 'product_type_deff', 1))
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(queryParams, 'product_imei_code'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'productId'))
            .input('PRICEID', apiHelper.getValueFromObject(queryParams, 'price_id'))
            .execute('SL_PRICES_GetDetailProduct');
        let product = data.recordset[0];

        return new ServiceResponse(true, '', PriceClass.detailProduct(product, true));
    } catch (e) {
        logger.error(e, { function: 'priceService.detailProduct' });
        return new ServiceResponse(true, '', {});
    }
};

const getListProductAndComponent = async (queryParams = {}) => {
    try {

        let modelId = apiHelper.getValueFromObject(queryParams, 'model_id', null);
        if (modelId?.value) {
            modelId = modelId.value
        }
        let productCategoryId = apiHelper.getValueFromObject(queryParams, 'product_category_id', null);
        let resultProductCategory = null;
        if (productCategoryId) {
            const poolProductCategory = await mssql.pool;
            const dataProductCategory = await poolProductCategory
                .request()
                .input('PARENTID', productCategoryId)
                .execute('MD_PRODUCTCATEGORY_GetListRecursiveOption');
            resultProductCategory = dataProductCategory.recordset;
            resultProductCategory = PriceClass.optionsProductCategory(resultProductCategory) ?? []
            if (contain.checkEmptyArray(resultProductCategory)) {
                const FEILDDEFF = 'id_category';
                resultProductCategory = resultProductCategory?.map(o => o?.id_category);
            }
            resultProductCategory.push(productCategoryId);
            resultProductCategory = resultProductCategory.join(',')
        }

        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('PRODUCTTYPEID', apiHelper.getValueFromObject(queryParams, 'product_type_id'))
            .input('PRODUCTCATEGORYID', resultProductCategory)
            .input('PRODUCTMODELID', modelId)
            .input('MANUFACTUREID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
            .execute('SL_PRICES_getListProductAndComponent_AdminWeb');
        const product = data.recordset;
        const resReturn = {
            data: PriceClass.product(product),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(product),
        };

        return new ServiceResponse(true, '', resReturn);
    } catch (e) {
        logger.error(e, { function: 'priceService.getListProductAndComponent' });

        return new ServiceResponse(true, '', {});
    }
};

const detailPriceByOption = async (productId, queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', productId)
            .input('PAGESIZE', apiHelper.getItemsPerPage(queryParams))
            .input('PAGEINDEX', apiHelper.getCurrentPage(queryParams))
            .input('PRICEID', apiHelper.getValueFromObject(queryParams, 'price_id', null))
            .input('PRODUCTTYPEID', apiHelper.getValueFromObject(queryParams, 'product_type'))
            .input('TYPEPRICEID', apiHelper.getValueFromObject(queryParams, 'type_price_id'))
            .input('AREAID', apiHelper.getValueFromObject(queryParams, 'area_id'))
            // .input('UNITID', apiHelper.getValueFromObject(queryParams, 'unit_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(queryParams, 'imei_code'))
            .input('USERLOGIN', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute('SL_PRICES_GetByProductIdByOpion');

        let slPriceByProduct = data.recordsets[0];
        if (!slPriceByProduct.length)
            return new ServiceResponse(false, 'Không có danh sách giá chi tiết của sản phẩm', {});

        // If exists SL_PRICES
        const slPrice = PriceClass.detailProduct(slPriceByProduct);

        return new ServiceResponse(true, '', {
            data: slPrice,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(slPriceByProduct),
        });
    } catch (e) {
        logger.error(e, { function: 'priceService.detailPrice' });

        return new ServiceResponse(false, e.message);
    }
};

const detailModelAttribute = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('MODELLISTID', apiHelper.getValueFromObject(queryParams, 'model_list'))
            .execute('SL_PRICES_GetDetailModelProduct');
        const product = data.recordset;
        const result = PriceClass.detailModelAttribute(product, true);
        const json = result.reduce((json, value, key) => {
            json[`key${value?.product_id}`] = value;
            return json;
        }, {});

        return new ServiceResponse(true, '', json);
    } catch (e) {
        logger.error(e, { function: 'priceService.detailProduct' });
        return new ServiceResponse(true, '', {});
    }
};

const downloadExcel = async () => {
    try {
        const wb = new xl.Workbook();
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
                color: '262626',
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
            },
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#e4e5e6',
                fgColor: '#e4e5e6',
            },
        });

        let styleBorder = {
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
            },
        };

        //Sheet Giá
        const ws_product = wb.addWorksheet('Danh sách giá');
        for (let i = 1; i <= 8; i++) {
            ws_product.column(i).setWidth(i == 2 ? 40 : 18);
            ws_product.cell(2, i).string('').style(styleBorder);
        }
        ws_product.cell(1, 1).string('Mã sản phẩm *').style(headerStyle);
        ws_product.cell(1, 2).string('Tên sản phẩm').style(headerStyle);
        ws_product.cell(1, 3).string('Hình thức xuất *').style(headerStyle);
        ws_product.cell(1, 4).string('Thời gian bắt đầu *').style(headerStyle);
        ws_product.cell(1, 5).string('Thời gian kết thúc *').style(headerStyle);
        ws_product.cell(1, 6).string('Giá sản phẩm*').style(headerStyle);
        ws_product.cell(1, 7).string('Giá chưa vat').style(headerStyle);
        ws_product.cell(1, 8).string('Khu vực *').style(headerStyle);

        //Danh sach gia Vi du
        ws_product.cell(2, 1).string('MU6969VN/A').style(styleBorder);
        ws_product.cell(2, 2).string('iPhone 15 Pro Max 256GB Black Titanium').style(styleBorder);
        ws_product.cell(2, 3).string('Xuất bán lẻ').style(styleBorder);
        ws_product.cell(2, 4).string('01/01/2023').style(styleBorder);
        ws_product.cell(2, 5).string('01/12/2024').style(styleBorder);
        ws_product.cell(2, 6).string('3000000').style(styleBorder);
        ws_product.cell(2, 7).string('').style(styleBorder);
        ws_product.cell(2, 8).string('Tất cả').style(styleBorder);

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(e, {
            function: 'priceService.downloadExcel',
        });
        return new ServiceResponse(false, e.message);
    }
};

const importExcel = async (body, file, auth) => {
    // const pool = await mssql.pool;
    // const transaction = await new sql.Transaction(pool);
    try {
        let import_data = [];
        let import_errors = [];
        let import_total = 0;

        const bodyParams = { file, auth }
        const res = await insertImportPriceQueue.add(bodyParams);

        // Chờ kết quả từ worker
        const result = await res.finished();
        if (result.status) {
            import_data.push(result.data.import_data)
            import_total = result.data.import_total
            return new ServiceResponse(true, '', {
                import_data,
                import_total,
                import_errors,
            });
        } else {
            return new ServiceResponse(false, result.message)
        }

        // await transaction.begin();

        // const rows = await readXlsxFile(file.buffer);

        // for (let i in rows) {
        //     let arr_area_id = []
        //     let arr_data_business = []
        //     let product_id
        //     let output_type_id
        //     let unit_id
        //     let model_id
        //     let product_type
        //     let price_id
        //     let base_price

        //     // Bỏ qua dòng tiêu đề đầu
        //     if (i > 0 && rows[i]) {
        //         import_total += 1;

        //         let product_code = rows[i][0] || '';
        //         let product_name = `${rows[i][1] || ''}`.trim();
        //         let output_type_name = `${rows[i][2] || ''}`.trim();
        //         let start_date = `${rows[i][3] || ''}`.trim();
        //         let end_date = `${rows[i][4] || ''}`.trim();
        //         let price_vat = `${rows[i][5] || ''}`.trim();
        //         let basePrice = `${rows[i][6] || ''}`.trim();
        //         let area_name = `${rows[i][7] || ''}`.trim();
        //         let business_name = `${rows[i][8] || ''}`.trim();

        //         if (!product_code || !output_type_name || !start_date || !end_date || !price_vat || !area_name) {
        //             return new ServiceResponse(false, 'Thiếu trường dữ liệu bắt buộc!', null);
        //         }

        //         if (rows.length < 2) {
        //             return new ServiceResponse(false, 'Tập tin chưa có dữ liệu!', null);
        //         }

        //         // Tìm thông tin sản phẩm product_id, unit_id, model_id, product_type
        //         if (product_code) {
        //             try {
        //                 const res = await ProductService.getListProduct({ search: product_code })
        //                 if (res.data.data[0].product_id) {
        //                     product_id = res.data.data[0].product_id
        //                     unit_id = res.data.data[0].unit_id
        //                     model_id = res.data.data[0].model_id
        //                     product_type = res.data.data[0].product_type
        //                 }
        //             } catch (error) {
        //                 await transaction.rollback();
        //                 console.error('Lỗi tìm thông tin sản phẩm: ', error.message);
        //                 return new ServiceResponse(false, `Không tìm thấy sản phẩm có mã là: ${product_code}`)
        //             }
        //         }

        //         // Tìm hình thức xuất
        //         if (output_type_name) {
        //             try {
        //                 const res = await getListOutputType({ search: output_type_name })
        //                 if (res.data.data[0].output_type_id) {
        //                     output_type_id = res.data.data[0].output_type_id
        //                 }
        //             } catch (error) {
        //                 await transaction.rollback();
        //                 console.error('Lỗi tìm thấy hình thức xuất: ', error.message);
        //                 return new ServiceResponse(false, `Không tìm thấy hình thức xuất: ${output_type_name}`)
        //             }
        //         }

        //         // Tìm Khu Vực
        //         if (area_name && area_name === 'Tất cả') {
        //             try {
        //                 const results = await getListArea({ itemsPerPage: 9999 })
        //                 if (results.data.data.length > 0) {
        //                     results.data.data.map(serviceResponse => {
        //                         arr_area_id.push(serviceResponse.area_id)
        //                     });
        //                 }
        //             } catch (error) {
        //                 await transaction.rollback();
        //                 console.error('Lỗi tìm thấy khu vực: ', error.message);
        //                 return new ServiceResponse(false, `Không tìm thấy khu vực ${area_name}`)
        //             }
        //         } else if (area_name && area_name !== 'Tất cả') {
        //             try {
        //                 const areaArray = area_name.split(',').map(name => name.trim());
        //                 const promises = areaArray.map(async (val) => {
        //                     try {
        //                         const listAreaId = await getListArea({ search: val });
        //                         return listAreaId;
        //                     } catch (error) {
        //                         await transaction.rollback();
        //                         console.error(`Error fetching area IDs for ${val}:`, error.message);
        //                         throw error; // Propagate the error if needed
        //                     }
        //                 });

        //                 const results = await Promise.all(promises);
        //                 if (results?.length > 0) {
        //                     results.map(serviceResponse => {
        //                         arr_area_id.push(serviceResponse.data.data[0].area_id) 
        //                     });
        //                 }
        //             } catch (error) {
        //                 await transaction.rollback();
        //                 console.error('Error fetching area IDs:', error.message);
        //                 return new ServiceResponse(false, error.message);
        //             }

        //         } else {
        //             await transaction.rollback();
        //             return new ServiceResponse(false, 'Không tìm thấy khu vực!')
        //         }

        //         // Tìm chi nhánh theo Khu vực
        //         if (arr_area_id.length > 0) {
        //             try {
        //                 const promises = arr_area_id.map(async (val) => {
        //                     try {
        //                         const listAreaId = await getBusinessList({ area_ids: val, itemsPerPage: 99999 });
        //                         return listAreaId;
        //                     } catch (error) {
        //                         await transaction.rollback();
        //                         console.error(`Error fetching area IDs for ${val}:`, error.message);
        //                         return new ServiceResponse(false, `Không tìm thấy chi nhánh theo khu vực có id: ${val}, Lỗi: ${error.message}`);
        //                     }
        //                 });

        //                 const results = await Promise.all(promises);
        //                 if (results.length > 0) {
        //                     results.map(serviceResponse => {
        //                         arr_data_business.push(serviceResponse.data.data)
        //                     });
        //                 }
        //             } catch (error) {
        //                 await transaction.rollback();
        //                 console.error('Error fetching area IDs:', error.message);
        //                 return new ServiceResponse(false, error.message);
        //             }
        //         }

        //         if (price_vat && !basePrice) {
        //             base_price = Math.round(Number(price_vat) / ((100 + 10) / 100))
        //         } else {
        //             base_price = basePrice
        //         }

        //         let price_import = {
        //             product_id,
        //             output_type_id,
        //             start_date,
        //             end_date,
        //             price_vat,
        //             base_price,
        //             unit_id,
        //             model_id,
        //             product_type
        //         };
        //         const auth_name = apiHelper.getValueFromObject(auth, 'user_name');

        //         // Inser SL_PRICES
        //         try {
        //             const res = await importPriceInDB({ ...price_import, auth_name }, pool);
        //             if (res.data) {
        //                 price_id = res?.data
        //             }
        //             import_data.push(res?.data);
        //         } catch (error) {
        //             import_errors.push({
        //                 price_import,
        //                 errmsg: [error.message],
        //                 i,
        //             });
        //         }

        //         // Insert SL_PRICE_APPLY_OUTPUTTYPE_BUSINESS
        //         if (arr_data_business && arr_data_business.length > 0 && price_id) {
        //             for (let j = 0; j < arr_data_business.length; j++) {
        //                 const itemBusiness = arr_data_business[j];
        //                 if (itemBusiness && itemBusiness.length > 0) {
        //                     for (let j = 0; j < itemBusiness.length; j++) {
        //                         const dataSubmit = itemBusiness[j];
        //                         const requestApplyOutputtypeCreate = new sql.Request(transaction);
        //                         const dataTaskApplyPutputtypeCreate = await requestApplyOutputtypeCreate
        //                             .input('PRICEID', price_id)
        //                             .input('OUTPUTTYPEID', output_type_id)
        //                             .input('AREAID', dataSubmit.area_id)
        //                             .input('COMPANYID', null)
        //                             .input('BUSINESSID', dataSubmit.business_id)
        //                             .execute(PROCEDURE_NAME.SL_PRICES_APPLY_OUTPUTTYPE_CREATEORUPDATE);
        //                         const applyOutputtypeListId =
        //                             dataTaskApplyPutputtypeCreate.recordset[0].RESULT;
        //                         if (applyOutputtypeListId <= 0) {
        //                             await transaction.rollback();
        //                             return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
        //                         }
        //                     }
        //                 }
        //             }
        //         }

        //         // Insert mức duyệt SL_PRICE_APPLY_REVIEWLEVEL
        //         if (price_id) {
        //             const requestApplyReviewLevelCreate = new sql.Request(transaction);
        //             const dataTaskApplyReviewLevelCreate = await requestApplyReviewLevelCreate
        //                 .input('PRICEID', price_id)
        //                 .input('OUTPUTTYPEID', output_type_id)
        //                 .input('PRICEREVIEWLEVELID', 5)
        //                 .input('REVIEWUSER', auth_name)
        //                 .input('AUTOREVIEW', 1)
        //                 .input('DEPARTMENTID', null)
        //                 .execute('SL_PRICE_APPLY_REVIEWLEVEL_CreateOrUpdate');
        //             const applyReviewLevelId = dataTaskApplyReviewLevelCreate.recordset[0].RESULT;
        //             console.log();
        //             if (applyReviewLevelId <= 0) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
        //             }
        //         }

        //     }
        // }

        // // Commit transaction
        // await transaction.commit();

        // return new ServiceResponse(true, '', {
        //     import_data,
        //     import_total,
        //     import_errors,
        // });
    } catch (error) {
        logger.error(error, {
            function: 'PriceService.importExcel',
        });
        // await transaction.rollback();
        return new ServiceResponse(false, error.message);
    }
};


const importPriceInDB = async (bodyParams = {}, pool) => {
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const dateNow = getCurrentDateFormatted()

        //Insert Price
        const requestPrice = new sql.Request(transaction);
        const resultPrice = await requestPrice
            // .input('PRICEID', apiHelper.getValueFromObject(bodyParams, 'price_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
            .input('MATERIALID', null)
            .input('OUTPUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'output_type_id'))
            .input('PRICE', apiHelper.getValueFromObject(bodyParams, 'price_vat'))
            .input('BASEPRICE', apiHelper.getValueFromObject(bodyParams, 'base_price'))
            .input('STARTDATE', apiHelper.getValueFromObject(bodyParams, 'start_date'))
            .input('ENDDATE', apiHelper.getValueFromObject(bodyParams, 'end_date'))
            .input('ISREVIEW', 2)
            .input('ISACTIVE', 1)
            .input('ISOUTPUTFORWEB', null)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('UNITID', apiHelper.getValueFromObject(bodyParams, 'unit_id'))
            .input('MODELID', apiHelper.getValueFromObject(bodyParams, 'model_id'))
            .input('PRODUCTIMEICODE', null)
            .input('REVIEWDATE', dateNow)
            .input('PRODUCTTYPE', apiHelper.getValueFromObject(bodyParams, 'product_type'))
            .execute('SL_PRICES_CreateOrUpdate');

        const priceId = resultPrice.recordset[0].RESULT;

        if (!priceId) {
            await transaction.rollback();
            throw new Error(RESPONSE_MSG.SL_PRICES.CREATE_FAILED);
        }

        await transaction.commit();
        return new ServiceResponse(true, '', priceId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getListPrice,
    createPrice,
    detailPrice,
    updatePrice,
    deletePrice,
    changeStatusPrice,
    approvedPriceReviewList,
    reviewPrice,
    getListPriceReviewLVUser,
    listAreaByOutputType,
    listBussinessByArea,
    exportExcel,
    exportExcelPriceList,
    valueOutPutType,
    valueAreaOutPutType,
    valueUnitOutPutType,
    changePriceMultiProduct,
    getListPriceProductHistory,
    reviewListPrice,
    detailProduct,
    getListProductAndComponent,
    detailPriceByOption,
    detailModelAttribute,
    detailPriceProduct,
    downloadExcel,
    importExcel,
};
