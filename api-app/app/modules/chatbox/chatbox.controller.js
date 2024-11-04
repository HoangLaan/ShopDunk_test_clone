const service = require('./chatbox.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');

const createGroupConversation = async (req, res, next) => {
    try {
        const serviceRes = await service.createGroupConversation(req.body);

        if (serviceRes.isFailed()) return next(serviceRes);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const addGroupParticipant = async (req, res, next) => {
    try {
        const serviceRes = await service.addGroupParticipant(req.body);

        if (serviceRes.isFailed()) return next(serviceRes);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const pinConversation = async (req, res, next) => {
    try {
        const serviceRes = await service.pinConversation(req.body);

        if (serviceRes.isFailed()) return next(serviceRes);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getConversationList = async (req, res, next) => {
    try {
        const serviceRes = await service.getConversationList({...req.query, ...req.body});

        if (serviceRes.isFailed()) return next(serviceRes);

        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const updateConversation = async (req, res, next) => {
    try {
        const serviceRes = await service.updateConversation(req.body);

        if (serviceRes.isFailed()) return next(serviceRes);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const serviceRes = await service.sendMessage(req.body, req.files, req.auth);

        if (serviceRes.isFailed()) return next(serviceRes);

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getMessageList = async (req, res, next) => {
    try {
        const serviceRes = await service.getMessageList({...req.query, ...req.body});

        if (serviceRes.isFailed()) return next(serviceRes);

        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createGroupConversation,
    addGroupParticipant,
    pinConversation,
    getConversationList,
    updateConversation,
    sendMessage,
    getMessageList,
};
