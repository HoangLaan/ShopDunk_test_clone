import types from 'pages/Prices/actions/type.js';
import { checkProductType } from '../components/contain/contain';

const INITIAL_STATE = {
    productPrices: {},
    detailPrices: {},
    productType: checkProductType['2'],
};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case types.SET_VALUE_PRODUCT_LIST:
            return {
                ...state,
                productPrices: action.payload,
            };
        case types.SET_VALUE_DETAIL_PRICES:
            return {
                ...state,
                detailPrices: action.payload,
            };
            case types.SET_VALUE_PRODUCT_TYPE:
              return {
                  ...state,
                  productType: action.payload,
              };
        default:
            return state;
    }
}
