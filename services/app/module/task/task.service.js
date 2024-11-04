const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const taskClass = require('./task.class');
const apiHelper = require('../../common/helpers/api.helper');
const cron = require('node-cron');
const fcmKeyNavigate = require('../../common/const/fcm.const');
const fcmService = require('../../bullmq/jobs/notification.job');

let CRON_JOBS = {};

const getListToken = async (resultSchedule) => {
  const pool = await mssql.pool;
  return await pool.request().input('USERNAME', resultSchedule).execute('GET_LIST_USER_DEVICETOKEN_AdminWeb');
};

const getListUserSchedule = async (taskDetailId) => {
  try {
    const pool = await mssql.pool;

    const query = `SELECT TOP 1 * FROM SYS_NOTIFY sn
      WHERE sn.TASKDETAILID = ${taskDetailId}
      AND ISDELETED IS NULL
      AND ISACTIVE = 1
      AND ISPUSHED = 0
      ORDER BY sn.NOTIFYID DESC`;
    const dataRes = await pool.request().query(query);
    const notifyData = taskClass.notify(dataRes.recordset);
    let resultSchedule;

    if (notifyData[0]?.notify_id) {
      const queryGetUser = `SELECT snu.USERNAME from SYS_NOTIFY_USER snu WHERE snu.NOTIFYID = ${notifyData[0]?.notify_id}`;
      const dataResUser = await pool.request().query(queryGetUser);
      resultSchedule = dataResUser.recordset?.map((item) => item?.USERNAME).join('|');
    }

    const dataDevice = await getListToken(resultSchedule);

    return new ServiceResponse(true, '', {
      data: dataDevice.recordset?.map((value) => value.DEVICETOKEN) || [],
      notify: notifyData,
    });
  } catch (e) {
    logger.error(e, { function: 'task.getListUserSchedule' });
    return new ServiceResponse(false, e.message);
  }
};

const getDeviceTokenUser = async (notify_id) => {
  try {
    const pool = await mssql.pool;
    const query = `SELECT TOP 1 * FROM SYS_NOTIFY sn
      WHERE sn.NOTIFYID = ${notify_id}
      AND ISDELETED IS NULL
      AND ISACTIVE = 1
      AND ISPUSHED = 0`;
    const dataRes = await pool.request().query(query);
    const notifyData = taskClass.notify(dataRes.recordset);

    const queryGetUser = `SELECT snu.USERNAME from SYS_NOTIFY_USER snu WHERE snu.NOTIFYID = ${notify_id}`;
    const dataResUser = await pool.request().query(queryGetUser);
    resultSchedule = dataResUser.recordset?.map((item) => item?.USERNAME).join('|');

    const dataDevice = await getListToken(resultSchedule);
    return new ServiceResponse(true, '', {
      data: dataDevice.recordset?.map((value) => value.DEVICETOKEN) || [],
      notify: notifyData,
    });
  } catch (e) {
    logger.error(e, { function: 'task.getDeviceTokenUser' });
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
    logger.error(e, { function: 'task.updateIsPush' });
    return new ServiceResponse(false, e.message);
  }
};

const updateWFlowJob = ({ cronName, time, task_detail_id, customer_name }) => {
  try {
    if (CRON_JOBS[cronName]) {
      CRON_JOBS[cronName].stop();
      delete CRON_JOBS[cronName];
    }

    const handleTask = async () => {
      const pool = await mssql.pool;
      const dataNoti = await pool
        .request()
        .input('TASKDETAILID', task_detail_id)
        .input('CUSTOMERNAME', customer_name)
        .execute('sp_CRM_TASKDETAIL_createNotify_withTime');
      const { notify_id } = taskClass.notify(dataNoti.recordset)[0];

      const getListTokenUserRes = await getDeviceTokenUser(notify_id);
      const notifyInfo = getListTokenUserRes.data?.notify[0];

      if (
        getListTokenUserRes.data?.data &&
        getListTokenUserRes.data?.data?.length > 0 &&
        getListTokenUserRes.data?.notify?.length > 0
      ) {
        const imageUrl = '';
        const imageNotif = imageUrl ? { imageUrl } : {};

        await updateIsPush(notify_id);
        fcmService.process('notification.pushToMulticast', {
          notification: {
            notification: {
              title: notifyInfo?.notify_title || '',
              body: notifyInfo?.notify_content || '',
              ...imageNotif,
            },
            data: {
              key: fcmKeyNavigate.notifyTaskChangeWorkFlowTime,
              id: notify_id?.toString() || '',
            },
            android: { notification: { ...imageNotif, sound: 'default' } },
            apns: {
              payload: { aps: { 'mutable-content': 1, sound: 'default' } },
              fcm_options: { image: imageUrl },
            },
            webpush: { headers: { image: imageUrl } },
          },
          registrationTokens: getListTokenUserRes.data.data,
        });
      }
    };

    CRON_JOBS[cronName] = cron.schedule(time, handleTask, {
      timezone: 'Asia/Ho_Chi_Minh',
    });
  } catch (error) {
    logger.error(error, { function: 'task.updateWFlowJob' });
  }
};

const pushNotifyTaskWFLow = async (body) => {
  try {
    const task_detail_id = apiHelper.getValueFromObject(body, 'task_detail_id');
    const task_workflow_id = apiHelper.getValueFromObject(body, 'task_workflow_id');
    const customer_name = apiHelper.getValueFromObject(body, 'customer_name');

    const pool = await mssql.pool;
    const dataTaskFlow = await pool
      .request()
      .input('TASKDETAILID', task_detail_id)
      .input('TASKWORKFLOWID', task_workflow_id)
      .execute('CRM_TASKWORKFLOW_ChangeWflow_AdminWeb');

    const data = taskClass.getChangeWFlow(dataTaskFlow.recordset)[0];
    const cronName = `TASK_${task_detail_id}_${data?.task_type_id}`;

    if (data?.minimu_time) {
      const time = `*/${data?.minimu_time} * * * *`;
      //Logic cron
      updateWFlowJob({
        cronName,
        time,
        task_detail_id,
        customer_name,
      });
    } else if (CRON_JOBS[cronName]) {
      CRON_JOBS[cronName].stop();
      delete CRON_JOBS[cronName];
    }

    return new ServiceResponse(true, '', {
      data,
    });
  } catch (e) {
    logger.error(e, { function: 'task.pushNotifyTaskWFLow' });
    return new ServiceResponse(false, e.message);
  }
};

module.exports = {
  getListUserSchedule,
  updateIsPush,
  pushNotifyTaskWFLow,
};
