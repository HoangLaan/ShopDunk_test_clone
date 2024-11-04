import types from 'pages/VoidIp/actions/types'

const updatePhone = (payload) => ({
    type: types.UPDATE_PHONE_CALL,
    payload: payload,
});

const updateIsUserInCall = (payload) => ({
    type: types.IS_USER_INCALL,
    payload: payload,
});

export {
    updatePhone,
    updateIsUserInCall
}
