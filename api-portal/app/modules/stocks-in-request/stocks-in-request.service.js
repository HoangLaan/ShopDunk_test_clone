const stocksInRequestClass = require('../stocks-in-request/stocks-in-request.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const pdfHelper = require('../../common/helpers/pdf.helper');
const moment = require('moment');
const { convertUnitDensity } = require('../../common/helpers/stock.helper');
const readXlsxFile = require('read-excel-file/node');
const { changeToSlug, buildSku } = require('../../common/helpers/string.helper');
let xl = require('excel4node');
const unitService = require('../unit/unit.service');
const StRequestHelper = require('./helper');
const purchaseOrdersClass = require('../purchase-orders/purchase-orders.class');
const requestWarrantyClass = require('../request-warranty-repair/request-warranty-repair.class');
const { getListReviewLevelByStocksOutypeId } = require('../stocks-out-request/stocks-out-request.service');
const { formatCurrency } = require('../../common/helpers/numberFormat');
const { insertQueue } = require('../../queue');

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListStocksInRequest = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const createdUser = apiHelper.getValueFromObject(queryParams, 'created_user');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
            .input('STOCKSINTYPEID', apiHelper.getValueFromObject(queryParams, 'stocks_in_type_id'))
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .input('ISIMPORTED', apiHelper.getFilterBoolean(queryParams, 'is_imported') || '2')
            .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_deleted', 0))
            .input('ISREVIEWED', apiHelper.getValueFromObject(queryParams, 'is_reviewed', 0))
            .input('CREATEDUSER', createdUser?.value || '')
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'auth_id'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETLIST_ADMINWEB);

        let StocksInRequests = stocksInRequestClass.list(data.recordsets[0]);
        let reviewList = stocksInRequestClass.reviewLevel(data.recordsets[1]);
        let stocksIn = [];
        if (reviewList) {
            stocksIn = (StocksInRequests || []).map((p) => {
                return {
                    ...p,
                    review_list: reviewList.filter((o) => o.stocks_in_request_id === p.stocks_in_request_id),
                };
            });
        }
        const totalItem = data.recordset && data.recordset.length ? data.recordset[0].TOTAL : 0;
        return new ServiceResponse(true, '', {
            data: stocksIn,
            page: currentPage,
            limit: itemsPerPage,
            total: totalItem,
        });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getListStocksInRequest',
        });
        return new ServiceResponse(true, '', {});
    }
};

const genDataByStocksInTypeId = async (stocks_in_type_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSINTYPEID', stocks_in_type_id)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETINFO_STOCKSINTYPEID_ADMINWEB);
        let StocksInRequest = data.recordset;
        if (StocksInRequest && StocksInRequest.length > 0) {
            StocksInRequest = stocksInRequestClass.genDataStocksInType(StocksInRequest[0]);
            return new ServiceResponse(true, '', StocksInRequest);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.genDataByStocksInTypeId',
        });
        return new ServiceResponse(false, e.message);
    }
};

const genCostValue = async (cost_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('COSTID', cost_id)
            .execute(PROCEDURE_NAME.ST_STOCKSIN_COST_GEN_COSTVALUE_ADMINWEB);
        let CostValue = data.recordset;
        if (CostValue && CostValue.length > 0) {
            CostValue = stocksInRequestClass.genCostValue(CostValue[0]);
            return new ServiceResponse(true, '', CostValue);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.genCostValue' });
        return new ServiceResponse(false, e.message);
    }
};

const getListDescription = async (key_config) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYCONFIG', key_config)
            .execute(PROCEDURE_NAME.ST_STOCKSIN_COST_GET_DESCRIPTION_ADMINWEB);
        let ListDescription = data.recordset;
        if (ListDescription && ListDescription.length > 0) {
            ListDescription = stocksInRequestClass.listAll(ListDescription[0]);
            return new ServiceResponse(true, '', ListDescription);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.getListDescription' });
        return new ServiceResponse(false, e.message);
    }
};

const getStocksManager = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(queryParams, 'stocks_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETINFO_STOCKSMANAGER_ADMINWEB);
        let StocksManager = data.recordset;

        return new ServiceResponse(true, '', {
            data: stocksInRequestClass.getStocksManager(StocksManager),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.getStocksManager' });
        return new ServiceResponse(true, '', {});
    }
};

const getVehicleList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PARTNERTRANSPORTID', apiHelper.getValueFromObject(queryParams, 'partner_transport_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GET_VEHICLE_ADMINWEB);
        let VehicleList = data.recordset;

        return new ServiceResponse(true, '', {
            data: stocksInRequestClass.listAll(VehicleList),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.getVehicleList' });
        return new ServiceResponse(true, '', {});
    }
};

// detail StocksInRequest
const detailStocksInRequest = async (stocksInRequestId) => {
    try {
        const pool = await mssql.pool;
        // Lay thong tin nhap kho
        const dataStocksInRequest = await pool
            .request()
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETBYID_ADMINWEB);
        let stocksInRequest = stocksInRequestClass.detail(dataStocksInRequest.recordset[0]);
        // Lay hinh thuc nhap kho
        if (dataStocksInRequest.recordsets[1] && dataStocksInRequest.recordsets[1].length) {
            stocksInRequest.stocks_in_type = stocksInRequestClass.stocksInTypeOptions(
                dataStocksInRequest.recordsets[1][0],
            );
        }
        if (!stocksInRequest || !stocksInRequest.stocks_in_request_id)
            return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        // lay danh sach chi tiet nhap kho
        const dataStocksInRequestDetail = await pool
            .request()
            .input('REQUESTCODE', stocksInRequest?.request_code)
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_GETBYSTOCKSINREQUESTID_ADMINWEB);
        let detailList = stocksInRequestClass.listProductDetail(dataStocksInRequestDetail.recordset);
        const costApplyList = stocksInRequestClass.listCostApply(dataStocksInRequestDetail.recordsets[1]);
        const imeiList = stocksInRequestClass.imeiList(dataStocksInRequestDetail?.recordsets[2]);
        let productList = [];
        for (let i = 0; i < detailList.length; i++) {
            const {
                product_id,
                stocks_in_detail_id,
                order_index,
                unit_id,
                quantity,
                total_price,
                product_imei_code,
                cost_basic_imei_code,
                total_cost_basic_imei,
                total_cost_price,
                total_cost_st_request_price,
                note = '',
            } = detailList[i];
            // Lay danh sach don vi tinh
            // const productUnitRes = await getProductInit(product_id);
            // if (productUnitRes.isSuccess()) {
            //     const {unit_list} = productUnitRes.getData();
            //     detailList[i] = {...detailList[i], ...{unit_list}};
            //     productUnit[product_id] = unit_list;
            // }
            // Lay danh sach chi phi ap dung
            detailList[i].cost_apply_list = (costApplyList || []).filter(
                (v) => v.stocks_in_request_detail_id == stocks_in_detail_id,
            );
            // Gom san pham lai
            const idx = (productList || []).findIndex(
                (x) => x.product_id == product_id && unit_id == x.unit_id && x.order_index == order_index,
            );
            if (idx >= 0) {
                productList[idx].quantity += quantity;
                productList[idx].skus.push({
                    id: i,
                    stocks_in_detail_id: stocks_in_detail_id,
                    sku: imeiList[i]?.product_imei_code || product_imei_code,
                    note,
                });
                productList[idx].total_price += total_price;
            } else {
                let checkTotalCostBasicImei = total_cost_basic_imei + total_cost_price;
                let checkQuantity = parseInt(quantity) ?? 0;
                checkQuantity = checkQuantity ? checkQuantity : 1;
                let mathPriceCostImei = Math.round(checkTotalCostBasicImei / quantity) + cost_basic_imei_code;
                productList.push({
                    ...detailList[i],
                    quantity: quantity,
                    cost_basic_imei_code: mathPriceCostImei,
                    total_price_cost: checkTotalCostBasicImei,
                    order_index,
                    total_price,
                    skus: [
                        {
                            id: i,
                            stocks_in_detail_id: stocks_in_detail_id,
                            sku: imeiList[i]?.product_imei_code || product_imei_code,
                            note,
                        },
                    ],
                });
            }
        }

        // lay chi phi ap dung nhap kho
        const dataCostTypeList = await pool
            .request()
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_COST_GETBYSTOCKSINREQUESTID_ADMINWEB);
        let cost_type_list = stocksInRequestClass.listCostType(dataCostTypeList.recordset);

        // lay muc duyet
        const dataReviewLevelList = await pool
            .request()
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSIN_REVIEWLIST_GETBYSTOCKSINREQUESTID_ADMINWEB);
        let review_level_list = stocksInRequestClass.reviewLevel(dataReviewLevelList.recordset);

        // review_level_list = review_level_list.map(o => {
        //     return {...o, list_user: [{id: o.review_user, name: o.full_name}]};
        // });
        // lay danh sach san pham nhap kho ap dung chi phi
        const dataProductApplyCost = await pool
            .request()
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_PRODUCTCOST_GETBYSTOCKSINREQUESTID_ADMINWEB);
        let product_apply_cost = stocksInRequestClass.listProductApplyCost(dataProductApplyCost.recordset);

        return new ServiceResponse(true, 'ok', {
            ...stocksInRequest,
            ...{ cost_type_list },
            ...{ product_apply_cost },
            ...{ products_list: productList },
            ...{ review_level_list },
        });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.detailStocksInRequest',
        });
        return new ServiceResponse(false, e.message);
    }
};

// detail StocksInRequest
const detailToPrint = async (stocksInRequestId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETTOPRINT_ADMINWEB);

        if (!data.recordset.length) return new ServiceResponse(false, 'NOT FOUND');

        let stocksInRequest = stocksInRequestClass.detailPrint(data.recordset[0]);
        let productList = stocksInRequestClass.productListPrint(data.recordsets[1]);

        let productsCount = Object.values(
            productList.reduce((a, { product_id }) => {
                const key = product_id;
                a[key] = a[key] || { product_id, quantity: 0 };
                a[key].quantity++;
                return a;
            }, {}),
        );

        if (productsCount.length > 1) {
            productsCount = productsCount.map((item) => {
                const productItem = productList.find((p) => p.product_id === item.product_id);
                if (productItem) {
                    item.total_cost_basic_imei = +productItem.total_cost_basic_imei.replaceAll('.', '') * item.quantity;
                }
                return item;
            });

            productsCount = productsCount.map((item) => ({
                ...item,
                total_cost_basic_imei: formatCurrency(item.total_cost_basic_imei, 0),
            }));

            const getIndexLastProduct = (product_id) =>
                [...productList].reverse().findIndex((item) => item.product_id === product_id);
            let productListClone = [...productList];
            let sum = 0;
            for (let index = 0; index < productList.length; index++) {
                const indexLast = getIndexLastProduct(productList[index].product_id);
                if (index === productList.length - 1 - indexLast) {
                    productListClone = [
                        ...productListClone.slice(0, index + sum + 1),
                        productsCount.find((item) => item.product_id === productList[index].product_id),
                        ...productListClone.slice(index + sum + 1),
                    ];
                    sum++;
                }
            }

            productList = productListClone;
        }

        return new ServiceResponse(true, 'ok', { ...stocksInRequest, ...{ product_list: productList } });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getListStocksInRequest',
        });
        return new ServiceResponse(false, e.message);
    }
};

// Delete stocksInRequest
const deleteStocksInRequest = async (bodyParams = {}) => {
    let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'STOCKSINREQUESTID')
            .input('TABLENAME', 'ST_STOCKSINREQUEST')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, {
            function: 'SolutionService.deleteStocksInRequest',
        });
        return new ServiceResponse(false, e.message);
    }
};

// change Status StocksInRequest
const changeStatusStocksInRequest = async (stocksInRequestId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name')) // return administrator
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_UPDATESTATUS_ADMINWEB);
        return new ServiceResponse(true, 'change status success', {
            isSuccess: true,
        });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.changeStatusStocksInRequest',
        });
        return new ServiceResponse(false);
    }
};

// Create or update StocksInRequest
// STIRQ = StocksInRequest
// STRIQDT = StocksInRequestDetail

const createStocksDetail = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        // Them moi du lieu vao bang chi tiet nhap kho
        let productListOrigin = apiHelper.getValueFromObject(bodyParams, 'products_list');
        if (!productListOrigin || !productListOrigin.length) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
        }
        const isImported = apiHelper.getValueFromObject(bodyParams, 'is_imported');
        const isReviewed = apiHelper.getValueFromObject(bodyParams, 'is_reviewed');

        // Nhân số lượng product list và chuyển quantity về 1, để nhập từng dong đối với số lượng > 1
        // Bao nhiu sku thi bấy nhiu chi tiết nhập kho
        // Cac giá trị cần tính lại: total_price, total_price_cost, total_cost_basic_imei
        let productList = productListOrigin.reduce((list, x, j) => {
            const { skus = [] } = x;
            for (let i = 0; i < skus.length; i++) {
                list.push({
                    ...x,
                    total_price_cost: x.total_price_cost / x.quantity,
                    total_cost_basic_imei: x.total_cost_basic_imei / x.quantity,
                    order_index: j,
                    input_quantity: x.quantity,
                    quantity: 1,
                    total_price: (x.cost_price || 0) * 1,
                    note: skus[i].note || '',
                    product_imei_code: skus[i].sku || '',
                });
            }
            return list;
        }, []);
        let hasErrorTransfer = 0;
        if (isReviewed === 1 && isImported === 0) {
            const requestCreateStocksDetail = new sql.Request(transaction);

            for (let i = 0; i < productList.length; i++) {
                const item = productList[i];
                let lotNumber = apiHelper.getValueFromObject(item, 'lot_number', '') + '';
                let productImeiCode = apiHelper.getValueFromObject(item, 'product_imei_code');

                // Neu la nhap kho và phiêu đã dc duyệt thi luu vao bang chi tiet kho
                // Nhap kho roi khong duoc chinh sua

                const dataCreateStocksDetail = await requestCreateStocksDetail
                    .input('STOCKSDETAILID', null)
                    .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(item, 'stocks_in_request_id'))
                    .input('STOCKSINREQUESTDETAILID', apiHelper.getValueFromObject(item, 'stocks_in_detail_id'))
                    .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_id'))
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                    .input('ISMATERIAL', apiHelper.getValueFromObject(item, 'is_material'))
                    .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                    .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
                    .input('LOTNUMBER', lotNumber)
                    .input('PRODUCTIMEICODE', productImeiCode)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    //.input('COSEBASICIMEICODEBASEUNIT', apiHelper.getValueFromObject(item, 'cost_per_quantity'))
                    // Kiêm tra xem số lượng nhập kho có lớn hơn xuất kho đối với chuyển kho
                    .input('REQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'request_code'))
                    .input('REQUESTID', apiHelper.getValueFromObject(bodyParams, 'request_id'))
                    .input('ISTRANSFER', apiHelper.getValueFromObject(bodyParams, 'is_transfer'))
                    .input('ISINTERNAL', apiHelper.getValueFromObject(bodyParams, 'is_internal'))
                    .input('RECEIVERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute(PROCEDURE_NAME.SL_STOCKSINREQUEST_STOCKSDETAIL_CREATEORUPDATE_ADMINWEB);

                const { RESULT = 0, ERR = 0, PRODUCTNAME = '' } = dataCreateStocksDetail.recordset[0] || {};

                if (ERR == 1) {
                    await transaction.rollback();
                    return new ServiceResponse(false, `Sản phẩm ${PRODUCTNAME} chưa được xuất kho.`);
                } else if (ERR == 2) {
                    await transaction.rollback();
                    return new ServiceResponse(
                        false,
                        `SỐ lượng nhập kho của sản phẩm ${PRODUCTNAME} vượt quá số lượng xuất kho.`,
                    );
                } else if (RESULT == 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, 'Nhập kho sản phẩm thất bại.');
                }
                if (ERR == 3) {
                    // So luong nhap kho < xuat ko => co van de
                    hasErrorTransfer = 1;
                }
            }
            for (let i = 0; i < productListOrigin.length; i++) {
                //update lại trạng thái của product in PO
                const item = productListOrigin[i];
                const createOrUpdateDetail = new sql.Request(transaction);
                const createOrUpdateDetailRes = await createOrUpdateDetail
                    .input(
                        'PURCHASEORDERREQUESTDETAILID',
                        apiHelper.getValueFromObject(item, 'purchase_order_detail_id', null),
                    )
                    .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(item, 'stocks_in_request_id'))
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                    .input('WAREHOUSEDQUANTITY', apiHelper.getValueFromObject(item, 'quantity', 1))
                    .input('DIVIDEDQUANTITY', null)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute('SL_PURCHASEORDER_DETAIL_CreateOrUpdate_AdminWeb');

                const purchaseRequisitionDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
                if (purchaseRequisitionDetailId <= 0) {
                    await transaction.rollback();
                    throw new ServiceResponse(false, 'Lỗi cập nhật chi tiết đơn mua hàng');
                }
            }

            const stocks_in_request_id = apiHelper.getValueFromObject(productListOrigin[0], 'stocks_in_request_id');

            // cập nhật trạng thái đơn preOrder
            const updatePreOrderStatus = new sql.Request(transaction);
            await updatePreOrderStatus
                .input('STOCKSINREQUESTID', stocks_in_request_id)
                .execute('ST_STOCKSINREQUEST_updatePreOrderStatus_AdminWeb');

            // cập nhật thời gian nhận hàng thực tế stocks transfer
            const updateStocksTransferRequest = new sql.Request(transaction);
            await updateStocksTransferRequest
                .input('REQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'request_code'))
                .execute('ST_STOCKSINREQUEST_updateStocksTransfer_AdminWeb');
        }

        const stocksTransferCode = apiHelper.getValueFromObject(bodyParams, 'request_code');
        if (stocksTransferCode && isReviewed === 1) {
            // update stocks transfer
            const requestDataUpdate = new sql.Request(transaction);
            const dataUpdate = await requestDataUpdate
                .input('STOCKSTRANSFERCODE', stocksTransferCode)
                .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .input('ERRORTRASNFER', hasErrorTransfer)
                .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_STOCKSTRANSFER_UPDATE_ADMINWEB);
            const resultUpdate = dataUpdate.recordset[0].RESULT;
            if (resultUpdate <= 0) {
                await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'ok', true);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, {
            function: 'stocksInRequestService.createStocksDetail',
        });
        return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
    }
};

const stocksOutRequestGenCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSOUTREQUEST_GenStocksOutRequestCodeWarranty_App');
        let StocksOutRequestCode = data.recordset;

        if (StocksOutRequestCode && StocksOutRequestCode.length > 0) {
            StocksOutRequestCode = requestWarrantyClass.genStocksOutRequestCode(StocksOutRequestCode[0]);
            return new ServiceResponse(true, '', StocksOutRequestCode);
        }
        return new ServiceResponse(false, 'lỗi gen mã phiếu xuất kho');
    } catch (e) {
        logger.error(e, { function: 'requestService.stocksOutRequestGenCode' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateStocksInRequest = async (bodyParams) => {
    // const pool = await mssql.pool;
    // const transaction = await new sql.Transaction(pool);
    try {
        await insertQueue.add({ bodyParams});
        // console.log('que', que);
        // await transaction.begin();
        // const is_return_component = apiHelper.getValueFromObject(bodyParams, 'is_return_component');
        // const type_component = apiHelper.getValueFromObject(bodyParams, 'type_component');

        // const stocksInType = apiHelper.getValueFromObject(bodyParams, 'stocks_in_type') || {};
        // const isAutoReview = apiHelper.getValueFromObject(bodyParams, 'is_auto_review');
        // // luu hoac cap nha thong tin nhap kho
        // const stocksId = apiHelper.getValueFromObject(bodyParams, 'stocks_id');
        // const dataReq = new sql.Request(transaction);
        // const data = await dataReq
        //     .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'))
        //     .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
        //     .input('STOCKSINCODE', apiHelper.getValueFromObject(bodyParams, 'stocks_in_code'))
        //     .input('ISIMPORTED', apiHelper.getValueFromObject(bodyParams, 'is_imported'))
        //     .input('ISREVIEWED', isAutoReview ? isAutoReview : apiHelper.getValueFromObject(bodyParams, 'is_reviewed'))
        //     .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //     .input('STOCKSINTYPEID', 1 * apiHelper.getValueFromObject(bodyParams, 'stocks_in_type_id'))
        //     .input('STOCKSINTYPE', stocksInType.stocks_in_type || 1)
        //     .input('REQUESTID', apiHelper.getValueFromObject(bodyParams, 'request_id'))
        //     .input('REQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'request_code'))
        //     .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(bodyParams, 'department_request_id'))
        //     .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(bodyParams, 'business_request_id'))
        //     .input('REQUESTUSER', apiHelper.getValueFromObject(bodyParams, 'request_user'))
        //     .input('SUPPLIERID', apiHelper.getValueFromObject(bodyParams, 'supplier_id'))
        //     .input('STOCKSID', stocksId)
        //     .input('RECEIVERNAME', apiHelper.getValueFromObject(bodyParams, 'receiver_name'))
        //     .input('LOTNUMBER', apiHelper.getValueFromObject(bodyParams, 'lot_number'))
        //     .input('STOCKSINDATE', apiHelper.getValueFromObject(bodyParams, 'stocks_in_date'))
        //     .input('TOTALAMOUNT', 1 * apiHelper.getValueFromObject(bodyParams, 'total_amount'))
        //     // .input('FROMSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'from_stocks_id'))
        //     //.input('SENDERNAME', apiHelper.getValueFromObject(bodyParams, 'sender_name'))
        //     .input('ISAPPLYUNITPRICE', sql.Bit, apiHelper.getValueFromObject(bodyParams, 'is_apply_unit_price'))
        //     .input('TOTALPRICE', apiHelper.getValueFromObject(bodyParams, 'total_price'))
        //     .input('TOTALCOST', apiHelper.getValueFromObject(bodyParams, 'total_cost'))
        //     .input('COSTPERQUANTITY', apiHelper.getValueFromObject(bodyParams, 'cost_per_quantity'))
        //     .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
        //     .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
        //     .input('CUSTOMERTYPE', apiHelper.getValueFromObject(bodyParams, 'customer_type'))
        //     .input('ISODDCUSTOMER', apiHelper.getValueFromObject(bodyParams, 'is_odd_customer'))
        //     .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_CREATEORUPDATE_ADMINWEB);
        // const stocksInRequestId =
        //     apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id') ?? data.recordsets[1][0].RESULT;
        // if (stocksInRequestId <= 0) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
        // }
        // // Xoa du lieu bang chi tiet nhap kho  ST_STOCKSINREQUESTDETAIL
        // const requestDeleteStocksInRequestDetail = new sql.Request(transaction);
        // const dataStocksInRequestDetailDelete = await requestDeleteStocksInRequestDetail
        //     .input('STOCKSINREQUESTID', stocksInRequestId)
        //     .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_DELETE_ADMINWEB);
        // const resultDeleteStocksInRequestDetail = dataStocksInRequestDetailDelete.recordset[0].RESULT;
        // if (resultDeleteStocksInRequestDetail <= 0) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        // }
        // // Xoa du lieu bang ST_STOCKSINREQUESTDETAIL_COST
        // const requestDelSTIRQDTCost = new sql.Request(transaction);
        // const dataSTIRQDTCostDelete = await requestDelSTIRQDTCost
        //     .input('STOCKSINREQUESTID', stocksInRequestId)
        //     .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_COST_DELETE_ADMINWEB);
        // const resultDelSTIRQDTCost = dataSTIRQDTCostDelete.recordset[0].RESULT;
        // if (resultDelSTIRQDTCost <= 0) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        // }

        // // Xoa du lieu bang ST_STOCKSINREQUEST_COST
        // const requestDelSTIRQCost = new sql.Request(transaction);
        // const dataSTIRQCostDelete = await requestDelSTIRQCost
        //     .input('STOCKSINREQUESTID', stocksInRequestId)
        //     .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_COST_DELETE_ADMINWEB);
        // const resultDelSTIRQCost = dataSTIRQCostDelete.recordset[0].RESULT;
        // if (resultDelSTIRQCost <= 0) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        // }

        // // Xoa du lieu bang ST_STOCKSINREQUEST_PRODUCTCOST
        // const requestDelSTIRQProductCost = new sql.Request(transaction);
        // const dataSTIRQProductCostDelete = await requestDelSTIRQProductCost
        //     .input('STOCKSINREQUESTID', stocksInRequestId)
        //     .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_PRODUCTCOST_DELETE_ADMINWEB);
        // const resultDelSTIRQProductCost = dataSTIRQProductCostDelete.recordset[0].RESULT;
        // if (resultDelSTIRQProductCost <= 0) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        // }

        // // Xoa du lieu bang ST_STOCKSINREQUESTREVIEWLIST
        // const requestDelSTIRQReview = new sql.Request(transaction);
        // const dataSTIRQReviewDelete = await requestDelSTIRQReview
        //     .input('STOCKSINREQUESTID', stocksInRequestId)
        //     .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //     .execute(PROCEDURE_NAME.ST_STOCKSIN_REVIEWLIST_DELETE_ADMINWEB);
        // const resultDelSTIRQReview = dataSTIRQReviewDelete.recordset[0].RESULT;
        // if (resultDelSTIRQReview <= 0) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        // }

        // // Them moi du lieu vao bang chi tiet nhap kho
        // let productListOrigin = apiHelper.getValueFromObject(bodyParams, 'products_list');
        // if (!productListOrigin || !productListOrigin.length) {
        //     await transaction.rollback();
        //     return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
        // }
        // const isImported = apiHelper.getValueFromObject(bodyParams, 'is_imported');

        // //Kiểm tra imei đã tồn tại trong database chưa
        // for (const item of productListOrigin) {
        //     if (item?.skus?.length > 0) {
        //         for (const iSku of item.skus) {
        //             const found = await checkImeiCodeInRequest({ imei: iSku?.sku });
        //             if (found.getData() === 1) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, `Imei “${iSku?.sku}” đã tồn tại.`);
        //             }
        //         }
        //     }
        // }


        // // Nhân số lượng product list và chuyển quantity về 1, để nhập từng dong đối với số lượng > 1
        // // Bao nhiu sku thi bấy nhiu chi tiết nhập kho
        // // Cac giá trị cần tính lại: total_price, total_price_cost, total_cost_basic_imei
        // let productList = productListOrigin.reduce((list, x, j) => {
        //     const { skus = [] } = x;
        //     if (skus.length > 0) {
        //         for (let i = 0; i < skus.length; i++) {
        //             list.push({
        //                 ...x,
        //                 total_price_cost: x.total_price_cost / x.quantity,
        //                 total_cost_basic_imei: x.total_cost_basic_imei / x.quantity,
        //                 order_index: j,
        //                 input_quantity: x.quantity,
        //                 quantity: x.quantity,
        //                 total_price: x.cost_price * 1,
        //                 // note: skus[i].note || '',
        //                 note: x?.note,
        //                 product_imei_code: skus[i].sku || '',
        //             });
        //         }
        //     } else {
        //         list.push({
        //             ...x,
        //             total_price_cost: x.total_price_cost / x.quantity,
        //             total_cost_basic_imei: x.total_cost_basic_imei / x.quantity,
        //             order_index: j,
        //             input_quantity: x.quantity,
        //             // quantity: 1,
        //             quantity: x.quantity,
        //             total_price: x.cost_price * 1,
        //             // note: skus[i].note || '',
        //             note: x?.note,
        //             product_imei_code: null,
        //         });
        //     }
        //     return list;
        // }, []);
        // //Thanh
        // const requestStocksOutOfComponent = new sql.Request(transaction);

        
        // let hasErrorTransfer = 0;
        // for (let i = 0; i < productList.length; i++) {
        //     const item = productList[i];

        //     let lotNumber = apiHelper.getValueFromObject(item, 'lot_number', '') + '';
        //     let productImeiCode = apiHelper.getValueFromObject(item, 'product_imei_code');

        //     const requestSTRIQDTCreate = new sql.Request(transaction);
        //     const dataSTIRQDTCreate = await requestSTRIQDTCreate // eslint-disable-line no-await-in-loop
        //         .input('STOCKSINREQUESTID', stocksInRequestId)
        //         .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
        //         .input('PRODUCTIMEICODE', productImeiCode)
        //         .input('ISMATERIAL', apiHelper.getValueFromObject(item, 'is_material'))
        //         .input('COSTPRICE', apiHelper.getValueFromObject(item, 'cost_price'))
        //         .input('TOTALPRICE', apiHelper.getValueFromObject(item, 'total_price'))
        //         .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
        //         // .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity') || 0)
        //         .input('LOTNUMBER', sql.VarChar(200), lotNumber)
        //         .input('TOTALCOSTBASICIMEI', apiHelper.getValueFromObject(item, 'total_cost_basic_imei'))
        //         .input('COSTBASICIMEICODE', apiHelper.getValueFromObject(item, 'cost_basic_imei_code'))
        //         .input('TOTALCOSTVALUE', apiHelper.getValueFromObject(item, 'cost'))
        //         .input('TOTALPRICECOST', apiHelper.getValueFromObject(item, 'total_price_cost'))
        //         .input('TOTALPRODUCTCOST', apiHelper.getValueFromObject(item, 'total_product_cost'))
        //         .input('COSTPERQUANTITY', apiHelper.getValueFromObject(item, 'cost_per_quantity'))
        //         .input('ISAUTOGENIMEI', apiHelper.getValueFromObject(item, 'is_auto_gen_imei'))
        //         .input('NOTE', apiHelper.getValueFromObject(item, 'note'))
        //         .input('ORDERINDEX', apiHelper.getValueFromObject(item, 'order_index'))
        //         .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //         .input('EXPECTEDDATE', apiHelper.getValueFromObject(item, 'expected_date'))
        //         .input('PURCHASEORDERDETAILID', apiHelper.getValueFromObject(item, 'purchase_order_detail_id'))
        //         .input('DEBTACCOUNTID', apiHelper.getValueFromObject(item, 'debt_account_id'))
        //         .input('CREDITACCOUNTID', apiHelper.getValueFromObject(item, 'credit_account_id'))
        //         .input('TAXACCOUNTID', apiHelper.getValueFromObject(item, 'tax_account_id'))
        //         .input('VATVALUE', apiHelper.getValueFromObject(item, 'vat_value'))
        //         .input('ACCOUNTINGID', apiHelper.getValueFromObject(item, 'accounting_id'))
        //         .input('STOCKSID', stocksId)
        //         .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_CREATE_ADMINWEB);
        //     const stocksInRequestDetailId = dataSTIRQDTCreate.recordset[0].RESULT;
        //     if (!!dataSTIRQDTCreate) {
        //         if (stocksInRequestDetailId <= 0) {
        //             await transaction.rollback();
        //             return new ServiceResponse(false, e.message);
        //         }
        //     }

        //     if (type_component === 2) {
        //         const requestCreateStocksDetail = new sql.Request(transaction);
        //         for (let i = 0; i < productList.length; i++) {
        //             const item = productList[i];

        //             let lotNumber = apiHelper.getValueFromObject(item, 'lot_number', '') + '';
        //             let productImeiCode = apiHelper.getValueFromObject(item, 'product_imei_code');

        //             // Neu la nhap kho và phiêu đã dc duyệt thi luu vao bang chi tiet kho
        //             // Nhap kho roi khong duoc chinh sua

        //             const dataCreateStocksDetail = await requestCreateStocksDetail // eslint-disable-line no-await-in-loop
        //                 .input('STOCKSINREQUESTID', stocksInRequestId)
        //                 .input('STOCKSINREQUESTDETAILID', stocksInRequestDetailId)
        //                 .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_id'))
        //                 .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
        //                 .input('ISMATERIAL', apiHelper.getValueFromObject(item, 'is_material'))
        //                 .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
        //                 .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
        //                 .input('LOTNUMBER', lotNumber)
        //                 .input('PRODUCTIMEICODE', productImeiCode)
        //                 .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //                 //.input('COSEBASICIMEICODEBASEUNIT', apiHelper.getValueFromObject(item, 'cost_per_quantity'))
        //                 // Kiêm tra xem số lượng nhập kho có lớn hơn xuất kho đối với chuyển kho
        //                 .input('REQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'request_code'))
        //                 .input('REQUESTID', apiHelper.getValueFromObject(bodyParams, 'request_id'))
        //                 .input('ISTRANSFER', apiHelper.getValueFromObject(bodyParams, 'is_transfer'))
        //                 .input('RECEIVERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //                 .execute(PROCEDURE_NAME.SL_STOCKSINREQUEST_STOCKSDETAIL_CREATEORUPDATE_ADMINWEB);

        //             const { RESULT = 0, ERR = 0, PRODUCTNAME = '' } = dataCreateStocksDetail.recordset[0] || {};

        //             if (ERR == 1) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, `Sản phẩm ${PRODUCTNAME} chưa được xuất kho.`);
        //             } else if (ERR == 2) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(
        //                     false,
        //                     `SỐ lượng nhập kho của sản phẩm ${PRODUCTNAME} vượt quá số lượng xuất kho.`,
        //                 );
        //             } else if (RESULT == 0) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, 'Nhập kho sản phẩm thất bại.');
        //             }
        //         }
        //     }

        //     // if (is_return_component === 1) {
        //     //     const dataStocksOutRequestOfComponent = await requestStocksOutOfComponent // eslint-disable-line no-await-in-loop
        //     //         .input('RQWAREPAIRCOMPONENTID', apiHelper.getValueFromObject(item, 'rq_wa_repair_component_id'))
        //     //         .input('STOCKSINREQUESTID', stocksInRequestId)
        //     //         .input('STOCKSINREQUESTDETAILID', stocksInRequestDetailId)

        //     //         .execute('RS_RQ_WARRANTY_REPAIR_COMPONENT_CreateOrUpdate_App');
        //     //     const resultOutComponent = dataStocksOutRequestOfComponent.recordset[0].RESULT;

        //     //     if (!resultOutComponent) {
        //     //         await transaction.rollback();
        //     //         return new ServiceResponse(false, 'lỗi tạo phiếu xuất kho cho linh kiện');
        //     //     }
        //     // }

        //     // Cap nhat lai productimei code
        //     productImeiCode = dataSTIRQDTCreate.recordset[0].PRODUCTIMEICODE;

        //     // Them moi chi phi ap dung neu co
        //     const costApplyList = apiHelper.getValueFromObject(item, 'cost_apply_list');
        //     if (costApplyList && costApplyList.length > 0) {
        //         for (let i = 0; i < costApplyList.length; i++) {
        //             const costApplyItem = costApplyList[i];
        //             const requestSTIRQDTCostCreate = new sql.Request(transaction);
        //             const dataSTIRQDTCostCreate = await requestSTIRQDTCostCreate // eslint-disable-line no-await-in-loop
        //                 .input('STOCKSINREQUESTID', stocksInRequestId)
        //                 .input('STOCKSINREQUESTDETAILID', stocksInRequestDetailId)
        //                 .input('COSTID', apiHelper.getValueFromObject(costApplyItem, 'cost_id'))
        //                 .input('COSTVALUE', apiHelper.getValueFromObject(costApplyItem, 'cost_value'))
        //                 //.input('ISACTIVE', apiHelper.getValueFromObject(costApplyItem, 'checked'))
        //                 .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //                 .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_COST_CREATEORUPDATE_ADMINWEB);
        //             const costId = dataSTIRQDTCostCreate.recordset[0].RESULT;
        //             if (!!dataSTIRQDTCostCreate) {
        //                 if (costId <= 0) {
        //                     await transaction.rollback();
        //                     return new ServiceResponse(false, e.message);
        //                 }
        //             }
        //         }
        //     }
        // }

        // // Luu bang chi phi cua nhap kho
        // const costTypeList = apiHelper.getValueFromObject(bodyParams, 'cost_type_list');
        // if (costTypeList && costTypeList.length) {
        //     for (let i = 0; i < costTypeList.length; i++) {
        //         const costTypeItem = costTypeList[i];
        //         const requestSTIRQCostCreate = new sql.Request(transaction);
        //         const dataSTIRQCostCreate = await requestSTIRQCostCreate // eslint-disable-line no-await-in-loop
        //             .input('STOCKSINREQUESTID', stocksInRequestId)
        //             .input('COSTID', apiHelper.getValueFromObject(costTypeItem, 'cost_id'))
        //             .input('COSTVALUE', apiHelper.getValueFromObject(costTypeItem, 'cost_value'))
        //             .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //             .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_COST_CREATEORUPDATE_ADMINWEB);
        //         const costId = dataSTIRQCostCreate.recordset[0].RESULT;
        //         if (!!dataSTIRQCostCreate) {
        //             if (costId <= 0) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, e.message);
        //             }
        //         }
        //     }
        // }

        // //Luu bang muc duyet
        // const reviewLevelList = apiHelper.getValueFromObject(bodyParams, 'review_level_list');
        // if (reviewLevelList && reviewLevelList.length) {
        //     for (let i = 0; i < reviewLevelList.length; i++) {
        //         const reviewLevelItem = reviewLevelList[i];
        //         const isAutoReviewed = apiHelper.getValueFromObject(reviewLevelItem, 'is_auto_reviewed');
        //         const requestSTIRQReviewCreate = new sql.Request(transaction);
        //         const dataSTIRQReviewCreate = await requestSTIRQReviewCreate
        //             .input('STOCKSINREQUESTID', stocksInRequestId)
        //             .input(
        //                 'STOCKSREVIEWLEVELID',
        //                 apiHelper.getValueFromObject(reviewLevelItem, 'stocks_review_level_id'),
        //             )
        //             .input(
        //                 'ISREVIEWED',
        //                 isAutoReviewed
        //                     ? isAutoReviewed
        //                     : apiHelper.getValueFromObject(reviewLevelItem, 'is_reviewed', 2), //2: Đang đợi duyệt
        //             )
        //             .input(
        //                 'ISCOMPLETEDREVIEWED',
        //                 apiHelper.getValueFromObject(reviewLevelItem, 'is_completed_reviewed'),
        //             )
        //             .input('REVIEWUSER', apiHelper.getValueFromObject(reviewLevelItem, 'review_user'))
        //             .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //             .execute(PROCEDURE_NAME.ST_STOCKSIN_REVIEWLIST_CREATEORUPDATE_ADMINWEB);
        //         const reviewLevelId = dataSTIRQReviewCreate.recordset[0].RESULT;
        //         if (!!dataSTIRQReviewCreate) {
        //             if (reviewLevelId <= 0) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, e.message);
        //             }
        //         }
        //     }
        // }

        // if (reviewLevelList.length == 0) {
        //     //load hết DO lên
        //     // const data1 = await pool.request().input('PageSize', 99999999).execute('SL_PURCHASEORDER_GetList_AdminWeb');
        //     // let list = purchaseOrdersClass.list(data1.recordsets[1]);
        //     // for (let i = 0; i < list.length; i++) {
        //     //     // Kiểm tra xem DO nào ứng với stock_request_selected
        //     //     if (!list[i].request_purchase_code) {
        //     //         const select = await pool
        //     //             .request()
        //     //             .input('PURCHASEORDERID', list[i].purchase_order_id)
        //     //             .execute('SL_PURCHASEORDER_PO_GetInfoByID_AdminWeb');
        //     //         const rs = select.recordset;
        //     //         const info = purchaseOrdersClass.informapping(rs);
        //     //         const _infor = info.map(x=>x.request_purchase_code).join(', ')
        //     //         if(bodyParams?.request_code == _infor){
        //     //         //Update lại trạng thái  DO
        //     //             const data1 = await pool
        //     //             .request()
        //     //             .input('PURCHASEORDERID', list[i]?.purchase_order_id)
        //     //             .input('STOCKSINREQUESTID', stocksInRequestId)
        //     //             .execute('ST_STOCKSIN_REVIEWLIST_Approved_BY_BE_AdminWeb');
        //     //         console.log(">>> check",productList );
        //     //         //update lại trạng thái của product in PO
        //     //             for (let j = 0; j < productList.length; j++) {
        //     //                 const createOrUpdateDetail = new sql.Request(transaction);
        //     //                 const createOrUpdateDetailRes = await createOrUpdateDetail
        //     //                     .input(
        //     //                         'PURCHASEORDERREQUESTDETAILID',
        //     //                         apiHelper.getValueFromObject(productList[j], 'purchase_order_detail_id', null),
        //     //                     )
        //     //                     .input('WAREHOUSEDQUANTITY', apiHelper.getValueFromObject(productList[j], 'input_quantity', 1))
        //     //                     .input('DIVIDEDQUANTITY', null)
        //     //                     .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //     //                     .execute('SL_PURCHASEORDER_DETAIL_CreateOrUpdate_AdminWeb');
        //     //                 const purchaseRequisitionDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
        //     //                 if (purchaseRequisitionDetailId <= 0) {
        //     //                     await transaction.rollback();
        //     //                     throw new ServiceResponse(false, 'Lỗi cập nhật chi tiết đơn mua hàng');
        //     //                 }
        //     //             }
        //     //         }
        //     //     }
        //     // }
        // }

        // // Luu bang chi phi san pham  nhap kho
        // const productApplyCostList = apiHelper.getValueFromObject(bodyParams, 'product_apply_cost');
        // if (productApplyCostList && productApplyCostList.length) {
        //     for (let i = 0; i < productApplyCostList.length; i++) {
        //         const productApplyCostItem = productApplyCostList[i];
        //         const requestSTIRQProductCostCreate = new sql.Request(transaction);
        //         const dataSTIRQProductCostCreate = await requestSTIRQProductCostCreate // eslint-disable-line no-await-in-loop
        //             .input('STOCKSINREQUESTID', stocksInRequestId)
        //             .input('PRODUCTID', apiHelper.getValueFromObject(productApplyCostItem, 'productid'))
        //             .input('EXCHANGEUNITID', apiHelper.getValueFromObject(productApplyCostItem, 'unit_id'))
        //             .input(
        //                 'EXCHANGEQUANTITY',
        //                 apiHelper.getValueFromObject(productApplyCostItem, 'total_product_quantity'),
        //             )
        //             .input('COSTPERQUANTITY', apiHelper.getValueFromObject(bodyParams, 'cost_per_quantity'))
        //             .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //             .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_PRODUCTCOST_CREATEORUPDATE_ADMINWEB);
        //         const productCostId = dataSTIRQProductCostCreate.recordset[0].RESULT;
        //         if (!!dataSTIRQProductCostCreate) {
        //             if (productCostId <= 0) {
        //                 await transaction.rollback();
        //                 return new ServiceResponse(false, e.message);
        //             }
        //         }
        //     }
        // }
        // const stocksTransferCode = apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_code');
        // if (stocksTransferCode && isImported === 1) {
        //     // update stocks transfer
        //     const requestDataUpdate = new sql.Request(transaction);
        //     const dataUpdate = await requestDataUpdate
        //         .input('STOCKSTRANSFERCODE', stocksTransferCode)
        //         .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //         .input('ERRORTRASNFER', hasErrorTransfer)
        //         .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_STOCKSTRANSFER_UPDATE_ADMINWEB);
        //     const resultUpdate = dataUpdate.recordset[0].RESULT;
        //     if (resultUpdate <= 0) {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
        //     }
        // }

        // if (type_component === 2) {
        //     const requestDataExport = new sql.Request(transaction);
        //     const dataExportRes = await requestDataExport
        //         .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
        //         .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //         .input('STOCKSOUTTYPE', 3)
        //         .execute('RS_RQ_WARRANTY_REPAIR_GetDataToExportStocks');

        //     let resExport = dataExportRes.recordset[0];

        //     let resOutRequestCode = await stocksOutRequestGenCode();
        //     if (resOutRequestCode.isFailed()) {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, 'Gen mã code xuất kho thất bại !');
        //     }
        //     let genStocksOutRequestCode = resOutRequestCode.getData();

        //     let dataExport = {
        //         stocks_out_request_id: null,
        //         stocks_out_request_code: genStocksOutRequestCode.stocks_out_request_code,
        //         from_stocks_id: stocksId,
        //         department_request_id: resExport.DEPARTMENTREQUESTID,
        //         business_request_id: resExport.BUSINESSREQUESTID,
        //         store_request_id: apiHelper.getValueFromObject(bodyParams, 'store_id'),
        //         request_user: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
        //         component_list: [
        //             {
        //                 component_imei_code: productList[0].product_imei_code,
        //                 component_id: productList[0].product_id,
        //                 quantity: 1,
        //                 total_price: productList[0].total_price,
        //                 total_price_cost: 0,
        //                 cost_basic_imei_code: 0,
        //                 total_cost_basic_imei: 0,
        //                 cost_price: 0,
        //             },
        //         ],
        //         request_id: apiHelper.getValueFromObject(bodyParams, 'request_id'),
        //         request_code: apiHelper.getValueFromObject(bodyParams, 'request_code'),
        //         stocks_out_type_id: resExport.STOCKSOUTTYPEID,
        //         auth_name: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
        //         member_id: apiHelper.getValueFromObject(bodyParams, 'member_id'),
        //         is_component_replace: 1,
        //     };
        //     const dataStocksOutRequestReturn = await createStocksOutRequestOrUpdate(dataExport);
        //     if (dataStocksOutRequestReturn.isFailed()) {
        //         await transaction.rollback();
        //         return new ServiceResponse(false, 'Tạo phiếu xuất thất bại !');
        //     }
        // }
        
        // await transaction.commit();
        // return new ServiceResponse(true, 'ok', stocksInRequestId);
        return new ServiceResponse(true, 'ok', '');
    } catch (e) {
        // console.log(e);
        // await transaction.rollback();
        logger.error(e, {
            function: 'stocksInRequestService.createOrUpdateStocksInRequest',
        });
        return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
    }
};

const createStocksOutRequestOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const stocks_out_request_id = apiHelper.getValueFromObject(bodyParams, 'stocks_out_request_id');
        const stocks_out_type_id = apiHelper.getValueFromObject(bodyParams, 'stocks_out_type_id');
        const list_review = await (await getListReviewLevelByStocksOutypeId({ stocks_out_type_id })).getData();

        // Create or update stocks out request
        const requestCreateOrUpdateSTORQ = new sql.Request(transaction);
        const data = await requestCreateOrUpdateSTORQ
            .input('STOCKSOUTREQUESTID', stocks_out_request_id)
            .input('STOCKSOUTREQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'stocks_out_request_code'))
            .input('STOCKSOUTTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_out_type_id'))
            .input('FROMSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'from_stocks_id'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('ISOUTPUTTED', 0)
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('ISREVIEWED', 2)
            .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(bodyParams, 'business_request_id'))
            .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(bodyParams, 'department_request_id'))
            .input('FROMSTOREID', apiHelper.getValueFromObject(bodyParams, 'store_request_id'))
            .input('REQUESTUSER', apiHelper.getValueFromObject(bodyParams, 'request_user'))
            .input('REQUESTID', apiHelper.getValueFromObject(bodyParams, 'request_id'))
            .input('REQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'request_code'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .execute('ST_STOCKSOUTREQUEST_CreateOrUpdateComponent_App');

        const stocksOutRequestId = data.recordset[0].RESULT;
        if (list_review && list_review.length > 0) {
            for (let i = 0; i < list_review.length; i++) {
                let item = list_review[i];
                const dataReview = await pool
                    .request() // eslint-disable-line no-await-in-loop
                    .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                    .input(
                        'STOCKSOUTREVIEWLISTID',
                        apiHelper.getValueFromObject(item, 'stocks_out_review_list_id', null),
                    )
                    .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(item, 'stocks_review_level_id', null))
                    .input('USERNAME', apiHelper.getValueFromObject(item, 'user_name', null))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .input('ISREVIEWED', apiHelper.getValueFromObject(item, 'is_reviewed', null))
                    .execute('ST_STOCKSOUT_REVIEWLIST_CreateOrUpdate_AdminWeb');

                if (!dataReview.recordset[0].RESULT) {
                    return new ServiceResponse(false, 'Lỗi lưu người duyệt');
                }
            }
        }

        const component_list = apiHelper.getValueFromObject(bodyParams, 'component_list');
        if (component_list && component_list.length > 0) {
            let componentList = component_list.reduce((list, x, j) => {
                const { quantity } = x;
                for (let i = 0; i < Number(quantity); i++) {
                    list.push({
                        ...x,
                        quantity: 1,
                    });
                }
                return list;
            }, []);

            const requestStocksOutRequestListCreate = new sql.Request(transaction);
            const requestStocksOutOfComponent = new sql.Request(transaction);
            if (componentList && componentList.length > 0) {
                for (let j = 0; j < componentList.length; j++) {
                    let item = componentList[j];

                    const dataStocksOutRequestListCreate = await requestStocksOutRequestListCreate // eslint-disable-line no-await-in-loop
                        .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                        .input('COMPONENTID', apiHelper.getValueFromObject(item, 'component_id'))
                        .input('PRICE', apiHelper.getValueFromObject(item, 'price'))
                        .input('QUANTITY', Number(componentList.length))
                        .input('LOTNUMBER', apiHelper.getValueFromObject(item, 'lot_number'))
                        .input('VATAMOUNT', 1 * apiHelper.getValueFromObject(item, 'total_vat', 0))
                        .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'from_stocks_id') * 1)
                        .input('COMPONENTIMEICODE', apiHelper.getValueFromObject(item, 'component_imei_code') || null)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute('ST_STOCKSOUTREQUEST_CreateOrUpdateDetailComponent_App');
                    const stocksOutRequestDetail = dataStocksOutRequestListCreate.recordset[0];

                    const {
                        ISVALIDSTOCK = 0,
                        RESULT = 0,
                        COMPONENTNAME: component_name = '',
                        COMPONENTCODE: component_code = '',
                    } = stocksOutRequestDetail || {};

                    if (!ISVALIDSTOCK) {
                        // KL/SL xuat kho khong du
                        await transaction.rollback();
                        return new ServiceResponse(
                            false,
                            `SL xuất kho của linh kiện <b>${component_code}-${component_name}</b> lớn hơn SL còn lại trong kho.`,
                            null,
                        );
                    }
                    if (RESULT <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, e.message);
                    }

                    // const dataStocksOutRequestOfComponent = await requestStocksOutOfComponent // eslint-disable-line no-await-in-loop
                    //     .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                    //     .input('REQUESTID', apiHelper.getValueFromObject(bodyParams, 'request_id'))
                    //     .input('STOCKSOUTID', apiHelper.getValueFromObject(bodyParams, 'from_stocks_id'))
                    //     .input('ISCOMPONENTREPLACE', apiHelper.getValueFromObject(bodyParams, 'is_component_replace', 0))
                    //     .input('ISCOMPONENTTEST', apiHelper.getValueFromObject(bodyParams, 'is_component_test', 0))
                    //     .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    //     .input('COMPONENTID', apiHelper.getValueFromObject(item, 'component_id'))
                    //     .input('STOCKSOUTREQUESTDETAILID', RESULT)
                    //     .execute('RS_RQ_WARRANTY_REPAIR_COMPONENT_CreateOrUpdate_App');
                    // const resultOutComponent = dataStocksOutRequestOfComponent.recordset[0].RESULT;

                    // if (!resultOutComponent) {
                    //     await transaction.rollback();
                    //     return new ServiceResponse(false, 'lỗi tạo phiếu xuất kho cho linh kiện');
                    // }
                }
            }
        }

        if (stocksOutRequestId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSOUTREQUEST.CREATE_FAILED);
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Tạo yêu cầu thành công', stocksOutRequestId);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'requestService.createOrUpdateStocksOutRequest' });
        return new ServiceResponse(false, e.message);
    }
};

const genStocksInCodeStocks = async (stocks_in_type) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSINTYPE', stocks_in_type)
            .output('RETURNCODE', null)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GEN_STOCKSINCODE_ADMINWEB);
        let StocksInCode = data.recordset;

        if (StocksInCode && StocksInCode.length > 0) {
            StocksInCode = stocksInRequestClass.genStocksInCode(StocksInCode[0]);
            return new ServiceResponse(true, '', StocksInCode);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.genStocksInCodeStocks',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getPhoneNumber = async (driver_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DRIVERID', driver_id)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETPHONENUMBER_ADMINWEB);
        let phoneNumber = data.recordset;
        if (phoneNumber && phoneNumber.length > 0) {
            phoneNumber = stocksInRequestClass.phoneNumber(phoneNumber[0]);
            return new ServiceResponse(true, '', phoneNumber);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.getPhoneNumber' });
        return new ServiceResponse(false, e.message);
    }
};

const genProductName = async (product_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', product_id)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETPRODUCTNAME_ADMINWEB);
        let StocksInRequest = data.recordset;
        if (StocksInRequest && StocksInRequest.length > 0) {
            StocksInRequest = stocksInRequestClass.genProductName(StocksInRequest[0]);
            // if(data.recordsets[1] ) StocksInRequest.manufacturer_apply_density = data.recordsets[1].map(({ID}) => ID);
            return new ServiceResponse(true, '', StocksInRequest);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.genProductName' });
        return new ServiceResponse(false, e.message);
    }
};

const getUnitList = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETUNITBYPRODUCTID_ADMINWEB);
        let UnitList = data.recordset;
        return new ServiceResponse(true, '', {
            data: stocksInRequestClass.listUnitFull(UnitList),
        });
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.getUnitList' });
        return new ServiceResponse(false, e.message);
    }
};

// export
const exportPDF = async (queryParams = {}) => {
    try {
        const stocksInRequestId = apiHelper.getValueFromObject(queryParams, 'stocks_in_request_id');
        // Lấy thông tin công ty của kho nhập
        const detailRes = await detailToPrint(stocksInRequestId);

        if (detailRes.isFailed()) return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
        let detail = detailRes.getData();
        const { stocks_id } = detail;
        let company = { company_name: '', address_full: '', phone_number: '', email: '', tax: '' };
        if (stocks_id) {
            const companyRes = await getCompanyByStockId(stocks_id);
            if (companyRes.isSuccess()) {
                company = companyRes.getData();
            }
        }
        // Asign company
        detail.company = company;
        const templatePrint = getTemplateExport(detail);
        detail = { ...detail };
        const fileName = `Phieu_nhap_${moment().format('DDMMYYYY')}_${stocksInRequestId}`;

        const print_params = {
            template: `${templatePrint}`,
            data: detail,
            filename: fileName,
        };

        await pdfHelper.printPDF(print_params);

        // if (templatePrint == 'inventory-control') {
        //     const print_params = {
        //         template: `${templatePrint}`,
        //         data: detail,
        //         filename: fileName,

        //     }

        //     await pdfHelper.printPDF(print_params);

        //     await pdfHelper.createStocksTransfer(`${templatePrint}`, detail, fileName);
        // } else {
        //     await pdfHelper.create(`${templatePrint}`, detail, fileName);
        // }
        return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.exportPDF' });
        return new ServiceResponse(false, e.message || e);
    }
};

const getTemplateExport = (stocks) => {
    let templatePrint = 'purchase.html';
    if (1 * stocks.is_purchase === 1 || 1 * stocks.is_internal === 1) {
        stocksInType = 2;
    }
    if (1 * stocks.is_transfer === 1) {
        templatePrint = 'transfer.html';
    }
    if (1 * stocks.is_inventory_control === 1) {
        templatePrint = 'inventory-control.html';
    }
    if (1 * stocks.is_exchange_goods === 1) {
        templatePrint = 'returned-goods.html';
    }
    return templatePrint;
};

const getCompanyByStockId = async (stockId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', stockId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETCOMPANYBYSTOCKSID_ADMINWEB);
        if (!data.recordset.length) return new ServiceResponse(true, '', null);
        const company = stocksInRequestClass.company(data.recordset[0]);
        return new ServiceResponse(true, 'ok', company);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.genLotNumber',
        });
        return new ServiceResponse(true, '', null);
    }
};

const genLotNumber = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GENLOTNUMBER_ADMINWEB);
        let LotNumber = data.recordset;

        if (LotNumber && LotNumber.length > 0) {
            LotNumber = stocksInRequestClass.genLotNumber(LotNumber[0]);
            return new ServiceResponse(true, '', LotNumber);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.genLotNumber',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getDiscount = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('ID', 1 * apiHelper.getValueFromObject(bodyParams, 'id'))
            .input('TYPE', apiHelper.getValueFromObject(bodyParams, 'type'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETDISCOUNT_ADMINWEB);
        let Discount = data.recordset;

        if (Discount && Discount.length > 0) {
            Discount = stocksInRequestClass.getDiscount(Discount[0]);
            return new ServiceResponse(true, '', Discount);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getDiscount',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOutputStatus = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTRANSFERCODE', apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_code'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_CHECKOUTPUTSTATUS_ADMINWEB);
        let statusOutput = data.recordset;
        if (statusOutput && statusOutput.length > 0) {
            statusOutput = stocksInRequestClass.statusOutput(statusOutput[0]);
            return new ServiceResponse(true, '', statusOutput);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOutputStatus',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getUnitPriceList = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'))
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(bodyParams, 'product_imei_code'))
            .execute(PROCEDURE_NAME.ST_PRODUCTIMEICODE_COST_GETBYID_ADMINWEB);

        let dataUnitPrice = data.recordset;
        if (dataUnitPrice && dataUnitPrice.length > 0) {
            dataUnitPrice = stocksInRequestClass.dataUnitPrice(dataUnitPrice);
            return new ServiceResponse(true, '', dataUnitPrice);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getUnitPriceList',
        });
        return new ServiceResponse(false, e.message);
    }
};

const changeUnitPrice = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        let costTypeList = apiHelper.getValueFromObject(bodyParams, 'cost_type_list');
        let newArrCostTypeList = [];
        if (costTypeList && costTypeList.length) {
            for (let i = 0; i < costTypeList.length; i++) {
                newArrCostTypeList.push(JSON.parse(costTypeList[i]));
            }
        }
        // remove table ST_PRODUCTIMEICODE_COST
        const dataProductImeiCodeCostDelete = await pool
            .request()
            .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'))
            .input('PRODUCTIMEICODE', apiHelper.getValueFromObject(bodyParams, 'product_imei_code'))
            .execute(PROCEDURE_NAME.ST_PRODUCTIMEICODE_COST_DELETEBYPRODUCTIMEICODE_ADMINWEB);
        const resultDeleteProductImeiCodeCost = dataProductImeiCodeCostDelete.recordset[0].RESULT;
        if (resultDeleteProductImeiCodeCost <= 0) {
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        }

        let arrResult = [];
        if (newArrCostTypeList && newArrCostTypeList.length) {
            for (let j = 0; j < newArrCostTypeList.length; j++) {
                let item = newArrCostTypeList[j];
                const data = await pool
                    .request()
                    .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'))
                    .input('STOCKSINDETAILID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_detail_id'))
                    .input('COSTPRODUCTIMEICODEID', apiHelper.getValueFromObject(item, 'cost_product_imei_code_id'))
                    .input(
                        'PRODUCTIMEICODE',
                        sql.VarChar(200),
                        apiHelper.getValueFromObject(bodyParams, 'product_imei_code', ''),
                    )
                    .input('PRODUCTID', apiHelper.getValueFromObject(bodyParams, 'product_id'))
                    .input('COSTID', apiHelper.getValueFromObject(item, 'value'))
                    .input('COSTVALUE', apiHelper.getValueFromObject(item, 'cost_value'))
                    .input('ISAPPLY', 1 * apiHelper.getValueFromObject(item, 'is_apply'))
                    .input('DESCRIPTION', apiHelper.getValueFromObject(item, 'descriptions'))
                    .execute(PROCEDURE_NAME.ST_PRODUCTIMEICODE_COST_CREATE_ADMINWEB);
                const costProductImeiCostUd = data.recordset[0].RESULT;

                if (!!data) {
                    if (costProductImeiCostUd <= 0) {
                        return new ServiceResponse(false, e.message);
                    }
                }
                arrResult.push(costProductImeiCostUd);
            }
        }
        return new ServiceResponse(true, 'update success', arrResult);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.changeUnitPrice',
        });
        return new ServiceResponse(false, e.message);
    }
};

const readExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const stocksId = apiHelper.getValueFromObject(bodyParams, 'stocks_id');
        // Lay danh sach sản phẩm, số lô và tổng số đã nhập
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETINITIMPORTEXCEL_ADMINWEB);
        let products = data && data.recordset ? stocksInRequestClass.productExcel(data.recordset) : [];
        const lot_number = data && data.recordsets[1] ? data.recordsets[1][0].LOTNUMBER : '';
        let total_product_code = data && data.recordsets[2] ? data.recordsets[2][0].TOTALPRODUCTIMEICODE : 0;
        const units = data && data.recordsets[3] ? stocksInRequestClass.productUnitExcel(data.recordsets[3]) : [];

        // Đọc file excel
        const rows = await readXlsxFile(pathUpload);
        let product_list = [];
        let errors_list = [];
        // Chứa các tham số cần thiết như ds đơn vị quy đổi, ds đơn vị
        for (i in rows) {
            // Bỏ qua dòng tiêu đề đầu
            if (i > 0 && rows[i][1]) {
                const product_code = `${rows[i][1] || ''}`.trim();

                // Tìm sản phẩm có đúng với mã sản phẩm khai báo hay không
                const product = (products || []).find((v) => v.product_code === product_code);
                if (!product)
                    errors_list.push({
                        index: i,
                        content: `Mã sản phẩm ${product_code} không tồn tại`,
                    });

                if (product) {
                    const unit = (units || []).find((v) => v.slug == changeToSlug(`${rows[i][3]}`));
                    const quantity = parseFloat(`${rows[i][4] || 0}`);
                    let cost_price = parseFloat(`${rows[i][5] || 0}`);
                    let total_price = parseFloat(`${rows[i][6] || 0}`);
                    let is_component = `${rows[i][7] || 0}`.trim();
                    let cost_basic_imei_code = 0; // don gia von
                    let total_cost_basic_imei = 0; // thanh tien don gia von

                    if (!cost_price && total_price) {
                        cost_price = parseFloat(Number(total_price / (quantity || 1)).toFixed(3));
                    }
                    if (!total_price && cost_price) {
                        total_price = parseFloat(Number(cost_price * (quantity || 1)).toFixed(3));
                    }

                    if (cost_price) {
                        cost_basic_imei_code = cost_price;
                    }
                    if (cost_basic_imei_code) {
                        total_cost_basic_imei = parseFloat(Number(cost_price * (quantity || 1)).toFixed(3));
                    }

                    // Tao mã sản phẩm ở đây (skus)
                    let skus = [];
                    for (let i = 0; i < quantity; i++) {
                        const sku = buildSku(stocksId, total_product_code);
                        skus.push({ id: total_product_code, sku });
                        total_product_code++;
                    }
                    product_list.push({
                        ...product,
                        ...{
                            lot_number,
                            quantity,
                            total_price,
                            cost_price,
                            cost_basic_imei_code,
                            total_cost_basic_imei,
                            unit_id: unit?.id || product?.unit_id,
                            unit_name: unit?.name || product?.unit_name,
                            is_component,
                            _k: product?.product_id,
                            skus,
                        },
                    });
                }
            }
        }
        return new ServiceResponse(true, '', { product_list, errors_list });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.readExcel',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getInit = async (reqParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('ST_STOCKSINREQUEST_GetInitialValue_AdminWeb');
        const total_product_imei_code =
            data && data.recordsets[1] && data.recordsets[1].length ? data.recordsets[1][0].TOTALPRODUCTIMEICODE : 0;

        return new ServiceResponse(true, '', { total_product_imei_code });
    } catch (e) {
        console.log(e);
        logger.error(e, {
            function: 'stocksInRequestService.getInit',
        });
        return new ServiceResponse(false, e.message);
    }
};

// NEW STOCKSINREQUEST
const getProductOptions = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTCODE', apiHelper.getValueFromObject(bodyParams, 'product_code'))
            .input('PRODUCTNAME', apiHelper.getValueFromObject(bodyParams, 'product_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETPRODUCTOPTIONS_ADMINWEB);
        const products = stocksInRequestClass.productOptions(data.recordset);
        return new ServiceResponse(true, '', products);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getProductOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getProductInit = async (product_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTID', product_id)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETPRODUCTINIT_ADMINWEB);

        const unit = stocksInRequestClass.productUnit(data.recordset[0]);
        // const subunits = stocksInRequestClass.productUnitDensity(data.recordsets[1]);
        let unit_list = {};
        if (unit) unit_list[unit.unit_id] = unit;

        unit_list = Object.values(unit_list).map(({ unit_id, unit_name }) => ({
            id: unit_id,
            name: unit_name,
            value: unit_id,
            label: unit_name,
            unit_name,
            unit_id,
        }));
        return new ServiceResponse(true, '', { product: unit, unit_list });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getProductInit',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getStocksInTypeOptions = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETSTOCKSINTYPEOPTIONS_ADMINWEB);
        const stocksInType = stocksInRequestClass.stocksInTypeOptions(data.recordset);
        return new ServiceResponse(true, '', stocksInType);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getStocksInTypeOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const exportExcel = async (queryParams = {}) => {
    queryParams.itemsPerPage = String(API_CONST.MAX_EXPORT_EXCEL);
    let serviceRes = await getListStocksInRequest(queryParams);

    const { data } = serviceRes.getData();

    let wb = new xl.Workbook({
        defaultFont: {
            name: 'Times New Roman',
        },
    });

    // Add Worksheets to the workbook
    const ws = wb.addWorksheet('NHẬP KHO', {});

    // Set height header
    ws.row(1).setHeight(10);
    ws.row(2).setHeight(23);
    ws.row(3).setHeight(23);
    ws.row(4).setHeight(23);
    ws.row(5).setHeight(23);
    ws.row(6).setHeight(23);

    // Set width data
    ws.column(1).setWidth(10);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(30);
    ws.column(6).setWidth(20);

    // Khai báo header
    let header = {
        stocks_in_code: 'Số phiếu nhập',
        stocks_in_type_name: 'Hình thức phiếu nhập',
        stocks_name: 'Kho nhập',
        created_user: 'Người lập',
        stocks_in_request_status: 'Trạng thái',
    };

    const countHeader = 6;

    data.unshift(header);

    //options style
    const ColumnsRows = wb.createStyle({
        font: {
            color: 'black',
            size: 16,
            bold: true,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#FFFFFF',
            fgColor: '#FFFFFF',
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const ColumnsRowDate = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
            bold: true,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center',
        },
    });

    const ColumnsRowValueDate = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const ColumnsRowTotalMoney = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    const borderThin = {
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        },
    };

    ws.cell(1, 1, 1, countHeader, true);
    ws.cell(2, 1, 2, countHeader, true).string('NHẬP KHO').style(ColumnsRows);
    ws.cell(3, 1, 3, countHeader, true)
        .string(
            (
                moment().format('h:mm A') +
                ' - ' +
                ' Ngày ' +
                moment().format('DD') +
                ' tháng ' +
                moment().format('MM') +
                ' năm ' +
                moment().format('YYYY')
            ).toString(),
        )
        .style(ColumnsRowTotalMoney);

    data.forEach((item, index) => {
        let indexRow = index + 4;
        let indexCol = 0;
        if (index === 0) {
            ws.row(indexRow).setHeight(30);
            ws.cell(indexRow, ++indexCol).string('STT').style(ColumnsRowDate).style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_in_code || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_in_type_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_name || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.created_user || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            ws.cell(indexRow, ++indexCol)
                .string((item.stocks_in_request_status || '').toString())
                .style(ColumnsRowDate)
                .style(borderThin);
            return;
        }
        ws.row(indexRow).setHeight(40);
        ws.cell(indexRow, ++indexCol).number(index).style(ColumnsRowValueDate).style(borderThin);
        ws.cell(indexRow, ++indexCol)
            .string((item.stocks_in_code || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.stocks_in_type_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.stocks_name || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.created_user || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
        ws.cell(indexRow, ++indexCol)
            .string((item.stocks_in_request_status || '').toString())
            .style(ColumnsRowValueDate)
            .style(borderThin)
            .style({ alignment: { horizontal: 'left' } });
    });

    return new ServiceResponse(true, '', wb);
};
const getOptionsUserRequest = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETOPTIONSUSERREQUEST_ADMINWEB);
        const users = stocksInRequestClass.listUser(data.recordset);
        return new ServiceResponse(true, '', users);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptionsUserRequest',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptsProductCode = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PRODUCTCODE', apiHelper.getValueFromObject(bodyParams, 'product_code'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETOPTIONSPRODUCTCODE_ADMINWEB);
        const products = stocksInRequestClass.productOptions(data.recordset);
        return new ServiceResponse(true, '', products);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptsProductCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsStocksReviewLevel = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSINTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_type_id'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETOPTIONSSTOCKSREVIEWLEVEL_ADMINWEB);
        let reviewLevel = stocksInRequestClass.listReviewLevel(data.recordsets[0]);
        let reviewUser = stocksInRequestClass.listReviewUser(data.recordsets[1]);

        reviewLevel = (reviewLevel || []).map((r) => {
            let list_user = reviewUser.filter((u) => u.stocks_in_type_rl_id == r.stocks_in_type_rl_id);
            return { ...r, list_user };
        });
        return new ServiceResponse(true, '', reviewLevel);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptionsStocksReviewLevel',
        });
        return new ServiceResponse(false, e.message);
    }
};
const approvedReview = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'))
            .input('STOCKSREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'stocks_review_level_id'))
            .input('REVIEWUSER', apiHelper.getValueFromObject(bodyParams, 'review_user'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(bodyParams, 'is_reviewed'))
            .input('ISCOMPLETEDREVIEWED', apiHelper.getValueFromObject(bodyParams, 'is_completed_reviewed'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(bodyParams, 'review_note'))
            .input('CREATEDUSER', bodyParams.auth_name)
            .execute(PROCEDURE_NAME.ST_STOCKSIN_REVIEWLIST_APPROVED_ADMINWEB);

        // const is_reviewed = apiHelper.getValueFromObject(bodyParams, 'is_reviewed');
        // if(is_reviewed === 1){
        //      // lấy thông tin của  stock_in_request
        // const res = await detailStocksInRequest(apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'));
        // const stock_request_selected = res.getData();
        // //load hết DO lên
        // const data1 = await pool
        // .request()
        // .input('PageSize', 99999999)
        // .execute('SL_PURCHASEORDER_GetList_AdminWeb');
        // let list = purchaseOrdersClass.list(data1.recordsets[1]);

        // for(let i = 0 ; i < list.length; i ++){ // Kiểm tra xem DO nào ứng với stock_request_selected
        //     if(!list[i].request_purchase_code){
        //         const select = await pool
        //         .request()
        //         .input('PURCHASEORDERID',list[i].purchase_order_id)
        //         .execute('SL_PURCHASEORDER_PO_GetInfoByID_AdminWeb');
        //         const rs = select.recordset;
        //         const info = purchaseOrdersClass.informapping(rs);
        //         const _infor = info.map(x=>x.request_purchase_code).join(', ')
        //         if(stock_request_selected?.request_code == _infor){
        //         //Update lại trạng thái  DO
        //             const data1 = await pool
        //             .request()
        //             .input('PURCHASEORDERID', list[i]?.purchase_order_id)
        //             .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'))
        //             .execute('ST_STOCKSIN_REVIEWLIST_Approved_BY_BE_AdminWeb');

        //     }
        //     }
        // }
        // }

        let result = data.recordset[0].RESULT;

        switch (result) {
            case 1:
                return new ServiceResponse(true, 'Approved successed.');
            case 0:
                return new ServiceResponse(false, 'Approved failed.', { reason: 'Mức duyệt đã được duyệt.' });
            case -1:
                return new ServiceResponse(false, 'Approved failed.', { reason: 'Mức duyệt không tồn tại.' });
            default:
                return new ServiceResponse(false, 'Approved failed.', { reason: 'Unknown' });
        }
    } catch (e) {
        logger.error(e, { function: 'stocksInRequestService.approvedReview' });
        return new ServiceResponse(false, e.message);
    }
};
const getOptionsCustomer = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input(
                'KEYWORD',
                apiHelper.getValueFromObject(bodyParams, 'keyword') ??
                apiHelper.getValueFromObject(bodyParams, 'search'),
            )
            .execute('ST_STOCKSINREQUEST_GetOptionsCustomer_AdminWeb');
        const customer = stocksInRequestClass.listUser(data.recordset);
        return new ServiceResponse(true, '', customer);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptionsCustomer',
        });
        return new ServiceResponse(false, e.message);
    }
};

const downloadExcel = async () => {
    try {
        //Đơn vị tính
        const serviceUnit = await unitService.getListUnit({ itemsPerPage: 100 });
        let { data: dataUnit } = serviceUnit.getData();

        // Create a new instance of a Workbook class
        const wb = new xl.Workbook();
        const headerStyle = wb.createStyle({
            font: {
                bold: true,
                color: 'FFFFFF',
            },
            alignment: {
                horizontal: 'center',
            },
            fill: {
                type: 'pattern', // the only one implemented so far.
                patternType: 'solid', // most common.
                fgColor: '#0e99cd',
            },
        });

        const columnStyle = wb.createStyle({
            alignment: {
                horizontal: 'center',
            },
        });
        // Add Worksheets SẢN PHẨM
        const ws_1 = wb.addWorksheet('DANH SÁCH NHẬP KHO');
        ws_1.cell(1, 1).string('STT').style(headerStyle);
        ws_1.cell(1, 2).string('Mã sản phẩm/Phụ kiện *').style(headerStyle);
        ws_1.cell(1, 3).string('Tên sản phẩm/Phụ kiện').style(headerStyle);
        // ws_1.cell(1, 4).string('SKU/IMEI*').style(headerStyle)
        ws_1.cell(1, 4).string('Đơn vị tính *').style(headerStyle);
        ws_1.cell(1, 5).string('IMEI *').style(headerStyle);
        ws_1.cell(1, 6).string('Số lượng *').style(headerStyle);
        ws_1.cell(1, 7).string('Đơn giá nhập *').style(headerStyle);
        ws_1.cell(1, 8).string('Thành tiền').style(headerStyle);
        ws_1.cell(1, 9).string('Ghi chú').style(headerStyle);

        for (let i = 2; i < 10; i++) {
            ws_1.column(i).setWidth(35);
        }

        // Add Worksheets ĐƠN VỊ TÍNH
        const ws_3 = wb.addWorksheet('ĐƠN VỊ TÍNH');
        ws_3.cell(1, 1).style(headerStyle);
        ws_3.cell(1, 2).style(headerStyle);
        ws_3.cell(1, 3).style(headerStyle);
        ws_3.cell(1, 4).style(headerStyle);

        ws_3.column(1).setWidth(10);
        ws_3.column(2).setWidth(15);
        ws_3.column(3).setWidth(20);
        ws_3.column(4).setWidth(30);

        const header3 = {
            no: 'STT',
            unit_id: 'Mã ĐVT',
            unit_name: 'Tên ĐVT',
            description: 'Mô tả',
        };

        dataUnit.unshift(header3);
        dataUnit.forEach((item, index) => {
            let indexRow = index + 1;
            let indexCol = 0;
            ws_3.cell(indexRow, ++indexCol)
                .string((item.no || index).toString())
                .style(columnStyle);
            ws_3.cell(indexRow, ++indexCol).string((item.unit_id || '').toString());
            ws_3.cell(indexRow, ++indexCol).string((item.unit_name || '').toString());
            ws_3.cell(indexRow, ++indexCol).string((item.description || '').toString());
        });

        // Add Worksheets Lưu ý
        const ws_10 = wb.addWorksheet('Lưu ý');
        ws_10.cell(1, 1).style(headerStyle).string('STT');
        ws_10.cell(1, 2).style(headerStyle).string('Lưu ý');

        ws_10.column(1).setWidth(10);
        ws_10.column(2).setWidth(40);

        ws_10.cell(2, 1).string('1').style(columnStyle);
        ws_10.cell(2, 2).string('Các trường dấu * là bắt buộc ');

        ws_10.cell(3, 1).string('2').style(columnStyle);
        ws_10.cell(3, 2).string('STT nhập sản phẩm bắt đầu từ số 1');

        ws_10.cell(4, 1).string('3').style(columnStyle);
        ws_10.cell(4, 2).string('Mã đơn vị tính quý khách tham chiếu từ sheet "Đơn vị tính"');

        // ws_10.cell(5, 1).string('4').style(columnStyle);
        // ws_10.cell(5, 2).string('Nếu là linh kiện thì cột "Là linh kiện" điền 1');

        return new ServiceResponse(true, '', wb);
    } catch (error) {
        console.log(error);
        return new ServiceResponse(false, 'Lỗi không thể tải xuống file mẫu', {});
    }
};

const getInfoOfProductImeiCode = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IMEI', apiHelper.getValueFromObject(bodyParams, 'imei'))
            .execute('ST_STOCKSINREQUEST_GetInfoOfProductImeiCode_AdminWeb');
        const pro = stocksInRequestClass.listProductDetail(data.recordset);
        return new ServiceResponse(true, '', pro);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getInfoOfProductImeiCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const checkImeiCode = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IMEI', apiHelper.getValueFromObject(bodyParams, 'imei'))
            .execute('ST_STOCKSINREQUEST_checkImeiCode_AdminWeb');
        const result = data.recordset[0]?.RESULT;
        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getInfoOfProductImeiCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const detailSupplierImportProductInStock = async (queryParams) => {
    try {
        let supplierId = apiHelper.getValueFromObject(queryParams, 'supplier_id') ?? 0;
        supplierId = parseInt(supplierId) ?? null;
        const pool = await mssql.pool;
        const dataStocksInRequestSupplierDetail = await pool
            .request()
            .input('SUPPLIERID', supplierId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_GETBYSTOCKSINREQUESTBYSUPPLIERID_ADMINWEB);

        let detailList = stocksInRequestClass.listProductDetail(dataStocksInRequestSupplierDetail.recordset);
        const costApplyList = stocksInRequestClass.listCostApply(dataStocksInRequestSupplierDetail.recordsets[1]);
        let productList = [];
        for (let i = 0; i < detailList.length; i++) {
            const {
                product_id,
                stocks_in_request_id,
                stocks_in_detail_id,
                order_index,
                unit_id,
                quantity,
                total_price,
                product_imei_code,
                note = '',
            } = detailList[i];
            detailList[i].cost_apply_list = (costApplyList || []).filter(
                (v) => v.stocks_in_request_detail_id == stocks_in_detail_id,
            );

            const idx = (productList || []).findIndex(
                (x) =>
                    x.product_id == product_id &&
                    unit_id == x.unit_id &&
                    x.order_index == order_index &&
                    x.stocks_in_request_id == stocks_in_request_id,
            );

            if (idx >= 0) {
                productList[idx].quantity += quantity;
                productList[idx].skus.push({
                    id: i,
                    stocks_in_detail_id: stocks_in_detail_id,
                    sku: product_imei_code,
                    note,
                });
                productList[idx].total_price += total_price;
            } else {
                productList.push({
                    ...detailList[i],
                    quantity: quantity,
                    order_index,
                    total_price,
                    skus: [
                        {
                            id: i,
                            stocks_in_detail_id: stocks_in_detail_id,
                            sku: product_imei_code,
                            note,
                        },
                    ],
                });
            }
        }

        return new ServiceResponse(true, '', productList);
    } catch (e) {
        logger.error(e, { function: 'supplierService.getListSupplier' });
        return new ServiceResponse(true, '', {});
    }
};

const getOptionsPurchase = async (bodyParams = {}) => {
    try {
        const purchaseOrderIdString = apiHelper.getValueFromObject(bodyParams, 'purchase_order_id', '');
        // const purchaseOrderIdString = StRequestHelper.arrayJoinToString(purchaseOrderId);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'keyword'))
            .input('PURCHASEORDERID', purchaseOrderIdString)
            .execute('ST_STOCKSINREQUEST_GetOptionsPurchase_AdminWeb');
        const purchase_code = stocksInRequestClass.listPurchaseCode(data.recordset);
        return new ServiceResponse(true, '', purchase_code);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.GetOptionsPurchase',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionsPurchaseWhenImportStock = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'keyword'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(bodyParams, 'supplier_id'))
            .execute('SL_PURCHASEORDER_GetOptionsPurchase_AdminWeb');
        const purchase_code = stocksInRequestClass.listPurchaseCodeImport(data.recordset);
        return new ServiceResponse(true, '', purchase_code);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getOptionsPurchaseWhenImportStock',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getOptionProductStRequestByPurchase = async (bodyQuery = {}) => {
    try {
        let arrStReqquest = apiHelper.getValueFromObject(bodyQuery, 'list_st_request');
        let convertListSt = StRequestHelper.arrayToString(arrStReqquest);

        const pool = await mssql.pool;
        const dataStocksInRequestDetail = await pool
            .request()
            .input('STOCKSINREQUESTID', convertListSt)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_GETBYSTOCKSINREQUESTBYLISTID_ADMINWEB);
        let detailList = stocksInRequestClass.listProductDetail(dataStocksInRequestDetail.recordset);
        const costApplyList = stocksInRequestClass.listCostApply(dataStocksInRequestDetail.recordsets[1]);

        let productList = [];
        for (let i = 0; i < detailList.length; i++) {
            const {
                stocks_in_request_id,
                product_id,
                stocks_in_detail_id,
                order_index,
                unit_id,
                quantity,
                total_price,
            } = detailList[i];

            detailList[i].cost_apply_list = (costApplyList || []).filter(
                (v) => v.stocks_in_request_detail_id == stocks_in_detail_id,
            );
            // Gom san pham lai
            const idx = (productList || []).findIndex(
                (x) =>
                    x.stocks_in_request_id == stocks_in_request_id &&
                    x.product_id == product_id &&
                    unit_id == x.unit_id &&
                    x.order_index == order_index,
            );
            if (idx >= 0) {
                productList[idx].quantity += quantity;
                productList[idx].total_price += total_price;
            } else {
                productList.push({
                    ...detailList[i],
                    quantity: quantity,
                    order_index,
                    total_price,
                });
            }
        }

        return new ServiceResponse(true, 'ok', productList);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.GetOptionsPurchase',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getStoreOptions = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(bodyParams, 'business_id'))
            .execute(`ST_STOCKSINREQUEST_GetStoreOptions_AdminWeb`);
        const stores = stocksInRequestClass.storeOptions(data.recordset);
        return new ServiceResponse(true, '', stores);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getStoreOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const _createOrUpdateAccounting = async (bodyParams = {}, reqTrans) => {
    try {
        const pool = await mssql.pool;
        const resCreateOrUpdate = await pool
            .request()
            .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'))
            .input('ACCOUNTINGID', apiHelper.getValueFromObject(bodyParams, 'accounting_id'))
            .input('DEBTACCOUNT', apiHelper.getValueFromObject(bodyParams, 'debt_account_id'))
            .input('CREDITACCOUNT', apiHelper.getValueFromObject(bodyParams, 'credit_account_id'))
            .input('EXPLAIN', apiHelper.getValueFromObject(bodyParams, 'explain'))
            .input('MONEY', apiHelper.getValueFromObject(bodyParams, 'money'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('AC_ACCOUNTING_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].RESULT;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'stocksInRequestService._createOrUpdateAccounting' });

        return new ServiceResponse(false, error.message);
    }
};

const getCustomerOptions = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('CUSTOMERTYPE', apiHelper.getValueFromObject(bodyParams, 'customer_type'))
            .input('KEYWORD', apiHelper.getValueFromObject(bodyParams, 'search'))
            .execute(`ST_STOCKSINREQUEST_GetCustomerOptions_AdminWeb`);

        return new ServiceResponse(true, '', data.recordset);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.getCustomerOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const readFileExcel = async (bodyParams = {}) => {
    try {
        const pathUpload = apiHelper.getValueFromObject(bodyParams, 'path_upload');
        const stocksId = apiHelper.getValueFromObject(bodyParams, 'stocks_id');
        // Lay danh sach sản phẩm, số lô và tổng số đã nhập
        const pool = await mssql.pool;
        const data = await pool.request().execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_GETINITIMPORTEXCEL_ADMINWEB);
        let products = data && data.recordset ? stocksInRequestClass.productExcel(data.recordset) : [];
        const lot_number = data && data.recordsets[1] ? data.recordsets[1][0].LOTNUMBER : '';
        let total_product_code = data && data.recordsets[2] ? data.recordsets[2][0].TOTALPRODUCTIMEICODE : 0;
        const units = data && data.recordsets[3] ? stocksInRequestClass.productUnitExcel(data.recordsets[3]) : [];

        // Đọc file excel
        const rows = await readXlsxFile(pathUpload);
        let product_list = [];
        let errors_list = [];
        // Chứa các tham số cần thiết như ds đơn vị quy đổi, ds đơn vị
        for (i in rows) {
            // Bỏ qua dòng tiêu đề đầu
            if (i > 0 && rows[i][1]) {
                const product_code = `${rows[i][1] || ''}`.trim();

                // Tìm sản phẩm có đúng với mã sản phẩm khai báo hay không
                const product = (products || []).find((v) => v.product_code === product_code);
                if (!product) {
                    return new ServiceResponse(false, `Mã sản phẩm ${product_code} không tồn tại`);
                    // errors_list.push({
                    //     index: i,
                    //     content: `Mã sản phẩm ${product_code} không tồn tại`,
                    // });
                }

                if (product) {
                    const unit = (units || []).find((v) => v.slug == changeToSlug(`${rows[i][3]}`));
                    const imei = `${rows[i][4] || ''}`.trim();
                    const quantity = parseFloat(`${rows[i][5] || 0}`);
                    let cost_price = parseFloat(`${rows[i][6] || 0}`);
                    let total_price = parseFloat(`${rows[i][7] || 0}`);
                    const note = `${rows[i][8]}`.trim();
                    let is_component = `${rows[i][9] || 0}`.trim();
                    let cost_basic_imei_code = 0; // don gia von
                    let total_cost_basic_imei = 0; // thanh tien don gia von

                    if (!cost_price && total_price) {
                        cost_price = parseFloat(Number(total_price / (quantity || 1)).toFixed(3));
                    }
                    if (!total_price && cost_price) {
                        total_price = parseFloat(Number(cost_price * (quantity || 1)).toFixed(3));
                    }

                    if (cost_price) {
                        cost_basic_imei_code = cost_price;
                    }
                    if (cost_basic_imei_code) {
                        total_cost_basic_imei = parseFloat(Number(cost_price * (quantity || 1)).toFixed(3));
                    }

                    // Tao mã sản phẩm ở đây (skus)
                    let skus = [];
                    skus.push({ id: 0, sku: imei });
                    // for (let i = 0; i < quantity; i++) {
                    //     const sku = buildSku(stocksId, total_product_code);
                    //     skus.push({ id: total_product_code, sku });
                    //     total_product_code++;
                    // }
                    product_list.push({
                        ...product,
                        ...{
                            lot_number,
                            quantity,
                            total_price,
                            cost_price,
                            cost_basic_imei_code,
                            total_cost_basic_imei,
                            unit_id: unit?.id || product?.unit_id,
                            unit_name: unit?.name || product?.unit_name,
                            is_component,
                            _k: product?.product_id,
                            skus,
                            note,
                        },
                    });
                }
            }
        }

        const groupedProducts = {};
        const productCodeCostPrices = {};

        for (let i = 0; i < product_list.length; i++) {
            const product = product_list[i];
            const totalPrice = product.quantity * product.cost_price; // Tính total_price
            if (!groupedProducts[product?.product_code]) {
                // Nếu chưa có sản phẩm nào với product_code này, tạo mới
                // Lưu trữ cost_price của product_code này
                productCodeCostPrices[product.product_code] = product.cost_price;
                groupedProducts[product?.product_code] = {
                    ...product,
                    quantity: product?.quantity,
                    total_price: totalPrice,
                    skus: product?.skus.map((sku, index) => ({ ...sku, id: index + 1 })), // Thêm id tăng dần vào mỗi sku
                };
            } else {
                // Nếu sản phẩm đã tồn tại, chỉ cần thêm sku vào mảng skus của sản phẩm đó
                const existingCostPrice = productCodeCostPrices[product.product_code];
                if (existingCostPrice !== product.cost_price) {
                    // Nếu cost_price khác, reutrn
                    return new ServiceResponse(
                        false,
                        ` Vui lòng kiểm tra đơn giá nhập của mã hàng ${product.product_code}`,
                    );
                }
                // Cộng thêm số lượng mới vào số lượng hiện tại
                groupedProducts[product?.product_code].quantity += product?.quantity;
                groupedProducts[product.product_code].total_price += totalPrice;
                const existingProduct = groupedProducts[product.product_code];
                existingProduct.skus.push({
                    ...product.skus[0],
                    id: existingProduct.skus.length + 1, // Sử dụng độ dài hiện tại của mảng skus để tạo id mới
                });
            }
        }

        // Chuyển object thành mảng các sản phẩm đã nhóm
        const groupedProductList = Object.values(groupedProducts);

        return new ServiceResponse(true, '', { product_list: groupedProductList, errors_list });
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.readExcel',
        });
        return new ServiceResponse(false, e.message);
    }
};


const checkImeiCodeInRequest = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('IMEI', apiHelper.getValueFromObject(bodyParams, 'imei'))
            .execute('ST_STOCKSINREQUESTDETAIL_CheckImeiCode_AdminWeb');
        const result = data.recordset[0]?.RESULT;
        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'stocksInRequestService.checkImeiCodeInrequest',
        });
        return new ServiceResponse(false, e.message);
    }
};

const updateImeiInRequest = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        for (const item of bodyParams.skus) {
            const data = await pool.request()
                .input('IMEI', item.sku)
                .input('STOCKSINTYPEID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_type_id'))
                .execute('ST_STOCKSINREQUESTDETAIL_CheckImeiCodeInRequest_AdminWeb');
            const result = data.recordset[0]?.RESULT;
            if (result === 1) {
                return new ServiceResponse(false, `Imei “${item?.sku}” đã tồn tại.`);
            }
        }
        const transaction = await new sql.Transaction(pool);
        await transaction.begin();
        for (const iterator of bodyParams.skus) {
            const dataReq = new sql.Request(transaction);
            const data = await dataReq
                .input('NEWIMEI', iterator.sku)
                .input('OLDIMEI', iterator.old_sku)
                .execute('ST_STOCKSINREQUEST_UpdateImei_AdminWeb');
            if (!data) {
                // await transaction.rollback();
                return new ServiceResponse(false, RESPONSE_MSG.CRM_PARTNER.UPDATE_FAILED);
            }
        }
        transaction.commit()
        return new ServiceResponse(true, '', {});
    } catch (e) {
        await transaction.rollback();
        logger.error(e, {
            function: 'stocksInRequestService.checkImeiCodeInrequest',
        });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListStocksInRequest,
    genDataByStocksInTypeId,
    detailStocksInRequest,
    deleteStocksInRequest,
    changeStatusStocksInRequest,
    createOrUpdateStocksInRequest,
    getStocksManager,
    getVehicleList,
    getPhoneNumber,
    genStocksInCodeStocks,
    genProductName,
    getUnitList,
    genCostValue,
    getListDescription,
    exportPDF,
    detailToPrint,
    genLotNumber,
    getDiscount,
    getOutputStatus,
    getUnitPriceList,
    changeUnitPrice,
    readExcel,
    getInit,
    // NEW STOCKSINREQUEST
    getProductOptions,
    getProductInit,
    getStocksInTypeOptions,
    exportExcel,
    getOptionsUserRequest,
    getOptsProductCode,
    getOptionsStocksReviewLevel,
    approvedReview,
    getOptionsCustomer,
    createStocksDetail,
    downloadExcel,
    getInfoOfProductImeiCode,
    checkImeiCode,
    detailSupplierImportProductInStock,
    getOptionsPurchase,
    getOptionProductStRequestByPurchase,
    getStoreOptions,
    getOptionsPurchaseWhenImportStock,
    getCustomerOptions,
    readFileExcel,
    checkImeiCodeInRequest,
    updateImeiInRequest
};
