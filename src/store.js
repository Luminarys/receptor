import {
  applyMiddleware,
  createStore,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

const _compose =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  || compose;
const store = createStore(
  reducer,
  _compose(applyMiddleware(thunk)),
);

export const dispatch = action => store.dispatch(action);

export default store;
