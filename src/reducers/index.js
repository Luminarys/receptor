import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import subscribe from './subscribe';
import filter_subscribe from './filter_subscribe';
import torrents from './torrents';
import files from './files';

const root = combineReducers({
  subscribe,
  filter_subscribe,
  torrents,
  files,
  router: routerReducer
});

export default root;
