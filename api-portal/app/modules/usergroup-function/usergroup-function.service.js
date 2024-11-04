
const UserGroupFunctionClass = require('../usergroup-function/usergroup-function.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');

/**
 * Create SYS_USERGROUP_FUNCTION
 *
 * @param bodyParams
 * @returns ServiceResponse
 */
const createUserGroupFunction = async (bodyParams = []) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);

  try {
    // Begin transaction
    await transaction.begin();
    //await Promise.all(bodyParams.map(async (usergroup) => {
    for (let i = 0; i < bodyParams.length; i++) {
      const usergroup = bodyParams[i];
      const usergroupid = apiHelper.getValueFromObject(usergroup, 'user_group_id');
      const functiongroupids = apiHelper.getValueFromObject(usergroup, 'function_group_ids', []);
      for (let i = 0; i < functiongroupids.length; i++) {
        const functiongroup = functiongroupids[i];
        const functiongrouppermission = apiHelper.getValueFromObject(functiongroup, 'has_permission');
        const functiongroupid = apiHelper.getValueFromObject(functiongroup, 'function_group_id');
        // Delete SYS_USERGROUP_FUNCTION
        const requestUserGroupFunctionDelete = new sql.Request(transaction);
        const resultUserGroupFunctionDelete = await requestUserGroupFunctionDelete // eslint-disable-line no-await-in-loop
          .input('USERGROUPID', usergroupid)
          .input('FUNCTIONGROUPID', functiongroupid)
          .execute(PROCEDURE_NAME.SYS_USERGROUP_FUNCTION_DELETEBYFUCTIONGROUP);
          // If store can not delete data
        if (resultUserGroupFunctionDelete.recordset[0].RESULT === 0) {
          throw new Error(RESPONSE_MSG.USERGROUP_FUNCTION.DELETE_SYS_USERGROUP_FUNCTION_FAILED);
        }
        if (functiongrouppermission) {
          // Create SYS_USERGROUP_FUNCTION With FUNCTIONID NULL
          const requestUserGroupFunction = new sql.Request(transaction);
          const resultUserGroupFunction = await requestUserGroupFunction // eslint-disable-line no-await-in-loop
            .input('USERGROUPID', usergroupid)
            .input('FUNCTIONGROUPID', functiongroupid)
            .input('FUNCTIONID', null)
            .input('ISFUNCTIONGROUP', true)
            .execute(PROCEDURE_NAME.SYS_USERGROUP_FUNCTION_CREATE);
          // Create SYS_USERGROUP_FUNCTION failed
          if (!resultUserGroupFunction.recordset[0].RESULT) {
            throw new Error(RESPONSE_MSG.USERGROUP_FUNCTION.SAVE_SYS_USERGROUP_FUNCTION_FAILED);
          }
        }
        else {
          const functionids = apiHelper.getValueFromObject(functiongroup, 'function_ids', []);
          if (functionids.length > 0) {
            for (let i = 0; i < functionids.length; i++) {
              const functionid = functionids[i];
              // Create SYS_USERGROUP_FUNCTION With FUNCTIONID NULL
              const requestUserGroupFunction = new sql.Request(transaction);
              const resultUserGroupFunction = await requestUserGroupFunction // eslint-disable-line no-await-in-loop
                .input('USERGROUPID', usergroupid)
                .input('FUNCTIONGROUPID', functiongroupid)
                .input('FUNCTIONID', functionid)
                .input('ISFUNCTIONGROUP', false)
                .execute(PROCEDURE_NAME.SYS_USERGROUP_FUNCTION_CREATE);
              // Create SYS_USERGROUP_FUNCTION failed
              if (!resultUserGroupFunction.recordset[0].RESULT) {
                throw new Error(RESPONSE_MSG.USERGROUP_FUNCTION.SAVE_SYS_USERGROUP_FUNCTION_FAILED);
              }
            }
          }
        }
      }
    }

    // Commit transaction
    await transaction.commit();
    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    // Rollback transaction
    await transaction.rollback();

    // Return error
    return new ServiceResponse(false, e.message);
  }
};


//get list functiongroup Thaont64
const getListFunctionGroup = async (queryParams) => {
  try {
    const keyword = apiHelper.getSearch(queryParams);
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PageSize', 1000)
      .input('PageIndex', 1)
      .input('KEYWORD', keyword)
      .input('ORDERBYDES', 0)
      .input('ISACTIVE', 1)
      .input('ISSYSTEM', 2)
      .execute(PROCEDURE_NAME.SYS_FUNCTIONGROUP_GETLIST);
    // get list functiongroup
    let functionGroup = UserGroupFunctionClass.list(data.recordset);
    if (functionGroup && functionGroup.length) {
      await Promise.all(functionGroup.map(async (item) => {
        let itemTemp = await item;
        const dataUserGroup = await pool.request()
          .input('FUNCTIONGROUPID', itemTemp.function_group_id)
          .execute(PROCEDURE_NAME.SYS_USERGROUP_FUNCTION_GETLISTBYFUNCTIONGROUP);

        const userGroups = UserGroupFunctionClass.listusergroup(dataUserGroup.recordset);
        if (userGroups && userGroups.length) {
          const listUserFunctionGroup = [];
          userGroups.forEach((element) => {
            // get usergroup of fucntionid
            if (!listUserFunctionGroup.some((x)=>x.user_group_id === element.user_group_id)) {
              listUserFunctionGroup.push(element);
            }
          });
          itemTemp.user_groups = listUserFunctionGroup;
        }
        item = itemTemp;
      }));
    }
    return new ServiceResponse(true, '', {
      'data': functionGroup,
    });
  } catch (error) {
    console.error('userGroupFunctionService.getListFunctionGroup', error);
    return new ServiceResponse(true, '', {});
  }
};

//get list function by functiongroupid
const getListFunctionByFunctionGroupID = async (functionGroupId) => {
  try {
    const pool = await mssql.pool;
    // get lisst function by functiongrupid
    const data = await pool.request()
      .input('FUNCTIONGROUPID', functionGroupId)
      .execute(PROCEDURE_NAME.SYS_FUNCTION_GETLISTBYFUNCTIONGROUP);
    let functions = UserGroupFunctionClass.listfunction(data.recordset);
    if (functions && functions.length) {
      await Promise.all(functions.map(async (item) => {
        const dataUserGroup = await pool.request()
          .input('FUNCTIONGROUPID', functionGroupId)
          .execute(PROCEDURE_NAME.SYS_USERGROUP_FUNCTION_GETLISTBYFUNCTIONGROUP);
        const userGroups = UserGroupFunctionClass.listdatausergroup(dataUserGroup.recordset);
        if (userGroups && userGroups.length) {
          const listUserFunction = [];
          userGroups.forEach((element) => {
            // get usergroup of fucntionid
            if (element.function_id === item.function_id) {
              element.has_permission = 1;
              listUserFunction.push(element);
            }
          });
          item.user_groups = listUserFunction;
        }
      }));
    }
    return new ServiceResponse(true, '', {
      'data': functions,
    });
  } catch (error) {
    console.error('userGroupFunctionService.getListFunctionByFunctionGroupID', error);
    return new ServiceResponse(true, '', {});
  }
};

module.exports = {
  createUserGroupFunction,
  getListFunctionGroup,
  getListFunctionByFunctionGroupID,
};
