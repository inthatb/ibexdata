import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from 'redux';

// import thunk from 'redux-thunk';
import { globalReducer } from './controller';

const configureStore = (initialState) => {
    const middlewares = [];
    const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
    return createStore(globalReducer, initialState, enhancer);
};

const store = configureStore();

export default store;