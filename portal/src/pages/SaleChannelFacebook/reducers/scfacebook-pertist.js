import types from '../actions/types';

const INITIAL_STATE = {
  getLoginLoading: false,
  authResponse: undefined,
  loginError: null,
  userStatus: null,

  getPageList: [],
  getPageListLoading: false,

  pages: [],
  pageLoading: [],

  pageToken: null,
  pageTokenLoading: false,
  pageLoading: true,
  pageConnect: null,
  pageConnectSelected: null,
};

export function scFacebookPerTist(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.FACEBOOK_LOGIN_REQUEST:
      return {
        ...state,
        getLoginLoading: true,
      };
    case types.FACEBOOK_LOGIN_SUCCESS:
      return {
        ...state,
        authResponse: action.payload,
      };
    case types.FACEBOOK_LOGIN_FAILURE:
      return {
        ...state,
        authResponse: undefined,
        loginError: action.payload,
      };

    case types.GET_FANPAGE_REQUEST:
      return {
        ...state,
        getPageListLoading: true,
      };
    case types.GET_FANPAGE_SUCCESS:
      return {
        ...state,
        getPageListLoading: false,
        getPageList: action.payload,
      };
    case types.GET_FANPAGE_FAILURE:
      return {
        ...state,
        getPageListLoading: false,
      };

    // Get list page
    case types.FACEBOOK_GETLISTPAGE_REQUEST:
      return {
        ...state,
        pageLoading: true,
      };
    case types.FACEBOOK_GETLISTPAGE_FAILURE:
      return {
        ...state,
        pageLoading: false,
        pages: [],
      };
    case types.FACEBOOK_GETLISTPAGE_SUCCESS:
      return {
        ...state,
        pageLoading: false,
        pages: action.payload,
      };

    // Page connect
    case types.PAGE_CONNECT:
      return {
        ...state,
        pageConnect: action.payload,
        pageConnectSelected: action.payload[0],
      };
    case types.PAGE_CONNECT_SELECTED:
      return {
        ...state,
        pageConnectSelected: action.payload,
      };

    case types.DELETE_PAGE_CONNECT_REQUEST:
      return {
        ...state,
      };
    case types.DELETE_PAGE_CONNECT_SUCCESS:
      return {
        ...state,
        authResponse: undefined,
        getPageList: []
      };
    case types.DELETE_PAGE_CONNECT_FAILURE:
      return {
        ...state,
      };

    default:
      return state;
  }
}
