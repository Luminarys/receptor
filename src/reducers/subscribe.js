import { SUBSCRIBE, UNSUBSCRIBE } from '../actions/subscribe';
import { RESOURCES_REMOVED } from '../actions/resources';

export default function subscribe(state = [], action) {
  switch (action.type) {
    case SUBSCRIBE: {
      const { ids, serial } = action;
      return [ ...state, ...ids.map(id => ({ serial, id })) ];
    }
    case UNSUBSCRIBE: {
      const ids = new Set(action.ids);
      return state.filter(sub => !ids.has(sub.id));
    }
    case RESOURCES_REMOVED: {
      const ids = new Set(action.ids);
      return state.filter(sub => !ids.has(sub.id));
    }
  }
  return state;
}
