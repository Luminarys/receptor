import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import subscribe from './subscribe';
import filter_subscribe from './filter_subscribe';
import torrents from './torrents';

const root = combineReducers({
  subscribe,
  filter_subscribe,
  torrents,
  router: routerReducer
});

export default root;
