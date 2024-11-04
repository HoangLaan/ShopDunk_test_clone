const skillGroupService = require('./skill-group.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');

const getListSkillGroup = async (req, res, next) => {
    try {
        const serviceRes = await skillGroupService.getListSkillGroup(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail HR_SKILLGROUP
 */
const detailSkillGroup = async (req, res, next) => {
    try {
        // Check company exists
        const serviceRes = await skillGroupService.detailSkillGroup(req.params.skillgroup_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a HR_SKILLGROUP
 */
const createSkillGroup = async (req, res, next) => {
    try {
        req.body.skillgroup_id = null;
        const serviceRes = await skillGroupService.createSkillGroupOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a HR_SKILLGROUP
 */
const updateSkillGroup = async (req, res, next) => {
    try {
        const skillgroup_id = req.params.skillgroup_id;
        req.body.skillgroup_id = skillgroup_id;

        // Check segment exists
        const serviceResDetail = await skillGroupService.detailSkillGroup(skillgroup_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update segment
        const serviceRes = await skillGroupService.createSkillGroupOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete HR_SKILLGROUP
 */
const deleteSkillGroup = async (req, res, next) => {
    try {

        // Delete skill
        const serviceRes = await skillGroupService.deleteSkillGroup(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, 'ok'));
    } catch (error) {
        return next(error);
    }
};

const getOptionsSkillGroup = async (req, res, next) => {
    try {
        const serviceRes = await skillGroupService.getOptionsSkillGroup(req.query);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getListSkillGroup,
    detailSkillGroup,
    createSkillGroup,
    updateSkillGroup,
    deleteSkillGroup,
    getOptionsSkillGroup
};
