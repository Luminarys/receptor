import { UPDATE_RESOURCES } from '../actions/resources';

export default function torrents(state = {}, action) {
  switch (action.type) {
    case UPDATE_RESOURCES:
      return {
        ...state,
        ...action.resources
          .filter(r => r.type === "torrent")
          .reduce((s, r) => ({ ...s, [r.id]: r }), {})
      };
  }
  return state;
}
