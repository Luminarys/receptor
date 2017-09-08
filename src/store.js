import {
  applyMiddleware,
  createStore,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, push } from 'react-router-redux'
import reducer from './reducers';

export const history = createHistory();

const _compose =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  || compose;

let store;

export const create = () => {
  store = createStore(
    reducer,
    _compose(applyMiddleware(thunk, routerMiddleware(history))),
  );
};
create();

if (module.hot) {
  // Enable webpack hot module replacement for reducers
  module.hot.accept(
    './reducers',
    () => store.replaceReducer(reducers)
  );
}

export const dispatch = action => store.dispatch(action);
export const getState = () => store.getState();

export default store;
