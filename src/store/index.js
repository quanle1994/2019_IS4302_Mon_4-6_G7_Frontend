import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import history from '../history';


const logger = createLogger();


const store = createStore(
  connectRouter(history)(rootReducer),
  composeWithDevTools(applyMiddleware(
    routerMiddleware(history),
    thunk,
    logger,
  )),
);

export default store;
