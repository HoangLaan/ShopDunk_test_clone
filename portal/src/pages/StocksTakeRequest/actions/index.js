import types from 'pages/StocksTakeRequest/actions/types';
import { getOptionsDepartment } from 'services/department.service';
import {
  getListProduct,
  getListStocksTake,
  getListStocksTakeRequest,
  getStocksTakeDetail,
  getStocksTakeRequestDetail,
} from 'services/stocks-take-request.service';
import { getOptionsStocks } from 'services/stocks.service';

// #region get stocks take request
const getStockTakeRequestsRequest = () => ({ type: types.GET_STOCKS_TAKE_REQUESTS_REQUEST });
const getStockTakeRequestsSuccess = (response) => ({
  type: types.GET_STOCKS_TAKE_REQUESTS_SUCCESS,
  payload: response,
});
const getStockTakeRequestsFailure = (error) => ({
  type: types.GET_STOCKS_TAKE_REQUESTS_FAILURE,
  payload: error,
});

const getStockTakeRequests =
  ({
    search,
    is_active = 1,
    page = 1,
    is_reviewd = null,
    stocks_take_type_id = null,
    is_processed,
    is_reviewed,
    itemsPerPage = 25,
    create_date_from,
    create_date_to,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getStockTakeRequestsRequest());
      getListStocksTakeRequest({
        search,
        is_active,
        is_processed,
        page,
        itemsPerPage,
        create_date_to,
        create_date_from,
        is_reviewed,
        stocks_take_type_id,
      })
        .then((response) => {
          dispatch(getStockTakeRequestsSuccess(response));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getStockTakeRequestsFailure(error));
          reject(error);
        });
    });

const getStocksTakeRequestRequest = () => ({ type: types.GET_STOCKS_TAKE_REQUEST_REQUEST });
const getStocksTakeRequestSuccess = (response) => ({
  type: types.GET_STOCKS_TAKE_REQUEST_SUCCESS,
  payload: response,
});
const getStocksTakeRequestFailure = (error) => ({
  type: types.GET_STOCKS_TAKE_REQUEST_FAILURE,
  payload: error,
});

const getStocksTakeRequest = (stocks_take_request_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getStocksTakeRequestRequest());
    getStocksTakeRequestDetail(stocks_take_request_id)
      .then((response) => {
        dispatch(getStocksTakeRequestSuccess(response));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getStocksTakeRequestFailure(error));
        reject(error);
      });
  });

// #endregion

// #region get stocks type request
const getStockTakeTypesRequest = () => ({ type: types.GET_STOCKS_TAKE_TYPES_REQUEST });
const getStockTakeTypesSuccess = (response) => ({
  type: types.GET_STOCKS_TAKE_TYPES_SUCCESS,
  payload: response,
});
const getStockTakeTypesFailure = (error) => ({
  type: types.GET_STOCKS_TAKE_TYPES_FAILURE,
  payload: error,
});

const getStockTakeTypes = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getStockTakeTypesRequest());
    getListStocksTake()
      .then((response) => {
        dispatch(getStockTakeTypesSuccess(response));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getStockTakeTypesFailure(error));
        reject(error);
      });
  });

// #endregion

// #region get department
const getDepartmentsRequest = () => ({ type: types.GET_DEPARTMENTS_REQUEST });
const getDepartmentsSuccess = (response) => ({
  type: types.GET_DEPARTMENTS_SUCCESS,
  payload: response,
});
const getDepartmentsFailure = (error) => ({
  type: types.GET_DEPARTMENTS_FAILURE,
  payload: error,
});

const getDepartments = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getDepartmentsRequest());
    getOptionsDepartment()
      .then((response) => {
        dispatch(getDepartmentsSuccess(response));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getDepartmentsFailure(error));
        reject(error);
      });
  });

// #endregion

// #region get stocks
const getStocksRequest = () => ({ type: types.GET_STOCKS_REQUEST });
const getStocksSuccess = (response) => ({
  type: types.GET_STOCKS_SUCCESS,
  payload: response,
});
const getStocksFailure = (error) => ({
  type: types.GET_STOCKS_FAILURE,
  payload: error,
});

const getStocks = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getStocksRequest());
    getOptionsStocks()
      .then((response) => {
        dispatch(getStocksSuccess(response));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getStocksFailure(error));
        reject(error);
      });
  });

// #endregion

// #region get take type
const getStocksTakeTypeRequest = () => ({ type: types.GET_STOCKS_TAKE_TYPE_REQUEST });
const getStocksTakeTypeSuccess = (response) => ({
  type: types.GET_STOCKS_TAKE_TYPE_SUCCESS,
  payload: response,
});
const getStocksTakeTypeFailure = (error) => ({
  type: types.GET_STOCKS_TAKE_TYPE_FAILURE,
  payload: error,
});

const getStocksTakeType = (stocks_take_id, stocks_take_request_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getStocksTakeTypeRequest());
    getStocksTakeDetail(stocks_take_id, {
      stocks_take_request_id: stocks_take_request_id,
    })
      .then((response) => {
        dispatch(getStocksTakeTypeSuccess(response));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getStocksTakeTypeFailure(error));
        reject(error);
      });
  });

// #endregion

// #region get list Prouduct by stocksid
const getListProductRequest = () => ({ type: types.GET_LIST_PRODUCT_REQUEST });
const getListProductSuccess = (response) => ({
  type: types.GET_LIST_PRODUCT_SUCCESS,
  payload: response,
});
const getListProductFailure = (error) => ({
  type: types.GET_LIST_PRODUCT_FAILURE,
  payload: error,
});

const getListProductStocks = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getListProductRequest());
    getListProduct(params)
      .then((response) => {
        dispatch(getListProductSuccess(response));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(getListProductFailure(error));
        reject(error);
      });
  });

// #endregion

const setReviewData_ = (response) => ({
  type: types.SET_REVIEW_DATA,
  payload: response,
});
const setReviewData = (data) => (dispatch) => dispatch(setReviewData_(data));

export {
  getStockTakeRequests,
  getStocksTakeRequest,
  getStockTakeTypes,
  getDepartments,
  getStocks,
  getStocksTakeType,
  getListProductStocks,
  setReviewData,
};
