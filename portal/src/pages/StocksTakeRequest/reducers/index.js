/* eslint-disable import/no-anonymous-default-export */
import types from 'pages/StocksTakeRequest/actions/types';
import { defaultPaging } from 'utils/helpers';
import { DEFAULT_REVIEW_DATA } from 'pages/StocksTakeRequest/utils/constants';

const INITIAL_STATE = {
  stocksTakeRequestList: defaultPaging,
  getStocksTakeRequestLoading: false,

  productList: defaultPaging,
  getProductLoading: false,

  stocksTakeRequestData: undefined,

  getStocksTakeTypeLoading: false,
  stocksTakeTypeList: defaultPaging.items,
  getDepartmentsLoading: false,
  departmentList: defaultPaging.items,
  getStocksLoading: false,
  stocksList: defaultPaging.items,

  stocksTakeTypeData: undefined,
  stocksTakeTypeLoading: true,

  reviewData: DEFAULT_REVIEW_DATA,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_STOCKS_TAKE_REQUESTS_REQUEST:
      return {
        ...state,
        getStocksTakeRequestLoading: true,
      };
    case types.GET_STOCKS_TAKE_REQUESTS_SUCCESS:
    case types.GET_STOCKS_TAKE_REQUESTS_FAILURE: {
      return {
        ...state,
        stocksTakeRequestList: action.payload,
        getStocksTakeRequestLoading: false,
      };
    }

    case types.GET_LIST_PRODUCT_REQUEST:
      return {
        ...state,
        getProductLoading: true,
      };
    case types.GET_LIST_PRODUCT_SUCCESS:
    case types.GET_LIST_PRODUCT_FAILURE: {
      return {
        ...state,
        productList: action.payload,
        getProductLoading: false,
      };
    }

    case types.GET_STOCKS_TAKE_REQUEST_REQUEST:
      return {
        ...state,
        getStocksTakeRequestLoading: true,
      };
    case types.GET_STOCKS_TAKE_REQUEST_SUCCESS:
    case types.GET_STOCKS_TAKE_REQUEST_FAILURE: {
      return {
        ...state,
        stocksTakeRequestData: action.payload,
        getStocksTakeRequestLoading: false,
      };
    }

    case types.GET_STOCKS_TAKE_TYPES_REQUEST:
      return {
        ...state,
        getStocksTakeTypeLoading: true,
      };
    case types.GET_STOCKS_TAKE_TYPES_SUCCESS:
    case types.GET_STOCKS_TAKE_TYPES_FAILURE: {
      return {
        ...state,
        stocksTakeTypeList: action.payload,
        getStocksTakeTypeLoading: false,
      };
    }

    case types.GET_DEPARTMENTS_REQUEST:
      return {
        ...state,
        getDepartmentsLoading: true,
      };
    case types.GET_DEPARTMENTS_SUCCESS:
    case types.GET_DEPARTMENTS_FAILURE: {
      return {
        ...state,
        departmentList: action.payload,
        getDepartmentsLoading: false,
      };
    }

    case types.GET_STOCKS_REQUEST:
      return {
        ...state,
        getStocksLoading: true,
      };
    case types.GET_STOCKS_SUCCESS:
    case types.GET_STOCKS_FAILURE: {
      return {
        ...state,
        stocksList: action.payload,
        getStocksLoading: false,
      };
    }

    case types.GET_STOCKS_TAKE_TYPE_REQUEST:
      return {
        ...state,
        stocksTakeTypeLoading: true,
      };
    case types.GET_STOCKS_TAKE_TYPE_SUCCESS:
    case types.GET_STOCKS_TAKE_TYPE_FAILURE: {
      return {
        ...state,
        stocksTakeTypeData: action.payload,
        stocksTakeTypeLoading: false,
      };
    }

    case types.SET_REVIEW_DATA: {
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          ...action.payload,
        },
      };
    }

    default:
      return state;
  }
}
