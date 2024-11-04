import types from 'pages/Area/actions/type';
//import apiLinks from 'area/utils/api-links';
import { getList } from 'services/area.service';

const getAreasRequest = () => ({ type: types.GET_AREAS_REQUEST });
const getAreasSuccess = (response) => ({ type: types.GET_AREAS_SUCCESS, payload: response });
const getAreasFailure = (error) => ({ type: types.GET_AREAS_FAILURE, payload: error });

const getAreas = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getAreasRequest());
    getList(params).then((p) => {
      console.log(p);
    });
    // httpClient
    //   .callApi({
    //     method: 'GET',
    //     url: apiLinks.area.get,
    //     params,
    //   })
    //   .then((response) => {
    //     dispatch(getAreasSuccess(response.data));
    //     resolve(response.data);
    //   })
    //   .catch((error) => {
    //     dispatch(getAreasFailure(error));
    //     reject(error);
    //   });
  });

// const createAreaRequest = () => ({ type: types.CREATE_AREA_REQUEST });
// const createAreaSuccess = (response) => ({ type: types.CREATE_AREA_SUCCESS, payload: response });
// const createAreaFailure = (error) => ({ type: types.CREATE_AREA_FAILURE, payload: error });

// const createArea = (data) => (dispatch) =>
//   new Promise((resolve, reject) => {
//     dispatch(createAreaRequest());
//     httpClient
//       .callApi({
//         method: 'POST',
//         url: apiLinks.area.create,
//         data: data,
//       })
//       .then((response) => {
//         dispatch(createAreaSuccess(response?.data));
//         resolve(response?.data?.data);
//       })
//       .catch((error) => {
//         dispatch(createAreaFailure(error));
//         reject(error);
//       });
//   });

// const updateAreaRequest = () => ({ type: types.CREATE_AREA_REQUEST });
// const updateAreaSuccess = (response) => ({ type: types.CREATE_AREA_SUCCESS, payload: response });
// const updateAreaFailure = (error) => ({ type: types.CREATE_AREA_FAILURE, payload: error });

// const updateArea = (data) => (dispatch) =>
//   new Promise((resolve, reject) => {
//     dispatch(updateAreaRequest());
//     httpClient
//       .callApi({
//         method: 'PUT',
//         url: apiLinks.area.update(data?.area_id),
//         data: data,
//       })
//       .then((response) => {
//         dispatch(updateAreaSuccess(response?.data));
//         resolve(response?.data?.data);
//       })
//       .catch((error) => {
//         dispatch(updateAreaFailure(error));
//         reject(error);
//       });
//   });

// const deleteAreaRequest = () => ({ type: types.DELETE_AREA_REQUEST });
// const deleteAreaSuccess = (response) => ({ type: types.DELETE_AREA_SUCCESS, payload: response });
// const deleteAreaFailure = (error) => ({ type: types.DELETE_AREA_FAILURE, payload: error });

// const deleteArea = (data) => (dispatch) =>
//   new Promise((resolve, reject) => {
//     dispatch(deleteAreaRequest());
//     httpClient
//       .callApi({
//         method: 'DELETE',
//         url: apiLinks.area.delete(data?.area_id),
//         data: data,
//       })
//       .then((response) => {
//         dispatch(deleteAreaSuccess(response?.data));
//         resolve(response?.data?.data);
//       })
//       .catch((error) => {
//         dispatch(deleteAreaFailure(error));
//         reject(error);
//       });
//   });

export { getAreas };
