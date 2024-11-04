import types from "./constants";

export default function(value){
    return {
        type : types.SHOP,
        payload : value,
    }
}