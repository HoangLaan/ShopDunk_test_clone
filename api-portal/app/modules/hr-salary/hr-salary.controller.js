const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const service = require('./hr-salary.service');

const getListHrSalary = async (req, res, next) => {
    try {
        const serviceRes = await service.getListHrSalary(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const delHrSalary = async (req, res, next) => {
    try {
        const serviceRes = await service.delHrSalary(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(true, 'Xoá mức lương thành công'));
    } catch (error) {
        return next(error);
    }
};

const createOrUpdateHrSalary = async (req, res, next) => {
    try {
        const serviceRes = await service.createOrUpdateHrSalary(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Thêm mới/Cập nhật mức lương thành công.'));
    } catch (error) {
        return next(error);
    }
};

const getHrSalaryById = async (req, res, next) => {
    try {
        let {id = 0} = req.params;
        const serviceRes = await service.getHrSalaryById(id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListHrSalary,
    delHrSalary,
    getHrSalaryById,
    createOrUpdateHrSalary,
};
