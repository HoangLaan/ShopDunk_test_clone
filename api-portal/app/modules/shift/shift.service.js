const ShiftClass = require('./shift.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const ErrorResponse = require('../../common/responses/error.response');
const { checkExistsValue } = require('../global/global.service');

// create or update Shift
const createOrUpdateShift = async (body = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    await transaction.begin();
    try {
        let {
            time_start = '00:00',
            time_end = '00:00',
            time_break_start = '00:00',
            time_break_end = '00:00',
            time_checkin = '00:00',
            time_checkout = '00:00',
        } = body;

        time_start = time_start.split(':');
        time_end = time_end.split(':');
        time_break_start = time_break_start.split(':');
        time_break_end = time_break_end.split(':');
        time_checkin = time_checkin.split(':');
        time_checkout = time_checkout.split(':');

        const shift_hourstart = time_start ? time_start[0] : 0;
        const shift_minutestart = time_start ? time_start[1] : 0;

        const shift_hourbreakstart = time_break_start ? time_break_start[0] : 0;
        const shift_minusbreakstart = time_break_start ? time_break_start[1] : 0;

        const shift_hourend = time_end ? time_end[0] : 0;
        const shift_minutend = time_end ? time_end[1] : 0;

        const shift_hourbreakend = time_break_end ? time_break_end[0] : 0;
        const shift_minusbreakend = time_break_end ? time_break_end[1] : 0;

        const shift_hourcheckin = time_checkin ? time_checkin[0] : 0;
        const shift_minuscheckin = time_checkin ? time_checkin[1] : 0;

        const shift_hourcheckout = time_checkout ? time_checkout[0] : 0;
        const shift_minuscheckout = time_checkout ? time_checkout[1] : 0;
        const isExists = await checkExistsValue({
            tableName: 'MD_SHIFT',
            fieldCheck: 'SHIFTNAME',
            fieldCheckValue: apiHelper.getValueFromObject(body, 'shift_name'),
            fieldIdUpdate: 'SHIFTID',
            fieldIdUpdateValue: apiHelper.getValueFromObject(body, 'shift_id'),
        });

        if (isExists) {
            throw new Error('Tên ca làm việc đã tồn tại');
        }
        const auth_name = apiHelper.getValueFromObject(body, 'auth_name');
        const shift_id_updated = apiHelper.getValueFromObject(body, 'shift_id');
        const requestShift = new sql.Request(transaction);
        const resultShift = await requestShift
            .input('SHIFTID', shift_id_updated)
            .input('SHIFTNAME', apiHelper.getValueFromObject(body, 'shift_name'))
            .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'shift_description'))
            .input('HOURSTART', shift_hourstart)
            .input('MINUTESTART', shift_minutestart)
            .input('HOUREND', shift_hourend)
            .input('MINUTEEND', shift_minutend)
            .input('SHIFTCODE', apiHelper.getValueFromObject(body, 'shift_code'))
            .input('NUMBEROFWORKDAY', apiHelper.getValueFromObject(body, 'numberofworkday'))
            .input('HOURBREAKSTART', shift_hourbreakstart)
            .input('MINUTEBREAKSTART', shift_minusbreakstart)
            .input('HOURBREAKEND', shift_hourbreakend)
            .input('MINUTEBREAKEND', shift_minusbreakend)
            .input('ISOVERTIME', apiHelper.getValueFromObject(body, 'shift_isovertime'))
            .input('HOURCHECKIN', shift_hourcheckin)
            .input('MINUTECHECKIN', shift_minuscheckin)
            .input('HOURCHECKOUT', shift_hourcheckout)
            .input('MINUTECHECKOUT', shift_minuscheckout)
            .input('MINUTECHECKINLATE', apiHelper.getValueFromObject(body, 'shift_minutecheckinlate'))
            .input('MINUTECHECKOUTEARLY', apiHelper.getValueFromObject(body, 'shift_minutecheckoutearly'))
            .input('ISAPPLYALLDAY', apiHelper.getValueFromObject(body, 'is_apply_week'))
            .input('ISAPPLYMONDAY', apiHelper.getValueFromObject(body, 'is_apply_monday'))
            .input('ISAPPLYTUESDAY', apiHelper.getValueFromObject(body, 'is_apply_tuesday'))
            .input('ISAPPLYWEDNESDAY', apiHelper.getValueFromObject(body, 'is_apply_wednesday'))
            .input('ISAPPLYTHURSDAY', apiHelper.getValueFromObject(body, 'is_apply_thursday'))
            .input('ISAPPLYFRIDAY', apiHelper.getValueFromObject(body, 'is_apply_friday'))
            .input('ISAPPLYSATURDAY', apiHelper.getValueFromObject(body, 'is_apply_saturday'))
            .input('ISAPPLYSUNDAY', apiHelper.getValueFromObject(body, 'is_apply_sunday'))
            .input('SHIFTTIME', apiHelper.getValueFromObject(body, 'shift_time'))
            .input('ISONLINE', apiHelper.getValueFromObject(body, 'is_online'))
            .input('ISCHECKSTORE', apiHelper.getValueFromObject(body, 'is_check_store'))
            .input('ISBREAKSHIFT', apiHelper.getValueFromObject(body, 'is_break_shift'))
            .input('ISSUPPORT', apiHelper.getValueFromObject(body, 'is_support'))
            .input('ISMARKETRESEARCH', apiHelper.getValueFromObject(body, 'is_market_research'))
            .input('ISTRAINING', apiHelper.getValueFromObject(body, 'is_training'))
            .input('CREATEDUSER', auth_name)
            .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
            .execute('MD_SHIFT_CreateOrUpdate_WebAdmin');
        const shift_id_created = resultShift.recordset[0].RESULT;

        if (shift_id_created <= 0) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi lưu ca làm việc');
        }

        const shift_id = shift_id_updated ?? shift_id_created;
        // Ca tăng ca và có user review
        const dataDeleted = await deleteShiftReview({ shift_id, auth_name }, transaction);
        if (dataDeleted.isFailed()) {
            await transaction.rollback();
            return new ServiceResponse(false, 'Lỗi lưu ca làm việc');
        }

        const review_list = apiHelper.getValueFromObject(body, 'shift_review', []);
        if (review_list.length > 0) {
            for (const review of review_list) {
                for (const user of review.user_review) {
                    user.department_id = review.department_id;
                    user.auth_name = auth_name;
                    user.shift_id = shift_id;
                    const data = await createShiftReview(user, transaction);
                    if (data.isFailed()) {
                        await transaction.rollback();
                        return new ServiceResponse(false, 'Lưu mức duyệt không thành công');
                    }
                }
            }
        }

        //Delete mapping store_apply
        const _store_apply_list = apiHelper.getValueFromObject(body, 'store_apply_list', []);
        const store_apply_list = _store_apply_list.map((item) => item?.value).join('|');
        const req1 = new sql.Request(transaction);
        const delStore = await req1
            .input('SHIFTID', shift_id)
            .input('STOREAPPLYLIST', store_apply_list)
            .execute('MD_SHIFTAPPLY_STORE_DeleteMaping_AdminWeb');
        const resDelStore = delStore.recordset[0].RESULT;
        if (!resDelStore) {
            await transaction.rollback();
            throw new Error('Delete mapping store_apply_list failed!');
        }

        //insert or update store_apply
        for (let i = 0; i < _store_apply_list.length; i++) {
            const req = new sql.Request(transaction);
            const createOrupdateStoreApply = await req
                .input('SHIFTID', shift_id)
                .input('STOREID', _store_apply_list[i].value)
                .input('CREATEDUSER', auth_name)
                .execute('MD_SHIFTAPPLY_STORE_CreateOrUpdate_AdminWeb');
        }
        await transaction.commit();
        return new ServiceResponse(true, 'Lưu ca làm việc thành công', shift_id);
    } catch (error) {
        logger.error(error, {
            function: 'shiftservice.createOrUpdateShift',
        });

        await transaction.rollback();
        return new ServiceResponse(false, error.message);
    }
};

const createShiftReview = async (bodyParams = {}, transaction) => {
    try {
        const requestCreateShiftReview = new sql.Request(transaction);
        const resultCreateShiftReview = await requestCreateShiftReview
            .input('SHIFTID', apiHelper.getValueFromObject(bodyParams, 'shift_id'))
            .input('DEPARTMENTID', apiHelper.getValueFromObject(bodyParams, 'department_id'))
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'value'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_SHIFTREIVEW_Create_AdminWeb');
        const shift_review_id = resultCreateShiftReview.recordset[0].id;
        return new ServiceResponse(true, '', shift_review_id);
    } catch (error) {
        logger.error(error, { stocks: 'shiftService.createShiftReview' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteShiftReview = async (bodyParams = {}, transaction) => {
    try {
        const requestShiftReview = new sql.Request(transaction);
        const result = await requestShiftReview
            .input('SHIFTID', apiHelper.getValueFromObject(bodyParams, 'shift_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('MD_SHIFTREIVEW_Delete_AdminWeb');

        // const _shift_id = result.recordset[0].RESULT;
        // if (_shift_id == 'error_1') {
        //     return new ServiceResponse(false, 'Ca làm việc đã được sử dụng không thể xoá', {});
        // }

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, {
            function: 'shiftservice.deleteShiftReview',
        });

        return new ServiceResponse(false, error.message);
    }
};

const getListShift = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const _store_ids = apiHelper.getValueFromObject(queryParams, 'store_ids', []);
        const store_ids = _store_ids.map((item) => item?.value).join('|');
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('STOREIDS', store_ids)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
            .input('CREATEDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('USERID', apiHelper.getValueFromObject(queryParams, 'user_id') || null)
            .execute('MD_SHIFT_GetListShift_WebAdmin');
        const result = data ? data.recordset : [];

        return new ServiceResponse(true, '', {
            data: ShiftClass.list(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, {
            function: 'shiftService.getShiftList',
        });

        return new ServiceResponse(false, '', error);
    }
};

const getDetailShift = async (shift_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('SHIFTID', shift_id).execute('MD_SHIFT_GetDetailShift_WebAdmin');

        const shiftRecord = data.recordset[0];
        if (shiftRecord.length === 0) {
            return new ServiceResponse(false, 'Lấy ca làm việc thất bại');
        }
        const shiftDetail = ShiftClass.detail(shiftRecord);
        let store_apply_list = ShiftClass.list_store_apply(data.recordsets[1]);
        store_apply_list = store_apply_list.map((item) => ({ ...item, value: item.store_id }));
        if (shiftDetail.shift_isovertime) {
            const dataListShiftReview = await getListShiftReviewByShiftId(shift_id);

            const shift_review = [];
            const listShiftReview = dataListShiftReview.getData();
            for (let item of listShiftReview) {
                item = {
                    ...item,
                    user_review: [item.user_name],
                };

                let match = shift_review.find((r) => r.department_id === item.department_id);
                if (match) {
                    match.user_review = match.user_review.concat(item.user_review);
                } else {
                    shift_review.push(item);
                }
                delete item.user_name;
            }
            shiftDetail.shift_review = shift_review;
        }
        shiftDetail.store_apply_list = store_apply_list;

        return new ServiceResponse(true, '', shiftDetail);
    } catch (error) {
        logger.error(error, {
            function: 'shiftService.getDetailShift',
        });

        return new ServiceResponse(false, '', {});
    }
};

const getListShiftReviewByShiftId = async (shift_id) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request().input('SHIFTID', shift_id).execute('MD_SHIFTREIVEW_GetList_AdminWeb');

        return new ServiceResponse(true, '', ShiftClass.list_shift_review(data.recordset));
    } catch (error) {
        logger.error(error, {
            function: 'shiftService.getShiftList',
        });

        return new ServiceResponse(false, '', error);
    }
};

const deleteShift = async (shift_id, body) => {
    const pool = await mssql.pool;

    try {
        const result = await pool
            .request()
            .input('SHIFTID', shift_id)
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute('MD_SHIFT_DeleteShift_WebAdmin');

        const _shift_id = result.recordset[0].RESULT;

        if (_shift_id == 'error_1') {
            return new ServiceResponse(false, 'Ca làm việc đã được sử dụng không thể xoá', {});
        }

        return new ServiceResponse(true, '');
    } catch (error) {
        logger.error(error, {
            function: 'shiftservice.deleteShift',
        });

        return new ServiceResponse(false, error.message);
    }
};

const gencode = async () => {
    try {
        const pool = await mssql.pool;

        const data = await pool.request().execute('MD_SHIFT_GenShiftCode_AdminWeb');
        const code = data.recordset[0];
        if (code) {
            return new ServiceResponse(true, '', code);
        }
        return new ServiceResponse(false, '', null);
    } catch (error) {
        logger.error(error, {
            function: 'shiftservice.gencode',
        });

        return new ServiceResponse(false, error.message);
    }
};

const getStoreList = async (queryParams) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PAGESIZE', itemsPerPage)
            .input('PAGEINDEX', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('COMPANYID', apiHelper.getValueFromObject(queryParams, 'company_id'))
            .input('BUSINESSID', apiHelper.getValueFromObject(queryParams, 'business_id'))
            .input('CLUSTERID', apiHelper.getValueFromObject(queryParams, 'cluster_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .execute('MD_STORE_GetList_AdminWeb');
        const result = data.recordset;

        return new ServiceResponse(true, '', {
            data: ShiftClass.storeList(result),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(result),
        });
    } catch (error) {
        logger.error(error, {
            function: 'shiftservice.getStoreList',
        });

        return new ServiceResponse(false, error.message);
    }
};

module.exports = {
    createOrUpdateShift,
    getListShift,
    getDetailShift,
    deleteShift,
    gencode,
    getStoreList,
};
