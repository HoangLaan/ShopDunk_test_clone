const OffWorkService = require('./offwork.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const MailService = require('../../common/services/mail.service');
const mailController = require('../mail/mail.controller');
const config = require('../../../config/config');

const getListOffWork = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.getListOffWork(Object.assign({}, req.query, req.body));

        const {data, total, page, limit} = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const createOffWork = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.createOffWork(req.body, req.files, req.auth);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const dataMail = serviceRes.getData();
        if (dataMail.is_refuse) {
            req.body = dataMail;
            req.messageSuccess = serviceRes.getMessage();
            await mailController.createMail(req, res, next);
        }

        const {list_payload_mail_review = []} = dataMail;
        for (const item of list_payload_mail_review) {
            req.body = item;
            req.messageSuccess = 'Gửi mail người duyệt thành công';
            await mailController.createMail(req, res, next);
        }

        // const offWorkId = serviceRes.getData();
        // const serviceDetailRes = await OffWorkService.detailOffWork(offWorkId);
        // if (serviceDetailRes.isFailed()) {
        //     return next(serviceDetailRes);
        // }
        // let mail = serviceDetailRes.getData();
        // const users = (mail.offwork_review_list || [])
        //     .filter(x => !x.is_auto_review && !x.review_date)
        //     .map(x => ({...x, user_name: x.review_user}));
        // mail.offwork_review_link = `${config.domain_cdn}/off-work/review/${offWorkId}`;
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
        console.log(error);
        return next(error);
    }
};

const getTotalDayOffWork = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.getTotalDayOffWork(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const approvedOffWorkReviewList = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.approvedOffWorkReviewList(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        // Lay thong tin nghi phep
        const {offWorkId = 0} = req.params;
        const serviceDetailRes = await OffWorkService.detailOffWork(offWorkId);
        if (serviceDetailRes.isFailed()) {
            return next(serviceDetailRes);
        }

        const dataMail = serviceRes.getData();
        req.body = dataMail;
        req.messageSuccess = serviceRes.getMessage();
        await mailController.createMail(req, res, next);
        // if (req.body.is_review) {
        //     // Gui thong tin duyet tiep theo
        //     let mail = serviceDetailRes.getData();
        //     const users = (mail.offwork_review_list || [])
        //         .filter(x => !x.is_auto_review && !x.review_date)
        //         .map(x => ({...x, user_name: x.review_user}));
        //     mail.offwork_review_link = `http://inside.blackwind.vn/off-work/review/${offWorkId}`;
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

const getListOffWorkReview = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.getListOffWorkReview(Object.assign({}, req.query, req.body));
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const detailOffWorkReview = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.detailOffWorkReview(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListUserRefuse = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.getListUserRefuse(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailOffWork = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkService.detailOffWork(req.params?.offWorkId);
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
        const serviceRes = await OffWorkService.updateConfirm(req.params?.offWorkId);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListOffWork,
    createOffWork,
    getTotalDayOffWork,
    approvedOffWorkReviewList,
    getListOffWorkReview,
    detailOffWorkReview,
    getListUserRefuse,
    detailOffWork,
    updateConfirm,
};
