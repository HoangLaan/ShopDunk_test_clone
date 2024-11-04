const newService = require('./new.service');
const SingleResponse = require('../../common/responses/single.response');
const fcmService = require('../../bullmq/jobs/notification.job');
const fcmKeyNavigate = require('../../common/const/fcm.const');

const pushNotification = async (req, res, next) => {
  try {
    const getListTokenUserRes = await newService.getListTokenDeviceUser();
      if (getListTokenUserRes.data?.data && getListTokenUserRes.data?.data?.length > 0) {
      fcmService.process('notification.topic.subscribe', { tokens: getListTokenUserRes.data.data });
      let imageUrl = '';
      if (req.body?.content && req.body?.content?.includes('<img')) {
        const regex = /<img[^>]+src="?([^"\s]+)"?[^>]*\>/g;
        imageUrl = regex.exec(req.body?.content || '')?.[1];
      }
      const imageNotif = imageUrl ? { imageUrl } : {};
      fcmService.process(
        'notification.topic.push',
        {
          notification: {
            title: '<Tin tức> ' + req.body?.news_title || 'Tin tức mới',
            body: req.body?.description || '',
            ...imageNotif,
          },
          data: {
            key: fcmKeyNavigate.internalNew,
            id: req.body?.new_id || '',
          },
          android: { notification: { ...imageNotif, sound: 'default' } },
          apns: {
            payload: { aps: { 'mutable-content': 1, sound: 'default' } },
            fcm_options: { image: imageUrl },
          },
          webpush: { headers: { image: imageUrl } },
        },
        () => {
          fcmService.process('notification.topic.unsubscribe', { tokens: getListTokenUserRes.data.data });
        },
      );
    }

    return res.json(new SingleResponse(getListTokenUserRes.getData()));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  pushNotification,
};
