import { SUBSCRIBE, UNSUBSCRIBE } from '../actions/subscribe';

export default function subscribe(state = [], action) {
  switch (action.type) {
    case SUBSCRIBE: {
      const { ids, serial } = action;
      return [ ...state, ...ids.map(id => ({ serial, id })) ];
    }
    case UNSUBSCRIBE: {
      const { ids } = action;
      return state.filter(sub => ids.indexOf(sub.id) === -1);
    }
  }
  return state;
}
