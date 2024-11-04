import types from 'pages/ReceiveSlip/actions/type';
import {
  getListReceiveSlip,
  getDetailReceiveSlip,
  createReceiveSlip,
  updateReceiveSlip,
  deleteReceiveSlip,
  getListOrders,
  genReceiveSlipCode,
  getDetailOrder
} from 'services/receive-slip.service';

const getListRequest = () => ({ type: types.GET_LIST_RECEIVESLIP_REQUEST });
const getListSuccess = (response) => ({
  type: types.GET_LIST_RECEIVESLIP_SUCCESS,
  payload: response,
});
const getListFailure = (error) => ({
  type: types.GET_LIST_RECEIVESLIP_FAILURE,
  payload: error,
});

const getList =
  ({
    search,
    is_active = 1,
    page = 1,
    itemsPerPage = 25,
    create_date_from,
    create_date_to,
    business_id,
    company_id,
    payment_type,
    receive_type_id,
    payment_status,
  }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getListRequest());
        getListReceiveSlip({
          search,
          is_active,
          page,
          itemsPerPage,
          create_date_from,
          create_date_to,
          business_id,
          company_id,
          payment_type,
          receive_type_id,
          payment_status,
        })
          .then((response) => {
            dispatch(getListSuccess(response));
            resolve(response.data);
          })
          .catch((error) => {
            dispatch(getListFailure(error));
            reject(error);
          });
      });

const getDetailRequest = () => ({ type: types.GET_DETAIL_RECEIVESLIP_REQUEST });
const getDetailSuccess = (response) => ({
  type: types.GET_DETAIL_RECEIVESLIP_SUCCESS,
  payload: response,
});
const getDetailFailure = (error) => ({
  type: types.GET_DETAIL_RECEIVESLIP_FAILURE,
  payload: error,
});

const getDetail = (receive_slip_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getDetailRequest());
    getDetailReceiveSlip(receive_slip_id)
      .then((data) => {
        dispatch(getDetailSuccess(data ?? {}));
        resolve(data ?? {});
      })
      .catch((error) => {
        dispatch(getDetailFailure(error));
        reject(error);
      });
  });

const createRequest = () => ({ type: types.CREATE_REQUEST });
const createSuccess = (response) => ({
  type: types.CREATE_SUCCESS,
  payload: response,
});
const createFailure = (error) => ({
  type: types.CREATE_FAILURE,
  payload: error,
});

const create = (payload) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createRequest());
    createReceiveSlip(payload)
      .then((response) => {
        dispatch(createSuccess({ ...response.data, message: 'Thêm mới thành công!' }));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(createFailure(error));
        reject(error);
      });
  });

const updateRequest = () => ({ type: types.UPDATE_REQUEST });
const updateSuccess = (response) => ({
  type: types.UPDATE_SUCCESS,
  payload: response,
});
const updateFailure = (error) => ({
  type: types.UPDATE_FAILURE,
  payload: error,
});

const update = (receive_slip_id, payload) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateRequest());
    updateReceiveSlip(receive_slip_id, payload)
      .then((response) => {
        dispatch(updateSuccess({ ...response.data, message: 'Chỉnh sửa thành công!' }));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(updateFailure(error));
        reject(error);
      });
  });

const deleteRequest = () => ({ type: types.DELETE_REQUEST });
const deleteSuccess = (response) => ({
  type: types.DELETE_SUCCESS,
  payload: response,
});
const deleteFailure = (error) => ({
  type: types.DELETE_FAILURE,
  payload: error,
});

const deleteReceive = (receive_slip_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteRequest());
    deleteReceiveSlip(receive_slip_id)
      .then((response) => {
        dispatch(deleteSuccess({ ...response.data, message: 'Xóa thành công!' }));
        resolve(response.data);
      })
      .catch((error) => {
        dispatch(deleteFailure(error));
        reject(error);
      });
  });

const getListOrderRequest = () => ({ type: types.GET_LIST_ORDER_REQUEST });
const getListOrderSuccess = (response) => ({
  type: types.GET_LIST_ORDER_SUCCESS,
  payload: response,
});
const getListOrderFailure = (error) => ({
  type: types.GET_LIST_ORDER_FAILURE,
  payload: error,
});

const getListOrder =
  ({ search, page = 1, itemsPerPage = 25, sort_column, sort_direction, customer_id }) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        dispatch(getListOrderRequest());
        getListOrders({
          search,
          page,
          itemsPerPage,
          sort_column,
          sort_direction,
          customer_id,
        })
          .then((response) => {
            dispatch(getListOrderSuccess(response));
            resolve(response.data);
          })
          .catch((error) => {
            dispatch(getListOrderFailure(error));
            reject(error);
          });
      });

const getCodeRequest = () => ({ type: types.GET_CODE_RECEIVESLIP_REQUEST });
const getCodeSuccess = (response) => ({
  type: types.GET_CODE_RECEIVESLIP_SUCCESS,
  payload: response,
});
const getCodeFailure = (error) => ({
  type: types.GET_CODE_RECEIVESLIP_FAILURE,
  payload: error,
});

const getCode = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCodeRequest());
    genReceiveSlipCode()
      .then((data) => {
        dispatch(getCodeSuccess(data.receive_slip_code ?? {}));
        resolve(data ?? {});
      })
      .catch((error) => {
        dispatch(getCodeFailure(error));
        reject(error);
      });
  });

const getOrderRequest = () => ({ type: types.GET_ORDER_REQUEST });
const getOrderSuccess = (response) => ({
  type: types.GET_ORDER_SUCCESS,
  payload: response,
});
const getOrderFailure = (error) => ({
  type: types.GET_ORDER_FAILURE,
  payload: error,
});

const getOrder = ({ order_id, type }) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getOrderRequest());
    getDetailOrder({ order_id, type })
      .then((response) => {
        dispatch(getOrderSuccess(response));
        resolve(response);
      })
      .catch((error) => {
        dispatch(getOrderFailure(error));
        reject(error);
      });
  });

export { getList, getDetail, create, update, getListOrder, getCode, deleteReceive, getOrder };
