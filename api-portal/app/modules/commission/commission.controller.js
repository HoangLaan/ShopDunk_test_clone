const commissionService = require('./commission.service');
const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');
const helper = require('./helper');

const getListCommission = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.getListCommission(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getCommissionCompanyOptions = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.getCommissionCompanyOptions(req.query);
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(error);
    }
};

const detailCommission = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.detailCommission(req.params.commissionId, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data));
    } catch (error) {
        return next(error);
    }
};

const createCommission = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.createCommission(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data, 'Tạo mới thành công'));
    } catch (error) {
        return next(error);
    }
};

const updateCommission = async (req, res, next) => {
    try {
        const commissionId = req.params.commissionId;
        req.body.commission_id = commissionId;

        const checkExists = await commissionService.detailCommission(commissionId, {});
        if (checkExists.isFailed()) {
            return next(checkExists);
        }

        const serviceRes = await commissionService.updateCommission(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data } = serviceRes.getData();
        return res.json(new SingleResponse(data, 'Cập nhật thành công'));
    } catch (error) {
        return next(error);
    }
};

const stopCommission = async (req, res, next) => {
    try {
        const commissionId = req.params.commissionId;
        req.body.commission_id = commissionId;

        const checkExists = await commissionService.detailCommission(commissionId, {});
        if (checkExists.isFailed()) {
            return next(checkExists);
        }

        const serviceRes = await commissionService.stopCommission(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Dừng hoa hồng thành công'));
    } catch (error) {
        return next(error);
    }
};

const deleteCommission = async (req, res, next) => {
    try {
        const commissionId = req.params.commissionId;
        req.body.commission_id = commissionId;

        const checkExists = await commissionService.detailCommission(commissionId, {});
        if (checkExists.isFailed()) {
            return next(checkExists);
        }

        const serviceRes = await commissionService.deleteCommission(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Xóa hoa hồng thành công'));
    } catch (error) {
        return next(error);
    }
};

const delCommissionIds = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.delCommissionIds(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Xóa hoa hồng thành công'));
    } catch (error) {
        return next(error);
    }
};

const getDepartmentPosition = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.getDepartmentPosition(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getDepartmentPositionV2 = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.getDepartmentPositionV2(req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getUserDepartmentOptions = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.getUserDepartmentOptions(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOrderTypeOptions = async (req, res, next) => {
    try {
        const serviceRes = await commissionService.getOrderTypeOptions(Object.assign(req.body, req.query));

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const changeStatusReview = async (req, res, next) => {
    try {
        let objParams = helper.objAssign(req.body, req.query);
        const serviceRes = await commissionService.changeStatusReview(objParams);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getListCommission,
    getCommissionCompanyOptions,
    detailCommission,
    createCommission,
    updateCommission,
    stopCommission,
    deleteCommission,
    delCommissionIds,
    getDepartmentPosition,
    getDepartmentPositionV2,
    getUserDepartmentOptions,
    getOrderTypeOptions,
    changeStatusReview,
};
