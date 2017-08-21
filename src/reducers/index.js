import { combineReducers } from 'redux';
import subscribe from './subscribe';
import filter_subscribe from './filter_subscribe';
import torrents from './torrents';

const root = combineReducers({
  subscribe,
  filter_subscribe,
  torrents
});

export default root;
