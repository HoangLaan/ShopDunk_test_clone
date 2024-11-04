import axios from 'axios';
import types from './types';
import scactions from './index';
import {urlFacebook} from '../utils/constants';
import Model from "pages/SaleChannelFacebook/utils/model";
import { showToast } from 'utils/helpers';


const graphUrl = urlFacebook.graphUrl;
class graphql extends Model {
    sendMessageRequest = () => ({
        type: types.SEND_MESSAGE_REQUEST,
    });

    sendMessageSuccess = response => ({
        type: types.SEND_MESSAGE_SUCCESS,
        payload: response,
    });

    sendMessageFailure = error => ({
        type: types.SEND_MESSAGE_FAILURE,
        payload: error,
    });

    sendMessage = (params, data, clientId) => async dispatch => {
        dispatch(this.sendMessageRequest());
        try {
            dispatch(
                this.sendMessageSuccess({
                    ...params,
                    ...data,
                    from: {
                        id: params.page_id,
                    },
                    text: data?.message.text,
                    attachment: {
                        file_url: data?.message?.attachment?.payload?.url,
                        file_type: data?.message?.attachment?.type,
                        file_name: params?.attachment?.name,
                    },
                }),
            );
            axios({
                url: `${graphUrl}/me/messages?access_token=${params?.access_token}`,
                method: 'POST',
                data,
            })
                .then(e => {
                    const {message_id, recipient_id} = e.data;
                    const {page_id, conversation_id, access_token} = params;
                    return {
                        pageId: page_id,
                        usersId: recipient_id,
                        conversationId: conversation_id,
                        messageId: message_id,
                        access_token: access_token,
                        message: data.message,
                        clientId: clientId,
                        created_date: data.created_date,
                        last_reply_fullname: data.last_reply_fullname,
                        last_reply_userid: data.last_reply_userid,
                        last_reply_username: data.last_reply_username,
                    };
                })
                .then(async data => {
                    await scactions.updateMessageFacebookUser(data);
                })
                .catch(err => {
                    showToast.error(err.response?.data?.error?.message);
                });
        } catch (error) {
            dispatch(this.sendMessageFailure(error));
        }
    };

    getFanpageRequest = () => ({
        type: types.GET_FANPAGE_REQUEST,
    });
    getFanpageSuccess = response => ({
        type: types.GET_FANPAGE_SUCCESS,
        payload: response,
    });
    getFanpageFailure = err => ({
        type: types.GET_FANPAGE_FAILURE,
    });
    getFanpage = params => async dispatch => {
        dispatch(this.getFanpageRequest());
        try {
            const getApi = await axios({
                url: `${graphUrl}/me/accounts/?access_token=${params?.access_token}`,
                method: 'GET',
            });
            dispatch(this.getFanpageSuccess(getApi.data));
        } catch (error) {
            dispatch(this.getFanpageSuccess(error));
        }
    };

    getConversationId = async params => {
        try {
            const getApi = await axios({
                url: `${graphUrl}/${params.page_id}/conversations?access_token=${params?.access_token}&user_id=${params.user_id}`,
                method: 'GET',
            });
            return getApi.data.data[0].id;
        } catch (_) {}
    };

    getInformationUser = async params => {
        try {
            const getApi = await axios({
                url: `${graphUrl}/${params?.user_id}?fields=first_name,last_name,profile_pic&access_token=${params?.access_token}`,
                method: 'GET',
            });
            const data = getApi.data;

            return {
                user_id: params.user_id,
                profile_pic: data?.profile_pic,
                name: data?.first_name + data?.last_name,
            };
        } catch (_) {}
    };
    //#endregion
}

export default new graphql();
