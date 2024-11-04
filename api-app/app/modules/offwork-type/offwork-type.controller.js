const OffWorkTypeService = require('./offwork-type.service');
const SingleResponse = require('../../common/responses/single.response');

const getListOffWorkRlUser = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkTypeService.getListOffWorkRlUser(Object.assign({}, req.query, req.params, req.body));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

const getOptions = async (req, res, next) => {
    try {
        const serviceRes = await OffWorkTypeService.getOptions(Object.assign({}, req.query, req.body));
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListOffWorkRlUser,
    getOptions
};
