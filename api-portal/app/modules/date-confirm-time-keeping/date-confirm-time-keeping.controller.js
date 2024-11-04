const SingleResponse = require("../../common/responses/single.response");
const ListResponse = require("../../common/responses/list.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");
const optionService = require('../../common/services/options.service');
const timeKeepingDateConfrimService = require("./date-confirm-time-keeping.service");

const getListTimeKeepingDateConfirm = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingDateConfrimService.getListTimeKeepingDateConfirm(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));

    } catch (error) {
        return next(error);
    }
}

const timeKeepingDateConfirmCreateOrUpdate = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingDateConfrimService.timeKeepingDateConfirmCreateOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}
//CheckTimeKeepingDateConfirm
const CheckTimeKeepingDateConfirm = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingDateConfrimService.CheckTimeKeepingDateConfirm();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Check ngày chốt công'));

    } catch (error) {
        return next(error);
    }
}
const getOptionTimeKeepingDateConfirm = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingDateConfrimService.getTimeKeepingDateConfirm(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));

    } catch (error) {
        return next(error);
    }
}


const getMonthApplyTimeKeeping = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingDateConfrimService.getMonthApplyTimeKeeping();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));

    } catch (error) {
        return next(error);
    }
}
//getMonthApplyTimeKeeping
const deleteTimeKeepingDateConfirm = async (req, res, next) => {
    try {
        const time_keeping_confirm_date_id = req.params.time_keeping_confirm_date_id;
        // Check exists
        const CheckFilterID = await timeKeepingDateConfrimService.getTimeKeepingDateConfirm(req.params);
        if (CheckFilterID.isFailed()) {
            return next(CheckFilterID);
        }

        // Delete
        const serviceRes = await timeKeepingDateConfrimService.deleteTimeKeepingDateConfirm(time_keeping_confirm_date_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(null, RESPONSE_MSG.PRODUCT.DELETE_SUCCESS)
        );
    } catch (error) {
        return next(error);
    }
}

//getMonthApplyTimeKeeping
const UpdateTimeKeepingDateConfirm = async (req, res, next) => {
    try {
        const time_keeping_confirm_date_id = req.params.time_keeping_confirm_date_id;
        const serviceRes = await timeKeepingDateConfrimService.timeKeepingDateConfirmCreateOrUpdate({ time_keeping_confirm_date_id, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
}


//getMonthApplyTimeKeeping
const deleteTimeKeepingDateConfirmList = async (req, res, next) => {
    try {
        // Delete
        const serviceRes = await timeKeepingDateConfrimService.deleteTimeKeepingDateConfirmList(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(
            new SingleResponse(null, RESPONSE_MSG.PRODUCT.DELETE_SUCCESS)
        );
    } catch (error) {
        return next(error);
    }
}



module.exports = {
    getListTimeKeepingDateConfirm,
    timeKeepingDateConfirmCreateOrUpdate,
    getOptionTimeKeepingDateConfirm,
    deleteTimeKeepingDateConfirm,
    CheckTimeKeepingDateConfirm,
    getMonthApplyTimeKeeping,
    UpdateTimeKeepingDateConfirm,
    deleteTimeKeepingDateConfirmList
}
