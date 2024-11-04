const Queue = require('bull');
const mssql = require('../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../app/common/helpers/api.helper');
const ServiceResponse = require('../../app/common/responses/service.response');
const PROCEDURE_NAME = require('../../app/common/const/procedureName.const');
const stocksInRequestClass = require('../modules/stocks-in-request/stocks-in-request.class')
const moment = require('moment');
const RESPONSE_MSG = require('../common/const/responseMsg.const');
// const serviceCustomerLead = require('../modules/customer-lead/customer-lead.service');
// const xl = require('excel4node');
// const { addSheet } = require('../modules/customer-lead/utils');

const CONFIG = {
    redis: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PWD,
        connectTimeout: 30000
    }
}
// Tạo hàng đợi
const insertQueue = new Queue('insertQueue', CONFIG);

// Worker xử lý công việc từ hàng đợi
insertQueue.process(async (job, done) => {
    const { bodyParams } = job.data;
    try {
        await insertRecord(bodyParams);
        done();
    } catch (error) {
        done(new Error(`Error processing job: ${error.message}`));
    }
});

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

async function insertRecord(bodyParams) {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {

        await transaction.begin();
        const is_return_component = apiHelper.getValueFromObject(bodyParams, 'is_return_component');
        const type_component = apiHelper.getValueFromObject(bodyParams, 'type_component');

        const stocksInType = apiHelper.getValueFromObject(bodyParams, 'stocks_in_type') || {};
        const isAutoReview = apiHelper.getValueFromObject(bodyParams, 'is_auto_review');
        // luu hoac cap nha thong tin nhap kho
        const stocksId = apiHelper.getValueFromObject(bodyParams, 'stocks_id');
        const dataReq = new sql.Request(transaction);
        const data = await dataReq
            .input('STOCKSINREQUESTID', apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('STOCKSINCODE', apiHelper.getValueFromObject(bodyParams, 'stocks_in_code'))
            .input('ISIMPORTED', apiHelper.getValueFromObject(bodyParams, 'is_imported'))
            .input('ISREVIEWED', isAutoReview ? isAutoReview : apiHelper.getValueFromObject(bodyParams, 'is_reviewed'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('STOCKSINTYPEID', 1 * apiHelper.getValueFromObject(bodyParams, 'stocks_in_type_id'))
            .input('STOCKSINTYPE', stocksInType.stocks_in_type || 1)
            .input('REQUESTID', apiHelper.getValueFromObject(bodyParams, 'request_id'))
            .input('REQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'request_code'))
            .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(bodyParams, 'department_request_id'))
            .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(bodyParams, 'business_request_id'))
            .input('REQUESTUSER', apiHelper.getValueFromObject(bodyParams, 'request_user'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(bodyParams, 'supplier_id'))
            .input('STOCKSID', stocksId)
            .input('RECEIVERNAME', apiHelper.getValueFromObject(bodyParams, 'receiver_name'))
            .input('LOTNUMBER', apiHelper.getValueFromObject(bodyParams, 'lot_number'))
            .input('STOCKSINDATE', apiHelper.getValueFromObject(bodyParams, 'stocks_in_date'))
            .input('TOTALAMOUNT', 1 * apiHelper.getValueFromObject(bodyParams, 'total_amount'))
            // .input('FROMSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'from_stocks_id'))
            //.input('SENDERNAME', apiHelper.getValueFromObject(bodyParams, 'sender_name'))
            .input('ISAPPLYUNITPRICE', sql.Bit, apiHelper.getValueFromObject(bodyParams, 'is_apply_unit_price'))
            .input('TOTALPRICE', apiHelper.getValueFromObject(bodyParams, 'total_price'))
            .input('TOTALCOST', apiHelper.getValueFromObject(bodyParams, 'total_cost'))
            .input('COSTPERQUANTITY', apiHelper.getValueFromObject(bodyParams, 'cost_per_quantity'))
            .input('MEMBERID', apiHelper.getValueFromObject(bodyParams, 'member_id'))
            .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
            .input('CUSTOMERTYPE', apiHelper.getValueFromObject(bodyParams, 'customer_type'))
            .input('ISODDCUSTOMER', apiHelper.getValueFromObject(bodyParams, 'is_odd_customer'))
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_CREATEORUPDATE_ADMINWEB);
        const stocksInRequestId =
            apiHelper.getValueFromObject(bodyParams, 'stocks_in_request_id') ?? data.recordsets[1][0].RESULT;
        if (stocksInRequestId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
        }
        // Xoa du lieu bang chi tiet nhap kho  ST_STOCKSINREQUESTDETAIL
        const requestDeleteStocksInRequestDetail = new sql.Request(transaction);
        const dataStocksInRequestDetailDelete = await requestDeleteStocksInRequestDetail
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_DELETE_ADMINWEB);
        const resultDeleteStocksInRequestDetail = dataStocksInRequestDetailDelete.recordset[0].RESULT;
        if (resultDeleteStocksInRequestDetail <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        }
        // Xoa du lieu bang ST_STOCKSINREQUESTDETAIL_COST
        const requestDelSTIRQDTCost = new sql.Request(transaction);
        const dataSTIRQDTCostDelete = await requestDelSTIRQDTCost
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_COST_DELETE_ADMINWEB);
        const resultDelSTIRQDTCost = dataSTIRQDTCostDelete.recordset[0].RESULT;
        if (resultDelSTIRQDTCost <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        }

        // Xoa du lieu bang ST_STOCKSINREQUEST_COST
        const requestDelSTIRQCost = new sql.Request(transaction);
        const dataSTIRQCostDelete = await requestDelSTIRQCost
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_COST_DELETE_ADMINWEB);
        const resultDelSTIRQCost = dataSTIRQCostDelete.recordset[0].RESULT;
        if (resultDelSTIRQCost <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        }

        // Xoa du lieu bang ST_STOCKSINREQUEST_PRODUCTCOST
        const requestDelSTIRQProductCost = new sql.Request(transaction);
        const dataSTIRQProductCostDelete = await requestDelSTIRQProductCost
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_PRODUCTCOST_DELETE_ADMINWEB);
        const resultDelSTIRQProductCost = dataSTIRQProductCostDelete.recordset[0].RESULT;
        if (resultDelSTIRQProductCost <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        }

        // Xoa du lieu bang ST_STOCKSINREQUESTREVIEWLIST
        const requestDelSTIRQReview = new sql.Request(transaction);
        const dataSTIRQReviewDelete = await requestDelSTIRQReview
            .input('STOCKSINREQUESTID', stocksInRequestId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(PROCEDURE_NAME.ST_STOCKSIN_REVIEWLIST_DELETE_ADMINWEB);
        const resultDelSTIRQReview = dataSTIRQReviewDelete.recordset[0].RESULT;
        if (resultDelSTIRQReview <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.UPDATE_FAILED);
        }

        // Them moi du lieu vao bang chi tiet nhap kho
        let productListOrigin = apiHelper.getValueFromObject(bodyParams, 'products_list');
        if (!productListOrigin || !productListOrigin.length) {
            await transaction.rollback();
            return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
        }
        const isImported = apiHelper.getValueFromObject(bodyParams, 'is_imported');

        //Kiểm tra imei đã tồn tại trong database chưa
        for (const item of productListOrigin) {
            if (item?.skus?.length > 0) {
                for (const iSku of item.skus) {
                    const found = await checkImeiCodeInRequest({ imei: iSku?.sku });
                    if (found.getData() === 1) {
                        await transaction.rollback();
                        return new ServiceResponse(false, `Imei “${iSku?.sku}” đã tồn tại.`);
                    }
                }
            }
        }


        // Nhân số lượng product list và chuyển quantity về 1, để nhập từng dong đối với số lượng > 1
        // Bao nhiu sku thi bấy nhiu chi tiết nhập kho
        // Cac giá trị cần tính lại: total_price, total_price_cost, total_cost_basic_imei
        let productList = productListOrigin.reduce((list, x, j) => {
            const { skus = [] } = x;
            if (skus.length > 0) {
                for (let i = 0; i < skus.length; i++) {
                    list.push({
                        ...x,
                        total_price_cost: x.total_price_cost / x.quantity,
                        total_cost_basic_imei: x.total_cost_basic_imei / x.quantity,
                        order_index: j,
                        input_quantity: x.quantity,
                        quantity: x.quantity,
                        total_price: x.cost_price * 1,
                        // note: skus[i].note || '',
                        note: x?.note,
                        product_imei_code: skus[i].sku || '',
                    });
                }
            } else {
                list.push({
                    ...x,
                    total_price_cost: x.total_price_cost / x.quantity,
                    total_cost_basic_imei: x.total_cost_basic_imei / x.quantity,
                    order_index: j,
                    input_quantity: x.quantity,
                    // quantity: 1,
                    quantity: x.quantity,
                    total_price: x.cost_price * 1,
                    // note: skus[i].note || '',
                    note: x?.note,
                    product_imei_code: null,
                });
            }
            return list;
        }, []);
        //Thanh
        const requestStocksOutOfComponent = new sql.Request(transaction);


        let hasErrorTransfer = 0;
        for (let i = 0; i < productList.length; i++) {
            const item = productList[i];

            let lotNumber = apiHelper.getValueFromObject(item, 'lot_number', '') + '';
            let productImeiCode = apiHelper.getValueFromObject(item, 'product_imei_code');

            const requestSTRIQDTCreate = new sql.Request(transaction);
            const dataSTIRQDTCreate = await requestSTRIQDTCreate // eslint-disable-line no-await-in-loop
                .input('STOCKSINREQUESTID', stocksInRequestId)
                .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                .input('PRODUCTIMEICODE', productImeiCode)
                .input('ISMATERIAL', apiHelper.getValueFromObject(item, 'is_material'))
                .input('COSTPRICE', apiHelper.getValueFromObject(item, 'cost_price'))
                .input('TOTALPRICE', apiHelper.getValueFromObject(item, 'total_price'))
                .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                // .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity') || 0)
                .input('LOTNUMBER', sql.VarChar(200), lotNumber)
                .input('TOTALCOSTBASICIMEI', apiHelper.getValueFromObject(item, 'total_cost_basic_imei'))
                .input('COSTBASICIMEICODE', apiHelper.getValueFromObject(item, 'cost_basic_imei_code'))
                .input('TOTALCOSTVALUE', apiHelper.getValueFromObject(item, 'cost'))
                .input('TOTALPRICECOST', apiHelper.getValueFromObject(item, 'total_price_cost'))
                .input('TOTALPRODUCTCOST', apiHelper.getValueFromObject(item, 'total_product_cost'))
                .input('COSTPERQUANTITY', apiHelper.getValueFromObject(item, 'cost_per_quantity'))
                .input('ISAUTOGENIMEI', apiHelper.getValueFromObject(item, 'is_auto_gen_imei'))
                .input('NOTE', apiHelper.getValueFromObject(item, 'note'))
                .input('ORDERINDEX', apiHelper.getValueFromObject(item, 'order_index'))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .input('EXPECTEDDATE', apiHelper.getValueFromObject(item, 'expected_date'))
                .input('PURCHASEORDERDETAILID', apiHelper.getValueFromObject(item, 'purchase_order_detail_id'))
                .input('DEBTACCOUNTID', apiHelper.getValueFromObject(item, 'debt_account_id'))
                .input('CREDITACCOUNTID', apiHelper.getValueFromObject(item, 'credit_account_id'))
                .input('TAXACCOUNTID', apiHelper.getValueFromObject(item, 'tax_account_id'))
                .input('VATVALUE', apiHelper.getValueFromObject(item, 'vat_value'))
                .input('ACCOUNTINGID', apiHelper.getValueFromObject(item, 'accounting_id'))
                .input('STOCKSID', stocksId)
                .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_CREATE_ADMINWEB);
            const stocksInRequestDetailId = dataSTIRQDTCreate.recordset[0].RESULT;
            if (!!dataSTIRQDTCreate) {
                if (stocksInRequestDetailId <= 0) {
                    await transaction.rollback();
                    return new ServiceResponse(false, e.message);
                }
            }

            if (type_component === 2) {
                const requestCreateStocksDetail = new sql.Request(transaction);
                for (let i = 0; i < productList.length; i++) {
                    const item = productList[i];

                    let lotNumber = apiHelper.getValueFromObject(item, 'lot_number', '') + '';
                    let productImeiCode = apiHelper.getValueFromObject(item, 'product_imei_code');

                    // Neu la nhap kho và phiêu đã dc duyệt thi luu vao bang chi tiet kho
                    // Nhap kho roi khong duoc chinh sua

                    const dataCreateStocksDetail = await requestCreateStocksDetail // eslint-disable-line no-await-in-loop
                        .input('STOCKSINREQUESTID', stocksInRequestId)
                        .input('STOCKSINREQUESTDETAILID', stocksInRequestDetailId)
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
                }
            }

            // Cap nhat lai productimei code
            productImeiCode = dataSTIRQDTCreate.recordset[0].PRODUCTIMEICODE;

            // Them moi chi phi ap dung neu co
            const costApplyList = apiHelper.getValueFromObject(item, 'cost_apply_list');
            if (costApplyList && costApplyList.length > 0) {
                for (let i = 0; i < costApplyList.length; i++) {
                    const costApplyItem = costApplyList[i];
                    const requestSTIRQDTCostCreate = new sql.Request(transaction);
                    const dataSTIRQDTCostCreate = await requestSTIRQDTCostCreate // eslint-disable-line no-await-in-loop
                        .input('STOCKSINREQUESTID', stocksInRequestId)
                        .input('STOCKSINREQUESTDETAILID', stocksInRequestDetailId)
                        .input('COSTID', apiHelper.getValueFromObject(costApplyItem, 'cost_id'))
                        .input('COSTVALUE', apiHelper.getValueFromObject(costApplyItem, 'cost_value'))
                        //.input('ISACTIVE', apiHelper.getValueFromObject(costApplyItem, 'checked'))
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute(PROCEDURE_NAME.ST_STOCKSINREQUESTDETAIL_COST_CREATEORUPDATE_ADMINWEB);
                    const costId = dataSTIRQDTCostCreate.recordset[0].RESULT;
                    if (!!dataSTIRQDTCostCreate) {
                        if (costId <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, e.message);
                        }
                    }
                }
            }
        }

        // Luu bang chi phi cua nhap kho
        const costTypeList = apiHelper.getValueFromObject(bodyParams, 'cost_type_list');
        if (costTypeList && costTypeList.length) {
            for (let i = 0; i < costTypeList.length; i++) {
                const costTypeItem = costTypeList[i];
                const requestSTIRQCostCreate = new sql.Request(transaction);
                const dataSTIRQCostCreate = await requestSTIRQCostCreate // eslint-disable-line no-await-in-loop
                    .input('STOCKSINREQUESTID', stocksInRequestId)
                    .input('COSTID', apiHelper.getValueFromObject(costTypeItem, 'cost_id'))
                    .input('COSTVALUE', apiHelper.getValueFromObject(costTypeItem, 'cost_value'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_COST_CREATEORUPDATE_ADMINWEB);
                const costId = dataSTIRQCostCreate.recordset[0].RESULT;
                if (!!dataSTIRQCostCreate) {
                    if (costId <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, e.message);
                    }
                }
            }
        }

        //Luu bang muc duyet
        const reviewLevelList = apiHelper.getValueFromObject(bodyParams, 'review_level_list');
        if (reviewLevelList && reviewLevelList.length) {
            for (let i = 0; i < reviewLevelList.length; i++) {
                const reviewLevelItem = reviewLevelList[i];
                const isAutoReviewed = apiHelper.getValueFromObject(reviewLevelItem, 'is_auto_reviewed');
                const requestSTIRQReviewCreate = new sql.Request(transaction);
                const dataSTIRQReviewCreate = await requestSTIRQReviewCreate
                    .input('STOCKSINREQUESTID', stocksInRequestId)
                    .input(
                        'STOCKSREVIEWLEVELID',
                        apiHelper.getValueFromObject(reviewLevelItem, 'stocks_review_level_id'),
                    )
                    .input(
                        'ISREVIEWED',
                        isAutoReviewed
                            ? isAutoReviewed
                            : apiHelper.getValueFromObject(reviewLevelItem, 'is_reviewed', 2), //2: Đang đợi duyệt
                    )
                    .input(
                        'ISCOMPLETEDREVIEWED',
                        apiHelper.getValueFromObject(reviewLevelItem, 'is_completed_reviewed'),
                    )
                    .input('REVIEWUSER', apiHelper.getValueFromObject(reviewLevelItem, 'review_user'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute(PROCEDURE_NAME.ST_STOCKSIN_REVIEWLIST_CREATEORUPDATE_ADMINWEB);
                const reviewLevelId = dataSTIRQReviewCreate.recordset[0].RESULT;
                if (!!dataSTIRQReviewCreate) {
                    if (reviewLevelId <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, e.message);
                    }
                }
            }
        }

        if (reviewLevelList.length == 0) {
            //load hết DO lên
            // const data1 = await pool.request().input('PageSize', 99999999).execute('SL_PURCHASEORDER_GetList_AdminWeb');
            // let list = purchaseOrdersClass.list(data1.recordsets[1]);
            // for (let i = 0; i < list.length; i++) {
            //     // Kiểm tra xem DO nào ứng với stock_request_selected
            //     if (!list[i].request_purchase_code) {
            //         const select = await pool
            //             .request()
            //             .input('PURCHASEORDERID', list[i].purchase_order_id)
            //             .execute('SL_PURCHASEORDER_PO_GetInfoByID_AdminWeb');
            //         const rs = select.recordset;
            //         const info = purchaseOrdersClass.informapping(rs);
            //         const _infor = info.map(x=>x.request_purchase_code).join(', ')
            //         if(bodyParams?.request_code == _infor){
            //         //Update lại trạng thái  DO
            //             const data1 = await pool
            //             .request()
            //             .input('PURCHASEORDERID', list[i]?.purchase_order_id)
            //             .input('STOCKSINREQUESTID', stocksInRequestId)
            //             .execute('ST_STOCKSIN_REVIEWLIST_Approved_BY_BE_AdminWeb');
            //         console.log(">>> check",productList );
            //         //update lại trạng thái của product in PO
            //             for (let j = 0; j < productList.length; j++) {
            //                 const createOrUpdateDetail = new sql.Request(transaction);
            //                 const createOrUpdateDetailRes = await createOrUpdateDetail
            //                     .input(
            //                         'PURCHASEORDERREQUESTDETAILID',
            //                         apiHelper.getValueFromObject(productList[j], 'purchase_order_detail_id', null),
            //                     )
            //                     .input('WAREHOUSEDQUANTITY', apiHelper.getValueFromObject(productList[j], 'input_quantity', 1))
            //                     .input('DIVIDEDQUANTITY', null)
            //                     .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            //                     .execute('SL_PURCHASEORDER_DETAIL_CreateOrUpdate_AdminWeb');
            //                 const purchaseRequisitionDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
            //                 if (purchaseRequisitionDetailId <= 0) {
            //                     await transaction.rollback();
            //                     throw new ServiceResponse(false, 'Lỗi cập nhật chi tiết đơn mua hàng');
            //                 }
            //             }
            //         }
            //     }
            // }
        }

        // Luu bang chi phi san pham  nhap kho
        const productApplyCostList = apiHelper.getValueFromObject(bodyParams, 'product_apply_cost');
        if (productApplyCostList && productApplyCostList.length) {
            for (let i = 0; i < productApplyCostList.length; i++) {
                const productApplyCostItem = productApplyCostList[i];
                const requestSTIRQProductCostCreate = new sql.Request(transaction);
                const dataSTIRQProductCostCreate = await requestSTIRQProductCostCreate // eslint-disable-line no-await-in-loop
                    .input('STOCKSINREQUESTID', stocksInRequestId)
                    .input('PRODUCTID', apiHelper.getValueFromObject(productApplyCostItem, 'productid'))
                    .input('EXCHANGEUNITID', apiHelper.getValueFromObject(productApplyCostItem, 'unit_id'))
                    .input(
                        'EXCHANGEQUANTITY',
                        apiHelper.getValueFromObject(productApplyCostItem, 'total_product_quantity'),
                    )
                    .input('COSTPERQUANTITY', apiHelper.getValueFromObject(bodyParams, 'cost_per_quantity'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                    .execute(PROCEDURE_NAME.ST_STOCKSINREQUEST_PRODUCTCOST_CREATEORUPDATE_ADMINWEB);
                const productCostId = dataSTIRQProductCostCreate.recordset[0].RESULT;
                if (!!dataSTIRQProductCostCreate) {
                    if (productCostId <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, e.message);
                    }
                }
            }
        }
        const stocksTransferCode = apiHelper.getValueFromObject(bodyParams, 'stocks_transfer_code');
        if (stocksTransferCode && isImported === 1) {
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

        if (type_component === 2) {
            const requestDataExport = new sql.Request(transaction);
            const dataExportRes = await requestDataExport
                .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_id'))
                .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .input('STOCKSOUTTYPE', 3)
                .execute('RS_RQ_WARRANTY_REPAIR_GetDataToExportStocks');

            let resExport = dataExportRes.recordset[0];

            let resOutRequestCode = await stocksOutRequestGenCode();
            if (resOutRequestCode.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Gen mã code xuất kho thất bại !');
            }
            let genStocksOutRequestCode = resOutRequestCode.getData();

            let dataExport = {
                stocks_out_request_id: null,
                stocks_out_request_code: genStocksOutRequestCode.stocks_out_request_code,
                from_stocks_id: stocksId,
                department_request_id: resExport.DEPARTMENTREQUESTID,
                business_request_id: resExport.BUSINESSREQUESTID,
                store_request_id: apiHelper.getValueFromObject(bodyParams, 'store_id'),
                request_user: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
                component_list: [
                    {
                        component_imei_code: productList[0].product_imei_code,
                        component_id: productList[0].product_id,
                        quantity: 1,
                        total_price: productList[0].total_price,
                        total_price_cost: 0,
                        cost_basic_imei_code: 0,
                        total_cost_basic_imei: 0,
                        cost_price: 0,
                    },
                ],
                request_id: apiHelper.getValueFromObject(bodyParams, 'request_id'),
                request_code: apiHelper.getValueFromObject(bodyParams, 'request_code'),
                stocks_out_type_id: resExport.STOCKSOUTTYPEID,
                auth_name: apiHelper.getValueFromObject(bodyParams, 'auth_name'),
                member_id: apiHelper.getValueFromObject(bodyParams, 'member_id'),
                is_component_replace: 1,
            };
            const dataStocksOutRequestReturn = await createStocksOutRequestOrUpdate(dataExport);
            if (dataStocksOutRequestReturn.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Tạo phiếu xuất thất bại !');
            }
        }
        // await transaction.rollback();
        await transaction.commit();

        // Add additional logic for creating stock details, costs, etc.
        // This includes logic for type_component, costApplyList, costTypeList, and reviewLevelList
    } catch (error) {
        console.log('error', error.message);
        await transaction.rollback()
        return new ServiceResponse(false, RESPONSE_MSG.STOCKSINREQUEST.CREATE_FAILED);
    }
}

// async function exportCustomerLead(bodyParams) {
    
//         const serviceRes = await serviceCustomerLead.getList(bodyParams);
//         const { data } = serviceRes.getData();

//         const wb = new xl.Workbook();
//         addSheet({
//             workbook: wb,
//             sheetName: 'Danh sách khách hàng tiềm năng',
//             header: {
//                 data_leads_code: 'Mã khách hàng',
//                 full_name: 'Tên khách hàng tiềm năng',
//                 gender: 'Giới tính',
//                 birthday: 'Ngày sinh',
//                 phone_number: 'Số điện thoại',
//                 email: 'Email',
//                 address: 'Địa chỉ',
//                 zalo_id: 'Zalo ID',
//                 facebook_id: 'Facebook ID',
//                 affiliate: 'Affiliate',
//             },
//             data,
//         });
//         console.log('queeueueeuu');
//     return wb.write('danh-sach-khach-hang-tiem-nang.xlsx', res);
// }

module.exports = {
    insertQueue
}