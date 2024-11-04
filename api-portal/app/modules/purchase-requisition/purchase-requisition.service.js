const moduleClass = require('./purchase-requisition.class');
const apiHelper = require('../../common/helpers/api.helper');
const pdfHelper = require('../../common/helpers/pdf.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const moment = require('moment');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const { spName } = require('./constants');
const { detailProduct } = require('../product/product.service');

const checkReview = (reviewList) => {
    const pending = 2,
        accept = 1,
        reject = 0;
    // check mức duyệt cuối đã duyệt => phiếu được duyệt
    const isCompleteAndReview = reviewList.find(
        (userReview) =>
            userReview.is_complete === 1 && (userReview.is_review === accept || userReview.is_review === reject),
    );

    if (isCompleteAndReview) return isCompleteAndReview.is_review;
    // check tất cả đã duyệt phiếu => phiếu được duyệt
    const isAllReview = reviewList.every(
        (userReview) => userReview.is_review === accept || userReview.is_review === reject,
    );
    if (!isAllReview) return pending;

    const isRejected = reviewList.some((userReview) => userReview.is_review === reject);
    if (isRejected) return reject;
    return accept;
};

const getList = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const keyword = apiHelper.getSearch(queryParams);
        const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
            .input('PRSTATUSID', apiHelper.getValueFromObject(queryParams, 'pr_status_id'))
            .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(queryParams, 'business_request_id'))
            .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(queryParams, 'department_request_id'))
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
            .input('REVIEWSTATUS', apiHelper.getValueFromObject(queryParams, 'review_status'))
            .execute(spName.getList);

        const dataList = moduleClass.list(data.recordsets[1]);
        const userReviewData = moduleClass.reviewList(data.recordsets[2]);

        dataList.forEach((item) => {
            item.review_level_user_list = userReviewData.filter(
                (userReview) => +userReview.purchase_requisition_id === +item.purchase_requisition_id,
            );
            item.is_reviewed = checkReview(item.review_level_user_list);
        });

        return new ServiceResponse(true, '', {
            data: dataList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(data.recordsets[0]),
        });
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getById = async (purchase_requisition_id) => {
    try {
        const pool = await mssql.pool;

        const purchaseRequisitionRes = await pool
            .request()
            .input('PURCHASEREQUISITIONID', purchase_requisition_id)
            .execute(spName.getById);

        let purchaseRequisition = purchaseRequisitionRes.recordset;

        // If exists MD_PURCHASEREQUISITION
        if (purchaseRequisition && purchaseRequisition.length > 0) {
            purchaseRequisition = moduleClass.detail(purchaseRequisition[0]);

            let productList = purchaseRequisitionRes.recordsets[1];
            if (productList && productList.length) {
                purchaseRequisition = {
                    ...purchaseRequisition,
                    product_list: moduleClass.productList(productList),
                };
            }

            purchaseRequisition.review_level_user_list = moduleClass.levelUserDetailList(
                purchaseRequisitionRes.recordsets[2],
            );
            purchaseRequisition.is_reviewed = checkReview(purchaseRequisition.review_level_user_list);

            return new ServiceResponse(true, '', purchaseRequisition);
        }

        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.detailPurchaseRequisition' });
        return new ServiceResponse(false, e.message);
    }
};

const deletePurchaseRequisition = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('LISTID', apiHelper.getValueFromObject(bodyParams, 'list_id', []))
            .input('NAMEID', 'PURCHASEREQUISITIONID')
            .input('TABLENAME', 'PO_PURCHASEREQUISITION')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        return new ServiceResponse(true, '', true);
    } catch (e) {
        logger.error(e, { function: 'PurchaseRequisitionService.service.deletePurchaseRequisition' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdate = async (bodyParams) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();

        const purchase_requisition_id = apiHelper.getValueFromObject(bodyParams, 'purchase_requisition_id');

        const creatOrUpdateRes = await new sql.Request(transaction)
            .input('PURCHASEREQUISITIONID', purchase_requisition_id)
            .input('PURCHASEREQUISITIONDATE', apiHelper.getValueFromObject(bodyParams, 'purchase_requisition_date'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(bodyParams, 'department_request_id'))
            .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(bodyParams, 'business_request_id'))
            .input('STOREREQUESTID', apiHelper.getValueFromObject(bodyParams, 'store_request_id'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
            .input('TOBUYDATE', apiHelper.getValueFromObject(bodyParams, 'to_buy_date'))
            .input('DOCUMENTNAME', apiHelper.getValueFromObject(bodyParams, 'document_name'))
            .input('DOCUMENTURL', apiHelper.getValueFromObject(bodyParams, 'document_url'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
            .input('PRSTATUSID', apiHelper.getValueFromObject(bodyParams, 'pr_status_id'))
            .input(
                'PURCHASEREQUISITIONTYPEID',
                apiHelper.getValueFromObject(bodyParams, 'purchase_requisition_type_id'),
            )
            .execute(spName.createOrUpdate);
        const purchaseRequisitionId = creatOrUpdateRes.recordset[0].RESULT;

        if (purchaseRequisitionId <= 0) {
            await transaction.rollback();
            throw new ServiceResponse(false, 'Lỗi tạo yêu cầu mua hàng');
        }

        if (Boolean(purchase_requisition_id)) {
            const deleteOldDetail = new sql.Request(transaction);
            await deleteOldDetail
                .input('LISTID', [purchaseRequisitionId])
                .input('NAMEID', 'PURCHASEREQUISITIONID')
                .input('TABLENAME', 'PO_PURCHASEREQUISITION_DETAIL')
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('CBO_COMMON_SOFTDELETE');

            await new sql.Request(transaction)
                .input('PURCHASEREQUISITIONID', purchase_requisition_id)
                .execute(spName.deleteMapping);
        }

        const productList = apiHelper.getValueFromObject(bodyParams, 'product_list', []);
        for (let i = 0; i < productList.length; i++) {
            const createOrUpdateDetail = new sql.Request(transaction);
            const createOrUpdateDetailRes = await createOrUpdateDetail
                .input(
                    'PURCHASEREQUISITIONDETAILID',
                    apiHelper.getValueFromObject(productList[i], 'purchase_requisition_detail_id', null),
                )
                .input('PURCHASEREQUISITIONID', purchaseRequisitionId)
                .input('PRODUCTID', apiHelper.getValueFromObject(productList[i], 'product_id'))
                .input('QUANTITY', apiHelper.getValueFromObject(productList[i], 'quantity', 1))
                .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute(spName.createOrUpdateDetail);

            const purchaseRequisitionDetailId = createOrUpdateDetailRes.recordset[0].RESULT;
            if (purchaseRequisitionDetailId <= 0) {
                await transaction.rollback();
                throw new ServiceResponse(false, 'Lỗi tạo chi tiết yêu cầu mua hàng');
            }
        }

        let review_level_user_list = apiHelper.getValueFromObject(bodyParams, 'review_level_user_list', []);

        if (!Boolean(purchase_requisition_id)) {
            // Check auto duyet nếu phù hợp với định mức tồn kho
            const prodInventoryListReview = [];
            const prodStocksListCountReq = await new sql.Request(transaction);
            const productListIds = productList.map((item) => item.product_id).join('|');
            const prodStocksListCount = await prodStocksListCountReq
                .input('STOREID', apiHelper.getValueFromObject(bodyParams, 'store_request_id'))
                .input('PRODUCTIDS', productListIds)
                .execute('ST_STOCKS_GetInventoryByProductAndStore_AdminWeb');
            const productListCountResult = moduleClass.prodStocksListCount(prodStocksListCount.recordset);

            for (let i = 0; i < productList.length; i++) {
                let prodInventoryItemReview = false;
                const prodItem = productList[i];
                const resProd = await detailProduct(prodItem.product_id);
                const base_inventory_list = resProd.data.base_inventory_list || [];
                if (base_inventory_list.length <= 0) {
                    prodInventoryListReview.push(false);
                    break;
                }
                for (let j = 0; j < base_inventory_list.length; j++) {
                    const { date_from, date_to, quantity_in_stock_min, quantity_in_stock_max } = base_inventory_list[j];
                    const currentDate = moment();
                    const dateFrom = moment(date_from, 'DD/MM');
                    const dateTo = moment(date_to, 'DD/MM');
                    let currentStocksCount =
                        productListCountResult.find((item) => item.product_id === prodItem.product_id)?.stocks_count ||
                        0;
                    let prQuantity = prodItem.quantity || 0;
                    const isReadyBaseInventory =
                        prQuantity + currentStocksCount <= quantity_in_stock_max &&
                        prQuantity + currentStocksCount >= quantity_in_stock_min;
                    const isReadyBetweenDate = currentDate.isBetween(dateFrom, dateTo, null, '[]');
                    // console.log({
                    //   isMax: (prQuantity + currentStocksCount <= quantity_in_stock_max),
                    //   isMin: (prQuantity + currentStocksCount >= quantity_in_stock_min),
                    //   prQuantity,
                    //   currentStocksCount,
                    //   quantity_in_stock_max,
                    //   quantity_in_stock_min,
                    //   isBetween: isReadyBetweenDate,
                    // })
                    if (isReadyBetweenDate && isReadyBaseInventory) {
                        prodInventoryItemReview = true;
                        break;
                    }
                }
                prodInventoryListReview.push(prodInventoryItemReview);
            }
            if (prodInventoryListReview.length > 0 && prodInventoryListReview.every(Boolean)) {
                review_level_user_list = review_level_user_list.map((item) => {
                    return {
                        ...item,
                        is_auto_review: true,
                    };
                });
            }
        }

        // throw new Error('lỗi')

        if (review_level_user_list.length > 0) {
            for (let i = 0; i < review_level_user_list.length; i++) {
                const review_level_user = review_level_user_list[i];
                const isAutoReview = Boolean(review_level_user.is_auto_review);
                await new sql.Request(transaction)
                    .input('USERREVIEW', isAutoReview ? null : review_level_user.user_review)
                    .input('ISAUTOREVIEW', isAutoReview)
                    .input('ISCOMPLETE', review_level_user.is_complete)
                    .input('PURCHASEREQUISITIONREVIEWLEVELID', review_level_user.review_level_id)
                    .input('PURCHASEREQUISITIONID', purchaseRequisitionId)
                    .execute(spName.createReviewLevelUser);
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, '', purchaseRequisitionId);
    } catch (error) {
        logger.error(error, { function: 'purchaseRequisitionService.createOrUpdate' });
        await transaction.rollback();
        return new ServiceResponse(false, error.message);
    }
};

const exportPDF = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;

        const purchase_requisition_id = apiHelper.getValueFromObject(queryParams, 'purchase_requisition_id');

        const data = await pool
            .request()
            .input('PURCHASEREQUISITIONID', purchase_requisition_id)
            .execute(spName.getById);
        let purchaseRequisition = data.recordset;

        if (purchaseRequisition && purchaseRequisition.length > 0) {
            purchaseRequisition = moduleClass.detail(purchaseRequisition[0]);

            const product_list = moduleClass.productList(data.recordsets[1]);

            purchaseRequisition.product_list = product_list;
            purchaseRequisition.total_product = product_list.length || 0;

            const fileName = `Phieu_yeu_cau_mua_hang_${purchaseRequisition.purchase_requisition_code}_${moment().format(
                'DDMMYYYY_HHmmss',
            )}`;

            purchaseRequisition.created_date = moment().format('DD/MM/YYYY');
            // purchaseRequisition.to_buy_date = moment().format('DD/MM/YYYY');
            const print_params = {
                template: 'purchase-requisition.html',
                data: purchaseRequisition,
                filename: fileName,
            };

            await pdfHelper.printPDF(print_params);

            return new ServiceResponse(true, '', { path: `pdf/${fileName}.pdf` });
        }
        return new ServiceResponse(false, 'NOT_FOUND');
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.exportPDF' });
        return new ServiceResponse(true, '', []);
    }
};

const getUserOptions = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('PURCHASEREQUISITIONREVIEWLEVELID', apiHelper.getValueFromObject(queryParams, 'review_level_id'))
            .execute(spName.getUserOptions);

        const data_ = moduleClass.option(data.recordset);
        return new ServiceResponse(true, '', data_);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.getUserOptions' });
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

        let reviewLevelList = moduleClass.reviewLevelList(resData.recordset);
        let departmentList = moduleClass.departmentList(resData.recordsets[1]);
        let positionList = moduleClass.positionList(resData.recordsets[2]);

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
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.createReviewLevel' });
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
            .input('NAMEID', 'PURCHASEREQUISITIONREVIEWLEVELID')
            .input('TABLENAME', 'PO_PURCHASEREQUISITIONREVIEWLEVEL')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        return new ServiceResponse(true, '', data.recordset[0].RESULT);
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.deleteReviewLevel' });
        return new ServiceResponse(false, '', {});
    }
};

const getReviewInformation = async (queryParams) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('PURCHASEREQUISITIONID', apiHelper.getValueFromObject(queryParams, 'purchase_requisition_id'))
            .execute(spName.getReviewInformation);

        return new ServiceResponse(true, '', moduleClass.getReviewInformation(res.recordsets[0]?.[0]));
    } catch (error) {
        logger.error(error, { function: 'purchaseRequisitionService.getReviewInformation' });
        return new ServiceResponse(false, error);
    }
};

const updateReview = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('PURCHASEREQUISITIONID', apiHelper.getValueFromObject(body, 'purchase_requisition_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(body, 'is_review'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('REVIEWUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(spName.updateReview);
        if (!apiHelper.getResult(res.recordset)) {
            return new ServiceResponse(false, 'Lỗi cập nhật duyệt');
        }

        return new ServiceResponse(true, 'Cập nhật duyệt thành công');
    } catch (error) {
        logger.error(error, { function: 'purchaseRequisitionService.updateReview' });
    }
};

const countPrStatus = async (queryParams) => {
    try {
        const total = await _countByQuery(Object.assign({ ...queryParams, review_status: 0 }));
        const review_success = await _countByQuery(Object.assign({ ...queryParams, review_status: 1 }));
        const review_fail = await _countByQuery(Object.assign({ ...queryParams, review_status: 2 }));
        const review_pending = await _countByQuery(Object.assign({ ...queryParams, review_status: 3 }));
        const status_cancel = await _countByQuery(Object.assign({ ...queryParams, pr_status_id: 4 }));

        return new ServiceResponse(true, 'true', {
            review_success,
            review_fail,
            review_pending,
            status_cancel,
            total,
        });
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.countPrStatus' });
        return new ServiceResponse(false, e.message);
    }
};

const _countByQuery = async (queryParams) => {
    const keyword = apiHelper.getSearch(queryParams);
    const createDateFrom = apiHelper.getValueFromObject(queryParams, 'created_date_from');
    const createDateTo = apiHelper.getValueFromObject(queryParams, 'created_date_to');
    const pool = await mssql.pool;
    const data = await pool
        .request()
        .input('KEYWORD', keyword)
        .input('MANUFACTURERID', apiHelper.getValueFromObject(queryParams, 'manufacturer_id'))
        .input('PRSTATUSID', apiHelper.getValueFromObject(queryParams, 'pr_status_id'))
        .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(queryParams, 'business_request_id'))
        .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(queryParams, 'department_request_id'))
        .input('CREATEDDATEFROM', createDateFrom)
        .input('CREATEDDATETO', createDateTo)
        .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
        .input('REVIEWSTATUS', apiHelper.getValueFromObject(queryParams, 'review_status'))
        .execute('PO_PURCHASEREQUISITION_GetListCuont_AdminWeb');

    return data?.recordset[0]?.COUNT || 0;
};

module.exports = {
    getList,
    getById,
    deletePurchaseRequisition,
    createOrUpdate,
    exportPDF,
    getUserOptions,
    getReviewLevelList,
    createReviewLevel,
    deleteReviewLevel,
    getReviewInformation,
    updateReview,
    countPrStatus,
};
