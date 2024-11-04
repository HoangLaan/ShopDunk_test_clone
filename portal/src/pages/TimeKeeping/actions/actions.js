import { getList } from "../helpers/call-api";
import types from "./types";


const setQuery = (response) => ({ type: types.SET_QUERY, payload: response });

const getTimekeeppingList = () => ({ type: types.GET_LIST_TIMEKEEPING });

const getSuccess = (response) => ({
    type: types.GET_LIST_SUCCESS,
    payload: response,
});

const getFailure = (error) => ({
    type: types.GET_LIST_FAILE,
    payload: error,
});


export const getTimeKeeping = (params) => (dispatch) => {
    new Promise((resolve, reject) => {
        dispatch(getTimekeeppingList())
        dispatch(setQuery(params))

        getList(params).then((_res) => {
           
            dispatch(getSuccess(_res))
            resolve(_res)

        }).catch((error) => {

            dispatch(getFailure(error))
            reject(error)
        })
    })
}


