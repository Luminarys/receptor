import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import selection from './selection';
import subscribe from './subscribe';
import filter_subscribe from './filter_subscribe';
import server from './server';
import torrents from './torrents';
import files from './files';
import peers from './peers';
import trackers from './trackers';
import pieces from './pieces';

const root = combineReducers({
  selection,
  subscribe,
  filter_subscribe,
  server,
  torrents,
  files,
  peers,
  trackers,
  pieces,
  router: routerReducer
});

export default root;
