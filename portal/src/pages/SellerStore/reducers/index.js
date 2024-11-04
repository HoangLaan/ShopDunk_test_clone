import types from "../actions/constants";

const initialState = {
  shop : {},
}

export default function (state = initialState , {type , payload}){
  switch(type){
      case types.SHOP : {
          return {...state , shop : payload}
      }
      default : return state;
  }
}