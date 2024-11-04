import types from 'pages/Position/actions/type';
import { getListPosition, getDetailPosition } from 'services/position.service';

const getPositionsRequest = () => ({ type: types.GET_POSITIONS_REQUEST });
const getPositionsSuccess = (response) => ({
  type: types.GET_POSITIONS_SUCCESS,
  payload: response,
});
const getPositionsFailure = (error) => ({
  type: types.GET_POSITIONS_FAILURE,
  payload: error,
});

const getPositions =
  ({ search, is_active = 1, page = 1, itemsPerPage = 25, create_date_from, create_date_to }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getPositionsRequest());
      getListPosition({
        search,
        is_active,
        page,
        itemsPerPage,
        create_date_from,
        create_date_to,
      })
        .then((response) => {
          dispatch(getPositionsSuccess(response));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getPositionsFailure(error));
          reject(error);
        });
    });

const getPositionRequest = () => ({ type: types.GET_POSITION_REQUEST });
const getPositionSuccess = (response) => ({
  type: types.GET_POSITION_SUCCESS,
  payload: response,
});
const getPositionFailure = (error) => ({
  type: types.GET_POSITION_FAILURE,
  payload: error,
});

const getPosition = (position_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getPositionRequest());
    getDetailPosition(position_id)
      .then(({ data }) => {
        dispatch(getPositionSuccess(data?.data ?? {}));
        resolve(data?.data ?? {});
      })
      .catch((error) => {
        dispatch(getPositionFailure(error));
        reject(error);
      });
  });

const createPositionRequest = () => ({ type: types.CREATE_POSITION_REQUEST });
const createPositionSuccess = (response) => ({
  type: types.CREATE_POSITION_SUCCESS,
  payload: response,
});
const createPositionFailure = (error) => ({
  type: types.CREATE_POSITION_FAILURE,
  payload: error,
});

const createPosition = (position_id, payload) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createPositionRequest());
    createPosition(payload)
      .then((response) => {
        dispatch(createPositionSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(createPositionFailure(response.data));
        reject(response.data);
      });
  });

const updatePositionRequest = () => ({ type: types.UPDATE_POSITION_REQUEST });
const updatePositionSuccess = (response) => ({
  type: types.UPDATE_POSITION_SUCCESS,
  payload: response,
});
const updatePositionFailure = (error) => ({
  type: types.UPDATE_POSITION_FAILURE,
  payload: error,
});

const updatePosition = (position_id, payload) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updatePositionRequest());
    updatePosition(position_id, payload)
      .then((response) => {
        dispatch(updatePositionSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(updatePositionFailure(response.data));
        reject(response.data);
      });
  });

const deletePositionRequest = () => ({ type: types.DELETE_POSITION_REQUEST });
const deletePositionSuccess = (response) => ({
  type: types.DELETE_POSITION_SUCCESS,
  payload: response,
});
const deletePositionFailure = (error) => ({
  type: types.DELETE_POSITION_FAILURE,
  payload: error,
});

const deletePosition = (position_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deletePositionRequest());
    deletePosition(position_id)
      .then((response) => {
        dispatch(deletePositionSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(deletePositionFailure(response.data));
        reject(response.data);
      });
  });

export { getPosition, getPositions, createPosition, updatePosition, deletePosition };
