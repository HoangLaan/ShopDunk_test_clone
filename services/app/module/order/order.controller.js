
const fcmService = require('../../bullmq/jobs/notification.job');
const fcmKeyNavigate = require('../../common/const/fcm.const');
const orderService = require('./order.service');
const SingleResponse = require('../../common/responses/single.response');

const pushNotification = async (req, res, next) => { 
    try {
        const notifyInfo = await orderService.createOrUpdateNotify(req.body) 

        if (notifyInfo.data && notifyInfo.data?.notify_id ) {
            let imageUrl = ''; 
            if (req.body?.announce_content && req.body?.announce_content?.includes('<img')) {
                const regex = /<img[^>]+src="?([^"\s]+)"?[^>]*\>/g;
                imageUrl = regex.exec(req.body?.announce_content || '')?.[1];
            }
            const imageNotif = imageUrl ? { imageUrl } : {};

            await orderService.updateIsPush(notifyInfo?.data?.notify_id);
            fcmService.process('notification.pushToMulticast', {
                notification: {
                    notification: {
                        title: notifyInfo?.data?.notify_title || '',
                        body: notifyInfo?.data?.notify_content || '',
                        ...imageNotif, 
                    },
                    data: {
                        key: fcmKeyNavigate.notifyOrderReview,
                        id: notifyInfo?.data?.notify_id?.toString() || '',
                    },
                    android: { notification: { ...imageNotif, sound: 'default' } },
                    apns: {
                        payload: { aps: { 'mutable-content': 1, sound: 'default' } },
                        fcm_options: { image: imageUrl },
                    },
                    webpush: { headers: { image: imageUrl } },
                },
                registrationTokens: [notifyInfo?.data?.device_token],
            });
        }

        return res.json(new SingleResponse(notifyInfo.getData()));
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    pushNotification,
};
