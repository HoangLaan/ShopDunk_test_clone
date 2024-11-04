import types from './types';
import { login as loginFB, checkLoginStatus } from '../utils/sdk';
import httpClient from 'utils/httpClient';
const graphUrl = 'https://graph.facebook.com/v14.0/';

class SCFacebook {
  // Login facebook
  loginRequest = () => ({
    type: types.FACEBOOK_LOGIN_REQUEST,
  });

  loginSuccess = (response) => ({
    type: types.FACEBOOK_LOGIN_SUCCESS,
    payload: response,
  });

  loginFailure = (error) => ({
    type: types.FACEBOOK_LOGIN_FAILURE,
    payload: error,
  });

  login = () => async (dispatch) => {
    dispatch(this.loginRequest());
    try {
      const res = await loginFB();
      const { authResponse } = res;
      if (!authResponse) {
        throw new Error('Đã có lỗi xảy ra trong quá trình kết nối facebook. Vui lòng thử lại!');
      }
      dispatch(this.loginSuccess(authResponse));
    } catch (error) {
      dispatch(this.loginFailure(error));
    }
  };

  // Get page token

  getPageTokenRequest = () => ({
    type: types.GET_PAGE_TOKEN_REQUEST,
  });

  getPageTokenSuccess = (response) => ({
    type: types.GET_PAGE_TOKEN_SUCCESS,
    payload: response,
  });

  getPageTokenFailure = (error) => ({
    type: types.GET_PAGE_TOKEN_FAILURE,
    payload: error,
  });

  getPageToken = (pageId) => async (dispatch) => {
    try {
      const res = await httpClient.get(`/sale-channel/facebook/pages/${pageId}/token`);
      dispatch(this.getPageTokenRequest());
      if (!res) {
        dispatch(this.getPageTokenFailure('Đã có lỗi xảy ra trong quá trình kết nối facebook. Vui lòng thử lại!'));
      }
      dispatch(this.getPageTokenSuccess(res));
    } catch (error) {
      dispatch(this.getPageTokenFailure(error));
    }
  };

  // Common
  update = (params) => ({
    type: types.FACEBOOK_UPDATE,
    payload: params,
  });

  // Reset
  reset = () => ({
    type: types.FACEBOOK_RESET,
  });

  // Get user status
  getUserStatusSuccess = (response) => ({
    type: types.FACEBOOK_GETUSERSTATUS_SUCCESS,
    payload: response,
  });

  getUserStatusFailure = (error) => ({
    type: types.FACEBOOK_GETUSERSTATUS_FAILURE,
    payload: error,
  });

  getUserStatus = (userId) => async (dispatch) => {
    try {
      const res = await httpClient.get(`/sale-channel/facebook/admin/${userId}/status`);
      dispatch(this.getUserStatusSuccess(res));
    } catch (error) {
      dispatch(this.getUserStatusFailure(error));
    }
  };

  // Sync
  syncRequest = () => ({
    type: types.FACEBOOK_SYNC_REQUEST,
  });

  syncSuccess = (response) => ({
    type: types.FACEBOOK_SYNC_SUCCESS,
    payload: response,
  });

  syncFailure = (error) => ({
    type: types.FACEBOOK_SYNC_FAILURE,
    payload: error,
  });

  sync = (params) => async (dispatch) => {
    dispatch(this.syncRequest());
    try {
      const res = await httpClient.post(`/sale-channel/facebook/sync`, params);
      dispatch(this.syncSuccess(res));
    } catch (error) {
      dispatch(this.syncFailure(error));
    }
  };

  // Sync page

  facebookSyncPageRequest = () => ({
    type: types.FACEBOOK_SYNC_PAGE_REQUEST,
  });
  facebookSyncPageSuccess = () => ({
    type: types.FACEBOOK_SYNC_PAGE_SUCCESS,
  });
  facebookSyncPageFailure = () => ({
    type: types.FACEBOOK_SYNC_PAGE_FAILURE,
  });
  facebookSyncPage = (data) => async (dispatch) => {
    dispatch(this.facebookSyncPageRequest());
    try {
      const res = await httpClient.put(`/sale-channel/facebook/pages/sync/`, data);
      dispatch(this.facebookSyncPageRequest(res));
      window.location.reload();
    } catch (error) {
      dispatch(this.facebookSyncPageFailure(error));
    }
  };

  // Get user access token
  getUserAccessTokenRequest = () => ({
    type: types.FACEBOOK_GETUSERACCESSTOKEN_REQUEST,
  });

  getUserAccessTokenSuccess = (response) => ({
    type: types.FACEBOOK_GETUSERACCESSTOKEN_SUCCESS,
    payload: response,
  });

  getUserAccessTokenFailure = (error) => ({
    type: types.FACEBOOK_GETUSERACCESSTOKEN_FAILURE,
    payload: error,
  });

  getUserAccessToken = (userId) => async (dispatch) => {
    try {
      const res = await httpClient.get(`/sale-channel/facebook/admin/${userId}/token`);
      dispatch(this.getUserAccessTokenSuccess(res));
    } catch (error) {
      dispatch(this.getUserAccessTokenFailure(error));
    }
  };
  // Get list page
  getListPageRequest = () => ({
    type: types.FACEBOOK_GETLISTPAGE_REQUEST,
  });

  getListPageSuccess = (response) => ({
    type: types.FACEBOOK_GETLISTPAGE_SUCCESS,
    payload: response,
  });

  getListPageFailure = (error) => ({
    type: types.FACEBOOK_GETLISTPAGE_FAILURE,
    payload: error,
  });

  getListPage = (params) => async (dispatch) => {
    dispatch(this.getListPageRequest());
    try {
      const res = await httpClient.get(`/sale-channel/facebook/pages`, params);
      dispatch(this.getListPageSuccess(res));
    } catch (error) {
      dispatch(this.getListPageFailure(error));
    }
  };

  // clear auth res

  clearAuthResponse = () => ({
    type: types.CLEAR_AUTH_RESPONSE,
  });

  // Page connect
  setPageConnect = (response) => ({
    type: types.PAGE_CONNECT,
    payload: response,
  });

  setPageConnectSelected = (response) => ({
    type: types.PAGE_CONNECT_SELECTED,
    payload: response,
  });

  // Get list conversation
  getListConversationRequest = () => ({
    type: types.GET_LIST_CONVERSATION_REQUEST,
  });

  getListConversationSuccess = (response) => ({
    type: types.GET_LIST_CONVERSATION_SUCCESS,
    payload: response,
  });

  getListConversationFailure = (error) => ({
    type: types.GET_LIST_CONVERSATION_FAILURE,
    payload: error,
  });

  getListConversation = (pageSelected, query) => async (dispatch) => {
    dispatch(this.getListConversationRequest());
    try {
      const params = {
        ...query,
        access_token: pageSelected?.page_token,
      };
      const res = await httpClient.get(`/sale-channel/facebook/pages/${pageSelected?.page_id}/conversations`, {
        params,
      });
      dispatch(this.getListConversationSuccess({ ...res, pageId: pageSelected?.page_id }));
    } catch (error) {
      dispatch(this.getListConversationFailure(error));
    }
  };

  // Get list conversation
  appendListConversation = (payload) => ({
    type: types.APPEND_LIST_CONVERSATION,
    payload: payload,
  });

  //thay đổi màn hình thông tin khach hàng hoặc màn hình tạo đơn hàng
  changeView = (view) => ({
    type: types.FACEBOOOK_CHANGEVIEW,
    payload: view,
  });

  conversationSelected = (params) => ({
    type: types.CONVERSATION_SELECTED,
    payload: params,
  });

  uploadFileRequest = (response) => ({
    type: types.UPLOAD_FILE_REQUEST,
    payload: response,
  });

  uploadFileSuccess = (response) => ({
    type: types.UPLOAD_FILE_SUCCESS,
    payload: response,
  });

  uploadFileFailure = (error) => ({
    type: types.UPLOAD_FILE_FAILURE,
    payload: error,
  });

  clearUploadFile = (response) => ({
    type: types.CLEAR_UPLOAD_FILE,
    payload: response,
  });

  uploadFile = (data, onUploadProgress) => async (dispatch) => {
    dispatch(this.uploadFileRequest(data));
    // Loop upload file
    for (let i = 0; i < data.length; i++) {
      const { pageId, userId, converSationId, uuid } = data[i];
      const API_URL_UPLOAD = `/sale-channel/facebook/pages/${pageId}/users/${userId}/conversations/${converSationId}/messages/attachment`;
      try {
        const res = await httpClient.uploadFileGlobal(API_URL_UPLOAD, data[i], onUploadProgress);
        dispatch(
          this.uploadFileSuccess({
            url: res,
            uuid,
          }),
        );
      } catch (error) {
        dispatch(this.uploadFileFailure(error));
        return;
      }
    }
  };

  updateMessageFacebookUser = async (params) => {
    try {
      const {
        pageId,
        usersId,
        conversationId,
        messageId,
        access_token,
        clientId,
        created_date,
        last_reply_fullname,
        last_reply_userid,
        last_reply_username,
      } = params;
      const API_UPDATE_MESSAGE_FACEBOOK = `/sale-channel/facebook/pages/${pageId}/users/${usersId}/conversations/${conversationId}/messages/${messageId}/?page_token=${access_token}`;
      await httpClient.put(API_UPDATE_MESSAGE_FACEBOOK, {
        message: params.message,
        clientId,
        created_date,
        last_reply_fullname,
        last_reply_userid,
        last_reply_username,
      });
    } catch (error) {}
  };

  // Get user access token
  getMessageFacebookUserRequest = () => ({
    type: types.GET_MESSAGE_FACEBOOK_USER_REQUEST,
  });

  getMessageFacebookUserSuccess = (response) => ({
    type: types.GET_MESSAGE_FACEBOOK_USER_SUCCESS,
    payload: response,
  });

  getMessageFacebookUserFailure = (error) => ({
    type: types.GET_MESSAGE_FACEBOOK_USER_FAILURE,
    payload: error,
  });

  getMessageFacebookUser = (params) => async (dispatch) => {
    dispatch(this.getMessageFacebookUserRequest());
    try {
      const { pageId, userId, conversationId } = params;
      delete params.pageId;
      delete params.userId;
      delete params.conversationId;
      const res = await httpClient.get(
        `/sale-channel/facebook/pages/${pageId}/users/${userId}/conversations/${conversationId}/messages`,
        { params },
      );
      dispatch(this.getMessageFacebookUserSuccess(res));
    } catch (error) {
      dispatch(this.getMessageFacebookUserFailure(error));
    }
  };

  // Get info facebook user
  getFacebookUserRequest = () => ({
    type: types.GET_FACEBOOK_USER_REQUEST,
  });

  getFacebookUserSuccess = (response) => ({
    type: types.GET_FACEBOOK_USER_SUCCESS,
    payload: response,
  });

  getFacebookUserFailure = (error) => ({
    type: types.GET_FACEBOOK_USER_FAILURE,
    payload: error,
  });

  getFacebookUser = (params) => async (dispatch) => {
    dispatch(this.getFacebookUserRequest());
    try {
      const { pageId, userId } = params;
      const res = await httpClient.get(`/sale-channel/facebook/pages/${pageId}/users/${userId}`);
      dispatch(this.getFacebookUserSuccess(res));
    } catch (error) {
      dispatch(this.getFacebookUserFailure(error));
    }
  };

  getListHashTagRequest = () => ({
    type: types.GET_FACEBOOK_HASHTAG_REQUEST,
  });
  // Get list hash tag
  getListHashTagSuccess = (response) => ({
    type: types.GET_FACEBOOK_HASHTAG_SUCCESS,
    payload: response,
  });

  getListHashTagFailure = (error) => ({
    type: types.GET_FACEBOOK_HASHTAG_FAILURE,
    payload: error,
  });

  getListHashTag = () => async (dispatch) => {
    dispatch(this.getListHashTagRequest());
    try {
      const res = await httpClient.get(`/sale-channel/hash-tag`);
      dispatch(this.getListHashTagSuccess(res));
    } catch (error) {
      dispatch(this.getListHashTagFailure(error));
    }
  };

  // Delete note facebook user
  deleteNoteFacebookUserSuccess = (response) => ({
    type: types.DELETE_NOTE_FACEBOOK_USER_SUCCESS,
    payload: response,
  });

  deleteNoteFacebookUserFailure = (error) => ({
    type: types.DELETE_NOTE_FACEBOOK_USER_FAILURE,
    payload: error,
  });

  deleteNoteFacebookUser =
    (params = {}) =>
    async (dispatch) => {
      try {
        const { pageId, userId, noteId } = params;
        await httpClient.delete(`/sale-channel/facebook/pages/${pageId}/users/${userId}/note/${noteId}`);
        dispatch(this.deleteNoteFacebookUserSuccess(noteId));
      } catch (error) {
        dispatch(this.deleteNoteFacebookUserFailure(error));
      }
    };

  // Create note facebook user
  createNoteFacebookUserSuccess = (response) => ({
    type: types.CREATE_NOTE_FACEBOOK_USER_SUCCESS,
    payload: response,
  });

  createNoteFacebookUserFailure = (error) => ({
    type: types.CREATE_NOTE_FACEBOOK_USER_FAILURE,
    payload: error,
  });

  createNoteFacebookUser =
    (params = {}) =>
    async (dispatch) => {
      try {
        const { pageId, userId, note } = params;
        const res = await httpClient.post(`/sale-channel/facebook/pages/${pageId}/users/${userId}/note`, { note });
        dispatch(this.createNoteFacebookUserSuccess(res));
      } catch (error) {
        dispatch(this.createNoteFacebookUserFailure(error));
      }
    };

  // Update info facebook user
  updateFacebookUserResponse = (response) => ({
    type: types.UPDATE_FACEBOOK_USER_REQUEST,
  });

  updateFacebookUserSuccess = (response) => ({
    type: types.UPDATE_FACEBOOK_USER_SUCCESS,
    payload: response,
  });

  updateFacebookUserFailure = (error) => ({
    type: types.UPDATE_FACEBOOK_USER_FAILURE,
    payload: error,
  });

  updateFacebookUserExist = (response) => ({
    type: types.UPDATE_FACEBOOK_USER_EXIST,
    payload: response,
  });

  updateFacebookUser =
    (params = {}) =>
    async (dispatch) => {
      dispatch(this.updateFacebookUserResponse());
      try {
        const { pageId, userId, formData } = params;
        const res = await httpClient.put(`/sale-channel/facebook/pages/${pageId}/users/${userId}`, formData);
        // Nếu có user tồn tại với sdt và có muốn cập nhật không
        if (res && res.is_exist) {
          dispatch(this.updateFacebookUserExist(res));
        } else dispatch(this.updateFacebookUserSuccess(res));
      } catch (error) {
        dispatch(this.updateFacebookUserFailure(error));
      }
    };

  // Delete hash tag
  deleteHashTagSuccess = (response) => ({
    type: types.DELETE_FACEBOOK_HASHTAG_SUCCESS,
    payload: response,
  });

  deleteHashTagFailure = (error) => ({
    type: types.DELETE_FACEBOOK_HASHTAG_FAILURE,
    payload: error,
  });

  deleteHashTag =
    (params = {}) =>
    async (dispatch) => {
      try {
        const { id } = params;
        await httpClient.delete(`/sale-channel/hash-tag/${id}`);
        dispatch(this.deleteHashTagSuccess(id));
      } catch (error) {
        dispatch(this.deleteHashTagFailure(error));
      }
    };

  // Create hash tag
  createHashTagSuccess = (response) => ({
    type: types.CREATE_FACEBOOK_HASHTAG_SUCCESS,
    payload: response,
  });

  createHashTagFailure = (error) => ({
    type: types.CREATE_FACEBOOK_HASHTAG_FAILURE,
    payload: error,
  });

  createHashTag =
    (params = {}) =>
    async (dispatch) => {
      try {
        const res = await httpClient.post(`/sale-channel/hash-tag`, params);
        dispatch(this.createHashTagSuccess({ ...params, id: res }));
      } catch (error) {
        dispatch(this.createHashTagFailure(error));
      }
    };

  // Update hash tag color
  updateHashTagSuccess = (response) => ({
    type: types.UPDATE_FACEBOOK_HASHTAG_SUCCESS,
    payload: response,
  });

  updateHashTagFailure = (error) => ({
    type: types.UPDATE_FACEBOOK_HASHTAG_FAILURE,
    payload: error,
  });

  updateHashTag =
    (params = {}) =>
    async (dispatch) => {
      try {
        const { id, color, i } = params;
        await httpClient.put(`/sale-channel/hash-tag/${id}`, { color });
        dispatch(this.updateHashTagSuccess({ color, i }));
      } catch (error) {
        dispatch(this.updateHashTagFailure(error));
      }
    };

  // Update user hash tag
  updateUserHashTagSuccess = (response) => ({
    type: types.UPDATE_FACEBOOK_USER_HASHTAG_SUCCESS,
    payload: response,
  });

  updateUserHashTagFailure = (error) => ({
    type: types.UPDATE_FACEBOOK_USER_HASHTAG_FAILURE,
    payload: error,
  });

  updateUserHashTag =
    (params = {}) =>
    async (dispatch) => {
      try {
        const { hashTag, isTag, pageId, userId, conversationId } = params;
        await httpClient.post(`/sale-channel/facebook/pages/${pageId}/users/${userId}/hash-tag`, {
          hash_tag_id: hashTag.id,
          is_tag: isTag ? 1 : 0,
        });
        dispatch(this.updateUserHashTagSuccess({ hashTag, isTag, pageId, conversationId, message: 'Cập nhật nhãn thành công' }));
      } catch (error) {
        dispatch(this.updateUserHashTagFailure(error));
      }
    };

  // Get list order user
  getUserOrderSuccess = (response) => ({
    type: types.GET_ORDER_FACEBOOK_USER_SUCCESS,
    payload: response,
  });

  getUserOrderFailure = (error) => ({
    type: types.GET_ORDER_FACEBOOK_USER_FAILURE,
    payload: error,
  });

  getUserOrder =
    (params = {}) =>
    async (dispatch) => {
      try {
        const { pageId, userId } = params;
        const res = await httpClient.get(`/sale-channel/facebook/pages/${pageId}/users/${userId}/order`);
        dispatch(this.getUserOrderSuccess(res));
      } catch (error) {
        dispatch(this.getUserOrderFailure(error));
      }
    };

  // Create order
  createUserOrderSuccess = (response) => ({
    type: types.CREATE_ORDER_FACEBOOK_USER_SUCCESS,
    payload: response,
  });

  createUserOrderFailure = (error) => ({
    type: types.CREATE_ORDER_FACEBOOK_USER_FAILURE,
    payload: error,
  });

  createUserOrder =
    (params = {}) =>
    async (dispatch) => {
      try {
        const { pageId, userId } = params;
        const res = await httpClient.post(`/sale-channel/facebook/pages/${pageId}/users/${userId}/order`, params);
        dispatch(this.createUserOrderSuccess(res));
      } catch (error) {
        dispatch(this.createUserOrderFailure(error));
      }
    };

  // Get list order user
  mqttGetListConversation = (response) => ({
    type: types.MQTT_LIST_CONVERSATION,
    payload: response,
  });

  getListPageConnectRequest = () => ({
    type: types.GET_LIST_PAGE_CONNECT_REQUEST,
  });
  getListPageConnectSuccess = (res) => ({
    type: types.GET_LIST_PAGE_CONNECT_SUCCESS,
    payload: res,
  });
  getListPageConnectFailure = () => ({
    type: types.GET_LIST_CONVERSATION_FAILURE,
  });
  getListPageConnect = () => async (dispatch) => {
    dispatch(this.getListPageConnectRequest());
    try {
      const res = await httpClient.get(`/sale-channel/facebook/pages/connect`);
      dispatch(this.getListPageConnectSuccess(res));
    } catch (error) {
      dispatch(this.createUserOrderFailure(error));
    }
  };

  deletePageConnectRequest = () => ({
    type: types.DELETE_PAGE_CONNECT_REQUEST,
  });
  deletePageConnectSuccess = (res) => ({
    type: types.DELETE_PAGE_CONNECT_SUCCESS,
    payload: res,
  });
  deletePageConnectFailure = () => ({
    type: types.DELETE_PAGE_CONNECT_FAILURE,
  });
  deletePageConnect = () => async (dispatch) => {
    dispatch(this.deletePageConnectRequest());
    const params = {
      is_disconnect_all: 1,
    };
    try {
      const res = await httpClient.post('/sale-channel/facebook/pages/disconnect', params);
      await dispatch(this.deletePageConnectSuccess(res));
      window.location.reload();
    } catch (error) {
      dispatch(this.createUserOrderFailure(error));
    }
  };
  clearMessageOrder = () => ({
    type: types.CLEAR_USER_MESSAGE_ORDER,
  });

  getHashTagDetail = async (hashTagId) => {
    try {
      const res = await httpClient.get(`/hashtag/${hashTagId}`);
      return res;
    } catch (error) {
      return error;
    }
  };

  // Get addres by member id
  getAddressByMemberIdRequest = () => ({
    type: types.GET_ADDRESS_BY_MEMBERID_REQUEST,
  });

  getAddressByMemberIdSuccess = (response) => ({
    type: types.GET_ADDRESS_BY_MEMBERID_SUCCESS,
    payload: response,
  });

  getAddressByMemberIdFailure = (error) => ({
    type: types.GET_ADDRESS_BY_MEMBERID_FAILURE,
    payload: error,
  });

  getAddressByMemberId = (member_id) => {
    //dispatch(this.getAddressByMemberIdRequest());
    try {
      return httpClient.get(`/account/address-book/${member_id}`);
    } catch (error) {
      return error;
    }
  };

  getMediaShareRequest = () => ({
    type: types.GET_DATA_MEDIA_REQUEST,
  });
  getMediaShareSuccess = (response) => ({
    type: types.GET_DATA_MEDIA_SUCCESS,
    payload: response,
  });
  getMediaShareFailure = (err) => ({
    type: types.GET_DATA_MEDIA_FAILURE,
  });
  getMediaShare = (params) => async (dispatch) => {
    dispatch(this.getMediaShareRequest());
    try {
      const getApi = await httpClient.get(`/sale-channel/facebook/conversation/${params.conversation_id}}`, params);
      console.log(getApi);
      dispatch(this.getMediaShareSuccess(getApi));
    } catch (error) {
      dispatch(this.getMediaShareFailure(error));
    }
  };

  getListAttachmentByConversationId = (params) => {
    try {
      return httpClient.get(`/sale-channel/facebook/conversation/${params.conversation_id}}`, params);
    } catch (error) {
      return error;
    }
  };

  // getListAttachmentByConversationId = params => dispatch => {
  //     try {
  //         return httpClient.get(`/sale-channel/facebook/conversation/${params.conversation_id}}`, params);
  //     } catch (error) {
  //         return error;
  //     }
  // };

  clearConversation = () => ({
    type: types.CLEAR_CONVERSATION,
  });
}

const fbActions = new SCFacebook()
export default fbActions;
