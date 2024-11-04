const mettingService = require('./meeting.service');
const SingleResponse = require('../../common/responses/single.response');
const fcmService = require('../../bullmq/jobs/notification.job');
const fcmKeyNavigate = require('../../common/const/fcm.const');

const pushNotification = async (req, res, next) => {
  try {
    const listUsernames = (req.body?.username || '').match(/\d+/g).join('');
    const getListTokenUserRes = await mettingService.getListTokenDeviceUser(listUsernames || '');
    if (getListTokenUserRes.data?.data && getListTokenUserRes.data?.data?.length > 0) {
      fcmService.process('notification.pushToMulticast', {
        notification: {
          notification: {
            title:
              'Bạn có lịch hẹn vào lúc ' + req.body?.time_from + ', ' + req.body?.date + ' tại ' + req.body?.location,
            body: 'Nhấn vào để xem chi tiết lịch hẹn',
          },
          data: {
            key: fcmKeyNavigate.meeting,
            id: req.body?.meeting_id || '',
          },
          android: { notification: { sound: 'default' } },
          apns: {
            payload: { aps: { 'mutable-content': 1, sound: 'default' } },
          },
        },
        registrationTokens: getListTokenUserRes.data.data,
      });
    }

    return res.json(new SingleResponse(getListTokenUserRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  pushNotification,
};
