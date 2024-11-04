const sql = require('mssql');
const mssql = require('../../models/mssql');
const requestPurchaseClass = require('./request-purchase-order.class');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const moment = require('moment');
const pdfHelper = require('../../common/helpers/pdf.helper');
const { spName } = require('./constants');
const { checkReview } = require('./utils');
const SFTPClient = require('../../common/helpers/sftp.helper');
const { connect } = require('../../common/helpers/ssh2.helper');
const { createXMLFile } = require('../../common/helpers/xml.helper');
const { toNonAccentVietnamese } = require('../../common/helpers/string.helper');

const generateCode = async () => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().execute(spName.generateCode);
        return new ServiceResponse(true, '', data.recordset[0].CODE);
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.generateCode' });
        return new ServiceResponse(true, '', '');
    }
};

const createOrUpdate = async (body) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    const generateResult = await generateCode();
    const generatePurchaseCode = generateResult.getData();

    try {
        await transaction.begin();

        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const idUpdate = apiHelper.getValueFromObject(body, 'request_purchase_id');

        let requestPurchaseCode = apiHelper.getValueFromObject(body, 'request_purchase_code');

        if (generatePurchaseCode && !idUpdate) {
            requestPurchaseCode = generatePurchaseCode;
        }

        // create or update request purchase
        const requestPurchaseResult = await new sql.Request(transaction)
            .input('REQUESTPURCHASEID', apiHelper.getValueFromObject(body, 'request_purchase_id'))
            .input('REQUESTPURCHASECODE', requestPurchaseCode)
            .input('REQUESTPURCHASEDATE', apiHelper.getValueFromObject(body, 'request_purchase_date'))
            .input('USERNAME', apiHelper.getValueFromObject(body, 'username'))
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(body, 'is_reviewed', 2))
            .input('ISORDERED', apiHelper.getValueFromObject(body, 'is_ordered'))
            .input('COMPANYID', apiHelper.getValueFromObject(body, 'company_id'))
            .input('BUSINESSREQUESTID', apiHelper.getValueFromObject(body, 'business_request_id'))
            .input('BUSINESSRECEIVEID', apiHelper.getValueFromObject(body, 'business_receive_id'))
            .input('DEPARTMENTREQUESTID', apiHelper.getValueFromObject(body, 'department_request_id'))
            .input('STORERECEIVEID', apiHelper.getValueFromObject(body, 'store_receive_id'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(body, 'supplier_id'))
            .input('DISCOUNTPROGRAMID', apiHelper.getValueFromObject(body, 'discount_program_id'))
            .input('STATUS', apiHelper.getValueFromObject(body, 'status'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
            .input('CREATEDUSER', authName)
            .execute(spName.createOrUpdate);

        const idResult = requestPurchaseResult.recordset[0].RESULT;
        if (!idResult) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi lưu đơn đặt hàng');
        }

        // #region deleteMapping
        if (idUpdate) {
            const list_1 = apiHelper
                .getValueFromObject(body, 'pr_product_list', [])
                .filter((x) => Boolean(x.product_id))
                .map((x) => x.product_id)
                .join('|');
            const list_2 = apiHelper.getValueFromObject(body, 'purchase_requisition_list', []);
            await new sql.Request(transaction)
                .input('REQUESTPURCHASEID', idUpdate)
                .input('PRPRODUCTLIST', list_1)
                .input('PURCHASEREQUISITIONLIST', list_2.join('|'))
                .input('ISHASPURCHASEREQUISITIONLIST', list_2.length > 0 ? 0 : 1)
                .execute(spName.deleteMapping);
        }
        // #endregion deleteMapping

        // #region purchase_requisition_list
        const purchase_requisition_list = apiHelper.getValueFromObject(body, 'purchase_requisition_list', []);
        for (let i = 0; i < purchase_requisition_list.length; i++) {
            const requestTypeList = new sql.Request(transaction);
            await requestTypeList
                .input('REQUESTPURCHASEID', idResult)
                .input('PURCHASEREQUISITIONID', purchase_requisition_list[i])
                .execute(spName.createPR);

            // Cập nhật trạng thái yêu cầu mua hàng -> Đã tổng hợp
            const purchaseRequisition = new sql.Request(transaction);
            await purchaseRequisition
                .input('PURCHASEREQUISITIONID', purchase_requisition_list[i])
                .execute(spName.updateStatusPO);
        }
        // #endregion purchase_requisition_list

        // #region createPRDetail
        const pr_product_list = apiHelper.getValueFromObject(body, 'pr_product_list', []);
        for (let i = 0; i < pr_product_list.length; i++) {
            await new sql.Request(transaction)
                .input('REQUESTPURCHASEID', idResult)
                .input('REQUESTPURCHASEDETAILID', pr_product_list[i].request_purchase_detail_id)
                .input('PRODUCTID', pr_product_list[i].product_id)
                .input('UNITID', pr_product_list[i].unit_id)
                .input('TOTALPRICE', pr_product_list[i].total_price)
                .input('QUANTITYEXPECTED', pr_product_list[i].quantity_expected ?? 0)
                .input('QUANTITYREALITY', pr_product_list[i].quantity_reality ?? 0)
                .input('VATVALUE', pr_product_list[i].vat_value || 0)
                .input('VATPRICE', pr_product_list[i].vat_price || 0)
                .input('PRICENEARLY', pr_product_list[i].price_nearly || 0)
                .input('ISREVIEWED', pr_product_list[i].is_reviewed)
                .input('CREATEDUSER', authName)
                .execute(spName.createPRDetail);
        }
        // #endregion createPRDetail

        body.request_purchase_order_id = idUpdate ?? idResult;
        if (idUpdate) {
            // ReviewLevel
            const requestReviewLevelDel = new sql.Request(transaction);
            const resReviewLevelDel = await deleteReviewLevel(body, requestReviewLevelDel);
            if (resReviewLevelDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resReviewLevelDel.getMessage());
            }
        }

        // ReviewLevel
        const reviewLevels = apiHelper.getValueFromObject(body, 'review_level', []);
        const requestReviewLevel = new sql.Request(transaction);
        for (const reviewLevel of reviewLevels) {
            body.user_name = reviewLevel.user_name;
            body.department_id = reviewLevel.department_id;
            body.is_auto_review = reviewLevel.is_auto_review;
            body.is_complete = reviewLevel.is_complete;
            const resReviewLevel = await createReviewLevel(body, requestReviewLevel);
            if (resReviewLevel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resReviewLevel.getMessage());
            }
            const requestRPOReviewLevel = new sql.Request(transaction);
            body.review_level_id = resReviewLevel.getData();
            const dataRPO = await createRPOReviewLevel(body, requestRPOReviewLevel);
            if (dataRPO.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, dataRPO.getMessage());
            }
        }

        await transaction.commit();
        return new ServiceResponse(true, 'Lưu đơn đặt hàng thành công', {});
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'requestPurchaseService.createOrUpdate' });
        return new ServiceResponse(false, e.message);
    }
};

const createRPOReviewLevel = async (body = {}, reqTrans) => {
    try {
        const requestPurchaseResult = await reqTrans
            .input('REQUESTPURCHASEORDERID', apiHelper.getValueFromObject(body, 'request_purchase_order_id'))
            .input('REVIEWLEVELID', apiHelper.getValueFromObject(body, 'review_level_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
            .execute(`SL_REQUESTPURCHASEORDER_REVIEWLEVEL_Create_AdminWeb`);

        return new ServiceResponse(true, '', {});
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.createRPOReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

const createReviewLevel = async (body = {}, reqTrans) => {
    try {
        const resReviewLevel = await reqTrans
            .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(body, 'department_id'))
            .input('ISAUTOREVIEW', apiHelper.getValueFromObject(body, 'is_auto_review', 0))
            .input('ISCOMPLETE', apiHelper.getValueFromObject(body, 'is_complete', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('SL_REQUESTPURCHASEORDERREVIEWLEVEL_Create_AdminWeb');

        const reviewLevelId = resReviewLevel.recordset[0].id;

        if (!reviewLevelId || reviewLevelId <= 0) {
            return new ServiceResponse(false, 'Tạo hoặc cập nhật mức duyệt thất bại');
        }

        return new ServiceResponse(true, 'Tạo hoặc cập nhật mức duyệt thành công', reviewLevelId);
    } catch (error) {
        logger.error(error, { function: 'requestPurchaseService.createReviewLevel' });
        return new ServiceResponse(false, error.message);
    }
};

const deleteReviewLevel = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('REQUESTPURCHASEORDERID', apiHelper.getValueFromObject(bodyParams, 'request_purchase_order_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('SL_REQUESTPURCHASEORDER_REVIEWLEVEL_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa mức duyệt thành công');
    } catch (error) {
        logger.error(error, { function: 'requestPurchaseService.deleteReviewLevel' });
        return new ServiceResponse(false, error.message);
    }
};

const getList = async (queryParams = {}, body = {}) => {
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
            .input('ISORDERED', apiHelper.getValueFromObject(queryParams, 'is_ordered'))
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .execute(spName.getList);

        const dataRecord = data.recordset;
        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');

        const requestPurchaseOrderList = requestPurchaseClass.list(dataRecord)?.map((item) => {
            const userReviewList = item.user_review_list?.split('|')?.map((user) => {
                const [user_name, full_name, is_reviewed] = user?.split('#');
                return { user_name, full_name: `${user_name} - ${full_name}`, is_reviewed: +is_reviewed };
            });
            const _isUserReviewed = userReviewList?.find((item) => item.user_name == authName)?.is_reviewed;
            return {
                ...item,
                is_reviewed: !item.user_review_list ? 1 : item.is_reviewed,
                user_review_list: userReviewList,
                isUserReviewed: Boolean(_isUserReviewed && _isUserReviewed !== 2),
            };
        });

        return new ServiceResponse(true, '', {
            data: requestPurchaseOrderList,
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const detail = async (requestPurchaseId, body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('REQUESTPURCHASEID', requestPurchaseId).execute(spName.getById);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy đơn đặt hàng');
        }

        const purchase_requisition_list = requestPurchaseClass.detailPR(data.recordsets[1]);

        const authName = apiHelper.getValueFromObject(body, 'auth_name', 'administrator');
        const review_level = requestPurchaseClass
            .detailReviewLevel(data.recordsets[3])
            ?.map((item) => ({ ...item, user_name: parseInt(item.user_name) }));
        const isUserReviewed = review_level?.findIndex((item) => item.user_name == authName)?.is_reviewed !== 2;

        const result = {
            ...requestPurchaseClass.detail(data.recordsets[0][0]),
            purchase_requisition_list,
            review_level,
            isUserReviewed,
        };

        result.purchase_data = result.purchase_data ? JSON.parse(result.purchase_data) : null;

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'requestPurchaseService.detail',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getPRProduct = async (body = {}) => {
    try {
        const purchase_requisition_list = apiHelper.getValueFromObject(body, 'purchase_requisition_list', []).join('|');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('REQUESTPURCHASEID', apiHelper.getValueFromObject(body, 'request_purchase_id'))
            .input('PURCHASEREQUISITIONLIST', purchase_requisition_list)
            .execute(spName.getPRProduct);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy đơn đặt hàng');
        }

        const dataProductDetail = data.recordsets[0].length === 0 ? data.recordsets[1] : data.recordsets[0];

        const result = requestPurchaseClass.detailPRProduct(dataProductDetail);

        // calculate vat price
        // result?.forEach((product) => {
        //     if (!product.vat_price) {
        //         const vatValue = product.vat_value || 0;
        //         const price = product.cost_price || 0;  

        //         const vatPrice = Number((price * (100 + vatValue)) / 100);
        //         product.vat_price = vatPrice;
        //     }
        // });

        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'requestPurchaseService.getPRProduct',
        });
        return new ServiceResponse(false, e.message);
    }
};

const searchPurchaseRequisition = async (body = {}) => {
    try {
        const purchase_requisition_list = apiHelper.getValueFromObject(body, 'purchase_requisition_list', []).join('|');
        const currentPage = apiHelper.getCurrentPage(body);
        const itemsPerPage = apiHelper.getItemsPerPage(body);
        const keyword = apiHelper.getSearch(body);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', keyword)
            .input('PRODUCTID', apiHelper.getValueFromObject(body, 'product_id'))
            .input('PUCHASEREQUISITIONLIST', purchase_requisition_list)
            .execute(spName.searchPurchaseRequisition);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy phiếu yêu cầu mua hàng');
        }

        const result = data.recordsets[0];

        return new ServiceResponse(true, '', {
            data: requestPurchaseClass.searchPurchaseRequisition(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (e) {
        logger.error(e, {
            function: 'requestPurchaseService.searchPurchaseRequisition',
        });
        return new ServiceResponse(false, e.message);
    }
};

const _delete = async (body) => {
    try {
        const ids = apiHelper.getValueFromObject(body, 'ids', []).join('|');
        const pool = await mssql.pool;
        await pool
            .request()
            .input('REQUESTPURCHASEIDS', ids)
            .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(spName.delete);
        return new ServiceResponse(true, '', { data: null });
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService._delete' });
        return new ServiceResponse(false, e.message);
    }
};

const print = async (requestPurchaseId) => {
    try {
        const requestPurchaseDetailRes = await detail(requestPurchaseId);
        const dataPrint = requestPurchaseDetailRes.getData();
        const purchase_requisition_list = (dataPrint.purchase_requisition_list || []).map(
            (item) => item.purchase_requisition_id,
        );

        const prProduct = await getPRProduct({
            request_purchase_id: requestPurchaseId,
            purchase_requisition_list,
        });

        const prProductList = prProduct.getData() || [];
        if (prProductList.length) {
            dataPrint.created_date = moment().format('DD/MM/YYYY');
            dataPrint.product_list = prProductList;

            const fileName = `Don_dat_hang_${dataPrint.request_purchase_code}_${moment().format('DDMMYYYY_HHmmss')}`;

            const print_params = {
                template: 'request-purchase-order.html',
                data: dataPrint,
                filename: fileName,
            };
            await pdfHelper.printPDF(print_params);
            return new ServiceResponse(true, '', {
                dataPrint,
                path: `pdf/${fileName}.pdf`,
            });
        }
        return new ServiceResponse(false, 'Không tìm thấy đơn đặt hàng');
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.print' });
        return new ServiceResponse(true, '', []);
    }
};

const getOrderHistory = async (queryParams = {}) => {
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
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'from_date'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'to_date'))
            .input('PURCHASEREQUISITIONIDS', apiHelper.getValueFromObject(queryParams, 'purchase_requisition_ids'))
            .execute(spName.getOrderHistory);

        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: requestPurchaseClass.getOrderHistory(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.getList' });
        return new ServiceResponse(true, '', {});
    }
};

const getStoreOptionsByPurchaseRequisitionIds = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PURCHASEREQUISITIONIDS', apiHelper.getValueFromObject(queryParams, 'purchase_requisition_ids'))
            .execute('MD_STORE_GetOptionsByPurchaseRequisitionIds_AdminWeb');

        return new ServiceResponse(true, '', requestPurchaseClass.options(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.getStoreOptionsByPurchaseRequisitionIds' });
        return new ServiceResponse(false, e.message);
    }
};

const detailByCode = async (requestPurchaseCode) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('REQUESTPURCHASECODE', requestPurchaseCode).execute(spName.getByCode);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy đơn đặt hàng');
        }

        const detail = requestPurchaseClass.detail(data.recordsets[0][0]);
        const purchase_requisition_list = requestPurchaseClass.detailPR(data.recordsets[1]);

        const productListByPRListRes = await getPRProduct({
            request_purchase_id: detail.request_purchase_id,
            purchase_requisition_list: (purchase_requisition_list || []).map((x) => x.purchase_requisition_id),
        });
        const product_list_v2 = productListByPRListRes.getData() || [];
        const result = {
            ...detail,
            purchase_requisition_list,
            product_list: product_list_v2,
        };
        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'requestPurchaseService.detail',
        });
        return new ServiceResponse(false, e.message);
    }
};

const countIsOrdered = async () => {
    try {
        const pool = await mssql.pool;
        const countRes = await pool.request().execute(spName.countIsOrdered);

        return new ServiceResponse(
            true,
            'Lấy tổng số lượng thành công',
            requestPurchaseClass.countIsOrdered(countRes.recordset),
        );
    } catch (e) {
        logger.error(e, { function: 'purchaseRequisitionService.countIsOrdered' });
        return new ServiceResponse(false, e.message);
    }
};

const detailByMultiPO = async (listPO) => {
    try {
        let codelist = Object.values(listPO)
            .filter((item) => typeof item === 'object' && item.id)
            .map((item) => item.code);
        if (!codelist.length) {
            codelist = Object.values(listPO)
                .filter((item) => typeof item === 'object' && item.value)
                .map((item) => item.label);
        }
        const requestPurchaseCodeList = codelist?.join('|');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('REQUESTPURCHASECODELIST', requestPurchaseCodeList)
            .execute('SL_REQUESTPURCHASEORDER_GetByMultiPO_AdminWeb');

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy đơn đặt hàng');
        }

        const detail = requestPurchaseClass.detail(data.recordsets[0][0]);
        const purchase_requisition_list = requestPurchaseClass.detailPR(data.recordsets[1]);

        const productListByPRListRes = await getPRProduct({
            request_purchase_id: detail.request_purchase_id,
            purchase_requisition_list: (purchase_requisition_list || []).map((x) => x.purchase_requisition_id),
        });
        const product_list_v2 = productListByPRListRes.getData() || [];
        const result = {
            ...detail,
            purchase_requisition_list,
            product_list: product_list_v2,
        };
        return new ServiceResponse(true, '', result);
    } catch (e) {
        logger.error(e, {
            function: 'requestPurchaseService.detail',
        });
        return new ServiceResponse(false, e.message);
    }
};

const getUserByDepartmentId = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('DEPARTMENTID', apiHelper.getValueFromObject(queryParams, 'department_id'))
            .execute(`SL_REQUESTPURCHASEORDER_GetUserByDepartmentId_AdminWeb`);

        return new ServiceResponse(true, '', requestPurchaseClass.getUserByDepartmentId(data.recordset));
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.getUserByDepartmentId' });
        return new ServiceResponse(false, e.message);
    }
};

const updateReview = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('REQUESTPURCHASEID', apiHelper.getValueFromObject(body, 'request_purchase_id'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(body, 'is_reviewed'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('USERNAME', apiHelper.getValueFromObject(body, 'auth_name'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(spName.updateReview);

        const detailRes = await detail(body.request_purchase_id, body);
        const detailData = detailRes.getData();

        const rpoReviewed = checkReview(detailData?.review_level || []);
        await pool
            .request()
            .input('REQUESTPURCHASEID', body.request_purchase_id)
            .input('ISREVIEWED', rpoReviewed)
            .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(spName.updateReviewRPO);

        return new ServiceResponse(true, 'Cập nhật mức duyệt thành công', {});
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.createRPOReviewLevel' });
        return new ServiceResponse(false, e.message);
    }
};

const getPriceNearly = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('SUPPLIERID', apiHelper.getValueFromObject(queryParams, 'supplier_id'))
            .input('PRODUCTID', apiHelper.getValueFromObject(queryParams, 'product_id'))
            .execute(spName.getPriceNearly);

        return new ServiceResponse(true, '', data.recordset[0]?.TOTALPRICE || null);
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.getPriceNearly' });
        return new ServiceResponse(true, '', {});
    }
};

const purchaseSamSung = async (body = {}) => {
    const originData = body.origin_data;
    const confirmedData = body.confirmed_data;

    const requestPurchaseId = originData.request_purchase_id;
    const requestPurchaseCode = confirmedData.purchase_order_number;
    const currentDate = moment().format('YYYY-MM-DD');

    const fileName = 'POSEV' + '-' + requestPurchaseCode + '-' + moment().format('YYYYMMDD') + '.xml';

    try {
        const pool = await mssql.pool;
        const query = `SELECT TOP 1 1 AS RESULT FROM SL_REQUESTPURCHASEORDER WHERE ISDELETED = 0 AND REQUESTPURCHASEID = ${requestPurchaseId} AND (ISPURCHASESAMSUNG <> 1 OR ISPURCHASESAMSUNG IS NULL)`;
        const dataRes = await pool.request().query(query);
        const dataResult = dataRes?.recordset[0] || {};
        if (dataResult && dataResult.RESULT === 1) {
            const data = {
                Order: {
                    $: {
                        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                        xmlns: 'http://www.sec.co.kr/gsbn/GSBN_I_PO_XML_STANDARD_2GSBN_00100',
                    },
                    OrderDetail: {
                        OrderHeader: {
                            OrderPart: {
                                OrderStatus: 'C',
                                // CustomerPONumber:  toNonAccentVietnamese(requestPurchaseCode), // mã đơn hàng
                                CustomerPONumber: 'test', // test production
                                SamsungSONumber: null,
                                OrderIssueDate: currentDate,
                                RequestedDeliveryFromDate: null,
                                RequestedDeliveryToDate: moment(
                                    confirmedData.delivery_expected_date,
                                    'DD/MM/YYYY',
                                ).format('YYYY-MM-DD'),
                                OrderType: 'YN01',
                                OrderCancelByDate: null,
                                CustomerReferenceNumber: null,
                                ReferenceNumber: null,
                                HeaderRemarks: 'Samcenter',
                                CustomerCodeType: 'GSBN',
                                CustomerCode: '3148405',
                            },
                            PartnerPart: {
                                GSBNCustomerCode: '3148405',
                                CustomerName: null,
                                SamsungVendorCode: 'C5H2',
                                SamsungVendorName: 'SEVT',
                                SamsungVendorNumber: '3148405',
                                CustomerContactPerson: confirmedData.contact_name,
                                ContactEmailAddress: confirmedData.contact_email,
                            },
                            ConditionPart: {
                                LanguageCode: 'en',
                                EncodingInfo: 'utf-8',
                                DataTimeZone: 'GMT',
                                TimeZoneCode: null,
                                Incoterms: '0ND',
                                IncotermsDescription: 'Normal Delivery',
                                Incoterms2: null,
                                PaymentTerms: null,
                                PaymentTermsDescription: null,
                                OrderCurrency: 'VND',
                                LCNumber: null,
                                DeliveryType: null,
                                DeliveryCondition: null,
                            },
                            DeliveryPart: {
                                ShipToParty: confirmedData.delivery_address, // mã địa chỉ giao hàng
                                PortOfLoading: null,
                                FinalDestination: null,
                                DeliveryAddress1: null,
                                DeliveryAddress2: null,
                                DeliveryAddress3: null,
                                DeliveryCity: null,
                                DeliveryRegion: null,
                                DeliveryStreet: null,
                                DeliveryCountry: null,
                                DeliveryPostalCode: null,
                                DeliveryTelephoneNumber: null,
                                DeliveryFaxNumber: null,
                            },
                            OrderControlPart: {
                                OrderCreatorName: confirmedData.purchase_creator,
                                OrderCreatorDate: currentDate,
                            },
                        },
                        Item: confirmedData.product_list?.map((product, index) => {
                            return {
                                ItemControlPart: {
                                    CustomerLineItemNumber: (index + 1) * 10, // thứ tự sản phẩm
                                    SamsungLineItemNumber: null,
                                    SamsungModelCode: product.product_code, // mã sản phẩm
                                    STDProductCodeType: null,
                                    STDProductCode: null,
                                    Quantity: product.product_quantity || 1,
                                    UnitOfMeasurement: 'PC',
                                    UnitNormalPrice: product.product_price,
                                    UnitRequestPrice: null,
                                    DCRate: null,
                                    DCAmount: null,
                                    ItemRequestedDeliveryDate: null,
                                    ItemCurrency: 'VND',
                                    ItemRemarks: null,
                                    ItemCategory: null,
                                    Plant: null,
                                },
                            };
                        }),
                    },
                },
            };
            const filePath = await createXMLFile(data, fileName);

            if (filePath) {
                const sftpClient = new SFTPClient();
                const responseMessage = await sftpClient.connect();

                // const shh2Message = await connect();

                const uploadResult = await sftpClient.uploadFile(filePath, fileName);

                if (uploadResult && uploadResult.status) {
                    // save to purchase order
                    const query = `UPDATE SL_REQUESTPURCHASEORDER SET ISPURCHASESAMSUNG = 1, PURCHASEDATA = '${JSON.stringify(
                        confirmedData,
                    )}' WHERE REQUESTPURCHASEID = ${requestPurchaseId}`;
                    await pool.request().query(query);

                    await sftpClient.disconnect();

                    return new ServiceResponse(true, 'Đặt hàng thành công !', { file_path: filePath });
                } else {
                    await sftpClient.disconnect();

                    return new ServiceResponse(false, uploadResult.message, {
                        upload: uploadResult.error,
                        connect: responseMessage,
                        // shh2: shh2Message,
                    });
                }
            } else {
                return new ServiceResponse(false, 'Tạo dữ liệu đặt hàng xảy ra lỗi !');
            }
        } else {
            return new ServiceResponse(false, 'Đơn đặt hàng không hợp lệ hoặc đã được đặt hàng rồi !');
        }
    } catch (e) {
        logger.error(e, { function: 'requestPurchaseService.purchaseSamSung' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    generateCode,
    createOrUpdate,
    delete: _delete,
    getList,
    detail,
    getPRProduct,
    searchPurchaseRequisition,
    print,
    getOrderHistory,
    detailByCode,
    countIsOrdered,
    detailByMultiPO,
    getUserByDepartmentId,
    updateReview,
    getStoreOptionsByPurchaseRequisitionIds,
    getPriceNearly,
    purchaseSamSung,
};
