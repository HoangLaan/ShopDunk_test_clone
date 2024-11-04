const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');

const getListTokenDeviceUser = async (listUsernames) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('USERNAMES', listUsernames)
      .execute('GET_LIST_TOKEN_USER');
    return new ServiceResponse(true, '', {
      data: data.recordset.map((value) => value.DEVICETOKEN),
    });
  } catch (e) {
    logger.error(e, { function: 'mailService.getListTokenDeviceUser' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListTokenDeviceUser,
};
