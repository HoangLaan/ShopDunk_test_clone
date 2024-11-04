const orderService = require('./booking-care.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const { notification } = require('../../common/services/bullmq.service');
const NOTIFY_CONST = require('../../common/const/notify.const');
const moment = require('moment');
const httpStatus = require('http-status');
// const { createStocksoutRequestByOrderID } = require('../stocks-out-request/stocks-out-request.service.js');
const { sendZNSByCusOrderData } = require('../zalo-oa/zalo-oa.service');
const { sendMultipleMessage_V4_post_json } = require('../../common/services/sms.service');
const { compliedTemplate, sendOneMail } = require('./utils');

const getListBooking = async (req, res, next) => {
    try {
        req.query.user_id = req.auth.user_id;
        req.query.user_name = req.auth.user_name;
        const serviceRes = await orderService.getListBooking(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get detail
 */
const detail = async (req, res, next) => {
    try {
        const serviceRes = await orderService.detail(req.params.bookingId, null);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};



const appointment_status = {
    waiting: 1,
    called: 2,
    processing: 4,
    success: 4,
    cancel: 5,
    noreply: 6,
    pending: 7,
};

/**
 * Create
 */
const createBooking = async (req, res, next) => {
    try {
        req.body.booking_id = null;
        const serviceRes = await orderService.createOrUpdateBooking(req.body);
        // if (serviceRes.isFailed()) {
        //     return next(serviceRes);
        // }

        return res.json(
            new SingleResponse(
                // { ...serviceRes.getData(), message: serviceRes.getMessage() },
                RESPONSE_MSG.BOOKING.CREATE_SUCCESS,
            ),
        );
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateBooking = async (req, res, next) => {
    try {
        req.body.booking_id = req.params.bookingId;

        const serviceRes = await orderService.createOrUpdateBooking(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }



        return res.json(
            new SingleResponse(
                { ...serviceRes.getData(), message: serviceRes.getMessage() },
                RESPONSE_MSG.ORDER.UPDATE_SUCCESS,
            ),
        );
    } catch (error) {
        return next(error);
    }
};

const getListCustomer = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getListCustomer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

/**
 * Get list Store
 */
const getListStoreByUser = async (req, res, next) => {
    try {
        const queryParams = {
            search: req.query.search,
            pageSize: req.query.pageSize, // Adjust property name as needed
            currentPage: req.query.currentPage, // Assuming you have currentPage parameter
            // Add other relevant parameters from req.query if needed
        };

        const serviceRes = await orderService.getListStoreByUser(queryParams);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// const createOrderNo = async (req, res, next) => {
//     try {
//         const serviceRes = await orderService.createOrderNo();
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }
//         return res.json(new SingleResponse(serviceRes.getData()));
//     } catch (error) {
//         return next(error);
//     }
// };


/**
 * Delete
 */
const deleteBooking = async (req, res, next) => {
    try {
        const bookingId = req.query.booking_id;
        // const serviceResDetail = await orderService.checkOrderExist(bookingId);
        // if (serviceResDetail.isFailed()) {
        //     return next(serviceResDetail);
        // }

        const serviceRes = await orderService.deleteBooking(bookingId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        //
        return res.json(new SingleResponse(null, RESPONSE_MSG.BOOKING.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const cancelBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId;

        const serviceResDetail = await orderService.detailBooking(bookingId);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        const serviceRes = await orderService.cancelOrder(bookingId, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        // push notify
        if (bookingId) {
            const { order_no } = serviceResDetail.getData();
            notification.add({
                type: 'create_notification',
                source_type: NOTIFY_CONST.ORDER_CANCELLED,
                params: {
                    order_no,
                    source_id: bookingId,
                    created_user: req.auth.full_name,
                    cancelled_date: moment().format('hh:mm A'),
                },
                users: [req.body.auth_name],
            });
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.ORDER.CANCEL_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await orderService.exportExcel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('Danh_sach_dat_lich_SDCare.xlsx', res);
    } catch (error) {
        return next(error);
    }
  };

const exportPDF = async (req, res, next) => {
    try {
        const serviceRes = await orderService.exportPDF(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

//lay danh sach dich vu
const getParentsGroupServices = async (req, res, next) => {
    try {
        const serviceRes = await orderService.getParentsGroupServices(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
};


const countByCustomer = async (req, res, next) => {
    try {
        const serviceRes = await orderService.countByCustomer(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    exportExcel,
    getListStoreByUser,
    // createOrderNo,
    getListCustomer,
    getParentsGroupServices,
    getListBooking,
    detail,
    createBooking,
    deleteBooking,
    exportPDF,
    updateBooking,
    cancelBooking,
    countByCustomer,
};
