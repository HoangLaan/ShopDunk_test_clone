const OffWorkService = require('./offwork.service');
// const MailboxService = require('../mailboxv2/mailbox.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
// const MailService = require('../../common/services/mail.service');
/**
 * Get list AM_COMPANY
 */
const getListOffWork = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.getListOffWork(Object.assign({}, req.query, req.body));
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createOffWork = async (req, res, next) => {
    try {
        req.body.auth = req.auth;
        const serviceRes = await OffWorkService.createOffWork(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const offWorkId = serviceRes.getData();
        const serviceDetailRes = await OffWorkService.detailOffWork(offWorkId);
        if (serviceDetailRes.isFailed()) {
            return next(serviceDetailRes);
        }
        // let mail = serviceDetailRes.getData();
        // const users = (mail.offwork_review_list || [])
        //     .filter((x) => !x.is_auto_review && !x.review_date)
        //     .map((x) => ({ ...x, user_name: x.review_user }))
        // mail.offwork_review_link = `http://portal.skymond.vn/off-work/review/${offWorkId}`
        // if (users && users.length) {
        //     mail.users = [users[0]];
        // }
        // // Neu có user send thì mới send
        // if (mail.users && mail.users.length) {
        //     const serviceSendRes = await MailService.sendToInside(mail);
        //     if (serviceSendRes.isFailed()) {
        //         return next(serviceSendRes);
        //     }
        // }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailOffWork = async (req, res, next) => {
    try {
        let useReview = req.query.useReview;
        let offWorkId = req.params.offWorkId;
        let existsReview = 1;
        if (useReview) {
            // nếu vào với link duyệt phép check xem user đó còn trong danh sách duyệt hay không
            const serviceRes = await OffWorkService.checkIsExistsReview(offWorkId, req.body);
            if (serviceRes.isFailed()) {
                return next(serviceRes);
            }
            existsReview = serviceRes.getData();
        }

        if (existsReview) {
            const serviceRes = await OffWorkService.detailOffWork(offWorkId, req.body);
            if (serviceRes.isFailed()) {
                return next(serviceRes);
            }
            return res.json(new SingleResponse(serviceRes.getData()));
        } else {
            return res.json(new SingleResponse({ is_not_exists: 1 }));
        }
    } catch (error) {
        return next(error);
    }
};

const updateOffWork = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.updateOffWork(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const offWorkId = serviceRes.getData();
        const serviceDetailRes = await OffWorkService.detailOffWork(offWorkId);
        if (serviceDetailRes.isFailed()) {
            return next(serviceDetailRes);
        }
        // let mail = serviceDetailRes.getData();
        // const users = (mail.offwork_review_list || [])
        //     .filter((x) => !x.is_auto_review && !x.review_date)
        //     .map((x) => ({ ...x, user_name: x.review_user }))
        // mail.offwork_review_link = `http://portal.skymond.vn/off-work/review/${offWorkId}`
        // if (users && users.length) {
        //     mail.users = [users[0]];
        // }
        // // Neu có user send thì mới send
        // if (mail.users && mail.users.length) {
        //     const serviceSendRes = await MailService.sendToInside(mail);
        //     if (serviceSendRes.isFailed()) {
        //         return next(serviceSendRes);
        //     }
        // }
        return res.json(new SingleResponse(RESPONSE_MSG.OFFWORKRL.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const deleteOffWork = async (req, res, next) => {
    try {
        // Check campaign exists
        const serviceRes = await OffWorkService.deleteOffWork(req.params.offWorkId, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(RESPONSE_MSG.OFFWORKRL.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};
const approvedOffWorkReviewList = async (req, res, next) => {
    try {
        req.body.auth = req.auth;
        const serviceRes = await OffWorkService.approvedOffWorkReviewList(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        // Lay thong tin nghi phep
        const { offWorkId = 0 } = req.params;
        const serviceDetailRes = await OffWorkService.detailOffWork(offWorkId);
        if (serviceDetailRes.isFailed()) {
            return next(serviceDetailRes);
        }
        // // Chi gui mail neu duyet la dong y
        // if (req.body.is_review) {
        //     // Gui thong tin duyet tiep theo
        //     let mail = serviceDetailRes.getData();
        //     const users = (mail.offwork_review_list || [])
        //         .filter((x) => !x.is_auto_review && !x.review_date)
        //         .map((x) => ({ ...x, user_name: x.review_user }))
        //     mail.offwork_review_link = `/off-work/review/${offWorkId}`
        //     if (users && users.length) {
        //         mail.users = [users[0]];
        //     }
        //     // Neu có user send thì mới send
        //     if (mail.users && mail.users.length) {
        //         const serviceSendRes = await MailService.sendToInside(mail);
        //         if (serviceSendRes.isFailed()) {
        //             return next(serviceSendRes);
        //         }
        //     }
        // }
        return res.json(new SingleResponse(serviceDetailRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const getTotalDayOffWork = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.getTotalDayOffWork(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const getUserOfDepartmentOpts = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.getUserOfDepartmentOpts({ ...req.query, ...req.body });
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getUserScheduleOtps = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.getUserScheduleOtps(Object.assign({}, req.query, req.auth));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateConfirm = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.updateConfirm(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.getMessage()));
    } catch (error) {
        return next(error);
    }
};

const exportListOffWork = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.exportListOffWork(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(
                new ErrorResponse(httpStatus.NOT_IMPLEMENTED, serviceRes.getErrors(), 'Xuất file không thành công.'),
            );
        }

        const wb = serviceRes.getData();
        wb.write('DS_Nghi_Phep.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListOffWork,
    createOffWork,
    detailOffWork,
    updateOffWork,
    deleteOffWork,
    approvedOffWorkReviewList,
    getTotalDayOffWork,
    getUserOfDepartmentOpts,
    getUserScheduleOtps,
    updateConfirm,
    exportListOffWork,
};
