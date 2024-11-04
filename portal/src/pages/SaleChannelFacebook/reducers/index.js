import types from '../actions/types';
import uniqBy from 'lodash/uniqBy';

const INITIAL_STATE = {
    conversationList: {
        items: [],
    },
    appendListConversation: undefined,
    getConversationListLoading: false,
    conversationSelected: null,
    sendMessageStatus: false,
    uploadFileLoading: false,
    uploadFileData: undefined,

    getMessageFacebookUserList: {
        items: [],
    },
    getMessageFacebookUserListLoading: false,

    userAccessTokenLoading: true,
    userAccessToken: null,
    userAccessTokenError: null,
    syncLoading: false,
    syncSuccess: false,
    syncError: null,

    pageToken: null,
    pageTokenLoading: false,
    pageLoading: true,
    isFetchingConversation: true,
    conversationError: null,
    hasMoreConversation: false,
    conversations: [],
    nextConversationsBatch: [],
    conversationsPage: 1,
    converationsTotalItems: 0,
    view: 'info',

    // Right sidebar facebook user
    facebookUser: {
        info: null,
        orders: null,
        notes: null,
        hash_tags: null,
    },
    facebookUserExist: null,
    getFacebookUserLoading: false,
    deleteNoteError: null,
    createNoteError: null,
    createNoteSuccess: false,
    hashTags: [],
    getHashTagError: null,
    deleteHashTagError: null,
    deleteHashTagSuccess: false,
    updateUserHashTagError: null,
    updateUserHashTagSuccess: false,
    createHashTagError: null,
    createHashTagSuccess: false,
    updateHashTagError: null,
    updateHashTagSuccess: null,
    createOrderSuccess: false,
    createOrderError: null,
    messageCreateOrder: null,

    listPageConnect: undefined,
    listPageConnectLoading: false,
    deletePageConnectLoading: undefined,
    getSyncLoading: false,

    getAddressByIdLoading: undefined,
    getAddressByIdLoading: false,

    mediaShareFile: [],
    mediaShareImage: [],
};

export function scfacebook(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_PAGE_TOKEN_REQUEST:
            return {
                ...state,
                pageTokenError: action.payload,
            };

        case types.GET_PAGE_TOKEN_FAILURE:
            return {
                ...state,
                pageTokenError: action.payload,
            };

        // Sync
        case types.FACEBOOK_SYNC_REQUEST:
            return {
                ...state,
                syncLoading: true,
            };
        case types.FACEBOOK_SYNC_FAILURE:
            return {
                ...state,
                syncLoading: false,
                syncSuccess: false,
                syncError: action.payload,
            };

        // Update
        case types.FACEBOOK_UPDATE:
            return {
                ...state,
                ...action.payload,
            };

        case types.FACEBOOK_SYNC_SUCCESS:
            return {
                ...state,
                syncLoading: false,
                syncSuccess: true,
            };
        // User status
        case types.FACEBOOK_GETUSERSTATUS_FAILURE:
            return {
                ...state,
                userStatus: null,
            };
        case types.FACEBOOK_GETUSERSTATUS_SUCCESS:
            return {
                ...state,
                userStatus: action.payload,
            };
        // User Access token
        case types.FACEBOOK_GETUSERACCESSTOKEN_REQUEST:
            return {
                ...state,
                userAccessTokenLoading: true,
            };
        case types.FACEBOOK_GETUSERACCESSTOKEN_FAILURE:
            return {
                ...state,
                userAccessTokenLoading: false,
                userAccessTokenError: action.payload.message,
                userAccessToken: null,
            };
        case types.FACEBOOK_GETUSERACCESSTOKEN_SUCCESS:
            return {
                ...state,
                userAccessTokenLoading: false,
                userAccessToken: action.payload,
            };
        // Conversation
        case types.GET_LIST_CONVERSATION_REQUEST:
            return {
                ...state,
                getConversationListLoading: true,
            };

        case types.GET_LIST_CONVERSATION_SUCCESS: {
            const {items, totalItems, page, totalPages, itemsPerPage, pageId} = action.payload;
            const _items = uniqBy([...state?.conversationList?.items, ...items], 'conversation_id')
              .filter(x => x?.page_id === pageId)
            return {
                ...state,
                getConversationListLoading: false,
                conversationList: {
                    items: _items,
                    totalItems,
                    page,
                    totalPages,
                    itemsPerPage,
                },
            };
        }

        case types.GET_LIST_CONVERSATION_FAILURE:
            return {
                ...state,
                getConversationListLoading: false,
            };

        case types.APPEND_LIST_CONVERSATION:
            return {
                ...state,
                conversationList: [...state?.conversationList, action.payload],
            };

        case types.MQTT_LIST_CONVERSATION:
            return {
                ...state,
                conversationList: action.payload,
            };

        case types.CONVERSATION_SELECTED:
            let _conversationListUpdate = {...state?.conversationList};
            const {conversation_id} = action.payload || {};
            if (conversation_id) {
                _conversationListUpdate.items = (_conversationListUpdate.items || []).map(conversation =>
                    conversation.conversation_id == conversation_id ? {...conversation, is_seen: 1} : conversation,
                );
            }
            return {
                ...state,
                conversationSelected: action.payload || {},
                conversationList: _conversationListUpdate,
            };

        case types.UPLOAD_FILE_REQUEST:
            return {
                ...state,
                uploadFileLoading: true,
                uploadFileData: [...(state.uploadFileData || []), ...action.payload],
            };
        case types.UPLOAD_FILE_SUCCESS:
            return {
                ...state,
                uploadFileLoading: false,
                uploadFileData: (state.uploadFileData || []).map((f, i) => {
                    if (f.uuid == action.payload.uuid) {
                        f.urlFile = action.payload.url;
                    }
                    return f;
                }),
            };
        case types.UPLOAD_FILE_FAILURE:
            return {
                ...state,
                uploadFileLoading: false,
                uploadFileData: undefined,
            };

        case types.CLEAR_UPLOAD_FILE:
            const uuid = action.payload;
            return {
                ...state,
                uploadFileLoading: false,
                uploadFileData: !action.payload ? [] : (state.uploadFileData || []).filter(x => x.uuid != uuid),
            };
        // change view order or user info
        case types.FACEBOOOK_CHANGEVIEW:
            return {
                ...state,
                view: action.payload,
            };
        case types.GET_PAGE_TOKEN_REQUEST:
            return {
                ...state,
                pageToken: null,
                pageTokenLoading: false,
            };
        case types.GET_PAGE_TOKEN_SUCCESS:
            return {
                ...state,
                pageToken: action.payload,
            };
        case types.GET_PAGE_TOKEN_FAILURE:
            return {
                ...state,
                pageToken: null,
            };

        case types.GET_MESSAGE_FACEBOOK_USER_REQUEST:
            return {
                ...state,
                getMessageFacebookUserList: {
                    items: [],
                },
                getMessageFacebookUserListLoading: true,
            };
        case types.GET_MESSAGE_FACEBOOK_USER_SUCCESS:
            return {
                ...state,
                getMessageFacebookUserList: action.payload,
                getMessageFacebookUserListLoading: false,
            };
        case types.GET_MESSAGE_FACEBOOK_USER_FAILURE:
            return {
                ...state,
                getMessageFacebookUserListLoading: false,
            };
        // Facebook user
        case types.GET_FACEBOOK_USER_REQUEST:
            return {
                ...state,
                facebookUser: {
                    info: null,
                    orders: null,
                    notes: null,
                    hash_tags: null,
                },
                getFacebookUserLoading: true,
            };
        case types.GET_FACEBOOK_USER_SUCCESS:
            return {
                ...state,
                facebookUser: action.payload,
                getFacebookUserLoading: false,
            };
        case types.GET_FACEBOOK_USER_FAILURE:
            return {
                ...state,
                getFacebookUserLoading: false,
            };
        // Hash tag
        case types.GET_FACEBOOK_HASHTAG_SUCCESS:
            return {
                ...state,
                hashTags: !action.payload ? [] : action.payload,
                getHashTagError: null,
            };
        case types.GET_FACEBOOK_HASHTAG_FAILURE:
            return {
                ...state,
                hashTags: [],
                getHashTagError: action.payload.message || 'Lỗi lấy nhãn!',
            };
        // Delete note facebook user
        case types.DELETE_NOTE_FACEBOOK_USER_SUCCESS:
            return {
                ...state,
                deleteNoteError: null,
                facebookUser: !action.payload
                    ? state.facebookUser
                    : {
                          ...state.facebookUser,
                          notes: (state.facebookUser.notes || []).filter(note => note.id != action.payload),
                      },
            };
        case types.DELETE_NOTE_FACEBOOK_USER_FAILURE:
            return {
                ...state,
                deleteNoteError: action.payload,
            };
        case types.CREATE_NOTE_FACEBOOK_USER_SUCCESS:
            if (!action.payload) {
                return {
                    ...state,
                    createNoteError: null,
                    createNoteSuccess: false,
                };
            }
            return {
                ...state,
                createNoteError: null,
                facebookUser: {
                    ...state.facebookUser,
                    notes: [action.payload, ...(state.facebookUser?.notes || [])],
                },
                createNoteSuccess: true,
            };
        case types.CREATE_NOTE_FACEBOOK_USER_FAILURE:
            return {
                ...state,
                createNoteError: action.payload.message || 'Tạo nhãn không thành công!',
                createNoteSuccess: false,
            };
        case types.CREATE_NOTE_FACEBOOK_USER_FAILURE:
            return {
                ...state,
                createNoteError: action.payload.message || 'Tạo nhãn không thành công!',
                createNoteSuccess: false,
            };
        case types.UPDATE_FACEBOOK_USER_SUCCESS:
            if (!action.payload) {
                return {
                    ...state,
                    updateFacebookUserError: null,
                    updateFacebookUserSuccess: false,
                    facebookUserExist: null,
                };
            }
            const _conversationList = [...state.conversationList.items];
            const findConverStationList = _conversationList?.map(_ => {
                if (_.user.user_id === action.payload.user_id) {
                    _.user.name = action.payload.full_name;
                }
                return _;
            });
            return {
                ...state,
                updateFacebookUserError: null,
                facebookUser: {
                    ...state.facebookUser,
                    info: action.payload,
                },
                updateFacebookUserSuccess: true,
                conversationList: {
                    ...state.conversationList,
                    items: findConverStationList,
                },
                facebookUserExist: null,
            };
        case types.UPDATE_FACEBOOK_USER_FAILURE:
            return {
                ...state,
                updateFacebookUserError: action.payload.message || 'Cập nhật thông tin thành công!',
                updateFacebookUserSuccess: false,
                facebookUserExist: null,
            };
        case types.UPDATE_FACEBOOK_USER_EXIST:
            return {
                ...state,
                facebookUserExist: action.payload,
            };
        // Delete hash tag
        case types.DELETE_FACEBOOK_HASHTAG_SUCCESS:
            if (!action.payload) {
                return {
                    ...state,
                    deleteHashTagError: null,
                    deleteHashTagSuccess: false,
                };
            }
            const userHashTags = (state.facebookUser?.hash_tags || []).filter(tag => tag.id != action.payload);
            const hashTags = (state.hashTags || []).filter(tag => tag.id != action.payload);
            return {
                ...state,
                deleteHashTagError: null,
                deleteHashTagSuccess: true,
                facebookUser: {
                    ...state.facebookUser,
                    hash_tags: userHashTags,
                },
                hashTags,
            };
        case types.DELETE_FACEBOOK_HASHTAG_FAILURE:
            return {
                ...state,
                deleteHashTagError: action.payload.message || 'Lỗi xóa nhãn!',
                deleteHashTagSuccess: false,
            };
        // Update user hash tag
        case types.UPDATE_FACEBOOK_USER_HASHTAG_SUCCESS:
            if (!action.payload) {
                return {
                    ...state,
                    updateUserHashTagError: null,
                    updateUserHashTagSuccess: false,
                };
            }
            const {isTag, hashTag, conversationId, pageId} = action.payload;
            let userHashTagsUpdate = [...state.facebookUser.hash_tags];
            if (isTag) {
                userHashTagsUpdate.push(hashTag);
            } else {
                userHashTagsUpdate = (userHashTagsUpdate || []).filter(tag => tag.id != hashTag.id);
            }
            let conversationItemsUpdate = [...state.conversationList.items];
            if (conversationId && pageId) {
                conversationItemsUpdate = (conversationItemsUpdate || []).map(conversation => {
                    if (conversation.conversation_id == conversationId) {
                        conversation.hash_tags = userHashTagsUpdate;
                    }
                    return conversation;
                });
            }
            return {
                ...state,
                updateUserHashTagError: null,
                updateUserHashTagSuccess: true,
                facebookUser: {
                    ...state.facebookUser,
                    hash_tags: userHashTagsUpdate,
                },
                conversationList: {
                    ...state.conversationList,
                    items: conversationItemsUpdate,
                },
            };
        case types.UPDATE_FACEBOOK_USER_HASHTAG_FAILURE:
            return {
                ...state,
                updateUserHashTagError: action.payload.message || 'Lỗi gán nhãn!',
                updateUserHashTagSuccess: false,
            };
        // Create hash tag
        case types.CREATE_FACEBOOK_HASHTAG_SUCCESS:
            if (!action.payload) {
                return {
                    ...state,
                    createHashTagError: null,
                    createHashTagSuccess: false,
                };
            }
            let hashTagsCreate = [...state.hashTags];
            return {
                ...state,
                createHashTagError: null,
                createHashTagSuccess: true,
                hashTags: [action.payload, ...hashTagsCreate],
            };
        case types.CREATE_FACEBOOK_HASHTAG_FAILURE:
            return {
                ...state,
                createHashTagError: action.payload.message || 'Lỗi tạo nhãn!',
                createHashTagSuccess: false,
            };
        // Update hash tag color
        case types.UPDATE_FACEBOOK_HASHTAG_SUCCESS:
            if (!action.payload) {
                return {
                    ...state,
                    updateHashTagError: null,
                    updateHashTagSuccess: false,
                };
            }
            let {color, i} = action.payload;
            let hashTagsUpdate = [...state.hashTags];
            hashTagsUpdate[i].color = color;
            return {
                ...state,
                updateHashTagError: null,
                updateHashTagSuccess: false,
                hashTags: hashTagsUpdate,
            };
        case types.UPDATE_FACEBOOK_HASHTAG_FAILURE:
            return {
                ...state,
                updateHashTagError: action.payload.message || 'Lỗi cập nhật nhãn!',
                updateHashTagSuccess: false,
            };
        // Create order
        case types.CREATE_ORDER_FACEBOOK_USER_SUCCESS:
            return {
                ...state,
                createOrderError: null,
                createOrderSuccess: !action.payload ? false : true,
                messageCreateOrder: action.payload || state.messageCreateOrder,
                view: 'info',
            };
        case types.CREATE_ORDER_FACEBOOK_USER_FAILURE:
            return {
                ...state,
                createOrderError: action?.payload?.message || 'Tạo đơn hàng không thành công!',
                createOrderSuccess: false,
                messageCreateOrder: null,
                view: 'order',
            };

        // SEND
        case types.SEND_MESSAGE_REQUEST:
            return {
                ...state,
                sendMessageStatus: true,
            };
        case types.SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                appendListConversation: action.payload,
                sendMessageStatus: false,
            };
        case types.SEND_MESSAGE_FAILURE:
            return {
                ...state,
                sendMessageStatus: false,
            };

        // SEND
        case types.GET_LIST_PAGE_CONNECT_REQUEST:
            return {
                ...state,
                listPageConnectLoading: true,
            };
        case types.GET_LIST_PAGE_CONNECT_SUCCESS:
            return {
                ...state,
                listPageConnectLoading: false,
                listPageConnect: action.payload,
            };
        case types.GET_LIST_CONVERSATION_FAILURE:
            return {
                ...state,
                listPageConnectLoading: false,
            };

        case types.FACEBOOK_SYNC_PAGE_REQUEST:
            return {
                ...state,
                getSyncLoading: true,
            };

        case types.FACEBOOK_SYNC_PAGE_SUCCESS:
        case types.FACEBOOK_SYNC_PAGE_FAILURE:
            return {
                ...state,
                getSyncLoading: false,
            };
        //case types.SC_CLEAR_USER_MESSAGE_ORDER:
        //    return {
        //        ...state,
        //        messageCreateOrder: null
        //    };
        // Reset

        case types.GET_DATA_MEDIA_SUCCESS:
        case types.GET_DATA_MEDIA_FAILURE:
            return {
                ...state,
                mediaShareFile: action.payload.file,
                mediaShareImage: action.payload.image,
            };
        case types.PUSH_MEDIDA_IMAGE: {
            return {
                ...state,
                mediaShareImage: [action.payload.image, ...state?.mediaShareImage],
            };
        }

        case types.PUSH_MEDIDA_FILE: {
            return {
                ...state,
                mediaShareFile: [action.payload.file, ...state?.mediaShareFile],
            };
        }

        case types.CLEAR_CONVERSATION: {
            return {
                ...state,
                conversationList: {
                    items: [],
                },
            };
        }

        case types.FACEBOOK_RESET:
            return INITIAL_STATE;

        default:
            return state;
    }
}
