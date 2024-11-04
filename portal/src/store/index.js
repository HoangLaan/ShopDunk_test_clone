import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { notifyMiddleware } from 'store/middlewares';
import reducers from 'reducers';
import types from 'actions/types';

const appReducers = combineReducers(reducers);
const combinedReducer = (state, action) => appReducers(action.type === types.LOG_OUT ? undefined : state, action);
const store = createStore(combinedReducer, composeWithDevTools(applyMiddleware(thunk, notifyMiddleware)));

export { store };
