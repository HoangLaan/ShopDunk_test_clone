const skillService = require('./skill.service');
const SingleResponse = require('../../common/responses/single.response');
const ListResponse = require('../../common/responses/list.response');
const optionService = require('../../common/services/options.service');

const getListSkill = async (req, res, next) => {
    try {
        const serviceRes = await skillService.getListSkill(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};
const getListLevel = async (req, res, next) => {
    try {
        const serviceRes = await skillService.getListLevel(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};
const getListSkillGroup = async (req, res, next) => {
    try {
        const serviceRes = await skillService.getListSkillGroup(req.query);
        const { data, total, page, limit } = serviceRes.getData();
        return res.json(new ListResponse(data, total, page, limit));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get detail MD_SKILL
 */
const detailSkill = async (req, res, next) => {
    try {
        // Check company exists
        const serviceRes = await skillService.detailSkill(req.params.skill_id);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }
        return res.json(new SingleResponse(serviceRes.getData()));
    } catch (error) {
        return next(error);
    }
};

/**
 * Create new a MD_SKILL
 */
const createSkill = async (req, res, next) => {
    try {
        req.body.skill_id = null;
        const serviceRes = await skillService.createSkillOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

/**
 * Update a MD_SKILL
 */
const updateSkill = async (req, res, next) => {
    try {
        const skill_id = req.params.skill_id;
        req.body.skill_id = skill_id;

        // Check segment exists
        const serviceResDetail = await skillService.detailSkill(skill_id);
        if (serviceResDetail.isFailed()) {
            return next(serviceResDetail);
        }

        // Update segment
        const serviceRes = await skillService.createSkillOrUpdate(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(serviceRes.getData(), 'ok'));
    } catch (error) {
        return next(error);
    }
};

/**
 * Delete MD_SKILL
 */
const deleteSkill = async (req, res, next) => {
    try {

        // Delete skill
        const serviceRes = await skillService.deleteSkill(req.body);
        if (serviceRes.isFailed()) {
            return next(serviceRes);
        }

        return res.json(new SingleResponse(null, 'ok'));
    } catch (error) {
        return next(error);
    }
};

/**
 * Get option
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getOptions = async (req, res, next) => {
    try {
        const serviceSkillRes = await optionService('MD_SKILL', req.query);
        if (serviceSkillRes.isFailed()) {
            return next(serviceSkillRes);
        }

        return res.json(new SingleResponse(serviceSkillRes.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getListSkill,
    detailSkill,
    createSkill,
    updateSkill,
    deleteSkill,
    getOptions,
    getListLevel,
    getListSkillGroup,
};