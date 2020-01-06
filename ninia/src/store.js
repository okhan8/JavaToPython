import logger from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import reducer from "./reducers/primaryReducer"

export default createStore(
    reducer,
    {}, // needs to be take empty object
    applyMiddleware(logger)
);