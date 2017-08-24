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
const store = createStore(
  reducer,
  _compose(applyMiddleware(thunk, routerMiddleware(history))),
);

export const dispatch = action => store.dispatch(action);

export default store;
