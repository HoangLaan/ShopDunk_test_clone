const transferShiftClass = require('./transfer-shift.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');

const getList = async (params = {}) => {
    try {
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const page = apiHelper.getCurrentPage(params);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'search'))
            .input('TRANSFERSHIFTTYPEID', apiHelper.getValueFromObject(params, 'transfer_shift_type_id'))
            .input('TRANSFERSTATUS', apiHelper.getValueFromObject(params, 'transfer_status'))
            .input('TRANSFERDATEFROM', apiHelper.getValueFromObject(params, 'date_from', ''))
            .input('TRANSFERDATETO', apiHelper.getValueFromObject(params, 'date_to', ''))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', page)
            .execute(PROCEDURE_NAME.HR_TRANSFERSHIFT_GETLIST_APP);
        let trasferShifts = transferShiftClass.list(res.recordsets[0]);
        const list_user_review = transferShiftClass.listUserReivew(res.recordsets[1]);
        trasferShifts = (trasferShifts || []).map(x => ({
            ...x,
            list_user: list_user_review.filter(user => user.transfer_shift_id === x.transfer_shift_id),
        }));
        return new ServiceResponse(true, '', {
            list: trasferShifts,
            total: apiHelper.getTotalData(res.recordsets[0]),
            itemsPerPage: itemsPerPage,
            page: page,
        });
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.getList'});
        return new ServiceResponse(false, error);
    }
};

//Lấy danh sách yêu cầu duyệt chuyển ca theo người duyệt
const getListReviewByUser = async params => {
    try {
        const itemsPerPage = apiHelper.getItemsPerPage(params);
        const page = apiHelper.getCurrentPage(params);
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'search'))
            .input('TRANSFERDATEFROM', apiHelper.getValueFromObject(params, 'date_from', ''))
            .input('TRANSFERDATETO', apiHelper.getValueFromObject(params, 'date_to', ''))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', page)
            .execute(PROCEDURE_NAME.HR_TRANSFERSHIFTREVIEWLIST_GETLIST_APP);
        let trasferShifts = transferShiftClass.listReviewByUser(res.recordsets[0]);
        const list_user_review = transferShiftClass.listUserReivew(res.recordsets[1]);
        trasferShifts = (trasferShifts || []).map(x => ({
            ...x,
            list_user: list_user_review.filter(user => user.transfer_shift_id === x.transfer_shift_id),
        }));
        return new ServiceResponse(true, '', {
            list: trasferShifts,
            total: apiHelper.getTotalData(res.recordsets[0]),
            itemsPerPage: itemsPerPage,
            page: page,
        });
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.getList'});
        return new ServiceResponse(false, error);
    }
};

const createOrUpdate = async (id = null, params = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        const reqCreateOrUpdate = new sql.Request(transaction);
        const dataCreateOrUpdate = await reqCreateOrUpdate
            .input('TRANSFERSHIFTID', id)
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('TRANSFERSHIFTTYPEID', apiHelper.getValueFromObject(params, 'transfer_shift_type_id'))
            .input('DATEFROM', apiHelper.getValueFromObject(params, 'date_from'))
            .input('DATETO', apiHelper.getValueFromObject(params, 'date_to'))
            .input('CURRENTSHIFTID', apiHelper.getValueFromObject(params, 'current_shift_id'))
            .input('CURRENTSTOREID', apiHelper.getValueFromObject(params, 'current_store_id'))
            .input('CURRENTBUSINESSID', apiHelper.getValueFromObject(params, 'current_business_id'))
            .input('NEWSHIFTID', apiHelper.getValueFromObject(params, 'new_shift_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(params, 'business_id'))
            .input('STOREID', apiHelper.getValueFromObject(params, 'store_id'))
            .input('REASON', apiHelper.getValueFromObject(params, 'reason'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name', null))
            .execute(PROCEDURE_NAME.HR_TRANSFERSHIFT_CREATEORUPDATE_APP);
        if (!apiHelper.getResult(dataCreateOrUpdate.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false);
        }
        const list_review = apiHelper.getValueFromObject(params, 'list_review');
        if (id) {
            const reqDeleteReview = new sql.Request(transaction);
            const dataDeleteReview = await reqDeleteReview
                .input('TRANSFERSHIFTID', id)
                .input('DELETEUSER', apiHelper.getValueFromObject(params, 'auth_name'))
                .execute(PROCEDURE_NAME.HR_TRANSFERSHIFTREVIEWLIST_DELETEMANY_APP);
            if (!apiHelper.getResult(dataDeleteReview.recordset)) {
                await transaction.rollback();
                return new ServiceResponse(false);
            }
        }

        if (list_review.length > 0) {
            const reqCreateOrUpdateReview = new sql.Request(transaction);
            for (const element of list_review) {
                const dataCreateOrUpdateReview = reqCreateOrUpdateReview
                    .input(
                        'TRANSFERSHIFTREVIEWLISTID',
                        apiHelper.getValueFromObject(element, 'transfer_shift_review_list_id'),
                    )
                    .input('TRANSFERSHIFTID', apiHelper.getResult(dataCreateOrUpdate.recordset))
                    .input('REVIEWLEVELID', apiHelper.getValueFromObject(element, 'review_level_id'))
                    .input('REVIEWUSER', apiHelper.getValueFromObject(element, 'review_user'))
                    .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
                    .execute(PROCEDURE_NAME.HR_TRANSFERSHIFTREVIEWLIST_CREATEORUPDATE_APP);
                if (!apiHelper.getResult((await dataCreateOrUpdateReview).recordset)) {
                    await transaction.rollback();
                    return new ServiceResponse(false);
                }
            }
        }
        //NẾU LÀ LOẠI CHUYỂN TỰ ĐỘNG SẼ THỰC HIỆN CHUYỂN CA
        const res = new sql.Request(transaction);
        const data = await res
            .input('TRANSFERSHIFTID', apiHelper.getResult(dataCreateOrUpdate.recordset))
            .execute(PROCEDURE_NAME.HR_USER_SCHEDULE_TRANSFERSHIFT_APP);
        if (!apiHelper.getResult(data.recordset)) {
            await transaction.rollback();
            return new ServiceResponse(false);
        }
        removeCacheOptions();
        await transaction.commit();
        return new ServiceResponse(true);
    } catch (error) {
        await transaction.rollback();
        logger.error(error, {function: 'transferShiftService.createOrUpdate'});
        return new ServiceResponse(false, error);
    }
};

const detail = async id => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('TRANSFERSHIFTID', id)
            .execute(PROCEDURE_NAME.HR_TRANSFERSHIFT_GETBYID_APP);
        let list_review = transferShiftClass.listReview(res.recordsets[1]);
        let list_user = transferShiftClass.listUser(res.recordsets[2]);
        list_review = (list_review || []).map(x => ({
            ...x,
            list_user: list_user.filter(u => u.review_level_id === x.review_level_id),
        }));
        return new ServiceResponse(true, '', {
            ...transferShiftClass.detail(res.recordsets[0]?.[0]),
            list_review: list_review,
        });
    } catch (e) {
        logger.error(e, {function: 'transferShiftService.getDetail'});
        return new ServiceResponse(false, e.message);
    }
};

const updateReview = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('TRANSFERSHIFTREVIEWLISTID', apiHelper.getValueFromObject(params, 'transfer_shift_review_list_id'))
            .input('ISREVIEW', apiHelper.getValueFromObject(params, 'is_review'))
            .input('REVIEWNOTE', apiHelper.getValueFromObject(params, 'review_note'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(params, 'auth_name'))
            .execute(PROCEDURE_NAME.HR_TRANSFERSHIFTREVIEWLIST_UPDATEREVIEW_APP);
        if (!apiHelper.getResult(res.recordset)) {
            return new ServiceResponse(false, 'Lỗi cập nhật duyệt');
        }

        return new ServiceResponse(true, 'Cập nhật duyệt thành công');
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.createReview'});
        return new ServiceResponse(false, e.message);
    }
};

//Kiểm tra quyền duyệt (Người trước đó duyệt chưa or là mức duyệt cuối)
const getReviewInformation = async params => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('TRANSFERSHIFTID', apiHelper.getValueFromObject(params, 'transfer_shift_id'))
            .execute(PROCEDURE_NAME.HR_TRANSFERSHIFTREVIEWLIST_GETREVIEWINFORMATION_APP);

        return new ServiceResponse(true, '', {
            ...transferShiftClass.detail(res.recordsets[0]?.[0]),
            ...transferShiftClass.detailReview(res.recordsets[1]?.[0]),
        });
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.checkReview'});
        return new ServiceResponse(false, error);
    }
};

// Lấy danh sách ca
const getShift = async params => {
    try {
        let total_day = countWeekdays(
            parseDate(apiHelper.getValueFromObject(params, 'date_from')),
            parseDate(apiHelper.getValueFromObject(params, 'date_to')),
        );
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('STOREID', apiHelper.getValueFromObject(params, 'store_id'))
            .input('DATEFROM', apiHelper.getValueFromObject(params, 'date_from'))
            .input('TOTALDAY', total_day)
            .input('DATETO', apiHelper.getValueFromObject(params, 'date_to'))
            .input('USERNAME', apiHelper.getValueFromObject(params, 'auth_name'))
            .input('CURRENTSHIFTID', apiHelper.getValueFromObject(params, 'current_shift_id'))
            .execute(PROCEDURE_NAME.HR_USER_SCHEDULE_GETSHIFT_APP);
        return new ServiceResponse(true, '', transferShiftClass.listShift(res.recordset));
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.getShiftByStoreAndDate'});
        return new ServiceResponse(false, error);
    }
};

// Lấy danh sách store
const getStore = async param => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('BUSINESSID', apiHelper.getValueFromObject(param, 'business_id'))
            .execute(PROCEDURE_NAME.MD_STORE_GET_APP);
        return new ServiceResponse(true, '', transferShiftClass.listStore(res.recordset));
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.getStore'});
        return new ServiceResponse(false, error);
    }
};

// Lấy danh sách miền
const getBusiness = async param => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute(PROCEDURE_NAME.AM_BUSINESS_GETALL_APP);
        return new ServiceResponse(true, '', transferShiftClass.listBusiness(res.recordset));
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.getStore'});
        return new ServiceResponse(false, error);
    }
};

//Lấy danh sách mức duyệt
const getListReview = async params => {
    try {
        const pool = await mssql.pool;
        const res = await pool
            .request()
            .input('TRANSFERSHIFTTYPEID', apiHelper.getValueFromObject(params, 'transfer_shift_type_id'))
            .execute(PROCEDURE_NAME.HR_TRANSFERSHIFT_LEVEL_USER_GETLISTBYTRANSFERSHIFTTYPE_APP);
        let list_review = transferShiftClass.listReview(res.recordsets[0]);
        let list_user = transferShiftClass.listUser(res.recordsets[1]);
        list_review = (list_review || []).map(x => ({
            ...x,
            list_user: list_user.filter(user => user.review_level_id === x.review_level_id),
        }));
        return new ServiceResponse(true, '', list_review);
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.getListReview'});
        return new ServiceResponse(false, error);
    }
};

const getListTransferShiftType = async () => {
    try {
        const pool = await mssql.pool;
        const res = await pool.request().execute(PROCEDURE_NAME.HR_TRANSFERSHIFT_TYPE_GETALL_APP);
        return new ServiceResponse(true, '', transferShiftClass.listTransferShiftType(res.recordset));
    } catch (error) {
        logger.error(error, {function: 'transferShiftService.getListTransferShiftType'});
        return new ServiceResponse(false, error);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.HR_TRANSFERSHIFT_OPTIONS);
};

const parseDate = (dateString, key = '/') => {
    const parts = dateString.split(key);
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
};

const countWeekdays = (startDate = new Date(), endDate = new Date()) => {
    let count = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
};
module.exports = {
    getList,
    createOrUpdate,
    detail,
    updateReview,
    getReviewInformation,
    getShift,
    getListReview,
    getListTransferShiftType,
    getStore,
    getBusiness,
    getListReviewByUser,
};
