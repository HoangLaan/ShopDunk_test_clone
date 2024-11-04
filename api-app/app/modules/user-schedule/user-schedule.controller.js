const userScheduleService = require("./user-schedule.service");
const SingleResponse = require("../../common/responses/single.response");
const ListResponse = require("../../common/responses/list.response");
const RESPONSE_MSG = require("../../common/const/responseMsg.const");

const getOptionCompany = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getOptionCompany();
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const getOptionBusiness = async (req, res, next) => {
    try {
        const company_id = req.params.company_id;
        const serviceRes = await userScheduleService.getOptionBusiness(company_id);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
};
const getOptionStore = async (req, res, next) => {
    try {
        const business_id = req.params.business_id;
        const serviceRes = await userScheduleService.getOptionStore(business_id);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
}
// get danh sách phân ca làm việc
const getListUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.getListUserSchedule(req.query);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
}

// tạo phân ca làm việc
const createUserSchedule = async (req, res, next) => {
    try {

        const serviceRes = await userScheduleService.createUserSchedule(req.body);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
}

const updateDetailUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.updateDetailUserSchedule(req.body);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
}

const deleteUserSchedule = async (req, res, next) => {
    try {
        const serviceRes = await userScheduleService.deleteUserSchedule(req.body);
        const datares = serviceRes.getData();
        return res.json(new SingleResponse(datares));
    } catch (error) {
        return next(error);
    }
}



module.exports = {
    getOptionCompany,
    getOptionBusiness,
    getOptionStore,
    createUserSchedule,
    getListUserSchedule,
    updateDetailUserSchedule,
    deleteUserSchedule
};
