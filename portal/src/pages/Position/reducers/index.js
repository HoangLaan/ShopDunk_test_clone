import types from 'pages/Position/actions/type';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  positionList: defaultPaging,
  positionData: undefined,
  getPositionsLoading: false,
  getPositionLoading: false,
  createPositionLoading: false,
  updatePositionLoading: false,
  deletePositionLoading: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_POSITIONS_REQUEST:
      return {
        ...state,
        getPositionsLoading: true,
      };
    case types.GET_POSITIONS_SUCCESS: {
      return {
        ...state,
        positionList: action.payload,
        getPositionsLoading: false,
      };
    }
    case types.GET_POSITIONS_FAILURE:
      return {
        ...state,
        getPositionsLoading: false,
      };
    case types.GET_POSITION_REQUEST:
      return {
        ...state,
        getPositionLoading: true,
      };
    case types.GET_POSITION_SUCCESS: {
      return {
        ...state,
        positionData: action.payload,
        getPositionLoading: false,
      };
    }
    case types.GET_POSITION_FAILURE:
      return {
        ...state,
        getPositionLoading: false,
      };
    case types.CREATE_POSITION_REQUEST:
      return {
        ...state,
        createPositionLoading: true,
      };
    case types.CREATE_POSITION_SUCCESS:
    case types.CREATE_POSITION_FAILURE:
      return {
        ...state,
        createPositionLoading: false,
      };
    case types.UPDATE_POSITION_REQUEST:
      return {
        ...state,
        updatePositionLoading: true,
      };
    case types.UPDATE_POSITION_SUCCESS:
    case types.UPDATE_POSITION_FAILURE:
      return {
        ...state,
        updatePositionLoading: false,
      };
    case types.DELETE_POSITION_REQUEST:
      return {
        ...state,
        deletePositionLoading: true,
      };
    case types.DELETE_POSITION_SUCCESS:
    case types.DELETE_POSITION_FAILURE:
      return {
        ...state,
        deletePositionLoading: false,
      };

    default:
      return state;
  }
}
