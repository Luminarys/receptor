import {
  FILTER_SUBSCRIBE,
  FILTER_UNSUBSCRIBE
} from '../actions/filter_subscribe';

export default function filter_subscribe(state = [], action) {
  switch (action.type) {
    case FILTER_SUBSCRIBE: {
      const { serial } = action;
      return [...state, serial];
    }
    case FILTER_UNSUBSCRIBE: {
      const { serial } = action;
      return state.filter(s => s !== serial);
    }
  }
  return state;
}
