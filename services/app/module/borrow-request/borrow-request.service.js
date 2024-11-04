const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const moduleClass = require('./borrow-request.class');

const checkOutOfDate = async () => {
  try {
    const pool = await mssql.pool;
    await pool.request().execute('SL_BORROWREQUEST_CheckOutOfDate_Schedule');
    return;
  } catch (error) {
    console.log('borrowRequestService.checkOutOfDate', error?.message);
  }
};

module.exports = {
  checkOutOfDate,
};
