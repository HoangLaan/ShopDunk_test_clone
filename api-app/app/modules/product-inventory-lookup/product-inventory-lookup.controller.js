const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const service = require('./product-inventory-lookup.service');

const getListProduct = async (req, res, next) => {
    try {
        const serviceRes = await service.getListProduct(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const {data, total, page, limit} = serviceRes.getData();

        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product_id = req.params.product_id;
        const serviceRes = await service.getProduct({product_id});

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getProductByCode = async (req, res, next) => {
    try {
        const serviceRes = await service.getProduct(req.query);

        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListProduct,
    getProductById,
    getProductByCode,
};
