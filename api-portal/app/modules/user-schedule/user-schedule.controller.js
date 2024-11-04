const userScheduleService = require('./user-schedule.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getOptionCompany = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getOptionCompany();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const getOptionBusiness = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getOptionBusiness({ ...req.params, ...req.body, ...req.query });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const getOptionStore = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getOptionStore({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
// get danh sách phân ca làm việc
const getListUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getListUserSchedule(req.query, req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

// tạo phân ca làm việc
const createUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.createUserSchedule(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const updateDetailUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.updateDetailUserSchedule(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const deleteUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.deleteUserSchedule(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
// duyệt phân ca làm việc
const reviewUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.reviewUserSchedule(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const getUserReview = async (req, res, next) => {
    try {
        const shift_id = req.params.shift_id;
        const serviceRes = await userScheduleService.getUserReview(shift_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const getOptionShiftByStoreId = async (req, res, next) => {
    try {
        const store_id = req.params.store_id;
        const serviceRes = await userScheduleService.getOptionShiftByStoreId(store_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getDetailUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getDetailUserSchedule(req.query);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};

const getCurrentUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getCurrentUserSchedule(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const data = serviceRes.getData();
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(error);
    }
};

const getTodayShifts = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getShiftsOfUser(req.body);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const data = serviceRes.getData();
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(error);
    }
};

const updateExplanation = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.updateExplanation(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const data = serviceRes.getData();
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(error);
    }
};

const updateReview = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.updateReview(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

//Export phân ca ho tro
const exportScheduleSupport = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.exportScheduleSupport(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const wb = serviceRes.getData();
        wb.write('DS_Ca_Ho_Tro.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

//Export phân ca
const exportSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.exportSchedule(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const wb = serviceRes.getData();
        wb.write('DS_Phan_Ca.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptionCompany,
    getOptionBusiness,
    getOptionStore,
    createUserSchedule,
    getListUserSchedule,
    updateDetailUserSchedule,
    deleteUserSchedule,
    reviewUserSchedule,
    getUserReview,
    getOptionShiftByStoreId,
    getDetailUserSchedule,
    getCurrentUserSchedule,
    updateExplanation,
    getTodayShifts,
    updateReview,
    exportScheduleSupport,
    exportSchedule,
};
