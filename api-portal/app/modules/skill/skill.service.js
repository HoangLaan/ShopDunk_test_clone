const skillClass = require('./skill.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const sql = require('mssql');
/**
 * Get list MD_SKILL
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListSkill = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', keyword)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('SKILLGROUPID', apiHelper.getValueFromObject(queryParams, 'skillgroup_id'))
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .input('ISDELETED', apiHelper.getFilterBoolean(queryParams, 'is_delete'))
      .execute('MD_SKILL_GetList_AdminWeb');

    let skills = skillClass.list(data.recordsets[0]);
    let skillGroup = skillClass.optionskillgroup(data.recordsets[1]);
    let skillLevel = skillClass.optionsLevelSkill(data.recordsets[2]);
    if (skills) {
      skills.forEach(s => {
        let group = skillGroup.filter(g => g.skill_id === s.skill_id);
        let level = skillLevel.filter(g => g.skill_id === s.skill_id);
        s.skillgroup_name = [];
        s.skill_level = level;
        for (let i = 0; i < group.length; i++) {
          s.skillgroup_name.push(group[i].skillgroup_name);
        }
      });
    }

    return new ServiceResponse(true, '', {
      data: skills,
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(data.recordsets[0]),
    });
  } catch (e) {
    logger.error(e, { function: 'skillService.getListSkill' });
    return new ServiceResponse(true, '', {});
  }
};

const getListLevel = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input('PAGESIZE', 25)
      .input('PAGEINDEX', 1)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', 1)
      .execute('MD_SKILLLEVEL_GETLIST_ADMINWEB');
    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      data: skillClass.optionskilllevel(stores),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, { function: 'levelService.getListLevel' });
    return new ServiceResponse(true, '', {});
  }
};

/**
 * Get list HR_SKILLGROUP
 *
 * @param queryParams
 * @returns ServiceResponse
 */
const getListSkillGroup = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input('PAGESIZE', 25)
      .input('PAGEINDEX', 1)
      .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'create_date_from'))
      .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'create_date_to'))
      .input('ISACTIVE', 1)
      .execute('HR_SKILLGROUP_GetList_AdminWeb');
    const stores = data.recordset;

    return new ServiceResponse(true, '', {
      data: skillClass.optionskillgroup(stores),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(stores),
    });
  } catch (e) {
    logger.error(e, { function: 'skillGroupService.getListSkillGroup' });
    return new ServiceResponse(true, '', {});
  }
};

const createOption = label => ({
  label,
  value: uuidv1(),
});

const detailSkill = async skillId => {
  try {
    const pool = await mssql.pool;
    const res = await pool.request().input('SKILLID', skillId).execute('MD_SKILL_GetById_AdminWeb');
    let skill = skillClass.detail(res.recordset[0] || {});
    if (skill) {
      if (skill.meta_keywords) {
        skill.meta_keywords = skill.meta_keywords.split('|').map(p => createOption(p));
      } else {
        skill.meta_keywords = [];
      }
    }
    skill.level_list = skillClass.optionsLevel(res.recordsets[1] || {});
    skill.skill_group_list = skillClass.optionsGroup(res.recordsets[2] || {});
    return new ServiceResponse(true, '', skill);
  } catch (e) {
    logger.error(e, { function: 'skillService.detailSkill' });
    return new ServiceResponse(false, e.message);
  }
};

const createSkillOrUpdate = async bodyParams => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();
    const data = await pool
      .request()
      .input('SKILLID', apiHelper.getValueFromObject(bodyParams, 'skill_id'))
      .input('SKILLNAME', apiHelper.getValueFromObject(bodyParams, 'skill_name'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(bodyParams, 'description'))
      .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system'))
      .execute('MD_SKILL_CreateOrUpdate_AdminWeb');
    const skillId = data.recordset[0].RESULT;
    if (!skillId) {
      await transaction.rollback();
      return new ServiceResponse(false, 'Thêm mới thất bại.');
    }

    if (skillId) {
      const requestDelete = new sql.Request(transaction);
      const resultDeleteSkillLevel = await requestDelete
        .input('SKILLID', skillId)
        .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute('HR_SKILL_LEVEL_Delete_AdminWeb');
      if (!resultDeleteSkillLevel.recordset[0].RESULT) {
        await transaction.rollback();
        return new ServiceResponse(false, 'Xóa trình độ kỹ năng thất bại.');
      }

      const resultDeleteSkillGroup = await requestDelete
        .input('SKILLID', skillId)
        .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        .execute('HR_SKILLGROUP_SKILL_Delete_AdminWeb');
      if (!resultDeleteSkillGroup.recordset[0].RESULT) {
        await transaction.rollback();
        return new ServiceResponse(false, 'Xóa nhóm kỹ năng thất bại.');
      }
    }

    // Update HR_SKILL_LEVEL
    let level = apiHelper.getValueFromObject(bodyParams, 'level_list', []);
    if (level && level.length) {
      const requestCreate = new sql.Request(transaction);
      for (let i = 0; i < level.length; i++) {
        const resultBusinessCreate = await requestCreate
          .input('SKILLID', skillId)
          .input('LEVELID', parseInt(apiHelper.getValueFromObject(level[i], 'value')))

          .execute('HR_SKILL_LEVEL_Create_AdminWeb');

        if (!resultBusinessCreate.recordset[0].RESULT) {
          await transaction.rollback();
          return new ServiceResponse(false, 'Thêm mới trình độ kỹ năng thất bại.');
        }
      }
    }
    // Update HR_SKILLGROUP_SKILL
    let skillGroup = apiHelper.getValueFromObject(bodyParams, 'skill_group_list', []);
    if (skillGroup && skillGroup.length) {
      const requestCreate = new sql.Request(transaction);
      for (let i = 0; i < skillGroup.length; i++) {
        const resultBusinessCreate = await requestCreate
          .input('SKILLID', skillId)
          .input('SKILLGROUPID', parseInt(apiHelper.getValueFromObject(skillGroup[i], 'value')))

          .execute('HR_SKILLGROUP_SKILL_Create_AdminWeb');

        if (!resultBusinessCreate.recordset[0].RESULT) {
          await transaction.rollback();
          return new ServiceResponse(false, 'Thêm mới nhóm kỹ năng thất bại.');
        }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, '', skillId);
  } catch (e) {
    logger.error(e, { function: 'skillService.createSkillOrUpdate' });
    return new ServiceResponse(false);
  }
};

const deleteSkill = async (bodyParams) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('SKILLIDS', apiHelper.getValueFromObject(bodyParams, "ids"))
      .input('UPDATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('MD_SKILL_Delete_AdminWeb');
    return new ServiceResponse(true, 'ok');
  } catch (e) {
    logger.error(e, { function: 'skillService.deleteSkill' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListSkill,
  detailSkill,
  createSkillOrUpdate,
  deleteSkill,
  getListLevel,
  getListSkillGroup,
};