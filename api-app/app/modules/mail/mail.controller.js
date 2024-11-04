const mailService = require('./mail.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const ErrorResponse = require('../../common/responses/error.response');
const httpStatus = require('http-status');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const config = require('../../../config/config');
const axios = require('axios');

const getListInbox = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.getListInbox(user_name, req.query);

        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getListIncomingInDay = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        req.query.is_get_by_current_day = 1;
        const serviceRes = await mailService.getListInbox(user_name, req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        console.log(error.message);
        return next(error);
    }
};

const deleteMail = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.deleteMail(user_name, req.params.mailId);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListSent = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.getListSent(user_name, req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

const getListFlagged = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.getListFlagged(user_name, req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getListDraft = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.getListDraft(user_name, req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getDraftById = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.getDraftById(user_name, req.params.mailId);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteDraft = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.deleteDraft(user_name, req.params.mailId);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListTrash = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.getListTrash(user_name, req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const deleteTrash = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.deleteTrash(user_name, req.params.mailId);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const undoMailTrash = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.undoMailTrash(user_name, req.params.mailId);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.getById(user_name, req.params.mailId);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

// send a mail
const createMail = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.createOrUpdate(user_name, req.files, req.body);
        if (serviceRes.isFailed()) return next(serviceRes);

        axios({
            method: 'post',
            url: `${config.domain_service}/mail`,
            data: {
                ...req.body,
                mail_id: serviceRes.getData()?.[1] || '',
            },
            headers: {Authorization: `APIKEY ${config.service_apikey}`},
        })
            .then(response => {})
            .catch(error => {})
            .finally(() => {});

        return res.json(new SingleResponse(serviceRes.getData()?.[0], req?.messageSuccess));
    } catch (error) {
        return next(error);
    }
};

//update draft and send mail
const updateMail = async (req, res, next) => {
    try {
        const {user_name} = req.auth;

        // check is mail draft
        const checkExistRes = await mailService.getDraftById(user_name, req.params.mailId);
        if (checkExistRes.isFailed()) return next(new ErrorResponse(httpStatus.NOT_FOUND, {}, RESPONSE_MSG.NOT_FOUND));

        const serviceRes = await mailService.createOrUpdate(user_name, req.files, req.body, req.params.mailId);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()?.[0]));
    } catch (error) {
        console.log(error.message);
        return next(error);
    }
};

// Create and save draft
const saveDraft = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.createOrUpdate(
            user_name,
            req.files,
            Object.assign(req.body, {is_draft: 1}),
        );
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()?.[0]));
    } catch (error) {
        return next(error);
    }
};

// update draft and save draft
const updateDraft = async (req, res, next) => {
    try {
        const {user_name} = req.auth;

        // check is mail draft
        const checkExistRes = await mailService.getDraftById(user_name, req.params.mailId);
        if (checkExistRes.isFailed()) return next(new ErrorResponse(httpStatus.NOT_FOUND, {}, RESPONSE_MSG.NOT_FOUND));

        const serviceRes = await mailService.createOrUpdate(
            user_name,
            req.files,
            Object.assign(req.body, {is_draft: 1}),
            req.params.mailId,
        );
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()?.[0]));
    } catch (error) {
        return next(error);
    }
};

const toggleFlagged = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.toggleFlagged(user_name, req.params.mailId);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getStatusIncomingMail = async (req, res, next) => {
    try {
        const {user_name} = req.auth;

        const serviceRes = await mailService.getStatusIncomingMail(user_name);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListUserView = async (req, res, next) => {
    try {
        const serviceRes = await mailService.getListUserView(Object.assign({}, req.params, req.body, req.query));
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListMailNotRead = async (req, res, next) => {
    try {
        const serviceRes = await mailService.getListMailNotRead(req.body, req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateStatusAllMail = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await mailService.updateStatusAllMail(user_name);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), 'Update status all mail success'));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListInbox,
    getListIncomingInDay,
    deleteMail,
    getListSent,
    getListFlagged,
    getListDraft,
    getDraftById,
    getListTrash,
    deleteTrash,
    undoMailTrash,
    getById,
    createMail,
    updateMail,
    saveDraft,
    updateDraft,
    toggleFlagged,
    getStatusIncomingMail,
    deleteDraft,
    undoMailTrash,
    getListUserView,
    getListMailNotRead,
    updateStatusAllMail,
};
