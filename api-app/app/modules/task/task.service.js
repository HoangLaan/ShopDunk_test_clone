const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const API_CONST = require('../../common/const/api.const');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const moduleClass = require('./task.class');

const getTaskTypeAutoOptions = async (queryParams = {}) => {
  try {
      const currentPage = apiHelper.getCurrentPage(queryParams);
      const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
      const keyword = apiHelper.getValueFromObject(queryParams, 'keyword');
      const pool = await mssql.pool;
      const data = await pool
          .request()
          .input('KEYWORD', keyword)
          .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'created_date_to'))
          .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'created_date_from'))
          .input('ISACTIVE', 1)
          .input('ISDELETED', 0)
          .input('PAGESIZE', itemsPerPage)
          .input('PAGEINDEX', currentPage)
          .execute(PROCEDURE_NAME.CRM_TASKTYPE_GETLIST);

      return new ServiceResponse(true, '', {
          data: moduleClass.taskTypeOption(data.recordset),
          page: currentPage,
          limit: itemsPerPage,
          total: apiHelper.getTotalData(data.recordset),
      });
  } catch (e) {
      console.log(e);
      logger.error(e, { function: 'TaskService.getTaskList' });
      return new ServiceResponse(true, '', {});
  }
};

/**
 * Get list
 *
 * @param queryParams
 * @returns ServiceResponse
 */

module.exports = {
  getTaskTypeAutoOptions,
};
