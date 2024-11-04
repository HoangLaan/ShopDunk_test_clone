import types from 'pages/Coupon/actions/type';
import {
  getListCoupon,
  getDetaiCouponService,
  createCouponService,
  updateCouponService,
  getListRsError,
  getListCustomerType,
} from 'services/coupon.service';

// #region coupon
const getCouponsRequest = () => ({ type: types.GET_COUPONS_REQUEST });
const getCouponsSuccess = (response) => ({
  type: types.GET_COUPONS_SUCCESS,
  payload: response,
});
const getCouponsFailure = (error) => ({
  type: types.GET_COUPONS_FAILURE,
  payload: error,
});

const getCoupons =
  ({ search, coupon_type_status_id, is_active = 1, page = 1, itemsPerPage = 25, from_date, to_date }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getCouponsRequest());
      getListCoupon({
        search,
        is_active,
        page,
        itemsPerPage,
        from_date,
        to_date,
        coupon_type_status_id,
      })
        .then((response) => {
          dispatch(getCouponsSuccess(response));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getCouponsFailure(error));
          reject(error);
        });
    });

const getCouponRequest = () => ({ type: types.GET_COUPON_REQUEST });
const getCouponSuccess = (response) => ({
  type: types.GET_COUPON_SUCCESS,
  payload: response,
});
const getCouponFailure = (error) => ({
  type: types.GET_COUPON_FAILURE,
  payload: error,
});

const getCoupon = (coupon_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getCouponRequest());
    getDetaiCouponService(coupon_id)
      .then(({ data }) => {
        dispatch(getCouponSuccess(data?.data ?? {}));
        resolve(data?.data ?? {});
      })
      .catch((error) => {
        dispatch(getCouponFailure(error));
        reject(error);
      });
  });

const createCouponRequest = () => ({ type: types.CREATE_COUPON_REQUEST });
const createCouponSuccess = (response) => ({
  type: types.CREATE_COUPON_SUCCESS,
  payload: response,
});
const createCouponFailure = (error) => ({
  type: types.CREATE_COUPON_FAILURE,
  payload: error,
});

const createCoupon = (coupon_id, payload) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createCouponRequest());
    createCouponService(payload)
      .then((response) => {
        dispatch(createCouponSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(createCouponFailure(response.data));
        reject(response.data);
      });
  });

const updateCouponRequest = () => ({ type: types.UPDATE_COUPON_REQUEST });
const updateCouponSuccess = (response) => ({
  type: types.UPDATE_COUPON_SUCCESS,
  payload: response,
});
const updateCouponFailure = (error) => ({
  type: types.UPDATE_COUPON_FAILURE,
  payload: error,
});

const updateCoupon = (coupon_id, payload) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateCouponRequest());
    updateCouponService(coupon_id, payload)
      .then((response) => {
        dispatch(updateCouponSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(updateCouponFailure(response.data));
        reject(response.data);
      });
  });

const deleteCouponRequest = () => ({ type: types.DELETE_COUPON_REQUEST });
const deleteCouponSuccess = (response) => ({
  type: types.DELETE_COUPON_SUCCESS,
  payload: response,
});
const deleteCouponFailure = (error) => ({
  type: types.DELETE_COUPON_FAILURE,
  payload: error,
});

const deleteCoupon = (coupon_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteCouponRequest());
    deleteCoupon(coupon_id)
      .then((response) => {
        dispatch(deleteCouponSuccess(response.data));
        resolve(response.data);
      })
      .catch((response) => {
        dispatch(deleteCouponFailure(response.data));
        reject(response.data);
      });
  });

//#endregion

// #region rserror
const getRsErrorRequest = () => ({ type: types.GET_RSERROR_REQUEST });
const getRsErrorSuccess = (response) => ({
  type: types.GET_RSERROR_SUCCESS,
  payload: response,
});
const getRsErrorFailure = (error) => ({
  type: types.GET_RSERROR_FAILURE,
  payload: error,
});

const getRsError =
  ({ search, is_active = 1, page = 1, itemsPerPage = 25, create_date_from, create_date_to }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getRsErrorRequest());
      getListRsError({
        search,
        is_active,
        page,
        itemsPerPage,
        create_date_from,
        create_date_to,
      })
        .then((response) => {
          dispatch(getRsErrorSuccess(response));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getRsErrorFailure(error));
          reject(error);
        });
    });

//#endregion

// #region customer_type
const getCustomerTypeRequest = () => ({ type: types.GET_CUSTOMER_TYPE_REQUEST });
const getCustomerTypeSuccess = (response) => ({
  type: types.GET_CUSTOMER_TYPE_SUCCESS,
  payload: response,
});
const getCustomerTypeFailure = (error) => ({
  type: types.GET_CUSTOMER_TYPE_FAILURE,
  payload: error,
});

const getCustomerType =
  ({ keyword, is_active = 1, page = 1, itemsPerPage = 25, create_date_from, create_date_to, object_type, company_id, business_id  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getCustomerTypeRequest());
      getListCustomerType({
        keyword,
        is_active,
        page,
        itemsPerPage,
        create_date_from,
        create_date_to,
        object_type,
        company_id,
        business_id,
      })
        .then((response) => {
          dispatch(getCustomerTypeSuccess(response));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(getCustomerTypeFailure(error));
          reject(error);
        });
    });

//#endregion

export { getCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon, getRsError, getCustomerType };
