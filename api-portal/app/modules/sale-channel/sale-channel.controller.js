const saleChannelService = require('./sale-channel.service');
const SingleResponse = require('../../common/responses/single.response');
const ErrorResponse = require('../../common/responses/error.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const httpStatus = require('http-status');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');

const getUserStatus = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getUserStatus(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getUserToken = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getUserToken(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const syncFacebookData = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.syncFacebookData(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const syncPageData = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.syncPageDataNew(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListPage = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListPage(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListFileByConversationId = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListFileByConversationId(
            Object.assign({}, req.params, req.body, req.query),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListPageToSync = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListPageToSync(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListPageConnect = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListPageConnect(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deletePageConnect = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.deletePageConnect(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListConversation = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListConversation(
            Object.assign({}, req.body, req.params, req.query),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getPageAccessToken = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getPageAccessToken(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const detailFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.detailFacebookUser(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.deleteFacebookUser(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getMessageFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getMessageFacebookUser(
            Object.assign({}, req.query, req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getMessageFacebookLive = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getMessageFacebookLive(
            Object.assign({}, req.query, req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, paging} = serviceRes.getData();
        return res.json(new ListResponse(data, 0, paging));
    } catch (error) {
        return next(error);
    }
};

const sendMessageFacebookUser = async (req, res, next) => {
    try {
        let file = null;
        if (req.files && req.files.length) {
            file = req.files[0];
        }
        const serviceRes = await saleChannelService.sendMessageFacebookUser(
            Object.assign({}, {file}, req.query, req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateMessageFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.updateMessageFacebookUser(
            Object.assign({}, req.query, req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const upload = async (req, res, next) => {
    try {
        if (!req.files || !req.files.length)
            return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Vui lòng chọn file để tải lên.'));
        let file = req.files[0];
        let url = file;
        if (file.buffer || !file.includes(config.domain_cdn)) {
            url = await fileHelper.saveFileFB(file, req.body.file_name);
            if (!url) return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, {}, 'Lỗi tải file.'));
            url = `${config.domain_cdn}${url}`;
        }
        res.json(new SingleResponse(url));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const updatePageAvatar = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.updatePageAvatar(
            Object.assign({}, req.query, req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListHashTag = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListHashTag(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createHashTag = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.createHashTag(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateHashTag = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.updateHashTag(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteHashTag = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.deleteHashTag(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListHashTagFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListHashTagFacebookUser(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createOrUpdateHashTagFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.createOrUpdateHashTagFacebookUser(
            Object.assign({}, req.body, req.params),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListNoteFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListNoteFacebookUser(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createNoteFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.createNoteFacebookUser(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const deleteNoteFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.deleteNoteFacebookUser(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const updateFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.updateFacebookUser(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListOrderFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListOrderFacebookUser(Object.assign({}, req.body, req.params));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getListProduct = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListProduct(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const {data, total, page, limit} = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

// Lấy danh sách sản phẩm có gợi ý
const searchProduct = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.searchProduct(Object.assign({}, req.params, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

//Lấy thông tin sản phẩm
const detailProduct = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.detailProduct(Object.assign({}, req.params, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const getListPromotion = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.getListPromotion(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createOrderFacebookUser = async (req, res, next) => {
    try {
        const serviceRes = await saleChannelService.createOrderFacebookUser(
            Object.assign({}, req.params, req.body, req.query),
        );
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getUserStatus,
    getUserToken,
    syncFacebookData,
    getListPage,
    getListPageToSync,
    getListPageConnect,
    syncPageData,
    deletePageConnect,
    getListConversation,
    getPageAccessToken,
    updatePageAvatar,
    detailFacebookUser,
    deleteFacebookUser,
    getMessageFacebookUser,
    sendMessageFacebookUser,
    updateMessageFacebookUser,
    upload,
    getListHashTag,
    createHashTag,
    deleteHashTag,
    updateHashTag,
    getListHashTagFacebookUser,
    createOrUpdateHashTagFacebookUser,
    getListNoteFacebookUser,
    createNoteFacebookUser,
    deleteNoteFacebookUser,
    updateFacebookUser,
    getListOrderFacebookUser,
    getListProduct,
    searchProduct,
    detailProduct,
    getListPromotion,
    createOrderFacebookUser,
    getListFileByConversationId,
    getMessageFacebookLive,
};
