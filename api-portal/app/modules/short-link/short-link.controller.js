const ListResponse = require('../../common/responses/list.response');
const SingleResponse = require('../../common/responses/single.response');
const shortLinkService = require('../short-link/short-link.service');
/**
 * Get list options province
 */
const createOrUpdate = async (req, res, next) => {
    try {
        const serviceRes = await shortLinkService.createOrUpdate(Object.assign({},req.body,req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), ''));
    } catch (error) {
        return next(error);
    }
};

const getList = async (req, res, next) => {
    try {
        const serviceRes = await shortLinkService.getList(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const serviceRes = await shortLinkService.getById(req.params.short_link_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const handleDelete = async (req, res, next) => {
    try {
        const serviceRes = await shortLinkService.handleDelete(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, 'ok'));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createOrUpdate,
    getList,
    getById,
    handleDelete
};
