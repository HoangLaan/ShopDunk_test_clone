const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const moment = require('moment');
const offwork = require('./offwork.class');
const fcmService = require('../../bullmq/jobs/notification.job');
const fcmKeyNavigate = require('../../common/const/fcm.const');

const getListToken = async (resultSchedule) => {
  const pool = await mssql.pool;
  return await pool.request().input('USERNAME', resultSchedule).execute('GET_LIST_USER_DEVICETOKEN_AdminWeb');
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
    logger.error(e, { function: 'offwork.updateIsPush' });
    return new ServiceResponse(false, e.message);
  }
};

const funcPushNotiOffWork = async ({notify}) => {
  try { 
    const notifyInfo = notify.recordset[0];
    const pool = await mssql.pool;
    const dataResUser = await pool.request().query(
      `SELECT snu.USERNAME from SYS_NOTIFY_USER snu WHERE snu.NOTIFYID = ${notifyInfo.notify_id}`
    );
    const dataDevice = await getListToken(dataResUser.recordset?.map((item) => item?.USERNAME).join('|'));
    const token = dataDevice.recordset?.map((value) => value.DEVICETOKEN) || []

    if(token){
      const imageUrl = '';
      const imageNotif = imageUrl ? { imageUrl } : {};

      await updateIsPush(notifyInfo.notify_id);
      fcmService.process('notification.pushToMulticast', {
        notification: {
          notification: {
            title: notifyInfo?.notify_title || '',
            body: notifyInfo?.notify_content || '',
            ...imageNotif,
          },
          data: {
            key: fcmKeyNavigate.notifyOffWork,
            id: notifyInfo.notify_id?.toString() || '',
          },
          android: { notification: { ...imageNotif, sound: 'default' } },
          apns: {
            payload: { aps: { 'mutable-content': 1, sound: 'default' } },
            fcm_options: { image: imageUrl },
          },
          webpush: { headers: { image: imageUrl } },
        },
        registrationTokens: token,
      });
    }

  } catch (error) {
    logger.error(error, { function: 'offwork.funcPushNotiOffWork' });
  }
}

const update = async () => {
  try {
    const pool = await mssql.pool;
    //load các policy
    const data = await pool.request().input('ISACTIVE', 1).execute('HR_TIMECANOFF_POLICY_GetList_AdminWeb');
    const offworks = data.recordset;
    let respone = offwork.list(offworks);
    // lặp qua lấy block && department && store
    for (let i = 0; i < respone.length; i++) {
      const res = await pool
        .request()
        .input('TIMECANOFFPOLICYID', parseInt(respone[i].time_can_off_policy_id))
        .execute('HR_TIMECANOFF_POLICY_GetInfo_AdminWeb');
      const blocks = offwork.block(res.recordsets[0]);
      const departments = offwork.department(res.recordsets[1]);
      respone[i].blocks = blocks;
      respone[i].departments = departments;
    }
    let dataUser;

    for (let i = 0; i < respone.length; i++) {
      const block_list = respone[i].blocks.map((x) => x.block_id).join('|');
      const department_list = respone[i].departments.map((x) => x.department_id).join('|');
      const res = await pool
        .request()
        .input('BLOCKLIST', block_list)
        .input('DEPARTMENTLIST', department_list)
        .input('MONTHLYTIMECANOFF', respone[i].monthly_time_can_off)
        .input('MONTHLYTIMECANOFFUNIT', parseInt(respone[i].monthly_time_can_off_unit)||0)
        .input('MONTHLYTIMECANOFFCYCLE', parseInt(respone[i].monthly_time_can_off_cycle)||0)
        .input('SENIORITYTIMECANOFF', parseInt(respone[i].seniority_time_can_off)||0)
        .input('TIMECANOFFUNIT', parseInt(respone[i].time_can_off_unit)||0)
        .input('TIMECANOFFCYCLE', parseInt(respone[i].time_can_off_cycle)||0)
        .execute('HR_TOTALDAYOFFWORK_UpdateByPolicy_Service');
        
        dataUser = res?.recordset.map((item) => item?.USERNAME).join('|')
    }
    const notify = await pool.request()
    .input('USERNAMELIST', dataUser)
    .execute('HR_TOTALDAYOFFWORK_createNotify');
    await funcPushNotiOffWork({notify})

    logger.info(`UPDATE TOTAL DAY OFFWORK AT ${moment().format('DD/MM/YYYY HH:mm:ss')}`);
  } catch (e) {
    logger.error(e, { function: 'OffWorkService.update' });
  }
};
const reset = async () => {
  try {
    const pool = await mssql.pool;
    //load các policy
    const data = await pool.request().input('ISACTIVE', 1).execute('HR_TIMECANOFF_POLICY_GetList_AdminWeb');
    const offworks = data.recordset;
    let respone = offwork.list(offworks);
    // lặp qua lấy block && department && store
    for (let i = 0; i < respone.length; i++) {
      const res = await pool
        .request()
        .input('TIMECANOFFPOLICYID', parseInt(respone[i].time_can_off_policy_id))
        .execute('HR_TIMECANOFF_POLICY_GetInfo_AdminWeb');
      const blocks = offwork.block(res.recordsets[0]);
      const departments = offwork.department(res.recordsets[1]);
      respone[i].blocks = blocks;
      respone[i].departments = departments;
    }
    for (let i = 0; i < respone.length; i++) {
      const block_list = respone[i].blocks.map((x) => x.block_id).join('|');
      const department_list = respone[i].blocks.map((x) => x.department_id).join('|');
      const res = await pool
        .request()
        .input('BLOCKLIST', block_list)
        .input('DEPARTMENTLIST', department_list)
        .input('RESETTIMECANOFFDATE', respone[i].reset_time_can_off_date)
        .input('RESETTIMECANOFFCYCLE', parseInt(respone[i].reset_time_can_off_cycle))
        .execute('HR_TOTALDAYOFFWORK_ResetByPolicy_Service');
    }

    logger.info(`UPDATE TOTAL DAY OFFWORK AT ${moment().format('DD/MM/YYYY HH:mm:ss')}`);
  } catch (e) {
    logger.error(e, { function: 'OffWorkService.update' });
  }
};

module.exports = {
  update,
  reset,
};
