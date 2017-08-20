import { combineReducers } from 'redux';
import torrents from './torrents';

const root = combineReducers({
  torrents
});

export default root;
