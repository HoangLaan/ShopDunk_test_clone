const brandService = require('./brand.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');

const getListBrand = async (req, res, next) => {
    try {
        const serviceRes = await brandService.getListBrand(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

const detailBrand = async (req, res, next) => {
    try {
        // Check company exists
        const serviceRes = await brandService.detailBrand(req.params.brand_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const createBrand = async (req, res, next) => {
    try {
        const serviceRes = await brandService.createBrandOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const updateBrand = async (req, res, next) => {
    try {
        const brand_id = req.params.brand_id;
        req.body.brand_id = brand_id;

        // Check  exists
        const serviceResDetail = await brandService.detailBrand(brand_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update
        const serviceRes = await brandService.createBrandOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const deleteBrand = async (req, res, next) => {
    try {
        // Delete skill
        const serviceRes = await brandService.deleteBrand(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(null, serviceRes.message));
    } catch (error) {
        return next(error);
    }
};

const getOptionsCompany = async (req, res, next) => {
    try {
        const serviceRes = await brandService.getOptionsCompany(Object.assign({}, req.query, req.body));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptionsBrand = async (req, res, next) => {
    try {
        const serviceRes = await brandService.getOptionsBrand();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListBrand,
    detailBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    getOptionsCompany,
    getOptionsBrand,
};
