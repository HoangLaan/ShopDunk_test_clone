const sql = require('mssql');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const XLSX = require('xlsx');
const logger = require('../../common/classes/logger.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const { PROCEDURE_NAME, ERROR_INVENTORY, USERREVIEW_TYPES } = require('./constants');
const ServiceResponse = require('../../common/responses/service.response');
const _ = require('lodash');

const {
    listStocksTakeRequest,
    optionsUsers,
    detailStocksTakeRequest,
    listUserReiew,
    listStocksTakeUser,
    listProduct,
    listProductImeiCode,
    listImeiStocksDetail,
    listReviewList,
} = require('./stocks-take-request.class');
const moment = require('moment');
const { saveFile } = require('../../common/helpers/file.helper');

const pad = (num, size) => {
    var s = '000000000' + num;
    return s.substr(s.length - size);
};

const buildSku = (stocks_id = '', count = 0, rightNum = 5, date = moment().format('YYMMDD')) => {
    count = count + 1;
    count = pad(count, rightNum);
    return `${pad(stocks_id, 4)}${date}${count}`;
};

const getIsReview = (data = {}) => {
    return (data.length && data[0]['ISREVIEWED']) || 0;
};

const getIsStocksImeiCode = (data = {}) => {
    if (getIsReview(data)) {
        return (data.length && data[0]['ISSTOCKSTAKEIMEICODE']) || 0;
    }
};

/**
 * Get list stocks take request
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */

const getListStocksTakeRequest = async (params = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const keyword = apiHelper.getSearch(params);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('STOCKSTAKETYPEID', apiHelper.getValueFromObject(params, 'stocks_take_type_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'create_date_to'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(params, 'is_reviewed'))
            .input('ISPROCESSED', apiHelper.getValueFromObject(params, 'is_processed'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(params, 'is_active'))
            .execute(PROCEDURE_NAME.ST_STOCKSTAKEREQUESTPERIOD_GetList);
        const record = data.recordset;
        const review = listReviewList(data.recordsets[1]);

        return new ServiceResponse(true, '', {
            data: listStocksTakeRequest(record)?.map((o) => {
                const list_review = review.filter((value) => value.stocks_take_id === o.stocks_take_request_id);
                return {
                    ...o,
                    list_review,
                    stocks_take_name_list: o?.stocks_take_name_list?.split('|'),
                };
            }),
            page: parseInt(currentPage),
            limit: parseInt(itemsPerPage),
            total: apiHelper.getTotalData(record),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksTakeTypeService.getListStocksTakeRequest' });
        return new ServiceResponse(false, '', e?.message);
    }
};

/**
 * Get list stocks take request
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */

const getUserOfDepartmentOpts = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', parseInt(params?.department_id))
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'key_word'))
            .execute(PROCEDURE_NAME.SYS_USER_GetUserDepartment_AdminWeb);
        return new ServiceResponse(true, '', optionsUsers(data?.recordset ?? []));
    } catch (e) {
        logger.error(e, { function: 'stocksTakeTypeService.getUserOfDepartmentOpts' });
        return new ServiceResponse(false, e?.message);
    }
};

/**
 * Generate StocksTakeRequestCode
 * @returns {Promise<ServiceResponse>}
 */

const generateStocksTakeRequestCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PREFIX', 'PKKK')
            .input('TABLENAME', 'ST_STOCKSTAKEREQUESTPERIOD')
            .input('RIGHTCHARACTER', 5)
            .input('ISSEPARATOR', 0)
            .execute('FN_GENERATE_CODE');
        if (data && Object.keys(data.output).length) {
            return new ServiceResponse(true, '', Object.values(data.output)[0]);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksTakeRequestPeriodService.generateStocksTakeRequestCode' });
        return new ServiceResponse(false, '', '');
    }
};

/**
 * Generate StocksTakeRequestCode
 * @returns {Promise<ServiceResponse>}
 */

const createStocksTakeRequest = async (params) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();

        let stocks_take_request_id = apiHelper.getValueFromObject(params, 'stocks_take_request_id');

        const isEdit = Boolean(stocks_take_request_id);
        const stocks_take_request_code = apiHelper.getValueFromObject(params, 'stocks_take_request_code');
        const stocks_take_type_id = apiHelper.getValueFromObject(params, 'stocks_take_type_id');
        const stocks_take_request_name = apiHelper.getValueFromObject(params, 'stocks_take_request_name');
        const department_request_id = apiHelper.getValueFromObject(params, 'department_request_id');
        //const stocks_list_id = apiHelper.getValueFromObject(params, 'stocks_list_id');

        const receiver = apiHelper.getValueFromObject(params, 'receiver');
        const stocks_take_request_user = apiHelper.getValueFromObject(params, 'stocks_take_request_user');
        const stocks_take_request_date = apiHelper.getValueFromObject(params, 'stocks_take_request_date');
        const store_apply_list = apiHelper.getValueFromObject(params, 'store_apply_list', []);
        const description = apiHelper.getValueFromObject(params, 'description');
        const auth_name = apiHelper.getValueFromObject(params, 'auth_name');
        const is_all_product = apiHelper.getValueFromObject(params, 'is_all_product');

        const requestStocksTakeRequest = new sql.Request(transaction);
        const dataStocksTakeRequest = await requestStocksTakeRequest
            .input('STOCKSTAKEREQUESTID', stocks_take_request_id)
            .input('STOCKSTAKEREQUESTCODE', stocks_take_request_code)
            .input('STOCKSTAKETYPEID', stocks_take_type_id)
            .input('STOCKSTAKEREQUESTNAME', stocks_take_request_name)
            .input('DEPARTMENTREQUESTID', department_request_id)
            //.input('STOCKSLISTID', stocks_list_id)
            .input('RECEIVER', receiver)
            .input('STOCKSTAKEREQUESTUSER', stocks_take_request_user)
            .input('STOCKSTAKEREQUESTDATE', stocks_take_request_date)
            .input('DESCRIPTION', description)
            .input('ISALLPRODUCT', is_all_product)
            .input('CREATEDUSER', auth_name)
            .execute(PROCEDURE_NAME.ST_STOCKSTAKEREQUESTPERIOD_CreateOrUpdate);

        stocks_take_request_id = apiHelper.getResult(dataStocksTakeRequest.recordset);

        if (!stocks_take_request_id) {
            const label = isEdit ? 'Chỉnh sửa' : 'Tạo mới';
            throw Error(label + 'thất bại');
        }
        // #region delete maping if edit
        if (isEdit) {
            const requestStocksTakeRVLDelete = new sql.Request(transaction);
            await requestStocksTakeRVLDelete
                .input('STOCKSTAKEREQUESTID', stocks_take_request_id)
                .input('DELETEDUSER', auth_name)
                .execute(PROCEDURE_NAME.ST_STOCKSTAKEREQUESTPERIOD_DeleteMaping_AdminWeb);
        }
        //# endregion
        if (!getIsReview(dataStocksTakeRequest.recordset)) {
            const createStoreStocksTransaction = new sql.Request(transaction);
            for (let i of store_apply_list) {
                for (let m of i?.stocks ?? []) {
                    await createStoreStocksTransaction
                        .input('STOCKSTAKEREQUESTID', stocks_take_request_id)
                        .input('STOREID', i?.store_id)
                        .input('STOCKSID', m?.value || m)
                        .execute('ST_STOCKSTAKESTOCKS_CreateUpdate_AdminWeb');
                }
            }
        }

        // #region add user stocks take

        if (!getIsReview(dataStocksTakeRequest.recordset)) {
            const stocksTakeUser = apiHelper.getValueFromObject(params, 'stocks_take_users', []);
            let requestCreateStocksTakeUser = new sql.Request(transaction);
            for (let i = 0; i < stocksTakeUser.length; i++) {
                const items = stocksTakeUser[i];
                const user_name = apiHelper.getValueFromObject(items, 'user_name');
                const is_main_responsibility = apiHelper.getValueFromObject(items, 'is_main_responsibility');
                const stocks_take_user_id = apiHelper.getValueFromObject(items, 'stocks_take_user_id');

                const resultStocksTakeUser = await requestCreateStocksTakeUser
                    .input('STOCKSTAKEUSERID', stocks_take_user_id)
                    .input('STOCKSTAKEREQUESTID', stocks_take_request_id)
                    .input('USERNAME', user_name)
                    .input('ISMAINRESPONSIBILITY', is_main_responsibility)
                    .input('CREATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.ST_STOCKSTAKE_USER_CreateOrUpdate_AdminWeb);

                const result = resultStocksTakeUser.recordset[0].RESULT;
                if (!result) {
                    throw Error('Thêm mới nhân sự kiểm kê kho thất bại.');
                }
            }

            // #region update user review list
            const user_review_list = apiHelper.getValueFromObject(params, 'user_review_list', []);
            const requestUserReviewlist = new sql.Request(transaction);
            if (user_review_list.length > 0) {
                for (let i = 0; i < user_review_list.length; i++) {
                    let item = user_review_list[i];
                    const stocks_take_review_list_id = apiHelper.getValueFromObject(item, 'stocks_take_review_list_id');
                    const stocks_review_level_id = apiHelper.getValueFromObject(item, 'stocks_review_level_id', null);
                    const user_name = apiHelper.getValueFromObject(item, 'user_name', null);
                    await requestUserReviewlist
                        .input('STOCKSTAKEREVIEWLISTID', stocks_take_review_list_id)
                        .input('STOCKSTAKEREQUESTID', stocks_take_request_id)
                        .input('STOCKSREVIEWLEVELID', stocks_review_level_id)
                        .input('USERNAME', user_name)
                        .input('CREATEDUSER', auth_name)
                        .execute(PROCEDURE_NAME.ST_STOCKSTAKE_REVIEWLIST_Create_AdminWeb);
                }
            }
            // #end
        }
        // #endregion

        // #region update user review list
        const product_list = apiHelper.getValueFromObject(params, 'product_list', []);
        const requestProductList = new sql.Request(transaction);
        if (product_list.length > 0) {
            for (let i = 0; i < product_list.length; i++) {
                let item = product_list[i];
                const stock_take_product_list_id = apiHelper.getValueFromObject(item, 'stock_take_product_list_id');
                const list_imei = apiHelper.getValueFromObject(item, 'list_imei', []);
                const product_id = apiHelper.getValueFromObject(item, 'product_id', null);
                const unit_id = apiHelper.getValueFromObject(item, 'unit_id', null);
                const actual_inventory =
                    apiHelper.getValueFromObject(item, 'actual_inventory', 0) ??
                    list_imei?.filter((o) => o?.available_in_stock).length ??
                    0;
                const resutProduct = await requestProductList
                    .input('STOCKSID', item?.stocks_id)
                    .input('STOCKTAKEPRODUCTLISTID', stock_take_product_list_id)
                    .input('STOCKSTAKEREQUESTID', stocks_take_request_id)
                    .input('ACTUALINVENTORY', actual_inventory)
                    .input('PRODUCTID', product_id)
                    .input('UNITID', unit_id)
                    .input('CREATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.ST_STOCKSTAKE_PRODUCTLIST_CreateOrUpdate_AdminWeb);
                const stocks_take_productlist_id = resutProduct.recordset[0].RESULT;

                if (list_imei.length > 0) {
                    const requestDeleteListImei = new sql.Request(transaction);
                    await requestDeleteListImei
                        .input('STOCKTAKEPRODUCTLISTID', stocks_take_productlist_id)
                        .execute(PROCEDURE_NAME.ST_STOCKSTAKEPRODUCTLIST_IMEICODE_DeleteMapping_AdminWeb);
                    const requestListImei = new sql.Request(transaction);
                    for (let i = 0; i < list_imei.length; i++) {
                        let itemImei = list_imei[i];
                        const stock_take_product_list_imei_code_id = apiHelper.getValueFromObject(
                            itemImei,
                            'stock_take_product_list_imei_code_id',
                        );
                        const product_imei_code = apiHelper.getValueFromObject(itemImei, 'product_imei_code', null);
                        const execution_time =
                            apiHelper.getValueFromObject(itemImei, 'execution_time', null) ??
                            moment(new Date()).format('YYYY-MM-DD');
                        const note = apiHelper.getValueFromObject(itemImei, 'note', null);
                        const available_in_stock = apiHelper.getValueFromObject(itemImei, 'available_in_stock', null);
                        let _url_image = apiHelper.getValueFromObject(itemImei, 'url_image', '');
                        let url_image = null;
                        if (_url_image) url_image = await saveFile(_url_image, 'stocks-take-request');
                        await requestListImei
                            .input('STOCKTAKEPRODUCTLISTIMEICODEID', stock_take_product_list_imei_code_id)
                            .input('STOCKTAKEPRODUCTLISTID', stocks_take_productlist_id)
                            .input('PRODUCTIMEICODE', product_imei_code)
                            .input('EXECUTIONTIME', moment(execution_time).format('YYYY-MM-DD HH:mm'))
                            .input('AVAILABLEINSTOCK', available_in_stock)
                            .input('CREATEDUSER', auth_name)
                            .input('NOTE', note)
                            .input('URLIMAGE', url_image)
                            .execute(PROCEDURE_NAME.ST_STOCKSTAKEPRODUCTLIST_IMEICODE_CreateOrUpdate_AdminWeb);
                    }
                }
            }
        }
        // #endregion
        await transaction.commit();
        return new ServiceResponse(true, 'success', stocks_take_request_id);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'stocksTakeRequestPeriodService.createStocksTakeRequest' });
        return new ServiceResponse(false, e?.message, e?.message);
    }
};

/**
 * get stocks take requestCode
 * @returns {Promise<ServiceResponse>}
 */
const getDetailStocksTakeRequest = async (id, body) => {
    const pool = await mssql.pool;
    try {
        const dataStocksTakeRequest = await pool
            .request()
            .input('STOCKSTAKEREQUESTID', parseInt(id))
            .execute(PROCEDURE_NAME.ST_STOCKSTAKEREQUEST_GETBYID_ADMINWEB);
        let stocksTakeRequest = detailStocksTakeRequest(dataStocksTakeRequest.recordset[0]);
        let user_review_list = listUserReiew(dataStocksTakeRequest.recordsets[1]);
        let stocks_take_users = listStocksTakeUser(dataStocksTakeRequest.recordsets[2]);
        let list_product_imei_code = listProductImeiCode(dataStocksTakeRequest.recordsets[4]);
        let product_list = listProduct(dataStocksTakeRequest.recordsets[3]).map((value) => ({
            ...value,
            list_imei: list_product_imei_code.filter(
                (p) => parseInt(p?.stock_take_product_list_id) === parseInt(value?.stock_take_product_list_id),
            ),
        }));

        stocksTakeRequest.user_review_list = user_review_list.map((value, index) => {
            let is_show_review = 0;
            if (
                value.user_name === body.auth_name &&
                ![USERREVIEW_TYPES.APPROVED, USERREVIEW_TYPES.REJECT].includes(value?.is_reviewed)
            ) {
                if (index === 0) {
                    is_show_review = 1;
                } else {
                    const previousIndex = index - 1;
                    const dataPrevious = user_review_list[previousIndex];
                    if (dataPrevious?.is_reviewed === USERREVIEW_TYPES.APPROVED) {
                        is_show_review = 1;
                    }
                }
            }
            return {
                ...value,
                is_show_review,
            };
        });
        stocksTakeRequest.stocks_take_users = stocks_take_users ?? [];
        stocksTakeRequest.product_list = product_list ?? [];

        const store_apply_groupby = Object.values(_.groupBy(dataStocksTakeRequest.recordsets[5], 'store_id')).map(
            (o) => ({
                ...o[0],
                stocks: o?.map((_) => String(_.stocks_id)),
            }),
        );
        stocksTakeRequest.store_apply_list = store_apply_groupby;
        stocksTakeRequest.stocks_list_id = _.uniq((dataStocksTakeRequest.recordsets[5] ?? []).map((o) => o?.stocks_id));
        return new ServiceResponse(true, 'data', stocksTakeRequest);
    } catch (error) {
        logger.error(error, { function: 'stocksTakeRequestPeriodService.getDetailStocksTakeRequest' });
        return new ServiceResponse(false, '', error?.message);
    }
};

/**
 * get list product
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */
const getListProduct = async (params) => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const keyword = apiHelper.getSearch(params);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'create_date_to'))
            .input('PRODUCTMODELID', apiHelper.getValueFromObject(params, 'model_id'))
            .input('PRODUCTCATEGORYID', apiHelper.getValueFromObject(params, 'product_category_id'))
            .input('STOCKSLIST', apiHelper.getValueFromObject(params, 'stocks_list', []).join(','))
            .input('ISSTOCKSTAKEIMEICODE', apiHelper.getValueFromObject(params, 'is_stocks_take_imei_code', 0))
            .execute('MD_PRODUCT_GetList_StocksTake_AdminWeb');

        const products = listProduct(data.recordset);
        return new ServiceResponse(true, '', {
            data: products,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (error) {
        logger.error(error, { function: 'stocksTakeRequestPeriodService.getStocksTakeRequest' });
        return new ServiceResponse(false, '', error?.message);
    }
};

/**
 * get total inventory with stocks take request id
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */
const getTotalInventoryWithId = async (params) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('STOCKSTAKEREQUESTID', apiHelper.getValueFromObject(params, 'stocks_take_request_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSTAKEREQUESTPERIOD_TotalInventoryWithId);

        const products = listProduct(data.recordset);
        if (data.recordset[0]?.ERRORMESSAGE === ERROR_INVENTORY.WAITREVIEW) {
            throw Error('Phiếu này chưa duyệt, không thể lấy tồn kho');
        } else if (data.recordset[0]?.ERRORMESSAGE === ERROR_INVENTORY.CHECKED) {
            throw Error('Phiếu này đã lấy tồn kho');
        } else if (data.recordset[0]?.ERRORMESSAGE === ERROR_INVENTORY.ILLEGAL) {
            throw Error('Kiểm kê không đúng quy cách, không thể lấy tồn kho');
        } else if (Boolean(data.recordset[0]?.ERRORMESSAGE)) {
            throw Error(data.recordset[0]?.ERRORMESSAGE);
        }
        return new ServiceResponse(true, '', {
            data: products,
            total: apiHelper.getTotalData(data.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksTakeRequestPeriodService.getStocksTakeRequest' });
        return new ServiceResponse(false, '', e?.message);
    }
};

/**
 * get total inventory with stocks take request id
 * @param {Object} stocks_take_request_id
 * @returns {Promise<ServiceResponse>}
 */
const executeStocksTakeRequestPeriod = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        const id = apiHelper.getValueFromObject(bodyParams, 'stocks_take_request_id');
        const auth_name = apiHelper.getValueFromObject(bodyParams, 'auth_name');
        const dataStocksTakeRequest = await pool
            .request()
            .input('STOCKSTAKEREQUESTID', id)
            .execute(PROCEDURE_NAME.ST_STOCKSTAKEREQUEST_GETBYIDEXECUTESTOCKSTAKE);
        const stocksIn = listImeiStocksDetail(dataStocksTakeRequest.recordsets[2]);
        const stocksOut = listImeiStocksDetail(dataStocksTakeRequest.recordsets[3]);

        // #region stocksout
        if (stocksOut.length) {
            const requestCreateStocksOut = new sql.Request(transaction);
            const resultCreateStocksOut = await requestCreateStocksOut
                .input('STOCKSTAKEREQUESTID', id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('ST_STOCKSTAKEREQUESTPERIOD_CreateStocksOut_AdminWeb');
            const { STOCKSOUTREQUESTDETAILID: stocksOutRequestId } = resultCreateStocksOut.recordset[0];

            if (!stocksOutRequestId) {
                throw Error('Tạo phiếu xuất kho không thành công!');
            }
            const requestCreateStocksOutProduct = new sql.Request(transaction);
            for (let i = 0; i < stocksOut.length; i++) {
                const item = stocksOut[i];
                const resultCreateStocksOutProduct = await requestCreateStocksOutProduct
                    .input('STOCKSID', apiHelper.getValueFromObject(item, 'stocks_id'))
                    .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                    .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(item, 'product_imei_code'))
                    .input('COMPONENTID', apiHelper.getValueFromObject(item, 'component_id'))
                    .input('COMPONENTIMEICODE', apiHelper.getValueFromObject(item, 'component_imei_code'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('CREATEDUSER', auth_name)
                    .execute(PROCEDURE_NAME.ST_STOCKSTAKEREQUEST_CREATESTOCKSOUT);
                const { RESULT: stocksOutRequestDetailId } = resultCreateStocksOutProduct.recordset[0];

                if (!stocksOutRequestDetailId) {
                    throw Error('Tạo chi tiết phiếu xuất kho không thành công!');
                }
            }
        }
        // #endregion

        if (stocksIn.length) {
            const requestCreateStocksIn = new sql.Request(transaction);
            const resultCreateStocksIn = await requestCreateStocksIn
                .input('STOCKSTAKEREQUESTID', id)
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(PROCEDURE_NAME.ST_STOCKSTAKEREQUEST_CREATESTOCKIN);
            const { RESULT: stocksInRequestId } = resultCreateStocksIn.recordset[0];
            if (!stocksInRequestId) {
                throw Error('Tạo phiếu nhập kho không thành công!');
            }
            //Lay du lieu số lô, code
            const dataInitialReq = new sql.Request(transaction);
            const initial = await dataInitialReq.execute('ST_STOCKSINREQUEST_GetInitialValue_AdminWeb');
            const LOTNUMBER = initial.recordset[0].LOTNUMBER;
            let TOTALPRODUCTIMEICODE = initial.recordsets[1][0].TOTALPRODUCTIMEICODE;

            for (let i = 0; i < stocksIn.length; i++) {
                const item = stocksIn[i];
                let imei = apiHelper.getValueFromObject(item, 'product_imei_code', null);
                let productImeiCode = imei ? imei : buildSku(item?.stocks_id, TOTALPRODUCTIMEICODE);
                const requestSTRIQDTCreate = new sql.Request(transaction);
                await requestSTRIQDTCreate // eslint-disable-line no-await-in-loop
                    .input('STOCKSINREQUESTID', stocksInRequestId)
                    .input('STOCKSTAKEPRODUCTLISTID', apiHelper.getValueFromObject(item, 'stock_take_product_list_id'))
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                    .input('PRODUCTIMEICODE', productImeiCode)
                    .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                    .input('QUANTITY', Math.abs(apiHelper.getValueFromObject(item, 'difference_value')) || 0)
                    .input('LOTNUMBER', sql.VarChar(200), LOTNUMBER)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('STOCKSID', apiHelper.getValueFromObject(item, 'stocks_id'))
                    .input('ISSTOCKSTAKEIMEI', apiHelper.getValueFromObject(bodyParams, 'is_stocks_take_imeicode'))
                    .input('STOCKSTAKEREQUESTID', id)
                    .execute('ST_STOCKSTAKEREQUESTPERIOD_CreateStocksInDetail_AdminWeb');
            }
        }

        // #region
        const requestUpdateStocksTake = new sql.Request(transaction);
        await requestUpdateStocksTake
            .input('STOCKSTAKEREQUESTID', id)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSTAKEREQUESTPERIOD_UpdateProcess_AdminWeb');
        // #endregion

        await transaction.commit();
        return new ServiceResponse(true, 'Xử lý kiểm kê kho thành công', '');
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {
            stocks: 'stocksTakeRequestPeriodService.executeStocksTakeRequestPeriod',
        });
        return new ServiceResponse(false, error.message);
    }
};

const approveOrRejectUpdateStocksTake = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        const data = await pool
            .request()
            .input('STOCKSTAKEREVIEWLISTID', apiHelper.getValueFromObject(bodyParams, 'stocks_take_review_list_id'))
            .input('TYPE', apiHelper.getValueFromObject(bodyParams, 'type'))
            .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .execute('ST_STOCKSTAKE_REVIEWLIST_ApproveOrReject_AdminWeb');
        // removeCacheOptions();
        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.deleteStocksOutRequest' });
        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const updateConcludeContent = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        const data = await pool
            .request()
            .input('STOCKSTAKEREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_take_request_id'))
            .input('CONCLUDECONTENT', apiHelper.getValueFromObject(bodyParams, 'conclude_content'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSTAKEREQUESTPERIOD_UpdateProcess_AdminWeb');
        // removeCacheOptions();
        // Return ok
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'stocksOutRequestService.deleteStocksOutRequest' });
        // Return failed
        return new ServiceResponse(false, e.message);
    }
};

const productStocksTakeImport = async (body, files) => {
    const pool = await mssql.pool;
    try {
        const workbook = XLSX.read(files[0].buffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetValues = XLSX.utils.sheet_to_json(worksheet);
        const json_return = [];

        for (let i of sheetValues) {
            const product_code = i['Mã sản phẩm*'];
            const product_imei_code = i['Mã IMEI/SKU/SERIAL*'];
            const note = i['Ghi chú'];
            let error = null;
            const data = await pool
                .request()
                .input('STOCKSID', body?.stocks_id)
                .input('PRODUCTCODE', product_code)
                .input('PRODUCTIMEICODE', product_imei_code)
                .execute('ST_STOCKSTAKEREQUESTPERIOD_CheckImportProduct');
            const result = data.recordset[0];

            if (!result?.PRODUCTCODE) {
                error = 'Sản phẩm này không nằm trong danh sách sản phẩm yêu cầu kiểm kê';
            } else if (!Boolean(product_imei_code)) {
                error = 'Imei là bắt buộc';
            }

            json_return.push({
                product_id: result?.PRODUCTID,
                product_code,
                product_imei_code,
                product_name: result?.PRODUCTNAME,
                category_name: result?.CATEGORYNAME,
                model_name: result?.MODELNAME,
                unit_name: result?.UNITNAME,
                note,
                error,
            });
        }
        return new ServiceResponse(true, '', json_return);
    } catch (error) {
        logger.error(error, { function: 'stocksOutRequestService.productStocksTakeImport' });
        return new ServiceResponse(false, error.message);
    }
};

/**
 * Get list stocks by store id
 * @param {Object} params
 * @returns {Promise<ServiceResponse>}
 */

const getStocksById = async (store_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('STOREID', store_id).execute('ST_STOCKS_GetListByStore_AdminWeb');
        return new ServiceResponse(true, '', data?.recordset);
    } catch (e) {
        logger.error(e, { function: 'stocksTakeTypeService.getStocksById' });
        return new ServiceResponse(false, e?.message);
    }
};

const deleteStocksTakeRequestPeriod = async (stocks_take_request_id, bodyParams) => {
    const pool = await mssql.pool;
    try {
        await pool
            .request()
            .input('STOCKSTAKEREQUESTID', stocks_take_request_id)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('ST_STOCKSTAKEREQUESTPERIOD_DELETE');

        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'stocksTakeRequestPeriodService.deleteStocksTakeRequestPeriod',
        });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListStocksTakeRequest,
    getUserOfDepartmentOpts,
    generateStocksTakeRequestCode,
    createStocksTakeRequest,
    getDetailStocksTakeRequest,
    getListProduct,
    getTotalInventoryWithId,
    executeStocksTakeRequestPeriod,
    approveOrRejectUpdateStocksTake,
    productStocksTakeImport,
    updateConcludeContent,
    getStocksById,
    deleteStocksTakeRequestPeriod,
};
