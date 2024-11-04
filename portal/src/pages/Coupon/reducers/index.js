import types from 'pages/Coupon/actions/type';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  couponList: defaultPaging,
  couponData: undefined,

  getCouponsLoading: false,
  getCouponLoading: false,
  createCouponLoading: false,
  updateCouponLoading: false,
  deleteCouponLoading: false,

  rsErrorList: defaultPaging,
  getRsErrorLoading: false,

  customerTypeList: defaultPaging,
  getCustomerTypeLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_COUPONS_REQUEST:
      return {
        ...state,
        getCouponsLoading: true,
      };
    case types.GET_COUPONS_SUCCESS: {
      return {
        ...state,
        couponList: action.payload,
        getCouponsLoading: false,
      };
    }
    case types.GET_COUPONS_FAILURE:
      return {
        ...state,
        getCouponsLoading: false,
      };
    case types.GET_COUPON_REQUEST:
      return {
        ...state,
        getCouponLoading: true,
      };
    case types.GET_COUPON_SUCCESS: {
      return {
        ...state,
        couponData: action.payload,
        getCouponLoading: false,
      };
    }
    case types.GET_COUPON_FAILURE:
      return {
        ...state,
        getCouponLoading: false,
      };
    case types.CREATE_COUPON_REQUEST:
      return {
        ...state,
        createCouponLoading: true,
      };
    case types.CREATE_COUPON_SUCCESS:
    case types.CREATE_COUPON_FAILURE:
      return {
        ...state,
        createCouponLoading: false,
      };
    case types.UPDATE_COUPON_REQUEST:
      return {
        ...state,
        updateCouponLoading: true,
      };
    case types.UPDATE_COUPON_SUCCESS:
    case types.UPDATE_COUPON_FAILURE:
      return {
        ...state,
        updateCouponLoading: false,
      };
    case types.DELETE_COUPON_REQUEST:
      return {
        ...state,
        deleteCouponLoading: true,
      };
    case types.DELETE_COUPON_SUCCESS:
    case types.DELETE_COUPON_FAILURE:
      return {
        ...state,
        deleteCouponLoading: false,
      };

    case types.GET_RSERROR_REQUEST:
      return {
        ...state,
        getRsErrorLoading: true,
      };
    case types.GET_RSERROR_SUCCESS: {
      return {
        ...state,
        rsErrorList: action.payload,
        getRsErrorLoading: false,
      };
    }
    case types.GET_RSERROR_FAILURE:
      return {
        ...state,
        getRsErrorLoading: false,
      };

    case types.GET_CUSTOMER_TYPE_REQUEST:
      return {
        ...state,
        getCustomerTypeLoading: true,
      };
    case types.GET_CUSTOMER_TYPE_SUCCESS: {
      return {
        ...state,
        customerTypeList: action.payload,
        getCustomerTypeLoading: false,
      };
    }
    case types.GET_CUSTOMER_TYPE_FAILURE:
      return {
        ...state,
        getCustomerTypeLoading: false,
      };

    default:
      return state;
  }
}
