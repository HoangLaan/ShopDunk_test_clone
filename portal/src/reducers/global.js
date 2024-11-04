import types from 'actions/types';
import { capitalizedString, typeNotifyOptions } from 'utils/helpers';

const INITIAL_STATE = {
  collapsedSideBar: false,
  confirmMessage: undefined,
  confirmCallback: undefined,
  labelAccept: undefined,
  labelRefuse: undefined,
  // #region notify
  typeNotify: undefined,
  openNotify: false,
  // #endregion
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.TRIGGER_SIDEBAR:
      return {
        ...state,
        collapsedSideBar: !state.collapsedSideBar,
      };
    case types.SHOW_CONFIRM_MODAL:
      return {
        ...state,
        confirmMessage: action.payload.message,
        confirmCallback: action.payload.confirmCallback,
        labelAccept: action.payload?.labelAccept,
        labelRefuse: action.payload?.labelRefuse,
      };
    case types.HIDE_CONFIRM_MODAL:
      return {
        ...state,
        confirmMessage: undefined,
        confirmCallback: undefined,
        labelAccept: undefined,
        labelRefuse: undefined,
      };
    case types.SHOW_NOTIFY:
      return {
        ...state,
        openNotify: true,
        typeNotify: typeNotifyOptions.find((e) => e?.value === action.payload),
      };
    case types.HIDE_NOTIFY: {
      return {
        ...state,
        openNotify: false,
        typeNotify: undefined,
      };
    }
    case types.COUNT_NOTIFY: {
      return {
        ...state,
        count: action.payload,
      };
    }
    default: {
      if (action.type.includes('GET_GLOBAL_OPTIONS')) {
        let fieldType = action.field;
        const fieldLoadingRequest = `get${capitalizedString(fieldType)}Loading`;
        const fieldDataRequest = `${fieldType}Data`;
        const fieldParamsRequest = `${fieldType}Params`;
        if (action.type.includes('REQUEST')) {
          state[fieldLoadingRequest] = true;
          state[fieldDataRequest] = undefined;
          state[fieldParamsRequest] = undefined;
        } else if (action.type.includes('SUCCESS')) {
          state[fieldLoadingRequest] = false;
          state[fieldDataRequest] = action.payload;
          state[fieldParamsRequest] = action.params;
        }
      }
      return state;
    }
  }
}
