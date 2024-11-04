const PROCEDURE_NAME = require('../../common/const/procedure-name.const');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const customerOfTaskClass = require('./customer-of-task.class');

const getListUserSchedule = async (storeId, taskDetailId) => {
  try {
    const pool = await mssql.pool;
    const dataUser = await pool.request().input('STOREID', storeId).execute('GET_LIST_USER_SCHEDULE_AdminWeb');
    const resultSchedule = dataUser.recordset?.map((item) => item.USERNAME).join('|');

    const dataDevice = await pool
      .request()
      .input('USERNAME', resultSchedule)
      .execute('GET_LIST_USER_DEVICETOKEN_AdminWeb');

    const query = `SELECT TOP 1 * FROM SYS_NOTIFY sn
      WHERE sn.TASKDETAILID = ${taskDetailId}
      AND ISDELETED IS NULL
      AND ISACTIVE = 1
      AND ISPUSHED = 0
      ORDER BY sn.NOTIFYID DESC`;
    const dataRes = await pool.request().query(query);
    const notify = customerOfTaskClass.notify(dataRes.recordset);

    return new ServiceResponse(true, '', {
      data: dataDevice.recordset?.map((value) => value.DEVICETOKEN) || [],
      notify: notify,
    });
  } catch (e) {
    logger.error(e, { function: 'customerOfTask.getListUserSchedule' });
    return new ServiceResponse(false, e.message);
  }
};

const updateIsPush = async (notifyId) => {
  try {
    const pool = await mssql.pool;
    const query = `UPDATE SYS_NOTIFY
      SET ISPUSHED = 1
      WHERE NOTIFYID = ${notifyId}
      AND ISDELETED IS NULL
      AND ISACTIVE = 1`;
    const receive = `UPDATE SYS_NOTIFY_USER
      SET RECEIVEDATE = GETDATE()
      WHERE NOTIFYID = ${notifyId}`;

    await pool.request().query(query);
    await pool.request().query(receive);
  } catch (e) {
    logger.error(e, { function: 'customerOfTask.updateIsPush' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListUserSchedule,
  updateIsPush,
};
