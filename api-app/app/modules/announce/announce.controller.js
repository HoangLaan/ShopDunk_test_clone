const announceService = require('./announce.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

const getListAnnounce = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await announceService.getListAnnounce(user_name, req.query);
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await announceService.getById(user_name, req.params);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListUserView = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListUserView(req.params.announce_id);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getTotalUnreadByUsername = async (req, res, next) => {
    const {user_name} = req.auth;
    try {
        const serviceRes = await announceService.getTotalUnreadByUsername(user_name);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};
const createUserView = async (req, res, next) => {
    const {user_name} = req.auth;
    const {announce_id} = req.body;
    try {
        const serviceRes = await announceService.createUserView(user_name, announce_id);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

//comment

const getListAnnounceComment = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListAnnounceComment(req.body, req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListReplyComment = async (req, res, next) => {
    try {
        const serviceRes = await announceService.getListReplyComment(req.body, req.query);
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createAnnounceComment = async (req, res, next) => {
    try {
        const body = JSON.parse(JSON.stringify(req.body));

        if (!body.comment_content && !req.file) {
            return res.status(400).json({
                message: 'Vui lòng nhập nội dung hoặc đính kèm ảnh, video',
                status: 400,
            });
        }

        const serviceRes = await announceService.createAnnounceCommentOrUpdate(body, req.file, req.auth);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const likeOrDisLikeAnnounceComment = async (req, res, next) => {
    try {
        const serviceRes = await announceService.likeOrDisLikeAnnounceComment(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const updateStatusAllAnnounceRead = async (req, res, next) => {
    try {
        const {user_name} = req.auth;
        const serviceRes = await announceService.updateStatusAllAnnounceRead(user_name);
        if (serviceRes.isFailed()) return next(serviceRes);
        return res.json(new SingleResponse(serviceRes.getData(), 'Update status all announcements success'));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListAnnounce,
    getById,
    getListUserView,
    getTotalUnreadByUsername,
    createUserView,
    getListAnnounceComment,
    getListReplyComment,
    createAnnounceComment,
    likeOrDisLikeAnnounceComment,
    updateStatusAllAnnounceRead,
};
