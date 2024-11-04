const axios = require('axios');
const config = require('../../../config/config');
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

const getListPage = access_token => {
    return new Promise((resolve, reject) => {
        axios
            .get(api(`me/accounts?fields=name,picture{url},access_token&access_token=${access_token}`))
            .then(response => {
                if (response.data && response.data.data) return response.data.data;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getConversations = (page_id, access_token, after) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                api(
                    `${page_id}/conversations?fields=can_reply,former_participants,id,is_subscribed,link,message_count,name,participants,scoped_thread_key,senders,snippet,subject,unread_count,updated_time,wallpaper,messages.limit(1){created_time,from,id,is_unsupported,message,sticker,story,tags,thread_id,to,attachments.limit(1){id,image_data,mime_type,name,video_data,size,file_url},shares}&limit=25&access_token=${access_token}&after=${after}`,
                ),
            )
            .then(response => {
                return {
                    conversations: response.data.data,
                    paging: response.data.paging,
                };
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getConversationsWhenSync = (page_id, access_token, after) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                api(
                    `${page_id}/conversations?fields=can_reply,former_participants,id,is_subscribed,link,message_count,name,participants,scoped_thread_key,senders,snippet,subject,unread_count,updated_time,wallpaper&limit=100&access_token=${access_token}&after=${after}`,
                ),
            )
            .then(response => {
                return {
                    conversations: response.data.data,
                    paging: response.data.paging,
                };
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

const getProfilePic = (user_id, access_token) => {
    return new Promise((resolve, reject) => {
        axios
            .get(api(`${user_id}?access_token=${access_token}`))
            .then(response => {
                if (response.data && response.data.data) return response.data.profile_pic;
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

const getMessage = (mid, access_token) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                api(
                    `${mid}?fields=message,from,to,thread_id,tags,attachments{id,image_data,mime_type,name,video_data,size,file_url,width,height},shares,story&access_token=${access_token}`,
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
            .post(api(`me/messages?access_token=${token}`), msg)
            .then(response => {
                if (response.data) return response.data;
                else return reject('Đã có lỗi xảy ra!');
            })
            .then(resolve)
            .catch(error => reject(convertFBError(error)));
    });
};

module.exports = {
    getListPage,
    getConversations,
    getConversationsWhenSync,
    getProfilePic,
    getUserToken,
    getMessage,
    sendMessage,
};
