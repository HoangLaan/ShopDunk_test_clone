const sql = require('mssql');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const purchaseOrderDivisionClass = require('./purchase-order-division.class');
const { detailPurchaseOrder, detailListPurchaseOrder } = require('../purchase-orders/purchase-orders.service');
const _ = require('lodash');
const purchaseOrdersClass = require('../purchase-orders/purchase-orders.class');
const spName = {
    createOrUpdate: 'PO_PURCHASEORDER_DIVISION_CreateOrUpdate_AdminWeb',
    createOrUpdatePOD: 'PO_PODIVISON_CreateOrUpdate_AdminWeb',
    getList: 'PO_PURCHASEORDER_DIVISION_GetList_AdminWeb',
    getById: 'PO_PURCHASEORDER_DIVISION_GetById_AdminWeb',
    deleteMapping: 'PO_PURCHASEORDER_DIVISION_DeleteMapping_AdminWeb',
    createOrUpdateAreaList: 'PO_PURCHASEORDER_DIVISION_CreateOrUpdateAreaList_AdminWeb',
    createOrUpdateStoreDivisionList: 'PO_PURCHASEORDER_DIVISION_CreateOrUpdateStoreDivisionList_AdminWeb',
    createOrUpdateReviewList: 'PO_PURCHASEORDER_DIVISION_CreateOrUpdateReviewList_AdminWeb',

    // review level
    getReviewLevelList: 'PO_PURCHASEORDER_DIVISION_GetListReviewLevel_AdminWeb',
    createReviewLevel: 'PO_PURCHASEORDER_DIVISION_CreateReviewLevel_AdminWeb',
    createApplyDepartmentReviewLevel: 'PO_PURCHASEORDER_DIVISION_CreateReviewLevelApplyDepartment_AdminWeb',
    getStockOfBusiness: 'ST_STOCKS_GetStockOfBusiness_AdminWeb',
    getInventoryByProduct: 'ST_STOCKS_GetInventoryByProduct_AdminWeb',
    getBusinessByStore: 'AM_BUSINESS_GetOptionsByArea_AdminWeb',
};

const checkReview = (reviewList) => {
    // check mức duyệt cuối đã duyệt => phiếu được duyệt
    const isCompleteAndReview = reviewList.find(
        (userReview) => userReview.is_completed === 1 && userReview.is_reviewed === 1,
    );
    if (isCompleteAndReview) {
        return true;
    } else {
        // check tất cả đã duyệt phiếu => phiếu được duyệt
        const isAllReview = reviewList.every((userReview) => userReview.is_reviewed === 1);
        if (isAllReview) {
            return true;
        }
    }

    return false;
};

const getList = async (queryParams = {}) => {
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
            .input('ISREVIEWED', apiHelper.getValueFromObject(queryParams, 'is_reviewed'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .execute(spName.getList);

        const result = purchaseOrderDivisionClass.list(data.recordsets[0]);
        const reviewUserList = purchaseOrderDivisionClass.reviewList(data.recordsets[1]);

        const _result = result.map((poDivisionItem) => {
            const review_user_list = (reviewUserList || []).filter(
                (x) => x.purchase_order_division_id == poDivisionItem.purchase_order_division_id,
            );

            poDivisionItem.is_reviewed = checkReview(review_user_list);

            return { ...poDivisionItem, review_user_list };
        });

        return new ServiceResponse(true, '', {
            data: _result,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
        });
    } catch (error) {
        logger.error(error, { function: 'purchaseOrderDivisionService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (purchaseOrderDivisionId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PURCHASEORDERDIVISIONID', purchaseOrderDivisionId)
            .execute(spName.getById);

        if (!data.recordset[0]) {
            return new ServiceResponse(false, 'Không tìm thấy chia hàng');
        }

        const [detail = [], areaList = [], storeApply = [], reviewList = [], purchase_order = [], productListQuery = [] ] = data.recordsets;
        let { division_type = 0 } = purchaseOrderDivisionClass.getById(detail[0]);
        let store_apply_list = purchaseOrderDivisionClass.storeApply(storeApply);
        let purchase_order_id = (purchase_order || []).map((item) => {
            return item.PURCHASEORDERID;
        });

        const poDetail = purchaseOrderDivisionClass.getById(detail[0]);
        let result = {
            ...poDetail,
            business_id: poDetail.business_ids?.split("|")?.map(item => parseInt(item)),
            area_list: purchaseOrderDivisionClass.areaList(areaList),
            store_apply_list: store_apply_list,
            stocks_type_list: poDetail?.stocks_type_list?.split("|").map(item => {
                const id = parseInt(item);
                return { id, value: id };
              }),
            review_list: purchaseOrderDivisionClass.reviewList(reviewList),
        };

        result.is_reviewed = checkReview(result.review_list);
        if (purchase_order && purchase_order.length > 0) {
            const detailPurchaseOrderRes = await detailListPurchaseOrder({ list_purchase: purchase_order_id, stocks_id: result?.stocks_id });
            const { productList = [] } = detailPurchaseOrderRes.getData();
            result.product_list = productList;
            result.purchase_order_id = purchase_order_id;
        }

        if(division_type == 2){
            let productList =  purchaseOrdersClass.productList(productListQuery);
            const _productList = productList.map(item => ({...item, quantity : (item?.total_in - item?.total_out) }))
            result.product_list = _productList
        }

        let { product_list = [] } = result || {};
        if (division_type == 1 || division_type == 2) {
            store_apply_list = (store_apply_list || []).map((item) => {
                let product = (product_list || []).find((pro) => pro.product_id == item.product_id);
                return {
                    ...item,
                    product_id: null,
                    product_division: [{ ...product, division_quantity: item.division_quantity, expected_date : item.expected_date, condition_plan: item.condition_plan }],
                };
            });
            let output = store_apply_list.reduce((acc, object) => {
                let { product_division = [], store_id = '' } = object || {};
                if (!acc[store_id]) acc[store_id] = { store_id: store_id, ...object, product_division: [] };
                if (Array.isArray(product_division))
                    acc[store_id].product_division = acc[store_id].product_division.concat(product_division);
                else acc[store_id].product_division.push(product_division);

                return acc;
            }, {});

            result.store_apply_list = Object.values(output) || [];
            // Sắp xếp lại vị trí product_list khi chia hàng preoder từ kho tổng
            if(division_type === 2){
                result.product_list = result.store_apply_list[0]?.product_division?.map(item => {
                    const productExist = product_list.find(p => p.product_id === item.product_id)
                        if(productExist){
                            return {
                                ...item,
                                ...productExist
                            }
                        }
                });
            }
        }
        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, { function: 'purchaseOrderDivisionService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdate = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const idUpdate = apiHelper.getValueFromObject(body, 'purchase_order_division_id');

        await transaction.begin();

        const result = await new sql.Request(transaction)
            .input('PURCHASEORDERDIVISIONID', apiHelper.getValueFromObject(body, 'purchase_order_division_id'))
            .input('PURCHASEORDERDIVISIONNAME', apiHelper.getValueFromObject(body, 'purchase_order_division_name'))
            // .input('PURCHASEORDERID', apiHelper.getValueFromObject(body, 'purchase_order_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(body, 'business_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('STOCKSID', null)
            .input('PURCHASEORDERDIVISIONCODE', apiHelper.getValueFromObject(body, 'purchase_order_division_code'))
            .input('CREATEDUSER', authName)
            .execute(spName.createOrUpdate);

        const idResult = result.recordset[0].RESULT;
        const codeResult = result.recordset[0].CODE;

        if (!idResult) {
            throw new Error('Lưu phiếu chia hàng thất bại');
        }

        // #region deleteMapping
        if (idUpdate) {
            const list_1 = apiHelper
                .getValueFromObject(body, 'area_list', [])
                .filter((x) => Boolean(x.value))
                .map((x) => x.value)
                .join('|');
            const list_2 = apiHelper
                .getValueFromObject(body, 'store_apply_list', [])
                .filter((x) => Boolean(x.store_id))
                .map((x) => x.store_id)
                .join('|');
            const list_3 = apiHelper
                .getValueFromObject(body, 'review_list', [])
                .filter((x) => Boolean(x.review_level_id))
                .map((x) => x.review_level_id)
                .join('|');
            await new sql.Request(transaction)
                .input('PURCHASEORDERDIVISIONID', idUpdate)
                .input('AREALIST', list_1)
                .input('STOREAPPLYLIST', list_2)
                .input('REVIEWLIST', list_3)
                .input('DELETEDUSER', authName)
                .execute(spName.deleteMapping);
        }
        // #region deleteMapping

        // #region area_list
        const area_list = apiHelper.getValueFromObject(body, 'area_list', []);
        for (let i = 0; i < area_list.length; i++) {
            const item = area_list[i];
            await new sql.Request(transaction)
                .input('PURCHASEORDERDIVISIONID', idResult)
                .input('AREAID', item.value)
                .input('CREATEDUSER', authName)
                .execute(spName.createOrUpdateAreaList);
        }
        // #endregion area_list

        let purchase_order_id = apiHelper.getValueFromObject(body, 'purchase_order_id');
        for (let i = 0; i < purchase_order_id.length; i++) {
            await new sql.Request(transaction)
                .input('PURCHASEORDERDIVISIONID', idResult)
                .input('PURCHASEORDERID', purchase_order_id[i])
                .input('CREATEDUSER', authName)
                .execute(spName.createOrUpdatePOD);
        }
        // #region store_apply_list
        const store_apply_list = apiHelper.getValueFromObject(body, 'store_apply_list', []);
        for (let i = 0; i < store_apply_list.length; i++) {
            const item = store_apply_list[i];
            await new sql.Request(transaction)
                .input('PURCHASEORDERDIVISIONID', idResult)
                .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
                .input('PURCHASEORDERID', apiHelper.getValueFromObject(body, 'purchase_order_id'))
                .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id'))
                .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id'))
                .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity'))
                .input('DIVISIONQUANTITY', apiHelper.getValueFromObject(item, 'division_quantity'))
                .input('NOTE', apiHelper.getValueFromObject(item, 'note'))
                .input('EXPECTEDDATE', apiHelper.getValueFromObject(item, 'expected_date', null))
                .input('STOCKSID', apiHelper.getValueFromObject(item, 'stocks_id'))
                .input('CREATEDUSER', authName)
                .execute(spName.createOrUpdateStoreDivisionList);
        }
        // #endregion store_apply_list

        // #region review_list
        const review_list = apiHelper.getValueFromObject(body, 'review_list', []);
        for (let i = 0; i < review_list.length; i++) {
            const item = review_list[i];
            await new sql.Request(transaction)
                .input('PURCHASEORDERDIVISIONID', idResult)
                .input('POREVIEWLEVELID', apiHelper.getValueFromObject(item, 'review_level_id'))
                .input('REVIEWUSER', apiHelper.getValueFromObject(item, 'review_user'))
                .input('ISCOMPLETED', apiHelper.getValueFromObject(item, 'is_completed'))
                .input('ISREVIEWED', apiHelper.getValueFromObject(item, 'is_reviewed'))
                .input('NOTE', apiHelper.getValueFromObject(item, 'note'))
                .input('ORDERINDEX', i)
                .input('CREATEDUSER', authName)
                .execute(spName.createOrUpdateReviewList);
        }
        // #endregion review_list

        const requestStocksInRequest = new sql.Request(transaction);
        const reqestCodeStocksInCode = new sql.Request(transaction);
        const requestSTRIQDTCreate = new sql.Request(transaction);

        let is_review = (review_list || []).every((item) => {
            return item?.is_reviewed == 1;
        });

        if ((review_list && review_list.length < 1) || is_review) {
            for (let i = 0; i < store_apply_list.length; i++) {
                const item = store_apply_list[i];
                const resCode = await reqestCodeStocksInCode
                    .input('RETURNCODE', null)
                    .execute('ST_STOCKSINREQUEST_GenCodeAndTypeStocksIn_AdminWeb');
                let StocksInRequestCode = purchaseOrderDivisionClass.genStocksInRequestCode(
                    resCode.recordset && resCode.recordset.length > 0 && resCode.recordset[0],
                );
                let StocksInType = purchaseOrderDivisionClass.genStocksInType(
                    resCode.recordsets &&
                        resCode.recordsets.length > 0 &&
                        resCode.recordsets[1] &&
                        resCode.recordsets[1].length > 0 &&
                        resCode.recordsets[1][0],
                );

                const dataStocksInRequest = await requestStocksInRequest
                    .input('STOCKSINREQUESTID', null)
                    .input('DESCRIPTION', null)
                    .input('STOCKSINCODE', apiHelper.getValueFromObject(StocksInRequestCode, 'stocks_in_request_code'))
                    .input('ISIMPORTED', 0)
                    .input('ISREVIEWED', null)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .input('STOCKSINTYPEID', apiHelper.getValueFromObject(StocksInType, 'stocks_in_type'))
                    .input('STOCKSINTYPE', null)
                    .input('REQUESTID', idResult)
                    .input('REQUESTCODE', codeResult)
                    .input('DEPARTMENTREQUESTID', null)
                    .input('BUSINESSREQUESTID', null)
                    .input('REQUESTUSER', null)
                    .input('SUPPLIERID', null)
                    .input('STOCKSID', apiHelper.getValueFromObject(item, 'stocks_id'))
                    .input('RECEIVERNAME', null)
                    .input('LOTNUMBER', null)
                    .input('TOTALAMOUNT', null)
                    .input('ISAPPLYUNITPRICE', null)
                    .input('TOTALPRICE', null)
                    .input('TOTALCOST', null)
                    .input('COSTPERQUANTITY', null)
                    .input('MEMBERID', null)
                    .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
                    .execute('ST_STOCKSINREQUEST_CreateOrUpdate_AdminWeb');
                const stocksInRequestId =
                    apiHelper.getValueFromObject(body, 'stocks_in_request_id') ??
                    dataStocksInRequest.recordsets[1][0].RESULT;
                if (!stocksInRequestId) {
                    throw Error('Tạo phiếu nhập kho thất bại');
                }

                const dataSTIRQDTCreate = await requestSTRIQDTCreate // eslint-disable-line no-await-in-loop
                    .input('STOCKSINREQUESTID', stocksInRequestId)
                    .input('PRODUCTID', apiHelper.getValueFromObject(item, 'product_id', null))
                    .input('PRODUCTIMEICODE', null)
                    .input('COSTPRICE', apiHelper.getValueFromObject(item, 'cost_price', null))
                    .input('TOTALPRICE', apiHelper.getValueFromObject(item, 'total_price', null))
                    .input('UNITID', apiHelper.getValueFromObject(item, 'unit_id', null))
                    // .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity') || 0)
                    .input('LOTNUMBER', null)
                    .input('TOTALCOSTBASICIMEI', apiHelper.getValueFromObject(item, 'total_cost_basic_imei', null))
                    .input('COSTBASICIMEICODE', apiHelper.getValueFromObject(item, 'cost_basic_imei_code', null))
                    .input('TOTALCOSTVALUE', apiHelper.getValueFromObject(item, 'cost'))
                    .input('TOTALPRICECOST', apiHelper.getValueFromObject(item, 'total_price_cost', null))
                    .input('TOTALPRODUCTCOST', apiHelper.getValueFromObject(item, 'total_product_cost', null))
                    .input('COSTPERQUANTITY', apiHelper.getValueFromObject(item, 'cost_per_quantity', null))
                    .input('NOTE', null)
                    .input('ORDERINDEX', i)
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .input('STOCKSID', apiHelper.getValueFromObject(item, 'stocks_id'))
                    .execute('ST_STOCKSINREQUESTDETAIL_Create_AdminWeb');
                const stocksInRequestDetailId = dataSTIRQDTCreate.recordset[0].RESULT;
                if (!!dataSTIRQDTCreate) {
                    if (stocksInRequestDetailId <= 0) {
                        throw Error('Tạo chi tiết phiếu nhập kho thất bại');
                    }
                }
                //update lại trạng thái của product in PO
                const product_detail_list = apiHelper.getValueFromObject(body, 'product_detail_list', []);
                const createOrUpdateDetail = new sql.Request(transaction);
                const createOrUpdateDetailRes = await createOrUpdateDetail
                    .input(
                        'PURCHASEORDERREQUESTDETAILID',
                        apiHelper.getValueFromObject(product_detail_list[i], 'purchase_order_detail_id', null),
                    )
                    .input('DIVIDEDQUANTITY', apiHelper.getValueFromObject(product_detail_list[i], 'division_quantity'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                    .execute('SL_PURCHASEORDER_DETAIL_CreateOrUpdate_AdminWeb');

                const purchaseRequisitionDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
                if (purchaseRequisitionDetailId <= 0) {
                    await transaction.rollback();
                    throw new ServiceResponse(false, 'Lỗi cập nhật chi tiết đơn mua hàng');
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, 'Lưu phiếu chia hàng thành công', {
            purchase_order_division_id: idResult,
        });
    } catch (error) {
        transaction.rollback();
        logger.error(error, { function: 'purchaseOrderDivisionService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const _delete = async (bodyParams) => {
    try {
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'PURCHASEORDERDIVISIONID')
            .input('TABLENAME', 'PO_PURCHASEORDER_DIVISION')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'purchaseOrderDivisionService._delete' });
        return new ServiceResponse(false, '', {});
    }
};

const getReviewLevelList = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const resData = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .execute(spName.getReviewLevelList);

        let reviewLevelList = purchaseOrderDivisionClass.reviewLevelList(resData.recordset);
        let departmentList = purchaseOrderDivisionClass.departmentList(resData.recordsets[1]);
        let positionList = purchaseOrderDivisionClass.positionList(resData.recordsets[2]);

        for (let i = 0; i < reviewLevelList.length; i++) {
            reviewLevelList[i].department_list = departmentList
                .filter((department) => department.review_level_id === reviewLevelList[i].review_level_id)
                .map((department) => {
                    const position_list = positionList
                        .filter(
                            (position) =>
                                position.review_level_id === reviewLevelList[i].review_level_id &&
                                position.department_id === department.department_id,
                        )
                        .map((position) => {
                            if (position.position_id && position.position_id !== -1) {
                                return {
                                    position_id: position.position_id,
                                    position_name: position.position_name,
                                };
                            }
                        });

                    return {
                        department_id: department.department_id,
                        department_name: department.department_name,
                        position_list,
                    };
                });
        }

        return new ServiceResponse(true, '', {
            data: reviewLevelList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(resData.recordset),
        });
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.getReviewLevelList' });
        return new ServiceResponse(true, '', {});
    }
};

const createReviewLevel = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const createReviewLevelRequest = new sql.Request(transaction);
        const reviewLevelRes = await createReviewLevelRequest
            .input('REVIEWLEVELNAME', apiHelper.getValueFromObject(bodyParams, 'review_level_name'))
            .input('COMPANYID', apiHelper.getValueFromObject(bodyParams, 'company_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', true))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(spName.createReviewLevel);

        const reviewLevelId = reviewLevelRes.recordset[0].RESULT;
        if (reviewLevelId <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi tạo mức duyệt');
        }

        const department_ids = apiHelper.getValueFromObject(bodyParams, 'department_ids', []);
        const position_list = apiHelper.getValueFromObject(bodyParams, 'position_list', []);

        if (department_ids?.length > 0) {
            for (let i = 0; i < department_ids.length; i++) {
                const department_id = department_ids[i];
                const find = position_list.find((item) => item.department_id === department_id);
                const position_ids = find ? find.position_ids : '';

                if (position_ids.find((item) => item.value === -1)) {
                    const createReviewLevelApplyRequest = new sql.Request(transaction);
                    const reviewLevelApplyRes = await createReviewLevelApplyRequest
                        .input('REVIEWLEVELID', reviewLevelId)
                        .input('DEPARTMENTID', department_id)
                        .input('POSITIONID', -1)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                        .execute(spName.createApplyDepartmentReviewLevel);

                    if (reviewLevelApplyRes.recordset[0].RESULT <= 0) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Lỗi thêm phòng ban, vị trí');
                    }
                } else {
                    for (let j = 0; j < position_ids.length; j++) {
                        const position_id = position_ids[j].value;
                        const createReviewLevelApplyRequest = new sql.Request(transaction);
                        const reviewLevelApplyRes = await createReviewLevelApplyRequest
                            .input('REVIEWLEVELID', reviewLevelId)
                            .input('DEPARTMENTID', department_id)
                            .input('POSITIONID', position_id)
                            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                            .execute(spName.createApplyDepartmentReviewLevel);

                        if (reviewLevelApplyRes.recordset[0].RESULT <= 0) {
                            await transaction.rollback();
                            return new ServiceResponse(false, 'Lỗi thêm phòng ban, vị trí');
                        }
                    }
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, 'Lưu mức duyệt thành công', reviewLevelRes.recordset[0].RESULT);
    } catch (error) {
        logger.error(error, { function: 'purchaseRequisitionService.createReviewLevel' });
        await transaction.rollback();
        return new ServiceResponse(false, '', {});
    }
};

const deleteReviewLevel = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'PURCHASEORDERDIVISIONREVIEWLEVELID')
            .input('TABLENAME', 'PO_PURCHASEORDER_DIVISIONREVIEWLEVEL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.deleteReviewLevel' });
        return new ServiceResponse(false, '', {});
    }
};

const createOrUpdateWithMultiStore = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const idUpdate = apiHelper.getValueFromObject(body, 'purchase_order_division_id');
        const division_type = apiHelper.getValueFromObject(body, 'division_type');
        await transaction.begin();

        const result = await new sql.Request(transaction)
            .input('PURCHASEORDERDIVISIONID', apiHelper.getValueFromObject(body, 'purchase_order_division_id'))
            .input('PURCHASEORDERDIVISIONNAME', apiHelper.getValueFromObject(body, 'purchase_order_division_name'))
            // .input('PURCHASEORDERID', apiHelper.getValueFromObject(body, 'purchase_order_id'))
            // .input('BUSINESSID', apiHelper.getValueFromObject(body, 'business_id'))
            // Lưu nhiều miền
            .input('BUSINESSIDS', apiHelper.getValueFromObject(body, 'business_id', []).map(item => item.id ?? item).join("|"))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('DIVISIONTYPE', division_type)
            .input('STOCKSID', apiHelper.getValueFromObject(body, 'stocks_id'))
            .input('PURCHASEORDERDIVISIONCODE', apiHelper.getValueFromObject(body, 'purchase_order_division_code'))
            .input('EXPECTEDDATEALL', apiHelper.getValueFromObject(body, 'expected_date_all'))
            .input('ISCONDITIONINVENTORY', apiHelper.getValueFromObject(body, 'is_condition_inventory') ? 1 : 0)
            .input('ISCONDITIONPLANS', apiHelper.getValueFromObject(body, 'is_condition_plans') ? 1 : 0)
            .input('ISCONDITIONHISTORY', apiHelper.getValueFromObject(body, 'is_condition_history') ? 1 : 0)
            .input('HISTORYPLANFROM', apiHelper.getValueFromObject(body, 'history_plan_from'))
            .input('HISTORYPLANTO', apiHelper.getValueFromObject(body, 'history_plan_to'))
            .input('STOCKSTYPELIST', apiHelper.getValueFromObject(body, 'stocks_type_list', []).map(item => item.id ?? item).join("|"))
            .input('CREATEDUSER', authName)
            .execute(spName.createOrUpdate);

        const idResult = result.recordset[0].RESULT;
        const codeResult = result.recordset[0].CODE;
        if (!idResult) {
            throw new Error('Lưu phiếu chia hàng thất bại');
        }

        // #region deleteMapping
        if (idUpdate) {
            const list_1 = apiHelper
                .getValueFromObject(body, 'area_list', [])
                .filter((x) => Boolean(x.value))
                .map((x) => x.value ?? x)
                .join('|');
            const list_2 = apiHelper
                .getValueFromObject(body, 'store_apply_list', [])
                .filter((x) => Boolean(x.store_id))
                .map((x) => x.store_id)
                .join('|');
            const list_3 = apiHelper
                .getValueFromObject(body, 'review_list', [])
                .filter((x) => Boolean(x.review_level_id))
                .map((x) => x.review_level_id)
                .join('|');
            await new sql.Request(transaction)
                .input('PURCHASEORDERDIVISIONID', idUpdate)
                .input('AREALIST', list_1)
                .input('STOREAPPLYLIST', list_2)
                .input('REVIEWLIST', list_3)
                .input('DELETEDUSER', authName)
                .execute(spName.deleteMapping);
        }   
        // #region deleteMapping
        let purchase_order_id = body["purchase_order_id"];
        if(purchase_order_id?.length){
            if (Array.isArray(purchase_order_id)) {
                for (let i = 0; i < purchase_order_id.length; i++) {
                    const res = await new sql.Request(transaction)
                        .input('PURCHASEORDERDIVISIONID', idResult)
                        .input('PURCHASEORDERID', purchase_order_id[i])
                        .input('CREATEDUSER', authName)
                        .execute(spName.createOrUpdatePOD);
                }
            } else {
                for (let i = 0; i < purchase_order_id.length; i++) {
                    const res = await new sql.Request(transaction)
                        .input('PURCHASEORDERDIVISIONID', idResult)
                        .input('PURCHASEORDERID', purchase_order_id)
                        .input('CREATEDUSER', authName)
                        .execute(spName.createOrUpdatePOD);
                }
            }
        }

        // #region area_list
        const area_list = apiHelper.getValueFromObject(body, 'area_list', []);
        for (let i = 0; i < area_list.length; i++) {
            const item = area_list[i];
            await new sql.Request(transaction)
                .input('PURCHASEORDERDIVISIONID', idResult)
                .input('AREAID', item.value ?? item)
                .input('CREATEDUSER', authName)
                .execute(spName.createOrUpdateAreaList);
        }
        // #endregion area_list

        const review_list = apiHelper.getValueFromObject(body, 'review_list', []);
        let is_review = (review_list || []).every((item) => item?.is_reviewed == 1);
        // #region store_apply_list
        const store_apply_list = apiHelper.getValueFromObject(body, 'store_apply_list', []);
        // Danh sách của hàng
        for (let i = 0; i < store_apply_list.length; i++) {
            const item = store_apply_list[i];
            let product_division = apiHelper.getValueFromObject(item, 'product_division', []);
            // Danh sách sản phẩm chia hàng
            for (let j = 0; j < product_division.length; j++) {
                // Danh sách đơn mua
                    if ( division_type === 2 ){
                        let product = product_division[j];
                        await new sql.Request(transaction)
                            .input('PURCHASEORDERDIVISIONID', idResult)
                            .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
                            .input('PRODUCTID', apiHelper.getValueFromObject(product, 'product_id'))
                            .input('UNITID', apiHelper.getValueFromObject(product, 'unit_id'))
                            .input('QUANTITY', apiHelper.getValueFromObject(product, 'quantity'))
                            .input('DIVISIONQUANTITY', apiHelper.getValueFromObject(product, 'division_quantity', 0))
                            .input('EXPECTEDDATE', apiHelper.getValueFromObject(product, 'expected_date', null))
                            .input('STOCKSID', apiHelper.getValueFromObject(item, 'stocks_id', 0))
                            .input('NOTE', apiHelper.getValueFromObject(product, 'note', ''))
                            .input('CREATEDUSER', authName)
                            .execute(spName.createOrUpdateStoreDivisionList);
                    }else{
                        for (let k = 0; k < purchase_order_id.length; k++) {
                            let product = product_division[j];
                            await new sql.Request(transaction)
                                .input('PURCHASEORDERDIVISIONID', idResult)
                                .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
                                .input('PURCHASEORDERID', purchase_order_id[k])
                                .input('PRODUCTID', apiHelper.getValueFromObject(product, 'product_id'))
                                .input('UNITID', apiHelper.getValueFromObject(product, 'unit_id'))
                                .input('QUANTITY', apiHelper.getValueFromObject(product, 'quantity'))
                                .input('DIVISIONQUANTITY', apiHelper.getValueFromObject(product, 'division_quantity', 0))
                                .input('EXPECTEDDATE', apiHelper.getValueFromObject(product, 'expected_date', null))
                                .input('STOCKSID', apiHelper.getValueFromObject(item, 'stocks_id', 0))
                                .input('PLANVALUE', apiHelper.getValueFromObject(product, 'condition_plan', 0))
                                .input('NOTE', apiHelper.getValueFromObject(product, 'note', ''))
                                .input('CREATEDUSER', authName)
                                .execute(spName.createOrUpdateStoreDivisionList);
                            
                            //update lại trạng thái của product in PO
                            // + Ko có người duyệt =>  tự động duyệt => update lại DIVIDEDQUANTITY
                            // + Có người duyệt => duyệt => update lại DIVIDEDQUANTITY
                            if(review_list.length === 0 || is_review) {
                                const createOrUpdateDetail = new sql.Request(transaction);
                                const createOrUpdateDetailRes = await createOrUpdateDetail
                                    .input(
                                        'PURCHASEORDERREQUESTDETAILID',
                                        apiHelper.getValueFromObject(product, 'purchase_order_detail_id', null),
                                    )
                                    .input('PRODUCTID', apiHelper.getValueFromObject(product, 'product_id'))
                                    .input('DIVIDEDQUANTITY', apiHelper.getValueFromObject(product, 'division_quantity'))
                                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                                    .execute('SL_PURCHASEORDER_DETAIL_CreateOrUpdate_AdminWeb');
            
                                const purchaseRequisitionDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
                                if (purchaseRequisitionDetailId <= 0) {
                                    await transaction.rollback();
                                    throw new ServiceResponse(false, 'Lỗi cập nhật chi tiết đơn mua hàng');
                                }
                            }
                        }
                    }  
            }
        }
        // #endregion store_apply_list

        // #region review_list
        for (let i = 0; i < review_list.length; i++) {
            const item = review_list[i];
            await new sql.Request(transaction)
                .input('PURCHASEORDERDIVISIONID', idResult)
                .input('POREVIEWLEVELID', apiHelper.getValueFromObject(item, 'review_level_id'))
                .input('REVIEWUSER', apiHelper.getValueFromObject(item, 'review_user'))
                .input('ISCOMPLETED', apiHelper.getValueFromObject(item, 'is_completed'))
                .input('ISREVIEWED', apiHelper.getValueFromObject(item, 'is_reviewed'))
                .input('NOTE', apiHelper.getValueFromObject(item, 'note'))
                .input('ORDERINDEX', i)
                .input('CREATEDUSER', authName)
                .execute(spName.createOrUpdateReviewList);
        }
        // #endregion review_list
        // Nếu không có duyệt => thì sẽ tự tạo phiếu xuất kho và phiếu nhập
        const requestStocksOutRequest = new sql.Request(transaction);
        const requestCodeStockOutRequest = new sql.Request(transaction);
        const requestCreateProductListNull = new sql.Request(transaction);

        const requestStocksInRequest = new sql.Request(transaction);
        const reqestCodeStocksInCode = new sql.Request(transaction);
        const requestSTRIQDTCreate = new sql.Request(transaction);

        // Nếu chia hàng không từ kho tổng chỉ có tạo ra phiếu nhập
        if(division_type !== 0) {
            // Tạo phiếu xuất
            for (let i = 0; i < store_apply_list.length; i++) {
                if ((review_list && review_list.length < 1) || is_review) {
                    const resCode = await requestCodeStockOutRequest
                        .input('STOCKSOUTTYPE',division_type === 2 ? 18 : null)
                        .input('RETURNCODE', null)
                        .execute('ST_STOCKSOUTREQUEST_GenCodeAndTypeStockOut_AdminWeb');
                    let StocksOutRequestCode = purchaseOrderDivisionClass.genStocksOutRequestCode(
                        resCode.recordset && resCode.recordset.length > 0 && resCode.recordset[0],
                    );
                    let StocksOutType = purchaseOrderDivisionClass.genStocksOutType(
                        resCode.recordsets &&
                            resCode.recordsets.length > 0 &&
                            resCode.recordsets[1] &&
                            resCode.recordsets[1].length > 0 &&
                            resCode.recordsets[1][0],
                    );
                    const from_stocks_id =  store_apply_list[i]
                    const data = await requestStocksOutRequest
                        .input('STOCKSOUTREQUESTID', null)
                        .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(body, 'area_id'))
                        // .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(body, 'business_id'))
                        .input('REQUESTUSER', null)
                        .input('STOCKSOUTTYPEID',division_type === 2 ? 18 : apiHelper.getValueFromObject( StocksOutType, 'stocks_out_type'))
                        .input('FROMSTOCKSID', apiHelper.getValueFromObject(body, 'stocks_id') ?? apiHelper.getValueFromObject(body, 'stocks_id'))
                        .input(
                            'STOCKSOUTREQUESTCODE',
                            apiHelper.getValueFromObject(StocksOutRequestCode, 'stocks_out_request_code'),
                        )
                        .input('STOCKSOUTREQUESTDATE', apiHelper.getValueFromObject(body, new Date(), null))
                        .input('ORDERID', apiHelper.getValueFromObject(body, 'order_id', null))
                        .input('MEMBERID', apiHelper.getValueFromObject(body, 'member_id', null))
                        .input('MANUFACTURERID', apiHelper.getValueFromObject(body, 'manufacturer_id', null))
                        .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number', null))
                        .input('STOCKSTAKEREQUESTID', null)
                        .input('TOSTOCKSID', apiHelper.getValueFromObject(store_apply_list[i], 'stocks_id', null))
                        .input('DESCRIPTION', null)
                        .input('TOTALAMOUNT', null)
                        .input('FROMSTOREID', null)
                        .input('TOSTOREID', apiHelper.getValueFromObject(store_apply_list[i], 'store_id', null))
                        .input('EXPORTUSER', null)
                        .input('RECEIVER', null)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                        .input('REQUESTID', idResult)
                        .input('REQUESTCODE', codeResult) //purchase_order_division_code
                        .input('NOTE', 'Tạo bởi đơn chia hàng')
                        .execute('ST_STOCKSOUTREQUEST_CreateOrUpdate_AdminWeb');
                    const stocksOutRequestId =
                        apiHelper.getValueFromObject(body, 'stocks_out_request_id') ??
                        (data.recordsets &&
                            data.recordsets.length > 0 &&
                            data.recordsets[1] &&
                            data.recordsets[1].length > 0 &&
                            data.recordsets[1][0].RESULT);

                    if (!stocksOutRequestId) {
                        throw Error('Tạo phiếu xuất kho thất bại');
                    }
                    let product_detail_list = [];

                    const item = store_apply_list[i];
                    let product_division = apiHelper.getValueFromObject(item, 'product_division', []);
                    // Danh sách sản phẩm chia hàng
                    for (let j = 0; j < product_division.length; j++) {
                        let product = product_division[j];
                        let is_divison = apiHelper.getValueFromObject(product, 'division_quantity', 0);
                        if (is_divison > 0) {
                            product_detail_list.push(product);
                        }
                    }

                    for (let i = 0; i < product_detail_list.length; i++) {
                        await requestCreateProductListNull
                            .input('STOCKSOUTREQUESTID', stocksOutRequestId)
                            .input('PRODUCTID', apiHelper.getValueFromObject(product_detail_list[i], 'product_id', null))
                            .input('MATERIALID', apiHelper.getValueFromObject(product_detail_list[i], 'material_id', null))
                            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                            .input('QUANTITY', apiHelper.getValueFromObject(product_detail_list[i], 'division_quantity'))
                            .execute('ST_STOCKSOUTREQUEST_CreateOrUpdateDetailImeiNull_AdminWeb');
                    }
                }
            }
            //End tạo phiếu xuất
        }
           
            //Tạo phiếu nhập
            if ((review_list && review_list.length < 1) || is_review) {
                for (let i = 0; i < store_apply_list.length; i++) {
                    let { product_division = [] } = store_apply_list[i] || {};
                    const resCode = await reqestCodeStocksInCode
                        .input('RETURNCODE', null)
                        .execute('ST_STOCKSINREQUEST_GenCodeAndTypeStocksIn_AdminWeb');

                    let StocksInRequestCode = purchaseOrderDivisionClass.genStocksInRequestCode(
                        resCode.recordset && resCode.recordset.length > 0 && resCode.recordset[0],
                    );
                    let StocksInType = purchaseOrderDivisionClass.genStocksInType(
                        resCode.recordsets &&
                            resCode.recordsets.length > 0 &&
                            resCode.recordsets[1] &&
                            resCode.recordsets[1].length > 0 &&
                            resCode.recordsets[1][0],
                    );
                    let product_detail_list = [];
                    for (let i = 0; i < store_apply_list.length; i++) {
                        const item = store_apply_list[i];
                        let product_division = apiHelper.getValueFromObject(item, 'product_division', []);
                        // Danh sách sản phẩm chia hàng
                        for (let j = 0; j < product_division.length; j++) {
                            let product = product_division[j];
                            let is_divison = apiHelper.getValueFromObject(product, 'division_quantity', 0);
                            if (is_divison > 0) {
                                product_detail_list.push(product);
                            }
                        }
                    }
                    const dataStocksInRequest = await requestStocksInRequest
                        .input('STOCKSINREQUESTID', null)
                        .input('DESCRIPTION', null)
                        .input(
                            'STOCKSINCODE',
                            apiHelper.getValueFromObject(StocksInRequestCode, 'stocks_in_request_code'),
                        )
                        .input('ISIMPORTED', 0)
                        .input('ISREVIEWED', null)
                        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                        .input('STOCKSINTYPEID', apiHelper.getValueFromObject(StocksInType, 'stocks_in_type'))
                        .input('STOCKSINTYPE', null)
                        .input('REQUESTID', idResult)
                        .input('REQUESTCODE', codeResult)
                        .input('DEPARTMENTREQUESTID', null)
                        // .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(body, 'business_id'))
                        .input('REQUESTUSER', apiHelper.getValueFromObject(body, 'created_user'))
                        .input('SUPPLIERID', apiHelper.getValueFromObject(body, 'supplier_id'))
                        .input('STOCKSID', apiHelper.getValueFromObject(store_apply_list[i], 'stocks_id', null))
                        .input('RECEIVERNAME', null)
                        .input('LOTNUMBER', null)
                        .input('TOTALAMOUNT', null)
                        .input('ISAPPLYUNITPRICE', null)
                        .input('TOTALPRICE', null)
                        .input('TOTALCOST', null)
                        .input('COSTPERQUANTITY', null)
                        .input('MEMBERID', null)
                        .input('STOREID', apiHelper.getValueFromObject(store_apply_list[i], 'store_id'))
                        .execute('ST_STOCKSINREQUEST_CreateOrUpdate_AdminWeb');
                    const stocksInRequestId =
                        apiHelper.getValueFromObject(body, 'stocks_in_request_id') ??
                        dataStocksInRequest.recordsets[1][0].RESULT;
                    if (!stocksInRequestId) {
                        throw Error('Tạo phiếu nhập kho thất bại');
                    }
                    for (let j = 0; j < product_division.length; j++) {
                        let { division_quantity = 0 } = product_division[j];
                        if (division_quantity > 0) {
                            for (let k = 1; k <= division_quantity; k++) {
                                const dataSTIRQDTCreate = await requestSTRIQDTCreate // eslint-disable-line no-await-in-loop
                                    .input('STOCKSINREQUESTID', stocksInRequestId)
                                    .input('PRODUCTID', apiHelper.getValueFromObject(product_division[j], 'product_id'))
                                    .input('PRODUCTIMEICODE', null)
                                    .input('COSTPRICE', apiHelper.getValueFromObject(product_division[j], 'cost_price', 0))
                                    .input(
                                        'TOTALPRICE',
                                        product_division[j]?.total_price ? String(apiHelper.getValueFromObject(product_division[j], 'total_price')) : 0
                                        ,
                                    )
                                    .input('UNITID', apiHelper.getValueFromObject(product_division[j], 'unit_id'))
                                    // .input('QUANTITY', apiHelper.getValueFromObject(item, 'quantity') || 0)
                                    .input('LOTNUMBER', null)
                                    .input(
                                        'TOTALCOSTBASICIMEI',
                                        apiHelper.getValueFromObject(product_division[j], 'total_cost_basic_imei', 0),
                                    )
                                    .input(
                                        'COSTBASICIMEICODE',
                                        apiHelper.getValueFromObject(product_division[j], 'cost_basic_imei_code', 0),
                                    )
                                    .input('TOTALCOSTVALUE', apiHelper.getValueFromObject(product_division[j], 'cost', 0))
                                    .input(
                                        'TOTALPRICECOST',
                                        apiHelper.getValueFromObject(product_division[j], 'total_price_cost', 0),
                                    )
                                    .input(
                                        'TOTALPRODUCTCOST',
                                        apiHelper.getValueFromObject(product_division[j], 'total_product_cost', 0),
                                    )
                                    .input(
                                        'COSTPERQUANTITY',
                                        apiHelper.getValueFromObject(product_division[j], 'cost_per_quantity', 0),
                                    )
                                    .input('NOTE', null)
                                    .input('ORDERINDEX', j)
                                    .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
                                    .input(
                                        'STOCKSID',
                                        apiHelper.getValueFromObject(product_detail_list[i], 'stocks_id'),
                                    )
                                    .input('EXPECTEDDATE', apiHelper.getValueFromObject(product_division[j], 'expected_date'))
                                    .input(
                                        'PURCHASEORDERDETAILID',
                                        apiHelper.getValueFromObject(division_type === 0 ? product_division[j] : {}, 'purchase_order_detail_id', null),
                                    )
                                    .execute('ST_STOCKSINREQUESTDETAIL_Create_AdminWeb');
                                const stocksInRequestDetailId = dataSTIRQDTCreate.recordset[0].RESULT;
                                if (!!dataSTIRQDTCreate) {
                                    if (stocksInRequestDetailId <= 0) {
                                        throw Error('Tạo chi tiết phiếu nhập kho thất bại');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        if(division_type === 1){ // chia hàng từ kho tổng, chia hàng tự động
            const is_condition_inventory = apiHelper.getValueFromObject(body, 'is_condition_inventory');
            const is_condition_plans = apiHelper.getValueFromObject(body, 'is_condition_plans');
            const is_condition_history = apiHelper.getValueFromObject(body, 'is_condition_history');
                // Bảng PO_DIVISON_CONTIDITION_INVENTORY dùng để lưu cho tester tính
                for (let i = 0; i < store_apply_list.length; i++) {
                    const item = store_apply_list[i];
                    let product_division = apiHelper.getValueFromObject(item, 'product_division', []);
                    // Danh sách sản phẩm chia hàng
                    for (let j = 0; j < product_division.length; j++) {
                        let product = product_division[j];
                        if(is_condition_inventory){
                        const result = await new sql.Request(transaction)
                        .input('CONTIDITIONINVENTORYID', null)
                        .input('PURCHASEORDERDIVISIONID', idResult)
                        .input('STOCKSTYPEID', apiHelper.getValueFromObject(body, 'stocks_type_list', []).map(item => item.id ?? item).join("|"))
                        .input('PRODUCTID',  apiHelper.getValueFromObject(product, 'product_id'))
                        .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
                        .input('MINVALUE', apiHelper.getValueFromObject(product, 'min_value'))
                        .input('CREATEDUSER', authName)
                        .execute('PO_DIVISON_CONTIDITION_INVENTORY_CreateOrUpdate_AdminWeb');
                    }
                    if(is_condition_plans){
                        const result = await new sql.Request(transaction)
                        .input('CONTIDITIONPLANID', null)
                        .input('PURCHASEORDERDIVISIONID', idResult)
                        .input('PRODUCTID',  apiHelper.getValueFromObject(product, 'product_id'))
                        .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
                        .input('PLANVALUE', apiHelper.getValueFromObject(product, 'dk2_value'))
                        .input('CREATEDUSER', authName)
                        .execute('PO_DIVISON_CONTIDITION_PLAN_CreateOrUpdate_AdminWeb');
                    }
                    if(is_condition_history){
                        const buy_number_value = apiHelper.getValueFromObject(product, 'dk3_value') || 0;
                        const result = await new sql.Request(transaction)
                        .input('CONTIDITIONHISTORYID', null)
                        .input('PURCHASEORDERDIVISIONID', idResult)
                        .input('PRODUCTID',  apiHelper.getValueFromObject(product, 'product_id'))
                        .input('STOREID', apiHelper.getValueFromObject(item, 'store_id'))
                        .input('FROMDATE', apiHelper.getValueFromObject(body, 'history_plan_from'))
                        .input('TODATE', apiHelper.getValueFromObject(body, 'history_plan_to'))
                        .input('BUYNUMBERVALUE',buy_number_value)
                        .input('CREATEDUSER', authName)
                        .execute('PO_DIVISON_CONTIDITION_HISTORY_CreateOrUpdate_AdminWeb');
                    }
                }
            }
        }
        await transaction.commit();
        return new ServiceResponse(true, 'Lưu phiếu chia hàng thành công', {
            purchase_order_division_id: idResult,
        });
    } catch (error) {
        transaction.rollback();
        logger.error(error, { function: 'purchaseOrderDivisionService.createOrUpdateMulti' });
        return new ServiceResponse(false, error.message);
    }
};

const getListStockOptions = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams.params, 'company_id'))
            .execute('ST_STOCKS_GetOption_AdminWeb');
        return new ServiceResponse(true, '', purchaseOrderDivisionClass.options(data.recordset));
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.getListStockOptions',
        });
        return new ServiceResponse(false, e.message);
    }
};

const genCode = async function (queryParams) {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute('PO_PURCHASEORDER_DIVISION_GenCode_AdminWeb');
        return new ServiceResponse(
            true,
            '',
            purchaseOrderDivisionClass.genCodeDivision(
                data.recordset && data.recordset.length > 0 && data.recordset[0],
            ),
        );
    } catch (e) {
        logger.error(e, {
            function: 'StocksService.genCode',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getStockOfBusiness = async (bodyParams = {}) => {
    try {
        const business_ids = apiHelper.getValueFromObject(bodyParams, 'business_id', []).map(item => item.id ?? item).join(",")
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BUSINESSIDS', business_ids)
            .execute(spName.getStockOfBusiness);

        return new ServiceResponse(true, '', purchaseOrderDivisionClass.stockOfBusiness(data.recordset));
    } catch (error) {
        logger.error(error, { function: 'purchaseOrderDivisionService.getStockOfBusiness' });
        return new ServiceResponse(false, error.message);
    }
};

const getInventoryByProduct = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSID', apiHelper.getValueFromObject(bodyParams, 'stocks_id'))
            .input('PRODUCTIDS', apiHelper.getValueFromObject(bodyParams, 'product_ids', []).join(','))
            .execute(spName.getInventoryByProduct);
        const inventory_product_list = purchaseOrderDivisionClass.getInventoryByProduct(data.recordset) || [];
        const expected_product_list = purchaseOrderDivisionClass.getExpectedQuantity(data.recordsets[1]) || [];
        const last_list = [...inventory_product_list];
        expected_product_list.forEach(item => {
            const findIndex = last_list.findIndex((i) => item.product_id === i.product_id);
            if(findIndex == -1){
                last_list.push(item);
            }else{
                last_list[findIndex].expected_quantity = last_list[findIndex].expected_quantity + item.expected_quantity
                last_list[findIndex].warehouse_quantity = last_list[findIndex].warehouse_quantity + item.warehouse_quantity
            }
        })

        return new ServiceResponse(true, '', last_list);
    } catch (error) {
        logger.error(error, { function: 'purchaseOrderDivisionService.getInventoryByProduct' });
        return new ServiceResponse(false, error.message);
    }
};

const getBusinessByStore = async (bodyParams = {}) => {
    try {

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('AREAIDS', apiHelper.getValueFromObject(bodyParams, 'area_list', []).map(item => item.id ?? item.value ?? item).join(','))
            .execute(spName.getBusinessByStore);
        const list_business = purchaseOrderDivisionClass.getBusinessByStore(data.recordset) || [];

        return new ServiceResponse(true, '', list_business);
    } catch (error) {
        logger.error(error, { function: 'purchaseOrderDivisionService.getBusinessByStore' });
        return new ServiceResponse(false, error.message);
    }
};

const getProStocksInventory = async (bodyParams = {}) => {
    try {
        
        const stocks_type_list = apiHelper.getValueFromObject(bodyParams, 'stocks_type_list', []);
        const stocksTypeIds = stocks_type_list.map(item=>item.id).join('|');
        const store_apply_list = apiHelper.getValueFromObject(bodyParams, 'store_apply_list', []);
        const storeIds = store_apply_list.map(item=>item.store_id).join('|');
        const product_list = apiHelper.getValueFromObject(bodyParams, 'product_list', []);
        const productIds = product_list.map(item=>item.product_id).join('|');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOCKSTYPEIDS',stocksTypeIds)
            .input('STOREIDS',storeIds)
            .input('PRODUCTIDS',productIds)
            .execute('PO_PURCHASEORDER_DIVISION_GetProStocksInventory_AdminWeb');
        const list = purchaseOrderDivisionClass.proStocksInventoryList(data.recordset) || [];

        return new ServiceResponse(true, '', list);
    } catch (error) {
        logger.error(error, { function: 'purchaseOrderDivisionService.getProStocksInventory' });
        return new ServiceResponse(false, error.message);
    }
};

const getHistoryOrderList = async (bodyParams = {}) => {
    try {
        const store_apply_list = apiHelper.getValueFromObject(bodyParams, 'store_apply_list', []);
        const storeIds = store_apply_list.map(item=>item.store_id).join('|');
        const product_list = apiHelper.getValueFromObject(bodyParams, 'product_list', []);
        const productIds = product_list.map(item=>item.product_id).join('|');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('STOREIDS',storeIds)
            .input('PRODUCTIDS',productIds)
            .input('FROMDAY',apiHelper.getValueFromObject(bodyParams, 'from_day'))
            .input('TODAY',apiHelper.getValueFromObject(bodyParams, 'to_day'))
            .execute('PO_PURCHASEORDER_DIVISION_GetHistoryOrderList_AdminWeb');
        const list = purchaseOrderDivisionClass.getHistoryOrderList(data.recordset) || [];

        return new ServiceResponse(true, '', list);
    } catch (error) {
        logger.error(error, { function: 'purchaseOrderDivisionService.getHistoryOrderList' });
        return new ServiceResponse(false, error.message);
    }
};


module.exports = {
    getList,
    getById,
    createOrUpdate,
    delete: _delete,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
    createOrUpdateWithMultiStore,
    getListStockOptions,
    genCode,
    getStockOfBusiness,
    getInventoryByProduct,
    getBusinessByStore,
    getProStocksInventory,
    getHistoryOrderList
};
