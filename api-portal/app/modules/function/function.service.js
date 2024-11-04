const database = require('../../models');
const FunctionClass = require('../function/function.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const ServiceResponse = require('../../common/responses/service.response');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');

const getListFunction = async (req) => {
  try {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);

    const query = `${PROCEDURE_NAME.SYS_FUNCTION_GETLIST} 
      @PAGESIZE=:PAGESIZE,
      @PAGEINDEX=:PAGEINDEX,
      @KEYWORD=:KEYWORD,
      @ORDERBYDES=:ORDERBYDES,
      @FUNCTIONGROUPID=:FUNCTIONGROUPID,
      @ISACTIVE=:ISACTIVE,
      @ISSYSTEM=:ISSYSTEM,
      @CREATEDDATEFROM=:CREATEDDATEFROM,
      @CREATEDDATETO=:CREATEDDATETO`;
    const functions = await database.sequelize.query(query, {
      replacements: {
        'PAGESIZE': limit,
        'PAGEINDEX': page,
        'KEYWORD': apiHelper.getQueryParam(req, 'search'),
        'ORDERBYDES': apiHelper.getQueryParam(req, 'sortorder'),
        'FUNCTIONGROUPID': apiHelper.getQueryParam(req, 'function_group_id'),
        'ISACTIVE': apiHelper.getQueryParam(req, 'is_active'),
        'ISSYSTEM': apiHelper.getQueryParam(req, 'is_system'),
        'CREATEDDATEFROM': apiHelper.getQueryParam(req, 'create_date_from'),
        'CREATEDDATETO': apiHelper.getQueryParam(req, 'create_date_to'),
      },
      type: database.QueryTypes.SELECT,
    });

    return {
      'data': FunctionClass.list(functions),
      'page': page,
      'limit': limit,
      'total': apiHelper.getTotalData(functions),
    };
  } catch (error) {
    console.error('functionService.getListFunction', error);
    return [];
  }
};

const createFunction = async (req) => {
  try {
    req.body.function_id = null;

    await createOrUpdateFunction(req);

    return true;
  } catch (error) {
    console.error('functionService.createFunction', error);
    return false;
  }
};

const updateFunction = async (req) => {
  try {
    req.body.function_id = req.params.functionId;

    await createOrUpdateFunction(req);

    return true;
  } catch (error) {
    console.error('functionService.updateFunction', error);
    return false;
  }
};

const createOrUpdateFunction = async (req) => {
  let data = {
    'FUNCTIONID': req.body.function_id,
    'FUNCTIONNAME': req.body.function_name,
    'FUNCTIONALIAS': req.body.function_alias,
    'FUNCTIONGROUPID': req.body.function_group_id,
    'DESCRIPTION': req.body.description || '',
    'ISACTIVE': req.body.is_active,
    'ISSYSTEM': req.body.is_system,
    'CREATEDUSER': req.body.auth_name,
  };

  let query = `${PROCEDURE_NAME.SYS_FUNCTION_CREATEORUPDATE} 
        @FUNCTIONID=:FUNCTIONID,
        @FUNCTIONNAME=:FUNCTIONNAME,
        @FUNCTIONALIAS=:FUNCTIONALIAS,
        @FUNCTIONGROUPID=:FUNCTIONGROUPID,
        @DESCRIPTION=:DESCRIPTION,
        @ISACTIVE=:ISACTIVE,
        @ISSYSTEM=:ISSYSTEM,
        @CREATEDUSER=:CREATEDUSER`;

  // Call procedure
  await database.sequelize.query(query, {
    replacements: data,
    type: database.QueryTypes.INSERT,
  });

  removeCacheOptions();
};

const detailFunction = async (functionId) => {
  try {
    const func = await database.sequelize.query(`${PROCEDURE_NAME.SYS_FUNCTION_GETBYID} @FUNCTIONID=:FUNCTIONID`, {
      replacements: {
        'FUNCTIONID': functionId,
      },
      type: database.QueryTypes.SELECT,
    });
    console.log(func);
    if (func.length) {
      return FunctionClass.detail(func[0]);
    }

    return null;
  } catch (error) {
    console.error('functionService.detailFunction', error);
    return null;
  }
};

const deleteFunction = async (functionId, req) => {
  try {
    await database.sequelize.query(`${PROCEDURE_NAME.SYS_FUNCTION_DELETE} @FUNCTIONID=:FUNCTIONID,@UPDATEDUSER=:UPDATEDUSER`, {
      replacements: {
        'FUNCTIONID': functionId,
        'UPDATEDUSER': apiHelper.getAuthId(req),
      },
      type: database.QueryTypes.UPDATE,
    });

    removeCacheOptions();

    return true;
  } catch (error) {
    console.error('functionService.deleteFunction', error);
    return true;
  }
};

const changeStatusFunction = async (functionId, req) => {
  try {
    const query = `${PROCEDURE_NAME.SYS_FUNCTION_UPDATESTATUS} 
      @FUNCTIONID=:FUNCTIONID,
      @UPDATEDUSER=:UPDATEDUSER,
      @ISACTIVE=:ISACTIVE`;
    await database.sequelize.query(query, {
      replacements: {
        'FUNCTIONID': functionId,
        'ISACTIVE': req.body.is_active,
        'UPDATEDUSER': apiHelper.getAuthId(req),
      },
      type: database.QueryTypes.UPDATE,
    });

    return true;
  } catch (error) {
    console.error('functionService.changeStatusFunction', error);
    return true;
  }
};
const checkNameFunction = async (function_name, function_id = null) => {
  try {

    const query = `${PROCEDURE_NAME.SYS_FUNCTION_CHECKNAME} 
      @FUNCTIONID=:FUNCTIONID,
      @FUNCTIONNAME=:FUNCTIONNAME`;
    const check = await database.sequelize.query(query, {
      replacements: {
        'FUNCTIONID': function_id,
        'FUNCTIONNAME': function_name,
      },
      type: database.QueryTypes.SELECT,
    });

    const isCheck = check[0] && check[0]['RESULT'];
    return isCheck ? true : false;
  } catch (error) {
    console.error('functionService.checkNameFunction', error);
    return false;
  }
};
const checkExistFunctionAlias = async (alias, functionId = null) => {
  try {
    const query = `${PROCEDURE_NAME.SYS_FUNCTION_CHECKALIAS} 
      @FUNCTIONID=:FUNCTIONID,
      @FUNCTIONALIAS=:FUNCTIONALIAS`;
    const data = await database.sequelize.query(query, {
      replacements: {
        'FUNCTIONID': functionId,
        'FUNCTIONALIAS': alias,
      },
      type: database.QueryTypes.SELECT,
    });

    const isExist = data[0] && data[0]['RESULT'];

    return isExist ? true : false;
  } catch (error) {
    console.error('functionService.checkExistFunctionAlias', error);
    return [];
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.SYS_FUNCTION_OPTIONS);
};

const getListFunctionsByUserGroup = async (userGroups = []) => {
  try {
    if (!userGroups.length) {
      return new ServiceResponse(true, '', []);
    }

    const pool = await mssql.pool;
    const data = await pool.request()
      .input('USERGROUPID', userGroups.join('|'))
      .execute(PROCEDURE_NAME.SYS_FUNCTION_GETLISTBYUSERGROUP);

    return new ServiceResponse(true, '', _.map(data.recordset, 'FUNCTIONALIAS'));
  } catch (e) {
    logger.error(e, { 'function': 'functionService.getListFunctionsByUserGroup' });

    return new ServiceResponse(true, '', []);
  }
};

const deleteListFunction = async bodyParams => {
  try {
    let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
    const pool = await mssql.pool;
    await pool
      .request()
      .input('LISTID', list_id)
      .input('NAMEID', 'FUNCTIONID')
      .input('TABLENAME', 'SYS_FUNCTION')
      .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
      .execute('CBO_COMMON_SOFTDELETE');
    return new ServiceResponse(true, '', true);
  } catch (e) {
    console.log(e);
    logger.error(e, { function: 'functionService.deleteListFunctions' });
    return new ServiceResponse(false, 'Lỗi xoá danh sách quyền');
  }
};

module.exports = {
  getListFunction,
  createFunction,
  detailFunction,
  updateFunction,
  deleteFunction,
  deleteListFunction,
  changeStatusFunction,
  checkNameFunction,
  checkExistFunctionAlias,
  getListFunctionsByUserGroup,
};
