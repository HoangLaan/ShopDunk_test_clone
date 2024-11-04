const mailService = require('./announce.service');
const SingleResponse = require('../../common/responses/single.response');
const fcmService = require('../../bullmq/jobs/notification.job');
const apiHelper = require('../../common/helpers/api.helper');
const fcmKeyNavigate = require('../../common/const/fcm.const');

const pushNotification = async (req, res, next) => {
  try {
    const listDepartments = apiHelper
      .convertStringOrArrayToArray(req.body?.department)
      .map((item) => item?.id || '')
      ?.join('|');

    const listUsernames = apiHelper
      .convertStringOrArrayToArray(req.body?.user)
      .map((item) => item?.id || '')
      ?.join('|');

    const is_send_to_all = req.body?.is_send_to_all ? parseInt(req.body?.is_send_to_all) : 0;
    const getListTokenUserRes = await mailService.getListTokenDeviceUser(
      listUsernames,
      listDepartments,
      is_send_to_all,
    );

    if (getListTokenUserRes.data?.data && getListTokenUserRes.data?.data?.length > 0) {
      let imageUrl = '';
      if (req.body?.announce_content && req.body?.announce_content?.includes('<img')) {
        const regex = /<img[^>]+src="?([^"\s]+)"?[^>]*\>/g;
        imageUrl = regex.exec(req.body?.announce_content || '')?.[1];
      }
      const imageNotif = imageUrl ? { imageUrl } : {};
      fcmService.process('notification.pushToMulticast', {
        notification: {
          notification: {
            title: '<Thông báo> ' + req.body?.announce_title || 'Thông báo mới',
            body: req.body?.description || '',
            ...imageNotif,
          },
          data: {
            key: fcmKeyNavigate.internalNotif,
            id: req.body?.announce_id || '',
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

module.exports = {
  pushNotification,
};
