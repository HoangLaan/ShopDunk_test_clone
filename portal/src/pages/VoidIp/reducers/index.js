import types from 'pages/VoidIp/actions/types'


const INITIAL_STATE = {
  phone_number: undefined,
  is_user_incall: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_PHONE_CALL:
      return {
        ...state,
        phone_number: action.payload,
      };
    case types.IS_USER_INCALL:
      return {
          ...state,
          is_user_incall: action.payload,
        };
    default:
      return state;
  }
}