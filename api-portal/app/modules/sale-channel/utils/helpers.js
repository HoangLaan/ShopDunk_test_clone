const axios = require('axios');
const config = require('../../../../config/config');

const FACEBOOKAPI = 'https://graph.facebook.com/v14.0';

const api = url => `${FACEBOOKAPI}/${url}`;

const convertFBError = err => {
    let {response} = err;
    if (!response) {
        return err;
    }
    if (response.data && response.data.error) {
        return response.data.error.message;
    }
    return err.message;
};

const getProfileUser = (user_id, token) => {
    return new Promise((resolve, reject) => {
        axios
            .get(api(`${user_id}?access_token=${token}`))
            .then(response => {
                if (response.data) return response.data;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getProfilePic = (user_id, token) => {
    return new Promise((resolve, reject) => {
        axios
            .get(api(`${user_id}/picture?redirect=false&access_token=${token}`))
            .then(response => {
                if (response.data && response.data.data) return response.data.data.url;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getUserToken = access_token => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                api(
                    `oauth/access_token?grant_type=fb_exchange_token&client_id=${config.FACEBOOK.CLIENTID}&client_secret=${config.FACEBOOK.CLIENTSECRET}&fb_exchange_token=${access_token}`,
                ),
            )
            .then(response => {
                if (response.data && response.data.access_token) return response.data.access_token;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getPageToken = (page_id, access_token) => {
    return new Promise((resolve, reject) => {
        axios
            .get(api(`${page_id}/fields=access_token&access_token=${access_token}`))
            .then(response => {
                if (response.data && response.data.access_token) return response.data.access_token;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getConversationByUserId = (user_id, page_id, access_token) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                api(
                    `${page_id}/conversations?user_id=${user_id}&access_token=${access_token}&fields=participants,message_count`,
                ),
            )
            .then(response => {
                if (response.data && response.data.data && response.data.data.length) return response.data.data[0];
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getListMessageByConversationId = (cid, access_token, litmit, after) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                api(
                    `${cid}/messages?fields=message,from,to,thread_id,tags,sticker,attachments{id,image_data,mime_type,name,video_data,size,file_url,width,height},shares,story,created_time&access_token=${access_token}&after=${after}&limit=25`,
                ),
            )
            .then(response => {
                if (response.data) return response.data;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getMessage = (mid, access_token) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                api(
                    `${mid}?fields=message,from,to,thread_id,tags,sticker,attachments{id,image_data,mime_type,name,video_data,size,file_url,width,height},shares,story&access_token=${access_token}`,
                ),
            )
            .then(response => {
                if (response.data) return response.data;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const sendMessage = (msg, token) => {
    return new Promise((resolve, reject) => {
        axios
            .get(api(`me/messages?access_token=${access_token}`))
            .then(response => {
                if (response.data) return response.data;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const subscribeWebhook = (page_id, token) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                `https://graph.facebook.com/${page_id}/subscribed_apps?subscribed_fields=messages&access_token=${token}`,
            )
            .then(response => {
                return response;
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getConversationByPageId = (page_id, access_token, after) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                api(
                    `${page_id}/conversations?access_token=${access_token}&after=${after}&fields=can_reply,former_participants,id,is_subscribed,link,message_count,name,participants,scoped_thread_key,senders,snippet,subject,unread_count,updated_time,wallpaper,tag&limit=15`,
                ),
            )
            .then(response => {
                if (response.data) return response.data;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

module.exports = {
    getProfilePic,
    getProfileUser,
    getUserToken,
    getPageToken,
    getConversationByUserId,
    getConversationByPageId,
    getListMessageByConversationId,
    getMessage,
    sendMessage,
    subscribeWebhook,
};
