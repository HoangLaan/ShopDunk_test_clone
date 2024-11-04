import types from 'pages/TimeKeeping/actions/types';

const INITIAL_STATE = {
    query: {
        page: 1,
        itemsPerPage: 25,
        keyword:''
    },
    loadingList: true,
    dataTimeKeeping: {
        items: [],
        itemsPerPage: 0,
        page: 0,
        totalItems: 0,
        totalPages: 0,
        is_lock_confirm: 0
    },

};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case types.SET_QUERY:
            return {
                ...state,
                query: action.payload
            }

        case types.GET_LIST_SUCCESS:
            return {
                ...state,
                dataTimeKeeping: action.payload,
                loadingList: false

            }
        case types.GET_LIST_FAILE:
            return {
                ...state,
                loadingList: false

            }
        case types.GET_LIST_TIMEKEEPING:
            return {
                ...state,
                loadingList: true
            }
        default:
            return state;
    }
}
