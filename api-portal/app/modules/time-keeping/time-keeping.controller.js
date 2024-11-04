const timeKeepingService = require('./time-keeping.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const httpStatus = require('http-status');

const getListUser = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.getListUser(req.query, req.body);
        const { data, total, page, limit, is_lock_confirm, list_holiday } = serviceRes.getData();

        let dataRed = new ListResponse(data, total, page, limit);

        dataRed.data.is_lock_confirm = is_lock_confirm;
        dataRed.data.list_holiday = list_holiday;
        return res.json({ ...dataRed });
    } catch (error) {
        return next(error);
    }
};
const getListTimeKeepingByUser = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.getListTimeKeepingByUser(req.query, req.body);
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(error);
    }
};
const getListOption = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.getListOption(req.query);
        const { datares } = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const createOrUpdateSchedule = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.createOrUpdateSchedule(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(error);
    }
};
const createOrUpdateTimeKeeping = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.createOrUpdateTimeKeeping(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(error);
    }
};
const deleteSchedule = async (req, res, next) => {
    try {
        const schedule_id = req.params.schedule_id;

        const serviceRes = await timeKeepingService.deleteSchedule(schedule_id, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.ACCOUNT.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
const createOrUpdateTimeKeepingList = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.createOrUpdateTimeKeepingList(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'success'));
    } catch (error) {
        return next(error);
    }
};
const checkPerMission = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.checkPerMission(req.body);
        const { finaldata } = serviceRes.getData();
        return res.json(new SingleResponse(finaldata));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes =
            // Object.assign({}, req.query, req.body)?.users?.length === 1
            //     ? await timeKeepingService.exportExcel(Object.assign({}, req.query, req.body))
            //     : 
            await timeKeepingService.exportExcelMultipleUser(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed())
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        const wb = serviceRes.getData();
        wb.write('DS_CHAM_CONG.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const exportExcelTimeKeeping = async (req, res, next) => {
    try {
        const serviceRes =
            await timeKeepingService.exportExcelMultipleUserTimeKeeping(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed())
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        const wb = serviceRes.getData();
        wb.write('Xuat_cong.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const getListShiftQC = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.getListShiftQC({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) return next(serviceRes)
        const { list, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(list, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getListBrokenShift = async (req, res, next) => {
    try {
        const serviceRes = await timeKeepingService.getListBrokenShift({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) return next(serviceRes)
        const { list, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(list, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListUser,
    getListOption,
    createOrUpdateSchedule,
    createOrUpdateTimeKeeping,
    deleteSchedule,
    createOrUpdateTimeKeepingList,
    checkPerMission,
    getListTimeKeepingByUser,
    exportExcel,
    getListShiftQC,
    getListBrokenShift,
    exportExcelTimeKeeping
};