const SingleResponse = require('../../common/responses/single.response');
const fcmService = require('../../bullmq/jobs/notification.job');
const apiHelper = require('../../common/helpers/api.helper');
const fcmKeyNavigate = require('../../common/const/fcm.const');
const taskService = require('./task.service');

const pushNotification = async (req, res, next) => {
  try {
    const getListTokenUserRes = await taskService.getListUserSchedule(
      apiHelper.getValueFromObject(req.body, 'task_detail_id'),
    );
    const notifyInfo = getListTokenUserRes.data?.notify[0];

    if (
      getListTokenUserRes.data?.data &&
      getListTokenUserRes.data?.data?.length > 0 &&
      getListTokenUserRes.data?.notify?.length > 0
    ) {
      let imageUrl = '';
      if (req.body?.announce_content && req.body?.announce_content?.includes('<img')) {
        const regex = /<img[^>]+src="?([^"\s]+)"?[^>]*\>/g;
        imageUrl = regex.exec(req.body?.announce_content || '')?.[1];
      }
      const imageNotif = imageUrl ? { imageUrl } : {};

      await taskService.updateIsPush(notifyInfo?.notify_id);
      fcmService.process('notification.pushToMulticast', {
        notification: {
          notification: {
            title: notifyInfo?.notify_title || '',
            body: notifyInfo?.notify_content || '',
            ...imageNotif,
          },
          data: {
            key: fcmKeyNavigate.notifyTaskComment,
            id: notifyInfo?.notify_id?.toString() || '',
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

    return res.json(new SingleResponse(getListTokenUserRes.getData()));
  } catch (error) {
    return next(error);
  }
};

const pushNotifyChangeWFlow = async (req, res, next) => {
  try {
    const getListTokenUserRes = await taskService.getListUserSchedule(
      apiHelper.getValueFromObject(req.body, 'task_detail_id'),
    );
    const notifyInfo = getListTokenUserRes.data?.notify[0];

    //#region Push notify
    if (
      getListTokenUserRes.data?.data &&
      getListTokenUserRes.data?.data?.length > 0 &&
      getListTokenUserRes.data?.notify?.length > 0
    ) {
      let imageUrl = '';
      if (req.body?.announce_content && req.body?.announce_content?.includes('<img')) {
        const regex = /<img[^>]+src="?([^"\s]+)"?[^>]*\>/g;
        imageUrl = regex.exec(req.body?.announce_content || '')?.[1];
      }
      const imageNotif = imageUrl ? { imageUrl } : {};

      await taskService.updateIsPush(notifyInfo?.notify_id);
      fcmService.process('notification.pushToMulticast', {
        notification: {
          notification: {
            title: notifyInfo?.notify_title || '',
            body: notifyInfo?.notify_content || '',
            ...imageNotif,
          },
          data: {
            key: fcmKeyNavigate.notifyTaskComment,
            id: notifyInfo?.notify_id?.toString() || '',
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
    //#endregion

    //#region check time after change wFlow
    await taskService.pushNotifyTaskWFLow(req.body);
    //#endregion

    return res.json(new SingleResponse(getListTokenUserRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  pushNotification,
  pushNotifyChangeWFlow,
};
