import { UPDATE_RESOURCES, RESOURCES_REMOVED } from '../actions/resources';
import { SOCKET_STATE, SOCKET_UPDATE } from '../actions/socket';

function hack(old, _new) {
  if (old && old.type == "torrent") {
    if (old.progress != 1 && _new.progress == 1) {
      Notification && new Notification("Download complete: " + _new.name);
    }
  }
  return _new;
}

export default function resourceReducer(type) {
  return (state = {}, action) => {
    let ns = {...state};
    switch (action.type) {
      case UPDATE_RESOURCES:
        action.resources
          .filter(r => r.type === type)
          .map(r => ns[r.id] = hack(state[r.id], { ...state[r.id], ...r }));
        return ns;
      case RESOURCES_REMOVED:
        action.ids
          .map(id => delete ns[id]);
        return ns;
      case SOCKET_UPDATE:
        const _state = action.state;
        return _state === SOCKET_STATE.CONNECTING ? {} : state;
    }
    return state;
  };
}
