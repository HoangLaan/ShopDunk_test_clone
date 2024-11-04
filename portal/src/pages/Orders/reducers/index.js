import types from 'pages/Orders/actions/types';
import { defaultValueFilter } from 'pages/Orders/helpers/constans';

const INITIAL_STATE = {
  query: { ...defaultValueFilter, order_status: -1 },

  loadingList: false,
  dataOrders: {
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_QUERY_REQUEST:
      return {
        ...state,
        query: action.payload,
      };
    case types.GET_LIST_REQUEST:
      return {
        ...state,
        loadingList: true,
      };
    case types.GET_LIST_REQUEST_FAILE:
      return {
        ...state,
        loadingList: false,
      };
    case types.GET_LIST_REQUEST_SUCCESS:
      return {
        ...state,
        loadingList: false,
        dataOrders: action.payload,
      };
    default:
      return state;
  }
}
