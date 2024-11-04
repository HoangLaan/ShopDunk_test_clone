import { getListOrders } from '../helpers/call-api';
import types from './types';

export const setOrdersQuery = (response) => ({ type: types.SET_QUERY_REQUEST, payload: response });

const getOrdersRequest = () => ({ type: types.GET_LIST_REQUEST });

const getOrdersSuccess = (response) => ({
  type: types.GET_LIST_REQUEST_SUCCESS,
  payload: response,
});

const getOrdersFailure = (error) => ({
  type: types.GET_LIST_REQUEST_FAILE,
  payload: error,
});

export const getOrdersList = (params) => (dispatch) => {
  new Promise((resolve, reject) => {
    dispatch(getOrdersRequest());
    dispatch(setOrdersQuery(params));

    getListOrders(params)
      .then((_res) => {
        dispatch(getOrdersSuccess(_res));
        resolve(_res);
      })
      .catch((error) => {
        dispatch(getOrdersFailure(error));
        reject(error);
      });
  });
};
