const SingleResponse = require('../../common/responses/single.response');
const voipService = require('./voip.service');
const ListResponse = require('../../common/responses/list.response');

/**
 * Create
 */
const syncExtension = async (req, res, next) => {
    try {
        const serviceRes = await voipService.syncExtension(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Đồng bộ thành công'));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get List Cdrs
 */
const getListCdrs = async (req, res, next) => {
    try {
        const serviceRes = await voipService.getListCdrs(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data?.data, total, page, limit, { missed_counts: data?.missed_counts }));
    } catch (error) {
        return next(error);
    }
};

/**
 * Sync data
 */
const syncDataCdrToTask = async (req, res, next) => {
    try {
        const serviceRes = await voipService.syncDataCdrToTask(req.params);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Đồng bộ thành công'));
    } catch (error) {
        return next(error);
    }
};

const createTaskForRecall = async (req, res, next) => {
    try {
        const serviceRes = await voipService.createTaskForRecall(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), 'Tạo chi tiết cuộc gọi thành công'));
    } catch (error) {
        return next(error);
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await voipService.exportExcel({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const wb = serviceRes.getData();
        wb.write('users.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

// const transferCall = async (req, res, next) => {
//     try {
//         const serviceRes = await voipService.transferCall(Object.assign({},req.params, req.body));
//         if (serviceRes.isFailed()) {
//             return next(serviceRes);
//         }
//         return res.json(new SingleResponse(serviceRes.getData(), 'Chuyển cuộc gọi thành công'));
//     } catch (error) {
//         return next(error);
//     }
// };

const getVoipExt = async (req, res, next) => {
    try {
        const serviceRes = await voipService.getVoipExt({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    syncExtension,
    getListCdrs,
    syncDataCdrToTask,
    createTaskForRecall,
    exportExcel,
    getVoipExt,
    // transferCall
};
