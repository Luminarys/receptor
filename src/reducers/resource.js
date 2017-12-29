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
    switch (action.type) {
      case UPDATE_RESOURCES:
        return {
          ...state,
          ...action.resources
            .filter(r => r.type === type)
            .reduce((s, r) => ({
              ...s,
              [r.id]: hack(state[r.id], { ...state[r.id], ...r })
            }), {})
        };
      case RESOURCES_REMOVED:
        return Object.values(state)
          .filter(r => action.ids.indexOf(r.id) === -1)
          .reduce((s, r) => ({ ...s, [r.id]: r }), {});
      case SOCKET_UPDATE:
        const _state = action.state;
        return _state === SOCKET_STATE.CONNECTING ? {} : state;
    }
    return state;
  };
}
