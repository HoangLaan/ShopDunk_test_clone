const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const logger = require('../../common/classes/logger.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const BorrowTypeClass = require('./borrow-request.class');
const ServiceResponse = require('../../common/responses/service.response');

const createOrUpdateHandler = async (idUpdate, bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);

    try {
        await transaction.begin();
        const authName = apiHelper.getValueFromObject(bodyParams, 'auth_name', 'administrator');
        const borrowRequestId = apiHelper.getValueFromObject(bodyParams, 'borrow_request_id');
        let labelCR = 'Thêm mới';
        if (borrow_request_id) {
            labelCR = 'Cập nhật';
        }
        //Create or update borrow reqquest
        const createOrUpdateBorrowRequest = new sql.Request(transaction);
        const createOrUpdateBorrowRequestResult = await createOrUpdateBorrowRequest
            .input('BORROWREQUESTID', borrowRequestId)
            .input('BORROWREQUESTCODE', apiHelper.getValueFromObject(bodyParams, 'borrow_request_code'))
            .input('BORROWTYPEID', apiHelper.getValueFromObject(bodyParams, 'borrow_type_id'))
            .input('BORROWSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'stock_borrow_id'))
            .input('EXPORTSTOCKSID', apiHelper.getValueFromObject(bodyParams, 'stock_out_id'))
            .input('BORROWDATERECEIVE', apiHelper.getValueFromObject(bodyParams, 'date_borrow'))
            .input('BORROWDATERETURN', apiHelper.getValueFromObject(bodyParams, 'date_return'))
            .input('BORROWUSER', apiHelper.getValueFromObject(bodyParams, 'employee_borrow'))
            .input('PARTNERCONTACTID', 1)
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('CREATEDUSER', authName)
            .execute('SL_BORROWREQUEST_CreateOrUpdate_AdminWeb');

        const idBorrowRequest = createOrUpdateBorrowRequestResult.recordset[0]?.RESULT;
        if (!idBorrowRequest) {
            await transaction.rollback();
            return new ServiceResponse(false, `Không ${labelCR} được đề xuất mượn hàng`, {});
        }

        // delete soft borrow request detail with id
        const checkBorrowRequest = parseInt(borrowRequestId) ?? 0;
        if(borrowRequestId) {
            const deleteBorrowRequestDetail = new sql.Request(transaction);
            
                await deleteBorrowRequestDetail
                .input('LISTID', [checkBorrowRequest])
                .input('NAMEID', 'BORROWREQUESTID')
                .input('TABLENAME', 'SL_BORROWREQUESTDETAIL')
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('CBO_COMMON_SOFTDELETE');
        }

        const productBorrow = apiHelper.getValueFromObject(bodyParams, 'list_product_borrow', []);
        const createOrUpdateProductBorrow = new sql.Request(transaction);
        for(let i = 0; i < productBorrow.length; i ++) {
            const createOrUpdateProductBorrowResult = await createOrUpdateProductBorrow
            .input('BORROWREQUESTID', borrowRequestId)
            .input('PRODUCTID', apiHelper.getValueFromObject(productBorrow[i], 'product_id'))
            .input('QUANTITY', apiHelper.getValueFromObject(productBorrow[i], 'quantity'))
            .input('NOTE', apiHelper.getValueFromObject(productBorrow[i], 'reason'))
            .input('CREATEDUSER', authName)
            .execute('SL_BORROWREQUESTDETAIL_CreateOrUpdate_AdminWeb');

            const idProductBorrow = createOrUpdateProductBorrowResult.recordset[0]?.RESULT;
            if (!idProductBorrow) {
                await transaction.rollback();
                return new ServiceResponse(false, `Không ${labelCR} được sản phẩm mượn hàng`, {});
            }
        }

        // delete soft borrow request detail with id
        if(borrowRequestId) {
            const deleteBorrowRequestReview = new sql.Request(transaction);
            
                await deleteBorrowRequestReview
                .input('LISTID', [checkBorrowRequest])
                .input('NAMEID', 'BORROWREQUESTID')
                .input('TABLENAME', 'SL_BORROWREVIEWLIST')
                .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
                .execute('CBO_COMMON_SOFTDELETE');
        }

        const listReviewBorrow = apiHelper.getValueFromObject(bodyParams, 'borrow_request_review', []);
        const createOrUpdateListReviewBorrow = new sql.Request(transaction);
        for(let i = 0; i < listReviewBorrow.length; i ++) {
            const createOrUpdateListReviewBorrowResult = await createOrUpdateListReviewBorrow
            .input('BORROWREQUESTID', borrowRequestId)
            .input('BORROWREVIEWLEVELID', apiHelper.getValueFromObject(listReviewBorrow[i], 'borrow_review_level_id'))
            .input('REVIEWUSER', apiHelper.getValueFromObject(listReviewBorrow[i], 'user_review'))
            .input('CREATEDUSER', authName)
            .execute('SL_BORROWREVIEWLIST_CreateOrUpdate_AdminWeb');

            const idReviewBorrow = createOrUpdateListReviewBorrowResult.recordset[0]?.RESULT;
            if (!idReviewBorrow) {
                await transaction.rollback();
                return new ServiceResponse(false, `Không ${labelCR} được duyệt mượn hàng`, {});
            }
        }
        
        await transaction.commit();
        return new ServiceResponse(true, 'Thêm đề xuất mượn hàng thành công', {});
    } catch (error) {
        await transaction.rollback();
        logger.error(error, { function: 'BorrowRequestService.createOrUpdate' });
        return new ServiceResponse(false, error.message);
    }
};

const getListReviewByType = async (queryParams = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BORROWTYPEID', apiHelper.getValueFromObject(queryParams, 'borrow_type_code'))
            .execute('SL_BORROWTYPE_GetListReview_AdminWeb');
        const resData = BorrowTypeClass.listReview(data.recordset);
        const resDataTrans = resData.map((item) => {
            return { ...item, users: item.users ? BorrowTypeClass.detailUser(JSON.parse(item.users)) : [] };
        });
        return new ServiceResponse(true, '', { data: resDataTrans || [] });
    } catch (e) {
        logger.error(e, { function: 'regimeService.getListReviewRegime' });
        return new ServiceResponse(true, '', {});
    }
};

const getListBorrowRequest = async (params = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(params);
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const keyword = apiHelper.getValueFromObject(params, 'search');
        const createDateFrom = apiHelper.getValueFromObject(params, 'created_date_from');
        const createDateTo = apiHelper.getValueFromObject(params, 'created_date_to');

        const pool = await mssql.pool;
        const borrow_requests = await pool
            .request()
            .input('KEYWORD', keyword)
            .input('USERLOGIN', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('CREATEDDATEFROM', createDateFrom)
            .input('CREATEDDATETO', createDateTo)
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .execute(PROCEDURE_NAME.SL_BORROWREQUEST_GETLIST_ADMINWEB);
            
            const resultArrray = borrow_requests.recordsets;
            let dataResult = BorrowTypeClass.list(resultArrray[0]);
            let datasReview = BorrowTypeClass.listReview(resultArrray[1]);

            let totalDataResult = apiHelper.getTotalData(resultArrray[0]);

            dataResult = dataResult.map((p) => ({
                ...p,
                review_list: datasReview.filter((val) => val.borrow_request_id == p.borrow_request_id),
            }));
            
            return new ServiceResponse(true, '', {
                data: dataResult,
                page: currentPage,
                limit: itemsPerPage,
                total: totalDataResult,
            });
    } catch (error) {
        logger.error(e, { function: 'BorrowRequestService.getListBorrowRequest' });
        return new ServiceResponse(true, '', []);
    }
};

const getDetailBorrowRequest = async (idBorRequest) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
            .input('BORROWREQUESTID', idBorRequest)
            .execute(PROCEDURE_NAME.SL_BORROWREQUEST_GETBYID_ADMINWEB);
        const dataBorrowRequest = data.recordsets;
        if (dataBorrowRequest[0] && dataBorrowRequest[0].length > 0) {
            let dataBorrowRequestResult = BorrowTypeClass.detail(dataBorrowRequest[0][0]);
            dataBorrowRequestResult.list_product_borrow = BorrowTypeClass.detailProduct(dataBorrowRequest[1]);
            let borrow_request_review_list = BorrowTypeClass.detailReview(dataBorrowRequest[2]) ?? [];
            borrow_request_review_list[0].users = BorrowTypeClass.detailUser(dataBorrowRequest[3]) ?? [];
            dataBorrowRequestResult.borrow_request_review_list = borrow_request_review_list;
            return new ServiceResponse(true, '', dataBorrowRequestResult);
        }
        return new ServiceResponse(false, RESPONSE_MSG.NOT_FOUND);
    } catch (e) {
        logger.error(e, { 'function': 'BorrowRequestService.detailBorrowRequest' });
        return new ServiceResponse(false, e.message);
    }
};


const deleteBorrowRequest = async (bodyParams) => {
    const pool = await mssql.pool;
    try {
        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'BORROWREQUESTID')
            .input('TABLENAME', 'SL_BORROWREQUEST')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
            
        return new ServiceResponse(true, 'Xóa đề xuất mượn hàng thành công', {});
    } catch (e) {
        logger.error(e, { function: 'BorrowRequestService.deleteBorrowRequest' });
        return new ServiceResponse(false, e.message);
    }
};

const reviewBorrowRequest = async (idBorrowRequest, bodyParams = {}) => {
    try {
        let idBorrowRequestParse = parseInt(idBorrowRequest) ?? 0;
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('BORROWREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'borrow_review_level_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(bodyParams, 'is_review'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(bodyParams, 'review_note'))
            .input('USERNAME', bodyParams.auth_name)
            .input('BORROWREQUESTID', idBorrowRequestParse)
            .execute('SL_BORROWREQUEST_Approve_List_AdminWeb');
        let result = data.recordset[0].RESULT;
        switch (result) {
            case 1:
                return new ServiceResponse(true, 'Duyệt thành công');
            default:
                return new ServiceResponse(false, 'Duyệt không thành công');
        }
    } catch (e) {
        logger.error(e, { function: 'BorrowRequestService.approvedBorrowReqquestReviewList' });

        return new ServiceResponse(false, e.message);
    }
};


module.exports = {
    createOrUpdateHandler,
    getListReviewByType,
    getListBorrowRequest,
    getDetailBorrowRequest,
    deleteBorrowRequest,
    reviewBorrowRequest,
};
