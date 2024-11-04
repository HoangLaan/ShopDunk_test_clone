const newsService = require('../static-content/static-content.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const config = require('../../../config/config');
const axios = require('axios');
/**
 * Get list CMS_STATICCONTENT
 */

const getListStatic = async (req, res, next) => {
    try {
        const serviceRes = await newsService.getListStatic(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail
 */
const detailStatic = async (req, res, next) => {
    try {
        const static_code = req.params.StaticCode;
        const serviceRes = await newsService.detailStatic(static_code);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        console.log(serviceRes, "zzz2");
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create
 */
const createStatic = async (req, res, next) => {
    let new_static_code;
    try {
        req.body.static_id = null;
        const { static_id, static_code } = req.body;
        console.log(static_id, static_code);
        const StaticCode = await newsService.findByStaticCode(static_code, static_id);
        console.log('StaticCode:', StaticCode);
        if (StaticCode) {
            let num = static_code.match(/\d+/g);
            let key = static_code.match(/[a-zA-Z]+/g);
            let newNum = parseInt(num) + 1;
            new_static_code = key + newNum.toString();
            req.body.customer_code = new_static_code;
        }


        const serviceRes = await newsService.createStaticOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        axios({
            method: 'post',
            url: `${config.domain_service}/static-content`,
            data: {
                ...req.body,
                static_id: serviceRes.getData() || '',
            },
            headers: { Authorization: `APIKEY ${config.service_apikey}` },
        })
            .then((response) => { })
            .catch((error) => { })
            .finally(() => { });

        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.CREATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update
 */
const updateStatic = async (req, res, next) => {
    try {
        const StaticCode = req.params.StaticCode;
        console.log('StaticCode:', StaticCode);
        req.body.static_code = StaticCode;

        const serviceResDetail = await newsService.detailStatic(StaticCode);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }
        const serviceRes = await newsService.createStaticOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData(), RESPONSE_MSG.NEWS.UPDATE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete
 */
const deleteStatic = async (req, res, next) => {
    try {
        const serviceRes = await newsService.deleteStatic(Object.assign({}, req.body, req.query));
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, RESPONSE_MSG.NEWS.DELETE_SUCCESS));
    } catch (error) {
        return next(error);
    }
};

const StaticGenCode = async (req, res, next) => {
    try {
        // Check ACCOUNT exists
        const serviceRes = await newsService.StaticGenCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(new ErrorResponse(httpStatus.NOT_IMPLEMENTED, error, RESPONSE_MSG.REQUEST_FAILED));
    }
};

const exportExcel = async (req, res, next) => {
    try {
        const serviceRes = await newsService.exportExcel(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        const dataRes = serviceRes.getData();
        dataRes.write('static-content.xlsx', res);
    } catch (error) {
        return next(error);
    }
};

const generateGroupCode = async (req, res, next) => {
    try {
        var result = 'SC';
        let serviceRes = await newsService.generateGroupCode();
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        const lastId = serviceRes?.getData().length > 0 ? serviceRes?.getData()[0].STATICCONTENTID + "" : "1";
        var lengthLastId = lastId.length;
        if (lengthLastId < 6) {
            var addZeroNumber = 6 - lengthLastId;
            for (var i = 0; i < addZeroNumber; i++) {
                result = result + '0';
            }
            result = result + lastId;
        }
        return res.json(new SingleResponse(result));
    } catch (error) {
        return next(error);
    }
};






module.exports = {
    exportExcel,
    StaticGenCode,
    getListStatic,
    detailStatic,
    createStatic,
    updateStatic,
    deleteStatic,
    generateGroupCode
};
